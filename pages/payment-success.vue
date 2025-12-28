<template>
  <div class="min-h-screen bg-white pb-20 flex flex-col">
    <div class="px-10 py-4">
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

      <!-- Show voucher codes if multiple purchased -->
      <div v-if="voucherCodes.length > 1" class="bg-gray-50 rounded-lg p-4 mb-6 w-full max-w-sm">
        <p class="text-sm text-gray-700 mb-2 font-medium">Your voucher codes:</p>
        <div class="space-y-2">
          <div v-for="code in voucherCodes" :key="code" class="bg-white border border-gray-200 rounded px-3 py-2 font-mono text-sm text-center">
            {{ code }}
          </div>
        </div>
        <p class="text-xs text-gray-500 mt-2">Save these codes to redeem for other vehicles</p>
      </div>

      <div class="w-full max-w-sm space-y-4">
        <PrimaryButton @click="viewPremiumDetails" class="w-full">
          VIEW PREMIUM DETAILS
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

const vrm = computed(() => route.query.vrm as string);
const checks = computed(() => route.query.checks as string);
const vouchers = computed(() => route.query.vouchers as string);

const voucherCodes = computed(() => {
  if (!vouchers.value) return [];
  return vouchers.value.split(',').filter(Boolean);
});

const viewPremiumDetails = () => {
  if (vrm.value) {
    router.push(`/vehicle-premium/${vrm.value}`);
  } else {
    router.push('/home');
  }
};

onMounted(() => {
  const numChecks = parseInt(checks.value) || 1;
  console.log(`Payment successful: ${numChecks} premium check(s) activated`);
});
</script>
