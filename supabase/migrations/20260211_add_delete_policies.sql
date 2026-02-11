-- Migration: Add DELETE RLS policies for vehicle_lookups and premium_lookups
-- Description: Allow users to delete their own searches and garage vehicles

-- Allow users to delete their own vehicle lookups (My Searches)
CREATE POLICY "Users can delete their own vehicle lookups"
  ON vehicle_lookups FOR DELETE
  USING (auth.uid() = user_id);

-- Allow users to delete their own premium lookups (My Garage)
CREATE POLICY "Users can delete their own premium lookups"
  ON premium_lookups FOR DELETE
  USING (auth.uid() = user_id);
