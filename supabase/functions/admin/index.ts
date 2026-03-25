import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Admin UIDs — only these users can access admin functions
const ADMIN_UIDS = new Set([
  'd99958fe-f7cb-439a-a42b-43663e5f39a2', // Ahmed (gearsandmotor@gmail.com)
  '01f951f1-597e-4419-80d2-00753f6cf210', // Mai (ennersmai@gmail.com)
])

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

    // Verify caller is authenticated
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return json({ error: 'Unauthorized' }, 401)
    }

    const authClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    })
    const { data: { user }, error: authError } = await authClient.auth.getUser()
    if (authError || !user) {
      return json({ error: 'Unauthorized' }, 401)
    }

    // Verify caller is admin
    if (!ADMIN_UIDS.has(user.id)) {
      return json({ error: 'Forbidden: admin access only' }, 403)
    }

    // Service role client for admin operations
    const admin = createClient(supabaseUrl, supabaseServiceKey)
    // Anon client for operations that don't work with service role (e.g. password reset)
    const anonClient = createClient(supabaseUrl, supabaseAnonKey)

    const { action, ...params } = await req.json()

    switch (action) {
      case 'list_users':
        return await listUsers(admin, params)
      case 'delete_user':
        return await deleteUser(admin, params)
      case 'send_recovery':
        return await sendRecovery(anonClient, params)
      case 'assign_vouchers':
        return await assignVouchers(admin, params)
      case 'get_kpis':
        return await getKpis(admin)
      case 'get_user_vouchers':
        return await getUserVouchers(admin, params)
      default:
        return json({ error: `Unknown action: ${action}` }, 400)
    }
  } catch (err: any) {
    console.error('Admin function error:', err)
    return json({ error: err.message || 'Internal server error' }, 500)
  }
})

// ── Helpers ──────────────────────────────────────────────────────────────────

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

// ── Actions ─────────────────────────────────────────────────────────────────

async function listUsers(admin: any, params: any) {
  const page = params.page || 1
  const perPage = params.per_page || 50
  const search = params.search || ''

  const { data, error } = await admin.auth.admin.listUsers({
    page,
    perPage,
  })

  if (error) return json({ error: error.message }, 500)

  let users = (data?.users || []).map((u: any) => ({
    id: u.id,
    email: u.email,
    created_at: u.created_at,
    last_sign_in_at: u.last_sign_in_at,
    email_confirmed_at: u.email_confirmed_at,
    phone: u.phone,
    app_metadata: u.app_metadata,
  }))

  // Client-side search filter
  if (search) {
    const q = search.toLowerCase()
    users = users.filter((u: any) =>
      (u.email || '').toLowerCase().includes(q) ||
      (u.id || '').toLowerCase().includes(q)
    )
  }

  return json({
    users,
    total: data?.users?.length || 0,
    page,
    per_page: perPage,
  })
}

async function deleteUser(admin: any, params: any) {
  const { user_id } = params
  if (!user_id) return json({ error: 'user_id required' }, 400)
  if (ADMIN_UIDS.has(user_id)) return json({ error: 'Cannot delete admin user' }, 400)

  const { error } = await admin.auth.admin.deleteUser(user_id)
  if (error) return json({ error: error.message }, 500)

  return json({ success: true })
}

async function sendRecovery(anonClient: any, params: any) {
  const { email } = params
  if (!email) return json({ error: 'email required' }, 400)

  const { error } = await anonClient.auth.resetPasswordForEmail(email, {
    redirectTo: `https://checkcarrecords.co.uk/reset-password`,
  })
  if (error) return json({ error: error.message }, 500)

  return json({ success: true })
}

