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
      <PrimaryButton @click="$router.push(`/premium/${vrm}`)" class="w-full max-w-sm">
        PURCHASE PREMIUM CHECK
      </PrimaryButton>
    </div>

    <!-- Main Content -->
    <div v-else class="flex flex-col px-10">
      <!-- Fixed Header Section -->
      <div class="sticky top-0 bg-white z-10 pb-4">
        <h1 class="text-3xl font-bold text-primary mb-1">Vehicle details</h1>
        <p class="text-gray-900 text-lg font-medium mb-6">Premium check</p>

        <div class="bg-gray-200 rounded-lg aspect-video flex items-center justify-center mb-6">
          <CarSilhouette v-if="vehicleData" :bodyStyle="vehicleData.bodyStyle" class="w-32 h-32 text-gray-400" />
          <svg v-else class="w-20 h-20 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      </div>

      <!-- Scrollable Content -->
      <div v-if="vehicleData" class="space-y-6 mb-6">
        <!-- VEHICLE INFORMATION Section -->
        <div class="bg-gray-50 rounded-lg p-4">
          <h3 class="font-bold text-gray-900 text-sm mb-4 uppercase">Vehicle Information</h3>
          <div class="space-y-0">
            <div class="flex justify-between py-2 border-b border-gray-200">
              <span class="text-gray-700 text-sm">VIN number</span>
              <span class="font-medium text-gray-900 text-sm">{{ vehicleData.vinNumber || 'XX XXXX' }}</span>
            </div>
            <div class="flex justify-between py-2 border-b border-gray-200">
              <span class="text-gray-700 text-sm">Outstanding finance</span>
              <span class="font-medium text-gray-900 text-sm">{{ vehicleData.outstandingFinance || 'XX XXXX' }}</span>
            </div>
            <div class="flex justify-between py-2 border-b border-gray-200">
              <span class="text-gray-700 text-sm">Stole vehicle record</span>
              <span class="font-medium text-gray-900 text-sm">{{ vehicleData.stolenRecord || 'XX XXXX' }}</span>
            </div>
            <div class="flex justify-between py-2 border-b border-gray-200">
              <span class="text-gray-700 text-sm">Written off record</span>
              <span class="font-medium text-gray-900 text-sm">{{ vehicleData.writtenOffRecord || 'XX XXXX' }}</span>
            </div>
            <div class="flex justify-between py-2 border-b border-gray-200">
              <span class="text-gray-700 text-sm">Previous owners</span>
              <span class="font-medium text-gray-900 text-sm">{{ vehicleData.previousOwners || 'XX XXXX' }}</span>
            </div>
            <div class="flex justify-between py-2 border-b border-gray-200">
              <span class="text-gray-700 text-sm">Imported/ Exported</span>
              <span class="font-medium text-gray-900 text-sm">{{ vehicleData.importedExported || 'XX XXXX' }}</span>
            </div>
            <div class="flex justify-between py-2 border-b border-gray-200">
              <span class="text-gray-700 text-sm">Last owner since</span>
              <span class="font-medium text-gray-900 text-sm">{{ vehicleData.lastOwnerSince || 'XX XXXX' }}</span>
            </div>
            <div class="flex justify-between py-2 border-b border-gray-200">
              <span class="text-gray-700 text-sm">Build sheet</span>
              <span class="font-medium text-gray-900 text-sm">{{ vehicleData.buildSheet || 'XX XXXX' }}</span>
            </div>
            <div class="flex justify-between py-2">
              <span class="text-gray-700 text-sm"></span>
              <span class="font-medium text-gray-900 text-sm">{{ vehicleData.buildSheetExtra || 'XX XXXX' }}</span>
            </div>
          </div>
        </div>

        <!-- TECHNICAL & SPECIFICATION DETAILS Section -->
        <div class="bg-gray-50 rounded-lg p-4">
          <h3 class="font-bold text-gray-900 text-sm mb-4 uppercase">Technical & Specification Details</h3>
          <div class="space-y-0">
            <div class="flex justify-between py-2 border-b border-gray-200">
              <span class="text-gray-700 text-sm">Colour</span>
              <span class="font-medium text-gray-900 text-sm">{{ vehicleData.colour || 'XX XXXX' }}</span>
            </div>
            <div class="flex justify-between py-2 border-b border-gray-200">
              <span class="text-gray-700 text-sm"></span>
              <span class="font-medium text-gray-900 text-sm">{{ vehicleData.colourExtra || 'XX XXXX' }}</span>
            </div>
            <div class="flex justify-between py-2 border-b border-gray-200">
              <span class="text-gray-700 text-sm">Fuel type</span>
              <span class="font-medium text-gray-900 text-sm">{{ vehicleData.fuelType || 'XX XXXX' }}</span>
            </div>
            <div class="flex justify-between py-2 border-b border-gray-200">
              <span class="text-gray-700 text-sm">Body style</span>
              <span class="font-medium text-gray-900 text-sm">{{ vehicleData.bodyStyle || 'XX XXXX' }}</span>
            </div>
            <div class="flex justify-between py-2">
              <span class="text-gray-700 text-sm">Engine size</span>
              <span class="font-medium text-gray-900 text-sm">{{ vehicleData.engineCapacity || 'XX XXXX' }}</span>
            </div>
          </div>
        </div>

        <!-- OWNERSHIP & INSURANCE Section -->
        <div class="bg-gray-50 rounded-lg p-4">
          <h3 class="font-bold text-gray-900 text-sm mb-4 uppercase">Ownership & Insurance</h3>
          <div class="space-y-0">
            <div class="flex justify-between py-2 border-b border-gray-200">
              <span class="text-gray-700 text-sm">Registration date</span>
              <span class="font-medium text-gray-900 text-sm">{{ vehicleData.registrationDate || 'XX XXXX' }}</span>
            </div>
            <div class="flex justify-between py-2 border-b border-gray-200">
              <span class="text-gray-700 text-sm">Place of first registration</span>
              <span class="font-medium text-gray-900 text-sm">{{ vehicleData.placeOfFirstRegistration || 'XX XXXX' }}</span>
            </div>
            <div class="flex justify-between py-2 border-b border-gray-200">
              <span class="text-gray-700 text-sm">Vehicle Age</span>
              <span class="font-medium text-gray-900 text-sm">{{ vehicleData.vehicleAge || 'XX XXXX' }}</span>
            </div>
            <div class="flex justify-between py-2 border-b border-gray-200">
              <span class="text-gray-700 text-sm">Last MOT Mileage</span>
              <span class="font-medium text-gray-900 text-sm">{{ vehicleData.lastMotMileage || 'XX XXXX' }}</span>
            </div>
            <div class="flex justify-between py-2 border-b border-gray-200">
              <span class="text-gray-700 text-sm">Last MOT information</span>
              <span class="font-medium text-gray-900 text-sm">{{ vehicleData.lastMotInformation || 'XX XXXX' }}</span>
            </div>
            <div class="flex justify-between py-2 border-b border-gray-200">
              <span class="text-gray-700 text-sm">Imported/ Exported</span>
              <span class="font-medium text-gray-900 text-sm">{{ vehicleData.importedExported || 'XX XXXX' }}</span>
            </div>
            <div class="flex justify-between py-2 border-b border-gray-200">
              <span class="text-gray-700 text-sm">Road Tax</span>
              <span class="font-medium text-gray-900 text-sm">{{ vehicleData.taxStatus || 'XX XXXX' }}</span>
            </div>
            <div class="flex justify-between py-2 border-b border-gray-200">
              <span class="text-gray-700 text-sm">6 Month</span>
              <span class="font-medium text-gray-900 text-sm">{{ vehicleData.taxSixMonths || 'XX XXXX' }}</span>
            </div>
            <div class="flex justify-between py-2 border-b border-gray-200">
              <span class="text-gray-700 text-sm"></span>
              <span class="font-medium text-gray-900 text-sm">{{ vehicleData.taxSixMonthsExtra || 'XX XXXX' }}</span>
            </div>
            <div class="flex justify-between py-2 border-b border-gray-200">
              <span class="text-gray-700 text-sm">Insurance</span>
              <span class="font-medium text-gray-900 text-sm">{{ vehicleData.insurance || 'XX XXXX' }}</span>
            </div>
            <div class="flex justify-between py-2">
              <span class="text-gray-700 text-sm">Insurance Group</span>
              <span class="font-medium text-gray-900 text-sm">{{ vehicleData.insuranceGroup || 'XX XXXX' }}</span>
            </div>
          </div>
        </div>

        <!-- SEE FULL PREMIUM DETAILS Button -->
        <PrimaryButton @click="viewFullReport" class="w-full">
          SEE FULL PREMIUM DETAILS
        </PrimaryButton>
      </div>
    </div>

    <BottomNav />
  </div>
