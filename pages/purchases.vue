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
      <h1 class="text-3xl font-bold text-primary mb-2">Purchases</h1>
      <p class="text-gray-600 mb-8">View your previous purchases<br />and payment details.</p>

      <div class="space-y-4">
        <div 
          v-for="purchase in purchaseHistory" 
          :key="purchase.id"
          class="border border-gray-200 rounded-lg p-6"
        >
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 flex items-center justify-center flex-shrink-0">
              <svg v-if="purchase.icon === 'receipt'" class="w-10 h-10 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <svg v-else class="w-10 h-10" viewBox="0 0 24 24" fill="#003087">
                <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.77.77 0 0 1 .76-.633h4.606a.641.641 0 0 1 .633.74L7.836 20.704a.77.77 0 0 1-.76.633z"/>
                <path d="M23.176 21.337h-4.606a.641.641 0 0 1-.633-.74L21.044 3.72a.77.77 0 0 1 .76-.633h4.606a.641.641 0 0 1 .633.74l-3.107 16.877a.77.77 0 0 1-.76.633z" fill="#0070E0"/>
                <path d="M16.426 3.087L13.32 19.964a.77.77 0 0 1-.76.633H7.954a.641.641 0 0 1-.633-.74L10.427 2.98a.77.77 0 0 1 .76-.633h4.606a.641.641 0 0 1 .633.74z" fill="#003087"/>
              </svg>
            </div>
            
            <div class="flex-1">
              <h3 class="font-semibold text-gray-900 mb-1">{{ purchase.package }}</h3>
              <p class="text-sm text-gray-600 mb-1">Purchase date: <span class="font-medium text-gray-900">{{ purchase.date }}</span></p>
              <p class="text-sm text-gray-600">Payment: <span class="font-medium text-gray-900">{{ purchase.amount }} via {{ purchase.method }}</span></p>
            </div>
          </div>
        </div>
      </div>

      <div v-if="purchaseHistory.length === 0" class="text-center py-12">
        <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <p class="text-gray-500">No purchases yet</p>
      </div>
    </div>

    <BottomNav />
  </div>
</template>

<script setup lang="ts">
// Placeholder data - will be fetched from RevenueCat/Supabase later
const purchaseHistory = ref([
  {
    id: 1,
    package: 'Premium 5 check',
    date: 'XX/XX/XXXX',
    amount: '£xx.xx',
    method: 'Stripe',
    icon: 'receipt'
  },
  {
    id: 2,
    package: 'Premium 10 check',
    date: 'XX/XX/XXXX',
    amount: '£xx.xx',
    method: 'Stripe',
    icon: 'paypal'
  }
]);
</script>
