<template>
  <div class="min-h-screen bg-white flex items-center justify-center">
    <div class="text-center">
      <img src="/cvr_logo.png" alt="Check Vehicle Records" class="w-64 mx-auto mb-8" />
      <div class="flex justify-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { user } = useAuth();

onMounted(async () => {
  // Check if running in Capacitor (mobile app) via global window object
  // Don't use import('@capacitor/core') as it's excluded from the bundle
  const isCapacitor = !!(window as any).Capacitor?.isNativePlatform?.();
  
  if (isCapacitor) {
    // Mobile app - show spinner briefly then redirect to home (allow guest browsing)
    await new Promise(resolve => setTimeout(resolve, 500));
    navigateTo('/home');
  } else {
    // Web users - redirect to landing page
    navigateTo('/landing');
  }
});
</script>
