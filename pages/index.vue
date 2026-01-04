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
  // Small delay for UI smoothness
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Auth is already initialized by plugin, just check user state
  if (user.value) {
    navigateTo('/home');
  } else {
    navigateTo('/login');
  }
});
</script>
