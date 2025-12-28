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

    <!-- Main Content -->
    <div v-else class="px-10">
      <!-- Fixed Header -->
      <div class="sticky top-0 bg-white z-10 pb-4">
        <h1 class="text-3xl font-bold text-primary text-center mb-1">Vehicle</h1>
        <p class="text-gray-900 text-xl text-center mb-6">Premium Details</p>

        <!-- Tabs -->
        <div class="flex gap-2 mb-6 overflow-x-auto scrollbar-hide">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors',
              activeTab === tab.id
                ? 'bg-gray-900 text-white'
                : 'bg-gray-200 text-gray-700'
            ]"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>

      <!-- Tab Content -->
      <div class="pb-6">
        <!-- OVERVIEW Tab -->
        <div v-if="activeTab === 'overview'" class="space-y-6">
          <!-- Vehicle Photo -->
          <div class="bg-gray-200 rounded-lg aspect-video flex items-center justify-center">
            <img v-if="vehicleData?.photoUrl" :src="vehicleData.photoUrl" alt="Vehicle" class="w-full h-full object-cover rounded-lg" />
            <CarSilhouette v-else-if="vehicleData" :bodyStyle="vehicleData.bodyStyle" class="w-32 h-32 text-gray-400" />
            <svg v-else class="w-20 h-20 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>

          <!-- Traffic Light Status Indicators -->
          <div class="grid grid-cols-3 gap-4">
            <div v-for="indicator in statusIndicators" :key="indicator.id" class="flex flex-col items-center">
              <div 
                :class="[
                  'w-16 h-16 rounded-full mb-2 flex items-center justify-center',
                  indicator.status === 'green' ? 'bg-green-500' : '',
                  indicator.status === 'yellow' ? 'bg-yellow-300' : '',
                  indicator.status === 'red' ? 'bg-red-500' : ''
                ]"
              ></div>
              <p class="text-xs text-center text-gray-900 leading-tight">{{ indicator.label }}</p>
            </div>
          </div>
        </div>

        <!-- VEHICLE INFO Tab -->
        <div v-if="activeTab === 'vehicle-info'" class="space-y-4">
          <h3 class="font-bold text-gray-900 text-sm mb-4 uppercase border-b border-gray-900 pb-2">Vehicle Specifications</h3>
          
          <div class="space-y-0">
            <div class="flex justify-between py-3 border-b border-gray-200">
              <span class="text-gray-700 text-sm">Registration</span>
              <span class="font-medium text-gray-900 text-sm">{{ vehicleData?.registration || 'XX XXXX' }}</span>
            </div>
            <div class="flex justify-between py-3 border-b border-gray-200">
              <span class="text-gray-700 text-sm">Vin Number</span>
              <span class="font-medium text-gray-900 text-sm">{{ vehicleData?.vinNumber || 'XX XXXX' }}</span>
            </div>
            <div class="flex justify-between py-3 border-b border-gray-200">
              <span class="text-gray-700 text-sm">Make</span>
              <span class="font-medium text-gray-900 text-sm">{{ vehicleData?.make || 'XX XXXX' }}</span>
            </div>
            <div class="flex justify-between py-3 border-b border-gray-200">
              <span class="text-gray-700 text-sm">Model</span>
              <span class="font-medium text-gray-900 text-sm">{{ vehicleData?.model || 'XX XXXX' }}</span>
            </div>
            <div class="flex justify-between py-3 border-b border-gray-200">
              <span class="text-gray-700 text-sm">Colour</span>
              <span class="font-medium text-gray-900 text-sm">{{ vehicleData?.colour || 'XX XXXX' }}</span>
            </div>
            <div class="flex justify-between py-3 border-b border-gray-200">
              <span class="text-gray-700 text-sm">Year of Registration</span>
              <span class="font-medium text-gray-900 text-sm">{{ vehicleData?.yearOfManufacture || 'XX XXXX' }}</span>
            </div>
            <div class="flex justify-between py-3 border-b border-gray-200">
              <span class="text-gray-700 text-sm">Import/ Export</span>
              <span class="font-medium text-gray-900 text-sm">{{ vehicleData?.importedExported || 'XX XXXX' }}</span>
            </div>
            <div class="flex justify-between py-3 border-b border-gray-200">
              <span class="text-gray-700 text-sm">Number of owners</span>
              <span class="font-medium text-gray-900 text-sm">{{ vehicleData?.previousOwners || 'XX XXXX' }}</span>
            </div>
            <div class="flex justify-between py-3 border-b border-gray-200">
              <span class="text-gray-700 text-sm">Last owner since</span>
              <span class="font-medium text-gray-900 text-sm">{{ vehicleData?.lastOwnerSince || 'XX XXXX' }}</span>
            </div>
            <div class="flex justify-between py-3 border-b border-gray-200">
              <span class="text-gray-700 text-sm">Fuel type</span>
              <span class="font-medium text-gray-900 text-sm">{{ vehicleData?.fuelType || 'XX XXXX' }}</span>
            </div>
            <div class="flex justify-between py-3 border-b border-gray-200">
              <span class="text-gray-700 text-sm">Body style</span>
              <span class="font-medium text-gray-900 text-sm">{{ vehicleData?.bodyStyle || 'XX XXXX' }}</span>
            </div>
            <div class="flex justify-between py-3">
              <span class="text-gray-700 text-sm">Engine size</span>
              <span class="font-medium text-gray-900 text-sm">{{ vehicleData?.engineCapacity || 'XX XXXX' }}</span>
            </div>
          </div>
        </div>

        <!-- MOT Tab -->
        <div v-if="activeTab === 'mot'" class="space-y-6">
          <!-- MOT Summary -->
          <div class="bg-gray-50 rounded-lg p-4">
            <div class="grid grid-cols-3 gap-4 text-center">
              <div>
                <p class="text-2xl font-bold text-gray-900">{{ motSummary.totalTests }}</p>
                <p class="text-xs text-gray-600">Total Tests</p>
              </div>
              <div>
                <p class="text-2xl font-bold text-green-600">{{ motSummary.passedTests }}</p>
                <p class="text-xs text-gray-600">Passed</p>
              </div>
              <div>
                <p class="text-2xl font-bold text-red-600">{{ motSummary.failedTests }}</p>
                <p class="text-xs text-gray-600">Failed</p>
              </div>
            </div>
          </div>

          <div class="mb-4">
            <p class="font-semibold text-gray-900">MOT Expiry: <span class="font-normal">{{ formattedMotExpiry }}</span></p>
          </div>

          <!-- Charts -->
          <div class="grid grid-cols-1 gap-4">
            <div>
              <p class="text-sm font-medium text-gray-700 mb-2">Mileage Over Time</p>
              <MileageChart v-if="mileageChartData.length" :data="mileageChartData" />
              <div v-else class="bg-gray-100 rounded-lg h-40 flex items-center justify-center">
                <p class="text-gray-500 text-sm">No mileage data available</p>
              </div>
            </div>

            <div>
              <p class="text-sm font-medium text-gray-700 mb-2">MOT History</p>
              <MotHistoryChart v-if="motChartData.length" :data="motChartData" />
              <div v-else class="bg-gray-100 rounded-lg h-40 flex items-center justify-center">
                <p class="text-gray-500 text-sm">No MOT history available</p>
              </div>
            </div>
          </div>

          <!-- MOT History List -->
          <div v-if="motHistory.length" class="mt-6">
            <h3 class="font-bold text-gray-900 text-sm uppercase border-b border-gray-900 pb-2 mb-4">MOT History</h3>
            <div class="space-y-4">
              <div v-for="(mot, idx) in motHistory" :key="idx" class="border border-gray-200 rounded-lg p-4">
                <div class="flex justify-between items-start mb-2">
                  <div>
                    <p class="font-medium text-gray-900">{{ formatDate(mot.date) }}</p>
                    <p class="text-sm text-gray-600">{{ mot.mileage?.toLocaleString() }} miles</p>
                  </div>
                  <span :class="['px-3 py-1 rounded-full text-xs font-medium', mot.result === 'PASS' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800']">
                    {{ mot.result }}
                  </span>
                </div>
                <div v-if="mot.advisories?.length" class="mt-2">
                  <p class="text-xs text-yellow-700 font-medium mb-1">Advisories:</p>
                  <ul class="text-xs text-gray-600 space-y-1">
                    <li v-for="(adv, i) in mot.advisories" :key="i" class="flex items-start gap-1">
                      <span class="text-yellow-500">•</span>
                      {{ adv }}
                    </li>
                  </ul>
                </div>
                <div v-if="mot.failures?.length" class="mt-2">
                  <p class="text-xs text-red-700 font-medium mb-1">Failures:</p>
                  <ul class="text-xs text-gray-600 space-y-1">
                    <li v-for="(fail, i) in mot.failures" :key="i" class="flex items-start gap-1">
                      <span class="text-red-500">•</span>
                      {{ fail }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- TECHNICAL Tab -->
        <div v-if="activeTab === 'technical'" class="space-y-6">
          <h3 class="font-bold text-gray-900 text-sm mb-4 uppercase border-b border-gray-900 pb-2">Performance</h3>
          <div class="space-y-0">
            <div class="flex justify-between py-3 border-b border-gray-200">
              <span class="text-gray-700 text-sm">BHP</span>
              <span class="font-medium text-gray-900 text-sm">{{ premiumData?.performance?.bhp || 'N/A' }}</span>
            </div>
            <div class="flex justify-between py-3 border-b border-gray-200">
              <span class="text-gray-700 text-sm">Torque</span>
              <span class="font-medium text-gray-900 text-sm">{{ premiumData?.performance?.torque || 'N/A' }}</span>
            </div>
            <div class="flex justify-between py-3 border-b border-gray-200">
              <span class="text-gray-700 text-sm">Top Speed</span>
              <span class="font-medium text-gray-900 text-sm">{{ premiumData?.performance?.topSpeed || 'N/A' }}</span>
            </div>
            <div class="flex justify-between py-3 border-b border-gray-200">
              <span class="text-gray-700 text-sm">0-60 mph</span>
              <span class="font-medium text-gray-900 text-sm">{{ premiumData?.performance?.acceleration || 'N/A' }}</span>
            </div>
          </div>

          <h3 class="font-bold text-gray-900 text-sm mb-4 uppercase border-b border-gray-900 pb-2 mt-6">Dimensions</h3>
          <div class="space-y-0">
            <div class="flex justify-between py-3 border-b border-gray-200">
              <span class="text-gray-700 text-sm">Length</span>
              <span class="font-medium text-gray-900 text-sm">{{ premiumData?.dimensions?.length || 'N/A' }}</span>
            </div>
            <div class="flex justify-between py-3 border-b border-gray-200">
              <span class="text-gray-700 text-sm">Width</span>
              <span class="font-medium text-gray-900 text-sm">{{ premiumData?.dimensions?.width || 'N/A' }}</span>
            </div>
            <div class="flex justify-between py-3 border-b border-gray-200">
              <span class="text-gray-700 text-sm">Height</span>
              <span class="font-medium text-gray-900 text-sm">{{ premiumData?.dimensions?.height || 'N/A' }}</span>
            </div>
            <div class="flex justify-between py-3 border-b border-gray-200">
              <span class="text-gray-700 text-sm">Wheelbase</span>
              <span class="font-medium text-gray-900 text-sm">{{ premiumData?.dimensions?.wheelbase || 'N/A' }}</span>
            </div>
            <div class="flex justify-between py-3 border-b border-gray-200">
              <span class="text-gray-700 text-sm">Kerb Weight</span>
              <span class="font-medium text-gray-900 text-sm">{{ premiumData?.dimensions?.kerbWeight || 'N/A' }}</span>
            </div>
          </div>

          <h3 class="font-bold text-gray-900 text-sm mb-4 uppercase border-b border-gray-900 pb-2 mt-6">Fuel Consumption</h3>
          <div class="space-y-0">
            <div class="flex justify-between py-3 border-b border-gray-200">
              <span class="text-gray-700 text-sm">Urban</span>
              <span class="font-medium text-gray-900 text-sm">{{ premiumData?.consumption?.urban || 'N/A' }}</span>
            </div>
            <div class="flex justify-between py-3 border-b border-gray-200">
              <span class="text-gray-700 text-sm">Extra Urban</span>
              <span class="font-medium text-gray-900 text-sm">{{ premiumData?.consumption?.extraUrban || 'N/A' }}</span>
            </div>
            <div class="flex justify-between py-3">
              <span class="text-gray-700 text-sm">Combined</span>
              <span class="font-medium text-gray-900 text-sm">{{ premiumData?.consumption?.combined || 'N/A' }}</span>
            </div>
          </div>
        </div>

        <!-- BUILD SHEET Tab -->
        <div v-if="activeTab === 'build-sheet'" class="space-y-6">
          <!-- Vehicle Images -->
          <div>
            <h3 class="font-semibold text-gray-900 mb-3">Vehicle Images</h3>
            <div v-if="premiumData?.vehicleImages?.length" class="grid grid-cols-2 gap-2">
              <div v-for="(img, idx) in premiumData.vehicleImages" :key="idx" class="bg-gray-200 rounded-lg aspect-video">
                <img :src="img" alt="Vehicle" class="w-full h-full object-cover rounded-lg" />
              </div>
            </div>
            <div v-else class="bg-gray-200 rounded-lg aspect-video flex items-center justify-center">
              <CarSilhouette v-if="vehicleData" :bodyStyle="vehicleData.bodyStyle" class="w-32 h-32 text-gray-400" />
            </div>
          </div>

          <!-- Build Sheet Data -->
          <h3 class="font-bold text-gray-900 text-sm uppercase border-b border-gray-900 pb-2">Build Sheet</h3>
          <div class="space-y-0">
            <div class="flex justify-between py-3 border-b border-gray-200">
              <span class="text-gray-700 text-sm">VIN</span>
              <span class="font-medium text-gray-900 text-sm">{{ premiumData?.vin || 'N/A' }}</span>
            </div>
            <div class="flex justify-between py-3 border-b border-gray-200">
              <span class="text-gray-700 text-sm">Euro Status</span>
              <span class="font-medium text-gray-900 text-sm">{{ vehicleData?.euroStatus || 'N/A' }}</span>
            </div>
            <div class="flex justify-between py-3 border-b border-gray-200">
              <span class="text-gray-700 text-sm">CO2 Emissions</span>
              <span class="font-medium text-gray-900 text-sm">{{ vehicleData?.co2Emissions || 'N/A' }}</span>
            </div>
            <div class="flex justify-between py-3 border-b border-gray-200">
              <span class="text-gray-700 text-sm">Wheelplan</span>
              <span class="font-medium text-gray-900 text-sm">{{ vehicleData?.wheelplan || 'N/A' }}</span>
            </div>
            <div class="flex justify-between py-3 border-b border-gray-200">
              <span class="text-gray-700 text-sm">Road Tax Status</span>
              <span class="font-medium text-gray-900 text-sm">{{ vehicleData?.taxStatus || 'N/A' }}</span>
            </div>
            <div class="flex justify-between py-3 border-b border-gray-200">
              <span class="text-gray-700 text-sm">Tax (6 Months)</span>
              <span class="font-medium text-gray-900 text-sm">{{ premiumData?.taxSixMonths || 'N/A' }}</span>
            </div>
            <div class="flex justify-between py-3 border-b border-gray-200">
              <span class="text-gray-700 text-sm">Tax (12 Months)</span>
              <span class="font-medium text-gray-900 text-sm">{{ premiumData?.taxTwelveMonths || 'N/A' }}</span>
            </div>
            <div class="flex justify-between py-3 border-b border-gray-200">
              <span class="text-gray-700 text-sm">V5C Issued</span>
              <span class="font-medium text-gray-900 text-sm">{{ vehicleData?.dateOfLastV5CIssued || 'N/A' }}</span>
            </div>
          </div>

          <!-- Mileage Summary -->
          <div v-if="premiumData?.mileageSummary" class="mt-6">
            <h3 class="font-bold text-gray-900 text-sm uppercase border-b border-gray-900 pb-2">Mileage Analysis</h3>
            <div class="space-y-0">
              <div class="flex justify-between py-3 border-b border-gray-200">
                <span class="text-gray-700 text-sm">Last Recorded</span>
                <span class="font-medium text-gray-900 text-sm">{{ premiumData.mileageSummary.lastRecorded }} miles</span>
              </div>
              <div class="flex justify-between py-3 border-b border-gray-200">
                <span class="text-gray-700 text-sm">Average Mileage</span>
                <span class="font-medium text-gray-900 text-sm">{{ premiumData.mileageSummary.averageMileage }} miles/year</span>
              </div>
              <div class="flex justify-between py-3 border-b border-gray-200">
                <span class="text-gray-700 text-sm">Status</span>
                <span :class="['font-medium text-sm', premiumData.mileageSummary.status === 'LOW' ? 'text-green-600' : premiumData.mileageSummary.status === 'HIGH' ? 'text-red-600' : 'text-yellow-600']">{{ premiumData.mileageSummary.status }}</span>
              </div>
              <div v-if="premiumData.mileageSummary.issues" class="py-3">
                <span class="text-red-600 text-sm">⚠️ {{ premiumData.mileageSummary.issues }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <BottomNav />
  </div>
</template>

<script setup lang="ts">
import { mapPremiumData, calculateTrafficLightStatus } from '~/utils/vehicleDataMapper';

const route = useRoute();
const router = useRouter();
const { getCachedPremiumLookup, getCachedVehicle } = useVehicle();

const vrm = computed(() => route.params.vrm as string);
const vehicleData = ref<any>(null);
const premiumData = ref<any>(null);
const activeTab = ref('overview');
const loading = ref(true);
const loadingMessage = ref('Loading premium report...');
const error = ref('');
const errorTitle = ref('');

const tabs = [
  { id: 'overview', label: 'OVERVIEW' },
  { id: 'vehicle-info', label: 'VEHICLE INFO' },
  { id: 'mot', label: 'MOT' },
  { id: 'technical', label: 'TECHNICAL' },
  { id: 'build-sheet', label: 'BUILD SHEET' }
];

// Traffic light status indicators - will be updated from real data
const statusIndicators = ref([
  { id: 1, label: 'Outstanding Finance', status: 'green' },
  { id: 2, label: 'Previous Accidents', status: 'green' },
  { id: 3, label: 'Stolen Market', status: 'green' },
  { id: 4, label: 'Mileage Discrepancy', status: 'green' },
  { id: 5, label: 'Valid MOT', status: 'green' },
  { id: 6, label: 'Import/Export', status: 'green' }
]);

// MOT History computed
const motHistory = computed(() => premiumData.value?.motHistory || []);
const motSummary = computed(() => premiumData.value?.motSummary || { totalTests: 0, passedTests: 0, failedTests: 0 });

// Formatted MOT expiry date
const formattedMotExpiry = computed(() => {
  const date = vehicleData.value?.motExpiryDate || premiumData.value?.motExpiry;
  if (!date) return 'N/A';
  try {
    return new Date(date).toLocaleDateString('en-GB');
  } catch {
    return date;
  }
});

// Chart data computed properties
const mileageChartData = computed(() => {
  const mileageData = premiumData.value?.mileageHistory || [];
  return mileageData.map((m: any) => ({
    date: m.date,
    mileage: m.mileage
  }));
});

const motChartData = computed(() => {
  const history = premiumData.value?.motHistory || [];
  return history.map((m: any) => ({
    date: m.date,
    result: m.result,
    advisoryCount: m.advisories?.length || 0,
    failureCount: m.failures?.length || 0
  }));
});

// Helper function to format dates
const formatDate = (dateStr: string): string => {
  if (!dateStr) return 'N/A';
  try {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return dateStr;
  }
};

onMounted(async () => {
  if (!vrm.value) {
    router.push('/home');
    return;
  }

  try {
    loadingMessage.value = 'Loading vehicle data...';
    
    // Get basic vehicle data
    const basicData = await getCachedVehicle(vrm.value);
    if (basicData) {
      vehicleData.value = basicData;
    }

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
      
      premiumData.value = mapped;
      vehicleData.value = { ...vehicleData.value, ...mapped };
      
      // Update traffic light indicators from real data
      statusIndicators.value = calculateTrafficLightStatus(mapped);
    } else {
      errorTitle.value = 'Premium Data Not Found';
      error.value = 'No premium report found for this vehicle. Please purchase a premium check first.';
    }
  } catch (err: any) {
    errorTitle.value = 'Error Loading Report';
    error.value = err.message || 'Failed to load premium report.';
  } finally {
    loading.value = false;
  }
});
</script>
