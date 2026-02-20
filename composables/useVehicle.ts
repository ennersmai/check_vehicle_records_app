import type { VehicleLookupResponse } from '~/types';

export const useVehicle = () => {
  const supabase = useSupabaseClient();
  const { user } = useAuth();
  const { addSessionLookup } = useSessionLookups();
  const loading = useState('vehicle-loading', () => false);

  /**
   * Basic vehicle lookup - tries cache first, then DVLA, then CheckCarDetails
   * All data is cached permanently in the database
   * If user is not logged in, tracks the lookup in session storage for later association
   */
  const lookupVehicle = async (vrm: string): Promise<VehicleLookupResponse> => {
    loading.value = true;
    const normalizedVrm = vrm.toUpperCase().replace(/\s/g, '');
    
    try {
      const { data, error } = await supabase.functions.invoke('lookup_vehicle', {
        body: { vrm: normalizedVrm }
      });

      if (error) throw error;
      
      // Always track successful lookups in session storage
      // After login, associateLookupsWithUser will create user-specific records
      if (data?.success) {
        addSessionLookup(normalizedVrm);
      }
      
      return data as VehicleLookupResponse;
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        source: 'error'
      };
    } finally {
      loading.value = false;
    }
  };

  /**
   * Premium vehicle lookup - requires voucher or payment
   * Fetches comprehensive data from CheckCarDetails API
   * All data is cached permanently
   */
  const premiumLookup = async (vrm: string, voucherCode?: string) => {
    loading.value = true;
    try {
      const { data, error } = await supabase.functions.invoke('premium_lookup', {
        body: { 
          vrm: vrm.toUpperCase().replace(/\s/g, ''),
          voucherCode: voucherCode?.toUpperCase()
        }
      });

      if (error) throw error;
      
      return data;
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    } finally {
      loading.value = false;
    }
  };

  /**
   * Get cached vehicle lookup from database
   * Returns vehicle data with image URL if available
   */
  const getCachedVehicle = async (vrm: string) => {
    try {
      // Use limit(1) instead of single() - multiple users can have records for same VRM
      const { data, error } = await supabase
        .from('vehicle_lookups')
        .select('*')
        .eq('vrm', vrm.toUpperCase().replace(/\s/g, ''))
        .limit(1);

      const record = data?.[0];
      if (error || !record) throw error;
      
      // Return the actual vehicle data (prefer DVLA) with image URL
      // Prefer base64 image (permanent) over URL (expires)
      const vehicleData = record.dvla_data || record.checkcardetails_data || {};
      const imageUrl = record.image_data?.base64Image || 
                       record.image_data?.VehicleImages?.ImageDetailsList?.[0]?.ImageUrl || null;
      
      return { ...vehicleData, imageUrl };
    } catch (error) {
      return null;
    }
  };

  /**
   * Get cached premium lookup from database
   */
  const getCachedPremiumLookup = async (vrm: string) => {
    try {
      const { data, error } = await supabase
        .from('premium_lookups')
        .select('*')
        .eq('vrm', vrm.toUpperCase().replace(/\s/g, ''))
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      return null;
    }
  };

  return {
    loading,
    lookupVehicle,
    premiumLookup,
    getCachedVehicle,
    getCachedPremiumLookup
  };
};
