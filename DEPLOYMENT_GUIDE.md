# Deployment Guide - Vercel + Supabase

## ✅ Logic Review Summary

**No critical logic errors found.** Code is production-ready with proper:
- Error handling in all composables
- VRM normalization and validation
- CORS headers in edge functions
- Authentication checks
- Cache-first strategy implementation

**Minor Notes:**
- OCR scanning gracefully falls back on web (expected behavior)
- All composables use Nuxt auto-imports (works correctly at runtime)
- Edge functions use Deno globals (correct for Supabase)

---

## 🚀 Vercel Deployment Guide

### Prerequisites
1. GitHub repository with your code
2. Vercel account (free tier works)
3. Supabase project with edge functions deployed

---

## Step 1: Supabase Setup

### A. Deploy Edge Functions
```bash
# Login to Supabase CLI
npx supabase login

# Link to your project
npx supabase link --project-ref your-project-ref

# Deploy edge functions
npx supabase functions deploy lookup_vehicle
npx supabase functions deploy premium_lookup
```

### B. Set Edge Function Secrets
```bash
# Set API keys as secrets (NOT environment variables)
npx supabase secrets set DVLA_API_KEY=your_dvla_api_key_here
npx supabase secrets set CHECKCAR_API_KEY=your_checkcar_api_key_here
```

### C. Configure CORS for Edge Functions

**Option 1: Update Edge Function CORS (Recommended)**

Your edge functions already have CORS headers, but you need to update them to allow your Vercel domain:

In both `supabase/functions/lookup_vehicle/index.ts` and `supabase/functions/premium_lookup/index.ts`:

```typescript
const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Or specify: 'https://your-app.vercel.app'
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}
```

**Option 2: Add Vercel URL to Supabase (After deployment)**

1. Go to Supabase Dashboard → Settings → API
2. Add your Vercel URL to "Site URL" and "Redirect URLs"
3. Format: `https://your-app.vercel.app`

---

## Step 2: Vercel Deployment

### A. Push to GitHub
```bash
git add .
git commit -m "Initial deployment"
git push origin main
```

### B. Import Project to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: Nuxt.js
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.output` (auto-detected)
   - **Install Command**: `npm install`

### C. Set Environment Variables in Vercel

**Required Environment Variables:**

```bash
# Supabase Configuration (Frontend)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

**How to add them:**
1. In Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add each variable:
   - **Key**: `SUPABASE_URL`
   - **Value**: Your actual Supabase URL (e.g., `https://xxxxx.supabase.co`)
   - **Environments**: Select all (Production, Preview, Development)
3. Add second variable:
   - **Key**: `SUPABASE_ANON_KEY`
   - **Value**: Your actual Supabase anon key
   - **Environments**: Select all (Production, Preview, Development)
4. Click "Save"
5. **Important**: Redeploy your project after adding environment variables

**⚠️ IMPORTANT:** 
- Do NOT add `DVLA_API_KEY` or `CHECKCAR_API_KEY` to Vercel
- These should ONLY be in Supabase edge function secrets
- This keeps your API keys secure on the backend

---

## Step 3: Database Migration

### A. Run Supabase Migrations

Create migration file:
```bash
npx supabase migration new initial_schema
```

Add this to the generated migration file in `supabase/migrations/`:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  notifications_enabled BOOLEAN DEFAULT true,
  email_updates BOOLEAN DEFAULT true,
  dark_mode BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Vehicle lookups cache (permanent)
CREATE TABLE IF NOT EXISTS public.vehicle_lookups (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  vrm TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  source TEXT NOT NULL, -- 'dvla' or 'checkcardetails'
  vehicle_data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(vrm)
);

-- Enable RLS
ALTER TABLE public.vehicle_lookups ENABLE ROW LEVEL SECURITY;

-- Vehicle lookups policies (anyone can read cached data)
CREATE POLICY "Anyone can view vehicle lookups" ON public.vehicle_lookups
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert lookups" ON public.vehicle_lookups
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Index for fast VRM lookups
CREATE INDEX IF NOT EXISTS idx_vehicle_lookups_vrm ON public.vehicle_lookups(vrm);

-- Premium lookups cache (permanent)
CREATE TABLE IF NOT EXISTS public.premium_lookups (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  vrm TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  history_data JSONB,
  mot_data JSONB,
  mileage_data JSONB,
  image_data JSONB,
  specs_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(vrm, user_id)
);

-- Enable RLS
ALTER TABLE public.premium_lookups ENABLE ROW LEVEL SECURITY;

-- Premium lookups policies
CREATE POLICY "Users can view own premium lookups" ON public.premium_lookups
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own premium lookups" ON public.premium_lookups
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Index for fast premium lookups
CREATE INDEX IF NOT EXISTS idx_premium_lookups_vrm_user ON public.premium_lookups(vrm, user_id);

