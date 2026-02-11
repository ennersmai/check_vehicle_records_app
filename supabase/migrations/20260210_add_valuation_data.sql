-- Add valuation_data column to premium_lookups table
ALTER TABLE premium_lookups ADD COLUMN IF NOT EXISTS valuation_data jsonb DEFAULT NULL;
