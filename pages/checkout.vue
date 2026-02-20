<template>
  <div class="min-h-screen bg-white pb-36">
    <div class="px-6 pt-8 py-4">
      <button @click="$router.back()" class="flex items-center text-gray-900 hover:text-gray-700">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>
    </div>

    <div class="px-10 mt-8">
      <h1 class="text-3xl font-bold text-primary mb-2">Checkout</h1>
      <p class="text-gray-600 mb-8">Confirm your purchase</p>

      <!-- Order Summary -->
      <div class="bg-gray-50 rounded-lg p-6 mb-6">
        <div class="flex items-center gap-4 mb-4">
          <div class="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 class="font-semibold text-gray-900">{{ packageName }}</h3>
            <p class="text-sm text-gray-600">Premium vehicle check credits</p>
          </div>
        </div>
        <div class="border-t border-gray-200 pt-4">
          <div class="flex justify-between text-sm mb-2">
            <span class="text-gray-600">Package</span>
            <span class="font-medium text-gray-900">{{ packageName }}</span>
          </div>
          <div v-if="vrm" class="flex justify-between text-sm mb-2">
            <span class="text-gray-600">Vehicle</span>
            <span class="font-medium text-gray-900">{{ vrm }}</span>
          </div>
          <div class="flex justify-between text-lg font-semibold mt-3 pt-3 border-t border-gray-200">
            <span class="text-gray-900">Total</span>
            <span class="text-primary">{{ price }}</span>
          </div>
        </div>
      </div>

      <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-sm text-red-700">
        {{ error }}
      </div>

      <PrimaryButton @click="handlePurchase" :loading="processing" class="w-full">
        {{ processing ? 'PROCESSING...' : 'CONFIRM PURCHASE' }}
      </PrimaryButton>

      <div class="flex items-center justify-center gap-2 mt-4 text-xs text-gray-500">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        Secure payment via Google Play
      </div>
    </div>

    <BottomNav />
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const router = useRouter();
const { purchase } = usePayment();

const packageId = computed(() => route.query.package as string);
const checks = computed(() => route.query.checks as string);
const price = computed(() => route.query.price as string);
const vrm = computed(() => route.query.vrm as string);
const productId = computed(() => route.query.productId as string);

const packageName = computed(() => {
  const num = parseInt(checks.value);
  return num === 1 ? '1 Credit' : `${num} Credits`;
});

const processing = ref(false);
const error = ref('');

const handlePurchase = async () => {
  processing.value = true;
  error.value = '';
  
  try {
    const numChecks = parseInt(checks.value) || 1;
    const result = await purchase(numChecks, productId.value, vrm.value);
    
    if (result.success) {
      router.push({
        path: '/payment-success',
        query: {
          checks: checks.value,
          vrm: vrm.value,
          vouchers: result.voucherCodes?.join(',')
        }
      });
    } else {
      error.value = result.error || 'Payment failed. Please try again.';
    }
  } catch (err: any) {
    console.error('Payment failed:', err);
    error.value = 'Payment failed. Please try again.';
  } finally {
    processing.value = false;
  }
};
</script>
