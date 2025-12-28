import type { UserActivity, ActivityType } from '~/types';

export const useUserActivity = () => {
  const supabase = useSupabaseClient();
  const { user } = useAuth();

  const addActivity = async (vrm: string, type: ActivityType, nickname?: string) => {
    if (!user.value) return { success: false, error: 'Not authenticated' };

    try {
      const { data, error } = await supabase
        .from('user_activity')
        .insert({
          user_id: user.value.id,
          vrm: vrm.toUpperCase(),
          type,
          nickname
        })
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const getSearchHistory = async (): Promise<UserActivity[]> => {
    if (!user.value) return [];

    try {
      const { data, error } = await supabase
        .from('user_activity')
        .select(`
          *,
          vehicle:vehicles(*)
        `)
        .eq('user_id', user.value.id)
        .eq('type', 'SEARCH')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as UserActivity[];
    } catch (error) {
      return [];
    }
  };

  const getGarage = async (): Promise<UserActivity[]> => {
    if (!user.value) return [];

    try {
      const { data, error } = await supabase
        .from('user_activity')
        .select(`
          *,
          vehicle:vehicles(*)
        `)
        .eq('user_id', user.value.id)
        .eq('type', 'GARAGE')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as UserActivity[];
    } catch (error) {
      return [];
    }
  };

  const updateActivity = async (id: string, nickname: string) => {
    try {
      const { error } = await supabase
        .from('user_activity')
        .update({ nickname })
        .eq('id', id);

      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const deleteActivity = async (id: string) => {
    try {
      const { error } = await supabase
        .from('user_activity')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  return {
    addActivity,
    getSearchHistory,
    getGarage,
    updateActivity,
    deleteActivity
  };
};
