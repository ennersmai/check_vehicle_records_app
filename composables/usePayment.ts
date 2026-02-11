/**
 * Payment System with RevenueCat Integration for Mobile
 * Uses RevenueCat for in-app purchases on mobile, mock for web dev
 * 
 * Flow: User pays via Google Play → RevenueCat confirms → vouchers created in Supabase → 
 *       user redeems voucher for premium vehicle lookup
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
  productId: string;
  rcPackage?: any;
}

// Product IDs mapped to number of credits
const PRODUCT_CREDITS: Record<string, number> = {
  'com.cvr.app.credits.1': 1,
  'com.cvr.app.credits.5': 5,
  'com.cvr.app.credits.10': 10,
};

// DB row type matching user_vouchers table
interface UserVoucherRow {
  id?: string;
  user_id?: string;
  voucher_code: string;
  is_redeemed: boolean;
  redeemed_at?: string | null;
  vehicle_vrm?: string | null;
  purchased_at?: string | null;
  expires_at?: string | null;
  purchase_package?: string | null;
  created_at: string;
  updated_at?: string | null;
}

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

  // Check if we're in mobile context
  const checkMobileContext = () => {
    isMobile.value = !!(typeof window !== 'undefined' && (window as any).Capacitor?.isNativePlatform?.());
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

  // Create vouchers in Supabase after successful payment
  const createVouchers = async (numChecks: number, vrm?: string): Promise<string[]> => {
    const voucherCodes: string[] = [];

    for (let i = 0; i < numChecks; i++) {
      const code = generateVoucherCode();
      voucherCodes.push(code);

      await (supabase as any).from('user_vouchers').insert({
        user_id: user.value.id,
        voucher_code: code,
        is_redeemed: false,
        purchased_at: new Date().toISOString()
      });
    }

    // If VRM is provided and only 1 check, auto-redeem for that vehicle
    if (vrm && numChecks === 1) {
      await (supabase as any)
        .from('user_vouchers')
        .update({ 
          is_redeemed: true, 
          redeemed_at: new Date().toISOString(),
          vehicle_vrm: vrm.toUpperCase().replace(/\s/g, '')
        })
        .eq('voucher_code', voucherCodes[0]);
    }

    return voucherCodes;
  };

  // Fetch available offerings from RevenueCat
  const fetchOfferings = async (): Promise<CreditPack[]> => {
    const Purchases = getPurchases();
    if (!Purchases) return [];

    try {
      isLoading.value = true;
      const offerings = await Purchases.getOfferings();
      
      if (offerings?.current?.availablePackages) {
        const packs: CreditPack[] = offerings.current.availablePackages.map((pkg: any) => {
          const productId = pkg.product?.identifier || pkg.identifier || '';
          const credits = PRODUCT_CREDITS[productId] || 1;
          return {
            id: productId,
            identifier: productId,
            credits,
            price: pkg.product?.priceString || `£${(credits * 0.99).toFixed(2)}`,
            productId,
            rcPackage: pkg
          };
        });
        availablePackages.value = packs;
        return packs;
      }
      return [];
    } catch (err) {
      console.error('Error fetching offerings:', err);
      return [];
    } finally {
      isLoading.value = false;
    }
  };

  // Purchase via RevenueCat (mobile in-app purchase)
  const purchaseWithRevenueCat = async (productId: string, numChecks: number, vrm?: string): Promise<PurchaseResult> => {
    if (!user.value) {
      return { success: false, error: 'Please sign in to purchase' };
    }

    const Purchases = getPurchases();
    if (!Purchases) {
      return { success: false, error: 'In-app purchases not available' };
    }

    try {
      // Login user to RevenueCat with their Supabase user ID
      try {
        await Purchases.logIn({ appUserID: user.value.id });
      } catch (loginErr) {
        console.warn('RevenueCat login warning:', loginErr);
      }

      // Purchase the product (NON_SUBSCRIPTION = consumable in-app purchase)
      const result = await Purchases.purchaseStoreProduct({ 
        product: { 
          identifier: productId, 
          productCategory: 'NON_SUBSCRIPTION' 
        } 
      });
      
      if (result?.customerInfo) {
        // Payment successful - create vouchers
        const voucherCodes = await createVouchers(numChecks, vrm);
        return { success: true, voucherCodes, customerInfo: result.customerInfo };
      }

      return { success: false, error: 'Purchase was not completed' };
    } catch (err: any) {
      // User cancelled
      if (err?.code === 1 || err?.message?.includes('cancel') || err?.userCancelled) {
        return { success: false, error: 'Purchase cancelled' };
      }
      console.error('RevenueCat purchase error:', err);
      return { success: false, error: err.message || 'Payment failed. Please try again.' };
    }
  };

  // Main purchase function - routes to RevenueCat on mobile, mock on web
  const purchase = async (numChecks: number, productId?: string, vrm?: string): Promise<PurchaseResult> => {
    if (!user.value) {
      return { success: false, error: 'Please sign in to purchase' };
    }

    const Purchases = getPurchases();
    
    if (Purchases && productId) {
      // Mobile - use RevenueCat
      return purchaseWithRevenueCat(productId, numChecks, vrm);
    } else {
      // Web fallback - mock purchase (for development/testing)
      return mockPurchase(numChecks, vrm);
    }
  };

  // Mock purchase - simulates payment and creates vouchers (web only)
  const mockPurchase = async (numChecks: number, vrm?: string): Promise<PurchaseResult> => {
    if (!user.value) {
      return { success: false, error: 'Please sign in to purchase' };
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const voucherCodes = await createVouchers(numChecks, vrm);
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
      const { data, error } = await (supabase as any)
        .from('user_vouchers')
        .select('voucher_code, is_redeemed, created_at')
        .eq('user_id', user.value.id)
        .eq('is_redeemed', false)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return ((data || []) as UserVoucherRow[]).map(v => ({
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
      
      const { data, error } = await (supabase as any)
        .from('user_vouchers')
        .select('voucher_code, is_redeemed, created_at')
        .eq('voucher_code', normalizedCode)
        .single();

      if (error || !data) {
        return null;
      }

      const row = data as UserVoucherRow;
      return {
        code: row.voucher_code,
        isValid: !row.is_redeemed,
        isRedeemed: row.is_redeemed,
        createdAt: row.created_at
      };
    } catch (err) {
      return null;
    }
  };

  // Get user's voucher count
  const getVoucherCount = async (): Promise<number> => {
    if (!user.value) return 0;

    try {
      const { count, error } = await (supabase as any)
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
    isMobile,
    isLoading,
    availablePackages,
    purchase,
    mockPurchase,
    fetchOfferings,
    getAvailableVouchers,
    validateVoucher,
    getVoucherCount,
    generateVoucherCode,
    checkMobileContext
  };
};
