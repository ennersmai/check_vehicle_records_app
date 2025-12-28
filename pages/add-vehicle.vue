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
      <h1 class="text-3xl font-bold text-primary mb-2">Add Vehicle</h1>
      <p class="text-gray-600 text-sm mb-8">Enter your vehicle details below<br />to add it to your garage.</p>

      <form @submit.prevent="handleSave" class="space-y-4">
        <div class="relative">
          <input
            v-model="form.registrationNumber"
            type="text"
            placeholder="Registration number"
            class="w-full px-4 pr-12 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primary text-sm uppercase"
            :disabled="isScanning"
          />
          <!-- Camera Scan Button -->
          <button
            type="button"
            @click="handleScanVrm"
            :disabled="saving || isScanning"
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

        <input
          v-model="form.vinNumber"
          type="text"
          placeholder="VIN Number"
          class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primary text-sm"
        />

        <input
          v-model="form.make"
          type="text"
          placeholder="Make"
          class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primary text-sm"
        />

        <input
          v-model="form.model"
          type="text"
          placeholder="Model"
          class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primary text-sm"
        />

        <input
          v-model="form.year"
          type="text"
          placeholder="Year"
          class="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primary text-sm"
        />

        <!-- Photo Upload Placeholder -->
        <div class="bg-gray-200 rounded-lg aspect-video flex items-center justify-center">
          <svg class="w-20 h-20 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>

        <PrimaryButton type="submit" :loading="saving" class="w-full">
          SAVE
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
import { formatVrm } from '~/utils/vrmFormatter';

const router = useRouter();
const { scanVrm: performScan, isScanning } = useVrmScanner();

const form = ref({
  registrationNumber: '',
  vinNumber: '',
  make: '',
  model: '',
  year: ''
});

const saving = ref(false);
const error = ref('');

// Handle OCR scan
const handleScanVrm = async () => {
  error.value = '';
  
  const result = await performScan();
  
  if (result.success && result.vrm) {
    form.value.registrationNumber = formatVrm(result.vrm);
  } else if (result.error && result.error !== 'Scan cancelled') {
    error.value = result.error;
  }
};

const handleSave = async () => {
  if (!form.value.registrationNumber) {
    error.value = 'Registration number is required';
    return;
  }

  saving.value = true;
  error.value = '';

  try {
    // Save to Supabase garage_vehicles table
    const supabase = useSupabaseClient();
    const { user } = useAuth();
    
    if (user.value) {
      const { error: insertError } = await supabase
        .from('garage_vehicles')
        .insert({
          user_id: user.value.id,
          vrm: form.value.registrationNumber.toUpperCase().replace(/\s/g, ''),
          make: form.value.make || null,
          model: form.value.model || null,
          year: form.value.year || null,
          created_at: new Date().toISOString()
        });
      
      if (insertError) throw insertError;
    }
    
    router.push('/garage');
  } catch (err) {
    error.value = 'Failed to add vehicle';
  } finally {
    saving.value = false;
  }
};
</script>
