<template>
  <div class="min-h-screen bg-white font-sans">
    <WebNav />

    <section class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <h1 class="text-3xl font-bold text-primary mb-2">Purchases</h1>
      <p class="text-gray-500 mb-10">View your available credits and purchase history.</p>

      <!-- Not Logged In -->
      <div v-if="!user" class="text-center py-20">
        <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <p class="text-gray-500 mb-4">Log in to view your purchases</p>
        <NuxtLink to="/login?redirect=/web/purchases" class="text-primary font-medium hover:underline">Log In</NuxtLink>
      </div>

      <div v-else>
        <!-- Available Credits -->
        <div class="mb-12">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Available Credits</h2>
          <div v-if="availableVouchers.length > 0" class="grid sm:grid-cols-2 gap-4">
            <div
              v-for="voucher in availableVouchers"
              :key="voucher.code"
              class="bg-primary/5 border border-primary/20 rounded-xl p-5 flex items-center justify-between"
            >
              <div>
                <p class="text-xs text-gray-500 mb-1">Voucher Code</p>
                <p class="text-lg font-mono font-semibold text-primary">{{ voucher.code }}</p>
              </div>
              <button
                @click="copyCode(voucher.code)"
                class="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-link transition"
              >
                {{ copiedCode === voucher.code ? 'Copied!' : 'Copy' }}
              </button>
            </div>
          </div>
          <div v-else class="text-center py-10 bg-gray-50 rounded-xl">
            <p class="text-gray-500 mb-2">No available credits</p>
            <NuxtLink to="/pricing" class="text-primary font-medium hover:underline text-sm">Buy Credits</NuxtLink>
          </div>
        </div>

        <!-- Purchase History -->
        <div>
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Purchase History</h2>

          <div v-if="loading" class="flex flex-col items-center justify-center py-12">
            <svg class="animate-spin h-8 w-8 text-primary mb-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p class="text-gray-500 text-sm">Loading...</p>
          </div>

          <div v-else-if="purchaseHistory.length > 0" class="space-y-4">
            <div
              v-for="purchase in purchaseHistory"
              :key="purchase.id"
              class="border border-gray-200 rounded-xl p-6"
            >
              <div class="flex items-start gap-4 mb-4">
                <div class="w-12 h-12 flex items-center justify-center flex-shrink-0 bg-gray-100 rounded-lg">
                  <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-1">
                    <h3 class="font-semibold text-gray-900">{{ purchase.package }}</h3>
                    <span class="text-xs px-2 py-0.5 rounded-full" :class="purchase.source === 'Stripe' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'">{{ purchase.source }}</span>
                  </div>
                  <p class="text-sm text-gray-600">{{ purchase.date }}</p>
                  <p v-if="purchase.amount !== '—'" class="text-sm text-gray-600">Amount: <span class="font-medium text-gray-900">{{ purchase.amount }}</span></p>
                  <p class="text-xs text-gray-400 mt-1">{{ purchase.redeemedCount }} redeemed · {{ purchase.unredeemedCount }} remaining</p>
                </div>
              </div>
              <div class="border-t border-gray-100 pt-3 space-y-2">
                <div
                  v-for="v in purchase.vouchers"
                  :key="v.code"
                  class="flex items-center justify-between text-sm px-3 py-2 rounded-lg"
                  :class="v.isRedeemed ? 'bg-gray-50' : 'bg-primary/5'"
                >
                  <div class="flex items-center gap-2">
                    <span class="font-mono text-xs" :class="v.isRedeemed ? 'text-gray-400' : 'text-primary'">{{ v.code }}</span>
                  </div>
                  <span v-if="v.isRedeemed" class="text-xs text-green-600 font-medium">Redeemed{{ v.redeemedFor ? ` for ${v.redeemedFor}` : '' }}</span>
                  <span v-else class="text-xs text-primary font-medium">Available</span>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="text-center py-16">
            <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p class="text-gray-500">No purchases yet</p>
          </div>
        </div>
      </div>
    </section>

    <WebFooter />
  </div>
</template>

<script setup lang="ts">
const router = useRouter();
const route = useRoute();
const supabase = useSupabaseClient();
const { user } = useAuth();
const { getAvailableVouchers } = usePayment();

const loading = ref(true);
const availableVouchers = ref<any[]>([]);
const purchaseHistory = ref<any[]>([]);
const copiedCode = ref('');

interface VoucherRecord {
  id: string;
  voucher_code: string;
  is_redeemed: boolean;
  created_at: string;
  redeemed_at?: string;
  vehicle_vrm?: string;
  purchase_package?: string;
}

onMounted(async () => {
  if (!user.value) {
    router.push({ path: '/login', query: { redirect: route.fullPath } });
    return;
  }
  await loadVouchers();
});

const loadVouchers = async () => {
  loading.value = true;
  try {
    const vouchers = await getAvailableVouchers();
    availableVouchers.value = vouchers;

    const { data, error } = await (supabase as any)
      .from('user_vouchers')
      .select('id, voucher_code, is_redeemed, created_at, redeemed_at, vehicle_vrm, purchase_package')
      .eq('user_id', user.value!.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    purchaseHistory.value = groupVouchersByPurchase(data || []);
  } catch (err) {
    console.error('Error loading vouchers:', err);
  } finally {
    loading.value = false;
  }
};

const STRIPE_PRICING: Record<number, string> = {
  1: '£9.99',
  5: '£24.99',
  10: '£39.99',
};

const groupVouchersByPurchase = (vouchers: VoucherRecord[]) => {
  const groups = new Map<string, VoucherRecord[]>();

  for (const voucher of vouchers) {
    const key = voucher.purchase_package || `individual:${voucher.id}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(voucher);
  }

  return Array.from(groups.entries()).map(([key, voucherGroup]) => {
    const count = voucherGroup.length;
    const firstVoucher = voucherGroup[0];
    const isStripe = key.startsWith('stripe:');

    let amount = STRIPE_PRICING[count] || `£${(count * 9.99).toFixed(2)}`;
    let source = 'Purchase';
    if (isStripe) {
      source = 'Stripe';
    } else if (!firstVoucher.purchase_package) {
      source = 'Manual';
      amount = '—';
    }

    const redeemedVouchers = voucherGroup.filter(v => v.is_redeemed);
    const unredeemed = voucherGroup.filter(v => !v.is_redeemed);

    return {
      id: key,
      package: `${count} Credit${count > 1 ? 's' : ''}`,
      credits: count,
      amount,
      source,
      date: formatDate(firstVoucher.created_at),
      vouchers: voucherGroup.map(v => ({
        code: v.voucher_code,
        isRedeemed: v.is_redeemed,
        redeemedFor: v.vehicle_vrm || null,
      })),
      redeemedCount: redeemedVouchers.length,
      unredeemedCount: unredeemed.length,
    };
  });
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

const copyCode = async (code: string) => {
  try {
    await navigator.clipboard.writeText(code);
    copiedCode.value = code;
    setTimeout(() => { copiedCode.value = ''; }, 2000);
  } catch (err) {
    console.error('Failed to copy:', err);
  }
};
</script>
