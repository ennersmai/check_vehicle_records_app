-- Migration: Vehicle Data Schema with Permanent Caching
-- Description: Store all API responses permanently for cache-first lookups

-- Drop existing tables if they exist (for clean migration)
DROP TABLE IF EXISTS premium_lookups CASCADE;
DROP TABLE IF EXISTS vehicle_lookups CASCADE;
DROP TABLE IF EXISTS user_vouchers CASCADE;

-- User Vouchers Table (for premium lookups) - CREATE FIRST
CREATE TABLE user_vouchers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Voucher details
  voucher_code TEXT UNIQUE NOT NULL,
  is_redeemed BOOLEAN DEFAULT FALSE,
  redeemed_at TIMESTAMPTZ,
  vehicle_vrm TEXT, -- VRM it was used for
  
  -- Purchase tracking
  purchased_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ, -- Optional expiry
  purchase_package TEXT, -- '1', '3', '5', '10'
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vehicle Lookups Table (Basic Lookup Cache - Permanent)
CREATE TABLE vehicle_lookups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vrm TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- API Response Data (JSONB for flexibility)
  dvla_data JSONB, -- Raw DVLA API response
  checkcardetails_data JSONB, -- CheckCarDetails vehicleregistration response (fallback)
  
  -- Metadata
  source TEXT NOT NULL CHECK (source IN ('dvla', 'checkcardetails', 'cache')),
  lookup_type TEXT DEFAULT 'basic' CHECK (lookup_type IN ('basic', 'premium')),
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Indexes for fast lookups
  CONSTRAINT vehicle_lookups_vrm_key UNIQUE (vrm)
);

-- Premium Lookups Table (Premium Data - Permanent)
CREATE TABLE premium_lookups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vrm TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Link to basic lookup
  vehicle_lookup_id UUID REFERENCES vehicle_lookups(id) ON DELETE SET NULL,
  
  -- Premium API Response Data (JSONB)
  history_data JSONB, -- carhistorycheck endpoint
  mot_data JSONB, -- mot endpoint with full history
  mileage_data JSONB, -- mileage endpoint with analysis
  image_data JSONB, -- vehicleimage endpoint
  specs_data JSONB, -- vehiclespecs endpoint
  
  -- Voucher tracking
  voucher_id UUID REFERENCES user_vouchers(id) ON DELETE SET NULL,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Indexes
  CONSTRAINT premium_lookups_vrm_user_key UNIQUE (vrm, user_id)
);

-- Indexes for performance
CREATE INDEX idx_vehicle_lookups_vrm ON vehicle_lookups(vrm);
CREATE INDEX idx_vehicle_lookups_user_id ON vehicle_lookups(user_id);
CREATE INDEX idx_vehicle_lookups_created_at ON vehicle_lookups(created_at DESC);

CREATE INDEX idx_premium_lookups_vrm ON premium_lookups(vrm);
CREATE INDEX idx_premium_lookups_user_id ON premium_lookups(user_id);
CREATE INDEX idx_premium_lookups_created_at ON premium_lookups(created_at DESC);

CREATE INDEX idx_user_vouchers_user_id ON user_vouchers(user_id);
CREATE INDEX idx_user_vouchers_code ON user_vouchers(voucher_code);
CREATE INDEX idx_user_vouchers_redeemed ON user_vouchers(is_redeemed) WHERE is_redeemed = FALSE;

-- RLS Policies

-- Vehicle Lookups: Users can read all cached lookups (shared cache), insert their own
ALTER TABLE vehicle_lookups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read cached vehicle lookups"
  ON vehicle_lookups FOR SELECT
  USING (true); -- Shared cache for all users

CREATE POLICY "Users can insert vehicle lookups"
  ON vehicle_lookups FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update their own vehicle lookups"
  ON vehicle_lookups FOR UPDATE
  USING (auth.uid() = user_id OR user_id IS NULL);

-- Premium Lookups: Users can only see their own
ALTER TABLE premium_lookups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own premium lookups"
  ON premium_lookups FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own premium lookups"
  ON premium_lookups FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own premium lookups"
  ON premium_lookups FOR UPDATE
  USING (auth.uid() = user_id);

-- User Vouchers: Users can only see their own
ALTER TABLE user_vouchers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own vouchers"
  ON user_vouchers FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own vouchers"
  ON user_vouchers FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own vouchers"
  ON user_vouchers FOR UPDATE
  USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_vehicle_lookups_updated_at
  BEFORE UPDATE ON vehicle_lookups
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_premium_lookups_updated_at
  BEFORE UPDATE ON premium_lookups
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_vouchers_updated_at
  BEFORE UPDATE ON user_vouchers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Helper function to generate unique voucher codes
CREATE OR REPLACE FUNCTION generate_voucher_code()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; -- Exclude confusing chars
  result TEXT := '';
  i INTEGER;
BEGIN
  FOR i IN 1..12 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Comments for documentation
COMMENT ON TABLE vehicle_lookups IS 'Permanent cache of basic vehicle lookups from DVLA/CheckCarDetails APIs';
COMMENT ON TABLE premium_lookups IS 'Permanent storage of premium vehicle data from CheckCarDetails API';
COMMENT ON TABLE user_vouchers IS 'User vouchers for premium lookups';
COMMENT ON COLUMN vehicle_lookups.dvla_data IS 'Raw JSON response from DVLA API';
COMMENT ON COLUMN vehicle_lookups.checkcardetails_data IS 'Raw JSON response from CheckCarDetails vehicleregistration endpoint (fallback)';
COMMENT ON COLUMN vehicle_lookups.source IS 'Which API provided the data: dvla, checkcardetails, or cache';
COMMENT ON COLUMN premium_lookups.history_data IS 'carhistorycheck endpoint response';
COMMENT ON COLUMN premium_lookups.mot_data IS 'mot endpoint response with full history';
COMMENT ON COLUMN premium_lookups.mileage_data IS 'mileage endpoint response with analysis';
COMMENT ON COLUMN premium_lookups.image_data IS 'vehicleimage endpoint response';
