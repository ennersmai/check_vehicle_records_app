import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface VehicleLookupResponse {
  success: boolean
  source: 'cache' | 'dvla' | 'checkcardetails' | 'error'
  data?: any
  imageUrl?: string
  error?: string
  errorCode?: 'NOT_FOUND' | 'API_ERROR' | 'INVALID_VRM' | 'UNKNOWN'
}

// Helper function to fetch vehicle image from CheckCarDetails
async function fetchVehicleImage(vrm: string, apiKey: string): Promise<any> {
  try {
    console.log(`Fetching vehicle image for VRM: ${vrm}`)
    const imageResponse = await fetch(
      `https://api.checkcardetails.co.uk/vehicledata/vehicleimage?apikey=${apiKey}&vrm=${vrm}`
    )
    if (imageResponse.ok) {
      const imageData = await imageResponse.json()
      console.log('Vehicle image fetched successfully')
      return imageData
    } else {
      console.log(`Image fetch failed with status ${imageResponse.status}`)
      return null
    }
  } catch (error) {
    console.error('Error fetching vehicle image:', error)
    return null
  }
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
      
      // Extract image URL if available
      const imageUrl = cachedLookup.image_data?.VehicleImages?.ImageDetailsList?.[0]?.ImageUrl || null
      
      return new Response(
        JSON.stringify({
          success: true,
          source: 'cache',
          data: cachedData,
          imageUrl
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
        
        // Also fetch vehicle image from CheckCarDetails (costs ~5 cents per lookup)
        const apiKey = Deno.env.get('CHECKCAR_API_KEY') ?? ''
        const imageData = await fetchVehicleImage(normalizedVrm, apiKey)
        const imageUrl = imageData?.VehicleImages?.ImageDetailsList?.[0]?.ImageUrl || null
        
        // Store in permanent cache with image
        await supabaseClient.from('vehicle_lookups').insert({
          vrm: normalizedVrm,
          user_id: userId,
          dvla_data: dvlaData,
          image_data: imageData,
          source: 'dvla',
          lookup_type: 'basic'
        })

        return new Response(
          JSON.stringify({
            success: true,
            source: 'dvla',
            data: dvlaData,
            imageUrl
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
        
        // Also fetch vehicle image
        const imageData = await fetchVehicleImage(normalizedVrm, Deno.env.get('CHECKCAR_API_KEY') ?? '')
        const imageUrl = imageData?.VehicleImages?.ImageDetailsList?.[0]?.ImageUrl || null
        
        // Store in permanent cache with image
        await supabaseClient.from('vehicle_lookups').insert({
          vrm: normalizedVrm,
          user_id: userId,
          checkcardetails_data: checkCarData,
          image_data: imageData,
          source: 'checkcardetails',
          lookup_type: 'basic'
        })

        return new Response(
          JSON.stringify({
            success: true,
            source: 'checkcardetails',
            data: checkCarData,
            imageUrl
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

    // STEP 4: All sources failed - vehicle not found
    console.log(`Vehicle not found for VRM: ${normalizedVrm}`)
    return new Response(
      JSON.stringify({
        success: false,
        source: 'error',
        error: 'Vehicle not found. Please check the registration number and try again.',
        errorCode: 'NOT_FOUND'
      } as VehicleLookupResponse),
      { 
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Lookup error:', error)
    
    // Determine error type
    const errorMessage = error.message || 'An unexpected error occurred'
    let errorCode: 'NOT_FOUND' | 'API_ERROR' | 'INVALID_VRM' | 'UNKNOWN' = 'UNKNOWN'
    let statusCode = 400
    
    if (errorMessage.includes('VRM is required') || errorMessage.includes('invalid')) {
      errorCode = 'INVALID_VRM'
      statusCode = 400
    } else if (errorMessage.includes('not found')) {
      errorCode = 'NOT_FOUND'
      statusCode = 404
    } else {
      errorCode = 'API_ERROR'
      statusCode = 500
    }
    
    return new Response(
      JSON.stringify({
        success: false,
        source: 'error',
        error: errorMessage,
        errorCode
      } as VehicleLookupResponse),
      { 
        status: statusCode,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
