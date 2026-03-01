<template>
  <div class="min-h-screen bg-white pb-36 flex flex-col">
    <div class="px-6 pt-8 py-4">
      <button @click="$router.push('/home')" class="flex items-center text-gray-900 hover:text-gray-700">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>
    </div>

    <div class="flex-1 flex flex-col items-center justify-center px-10">
      <div class="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-6">
        <svg class="w-16 h-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h1 class="text-3xl font-bold text-green-600 mb-2">Payment Successful</h1>
      <p class="text-gray-600 text-center mb-4">Your Premium Check has<br />been activated.</p>

      <!-- Premium lookup progress -->
      <div v-if="premiumLoading" class="flex flex-col items-center mb-6">
        <svg class="animate-spin h-8 w-8 text-primary mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="text-sm text-gray-600">Fetching premium report...</p>
      </div>

      <div v-if="premiumError" class="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 w-full max-w-sm text-sm text-red-700 text-center">
        {{ premiumError }}
      </div>

      <!-- Show voucher codes if multiple purchased (remaining unused codes) -->
      <div v-if="remainingVouchers.length > 0" class="bg-gray-50 rounded-lg p-4 mb-6 w-full max-w-sm">
        <p class="text-sm text-gray-700 mb-2 font-medium">Your remaining voucher codes:</p>
        <div class="space-y-2">
          <div v-for="code in remainingVouchers" :key="code" class="bg-white border border-gray-200 rounded px-3 py-2 font-mono text-sm text-center">
            {{ code }}
          </div>
        </div>
        <p class="text-xs text-gray-500 mt-2">Save these codes to redeem for other vehicles</p>
      </div>

      <div class="w-full max-w-sm space-y-4">
        <PrimaryButton @click="viewPremiumDetails" :loading="premiumLoading" class="w-full">
          {{ premiumReady ? 'VIEW PREMIUM DETAILS' : (premiumLoading ? 'LOADING...' : 'VIEW PREMIUM DETAILS') }}
        </PrimaryButton>

        <button 
          @click="$router.push('/redeem-voucher')"
          class="w-full flex items-center justify-center gap-2 text-gray-700 py-3"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Redeem another voucher
        </button>
      </div>
    </div>

    <BottomNav />
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const router = useRouter();
const { premiumLookup } = useVehicle();

const vrm = computed(() => route.query.vrm as string);
const checks = computed(() => route.query.checks as string);
const vouchers = computed(() => route.query.vouchers as string);

const voucherCodes = computed(() => {
  if (!vouchers.value) return [];
  return vouchers.value.split(',').filter(Boolean);
});

const premiumReady = ref(false);
const premiumLoading = ref(false);
const premiumError = ref('');

// For multi-credit purchases, show remaining vouchers (exclude the one used for current VRM)
const remainingVouchers = computed(() => {
  if (!vrm.value || voucherCodes.value.length <= 1) return [];
  return voucherCodes.value.slice(1);
});

const viewPremiumDetails = () => {
  if (vrm.value && premiumReady.value) {
    router.push(`/vehicle-premium/${vrm.value}`);
  } else if (vrm.value) {
    // Premium data not ready yet - try redeem page as fallback
    router.push(`/redeem-voucher?vrm=${vrm.value}`);
  } else {
    router.push('/home');
  }
};

onMounted(async () => {
  const numChecks = parseInt(checks.value) || 1;
  console.log(`Payment successful: ${numChecks} premium check(s) activated`);
  
  // If we have a VRM and voucher codes, auto-trigger the premium lookup
  // This uses the first voucher code for the current vehicle
  if (vrm.value && voucherCodes.value.length > 0) {
    premiumLoading.value = true;
    try {
      console.log(`Auto-triggering premium lookup for ${vrm.value} with voucher ${voucherCodes.value[0]}`);
      const result = await premiumLookup(vrm.value, voucherCodes.value[0]);
      if (result.success) {
        premiumReady.value = true;
        console.log('Premium lookup completed successfully');
      } else {
        premiumError.value = result.error || 'Failed to fetch premium data';
        console.error('Premium lookup failed:', result.error);
      }
    } catch (err: any) {
      premiumError.value = err.message || 'Failed to fetch premium data';
      console.error('Premium lookup error:', err);
    } finally {
      premiumLoading.value = false;
    }
  }
});
</script>
