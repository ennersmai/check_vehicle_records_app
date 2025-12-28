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
      <h1 class="text-3xl font-bold text-primary mb-2">Checkout</h1>
      <p class="text-gray-600 mb-8">Choose your payment method</p>

      <!-- RevenueCat Placeholder Notice -->
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div class="flex gap-3">
          <svg class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div class="text-sm text-blue-800">
            <p class="font-semibold mb-1">RevenueCat Integration</p>
            <p>Payment will be handled by RevenueCat for app store compliance. This screen is a placeholder for development.</p>
          </div>
        </div>
      </div>

      <!-- Payment Methods (Placeholder) -->
      <div class="space-y-4 mb-6">
        <label class="border border-gray-200 rounded-lg p-4 flex items-center gap-4 cursor-pointer">
          <input type="radio" name="payment" value="stripe" class="w-5 h-5" checked />
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-1">
              <svg class="h-6" viewBox="0 0 60 25" fill="none">
                <path d="M59.64 14.28h-8.06c.19 1.93 1.6 2.55 3.2 2.55 1.64 0 2.96-.37 4.05-.95v3.32a8.33 8.33 0 0 1-4.56 1.1c-4.01 0-6.83-2.5-6.83-7.48 0-4.19 2.39-7.52 6.3-7.52 3.92 0 5.96 3.28 5.96 7.5 0 .4-.04 1.26-.06 1.48zm-5.92-5.62c-1.03 0-2.17.73-2.17 2.58h4.25c0-1.85-1.07-2.58-2.08-2.58zM40.95 20.3c-1.44 0-2.32-.6-2.9-1.04l-.02 4.63-4.12.87V5.57h3.76l.08 1.02a4.7 4.7 0 0 1 3.23-1.29c2.9 0 5.62 2.6 5.62 7.4 0 5.23-2.7 7.6-5.65 7.6zM40 8.95c-.95 0-1.54.34-1.97.81l.02 6.12c.4.44.98.78 1.95.78 1.52 0 2.54-1.65 2.54-3.87 0-2.15-1.04-3.84-2.54-3.84zM28.24 5.57h4.13v14.44h-4.13V5.57zm0-4.7L32.37 0v3.36l-4.13.88V.88zm-4.32 9.35v9.79H19.8V5.57h3.7l.12 1.22c1-1.77 3.07-1.41 3.62-1.22v3.79c-.52-.17-2.29-.43-3.32.86zm-8.55 4.72c0 2.43 2.6 1.68 3.12 1.46v3.36c-.55.3-1.54.54-2.89.54a4.15 4.15 0 0 1-4.27-4.24l.01-13.17 4.02-.86v3.54h3.14V9.1h-3.13v5.85zm-4.91.7c0 2.97-2.31 4.66-5.73 4.66a11.2 11.2 0 0 1-4.46-.93v-3.93c1.38.75 3.1 1.31 4.46 1.31.92 0 1.53-.24 1.53-1C6.26 13.77 0 14.51 0 9.95 0 7.04 2.28 5.3 5.62 5.3c1.36 0 2.72.2 4.09.75v3.88a9.23 9.23 0 0 0-4.1-1.06c-.86 0-1.44.25-1.44.93 0 1.85 6.29.97 6.29 5.88z" fill="#635BFF"/>
              </svg>
            </div>
            <p class="text-sm text-gray-600">Pay securely with credit<br />or debit card</p>
          </div>
        </label>

        <label class="border border-gray-200 rounded-lg p-4 flex items-center gap-4 cursor-pointer">
          <input type="radio" name="payment" value="paypal" class="w-5 h-5" />
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-1">
              <svg class="h-6" viewBox="0 0 100 32" fill="none">
                <path d="M12.237 2.8h8.56c3.38 0 5.98.88 7.51 2.55 1.45 1.58 2.05 3.88 1.69 6.48-.04.3-.1.6-.17.91-.98 5.07-4.42 7.64-10.24 7.64h-2.6c-.5 0-.93.36-1.01.85l-1.36 8.63c-.05.3-.3.53-.6.53H9.42c-.46 0-.81-.41-.73-.86l3.86-24.48c.08-.49.5-.85 1-.85z" fill="#003087"/>
                <path d="M35.118 2.8h8.56c3.38 0 5.98.88 7.51 2.55 1.45 1.58 2.05 3.88 1.69 6.48-.04.3-.1.6-.17.91-.98 5.07-4.42 7.64-10.24 7.64h-2.6c-.5 0-.93.36-1.01.85l-1.36 8.63c-.05.3-.3.53-.6.53h-4.57c-.46 0-.81-.41-.73-.86l3.86-24.48c.08-.49.5-.85 1-.85z" fill="#0070E0"/>
                <path d="M67.97 8.05c-1.45-1.67-4.05-2.55-7.51-2.55h-8.56c-.5 0-.92.36-1 .85l-3.86 24.48c-.08.45.27.86.73.86h5.38l1.35-8.56 1.36-8.63c.08-.49.51-.85 1.01-.85h2.6c5.82 0 9.26-2.57 10.24-7.64.07-.31.13-.61.17-.91.36-2.6-.24-4.9-1.69-6.48z" fill="#003087"/>
              </svg>
            </div>
            <p class="text-sm text-gray-600">Use your PayPal balance<br />or linked account</p>
          </div>
        </label>
      </div>

      <div class="border-t border-gray-300 pt-4 mb-6">
        <div class="flex justify-between text-sm mb-2">
          <span class="text-gray-600">Selected Package:</span>
          <span class="font-medium text-gray-900">{{ packageName }}</span>
        </div>
        <div class="flex justify-between text-sm">
          <span class="text-gray-600"></span>
          <span class="font-semibold text-gray-900">{{ price }}</span>
        </div>
      </div>

      <PrimaryButton @click="handlePurchase" :loading="processing" class="w-full">
        PURCHASE
      </PrimaryButton>

      <div class="flex items-center justify-center gap-2 mt-4 text-xs text-gray-500">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        Your payment is encrypted and secure
      </div>
    </div>

    <BottomNav />
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const router = useRouter();
const { mockPurchase } = usePayment();

const packageId = computed(() => route.query.package as string);
const checks = computed(() => route.query.checks as string);
const price = computed(() => route.query.price as string);
const vrm = computed(() => route.query.vrm as string);

const packageName = computed(() => {
  const num = parseInt(checks.value);
  return num === 1 ? 'One time purchase' : `Purchase ${num} checks`;
});

const processing = ref(false);
const error = ref('');

const handlePurchase = async () => {
  processing.value = true;
  error.value = '';
  
  try {
    // Mock payment processing (RevenueCat integration placeholder)
    const numChecks = parseInt(checks.value) || 1;
    const result = await mockPurchase(numChecks, vrm.value);
    
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
