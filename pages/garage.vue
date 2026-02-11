<template>
  <div class="min-h-screen bg-white pb-20">
    <div class="px-6 pt-8 py-4 flex items-center justify-between">
      <button @click="$router.back()" class="flex items-center text-gray-900 hover:text-gray-700">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back
      </button>
      
      <button @click="addVehicle" class="text-primary">
        <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>
    </div>

    <div class="px-10 mt-8">
      <h1 class="text-3xl font-bold text-primary mb-8">My Garage</h1>

      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-12">
        <svg class="animate-spin h-8 w-8 text-primary mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="text-gray-500 text-sm">Loading your garage...</p>
      </div>

      <div v-else class="space-y-4">
        <div 
          v-for="vehicle in garageVehicles" 
          :key="vehicle.id"
          class="border border-gray-200 rounded-lg p-4"
        >
          <div class="flex items-start gap-4 mb-4">
            <div class="w-20 h-20 bg-gray-800 rounded flex items-center justify-center flex-shrink-0 overflow-hidden" @click="vehicle.imageUrl && openFullscreen(vehicle.imageUrl)">
              <img v-if="vehicle.imageUrl && !brokenImages[vehicle.id]" :src="vehicle.imageUrl" @error="brokenImages[vehicle.id] = true" alt="Vehicle" class="w-full h-full object-contain cursor-pointer" />
              <CarSilhouette v-else :bodyStyle="vehicle.bodyStyle" class="w-12 h-12 text-white" />
            </div>
            
            <div class="flex-1">
              <div class="bg-yellow-300 px-3 py-1 rounded font-bold text-sm inline-block mb-2">
                {{ vehicle.vrm }}
              </div>
              <p class="text-xs text-gray-600 mb-1">{{ vehicle.make }} {{ vehicle.model }}</p>
              <div class="space-y-1">
                <p class="text-sm text-gray-600">MOT expires <span class="font-medium text-gray-900">{{ vehicle.motExpiry }}</span></p>
              </div>
            </div>
          </div>

          <div class="flex gap-2">
            <button 
              @click="confirmDelete(vehicle)"
              class="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors active:opacity-90"
              title="Delete vehicle"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
            <button 
              @click="viewReport(vehicle.vrm)"
              class="flex-1 bg-primary text-white px-4 py-2 rounded-lg font-medium text-sm active:opacity-90"
            >
              View Report
            </button>
            <button 
              @click="editVehicle(vehicle.vrm)"
              class="flex-1 bg-gray-800 text-white px-4 py-2 rounded-lg font-medium text-sm active:opacity-90"
            >
              Details
            </button>
          </div>
        </div>

        <div v-if="garageVehicles.length === 0" class="text-center py-12">
          <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M22 9V20H20V11H4V20H2V9L12 5L22 9M19 12H5V14H19V12M19 18H5V20H19V18M19 15H5V17H19V15Z" />
          </svg>
          <p class="text-gray-500 mb-4">No vehicles in your garage</p>
          <p class="text-gray-400 text-sm mb-4">Premium vehicle lookups will appear here</p>
          <button 
            @click="addVehicle"
            class="text-primary font-medium"
          >
            Search for a vehicle
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-6" @click.self="showDeleteModal = false">
      <div class="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
        <div class="text-center mb-4">
          <div class="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg class="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900">Remove Vehicle</h3>
          <p class="text-sm text-gray-500 mt-2">Are you sure you want to remove <strong>{{ deleteTarget?.vrm }}</strong> from your garage? This cannot be undone.</p>
        </div>
        <div class="flex gap-3">
          <button @click="showDeleteModal = false" class="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 font-medium">Cancel</button>
          <button @click="deleteVehicle" :disabled="deleting" class="flex-1 py-2.5 bg-red-500 text-white rounded-lg text-sm font-medium disabled:opacity-50">
            {{ deleting ? 'Removing...' : 'Remove' }}
          </button>
        </div>
      </div>
    </div>

    <BottomNav />

    <!-- Fullscreen Image Modal -->
    <FullscreenImageModal 
      :imageUrl="fullscreenImage" 
      :scale="imageScale" 
      :translateX="imageTranslateX" 
      :translateY="imageTranslateY"
      @close="closeFullscreen"
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd"
    />
  </div>
