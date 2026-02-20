/**
 * Session Lookups Composable
 * Tracks VRMs looked up before login and associates them with user after authentication
 */

const SESSION_LOOKUPS_KEY = 'cvr_session_lookups';

export const useSessionLookups = () => {
  const supabase = useSupabaseClient();

  /**
   * Add a VRM to session lookups (call after successful lookup)
   */
  const addSessionLookup = (vrm: string) => {
    if (typeof window === 'undefined') return;
    
    const normalizedVrm = vrm.toUpperCase().replace(/\s/g, '');
    const existing = getSessionLookups();
    
    if (!existing.includes(normalizedVrm)) {
      existing.push(normalizedVrm);
      localStorage.setItem(SESSION_LOOKUPS_KEY, JSON.stringify(existing));
      console.log('[SessionLookups] Added VRM:', normalizedVrm, 'Total:', existing.length + 1);
    }
  };

  /**
   * Get all session lookups
   */
  const getSessionLookups = (): string[] => {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem(SESSION_LOOKUPS_KEY);
      const vrms = stored ? JSON.parse(stored) : [];
      console.log('[SessionLookups] Current VRMs:', vrms);
      return vrms;
    } catch {
      return [];
    }
  };

  /**
   * Clear session lookups
   */
  const clearSessionLookups = () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(SESSION_LOOKUPS_KEY);
    console.log('[SessionLookups] Cleared all VRMs');
  };

  /**
   * Associate session lookups with user after login
   * Directly invokes the edge function to create user-specific records
   */
  const associateLookupsWithUser = async () => {
    const vrms = getSessionLookups();
    console.log('[SessionLookups] Associating VRMs with user:', vrms);
    
    if (vrms.length === 0) {
      console.log('[SessionLookups] No VRMs to associate');
      return;
    }

    try {
      // Trigger a lookup for each VRM - the edge function will create user records
      for (const vrm of vrms) {
        console.log('[SessionLookups] Triggering lookup for:', vrm);
        await supabase.functions.invoke('lookup_vehicle', {
          body: { vrm }
        });
      }
      
      // Clear session lookups after successful association
      clearSessionLookups();
      console.log('[SessionLookups] Association complete');
    } catch (error) {
      console.error('[SessionLookups] Error associating lookups with user:', error);
    }
  };

  return {
    addSessionLookup,
    getSessionLookups,
    clearSessionLookups,
    associateLookupsWithUser
  };
};
