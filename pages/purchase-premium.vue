<template>
  <div class="min-h-screen bg-white" :class="{ 'pb-36': !isWeb }">
    <WebNav v-if="isWeb" />
    <div v-else class="px-6 pt-8 py-4">
      <button @click="$router.back()" class="flex items-center text-gray-900 hover:text-gray-700">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>
    </div>

    <div class="px-10 mt-8">
      <h1 class="text-3xl font-bold text-primary mb-1">Purchase</h1>
      <p class="text-xl text-gray-900 mb-2">Premium Check</p>
      <p class="text-gray-600 text-sm mb-4">Choose your package and proceed to<br />secure checkout. Instant report delivery,<br />no hidden fees.</p>

      <!-- Collapsible info -->
      <button 
        type="button"
        @click="showInfo = !showInfo" 
        class="flex items-center gap-2 text-primary text-sm mb-4"
      >
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
        </svg>
        <span>About credits & vouchers</span>
        <svg :class="['w-4 h-4 transition-transform', showInfo ? 'rotate-180' : '']" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div v-if="showInfo" class="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-4 text-xs text-blue-800">
        <p>All purchases are processed exclusively through Apple In-App Purchase. Credits are issued to your account after a successful payment and are personal to you, they cannot be transferred, shared, or used by another account. Voucher codes are generated automatically upon purchase and are tied to the purchasing account.</p>
      </div>

      <form @submit.prevent="handleConfirm" class="space-y-4">
        <label 
          v-for="pkg in packages" 
          :key="pkg.id"
          class="flex items-center justify-between py-4 border-b border-gray-200 cursor-pointer"
        >
          <div class="flex items-center gap-3">
            <input
              type="radio"
              :value="pkg.id"
              v-model="selectedPackage"
              class="w-4 h-4 text-primary"
            />
            <span class="text-gray-900">{{ pkg.name }}</span>
          </div>
          <span class="font-semibold text-gray-900">{{ pkg.price }}</span>
        </label>

        <div class="pt-4 pb-6 border-b border-gray-300">
          <div class="flex justify-between items-center">
            <span class="text-lg font-semibold text-gray-900">Total:</span>
            <span class="text-lg font-semibold text-gray-900">{{ selectedPackagePrice }}</span>
          </div>
        </div>

        <PrimaryButton type="submit" :disabled="!selectedPackage" class="w-full mt-6">
          CONFIRM & PAY
        </PrimaryButton>
      </form>
    </div>

    <BottomNav v-if="!isWeb" />
    <WebFooter v-if="isWeb" />
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const router = useRouter();
const isWeb = ref(false);
const { user } = useAuth();
const { lookupVehicle } = useVehicle();
const { fetchOfferings } = usePayment();

const vrm = computed(() => route.query.vrm as string);

// Fallback prices used only when store prices aren't available (web dev)
const fallbackPackages = [
  { id: 1, name: 'One time purchase', price: '£9.99', checks: 1, productId: 'com.cvr.app.credits.1' },
  { id: 5, name: 'Purchase 5 checks', price: '£24.99', checks: 5, productId: 'com.cvr.app.credits.5' },
  { id: 10, name: 'Purchase 10 checks', price: '£39.99', checks: 10, productId: 'com.cvr.app.credits.10' }
];

const packages = ref(fallbackPackages);

onMounted(async () => {
  isWeb.value = !(window as any).Capacitor?.isNativePlatform?.();

  // Web users should use the combined premium page
  if (isWeb.value && vrm.value) {
    router.replace(`/premium/${vrm.value}`);
    return;
  }

  if (!user.value) {
    router.push({ path: '/login', query: { redirect: route.fullPath } });
    return;
  }

  if (vrm.value) {
    await lookupVehicle(vrm.value);
  }

  // Fetch real prices from RevenueCat / store
  try {
    const offerings = await fetchOfferings();
    if (offerings.length > 0) {
      packages.value = offerings.map(o => ({
        id: o.credits,
        name: o.credits === 1 ? 'One time purchase' : `Purchase ${o.credits} checks`,
        price: o.price,
        checks: o.credits,
        productId: o.productId
      }));
    }
  } catch (e) {
    console.warn('Could not fetch store prices, using fallback:', e);
  }
});

const selectedPackage = ref<number | null>(null);
const showInfo = ref(false);

const selectedPackagePrice = computed(() => {
  const pkg = packages.value.find(p => p.id === selectedPackage.value);
  return pkg ? pkg.price : '£0.00';
});

const handleConfirm = () => {
  if (selectedPackage.value) {
    const pkg = packages.value.find(p => p.id === selectedPackage.value);
    console.log(`[CVR] Selected package id=${selectedPackage.value}, found pkg:`, JSON.stringify(pkg));
    console.log(`[CVR] All packages:`, JSON.stringify(packages.value.map(p => ({ id: p.id, productId: p.productId, checks: p.checks }))));
    router.push({
      path: '/checkout',
      query: {
        package: selectedPackage.value,
        checks: pkg?.checks,
        price: pkg?.price,
        productId: pkg?.productId,
        vrm: vrm.value
      }
    });
  }
};
</script>
