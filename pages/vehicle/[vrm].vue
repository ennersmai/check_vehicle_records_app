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
      <p class="text-gray-600 text-sm">Loading vehicle details...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex flex-col items-center px-10 mt-12">
      <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
        <svg class="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      <h2 class="text-xl font-bold text-gray-900 mb-2">Error Loading Vehicle</h2>
      <p class="text-gray-600 text-center mb-6">{{ error }}</p>
      <PrimaryButton @click="$router.push('/home')" class="w-full max-w-sm">
        TRY ANOTHER VEHICLE
      </PrimaryButton>
    </div>

    <!-- Vehicle Data -->
    <div v-else class="flex flex-col px-10">
      <!-- Fixed Header Section -->
      <div class="sticky top-0 bg-white z-10 pb-4">
        <h1 class="text-3xl font-bold text-primary mb-1">Vehicle details</h1>
        <p class="text-gray-900 text-lg font-medium mb-6">Basic check</p>

        <div class="bg-gray-200 rounded-lg aspect-video flex items-center justify-center mb-6">
          <CarSilhouette v-if="vehicleData" :bodyStyle="vehicleData.bodyStyle" class="w-32 h-32 text-gray-400" />
          <svg v-else class="w-20 h-20 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      </div>

      <!-- Scrollable Content -->
      <div v-if="vehicleData" class="space-y-0 mb-6">
        <div class="flex justify-between py-3 border-b border-gray-200">
          <span class="text-gray-700">Make</span>
          <span class="font-medium text-gray-900">{{ vehicleData.make || 'XX XXXX' }}</span>
        </div>
        <div class="flex justify-between py-3 border-b border-gray-200">
          <span class="text-gray-700">Model</span>
          <span class="font-medium text-gray-900">{{ vehicleData.model || 'XX XXXX' }}</span>
        </div>
        <div class="flex justify-between py-3 border-b border-gray-200">
          <span class="text-gray-700">Colour</span>
          <span class="font-medium text-gray-900">{{ vehicleData.colour || 'XX XXXX' }}</span>
        </div>
        <div class="flex justify-between py-3 border-b border-gray-200">
          <span class="text-gray-700">Year</span>
          <span class="font-medium text-gray-900">{{ vehicleData.yearOfManufacture || 'XX XXXX' }}</span>
        </div>
        <div class="flex justify-between py-3 border-b border-gray-200">
          <span class="text-gray-700">Fuel type</span>
          <span class="font-medium text-gray-900">{{ vehicleData.fuelType || 'XX XXXX' }}</span>
        </div>
        <div class="flex justify-between py-3 border-b border-gray-200">
          <span class="text-gray-700">Body style</span>
          <span class="font-medium text-gray-900">{{ vehicleData.bodyStyle || 'XX XXXX' }}</span>
        </div>
        <div class="flex justify-between py-3 border-b border-gray-200">
          <span class="text-gray-700">Engine size</span>
          <span class="font-medium text-gray-900">{{ vehicleData.engineCapacity || 'XX XXXX' }}</span>
        </div>
        <div class="flex justify-between py-3 border-b border-gray-200">
          <span class="text-gray-700">BHP</span>
          <span class="font-medium text-gray-900">{{ vehicleData.bhp || 'XX XXXX' }}</span>
        </div>

        <div class="h-4"></div>

        <div class="flex justify-between py-3 border-b border-gray-200">
          <span class="text-gray-700">Registration date</span>
          <span class="font-medium text-gray-900">{{ vehicleData.registrationDate || 'XX XXXX' }}</span>
        </div>
        <div class="flex justify-between py-3 border-b border-gray-200">
          <span class="text-gray-700">Place of first registration</span>
          <span class="font-medium text-gray-900">{{ vehicleData.placeOfFirstRegistration || 'XX XXXX' }}</span>
        </div>

        <div class="h-4"></div>

        <div class="flex justify-between py-3 border-b border-gray-200">
          <span class="text-gray-700">Vehicle Age</span>
          <span class="font-medium text-gray-900">{{ vehicleData.vehicleAge || 'XX XXXX' }}</span>
        </div>

        <div class="h-4"></div>

        <div class="flex justify-between py-3 border-b border-gray-200">
          <span class="text-gray-700">MOT</span>
          <span class="font-medium text-gray-900">{{ vehicleData.motStatus || 'XX XXXX' }}</span>
        </div>
        <div class="flex justify-between py-3 border-b border-gray-200">
          <span class="text-gray-700">MOT Mileage information</span>
          <span class="font-medium text-gray-900">{{ vehicleData.motMileage || 'XX XXXX' }}</span>
        </div>
        <div class="flex justify-between py-3 border-b border-gray-200">
          <span class="text-gray-700">MOT information</span>
          <span class="font-medium text-gray-900">{{ vehicleData.motInformation || 'XX XXXX' }}</span>
        </div>

        <div class="h-4"></div>

        <div class="flex justify-between py-3 border-b border-gray-200">
          <span class="text-gray-700">Road Tax</span>
          <span class="font-medium text-gray-900">{{ vehicleData.taxStatus || 'XX XXXX' }}</span>
        </div>
        <div class="flex justify-between py-3 border-b border-gray-200">
          <span class="text-gray-700">6 Months</span>
          <span class="font-medium text-gray-900">{{ vehicleData.taxSixMonths || 'XX XXXX' }}</span>
        </div>
        <div class="flex justify-between py-3 border-b border-gray-200">
          <span class="text-gray-700 flex items-center">
            1 Year
            <svg class="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5H6.5C5.84 5 5.28 5.42 5.08 6.01L3 12V20C3 20.55 3.45 21 4 21H5C5.55 21 6 20.55 6 20V19H18V20C18 20.55 18.45 21 19 21H20C20.55 21 21 20.55 21 20V12L18.92 6.01M6.5 16C5.67 16 5 15.33 5 14.5S5.67 13 6.5 13 8 13.67 8 14.5 7.33 16 6.5 16M17.5 16C16.67 16 16 15.33 16 14.5S16.67 13 17.5 13 19 13.67 19 14.5 18.33 16 17.5 16M5 11L6.5 6.5H17.5L19 11H5Z" />
            </svg>
          </span>
          <span class="font-medium text-gray-900">{{ vehicleData.taxTwelveMonths || 'XX XXXX' }}</span>
        </div>

        <div class="h-4"></div>

        <div class="flex justify-between py-3 border-b border-gray-200">
          <span class="text-gray-700">Insurance</span>
          <span class="font-medium text-gray-900">{{ vehicleData.insurance || 'XX XXXX' }}</span>
        </div>
        <div class="flex justify-between py-3 border-b border-gray-200">
          <span class="text-gray-700">Insurance Group</span>
          <span class="font-medium text-gray-900">{{ vehicleData.insuranceGroup || 'XX XXXX' }}</span>
        </div>
      </div>

      <!-- Premium Upgrade Section -->
      <div class="mt-8 mb-6">
        <div class="flex items-center mb-4">
          <svg class="w-6 h-6 text-primary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
          <h2 class="text-xl font-bold text-primary">Upgrade to Premium</h2>
        </div>

        <div class="grid grid-cols-2 gap-3 mb-6">
          <div class="flex items-start">
            <svg class="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span class="text-sm text-gray-700">Outstanding finance</span>
          </div>
          <div class="flex items-start">
            <svg class="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span class="text-sm text-gray-700">Previous owners</span>
          </div>
          <div class="flex items-start">
            <svg class="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span class="text-sm text-gray-700">Written off record</span>
          </div>
          <div class="flex items-start">
            <svg class="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span class="text-sm text-gray-700">Imported / Exported</span>
          </div>
          <div class="flex items-start">
            <svg class="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span class="text-sm text-gray-700">Stolen vehicle record</span>
          </div>
          <div class="flex items-start">
            <svg class="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span class="text-sm text-gray-700">Build sheet</span>
          </div>
        </div>

        <PrimaryButton @click="handlePremiumUpgrade" class="w-full">
          PREMIUM SEARCH
        </PrimaryButton>
      </div>

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
const error = ref('');

