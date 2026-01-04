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
      <h1 class="text-3xl font-bold text-primary mb-2">My Searches</h1>
      <p class="text-gray-600 mb-8">View your recent vehicle lookups.</p>

      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-12">
        <svg class="animate-spin h-8 w-8 text-primary mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="text-gray-500 text-sm">Loading your searches...</p>
      </div>

      <div v-else class="space-y-4">
        <div 
          v-for="search in recentSearches" 
          :key="search.id"
          class="border border-gray-200 rounded-lg p-4"
        >
          <div class="flex items-center justify-between mb-3">
            <div class="bg-yellow-300 px-3 py-1 rounded font-bold text-sm">
              {{ search.vrm }}
            </div>
            <span v-if="search.isPremium" class="text-xs bg-primary text-white px-2 py-1 rounded">Premium</span>
          </div>
          
          <div class="mb-3">
            <p class="font-medium text-gray-900">{{ search.make }} {{ search.model ? search.model + ' -' : '' }} {{ search.fuelType }} {{ search.year ? '- ' + search.year : '' }}</p>
            <p class="text-sm text-gray-500">Last checked: {{ search.lastChecked }}</p>
          </div>

          <div class="flex justify-end">
            <button 
              @click="viewReport(search.vrm, search.isPremium)"
              class="bg-primary text-white px-6 py-2 rounded-lg font-medium text-sm active:opacity-90"
            >
              View Report
            </button>
          </div>
        </div>

        <div v-if="recentSearches.length === 0" class="text-center py-12">
          <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <p class="text-gray-500">No recent searches</p>
          <button @click="$router.push('/home')" class="text-primary font-medium mt-2">Search for a vehicle</button>
        </div>
      </div>
    </div>

    <BottomNav />
  </div>
</template>

<script setup lang="ts">
const router = useRouter();
const supabase = useSupabaseClient();
const { user } = useAuth();

const recentSearches = ref<any[]>([]);
const loading = ref(true);

// Fetch user's recent vehicle lookups from database
const fetchRecentSearches = async () => {
  if (!user.value) return;
  
  loading.value = true;
  try {
    // Get vehicle lookups for the current user, ordered by most recent
    const { data: lookups, error } = await supabase
      .from('vehicle_lookups')
      .select('*')
      .eq('user_id', user.value.id)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) throw error;

    // Also get premium lookups to show those too
    const { data: premiumLookups } = await supabase
      .from('premium_lookups')
      .select('*')
      .eq('user_id', user.value.id)
      .order('created_at', { ascending: false });

    // Get unique VRMs from both lookups
    const allLookups = [...(lookups || [])];
    const premiumVrms = new Set((premiumLookups || []).map((p: any) => p.vrm));

    // Map to display format
    recentSearches.value = allLookups.map((lookup: any) => {
      const vehicleData = lookup.dvla_data || lookup.checkcardetails_data || {};
      return {
        id: lookup.id,
        vrm: lookup.vrm,
        make: vehicleData.make || 'Unknown',
        model: vehicleData.model || '',
        fuelType: vehicleData.fuelType || '',
        year: vehicleData.yearOfManufacture || '',
        lastChecked: new Date(lookup.created_at).toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        }),
        isPremium: premiumVrms.has(lookup.vrm)
      };
    });
  } catch (error) {
    console.error('Error fetching recent searches:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchRecentSearches();
});

const viewReport = (vrm: string, isPremium: boolean) => {
  if (isPremium) {
    router.push(`/vehicle-premium/${vrm.replace(/\s/g, '')}`);
  } else {
    router.push(`/vehicle/${vrm.replace(/\s/g, '')}`);
  }
};
</script>
