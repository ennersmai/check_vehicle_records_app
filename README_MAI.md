# CVR App - Quick Start for Mai 🚀

## What's Been Built So Far ✅

### Infrastructure Complete
- ✅ Nuxt 3 + TypeScript project initialized
- ✅ Tailwind CSS configured (mobile-first)
- ✅ Capacitor 6 ready for iOS/Android
- ✅ Supabase client integration
- ✅ All 5 global components built
- ✅ All 3 composables (useAuth, useVehicle, useUserActivity)
- ✅ TypeScript types defined
- ✅ SQL migration script ready
- ✅ Edge Function (lookup_vehicle) ready to deploy

### What You Need to Do Now 🔧

## Mai Task #1: Create Supabase Project (5 mins)
1. Go to https://supabase.com
2. Click "New Project"
3. Choose a name: `cvr-app` (or whatever you like)
4. Set a strong database password (save it!)
5. Wait for project to initialize (~2 mins)
6. Copy these from Settings → API:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   https://mpjqicuxnbjlpudbzihr.supabase.co
   - **anon/public key** (long string starting with `eyJ...`)

## Mai Task #2: Setup .env File (1 min)
1. In the `cvr` folder, create a file named `.env` (no .example)
2. Paste this and fill in your values:
```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Mai Task #3: Run Database Migration (2 mins)
1. In Supabase Dashboard, go to **SQL Editor** (left sidebar)
2. Click **New Query**
3. Open `supabase/migrations/001_initial_schema.sql` in your code editor
4. Copy ALL the contents
5. Paste into Supabase SQL Editor
6. Click **Run** (bottom right)
7. You should see "Success. No rows returned"

This creates:
- ✅ `vehicles` table
- ✅ `profiles` table  
- ✅ `user_activity` table
- ✅ All security policies (RLS)
- ✅ Auto-create profile on signup

## Mai Task #4: Enable Email Auth (1 min)
1. In Supabase Dashboard, go to **Authentication** → **Providers**
2. Find "Email" and make sure it's **enabled** (should be by default)
3. Done!

## Mai Task #5: Deploy Edge Function (5 mins)
This is the "smart aggregator" backend that handles the Cache → DVLA → Fallback logic.

```bash
# Install Supabase CLI globally (one time only)
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project (get project-ref from dashboard URL)
supabase link --project-ref your-project-ref

# Deploy the lookup_vehicle function
supabase functions deploy lookup_vehicle
```

**Note:** The project-ref is in your Supabase URL: `https://PROJECT-REF.supabase.co`

## Mai Task #6: Add API Keys (OPTIONAL - Phase 2)
Skip this for now unless you have DVLA API access. The app will work without it (using mock data).

```bash
# Only if you have DVLA API key
supabase secrets set DVLA_API_KEY=your-key-here

# Only if you have paid API key
supabase secrets set PAID_API_KEY=your-key-here
```

---

## After You Complete These Tasks, Tell Me! 🎉

Once you've done tasks #1-5, we can:
1. Test the dev server: `npm run dev`
2. Start building the 17 screens
3. Test authentication
4. Test vehicle lookup

---

## Quick Commands Reference

```bash
# Start development server
npm run dev

# Build for production
npm run build

# After first build, initialize Capacitor
npm run cap:init

# Add mobile platforms
npm run cap:add:ios
npm run cap:add:android

# Sync changes to mobile
npm run cap:sync

# Open in Xcode (iOS)
npm run cap:open:ios

# Open in Android Studio
npm run cap:open:android
```

---

## Project Structure Overview

```
cvr/
├── components/          # ✅ 5 global components ready
│   ├── AppHeader.vue
│   ├── BottomNav.vue
│   ├── PrimaryButton.vue
│   ├── StatusBadge.vue
│   └── VehicleCard.vue
├── composables/         # ✅ 3 composables ready
│   ├── useAuth.ts       # Login, signup, password reset
│   ├── useVehicle.ts    # Vehicle lookup
│   └── useUserActivity.ts # History & garage
├── pages/               # 🔜 Next: 17 screens to build
├── supabase/
│   ├── migrations/      # ✅ SQL ready for you to run
│   └── functions/       # ✅ Edge function ready to deploy
├── types/               # ✅ TypeScript interfaces
└── .env                 # 🔧 YOU CREATE THIS
```

---

## What Happens Next?

After you complete the setup tasks, I'll build all 17 screens:

### Authentication (Screens 1-5)
- Splash screen
- Login
- Create account
- Forgot password
- Change password

### Search & Report (Screens 6-10)
- Home with search + OCR camera
- Confirm vehicle
- Basic vehicle details (free report)
- Premium vehicle details (tabbed)
- Build sheet

### Commercial (Screens 11-13)
- Purchase/checkout
- Redeem voucher
- Voucher confirmed

### Dashboard (Screens 14-17)
- My searches (history)
- My garage
- Add/edit vehicle
- My account

---

## Need Help?

Just ping me in the chat! I'm here to help. 

The setup should take ~15 minutes total. Once done, we'll have a fully functional backend and can focus on making the UI beautiful. 🎨

---

## Current Status

✅ **Phase 1: Infrastructure** - COMPLETE  
🔧 **Phase 2: Supabase Setup** - WAITING FOR MAI  
⏳ **Phase 3-9: Screen Implementation** - READY TO START  

Let me know when you're done with the tasks! 🚀
