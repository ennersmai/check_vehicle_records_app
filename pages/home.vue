<template>
  <div class="min-h-screen bg-white pb-20">
    <div class="px-10 py-4">
      <button @click="handleBack" class="flex items-center text-gray-900 hover:text-gray-700">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>
    </div>

    <div class="flex flex-col items-center justify-center px-10 mt-12">
      <img src="/cvr_logo.png" alt="Check Vehicle Records" class="w-64 mb-8" />
      
      <p class="text-gray-600 text-center mb-6 text-sm">
        Enter your registration number<br />to view vehicle details
      </p>

      <form @submit.prevent="handleSearch" class="w-full max-w-sm space-y-4">
        <div class="relative">
          <div class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 6h18v2H3V6zm0 4h18v8a2 2 0 01-2 2H5a2 2 0 01-2-2v-8zm4 2v4h10v-4H7z"/>
            </svg>
          </div>
          <input
            v-model="vrm"
            type="text"
            placeholder="ENTER REGISTRATION NUMBER"
            class="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primary uppercase text-sm placeholder:text-gray-400"
            maxlength="8"
            :disabled="loading || isScanning"
          />
          <!-- Camera Scan Button -->
          <button
            type="button"
            @click="handleScanVrm"
            :disabled="loading || isScanning"
            class="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-500 hover:text-primary transition-colors disabled:opacity-50"
            title="Scan registration plate"
          >
            <svg v-if="!isScanning" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <svg v-else class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </button>
        </div>

        <!-- Scan hint -->
        <p class="text-xs text-gray-400 text-center -mt-2">
          Tap <span class="inline-flex items-center"><svg class="w-3 h-3 mx-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg></span> to scan number plate
        </p>

        <PrimaryButton type="submit" :loading="loading" class="w-full">
          {{ loadingMessage || 'CHECK VEHICLE' }}
        </PrimaryButton>
      </form>

      <!-- Loading State -->
      <div v-if="loading" class="mt-6 text-center">
        <div class="inline-flex items-center text-primary">
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span class="text-sm">{{ loadingMessage }}</span>
        </div>
      </div>

      <!-- Error State -->
      <div v-if="error" class="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
        <div class="flex items-start">
          <svg class="w-5 h-5 text-red-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p class="text-red-700 text-sm font-medium">{{ errorTitle }}</p>
            <p class="text-red-600 text-xs mt-1">{{ error }}</p>
          </div>
        </div>
      </div>
    </div>

    <BottomNav />
  </div>
</template>

<script setup lang="ts">
import { formatVrm } from '~/utils/vrmFormatter';

const { user, signOut } = useAuth();
const { lookupVehicle } = useVehicle();
const { scanVrm: performScan, isScanning } = useVrmScanner();
const router = useRouter();

const vrm = ref('');
const loading = ref(false);
const error = ref('');
const errorTitle = ref('');
const loadingMessage = ref('');

const handleBack = async () => {
  await signOut();
  router.push('/login');
};

const handleSearch = async () => {
  if (!vrm.value || vrm.value.length < 2) {
    errorTitle.value = 'Invalid Registration';
    error.value = 'Please enter a valid registration number (minimum 2 characters)';
    return;
  }

  error.value = '';
  errorTitle.value = '';
  loading.value = true;
  loadingMessage.value = 'Checking cache...';

  try {
    const result = await lookupVehicle(vrm.value);
    
    if (result.success) {
      // Update loading message based on source
      if (result.source === 'cache') {
        loadingMessage.value = 'Found in cache!';
      } else if (result.source === 'dvla') {
        loadingMessage.value = 'Retrieved from DVLA';
      } else {
        loadingMessage.value = 'Vehicle found!';
      }
      
      // Small delay to show success message
      await new Promise(resolve => setTimeout(resolve, 300));
      
      router.push(`/confirm-vehicle/${vrm.value.toUpperCase().replace(/\s/g, '')}`);
    } else {
      // Handle specific error types using errorCode
      switch (result.errorCode) {
        case 'NOT_FOUND':
          errorTitle.value = 'Vehicle Not Found';
          error.value = 'No vehicle found with this registration number. Please check and try again.';
          break;
        case 'INVALID_VRM':
          errorTitle.value = 'Invalid Registration';
          error.value = 'The registration number format is invalid. Please enter a valid UK registration.';
          break;
        case 'API_ERROR':
          errorTitle.value = 'Service Unavailable';
          error.value = 'The vehicle lookup service is temporarily unavailable. Please try again later.';
          break;
        default:
          // Fallback to message-based detection
          if (result.error?.includes('not found')) {
            errorTitle.value = 'Vehicle Not Found';
            error.value = 'No vehicle found with this registration number. Please check and try again.';
          } else if (result.error?.includes('rate') || result.error?.includes('throttle')) {
            errorTitle.value = 'Service Busy';
            error.value = 'The service is temporarily busy. Please try again in a moment.';
          } else {
            errorTitle.value = 'Lookup Failed';
            error.value = result.error || 'Unable to retrieve vehicle information. Please try again.';
          }
      }
    }
  } catch (err: any) {
    errorTitle.value = 'Connection Error';
    error.value = 'Unable to connect to the server. Please check your internet connection.';
  } finally {
    loading.value = false;
    loadingMessage.value = '';
  }
};

// Handle OCR scan
const handleScanVrm = async () => {
  error.value = '';
  errorTitle.value = '';
  
  const result = await performScan();
  
  if (result.success && result.vrm) {
    // Auto-fill the scanned VRM (formatted)
    vrm.value = formatVrm(result.vrm);
    
    // Optional: Auto-submit after successful scan
    // Uncomment the next line to auto-search after scan:
    // await handleSearch();
  } else if (result.error && result.error !== 'Scan cancelled') {
    errorTitle.value = 'Scan Failed';
    error.value = result.error;
  }
};

onMounted(() => {
  if (!user.value) {
    router.push('/login');
  }
});
</script>
