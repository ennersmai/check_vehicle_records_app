import type { VehicleLookupResponse } from '~/types';

export const useVehicle = () => {
  const supabase = useSupabaseClient();
  const loading = useState('vehicle-loading', () => false);

  /**
   * Basic vehicle lookup - tries cache first, then DVLA, then CheckCarDetails
   * All data is cached permanently in the database
   */
  const lookupVehicle = async (vrm: string): Promise<VehicleLookupResponse> => {
    loading.value = true;
    try {
      const { data, error } = await supabase.functions.invoke('lookup_vehicle', {
        body: { vrm: vrm.toUpperCase().replace(/\s/g, '') }
      });

      if (error) throw error;
      
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
      const { data, error } = await supabase
        .from('vehicle_lookups')
        .select('*')
        .eq('vrm', vrm.toUpperCase().replace(/\s/g, ''))
        .single();

      if (error || !data) throw error;
      
      // Return the actual vehicle data (prefer DVLA) with image URL
      const vehicleData = data.dvla_data || data.checkcardetails_data || {};
      const imageUrl = data.image_data?.VehicleImages?.ImageDetailsList?.[0]?.ImageUrl || null;
      
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
