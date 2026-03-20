import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.21.0";
import Stripe from "https://esm.sh/stripe@14.14.0?target=deno";

serve(async (req: Request) => {
  // CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    });
  }

  try {
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeKey) {
      return new Response(JSON.stringify({ error: 'Stripe not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    // Verify user auth
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;

    // Auth client to verify the user
    const authClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: authError } = await authClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    // Service role client to insert vouchers
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { session_id } = await req.json();
    if (!session_id) {
      return new Response(JSON.stringify({ error: 'Missing session_id' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    // Verify the Stripe session
    const stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    });

    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status !== 'paid') {
      return new Response(JSON.stringify({ error: 'Payment not completed' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    // Verify the session belongs to this user
    const sessionUserId = session.metadata?.user_id;
    if (sessionUserId !== user.id) {
      return new Response(JSON.stringify({ error: 'Session does not belong to this user' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    const numChecks = parseInt(session.metadata?.num_checks || '1');
    const vrm = session.metadata?.vrm || '';

    // Check if vouchers were already created for this session (idempotent)
    const { data: existingVouchers } = await supabase
      .from('user_vouchers')
      .select('voucher_code')
      .eq('user_id', user.id)
      .eq('purchase_package', `stripe:${session_id}`)
      .limit(1);

    if (existingVouchers && existingVouchers.length > 0) {
      // Vouchers already created — fetch all of them
      const { data: allVouchers } = await supabase
        .from('user_vouchers')
        .select('voucher_code')
        .eq('user_id', user.id)
        .eq('purchase_package', `stripe:${session_id}`)
        .order('created_at', { ascending: true });

      return new Response(JSON.stringify({
        success: true,
        voucher_codes: (allVouchers || []).map((v: any) => v.voucher_code),
        vrm,
        already_created: true,
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    // Generate voucher codes
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const generateCode = (): string => {
      let code = 'CVR-';
      for (let i = 0; i < 12; i++) {
        if (i > 0 && i % 4 === 0) code += '-';
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return code;
    };

    const voucherCodes: string[] = [];
    for (let i = 0; i < numChecks; i++) {
      const code = generateCode();
      voucherCodes.push(code);

      const { error: insertError } = await supabase
        .from('user_vouchers')
        .insert({
          user_id: user.id,
          voucher_code: code,
          is_redeemed: false,
          purchased_at: new Date().toISOString(),
          purchase_package: `stripe:${session_id}`,
        });

      if (insertError) {
        console.error('Failed to insert voucher:', insertError);
      }
    }

    return new Response(JSON.stringify({
      success: true,
      voucher_codes: voucherCodes,
      vrm,
      num_checks: numChecks,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  } catch (err: any) {
    console.error('confirm-stripe-payment error:', err);
    return new Response(JSON.stringify({ error: err.message || 'Failed to confirm payment' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }
});
