<template>
  <div class="min-h-screen bg-white" :class="{ 'pb-36': !isWeb }">
    <!-- Mobile layout -->
    <template v-if="!isWeb">
      <div class="px-6 pt-8 py-4">
        <button @click="$router.back()" class="flex items-center text-gray-900 hover:text-gray-700">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
      </div>

      <div class="px-10 mt-8">
        <h1 class="text-3xl font-bold text-primary mb-8">Premium check</h1>

        <div class="space-y-4 mb-8">
          <button 
            @click="$router.push('/redeem-voucher?vrm=' + vrm)"
            class="w-full bg-primary text-white px-6 py-4 rounded-lg font-semibold flex items-center justify-center gap-3 active:opacity-90"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
            REDEEM VOUCHER
          </button>

          <button 
            @click="$router.push('/purchase-premium?vrm=' + vrm)"
            class="w-full bg-primary text-white px-6 py-4 rounded-lg font-semibold flex items-center justify-center gap-3 active:opacity-90"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            PURCHASE PREMIUM CHECK
          </button>
        </div>

        <!-- Vehicle Image -->
        <div v-if="vehicleData" class="mb-6">
          <div class="bg-gray-200 rounded-lg aspect-video flex items-center justify-center overflow-hidden" @click="vehicleData?.imageUrl && !imageError && openFullscreen(vehicleData.imageUrl)">
            <img v-if="vehicleData?.imageUrl && !imageError" :src="vehicleData.imageUrl" @error="imageError = true" alt="Vehicle" class="w-full h-full object-contain cursor-pointer" />
            <CarSilhouette v-else :bodyStyle="vehicleData.bodyStyle" class="w-32 h-32 text-gray-400" />
          </div>
        </div>

        <!-- Basic Vehicle Info -->
        <div v-if="vehicleData" class="bg-white border border-gray-200 rounded-lg p-4">
          <div class="space-y-2">
            <div class="flex justify-between py-2 border-b border-gray-100">
              <span class="text-gray-600 text-sm">Make</span>
              <span class="font-medium text-gray-900 text-sm">{{ vehicleData.make || 'N/A' }}</span>
            </div>
            <div v-if="vehicleData.model" class="flex justify-between py-2 border-b border-gray-100">
              <span class="text-gray-600 text-sm">Model</span>
              <span class="font-medium text-gray-900 text-sm">{{ vehicleData.model }}</span>
            </div>
            <div class="flex justify-between py-2 border-b border-gray-100">
              <span class="text-gray-600 text-sm">Colour</span>
              <span class="font-medium text-gray-900 text-sm">{{ vehicleData.colour || 'N/A' }}</span>
            </div>
            <div class="flex justify-between py-2 border-b border-gray-100">
              <span class="text-gray-600 text-sm">Year</span>
              <span class="font-medium text-gray-900 text-sm">{{ vehicleData.yearOfManufacture || 'N/A' }}</span>
            </div>
            <div class="flex justify-between py-2 border-b border-gray-100">
              <span class="text-gray-600 text-sm">Fuel type</span>
              <span class="font-medium text-gray-900 text-sm">{{ vehicleData.fuelType || 'N/A' }}</span>
            </div>
            <div v-if="vehicleData.bodyStyle" class="flex justify-between py-2 border-b border-gray-100">
              <span class="text-gray-600 text-sm">Body style</span>
              <span class="font-medium text-gray-900 text-sm">{{ vehicleData.bodyStyle }}</span>
            </div>
            <div class="flex justify-between py-2">
              <span class="text-gray-600 text-sm">Engine size</span>
              <span class="font-medium text-gray-900 text-sm">{{ vehicleData.engineCapacity || 'N/A' }}</span>
            </div>
          </div>
        </div>

        <button @click="$router.push('/home')" class="w-full text-gray-600 text-sm mt-6">
          Enter another registration number
        </button>
      </div>

      <BottomNav />

      <FullscreenImageModal 
        :imageUrl="fullscreenImage" 
        :scale="imageScale" 
        :translateX="imageTranslateX" 
        :translateY="imageTranslateY"
        @close="closeFullscreen"
        @touchstart="handleTouchStart"
        @touchmove="handleTouchMove"
        @touchend="handleTouchEnd"
      />
    </template>

    <!-- Web layout -->
    <template v-else>
      <WebNav />

      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Upgrade to Premium</h1>
        <p class="text-gray-500 mb-8">Get the full history for <span class="font-semibold text-primary">{{ vrm }}</span></p>

        <div class="grid lg:grid-cols-3 gap-8">
          <!-- Left: Vehicle Card -->
          <div class="lg:col-span-1">
            <div class="bg-white border border-gray-200 rounded-xl overflow-hidden sticky top-24">
              <div class="bg-gray-100 aspect-video flex items-center justify-center" @click="vehicleData?.imageUrl && !imageError && openFullscreen(vehicleData.imageUrl)">
                <img v-if="vehicleData?.imageUrl && !imageError" :src="vehicleData.imageUrl" @error="imageError = true" alt="Vehicle" class="w-full h-full object-contain cursor-pointer" />
                <CarSilhouette v-else-if="vehicleData" :bodyStyle="vehicleData.bodyStyle" class="w-20 h-20 text-gray-300" />
              </div>
              <div v-if="vehicleData" class="p-4 space-y-2">
                <div class="bg-yellow-300 px-3 py-1 rounded font-bold text-sm inline-block mb-2">{{ vrm }}</div>
                <div class="flex justify-between text-sm"><span class="text-gray-500">Make</span><span class="font-medium">{{ vehicleData.make || 'N/A' }}</span></div>
                <div v-if="vehicleData.model" class="flex justify-between text-sm"><span class="text-gray-500">Model</span><span class="font-medium">{{ vehicleData.model }}</span></div>
                <div class="flex justify-between text-sm"><span class="text-gray-500">Year</span><span class="font-medium">{{ vehicleData.yearOfManufacture || 'N/A' }}</span></div>
                <div class="flex justify-between text-sm"><span class="text-gray-500">Colour</span><span class="font-medium">{{ vehicleData.colour || 'N/A' }}</span></div>
                <div class="flex justify-between text-sm"><span class="text-gray-500">Fuel</span><span class="font-medium">{{ vehicleData.fuelType || 'N/A' }}</span></div>
              </div>
            </div>
          </div>

          <!-- Right: Package Selection + Checkout -->
          <div class="lg:col-span-2">
            <!-- Package cards -->
            <div class="space-y-4 mb-8">
              <div
                v-for="pkg in webPackages"
                :key="pkg.id"
                @click="selectedPackage = pkg.id"
                class="border-2 rounded-xl p-5 cursor-pointer transition-all"
                :class="selectedPackage === pkg.id ? 'border-primary bg-primary/5 shadow-md' : 'border-gray-200 hover:border-gray-300'"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-4">
                    <div class="w-10 h-10 rounded-full flex items-center justify-center" :class="selectedPackage === pkg.id ? 'bg-primary text-white' : 'bg-gray-100 text-gray-500'">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 class="font-semibold text-gray-900">{{ pkg.name }}</h3>
                      <p class="text-sm text-gray-500">{{ pkg.description }}</p>
                    </div>
                  </div>
                  <div class="text-right">
                    <span class="text-xl font-bold text-gray-900">{{ pkg.price }}</span>
                    <p v-if="pkg.perCheck" class="text-xs text-gray-400">{{ pkg.perCheck }}/check</p>
                  </div>
                </div>
                <div v-if="pkg.savings" class="mt-3">
                  <span class="bg-green-100 text-green-700 text-xs font-medium px-2.5 py-1 rounded-full">{{ pkg.savings }}</span>
                </div>
              </div>
            </div>

            <!-- What's included -->
            <div class="bg-gray-50 rounded-xl p-6 mb-8">
              <h3 class="font-semibold text-gray-900 mb-4">What's included in every Premium Check:</h3>
              <div class="grid sm:grid-cols-2 gap-3">
                <div v-for="item in premiumFeatures" :key="item" class="flex items-start gap-2">
                  <svg class="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span class="text-sm text-gray-600">{{ item }}</span>
                </div>
              </div>
            </div>

            <!-- Stripe checkout error -->
            <div v-if="checkoutError" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 text-sm text-red-700">
              {{ checkoutError }}
            </div>

            <!-- Pay button -->
            <button
              @click="handleStripeCheckout"
              :disabled="!selectedPackage || checkoutLoading"
              class="w-full bg-primary hover:bg-primary-link text-white font-bold py-4 px-6 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg"
            >
              <svg v-if="checkoutLoading" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              {{ checkoutLoading ? 'Redirecting to checkout...' : `PAY ${selectedPackagePrice}` }}
            </button>

            <div class="flex items-center justify-center gap-2 mt-3 text-xs text-gray-400">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Secure payment powered by Stripe
            </div>

            <!-- Divider -->
            <div class="flex items-center my-8">
              <div class="flex-1 border-t border-gray-200"></div>
              <span class="px-4 text-sm text-gray-400">or</span>
              <div class="flex-1 border-t border-gray-200"></div>
            </div>

            <!-- Redeem voucher -->
            <div class="border border-gray-200 rounded-xl p-6">
              <h3 class="font-semibold text-gray-900 mb-2">Have a voucher code?</h3>
              <p class="text-sm text-gray-500 mb-4">Redeem your existing voucher to unlock this premium report.</p>
              <div class="flex gap-3">
                <input
                  v-model="voucherCode"
                  type="text"
                  placeholder="Enter voucher code"
                  class="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-primary uppercase text-sm"
                  @keydown.enter="handleRedeemVoucher"
                />
                <button
                  @click="handleRedeemVoucher"
                  :disabled="!voucherCode || redeemLoading"
                  class="px-6 py-2.5 bg-gray-900 text-white rounded-lg font-medium text-sm hover:bg-gray-800 transition disabled:opacity-50"
                >
                  {{ redeemLoading ? 'Redeeming...' : 'Redeem' }}
                </button>
              </div>
              <div v-if="redeemError" class="mt-3 text-red-600 text-sm">{{ redeemError }}</div>
            </div>

            <!-- Back link -->
            <button @click="$router.push('/landing')" class="w-full text-gray-500 text-sm mt-6 hover:text-gray-700 transition">
              Search another vehicle
            </button>
          </div>
        </div>
      </div>

      <WebImageViewer :imageUrl="fullscreenImage" @close="closeFullscreen" />
      <WebFooter />
    </template>
  </div>
