CVR App - Development Plan
📋 Kanban Task Breakdown
PHASE 1: Project Setup & Infrastructure
Claude Tasks:

✅ Initialize Nuxt 3 project with TypeScript
✅ Configure Tailwind CSS
✅ Setup Capacitor 6
✅ Configure nuxt.config.ts for SSR: false
✅ Create base folder structure
✅ Setup TypeScript types/interfaces
Mai Tasks:

🔧 Mai Task #1: Create Supabase project and get credentials (URL + anon key)
🔧 Mai Task #2: Create .env file with Supabase credentials
PHASE 2: Database Schema & Supabase Setup
Mai Tasks:

🔧 Mai Task #3: Run SQL migrations in Supabase SQL Editor:
vehicles table (vrm, make, model, year, colour, fuel_type, source_dvla_raw, source_paid_raw, is_premium_unlocked, mot_expiry, tax_status, last_updated_at)
profiles table (id, credits)
user_activity table (id, user_id, vrm, type, nickname, created_at)
🔧 Mai Task #4: Enable Row Level Security (RLS) policies
🔧 Mai Task #5: Setup Supabase Auth (email/password provider)
Claude Tasks:

✅ Provide SQL migration scripts for Mai to run
PHASE 3: Core Backend - Edge Functions
Mai Tasks:

🔧 Mai Task #6: Deploy Edge Function lookup_vehicle via Supabase Dashboard
🔧 Mai Task #7: Add DVLA API key to Edge Function secrets (if available)
🔧 Mai Task #8: Add Paid API key to Edge Function secrets (optional for Phase 1)
Claude Tasks:

✅ Write Edge Function: lookup_vehicle (Cache → DVLA → Fallback logic)
✅ Write Edge Function: unlock_premium (placeholder for Phase 2)
✅ Create Supabase client utilities for Nuxt
PHASE 4: Design System & Global Components
Claude Tasks:

✅ AppHeader.vue (Back button + Title)
✅ BottomNav.vue (6-icon navigation)
✅ PrimaryButton.vue (Blue #00AEEF)
✅ StatusBadge.vue (Green/Red pills)
✅ VehicleCard.vue (Reusable for searches/garage)
✅ Setup Pinia stores (auth, vehicle, user)
✅ Create composables for API calls
PHASE 5-9: Screen Implementation (17 screens total)
Claude Tasks: All UI implementation with Tailwind, mobile-first

PHASE 10: OCR & Capacitor Build
Claude Tasks:

✅ Integrate capacitor-community/text-recognition
✅ UK VRM regex validation
✅ Camera permission handling
Mai Tasks:

🔧 Mai Task #9: Test on iOS simulator
🔧 Mai Task #10: Test on Android emulator