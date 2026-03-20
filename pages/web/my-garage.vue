<template>
  <div class="min-h-screen bg-white font-sans">
    <WebNav />

    <section class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      <h1 class="text-3xl font-bold text-primary mb-2">My Garage</h1>
      <p class="text-gray-500 mb-10">Your saved vehicles and premium reports.</p>

      <!-- Not Logged In -->
      <div v-if="!user" class="text-center py-20">
        <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <p class="text-gray-500 mb-4">Log in to view your garage</p>
        <NuxtLink to="/login?redirect=/web/my-garage" class="text-primary font-medium hover:underline">Log In</NuxtLink>
      </div>

      <!-- Loading -->
      <div v-else-if="loading" class="flex flex-col items-center justify-center py-20">
        <svg class="animate-spin h-8 w-8 text-primary mb-4" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="text-gray-500 text-sm">Loading your garage...</p>
      </div>

      <!-- Vehicles Grid -->
      <div v-else>
        <div v-if="garageVehicles.length > 0" class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="vehicle in garageVehicles"
            :key="vehicle.id"
            class="border border-gray-200 rounded-xl p-5 hover:shadow-md transition"
          >
            <!-- Image -->
            <div class="w-full h-36 bg-gray-100 rounded-lg flex items-center justify-center mb-4 overflow-hidden" :class="{ 'cursor-pointer': vehicle.imageUrl && !brokenImages[vehicle.id] }" @click="vehicle.imageUrl && !brokenImages[vehicle.id] && openImage(vehicle.imageUrl)">
              <img v-if="vehicle.imageUrl && !brokenImages[vehicle.id]" :src="vehicle.imageUrl" @error="brokenImages[vehicle.id] = true" alt="Vehicle" class="w-full h-full object-contain" />
              <CarSilhouette v-else :bodyStyle="vehicle.bodyStyle" class="w-16 h-16 text-gray-300" />
            </div>

            <!-- VRM badge -->
            <div class="bg-yellow-300 px-3 py-1 rounded font-bold text-sm inline-block mb-2">
              {{ vehicle.vrm }}
            </div>

            <!-- Info -->
            <p class="text-sm text-gray-700 font-medium">{{ vehicle.make }} {{ vehicle.model }}</p>
            <p class="text-xs text-gray-500 mb-3">MOT expires: {{ vehicle.motExpiry }}</p>

            <!-- Premium badge -->
            <div v-if="vehicle.hasPremium" class="mb-3">
              <span class="text-xs bg-primary text-white px-2 py-1 rounded">Premium Report</span>
            </div>

            <!-- Actions -->
            <div class="flex gap-2">
              <button
                @click="confirmDelete(vehicle)"
                class="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                title="Remove vehicle"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
              <button
                v-if="vehicle.hasPremium"
                @click="viewReport(vehicle.vrm)"
                class="flex-1 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-link transition"
              >
                View Report
              </button>
              <button
                v-else
                @click="getPremium(vehicle.vrm)"
                class="flex-1 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-link transition"
              >
                Get Premium
              </button>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div v-else class="text-center py-20">
          <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M22 9V20H20V11H4V20H2V9L12 5L22 9M19 12H5V14H19V12M19 18H5V20H19V18M19 15H5V17H19V15Z" />
          </svg>
          <p class="text-gray-500 mb-2">No vehicles in your garage</p>
          <p class="text-gray-400 text-sm">Your vehicle lookups will appear here</p>
        </div>
      </div>
    </section>

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
          <p class="text-sm text-gray-500 mt-2">Are you sure you want to remove <strong>{{ deleteTarget?.vrm }}</strong> from your garage?</p>
        </div>
        <div class="flex gap-3">
          <button @click="showDeleteModal = false" class="flex-1 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-600 font-medium">Cancel</button>
          <button @click="deleteVehicle" :disabled="deleting" class="flex-1 py-2.5 bg-red-500 text-white rounded-lg text-sm font-medium disabled:opacity-50">
            {{ deleting ? 'Removing...' : 'Remove' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Web Image Viewer -->
    <WebImageViewer
      :imageUrl="viewerImage"
      @close="viewerImage = null"
    />

    <WebFooter />
  </div>
</template>

<script setup lang="ts">
const router = useRouter();
const supabase = useSupabaseClient();
const { user } = useAuth();

const garageVehicles = ref<any[]>([]);
const brokenImages = reactive<Record<string, boolean>>({});
const loading = ref(true);
const viewerImage = ref<string | null>(null);

const openImage = (url: string) => {
  viewerImage.value = url;
};

const fetchGarageVehicles = async () => {
  if (!user.value) return;
  loading.value = true;
  try {
    const { data: vehicleLookups, error: lookupError } = await (supabase as any)
      .from('vehicle_lookups')
      .select('*')
      .eq('user_id', user.value.id)
      .order('created_at', { ascending: false });

    if (lookupError) throw lookupError;

    const { data: premiumLookups, error: premiumError } = await (supabase as any)
      .from('premium_lookups')
      .select('vrm')
      .eq('user_id', user.value.id);

    if (premiumError) throw premiumError;

    const premiumVrms = new Set((premiumLookups || []).map((p: any) => p.vrm));

    garageVehicles.value = (vehicleLookups || []).map((lookup: any) => {
      const vehicleData = lookup.dvla_data || lookup.checkcardetails_data || {};
      const imageUrl = lookup.image_data?.base64Image ||
                       lookup.image_data?.VehicleImages?.ImageDetailsList?.[0]?.ImageUrl || null;

      let motExpiry = 'N/A';
      if (vehicleData.motExpiryDate) {
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
        hasPremium: premiumVrms.has(lookup.vrm)
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

const getPremium = (vrm: string) => {
  router.push(`/purchase-premium?vrm=${vrm.replace(/\s/g, '')}`);
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
      .from('vehicle_lookups')
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
