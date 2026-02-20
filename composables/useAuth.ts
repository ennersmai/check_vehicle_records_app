export const useAuth = () => {
  const supabase = useSupabaseClient();
  const user = useState('user', () => null);
  const loading = useState('auth-loading', () => false);

  const signIn = async (email: string, password: string) => {
    loading.value = true;
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      user.value = data.user;
      return { success: true, user: data.user };
    } catch (error: any) {
      return { success: false, error: error.message, user: null };
    } finally {
      loading.value = false;
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    loading.value = true;
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name }
        }
      });
      
      if (error) throw error;
      user.value = data.user;
      return { success: true, user: data.user };
    } catch (error: any) {
      return { success: false, error: error.message, user: null };
    } finally {
      loading.value = false;
    }
  };

  const signOut = async () => {
    loading.value = true;
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      user.value = null;
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      loading.value = false;
    }
  };

  const resetPassword = async (email: string) => {
    loading.value = true;
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      loading.value = false;
    }
  };

  const updatePassword = async (newPassword: string) => {
    loading.value = true;
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      loading.value = false;
    }
  };

  const checkAuth = async () => {
    const { data } = await supabase.auth.getSession();
    user.value = data.session?.user || null;
  };

  const deleteAccount = async () => {
    loading.value = true;
    try {
      const { error } = await supabase.functions.invoke('delete_account');
      if (error) throw error;
      user.value = null;
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    } finally {
      loading.value = false;
    }
  };

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    checkAuth,
    deleteAccount
  };
};
