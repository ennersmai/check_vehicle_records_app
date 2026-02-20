<template>
  <div class="min-h-screen bg-white pb-36">
    <div class="px-6 pt-8 py-4">
      <button @click="$router.back()" class="flex items-center text-gray-900 hover:text-gray-700">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>
    </div>

    <div class="px-10 mt-8">
      <h1 class="text-3xl font-bold text-primary mb-2">Add Vehicle</h1>
      <p class="text-gray-600 text-sm mb-8">Enter the registration number to look up<br />and add a vehicle to your garage.</p>

      <form @submit.prevent="handleLookup" class="space-y-4">
        <div class="relative">
          <input
            v-model="vrm"
            type="text"
            placeholder="Registration number"
            class="w-full px-4 pr-12 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primary text-sm uppercase"
            :disabled="isScanning || loading"
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

        <!-- Scan Instructions Modal -->
        <div v-if="showScanModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-6" @click.self="showScanModal = false">
          <div class="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <div class="text-center mb-4">
              <div class="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg class="w-7 h-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-gray-900">Scan Tips</h3>
            </div>
            <ul class="text-sm text-gray-600 space-y-2 mb-5">
              <li class="flex items-start gap-2">
                <span class="text-primary font-bold mt-0.5">1.</span>
                <span>Hold your phone <strong>straight</strong> and level, facing the plate directly</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-primary font-bold mt-0.5">2.</span>
                <span>Ensure the plate is <strong>clearly visible</strong> and well-lit</span>
              </li>
              <li class="flex items-start gap-2">
                <span class="text-primary font-bold mt-0.5">3.</span>
                <span>Get close enough so the plate fills most of the frame</span>
              </li>
            </ul>
            <div class="flex gap-3">
              <button @click="showScanModal = false" class="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 font-medium">Cancel</button>
              <button @click="confirmScan" class="flex-1 py-2.5 bg-primary text-white rounded-lg text-sm font-medium">Open Camera</button>
            </div>
          </div>
        </div>

        <PrimaryButton type="submit" :loading="loading" class="w-full">
          LOOK UP VEHICLE
        </PrimaryButton>

        <div v-if="error" class="text-red-600 text-sm text-center">
          {{ error }}
        </div>
      </form>
    </div>

    <BottomNav />
  </div>
</template>

<script setup lang="ts">
const router = useRouter();
const { user } = useAuth();
const { lookupVehicle } = useVehicle();

const vrm = ref('');
const loading = ref(false);
const error = ref('');
const showScanModal = ref(false);
const isScanning = ref(false);

// Check login on mount - add vehicle requires auth
onMounted(() => {
  if (!user.value) {
    router.push('/login?redirect=/add-vehicle');
  }
});

// Handle OCR scan - show instruction modal first
const handleScanVrm = () => {
  error.value = '';
  showScanModal.value = true;
};

// User confirmed scan from modal - open camera
const confirmScan = async () => {
  showScanModal.value = false;
  isScanning.value = true;
  
  try {
    const { scanVrm } = useVrmScanner();
    const result = await scanVrm();
    
    if (result.success && result.vrm) {
      vrm.value = result.vrm.toUpperCase().replace(/\s/g, '');
    } else if (result.error && result.error !== 'Scan cancelled') {
      error.value = result.error;
    }
  } catch (err: any) {
    error.value = err.message || 'Camera error';
  } finally {
    isScanning.value = false;
  }
};

const handleLookup = async () => {
  if (!vrm.value) {
    error.value = 'Registration number is required';
    return;
  }

  loading.value = true;
  error.value = '';

  try {
    const cleanVrm = vrm.value.toUpperCase().replace(/\s/g, '');
    
    // Do basic DVLA lookup
    const result = await lookupVehicle(cleanVrm);
    
    if (result.success) {
      // Redirect to confirm page where user can view info and purchase premium
      router.push(`/confirm-vehicle/${cleanVrm}`);
    } else {
      error.value = result.error || 'Vehicle not found';
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to look up vehicle';
  } finally {
    loading.value = false;
  }
};
</script>
