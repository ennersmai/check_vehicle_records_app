export default defineNuxtPlugin(async () => {
  const supabase = useSupabaseClient();
  const { user } = useAuth();

  // Restore session from localStorage before app starts
  const { data } = await supabase.auth.getSession();
  user.value = data.session?.user || null;

  // Listen for auth state changes
  supabase.auth.onAuthStateChange((event, session) => {
    user.value = session?.user || null;
  });
});
