<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient();
const { user } = useAuth();

// Initialize auth immediately (before mount)
const initAuth = async () => {
  const { data } = await supabase.auth.getSession();
  user.value = data.session?.user || null;
  
  // Listen for auth state changes
  supabase.auth.onAuthStateChange((event, session) => {
    user.value = session?.user || null;
  });
};

// Run auth initialization immediately
await initAuth();
</script>
