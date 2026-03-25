import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@14.14.0?target=deno'

const PRICING: Record<number, { amount: number; label: string }> = {
  1:  { amount: 999,  label: '1 Premium Vehicle Check' },
  5:  { amount: 2499, label: '5 Premium Vehicle Checks' },
  10: { amount: 3999, label: '10 Premium Vehicle Checks' },
};

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
    console.log('Auth header present:', !!authHeader);
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'No authorization header' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    console.log('getUser result:', { userId: user?.id, error: authError?.message });
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Auth failed: ' + (authError?.message || 'no user') }), {
        status: 401,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    const { num_checks, vrm, success_url, cancel_url } = await req.json();

    if (!num_checks || !PRICING[num_checks]) {
      return new Response(JSON.stringify({ error: 'Invalid package selected' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }

    const pricing = PRICING[num_checks];

    const stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: user.email,
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: pricing.label,
              description: `Premium vehicle history check credits for Check Vehicle Records`,
            },
            unit_amount: pricing.amount,
          },
          quantity: 1,
        },
      ],
      metadata: {
        user_id: user.id,
        vrm: vrm || '',
        num_checks: String(num_checks),
      },
      success_url: success_url || `${req.headers.get('origin')}/payment-success?session_id={CHECKOUT_SESSION_ID}&vrm=${vrm || ''}`,
      cancel_url: cancel_url || `${req.headers.get('origin')}/premium/${vrm || ''}`,
    });

    return new Response(JSON.stringify({ url: session.url, session_id: session.id }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  } catch (err: any) {
    console.error('create-checkout-session error:', err);
    return new Response(JSON.stringify({ error: err.message || 'Failed to create checkout session' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }
});
