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
  </div>
</template>

<script setup lang="ts">
import { mapDvlaData, mapCheckCarDetailsBasic } from '~/utils/vehicleDataMapper';

const route = useRoute();
const { getCachedVehicle } = useVehicle();

const vrm = computed(() => route.params.vrm as string);
const vehicleData = ref<any>(null);
const loading = ref(true);

onMounted(async () => {
  if (vrm.value) {
    try {
      // Fetch from cached vehicle data
      const cachedData = await getCachedVehicle(vrm.value);
      if (cachedData) {
        // Extract imageUrl before mapping
        const imageUrl = cachedData.imageUrl;
        
        // Map the data to our normalized format
        let mappedData: any = {};
        
        if (cachedData.tax || cachedData.motTests) {
          // CheckCarDetails format
          mappedData = mapCheckCarDetailsBasic(cachedData);
        } else {
          // DVLA format (default)
          mappedData = mapDvlaData(cachedData);
        }
        
        // Use only mapped data and add imageUrl back
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
