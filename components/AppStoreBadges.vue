<template>
  <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
    <!-- Google Play Badge -->
    <a :href="googlePlayUrl" target="_blank" rel="noopener noreferrer"
       class="group bg-black text-white pl-4 pr-6 py-2.5 rounded-xl flex items-center space-x-3 hover:bg-gray-900 transition shadow-md hover:shadow-lg min-w-[200px]">
      <!-- Colored Google Play triangle logo -->
      <svg class="w-8 h-8 flex-shrink-0" viewBox="0 0 512 512" fill="none">
        <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1z" fill="#EA4335"/>
        <path d="M47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0z" fill="#4285F4"/>
        <path d="M507.4 236.6L406.8 174l-81.5 81.9 81.5 82 100.6-62.5c13-7.8 20.7-22 20.7-38.8s-7.7-31-20.7-38.8v-.2z" fill="#FBBC04"/>
        <path d="M104.6 499l280.8-161.2-60.1-60.1L104.6 499z" fill="#34A853"/>
      </svg>
      <div class="text-left">
        <div class="text-[10px] uppercase tracking-widest text-gray-300 group-hover:text-gray-200">Get it on</div>
        <div class="text-lg font-semibold -mt-0.5 tracking-tight">Google Play</div>
      </div>
    </a>

    <!-- App Store Badge -->
    <a :href="appStoreUrl" target="_blank" rel="noopener noreferrer"
       class="group bg-black text-white pl-4 pr-6 py-2.5 rounded-xl flex items-center space-x-3 hover:bg-gray-900 transition shadow-md hover:shadow-lg min-w-[200px]">
      <!-- Apple logo -->
      <svg class="w-7 h-7 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.1 22C7.79 22.05 6.8 20.68 5.96 19.47C4.25 17 2.94 12.45 4.7 9.39C5.57 7.87 7.13 6.91 8.82 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z"/>
      </svg>
      <div class="text-left">
        <div class="text-[10px] uppercase tracking-widest text-gray-300 group-hover:text-gray-200">Download on the</div>
        <div class="text-lg font-semibold -mt-0.5 tracking-tight">App Store</div>
      </div>
    </a>
  </div>
</template>

<script setup lang="ts">
defineProps({
  googlePlayUrl: {
    type: String,
    default: 'https://play.google.com/store/apps/details?id=com.cvr.app'
  },
  appStoreUrl: {
    type: String,
    default: 'https://apps.apple.com/app/check-vehicle-records/id6758524961'
  }
});
</script>
