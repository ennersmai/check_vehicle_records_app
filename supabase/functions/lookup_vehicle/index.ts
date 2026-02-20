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

// Helper to encode array buffer to base64 (handles large files)
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  const chunkSize = 8192
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize)
    binary += String.fromCharCode.apply(null, Array.from(chunk))
  }
  return btoa(binary)
}

// Helper function to fetch vehicle image from CheckCarDetails and download as base64
async function fetchVehicleImage(vrm: string, apiKey: string): Promise<any> {
  try {
    console.log(`Fetching vehicle image metadata for VRM: ${vrm}`)
    const imageResponse = await fetch(
      `https://api.checkcardetails.co.uk/vehicledata/vehicleimage?apikey=${apiKey}&vrm=${vrm}`
    )
    if (imageResponse.ok) {
      const imageData = await imageResponse.json()
      console.log('Vehicle image metadata fetched successfully:', JSON.stringify(imageData).substring(0, 200))
      
      // Download the actual image and convert to base64
      const imageUrl = imageData?.VehicleImages?.ImageDetailsList?.[0]?.ImageUrl
      if (imageUrl) {
        try {
          // Try fetching with API key in case it's needed for auth
          const imageUrlWithKey = imageUrl.includes('?') 
            ? `${imageUrl}&apikey=${apiKey}` 
            : `${imageUrl}?apikey=${apiKey}`
          console.log('Downloading image with API key...')
          const imgResponse = await fetch(imageUrlWithKey)
          console.log('Image download response status:', imgResponse.status)
          
          if (imgResponse.ok) {
            const arrayBuffer = await imgResponse.arrayBuffer()
            console.log('Image size:', arrayBuffer.byteLength, 'bytes')
            
            const base64 = arrayBufferToBase64(arrayBuffer)
            const contentType = imgResponse.headers.get('content-type') || 'image/jpeg'
            const dataUrl = `data:${contentType};base64,${base64}`
            
            // Store both original URL (for reference) and base64 data
            imageData.base64Image = dataUrl
            console.log('Image converted to base64 successfully, length:', dataUrl.length)
          } else {
            console.error('Image download failed with status:', imgResponse.status)
            const errorText = await imgResponse.text()
            console.error('Image download error:', errorText.substring(0, 200))
          }
        } catch (imgError) {
          console.error('Error downloading image:', imgError)
        }
      } else {
        console.log('No image URL found in response')
      }
      
      return imageData
    } else {
      console.log(`Image metadata fetch failed with status ${imageResponse.status}`)
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

    // Initialize Supabase client for auth (with user's token)
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )
    
    // Service role client for database writes (bypasses RLS)
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get user ID if authenticated
    const authHeader = req.headers.get('Authorization')
    let userId = null
    if (authHeader) {
      const { data: { user } } = await supabaseClient.auth.getUser()
      userId = user?.id
      console.log('Authenticated user ID:', userId)
    } else {
      console.log('No auth header - anonymous lookup')
    }

    // STEP 1: Check permanent cache first (cache-first strategy)
    // Use limit(1) instead of single() because multiple users can have records for same VRM
    console.log(`Checking cache for VRM: ${normalizedVrm}`)
    const { data: cachedLookups, error: cacheError } = await supabaseAdmin
      .from('vehicle_lookups')
      .select('*')
      .eq('vrm', normalizedVrm)
      .limit(1)
    
    const cachedLookup = cachedLookups?.[0] || null

    if (cachedLookup && !cacheError) {
      console.log(`Cache HIT for VRM: ${normalizedVrm}`)
      
      // Return cached data (prefer DVLA over CheckCarDetails)
      const cachedData = cachedLookup.dvla_data || cachedLookup.checkcardetails_data
      
      // Extract image - prefer base64 (permanent) over URL (expires)
      const imageUrl = cachedLookup.image_data?.base64Image || 
                       cachedLookup.image_data?.VehicleImages?.ImageDetailsList?.[0]?.ImageUrl || null
      
      // If user is authenticated, ensure they have their own lookup record
      if (userId) {
        // Check if this user already has a lookup for this VRM
        const { data: existingUserLookup } = await supabaseAdmin
          .from('vehicle_lookups')
          .select('id')
          .eq('vrm', normalizedVrm)
          .eq('user_id', userId)
          .single()
        
        // If not, create one for this user (copy from cache)
        if (!existingUserLookup) {
          console.log(`Creating user-specific lookup record for user ${userId}`)
          const { error: insertError } = await supabaseAdmin.from('vehicle_lookups').insert({
            vrm: normalizedVrm,
            user_id: userId,
            dvla_data: cachedLookup.dvla_data,
            checkcardetails_data: cachedLookup.checkcardetails_data,
            image_data: cachedLookup.image_data,
            source: cachedLookup.source,
            lookup_type: 'basic'
          })
          
          if (insertError) {
            console.error('Error creating user lookup record:', insertError)
          } else {
            console.log('User lookup record created successfully')
          }
        } else {
          console.log('User already has lookup record for this VRM')
        }
      }
      
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
        
        // Store in permanent cache with image (use admin client to bypass RLS)
        const { error: insertError } = await supabaseAdmin.from('vehicle_lookups').insert({
          vrm: normalizedVrm,
          user_id: userId,
          dvla_data: dvlaData,
          image_data: imageData,
          source: 'dvla',
          lookup_type: 'basic'
        })
        if (insertError) console.error('Insert error (DVLA):', insertError)

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
        
        // Store in permanent cache with image (use admin client to bypass RLS)
        const { error: insertError2 } = await supabaseAdmin.from('vehicle_lookups').insert({
          vrm: normalizedVrm,
          user_id: userId,
          checkcardetails_data: checkCarData,
          image_data: imageData,
          source: 'checkcardetails',
          lookup_type: 'basic'
        })
        if (insertError2) console.error('Insert error (CheckCar):', insertError2)

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
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Lookup error:', error)
    
    // Determine error type
    const errorMessage = error.message || 'An unexpected error occurred'
    let errorCode: 'NOT_FOUND' | 'API_ERROR' | 'INVALID_VRM' | 'UNKNOWN' = 'UNKNOWN'
    
    if (errorMessage.includes('VRM is required') || errorMessage.includes('invalid')) {
      errorCode = 'INVALID_VRM'
    } else if (errorMessage.includes('not found')) {
      errorCode = 'NOT_FOUND'
    } else {
      errorCode = 'API_ERROR'
    }
    
    return new Response(
      JSON.stringify({
        success: false,
        source: 'error',
        error: errorMessage,
        errorCode
      } as VehicleLookupResponse),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
