# API Integration Strategy

## Overview
Two-tier API approach for cost optimization and reliability:
1. **DVLA API** (Free/Cheaper) - Primary source for basic lookups
2. **CheckCarDetails API** (Paid) - Fallback + Premium data source

## Data Flow

### Basic Lookup Flow
```
User enters VRM → Edge Function → Try DVLA API
                                   ↓ Success
                              Store in cache DB → Display to user
                                   ↓ Fail/Throttle
                              Try CheckCarDetails (vehicleregistration) → Display + Cache
```

### Premium Lookup Flow
```
User clicks Premium → Edge Function → Fetch cached DVLA data
                                    ↓
                              Call CheckCarDetails (carhistorycheck, mot, mileage, vehicleimage)
                                    ↓
                              Merge DVLA + Premium data → Display full report
                                    ↓
                              Store in premium_lookups table
```

## API Endpoints

### DVLA API (Primary - Basic Lookup)
- **Endpoint**: `POST https://driver-vehicle-licensing.api.gov.uk/vehicle-enquiry/v1/vehicles`
- **Auth**: `x-api-key` header
- **Request**: `{ "registrationNumber": "ABC1234" }`
- **Rate Limits**: 429 on throttle
- **Cost**: Free/Cheaper

### CheckCarDetails API (Fallback + Premium)
- **Base**: `https://api.checkcardetails.co.uk`
- **Auth**: `apikey` query param
- **Endpoints**:
  - `/vehicledata/vehicleregistration` - Basic data (fallback)
  - `/vehicledata/carhistorycheck` - Full history (premium)
  - `/vehicledata/mot` - MOT history with defects (premium)
  - `/vehicledata/mileage` - Mileage history (premium)
  - `/vehicledata/vehicleimage` - Vehicle photos (premium)

## Data Mapping

### Fields Available from DVLA (Use First - Free)
✅ **Basic Vehicle Info**:
- `registrationNumber`
- `make`
- `colour`
- `fuelType`
- `yearOfManufacture`
- `engineCapacity` (cc)
- `co2Emissions`
- `monthOfFirstRegistration`
- `dateOfLastV5CIssued`

✅ **Tax & MOT**:
- `taxStatus` (Taxed/Untaxed/SORN)
- `taxDueDate`
- `motStatus` (Valid/Not Valid/No details)
- `motExpiryDate`

✅ **Technical**:
- `typeApproval`
- `wheelplan`
- `revenueWeight`
- `euroStatus`
- `markedForExport`
- `realDrivingEmissions`
- `automatedVehicle`

### Fields ONLY from CheckCarDetails (Premium)
❌ **Vehicle History**:
- VIN number
- Number of previous keepers
- Keeper change history
- Plate changes
- Colour changes
- V5C certificate history
- Outstanding finance
- Stolen/scrapped status
- Written off records
- Import/Export status

❌ **MOT Details**:
- Full MOT history with test numbers
- Pass/Fail counts
- Defects and advisories
- Mileage readings per test
- Test dates and locations

❌ **Mileage Analysis**:
- Mileage discrepancies
- Average mileage calculation
- Mileage issues detection

❌ **Technical Specs**:
- BHP/Power (kW)
- Torque
- 0-60 acceleration
- Top speed
- Fuel consumption (urban/extra-urban/combined)
- Transmission details
- Number of gears
- Body dimensions
- Weight details
- Seating capacity

❌ **Premium Features**:
- Vehicle images/photos
- Valuation data
- Insurance group
- Build sheet details

### Model Field (Special Case)
- DVLA: Returns basic model string
- CheckCarDetails: Returns detailed model variant
- **Strategy**: Use DVLA for basic, upgrade to CheckCarDetails for premium

## Database Schema Updates Needed

### vehicle_lookups table (Basic Lookup Cache)
```sql
- vrm (primary)
- user_id
- source (dvla/checkcardetails)
- dvla_data (jsonb) -- Raw DVLA response
- fallback_data (jsonb) -- CheckCarDetails if DVLA failed
- looked_up_at
- cached_until
```

### premium_lookups table (Premium Data)
```sql
- id
- vrm
- user_id
- dvla_data (jsonb) -- Cached from basic lookup
- history_data (jsonb) -- carhistorycheck endpoint
- mot_data (jsonb) -- mot endpoint
- mileage_data (jsonb) -- mileage endpoint
- image_data (jsonb) -- vehicleimage endpoint
- looked_up_at
- voucher_id (reference to redeemed voucher)
```

