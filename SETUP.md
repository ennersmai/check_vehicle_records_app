# CVR App - Setup Instructions

## Phase 1: Project Setup ✅

The Nuxt 3 + Capacitor project structure is now initialized with:
- ✅ Nuxt 3 with TypeScript
- ✅ Tailwind CSS configured
- ✅ Capacitor 6 ready
- ✅ Supabase client utilities
- ✅ Global components (AppHeader, BottomNav, PrimaryButton, StatusBadge, VehicleCard)
- ✅ Composables (useAuth, useVehicle, useUserActivity)
- ✅ TypeScript types defined

## Mai's Tasks - Action Required 🔧

### Task #1: Create Supabase Project
1. Go to https://supabase.com
2. Create a new project
3. Note down:
   - Project URL
   - Anon/Public Key

### Task #2: Setup Environment Variables
1. Copy `.env.example` to `.env`
2. Fill in your Supabase credentials:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
```

### Task #3: Run Database Migrations
1. Go to Supabase Dashboard → SQL Editor
2. Copy the contents of `supabase/migrations/001_initial_schema.sql`
3. Paste and run the migration
4. This creates:
   - `vehicles` table
   - `profiles` table
   - `user_activity` table
   - RLS policies
   - Indexes

### Task #4: Enable Supabase Auth
1. Go to Authentication → Providers
2. Enable "Email" provider
3. Configure email templates (optional for Phase 1)

### Task #5: Deploy Edge Function
1. Install Supabase CLI: `npm install -g supabase`
2. Login: `supabase login`
3. Link project: `supabase link --project-ref your-project-ref`
4. Deploy function:
```bash
supabase functions deploy lookup_vehicle
```

### Task #6: Add API Keys to Edge Function Secrets (Optional for Phase 1)
```bash
# DVLA API Key (if you have one)
supabase secrets set DVLA_API_KEY=your-dvla-key

# Paid API Key (optional, for fallback)
supabase secrets set PAID_API_KEY=your-paid-api-key
```

## Development Commands

```bash
# Install dependencies (if not already done)
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Generate static site
npm run generate

# Initialize Capacitor (after first build)
npx cap init

# Add iOS platform
npx cap add ios

# Add Android platform
npx cap add android

# Sync web assets to native platforms
npx cap sync

# Open in Xcode (iOS)
npx cap open ios

# Open in Android Studio
npx cap open android
```

## Project Structure

```
cvr/
├── assets/
│   └── css/
│       └── main.css          # Tailwind CSS
├── components/
│   ├── AppHeader.vue         # Global header component
│   ├── BottomNav.vue         # Bottom navigation
│   ├── PrimaryButton.vue     # Primary button component
│   ├── StatusBadge.vue       # Status badge (MOT, Tax)
│   └── VehicleCard.vue       # Reusable vehicle card
├── composables/
│   ├── useAuth.ts            # Authentication logic
│   ├── useVehicle.ts         # Vehicle lookup logic
│   └── useUserActivity.ts    # Search history & garage
├── pages/                    # To be created (17 screens)
├── supabase/
│   ├── migrations/
│   │   └── 001_initial_schema.sql
│   └── functions/
│       └── lookup_vehicle/
│           └── index.ts      # Smart aggregator edge function
├── types/
│   └── index.ts              # TypeScript interfaces
├── utils/
│   └── supabase.ts           # Supabase client
├── .env.example              # Environment template
├── capacitor.config.ts       # Capacitor configuration
├── nuxt.config.ts            # Nuxt configuration
├── tailwind.config.js        # Tailwind configuration
└── package.json
```

## Next Steps (After Mai Completes Tasks)

1. **Authentication Screens** (Screens 1-5)
   - Splash
   - Login
   - Create Account
   - Forgot Password
   - Change Password

2. **Search & Report Flow** (Screens 6-10)
   - Home with search
   - Confirm vehicle
   - Basic vehicle details
   - Premium vehicle details
   - Build sheet

3. **Commercial Flow** (Screens 11-13)
   - Purchase/Checkout
   - Redeem voucher
   - Voucher confirmed

4. **User Dashboard** (Screens 14-17)
   - My searches
   - My garage
   - Add/Edit vehicle
   - My account

5. **OCR Camera Integration**
   - UK VRM regex validation
   - Camera permissions

## Notes

- All TypeScript/CSS lint warnings are expected and will resolve at build time
- The Edge Function uses Deno runtime (runs on Supabase)
- Mobile-first design approach throughout
- SSR is disabled for Capacitor compatibility
