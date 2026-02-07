<template>
  <div class="min-h-screen bg-white pb-20">
    <div class="px-10 py-4">
      <button @click="$router.back()" class="flex items-center text-gray-900 hover:text-gray-700">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>
    </div>

    <div class="px-10 mt-8">
      <h1 class="text-3xl font-bold text-primary mb-2">Purchases</h1>
      <p class="text-gray-600 mb-8">View your available credits and purchase history.</p>

      <!-- Available Vouchers Section -->
      <div class="mb-8">
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Available Credits</h2>
        <div v-if="availableVouchers.length > 0" class="space-y-3">
          <div 
            v-for="voucher in availableVouchers" 
            :key="voucher.code"
            class="bg-primary/10 border border-primary/20 rounded-lg p-4"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600">Voucher Code</p>
                <p class="text-lg font-mono font-semibold text-primary">{{ voucher.code }}</p>
              </div>
              <button 
                @click="copyCode(voucher.code)"
                class="px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary/90"
              >
                {{ copiedCode === voucher.code ? 'Copied!' : 'Copy' }}
              </button>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-8 bg-gray-50 rounded-lg">
          <p class="text-gray-500">No available credits</p>
          <NuxtLink to="/buy-credits" class="text-primary hover:underline mt-2 inline-block">
            Buy Credits
          </NuxtLink>
        </div>
      </div>

      <!-- Purchase History Section -->
      <div>
        <h2 class="text-lg font-semibold text-gray-900 mb-4">Purchase History</h2>
        <div v-if="loading" class="text-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p class="text-gray-500 mt-2">Loading...</p>
        </div>
        <div v-else-if="purchaseHistory.length > 0" class="space-y-4">
          <div 
            v-for="purchase in purchaseHistory" 
            :key="purchase.id"
            class="border border-gray-200 rounded-lg p-6"
          >
            <div class="flex items-start gap-4">
              <div class="w-12 h-12 flex items-center justify-center flex-shrink-0 bg-gray-100 rounded-lg">
                <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              
              <div class="flex-1">
                <h3 class="font-semibold text-gray-900 mb-1">{{ purchase.package }}</h3>
                <p class="text-sm text-gray-600 mb-1">Purchase date: <span class="font-medium text-gray-900">{{ purchase.date }}</span></p>
                <p class="text-sm text-gray-600">Amount: <span class="font-medium text-gray-900">{{ purchase.amount }}</span></p>
                <p class="text-sm text-gray-600">Voucher: <span class="font-mono text-primary">{{ purchase.voucherCode }}</span></p>
                <p v-if="purchase.isRedeemed" class="text-sm text-green-600 mt-1">
                  ✓ Redeemed for {{ purchase.redeemedFor || 'vehicle check' }}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-12">
          <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <p class="text-gray-500">No purchases yet</p>
        </div>
      </div>
    </div>

    <BottomNav />
  </div>
</template>

<script setup lang="ts">
const router = useRouter();
const supabase = useSupabaseClient();
const { user } = useAuth();
const { getAvailableVouchers, getVoucherCount } = usePayment();

const loading = ref(true);
const availableVouchers = ref([]);
const purchaseHistory = ref([]);
const copiedCode = ref('');

interface VoucherRecord {
  id: string;
  voucher_code: string;
  is_redeemed: boolean;
  created_at: string;
  redeemed_at?: string;
  redeemed_for_vrm?: string;
}

// Load vouchers on mount
onMounted(async () => {
  if (!user.value) {
    router.push('/login');
    return;
  }

  await loadVouchers();
});

const loadVouchers = async () => {
  loading.value = true;
  
  try {
    // Get available vouchers
    const vouchers = await getAvailableVouchers();
    availableVouchers.value = vouchers;

    // Get all vouchers (including redeemed) for history
    // @ts-ignore - Supabase types
    const { data, error } = await supabase
      .from('user_vouchers')
      .select('id, voucher_code, is_redeemed, created_at, redeemed_at, redeemed_for_vrm')
      .eq('user_id', user.value!.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Group vouchers by purchase date (within 5 seconds = same purchase)
    const grouped = groupVouchersByPurchase(data || []);
    purchaseHistory.value = grouped;
  } catch (err) {
    console.error('Error loading vouchers:', err);
  } finally {
    loading.value = false;
  }
};

// Group vouchers purchased together into packs
const groupVouchersByPurchase = (vouchers: VoucherRecord[]) => {
  const groups: any[] = [];
  let currentGroup: VoucherRecord[] = [];
  let lastDate: Date | null = null;

  for (const voucher of vouchers) {
    const voucherDate = new Date(voucher.created_at);
    
    // If more than 10 seconds from last voucher, start new group
    if (lastDate && (voucherDate.getTime() - lastDate.getTime() > 10000)) {
      if (currentGroup.length > 0) {
        groups.push(createPurchaseRecord(currentGroup));
      }
      currentGroup = [voucher];
    } else {
      currentGroup.push(voucher);
    }
    
    lastDate = voucherDate;
  }

  // Don't forget the last group
  if (currentGroup.length > 0) {
    groups.push(createPurchaseRecord(currentGroup));
  }

  return groups;
};

const createPurchaseRecord = (vouchers: VoucherRecord[]) => {
  const count = vouchers.length;
  const firstVoucher = vouchers[0];
  
  // Calculate approximate price based on credits
  let amount = '£0.99';
  if (count === 5) amount = '£3.99';
  if (count === 10) amount = '£6.99';
  if (count !== 1 && count !== 5 && count !== 10) {
    amount = `£${(count * 0.99).toFixed(2)}`;
  }

  // Check if any are redeemed
  const redeemedVoucher = vouchers.find(v => v.is_redeemed);
  
  return {
    id: firstVoucher.id,
    package: `${count} Credit${count > 1 ? 's' : ''}`,
    credits: count,
    amount,
    date: formatDate(firstVoucher.created_at),
    voucherCode: firstVoucher.voucher_code,
    isRedeemed: firstVoucher.is_redeemed,
    redeemedFor: redeemedVoucher?.redeemed_for_vrm || null,
    method: 'In-App Purchase',
    icon: 'receipt'
  };
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

const copyCode = async (code: string) => {
  try {
    await navigator.clipboard.writeText(code);
    copiedCode.value = code;
    setTimeout(() => {
      copiedCode.value = '';
    }, 2000);
  } catch (err) {
    console.error('Failed to copy:', err);
  }
};
</script>