## Edge Functions

### 1. lookup_vehicle (Basic Lookup)
**Purpose**: Get basic vehicle data for free display

**Logic**:
1. Check cache (vehicle_lookups table) - if < 24hrs old, return cached
2. Try DVLA API first
   - Success: Store in cache, return data
   - Fail (404/429/500): Try CheckCarDetails vehicleregistration
3. If CheckCarDetails succeeds: Store as fallback, return data
4. If both fail: Return error

**Response Format**:
```json
{
  "success": true,
  "source": "dvla" | "checkcardetails" | "cache",
  "data": {
    "registrationNumber": "ABC1234",
    "make": "FORD",
    "model": "FOCUS",
    "colour": "BLUE",
    "fuelType": "PETROL",
    "yearOfManufacture": 2017,
    "engineCapacity": 1600,
    "taxStatus": "Taxed",
    "taxDueDate": "2025-12-31",
    "motStatus": "Valid",
    "motExpiryDate": "2025-06-30",
    // ... all DVLA fields
  }
}
```

### 2. premium_lookup (Premium Lookup)
**Purpose**: Get comprehensive vehicle history and data

**Logic**:
1. Check if user has voucher/credits
2. Fetch cached DVLA data from vehicle_lookups
3. Call CheckCarDetails endpoints in parallel:
   - carhistorycheck (full vehicle history)
   - mot (MOT history with defects)
   - mileage (mileage history)
   - vehicleimage (vehicle photos)
4. Merge all data sources
5. Store in premium_lookups table
6. Mark voucher as redeemed
7. Return merged data

**Response Format**:
```json
{
  "success": true,
  "data": {
    "basic": { /* DVLA data */ },
    "history": { /* carhistorycheck data */ },
    "mot": { /* MOT history */ },
    "mileage": { /* Mileage analysis */ },
    "images": { /* Vehicle photos */ }
  }
}
```

## Traffic Light Indicators Logic

Based on premium data, calculate status for each indicator:

1. **Outstanding Finance**: 
   - Green: No finance
   - Red: Has outstanding finance

2. **Previous Accidents**:
   - Green: No recorded accidents
   - Yellow: Minor advisories
   - Red: Major defects/failures

3. **Stolen Market**:
   - Green: Not stolen/scrapped
   - Red: Marked as stolen or scrapped

4. **Mileage Discrepancy**:
   - Green: No issues
   - Yellow: Average mileage (normal)
   - Red: Mileage discrepancies detected

5. **Valid MOT**:
   - Green: Valid MOT
   - Yellow: Expiring soon
   - Red: Expired or no MOT

6. **Import/Export**:
   - Green: UK vehicle, not exported
   - Yellow: Imported
   - Red: Marked for export

## Error Handling

### DVLA API Errors
- **400**: Invalid VRM format → Return error to user
- **404**: Vehicle not found → Try CheckCarDetails fallback
- **429**: Rate limited → Try CheckCarDetails fallback
- **500/503**: Server error → Try CheckCarDetails fallback

### CheckCarDetails API Errors
- **404**: Vehicle not found → Return "No data available"
- **403**: API key invalid or limit reached → Log error, notify admin
- **400**: Invalid request → Return error to user

## Caching Strategy

### Basic Lookup Cache
- **Duration**: 24 hours
- **Reason**: DVLA data changes infrequently (tax/MOT status)
- **Invalidation**: User can force refresh (costs 1 lookup)

### Premium Lookup Cache
- **Duration**: Permanent (historical data)
- **Reason**: Premium lookups are paid, data is historical
- **Storage**: Full JSON responses for all endpoints

## Cost Optimization

1. **Always try DVLA first** for basic lookups (free)
2. **Cache aggressively** (24hr for basic, permanent for premium)
3. **Only call CheckCarDetails when**:
   - DVLA fails/throttles
   - User purchases premium lookup
4. **Batch premium calls** (parallel requests for mot/mileage/images)

## Implementation Priority

1. ✅ Create database migrations
2. ✅ Implement lookup_vehicle edge function
3. ✅ Implement premium_lookup edge function
4. ✅ Update UI to consume real data
5. ✅ Add error handling and user feedback
6. ✅ Test with real API keys
