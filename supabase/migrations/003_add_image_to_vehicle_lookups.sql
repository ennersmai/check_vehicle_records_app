-- Migration: Add image_data to vehicle_lookups
-- Description: Store vehicle image from CheckCarDetails API for basic lookups

-- Add image_data column to vehicle_lookups table
ALTER TABLE vehicle_lookups 
ADD COLUMN IF NOT EXISTS image_data JSONB;

-- Comment for documentation
COMMENT ON COLUMN vehicle_lookups.image_data IS 'vehicleimage endpoint response from CheckCarDetails API';
