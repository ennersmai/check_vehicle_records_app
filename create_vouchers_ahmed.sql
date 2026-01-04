-- Create Premium Vouchers for Ahmed Test
-- User: aiaw@hotmail.co.uk
-- User ID: 48430a25-91e3-40d6-b445-afae98b93cf1
-- Generated: 30 Dec 2025

-- Insert 5 premium vouchers for testing
INSERT INTO user_vouchers (
  user_id,
  voucher_code,
  is_redeemed,
  purchased_at,
  purchase_package
) VALUES
  ('01f951f1-597e-4419-80d2-00753f6cf210', 'CVR-TEST-AMAI-0001', false, NOW(), '5'),
  ('01f951f1-597e-4419-80d2-00753f6cf210', 'CVR-TEST-AMAI-0002', false, NOW(), '5'),
  ('01f951f1-597e-4419-80d2-00753f6cf210', 'CVR-TEST-AMAI-0003', false, NOW(), '5'),
  ('01f951f1-597e-4419-80d2-00753f6cf210', 'CVR-TEST-AMAI-0004', false, NOW(), '5'),
  ('01f951f1-597e-4419-80d2-00753f6cf210', 'CVR-TEST-AMAI-0005', false, NOW(), '5');

-- Verify the vouchers were created
SELECT 
  voucher_code,
  is_redeemed,
  purchased_at,
  purchase_package
FROM user_vouchers
WHERE user_id = '01f951f1-597e-4419-80d2-00753f6cf210'
ORDER BY created_at DESC;
