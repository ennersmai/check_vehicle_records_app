import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface VehicleLookupResponse {
  success: boolean
  source: 'cache' | 'dvla' | 'checkcardetails'
  data?: any
  error?: string
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { vrm } = await req.json()

    if (!vrm) {
      throw new Error('VRM is required')
    }

    const normalizedVrm = vrm.toUpperCase().replace(/\s/g, '')

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get user ID if authenticated
    const authHeader = req.headers.get('Authorization')
    let userId = null
    if (authHeader) {
      const { data: { user } } = await supabaseClient.auth.getUser()
      userId = user?.id
    }

    // STEP 1: Check permanent cache first (cache-first strategy)
    console.log(`Checking cache for VRM: ${normalizedVrm}`)
    const { data: cachedLookup, error: cacheError } = await supabaseClient
      .from('vehicle_lookups')
      .select('*')
      .eq('vrm', normalizedVrm)
      .single()

    if (cachedLookup && !cacheError) {
      console.log(`Cache HIT for VRM: ${normalizedVrm}`)
      
      // Return cached data (prefer DVLA over CheckCarDetails)
      const cachedData = cachedLookup.dvla_data || cachedLookup.checkcardetails_data
      
      return new Response(
        JSON.stringify({
          success: true,
          source: 'cache',
          data: cachedData
        } as VehicleLookupResponse),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`Cache MISS for VRM: ${normalizedVrm}, fetching from APIs...`)

    // STEP 2: Try DVLA API (free/primary source)
    let dvlaData = null
    try {
      console.log('Attempting DVLA API...')
      const dvlaResponse = await fetch(
        'https://driver-vehicle-licensing.api.gov.uk/vehicle-enquiry/v1/vehicles',
        {
          method: 'POST',
          headers: {
            'x-api-key': Deno.env.get('DVLA_API_KEY') ?? '',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ registrationNumber: normalizedVrm }),
        }
      )

      if (dvlaResponse.ok) {
        dvlaData = await dvlaResponse.json()
        console.log('DVLA API SUCCESS')
        
        // Store in permanent cache
        await supabaseClient.from('vehicle_lookups').insert({
          vrm: normalizedVrm,
          user_id: userId,
          dvla_data: dvlaData,
          source: 'dvla',
          lookup_type: 'basic'
        })

        return new Response(
          JSON.stringify({
            success: true,
            source: 'dvla',
            data: dvlaData
          } as VehicleLookupResponse),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      } else {
        const errorText = await dvlaResponse.text()
        console.error(`DVLA API failed with status ${dvlaResponse.status}: ${errorText}`)
      }
    } catch (error) {
      console.error('DVLA API error:', error)
    }

    // STEP 3: Fallback to CheckCarDetails API (paid)
    console.log('Attempting CheckCarDetails API (fallback)...')
    try {
      const checkCarResponse = await fetch(
        `https://api.checkcardetails.co.uk/vehicledata/vehicleregistration?apikey=${Deno.env.get('CHECKCAR_API_KEY')}&vrm=${normalizedVrm}`
      )

      if (checkCarResponse.ok) {
        const checkCarData = await checkCarResponse.json()
        console.log('CheckCarDetails API SUCCESS')
        
        // Store in permanent cache
        await supabaseClient.from('vehicle_lookups').insert({
          vrm: normalizedVrm,
          user_id: userId,
          checkcardetails_data: checkCarData,
          source: 'checkcardetails',
          lookup_type: 'basic'
        })

        return new Response(
          JSON.stringify({
            success: true,
            source: 'checkcardetails',
            data: checkCarData
          } as VehicleLookupResponse),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      } else {
        const errorText = await checkCarResponse.text()
        console.error(`CheckCarDetails API failed with status ${checkCarResponse.status}: ${errorText}`)
      }
    } catch (checkCarError) {
      console.error('CheckCarDetails API error:', checkCarError)
    }

    // STEP 4: All sources failed
    throw new Error('Vehicle not found in any source (DVLA and CheckCarDetails both failed)')

  } catch (error) {
    console.error('Lookup error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      } as VehicleLookupResponse),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
