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
      <h1 class="text-3xl font-bold text-primary mb-1">Purchase</h1>
      <p class="text-xl text-gray-900 mb-2">Premium Check</p>
      <p class="text-gray-600 text-sm mb-8">Choose your package and proceed to<br />secure checkout. Instant report delivery,<br />no hidden fees.</p>

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

    <BottomNav />
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const router = useRouter();

const vrm = computed(() => route.query.vrm as string);

const packages = [
  { id: 1, name: 'One time purchase', price: '£xx.xx', checks: 1 },
  { id: 3, name: 'Purchase 3 checks', price: '£xx.xx', checks: 3 },
  { id: 5, name: 'Purchase 5 checks', price: '£xx.xx', checks: 5 },
  { id: 10, name: 'Purchase 10 checks', price: '£xx.xx', checks: 10 }
];

const selectedPackage = ref<number | null>(null);

const selectedPackagePrice = computed(() => {
  const pkg = packages.find(p => p.id === selectedPackage.value);
  return pkg ? pkg.price : '£xx.xx';
});

const handleConfirm = () => {
  if (selectedPackage.value) {
    const pkg = packages.find(p => p.id === selectedPackage.value);
    router.push({
      path: '/checkout',
      query: {
        package: selectedPackage.value,
        checks: pkg?.checks,
        price: pkg?.price,
        vrm: vrm.value
      }
    });
  }
};
</script>
