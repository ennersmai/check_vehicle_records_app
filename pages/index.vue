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
const { checkAuth, user } = useAuth();

onMounted(async () => {
  await checkAuth();
  
  setTimeout(() => {
    if (user.value) {
      navigateTo('/home');
    } else {
      navigateTo('/login');
    }
  }, 2000);
});
</script>
