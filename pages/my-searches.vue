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

      <div class="space-y-4">
        <div 
          v-for="search in recentSearches" 
          :key="search.id"
          class="border border-gray-200 rounded-lg p-4"
        >
          <div class="flex items-center justify-between mb-3">
            <div class="bg-yellow-300 px-3 py-1 rounded font-bold text-sm">
              {{ search.vrm }}
            </div>
          </div>
          
          <div class="mb-3">
            <p class="font-medium text-gray-900">{{ search.make }} {{ search.model }} - {{ search.fuelType }} - {{ search.year }}</p>
            <p class="text-sm text-gray-500">Last checked: {{ search.lastChecked }}</p>
          </div>

          <div class="flex justify-end">
            <button 
              @click="viewReport(search.vrm)"
              class="bg-primary text-white px-6 py-2 rounded-lg font-medium text-sm active:opacity-90"
            >
              View Report
            </button>
          </div>
        </div>
      </div>

      <div v-if="recentSearches.length === 0" class="text-center py-12">
        <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <p class="text-gray-500">No recent searches</p>
      </div>
    </div>

    <BottomNav />
  </div>
</template>

<script setup lang="ts">
const router = useRouter();

// Placeholder data - will be fetched from Supabase later
const recentSearches = ref([
  {
    id: 1,
    vrm: 'AB13 XYZ',
    make: 'Ford',
    model: 'Focus',
    fuelType: 'Petrol',
    year: '2017',
    lastChecked: '25 Oct 2025'
  },
  {
    id: 2,
    vrm: 'AB13 XYZ',
    make: 'Ford',
    model: 'Focus',
    fuelType: 'Petrol',
    year: '2017',
    lastChecked: '25 Oct 2025'
  },
  {
    id: 3,
    vrm: 'AB13 XYZ',
    make: 'Ford',
    model: 'Focus',
    fuelType: 'Petrol',
    year: '2017',
    lastChecked: '25 Oct 2025'
  }
]);

const viewReport = (vrm: string) => {
  router.push(`/vehicle/${vrm.replace(/\s/g, '')}`);
};
</script>
