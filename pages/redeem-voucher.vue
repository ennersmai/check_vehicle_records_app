<template>
  <div class="min-h-screen bg-white pb-20 flex flex-col">
    <div class="px-10 py-4">
      <button @click="$router.back()" class="flex items-center text-gray-900 hover:text-gray-700">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>
    </div>

    <div class="flex-1 flex flex-col items-center justify-center px-10">
      <svg class="w-24 h-24 text-primary mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
      </svg>

      <h1 class="text-3xl font-bold text-primary mb-8">Redeem<br />Voucher</h1>

      <form @submit.prevent="handleRedeem" class="w-full max-w-sm space-y-6">
        <div class="relative">
          <div class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
          </div>
          <input
            v-model="voucherCode"
            type="text"
            placeholder="Voucher number"
            class="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primary uppercase"
          />
        </div>

        <PrimaryButton type="submit" :loading="loading" class="w-full">
          REDEEM NOW
        </PrimaryButton>

        <div v-if="error" class="text-red-600 text-sm text-center">
          {{ error }}
        </div>
      </form>
    </div>

    <BottomNav />
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const router = useRouter();
const { premiumLookup } = useVehicle();

const vrm = computed(() => route.query.vrm as string);
const voucherCode = ref('');
const loading = ref(false);
const error = ref('');
const loadingMessage = ref('');

const handleRedeem = async () => {
  if (!voucherCode.value) {
    error.value = 'Please enter a voucher code';
    return;
  }

  if (!vrm.value) {
    error.value = 'No vehicle selected. Please search for a vehicle first.';
    return;
  }

  loading.value = true;
  error.value = '';
  loadingMessage.value = 'Validating voucher...';

  try {
    // Call premium lookup with voucher code
    loadingMessage.value = 'Redeeming voucher and fetching premium data...';
    const result = await premiumLookup(vrm.value, voucherCode.value);
    
    if (result.success) {
      // Voucher valid and premium lookup successful
      router.push(`/voucher-confirmed?vrm=${vrm.value}`);
    } else {
      // Check error type
      if (result.error?.includes('Invalid') || result.error?.includes('redeemed')) {
        router.push(`/voucher-failed?error=${encodeURIComponent(result.error)}`);
      } else {
        error.value = result.error || 'Failed to redeem voucher';
      }
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to redeem voucher. Please try again.';
  } finally {
    loading.value = false;
    loadingMessage.value = '';
  }
};
</script>
