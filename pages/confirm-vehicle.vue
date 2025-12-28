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

    <div class="flex flex-col items-center px-10 mt-8">
      <h1 class="text-3xl font-bold text-primary mb-2">Confirm Vehicle</h1>
      <p class="text-center text-gray-600 mb-8">
        Please review the vehicle details<br />before confirmation
      </p>

      <div class="w-full max-w-sm mb-6">
        <div class="bg-gray-200 rounded-lg aspect-video flex items-center justify-center">
          <CarSilhouette v-if="vehicleData" :bodyStyle="vehicleData.bodyStyle" class="w-32 h-32 text-gray-400" />
          <svg v-else class="w-20 h-20 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      </div>

      <div v-if="vehicleData" class="w-full max-w-sm bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <div class="space-y-3">
          <div class="flex justify-between py-2 border-b border-gray-100">
            <span class="text-gray-600">Make</span>
            <span class="font-medium text-gray-900">{{ vehicleData.make || 'XX XXXX' }}</span>
          </div>
          <div class="flex justify-between py-2 border-b border-gray-100">
            <span class="text-gray-600">Model</span>
            <span class="font-medium text-gray-900">{{ vehicleData.model || 'XX XXXX' }}</span>
          </div>
          <div class="flex justify-between py-2 border-b border-gray-100">
            <span class="text-gray-600">Colour</span>
            <span class="font-medium text-gray-900">{{ vehicleData.colour || 'XX XXXX' }}</span>
          </div>
          <div class="flex justify-between py-2 border-b border-gray-100">
            <span class="text-gray-600">Year</span>
            <span class="font-medium text-gray-900">{{ vehicleData.yearOfManufacture || 'XX XXXX' }}</span>
          </div>
          <div class="flex justify-between py-2 border-b border-gray-100">
            <span class="text-gray-600">Fuel type</span>
            <span class="font-medium text-gray-900">{{ vehicleData.fuelType || 'XX XXXX' }}</span>
          </div>
          <div class="flex justify-between py-2 border-b border-gray-100">
            <span class="text-gray-600">Body style</span>
            <span class="font-medium text-gray-900">{{ vehicleData.bodyStyle || 'XX XXXX' }}</span>
          </div>
          <div class="flex justify-between py-2">
            <span class="text-gray-600">Engine size</span>
            <span class="font-medium text-gray-900">{{ vehicleData.engineCapacity || 'XX XXXX' }}</span>
          </div>
        </div>
      </div>

      <PrimaryButton @click="handleConfirm" :loading="loading" class="w-full max-w-sm mb-4">
        CONFIRM
      </PrimaryButton>

      <button @click="$router.push('/home')" class="text-gray-600 text-sm">
        Enter another registration number
      </button>

      <div v-if="error" class="mt-4 text-red-600 text-sm text-center">
        {{ error }}
      </div>
    </div>

    <BottomNav />
  </div>
</template>

<script setup lang="ts">
const route = useRoute();
const router = useRouter();
const { lookupVehicle } = useVehicle();

const vrm = computed(() => {
  const params = route.params.vrm;
  return Array.isArray(params) ? params[0] : params || '';
});
const vehicleData = ref<any>(null);
const loading = ref(false);
const error = ref('');

onMounted(async () => {
  if (!vrm.value) {
    router.push('/home');
    return;
  }

  loading.value = true;
  const result = await lookupVehicle(vrm.value);
  loading.value = false;

  if (result.success && result.data) {
    vehicleData.value = result.data;
  } else {
    error.value = result.error || 'Failed to load vehicle data';
  }
});

const handleConfirm = () => {
  if (vehicleData.value) {
    router.push(`/vehicle/${vrm.value}`);
  }
};
</script>
