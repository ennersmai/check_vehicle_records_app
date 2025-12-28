import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PremiumLookupResponse {
  success: boolean
  data?: {
    basic: any
    history: any
    mot: any
    mileage: any
    images: any
    specs: any
  }
  error?: string
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { vrm, voucherCode } = await req.json()

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

    // Get authenticated user
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    
    if (authError || !user) {
      throw new Error('Authentication required for premium lookups')
    }

    // STEP 1: Check if premium lookup already exists (permanent cache)
    console.log(`Checking premium cache for VRM: ${normalizedVrm}`)
    const { data: cachedPremium, error: cacheError } = await supabaseClient
      .from('premium_lookups')
      .select('*')
      .eq('vrm', normalizedVrm)
      .eq('user_id', user.id)
      .single()

    if (cachedPremium && !cacheError) {
      console.log(`Premium cache HIT for VRM: ${normalizedVrm}`)
      
      return new Response(
        JSON.stringify({
          success: true,
          data: {
            basic: cachedPremium.vehicle_lookup_id, // Will be populated by UI
            history: cachedPremium.history_data,
            mot: cachedPremium.mot_data,
            mileage: cachedPremium.mileage_data,
            images: cachedPremium.image_data,
            specs: cachedPremium.specs_data
          }
        } as PremiumLookupResponse),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log(`Premium cache MISS for VRM: ${normalizedVrm}`)

    // STEP 2: Validate voucher if provided
    let voucherId = null
    if (voucherCode) {
      const { data: voucher, error: voucherError } = await supabaseClient
        .from('user_vouchers')
        .select('*')
        .eq('voucher_code', voucherCode.toUpperCase())
        .eq('user_id', user.id)
        .eq('is_redeemed', false)
        .single()

      if (voucherError || !voucher) {
        throw new Error('Invalid or already redeemed voucher code')
      }

      voucherId = voucher.id
    }

    // STEP 3: Get basic lookup data (should already be cached)
    const { data: basicLookup } = await supabaseClient
      .from('vehicle_lookups')
      .select('*')
      .eq('vrm', normalizedVrm)
      .single()

    // STEP 4: Fetch premium data from CheckCarDetails API in parallel
    console.log('Fetching premium data from CheckCarDetails API...')
    
    const apiKey = Deno.env.get('CHECKCAR_API_KEY') ?? ''
    const baseUrl = 'https://api.checkcardetails.co.uk/vehicledata'

    const [historyRes, motRes, mileageRes, imageRes, specsRes] = await Promise.allSettled([
      fetch(`${baseUrl}/carhistorycheck?apikey=${apiKey}&vrm=${normalizedVrm}`),
      fetch(`${baseUrl}/mot?apikey=${apiKey}&vrm=${normalizedVrm}`),
      fetch(`${baseUrl}/mileage?apikey=${apiKey}&vrm=${normalizedVrm}`),
      fetch(`${baseUrl}/vehicleimage?apikey=${apiKey}&vrm=${normalizedVrm}`),
      fetch(`${baseUrl}/vehiclespecs?apikey=${apiKey}&vrm=${normalizedVrm}`)
    ])

    // Parse responses
    const historyData = historyRes.status === 'fulfilled' && historyRes.value.ok 
      ? await historyRes.value.json() 
      : null
    
    const motData = motRes.status === 'fulfilled' && motRes.value.ok 
      ? await motRes.value.json() 
      : null
    
    const mileageData = mileageRes.status === 'fulfilled' && mileageRes.value.ok 
      ? await mileageRes.value.json() 
      : null
    
    const imageData = imageRes.status === 'fulfilled' && imageRes.value.ok 
      ? await imageRes.value.json() 
      : null
    
    const specsData = specsRes.status === 'fulfilled' && specsRes.value.ok 
      ? await specsRes.value.json() 
      : null

    console.log('Premium data fetched successfully')

    // STEP 5: Store premium lookup permanently
    const { data: premiumLookup, error: insertError } = await supabaseClient
      .from('premium_lookups')
      .insert({
        vrm: normalizedVrm,
        user_id: user.id,
        vehicle_lookup_id: basicLookup?.id || null,
        history_data: historyData,
        mot_data: motData,
        mileage_data: mileageData,
        image_data: imageData,
        specs_data: specsData,
        voucher_id: voucherId
      })
      .select()
      .single()

    if (insertError) {
      console.error('Error storing premium lookup:', insertError)
      throw new Error('Failed to store premium lookup')
    }

    // STEP 6: Mark voucher as redeemed if used
    if (voucherId) {
      await supabaseClient
        .from('user_vouchers')
        .update({
          is_redeemed: true,
          redeemed_at: new Date().toISOString(),
          vehicle_vrm: normalizedVrm
        })
        .eq('id', voucherId)
    }

    // STEP 7: Return merged data
    return new Response(
      JSON.stringify({
        success: true,
        data: {
          basic: basicLookup?.dvla_data || basicLookup?.checkcardetails_data,
          history: historyData,
          mot: motData,
          mileage: mileageData,
          images: imageData,
          specs: specsData
        }
      } as PremiumLookupResponse),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Premium lookup error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      } as PremiumLookupResponse),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