</template>

<script setup lang="ts">
import { mapPremiumData } from '~/utils/vehicleDataMapper';

const route = useRoute();
const router = useRouter();
const { getCachedVehicle, getCachedPremiumLookup } = useVehicle();

const vrm = computed(() => route.params.vrm as string);
const vehicleData = ref<any>(null);
const loading = ref(true);
const loadingMessage = ref('Loading premium data...');
const error = ref('');
const errorTitle = ref('');

onMounted(async () => {
  if (!vrm.value) {
    router.push('/home');
    return;
  }

  try {
    loadingMessage.value = 'Loading vehicle data...';
    
    // Get basic vehicle data
    const basicData = await getCachedVehicle(vrm.value);
    
    loadingMessage.value = 'Loading premium report...';
    
    // Get premium data
    const premium = await getCachedPremiumLookup(vrm.value);
    
    if (premium) {
      // Map the premium data
      const mapped = mapPremiumData(
        basicData,
        premium.history_data,
        premium.mot_data,
        premium.mileage_data,
        premium.image_data,
        premium.specs_data
      );
      
      vehicleData.value = { ...basicData, ...mapped };
    } else {
      errorTitle.value = 'Premium Data Not Found';
      error.value = 'No premium report found for this vehicle. Please purchase a premium check first.';
    }
  } catch (err: any) {
    errorTitle.value = 'Error Loading Data';
    error.value = err.message || 'Failed to load premium data.';
  } finally {
    loading.value = false;
  }
});

const viewFullReport = () => {
  router.push(`/vehicle-full-report/${vrm.value}`);
};
</script>
