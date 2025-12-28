/**
 * Mock Payment System for Testing
 * This simulates payment processing and voucher generation
 * In production, this will integrate with RevenueCat
 */

interface PurchaseResult {
  success: boolean;
  voucherCodes?: string[];
  error?: string;
}

interface VoucherInfo {
  code: string;
  isValid: boolean;
  isRedeemed: boolean;
  createdAt: string;
}

export const usePayment = () => {
  const supabase = useSupabaseClient();
  const { user } = useAuth();

  // Generate a random voucher code
  const generateVoucherCode = (): string => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = 'CVR-';
    for (let i = 0; i < 12; i++) {
      if (i > 0 && i % 4 === 0) code += '-';
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  // Mock purchase - simulates payment and creates vouchers
  const mockPurchase = async (numChecks: number, vrm?: string): Promise<PurchaseResult> => {
    if (!user.value) {
      return { success: false, error: 'Please sign in to purchase' };
    }

    try {
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      const voucherCodes: string[] = [];

      // Create vouchers for each check purchased
      for (let i = 0; i < numChecks; i++) {
        const code = generateVoucherCode();
        voucherCodes.push(code);

        // Store voucher in database
        await supabase.from('user_vouchers').insert({
          user_id: user.value.id,
          voucher_code: code,
          is_redeemed: false,
          created_at: new Date().toISOString()
        });
      }

      // If VRM is provided and only 1 check, auto-redeem for that vehicle
      if (vrm && numChecks === 1) {
        // Mark voucher as redeemed
        await supabase
          .from('user_vouchers')
          .update({ 
            is_redeemed: true, 
            redeemed_at: new Date().toISOString(),
            redeemed_for_vrm: vrm.toUpperCase().replace(/\s/g, '')
          })
          .eq('voucher_code', voucherCodes[0]);
      }

      return { success: true, voucherCodes };
    } catch (err: any) {
      console.error('Purchase error:', err);
      return { success: false, error: 'Payment failed. Please try again.' };
    }
  };

  // Get user's available vouchers
  const getAvailableVouchers = async (): Promise<VoucherInfo[]> => {
    if (!user.value) return [];

    try {
      const { data, error } = await supabase
        .from('user_vouchers')
        .select('voucher_code, is_redeemed, created_at')
        .eq('user_id', user.value.id)
        .eq('is_redeemed', false)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(v => ({
        code: v.voucher_code,
        isValid: true,
        isRedeemed: v.is_redeemed,
        createdAt: v.created_at
      }));
    } catch (err) {
      console.error('Error fetching vouchers:', err);
      return [];
    }
  };

  // Validate a voucher code
  const validateVoucher = async (code: string): Promise<VoucherInfo | null> => {
    try {
      const normalizedCode = code.toUpperCase().trim();
      
      const { data, error } = await supabase
        .from('user_vouchers')
        .select('voucher_code, is_redeemed, created_at')
        .eq('voucher_code', normalizedCode)
        .single();

      if (error || !data) {
        return null;
      }

      return {
        code: data.voucher_code,
        isValid: !data.is_redeemed,
        isRedeemed: data.is_redeemed,
        createdAt: data.created_at
      };
    } catch (err) {
      return null;
    }
  };

  // Get user's voucher count
  const getVoucherCount = async (): Promise<number> => {
    if (!user.value) return 0;

    try {
      const { count, error } = await supabase
        .from('user_vouchers')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.value.id)
        .eq('is_redeemed', false);

      if (error) throw error;
      return count || 0;
    } catch (err) {
      return 0;
    }
  };

  return {
    mockPurchase,
    getAvailableVouchers,
    validateVoucher,
    getVoucherCount,
    generateVoucherCode
  };
};