</template>

<script setup lang="ts">
import { mapDvlaData, mapCheckCarDetailsBasic } from '~/utils/vehicleDataMapper';
import { useFullscreenImage } from '~/composables/useFullscreenImage';

const route = useRoute();
const router = useRouter();
const { getCachedVehicle, premiumLookup } = useVehicle();
const { user } = useAuth();
const supabase = useSupabaseClient();
const { 
  fullscreenImage, 
  imageScale, 
  imageTranslateX, 
  imageTranslateY, 
  openFullscreen, 
  closeFullscreen, 
  handleTouchStart, 
  handleTouchMove, 
  handleTouchEnd 
} = useFullscreenImage();

const isWeb = ref(false);
const vrm = computed(() => route.params.vrm as string);
const vehicleData = ref<any>(null);
const imageError = ref(false);
const loading = ref(true);

// Web-specific state
const selectedPackage = ref<number | null>(null);
const checkoutLoading = ref(false);
const checkoutError = ref('');
const voucherCode = ref('');
const redeemLoading = ref(false);
const redeemError = ref('');

const webPackages = [
  { id: 1, name: '1 Premium Check', description: 'Single vehicle history report', price: '\u00A39.99', checks: 1, perCheck: '', savings: '' },
  { id: 5, name: '5 Premium Checks', description: 'For comparing multiple vehicles', price: '\u00A324.99', checks: 5, perCheck: '\u00A35.00', savings: 'Save 50%' },
  { id: 10, name: '10 Premium Checks', description: 'Best value for dealers & enthusiasts', price: '\u00A339.99', checks: 10, perCheck: '\u00A34.00', savings: 'Save 60%' },
];

