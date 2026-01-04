<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient();
const { user, checkAuth } = useAuth();

// Restore auth session on app initialization
onMounted(async () => {
  await checkAuth();
  
  // Listen for auth state changes
  supabase.auth.onAuthStateChange((event, session) => {
    user.value = session?.user || null;
  });
});
</script>
