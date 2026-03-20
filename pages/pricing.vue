<template>
  <div class="min-h-screen bg-white font-sans">
    <WebNav />

    <!-- Pricing Content -->
    <section class="py-16 md:py-24 bg-gray-50 min-h-[70vh] flex items-center">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <h1 class="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">
          What do you get with a premium report?
        </h1>

        <!-- Checklist -->
        <ul class="space-y-6 mb-14">
          <li v-for="item in premiumFeatures" :key="item" class="flex items-start space-x-4">
            <svg class="w-7 h-7 text-primary flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
              <path d="M7.5 12l3.5 3.5 5.5-5.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="text-gray-700 text-base">{{ item }}</span>
          </li>
        </ul>

        <!-- CTA Button -->
        <div class="flex justify-center">
          <button
            @click="navigateTo('/login')"
            class="bg-primary hover:bg-primary-link text-white font-bold text-sm tracking-wider px-10 py-4 rounded transition"
          >
            GO TO PREMIUM CHECK
          </button>
        </div>
      </div>
    </section>

    <WebFooter />
  </div>
</template>

<script setup lang="ts">
const premiumFeatures = [
  'An enhanced vehicle check using multiple data sources',
  'Runs a check to see if the vehicle has had any prior accidents and if it has been categorised as a write off',
  'Runs a check to see if the vehicle has any outstanding finance',
  'Checks multiple data sources for mileage discrepancies.',
  'Checks if the vehicle has been stolen',
  'Checks if vehicle has been imported / exported',
  'Checks for previous owners',
  'Checks for recalls',
  'Current market valuation',
];
</script>
