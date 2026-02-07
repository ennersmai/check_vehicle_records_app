/**
 * Payment System with RevenueCat Integration for Mobile
 * Uses mock purchases for web, RevenueCat for mobile app
 */

interface PurchaseResult {
  success: boolean;
  voucherCodes?: string[];
  error?: string;
  customerInfo?: any;
}

interface VoucherInfo {
  code: string;
  isValid: boolean;
  isRedeemed: boolean;
  createdAt: string;
}

interface CreditPack {
  id: string;
  identifier: string;
  credits: number;
  price: string;
  package?: any;
}

// Product IDs for credit packs
const PRODUCT_IDS: Record<string, number> = {
  'com.cvr.app.credits.1': 1,
  'com.cvr.app.credits.5': 5,
  'com.cvr.app.credits.10': 10,
};

// Access RevenueCat through Capacitor's global plugin registry
const getPurchases = () => {
  if (typeof window !== 'undefined' && (window as any).Capacitor?.Plugins?.Purchases) {
    return (window as any).Capacitor.Plugins.Purchases;
  }
  return null;
};

export const usePayment = () => {
  const supabase = useSupabaseClient();
  const { user } = useAuth();
  const isMobile = ref(false);
  const availablePackages = ref<CreditPack[]>([]);
  const isLoading = ref(false);

  // Check if we're in mobile context - call this from component's onMounted
  const checkMobileContext = () => {
    const Purchases = getPurchases();
    if (Purchases) {
      isMobile.value = true;
    }
  };

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
        // @ts-ignore - Supabase types not fully defined
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
        // @ts-ignore - Supabase types not fully defined
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
      // @ts-ignore - Supabase types not fully defined
      const { data, error } = await supabase
        .from('user_vouchers')
        .select('voucher_code, is_redeemed, created_at')
        .eq('user_id', user.value.id)
        .eq('is_redeemed', false)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // @ts-ignore - data structure from Supabase
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
      
      // @ts-ignore - Supabase types not fully defined
      const { data, error } = await supabase
        .from('user_vouchers')
        .select('voucher_code, is_redeemed, created_at')
        .eq('voucher_code', normalizedCode)
        .single();

      if (error || !data) {
        return null;
      }

      // @ts-ignore - data structure from Supabase
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
      // @ts-ignore - Supabase types not fully defined
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
    generateVoucherCode,
    checkMobileContext
  };
};
