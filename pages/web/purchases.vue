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
              class="border border-gray-200 rounded-xl p-6 flex items-start gap-4"
            >
              <div class="w-12 h-12 flex items-center justify-center flex-shrink-0 bg-gray-100 rounded-lg">
                <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div class="flex-1">
                <h3 class="font-semibold text-gray-900 mb-1">{{ purchase.package }}</h3>
                <p class="text-sm text-gray-600">Purchase date: <span class="font-medium text-gray-900">{{ purchase.date }}</span></p>
                <p class="text-sm text-gray-600">Amount: <span class="font-medium text-gray-900">{{ purchase.amount }}</span></p>
                <p class="text-sm text-gray-600">Voucher: <span class="font-mono text-primary">{{ purchase.voucherCode }}</span></p>
                <p v-if="purchase.isRedeemed" class="text-sm text-green-600 mt-1 font-medium">
                  Redeemed for {{ purchase.redeemedFor || 'vehicle check' }}
                </p>
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
      .select('id, voucher_code, is_redeemed, created_at, redeemed_at, vehicle_vrm')
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

const groupVouchersByPurchase = (vouchers: VoucherRecord[]) => {
  const groups: any[] = [];
  let currentGroup: VoucherRecord[] = [];
  let lastDate: Date | null = null;

  for (const voucher of vouchers) {
    const voucherDate = new Date(voucher.created_at);
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

  if (currentGroup.length > 0) {
    groups.push(createPurchaseRecord(currentGroup));
  }

  return groups;
};

const createPurchaseRecord = (vouchers: VoucherRecord[]) => {
  const count = vouchers.length;
  const firstVoucher = vouchers[0];

  let amount = '£0.99';
  if (count === 5) amount = '£3.99';
  if (count === 10) amount = '£6.99';
  if (count !== 1 && count !== 5 && count !== 10) {
    amount = `£${(count * 0.99).toFixed(2)}`;
  }

  const redeemedVoucher = vouchers.find(v => v.is_redeemed);

  return {
    id: firstVoucher.id,
    package: `${count} Credit${count > 1 ? 's' : ''}`,
    credits: count,
    amount,
    date: formatDate(firstVoucher.created_at),
    voucherCode: firstVoucher.voucher_code,
    isRedeemed: firstVoucher.is_redeemed,
    redeemedFor: redeemedVoucher?.vehicle_vrm || null,
  };
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