</template>

<script setup lang="ts">
import { useFullscreenImage } from '~/composables/useFullscreenImage';
const router = useRouter();
const supabase = useSupabaseClient();
const { user } = useAuth();
const { 
  fullscreenImage, 
  imageScale, 
  imageTranslateX, 
  imageTranslateY, 
  openFullscreen, 
  closeFullscreen, 
  handleTouchStart, 
  handleTouchMove, 
  handleTouchEnd 
} = useFullscreenImage();

const garageVehicles = ref<any[]>([]);
const brokenImages = reactive<Record<string, boolean>>({});
const loading = ref(true);

// Fetch user's premium lookups as their "garage" vehicles
const fetchGarageVehicles = async () => {
  if (!user.value) return;
  
  loading.value = true;
  try {
    // Get premium lookups for the current user (these are their saved vehicles)
    const { data: premiumLookups, error } = await supabase
      .from('premium_lookups')
      .select('*, vehicle_lookups!inner(*)')
      .eq('user_id', user.value.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Map to display format
    garageVehicles.value = (premiumLookups || []).map((lookup: any) => {
      const vehicleData = lookup.vehicle_lookups?.dvla_data || lookup.vehicle_lookups?.checkcardetails_data || {};
      const motData = lookup.mot_data;
      const imageUrl = lookup.image_data?.VehicleImages?.ImageDetailsList?.[0]?.ImageUrl || 
                       lookup.vehicle_lookups?.image_data?.VehicleImages?.ImageDetailsList?.[0]?.ImageUrl || null;
      
      // Get MOT expiry from various sources
      let motExpiry = 'N/A';
      if (motData?.mot?.motDueDate) {
        motExpiry = new Date(motData.mot.motDueDate).toLocaleDateString('en-GB');
      } else if (vehicleData.motExpiryDate) {
        motExpiry = new Date(vehicleData.motExpiryDate).toLocaleDateString('en-GB');
      }
      
      return {
        id: lookup.id,
        vrm: lookup.vrm,
        make: vehicleData.make || 'Unknown',
        model: vehicleData.model || '',
        bodyStyle: vehicleData.bodyStyle || 'saloon',
        motExpiry,
        imageUrl,
        serviceDue: 'N/A' // Service tracking not implemented yet
      };
    });
  } catch (error) {
    console.error('Error fetching garage vehicles:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchGarageVehicles();
});

const viewReport = (vrm: string) => {
  router.push(`/vehicle-premium/${vrm.replace(/\s/g, '')}`);
};

const editVehicle = (vrm: string) => {
  router.push(`/vehicle-full-report/${vrm.replace(/\s/g, '')}`);
};

const addVehicle = () => {
  router.push('/add-vehicle');
};

const showDeleteModal = ref(false);
const deleteTarget = ref<any>(null);
const deleting = ref(false);

const confirmDelete = (vehicle: any) => {
  deleteTarget.value = vehicle;
  showDeleteModal.value = true;
};

const deleteVehicle = async () => {
  if (!deleteTarget.value || !user.value) return;
  
  deleting.value = true;
  try {
    const { error } = await (supabase as any)
      .from('premium_lookups')
      .delete()
      .eq('id', deleteTarget.value.id)
      .eq('user_id', user.value.id);

    if (error) throw error;

    garageVehicles.value = garageVehicles.value.filter((v: any) => v.id !== deleteTarget.value.id);
    showDeleteModal.value = false;
    deleteTarget.value = null;
  } catch (err) {
    console.error('Error deleting vehicle from garage:', err);
  } finally {
    deleting.value = false;
  }
};
</script>
