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
  // Check if running in Capacitor (mobile app) - only on client side
  let isCapacitor = false;
  
  if (process.client) {
    try {
      const { Capacitor } = await import('@capacitor/core');
      isCapacitor = Capacitor.isNativePlatform();
    } catch {
      // Capacitor not available (web environment)
      isCapacitor = false;
    }
  }
  
  if (isCapacitor) {
    // Mobile app logic - redirect to app screens
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (user.value) {
      navigateTo('/home');
    } else {
      navigateTo('/login');
    }
  } else {
    // Web users - redirect to landing page
    navigateTo('/landing');
  }
});
</script>
