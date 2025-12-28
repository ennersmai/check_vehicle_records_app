# Vehicle Records App - Flow Logic

## Basic Lookup Flow
1. User enters VRM on `/home` (search page)
2. Click "CHECK VEHICLE" → `/confirm-vehicle/[vrm]`
3. Review vehicle details, click "CONFIRM" → `/vehicle/[vrm]` (Basic Check)
4. Basic check shows free data from DVLA API
5. User can click "PREMIUM SEARCH" → `/premium/[vrm]`

## Premium Purchase Flow

### Option 1: Redeem Voucher
1. From `/premium/[vrm]`, click "REDEEM VOUCHER" → `/redeem-voucher`
2. Enter voucher code, click "REDEEM NOW"
3. **Success**: → `/voucher-confirmed` (shows success + "VIEW PREMIUM DETAILS" button)
4. **Failure**: → `/voucher-failed` (shows error message)
5. "VIEW PREMIUM DETAILS" → `/vehicle-premium/[vrm]` (Premium Report)

### Option 2: Purchase Premium Check
1. From `/premium/[vrm]`, click "PURCHASE PREMIUM CHECK" → `/purchase-premium`
2. Select package (1, 3, 5, or 10 checks) with radio buttons
3. Click "CONFIRM & PAY" → `/checkout` (RevenueCat payment)
4. Choose payment method (handled by RevenueCat for app store compliance)
5. Complete payment → `/payment-success`
6. Success page shows "VIEW PREMIUM DETAILS" → `/vehicle-premium/[vrm]`

## Voucher System Logic
- Vouchers are purchased in bundles (1, 3, 5, 10 checks)
- Each voucher = 1 premium lookup credit
- Stored in `user_vouchers` table with:
  - `voucher_code` (unique, auto-generated)
  - `user_id` (who purchased)
  - `is_redeemed` (boolean, default false)
  - `redeemed_at` (timestamp, null until redeemed)
  - `vehicle_vrm` (which vehicle it was used for, null until redeemed)
  - `purchased_at` (timestamp)
  - `expires_at` (timestamp, optional expiry date)
- When user purchases checks, generate N voucher codes and store them
- User can redeem vouchers from "Redeem another voucher" button after payment
- When redeemed, creates entry in `premium_lookups` table
- Unused vouchers remain in user's account for future use
- Display available voucher count in user profile/purchases screen

## Payment Integration
- **RevenueCat** handles all in-app purchases for app store compliance
- No direct Stripe/PayPal integration in mobile app
- Web version can use Stripe (future consideration)
- Packages: 1 check, 3 checks, 5 checks, 10 checks
- Prices: TBD with client

## Data Storage
- **Basic Lookup**: Stored in `vehicle_lookups` table (free DVLA data)
- **Premium Lookup**: Stored in `premium_lookups` table (paid API data)
- Both linked to `user_id` for history tracking

## Full Premium Report Structure
The full premium report (`/vehicle-full-report/[vrm]`) has 5 tabs:

### 1. OVERVIEW Tab
- Vehicle photo (from premium API) with fallback to car silhouette
- Traffic light status indicators (6 circles):
  - Outstanding Finance (green/yellow/red)
  - Previous Accidents (green/yellow/red)
  - Stolen Market (green/yellow/red)
  - Mileage Discrepancy (green/yellow/red)
  - Valid MOT (green/yellow/red)
  - XXX (placeholder - green/yellow/red)

### 2. VEHICLE INFO Tab
- VEHICLE SPECIFICATIONS section with all vehicle data:
  - Registration, VIN Number, Make, Model, Colour
  - Year of Registration, Import/Export, Number of owners
  - Last owner since, Fuel type, Body style, Engine size

### 3. MOT Tab
- MOT Expiry date display
- Two graph placeholders:
  - Miles graph over the years (line chart)
  - MOT advisories graph (bar chart)
- Graphs will need charting library (Chart.js or similar)

### 4. TECHNICAL Tab
- Placeholder message: "Technical data available in premium report"
- Will display all technical specifications from premium API

### 5. BUILD SHEET Tab
- Vehicle Images section with photo placeholder
- Two-column data display with all build sheet info
- Data derived from premium API response