async function assignVouchers(admin: any, params: any) {
  const { user_id, num_credits } = params
  if (!user_id) return json({ error: 'user_id required' }, 400)
  if (![1, 5, 10].includes(num_credits)) return json({ error: 'num_credits must be 1, 5, or 10' }, 400)

  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const generateCode = (): string => {
    let code = 'CVR-'
    for (let i = 0; i < 12; i++) {
      if (i > 0 && i % 4 === 0) code += '-'
      code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return code
  }

  const codes: string[] = []
  for (let i = 0; i < num_credits; i++) {
    const code = generateCode()
    codes.push(code)
    const { error } = await admin.from('user_vouchers').insert({
      user_id,
      voucher_code: code,
      is_redeemed: false,
      purchased_at: new Date().toISOString(),
      purchase_package: `admin:${num_credits}`,
    })
    if (error) {
      console.error('Failed to insert voucher:', error)
      return json({ error: `Failed to create voucher: ${error.message}` }, 500)
    }
  }

  return json({ success: true, voucher_codes: codes, num_credits })
}

async function getUserVouchers(admin: any, params: any) {
  const { user_id } = params
  if (!user_id) return json({ error: 'user_id required' }, 400)

  const { data, error } = await admin
    .from('user_vouchers')
    .select('id, voucher_code, is_redeemed, created_at, redeemed_at, vehicle_vrm, purchase_package')
    .eq('user_id', user_id)
    .order('created_at', { ascending: false })

  if (error) return json({ error: error.message }, 500)

  return json({ vouchers: data || [] })
}

async function getKpis(admin: any) {
  // Get all vouchers for revenue calculations
  const { data: allVouchers, error: vErr } = await admin
    .from('user_vouchers')
    .select('id, user_id, is_redeemed, created_at, purchase_package, vehicle_vrm')
    .order('created_at', { ascending: false })

  if (vErr) return json({ error: vErr.message }, 500)

  const vouchers = allVouchers || []

  // Count users via auth admin
  let totalUsers = 0
  try {
    const { data: usersData, error: usersErr } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 })
    if (!usersErr) totalUsers = usersData?.users?.length || 0
  } catch (_) { /* non-critical */ }

  // Revenue breakdown by source
  const stripeVouchers = vouchers.filter((v: any) => v.purchase_package?.startsWith('stripe:'))
  const adminVouchers = vouchers.filter((v: any) => v.purchase_package?.startsWith('admin:'))
  const mobileVouchers = vouchers.filter((v: any) => !v.purchase_package || (!v.purchase_package.startsWith('stripe:') && !v.purchase_package.startsWith('admin:')))

  // Group Stripe purchases by session to calculate revenue
  const stripeSessions = new Map<string, number>()
  for (const v of stripeVouchers) {
    const sessionKey = v.purchase_package
    stripeSessions.set(sessionKey, (stripeSessions.get(sessionKey) || 0) + 1)
  }

  const STRIPE_PRICING: Record<number, number> = { 1: 9.99, 5: 24.99, 10: 39.99 }
  let stripeRevenue = 0
  for (const [, count] of stripeSessions) {
    stripeRevenue += STRIPE_PRICING[count] || (count * 9.99)
  }

  // Mobile revenue (RevenueCat) — only count from cutover date to exclude test/legacy data
  const MOBILE_CUTOVER = new Date('2026-03-25T00:00:00.000Z')
  const mobileVouchersFiltered = mobileVouchers.filter((v: any) => new Date(v.created_at) >= MOBILE_CUTOVER)
  const mobileSessions = new Map<string, number>()
  for (const v of mobileVouchersFiltered) {
    const key = v.purchase_package || `individual:${v.id}`
    mobileSessions.set(key, (mobileSessions.get(key) || 0) + 1)
  }

  // Mobile uses different pricing (RevenueCat)
  const MOBILE_PRICING: Record<number, number> = { 1: 9.99, 5: 24.99, 10: 39.99 }
  let mobileRevenue = 0
  for (const [, count] of mobileSessions) {
    mobileRevenue += MOBILE_PRICING[count] || (count * 9.99)
  }

  // Redemption stats
  const totalVouchers = vouchers.length
  const redeemedVouchers = vouchers.filter((v: any) => v.is_redeemed).length
  const availableVouchers = totalVouchers - redeemedVouchers

  // Unique VRMs checked
  const uniqueVrms = new Set(vouchers.filter((v: any) => v.vehicle_vrm).map((v: any) => v.vehicle_vrm)).size

  // Recent activity (last 30 days)
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const recentVouchers = vouchers.filter((v: any) => new Date(v.created_at) > thirtyDaysAgo)
  const recentRedeemed = vouchers.filter((v: any) => v.is_redeemed && v.created_at && new Date(v.created_at) > thirtyDaysAgo)

  // Revenue over time (last 12 months)
  const monthlyRevenue: { month: string; stripe: number; mobile: number }[] = []
  for (let i = 11; i >= 0; i--) {
    const d = new Date()
    d.setMonth(d.getMonth() - i)
    const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const monthLabel = d.toLocaleDateString('en-GB', { month: 'short', year: '2-digit' })

    const monthStripeVouchers = stripeVouchers.filter((v: any) => v.created_at?.startsWith(monthKey))
    const monthMobileVouchers = mobileVouchersFiltered.filter((v: any) => v.created_at?.startsWith(monthKey))

    // Group by session for that month
    const mSessions = new Map<string, number>()
    for (const v of monthStripeVouchers) {
      mSessions.set(v.purchase_package, (mSessions.get(v.purchase_package) || 0) + 1)
    }
    let mStripeRev = 0
    for (const [, count] of mSessions) {
      mStripeRev += STRIPE_PRICING[count] || (count * 9.99)
    }

    const mMobileSessions = new Map<string, number>()
    for (const v of monthMobileVouchers) {
      const key = v.purchase_package || `individual:${v.id}`
      mMobileSessions.set(key, (mMobileSessions.get(key) || 0) + 1)
    }
    let mMobileRev = 0
    for (const [, count] of mMobileSessions) {
      mMobileRev += MOBILE_PRICING[count] || (count * 9.99)
    }

    monthlyRevenue.push({ month: monthLabel, stripe: mStripeRev, mobile: mMobileRev })
  }

  return json({
    total_users: totalUsers,
    total_vouchers: totalVouchers,
    redeemed_vouchers: redeemedVouchers,
    available_vouchers: availableVouchers,
    unique_vrms_checked: uniqueVrms,
    stripe_revenue: Math.round(stripeRevenue * 100) / 100,
    mobile_revenue: Math.round(mobileRevenue * 100) / 100,
    total_revenue: Math.round((stripeRevenue + mobileRevenue) * 100) / 100,
    stripe_purchases: stripeSessions.size,
    mobile_purchases: mobileSessions.size,
    admin_vouchers_given: adminVouchers.length,
    recent_vouchers_30d: recentVouchers.length,
    recent_redeemed_30d: recentRedeemed.length,
    monthly_revenue: monthlyRevenue,
  })
}