const premiumFeatures = [
  'Outstanding finance check',
  'Stolen vehicle database',
  'Write-off & accident records',
  'Mileage discrepancy analysis',
  'Full MOT history',
  'Ownership history',
  'Import/Export status',
  'Vehicle images & specs',
  'Current market valuation',
  'Recalls & plate changes',
];

const selectedPackagePrice = computed(() => {
  const pkg = webPackages.find(p => p.id === selectedPackage.value);
  return pkg ? pkg.price : '';
});

const handleStripeCheckout = async () => {
  if (!selectedPackage.value) return;

  if (!user.value) {
    router.push({ path: '/login', query: { redirect: route.fullPath } });
    return;
  }

  checkoutLoading.value = true;
  checkoutError.value = '';

  try {
    const pkg = webPackages.find(p => p.id === selectedPackage.value);
    const { data, error } = await (supabase as any).functions.invoke('create-checkout-session', {
      body: {
        num_checks: pkg?.checks || 1,
        vrm: vrm.value,
        success_url: `${window.location.origin}/payment-success?session_id={CHECKOUT_SESSION_ID}&vrm=${vrm.value}`,
        cancel_url: `${window.location.origin}/premium/${vrm.value}`,
      },
    });

    if (error) throw error;
    if (data?.url) {
      window.location.href = data.url;
    } else {
      checkoutError.value = 'Failed to create checkout session. Please try again.';
    }
  } catch (err: any) {
    console.error('Stripe checkout error:', err);
    checkoutError.value = err.message || 'Failed to start checkout. Please try again.';
  } finally {
    checkoutLoading.value = false;
  }
};

const handleRedeemVoucher = async () => {
  if (!voucherCode.value) return;
  if (!user.value) {
    router.push({ path: '/login', query: { redirect: route.fullPath } });
    return;
  }

  redeemLoading.value = true;
  redeemError.value = '';

  try {
    const result = await premiumLookup(vrm.value, voucherCode.value.trim());
    if (result.success) {
      router.push(`/vehicle-premium/${vrm.value}`);
    } else {
      redeemError.value = result.error || 'Invalid or already redeemed voucher.';
    }
  } catch (err: any) {
    redeemError.value = err.message || 'Failed to redeem voucher.';
  } finally {
    redeemLoading.value = false;
  }
};

onMounted(async () => {
  isWeb.value = !(window as any).Capacitor?.isNativePlatform?.();

  if (!user.value && isWeb.value) {
    router.push({ path: '/login', query: { redirect: `/premium/${vrm.value}` } });
    return;
  }

  if (vrm.value) {
    try {
      const cachedData = await getCachedVehicle(vrm.value);
      if (cachedData) {
        const imageUrl = cachedData.imageUrl;
        let mappedData: any = {};
        if (cachedData.tax || cachedData.motTests) {
          mappedData = mapCheckCarDetailsBasic(cachedData);
        } else {
          mappedData = mapDvlaData(cachedData);
        }
        vehicleData.value = { ...mappedData, imageUrl };
      }
    } catch (err) {
      console.error('Error loading vehicle:', err);
    } finally {
      loading.value = false;
    }
  }
});
</script>