// Computed properties for formatted display
const formattedEngineCapacity = computed(() => {
  const cc = vehicleData.value?.engineCapacity;
  if (!cc) return 'N/A';
  const ccNum = typeof cc === 'string' ? parseInt(cc) : cc;
  return isNaN(ccNum) ? cc : `${ccNum}cc`;
});

const formattedMotExpiry = computed(() => {
  const date = vehicleData.value?.motExpiryDate;
  if (!date) return vehicleData.value?.motStatus || 'N/A';
  try {
    return new Date(date).toLocaleDateString('en-GB');
  } catch {
    return date;
  }
});

const formattedTaxDue = computed(() => {
  const date = vehicleData.value?.taxDueDate;
  if (!date) return 'N/A';
  try {
    return new Date(date).toLocaleDateString('en-GB');
  } catch {
    return date;
  }
});

const vehicleAge = computed(() => {
  const year = vehicleData.value?.yearOfManufacture;
  if (!year) return 'N/A';
  const yearNum = typeof year === 'string' ? parseInt(year) : year;
  const age = new Date().getFullYear() - yearNum;
  return `${age} year${age !== 1 ? 's' : ''}`;
});

onMounted(async () => {
  if (!vrm.value) {
    router.push('/home');
    return;
  }

  try {
    // Get cached vehicle data
    const cachedData = await getCachedVehicle(vrm.value);
    
    if (cachedData) {
      // Map the data based on source
      let mappedData;
      if (cachedData.tax) {
        // CheckCarDetails format
        mappedData = mapCheckCarDetailsBasic(cachedData);
      } else {
        // DVLA format
        mappedData = mapDvlaData(cachedData);
      }
      
      // Merge mapped and raw data
      vehicleData.value = { ...mappedData, ...cachedData };
    } else {
      error.value = 'Vehicle data not found. Please try searching again.';
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to load vehicle data';
  } finally {
    loading.value = false;
  }
});

const handlePremiumUpgrade = () => {
  router.push(`/premium/${vrm.value}`);
};
</script>
