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

    <!-- Loading State -->
    <div v-if="loading" class="flex flex-col items-center justify-center px-10 mt-20">
      <svg class="animate-spin h-12 w-12 text-primary mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p class="text-gray-600 text-sm">{{ loadingMessage }}</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex flex-col items-center px-10 mt-12">
      <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
        <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      <h2 class="text-xl font-bold text-gray-900 mb-2">{{ errorTitle }}</h2>
      <p class="text-gray-600 text-center mb-6">{{ error }}</p>
      <PrimaryButton @click="$router.push('/home')" class="w-full max-w-sm">
        TRY ANOTHER VEHICLE
      </PrimaryButton>
    </div>

    <!-- Vehicle Data -->
    <div v-else class="flex flex-col items-center px-10 mt-8">
      <h1 class="text-3xl font-bold text-primary mb-2">Confirm Vehicle</h1>
      <p class="text-center text-gray-600 mb-8">
        Please review the vehicle details<br />before confirmation
      </p>

      <div class="w-full max-w-sm mb-6">
        <div class="bg-gray-200 rounded-lg aspect-video flex items-center justify-center overflow-hidden">
          <img v-if="vehicleData?.imageUrl" :src="vehicleData.imageUrl" alt="Vehicle" class="w-full h-full object-cover" />
          <CarSilhouette v-else-if="vehicleData" :bodyStyle="vehicleData.bodyStyle" class="w-32 h-32 text-gray-400" />
          <svg v-else class="w-20 h-20 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      </div>

      <div v-if="vehicleData" class="w-full max-w-sm bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <div class="space-y-3">
          <div class="flex justify-between py-2 border-b border-gray-100">
            <span class="text-gray-600">Make</span>
            <span class="font-medium text-gray-900">{{ vehicleData.make || 'N/A' }}</span>
          </div>
          <div class="flex justify-between py-2 border-b border-gray-100">
            <span class="text-gray-600">Model</span>
            <span class="font-medium text-gray-900">{{ vehicleData.model || 'N/A' }}</span>
          </div>
          <div class="flex justify-between py-2 border-b border-gray-100">
            <span class="text-gray-600">Colour</span>
            <span class="font-medium text-gray-900">{{ vehicleData.colour || 'N/A' }}</span>
          </div>
          <div class="flex justify-between py-2 border-b border-gray-100">
            <span class="text-gray-600">Year</span>
            <span class="font-medium text-gray-900">{{ vehicleData.yearOfManufacture || 'N/A' }}</span>
          </div>
          <div class="flex justify-between py-2 border-b border-gray-100">
            <span class="text-gray-600">Fuel type</span>
            <span class="font-medium text-gray-900">{{ vehicleData.fuelType || 'N/A' }}</span>
          </div>
          <div class="flex justify-between py-2 border-b border-gray-100">
            <span class="text-gray-600">Body style</span>
            <span class="font-medium text-gray-900">{{ vehicleData.bodyStyle || 'N/A' }}</span>
          </div>
          <div class="flex justify-between py-2">
            <span class="text-gray-600">Engine size</span>
            <span class="font-medium text-gray-900">{{ vehicleData.engineCapacity || 'N/A' }}</span>
          </div>
        </div>
      </div>

      <PrimaryButton @click="handleConfirm" :loading="loading" class="w-full max-w-sm mb-4">
        CONFIRM
      </PrimaryButton>

      <button @click="$router.push('/home')" class="text-gray-600 text-sm">
        Enter another registration number
      </button>

    </div>

    <BottomNav />
  </div>
</template>

<script setup lang="ts">
import { mapDvlaData, mapCheckCarDetailsBasic } from '~/utils/vehicleDataMapper';

const route = useRoute();
const router = useRouter();
const { getCachedVehicle } = useVehicle();

const vrm = computed(() => route.params.vrm as string);
const vehicleData = ref<any>(null);
const loading = ref(true);
const loadingMessage = ref('Loading vehicle data...');
const error = ref('');
const errorTitle = ref('');

onMounted(async () => {
  if (!vrm.value) {
    router.push('/home');
    return;
  }

  try {
    loadingMessage.value = 'Retrieving vehicle information...';
    
    // Get cached vehicle data (should already be cached from home page lookup)
    const cachedData = await getCachedVehicle(vrm.value);
    
    if (cachedData) {
      // Map the data to our normalized format
      // Check if it's DVLA format (has registrationNumber at root) or CheckCarDetails format
      let mappedData: any = {};
      if (cachedData.registrationNumber) {
        mappedData = cachedData.tax ? mapCheckCarDetailsBasic(cachedData) : mapDvlaData(cachedData);
      }
      // Merge: raw data first, then mapped data takes precedence for formatted fields
      vehicleData.value = { ...cachedData, ...mappedData };
    } else {
      errorTitle.value = 'Data Not Found';
      error.value = 'Vehicle data could not be retrieved. Please try searching again.';
    }
  } catch (err: any) {
    errorTitle.value = 'Error Loading Data';
    error.value = err.message || 'An unexpected error occurred.';
  } finally {
    loading.value = false;
  }
});

const handleConfirm = () => {
  if (vehicleData.value) {
    router.push(`/vehicle/${vrm.value}`);
  }
};
</script>
