Project Context: Vehicle Check Mobile App (Phase 1)
1. Project Overview & Scope

We are building Phase 1 of a commercial Vehicle History Check app.

    Platform: Nuxt 3 (Vue 3 + TS) wrapped in Capacitor (iOS/Android).

    Design Source: 17-screen Figma Flow (Auth, Search, Report, Account, Garage, Vouchers).

    Core Logic: A "Smart Aggregator" backend that prioritizes free data (DVLA) but falls back to paid sources to ensure reliability and merges data for the cheapest complete report.

2. The 17-Screen UI Deliverable List (Phase 1)

We are implementing the UI for all, even if logic for some (like payments) is mocked in Phase 1.

A. Authentication Flow

    Splash Screen: Branding/Loader.

    Login: Email/Pass + "Forgot Password" link.

    Create Account: Name, Email, Password.

    Forgot Password: Input email for reset link.

    Change Password: Inside settings.

B. Search & Report Flow
6. Home: Search Input + OCR Camera Button.
7. Confirm Vehicle: Intermediate modal/screen showing just "Is this [Make] [Model]?" before fetching full details.
8. Vehicle Details (Basic): The free report (Tax, MOT, Spec).
9. Vehicle Details (Premium): Tabbed view (Overview, Vehicle Info, MOT History, etc.). Phase 1: UI skeleton only.
10. Build Sheet: Specific view for factory options (Premium feature).

C. Commercial Flow (Phase 2 Prep)
11. Purchase/Checkout: Select bundle (1, 5, 10 checks).
12. Redeem Voucher: Input code screen.
13. Voucher Confirmed: Success state.

D. User Dashboard
14. My Searches: History list.
15. My Garage: Saved vehicles list.
16. Add/Edit Vehicle: Form to manually add or nickname a car in Garage.
17. My Account: Profile overview, links to Settings/Purchases.
3. The "Smart Aggregator" Backend Logic

The backend is not a simple proxy. It is a Decision Engine.

The Data Waterfall (Edge Function Logic):
When lookup_vehicle(vrm) is called:

    Level 1: The Cache (Supabase)

        Query vehicles table.

        Rule: If data exists AND is fresher than X days -> RETURN CACHE. (Cost: £0).

    Level 2: The Primary Source (DVLA VES API)

        If Cache Miss: Call DVLA VES (Free).

        Success: Map fields -> Save to DB -> Return.

        Failure (404/429/500): Do NOT error out to client yet. Proceed to Level 3.

    Level 3: The Fallback/Gap Filler (Paid API)

        Trigger: If DVLA failed OR if DVLA returned incomplete critical data (e.g., missing Make/Model).

        Call Paid API (e.g., CheckCarDetails/HPI).

        Merge Logic: Use this data to fill the Basic Report.

        Note for Phase 1: If Paid API key is not present, return error here. If present, execute fallback.

    Data Merging Strategy (The "Cheapest Truth")

        We save a single normalized record.

        Vehicle.Make = DVLA.Make (Priority) ?? PaidAPI.Make (Fallback).

        Vehicle.BHP = DVLA.BHP (Often null) ?? PaidAPI.BHP (Gap Fill).

4. Database Schema (Supabase)

Designed to hold merged data from multiple sources.

Table: vehicles

    vrm (PK, Text)

    make, model, year, colour, fuel_type (Text/Int - Indexed for search)

    source_dvla_raw (JSONB) - Full dump of DVLA response.

    source_paid_raw (JSONB) - Full dump of Paid API response.

    is_premium_unlocked (Boolean) - Did we pay for full history on this specific VRM?

    mot_expiry (Date)

    tax_status (Text)

    last_updated_at (Timestamp)

Table: profiles

    id (UUID)

    credits (Int) - Currency for Phase 2.

Table: user_activity (Consolidates History & Garage)

    id (UUID)

    user_id (FK)

    vrm (FK)

    type (Enum: 'SEARCH', 'GARAGE')

    nickname (Text, optional for Garage)

    created_at (Timestamp)

5. Technical Constraints & Libraries

    Framework: Nuxt 3 (SSR disabled for Capacitor compatibility -> ssr: false).

    Mobile: Capacitor 6.

    OCR: @capacitor-community/text-recognition (Google ML Kit).

        Requirement: Real-time filtering. Only accept text matching UK Regex ^[A-Z]{2}[0-9]{2}\s?[A-Z]{3}$.

    Styling: Tailwind CSS. Use specific "Card" and "List" components to reuse across the 17 screens.

6. Phase 1 Definition of Done

    Architecture: Nuxt+Capacitor running on simulator.

    DB: Supabase tables created with the "Source Raw" JSONB columns.

    Logic: Edge Function implements the "Cache -> DVLA -> Fallback" flow (even if Fallback is mocked).

    UI: All 17 screens implemented (HTML/Tailwind).

        Active: Auth, Home, Search, History, Garage, Account.

        Static/Placeholder: Premium Results, Vouchers, Purchases (Clickable but no backend action).

    Feature: Camera opens, scans text, populates input.

    7. UI Implementation Strategy (Design System)

Reference the provided screenshots for visual fidelity.

Global Components to Build First:

    AppHeader: Contains the "Back" arrow (left) and Page Title (center).

    BottomNav: The 6-icon navigation bar (Home, Search, Garage, Account, etc.).

    PrimaryButton: The specific blue used in the logo (bg-[#00AEEF] - replace with actual hex from screenshot).

    StatusBadge: The pill-shaped indicators (Green for Valid MOT, Red for Invalid).

    VehicleCard: Reusable component for "My Searches" and "My Garage" lists.

Workflow for AI Generation:

    I will provide the Screen Screenshot.

    I will provide the Component Name (e.g., VehicleDetailsBasic).

    You will generate the Vue component using Tailwind CSS to match the screenshot exactly.