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

  // Handle Supabase auth redirects that land on root (e.g. recovery emails)
  const hash = window.location.hash;
  const hashParams = new URLSearchParams(hash.substring(1));
  const type = hashParams.get('type');
  const accessToken = hashParams.get('access_token');
  const code = new URLSearchParams(window.location.search).get('code');

  if (type === 'recovery' && accessToken) {
    // Implicit flow: #access_token=...&type=recovery — forward to reset-password with hash intact
    navigateTo('/reset-password' + hash);
    return;
  }
  if (code) {
    // PKCE flow: ?code=... — forward to reset-password with query params preserved
    navigateTo('/reset-password' + window.location.search);
    return;
  }

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
