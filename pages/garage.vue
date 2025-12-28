<template>
  <div class="min-h-screen bg-white pb-20">
    <div class="px-10 py-4 flex items-center justify-between">
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

      <div class="space-y-4">
        <div 
          v-for="vehicle in garageVehicles" 
          :key="vehicle.id"
          class="border border-gray-200 rounded-lg p-4"
        >
          <div class="flex items-start gap-4 mb-4">
            <div class="w-20 h-20 bg-gray-800 rounded flex items-center justify-center flex-shrink-0">
              <CarSilhouette :bodyStyle="vehicle.bodyStyle" class="w-12 h-12 text-white" />
            </div>
            
            <div class="flex-1">
              <div class="bg-yellow-300 px-3 py-1 rounded font-bold text-sm inline-block mb-2">
                {{ vehicle.vrm }}
              </div>
              <div class="space-y-1">
                <p class="text-sm text-gray-600">MOT expires <span class="font-medium text-gray-900">{{ vehicle.motExpiry }}</span></p>
                <p class="text-sm text-gray-600">Service due <span class="font-medium text-gray-900">{{ vehicle.serviceDue }}</span></p>
              </div>
            </div>
          </div>

          <div class="flex gap-2">
            <button 
              @click="viewReport(vehicle.vrm)"
              class="flex-1 bg-primary text-white px-4 py-2 rounded-lg font-medium text-sm active:opacity-90"
            >
              View Report
            </button>
            <button 
              @click="editVehicle(vehicle.id)"
              class="flex-1 bg-gray-800 text-white px-4 py-2 rounded-lg font-medium text-sm active:opacity-90"
            >
              Edit
            </button>
          </div>
        </div>
      </div>

      <div v-if="garageVehicles.length === 0" class="text-center py-12">
        <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M22 9V20H20V11H4V20H2V9L12 5L22 9M19 12H5V14H19V12M19 18H5V20H19V18M19 15H5V17H19V15Z" />
        </svg>
        <p class="text-gray-500 mb-4">No vehicles in your garage</p>
        <button 
          @click="addVehicle"
          class="text-primary-link font-medium"
        >
          Add your first vehicle
        </button>
      </div>
    </div>

    <BottomNav />
  </div>
</template>

<script setup lang="ts">
const router = useRouter();

// Placeholder data - will be fetched from Supabase later
const garageVehicles = ref([
  {
    id: 1,
    vrm: 'AB13 XYZ',
    bodyStyle: 'saloon',
    motExpiry: 'XX/XX/XXXX',
    serviceDue: 'XX/XX/XXXX'
  },
  {
    id: 2,
    vrm: 'AB13 XYZ',
    bodyStyle: 'hatchback',
    motExpiry: 'XX/XX/XXXX',
    serviceDue: 'XX/XX/XXXX'
  },
  {
    id: 3,
    vrm: 'AB13 XYZ',
    bodyStyle: 'suv',
    motExpiry: 'XX/XX/XXXX',
    serviceDue: 'XX/XX/XXXX'
  }
]);

const viewReport = (vrm: string) => {
  router.push(`/vehicle/${vrm.replace(/\s/g, '')}`);
};

const editVehicle = (id: number) => {
  // Navigate to vehicle details for editing
  const vehicle = savedVehicles.value.find(v => v.id === id);
  if (vehicle) {
    router.push(`/vehicle/${vehicle.vrm}`);
  }
};

const addVehicle = () => {
  router.push('/add-vehicle');
};
</script>