-- User vouchers
CREATE TABLE IF NOT EXISTS public.user_vouchers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  voucher_code TEXT NOT NULL UNIQUE,
  is_redeemed BOOLEAN DEFAULT false,
  redeemed_at TIMESTAMPTZ,
  redeemed_for_vrm TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.user_vouchers ENABLE ROW LEVEL SECURITY;

-- Voucher policies
CREATE POLICY "Users can view own vouchers" ON public.user_vouchers
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own vouchers" ON public.user_vouchers
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own vouchers" ON public.user_vouchers
  FOR UPDATE USING (auth.uid() = user_id);

-- Index for voucher lookups
CREATE INDEX IF NOT EXISTS idx_user_vouchers_code ON public.user_vouchers(voucher_code);
CREATE INDEX IF NOT EXISTS idx_user_vouchers_user_unredeemed ON public.user_vouchers(user_id, is_redeemed);

-- Garage vehicles
CREATE TABLE IF NOT EXISTS public.garage_vehicles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  vrm TEXT NOT NULL,
  make TEXT,
  model TEXT,
  year TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.garage_vehicles ENABLE ROW LEVEL SECURITY;

-- Garage policies
CREATE POLICY "Users can view own garage vehicles" ON public.garage_vehicles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own garage vehicles" ON public.garage_vehicles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own garage vehicles" ON public.garage_vehicles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own garage vehicles" ON public.garage_vehicles
  FOR DELETE USING (auth.uid() = user_id);

-- Index for user's garage
CREATE INDEX IF NOT EXISTS idx_garage_vehicles_user ON public.garage_vehicles(user_id);
```

Push migration to Supabase:
```bash
npx supabase db push
```

---

## Step 4: Post-Deployment Configuration

### A. Update Supabase Auth Settings
1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Set **Site URL**: `https://your-app.vercel.app`
3. Add **Redirect URLs**:
   - `https://your-app.vercel.app/**`
   - `http://localhost:3000/**` (for local dev)

### B. Test Edge Functions
```bash
# Test lookup_vehicle
curl -X POST https://your-project.supabase.co/functions/v1/lookup_vehicle \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"vrm":"AB51CDE"}'

# Test premium_lookup
curl -X POST https://your-project.supabase.co/functions/v1/premium_lookup \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"vrm":"AB51CDE","voucherCode":"CVR-TEST-1234-5678"}'
```

---

## ✅ Deployment Checklist

- [ ] Edge functions deployed to Supabase
- [ ] API keys set as Supabase secrets (NOT env vars)
- [ ] Database schema migrated
- [ ] Code pushed to GitHub
- [ ] Vercel project created and linked to GitHub
- [ ] Environment variables set in Vercel (SUPABASE_URL, SUPABASE_ANON_KEY)
- [ ] Supabase Auth URLs updated with Vercel domain
- [ ] CORS configured in edge functions
- [ ] Test deployment works
- [ ] Test vehicle lookup flow
- [ ] Test premium lookup with voucher

---

## 🔧 Common Issues & Solutions

### Issue: CORS Error
**Solution:** 
1. Verify edge function CORS headers include your Vercel domain
2. Add Vercel URL to Supabase Auth settings
3. Redeploy edge functions after changes

### Issue: "Failed to fetch" from edge functions
**Solution:**
1. Check edge function logs: `npx supabase functions logs lookup_vehicle`
2. Verify API keys are set as secrets (not env vars)
3. Test edge function directly with curl

### Issue: Authentication not working
**Solution:**
1. Verify SUPABASE_URL and SUPABASE_ANON_KEY in Vercel
2. Check Supabase Auth redirect URLs include Vercel domain
3. Clear browser cache and cookies

### Issue: Build fails on Vercel
**Solution:**
1. Check build logs for missing dependencies
2. Verify `package.json` has all dependencies
3. Run `npm install` locally to test
4. Ensure Node version compatibility (use Node 18+)

---

## 📱 Native App Deployment (Optional)

For OCR scanning to work, deploy as native app:

```bash
# iOS
npm run cap:sync
npm run cap:open:ios
# Build in Xcode

# Android
npm run cap:sync
npm run cap:open:android
# Build in Android Studio
```

---

## 🔐 Security Best Practices

✅ **DO:**
- Keep API keys in Supabase edge function secrets
- Use environment variables for Supabase URL/keys
- Enable RLS on all tables
- Use HTTPS only in production

❌ **DON'T:**
- Expose API keys in frontend code
- Commit `.env` file to git
- Disable CORS without understanding implications
- Use same keys for dev and production

---

## 📊 Monitoring

**Supabase Dashboard:**
- Monitor edge function invocations
- Check database query performance
- Review authentication logs

**Vercel Dashboard:**
- Monitor deployment status
- Check build logs
- Review function execution logs

---

## Need Help?

- Supabase Docs: https://supabase.com/docs
- Vercel Docs: https://vercel.com/docs
- Nuxt Docs: https://nuxt.com/docs
