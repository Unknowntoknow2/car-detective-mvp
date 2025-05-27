
import { DecodedVehicleInfo } from '@/types/vehicle';
import { supabase } from '@/integrations/supabase/client';

// Export the type so other modules can import it
export { DecodedVehicleInfo } from '@/types/vehicle';

// Real license plate lookup function
export const decodeLicensePlate = async (
  plate: string,
  state: string
): Promise<DecodedVehicleInfo> => {
  console.log(`🔍 Real license plate lookup: ${plate} from ${state}`);
  
  try {
    const { data, error } = await supabase.functions.invoke('fetch-vehicle-history', {
      body: { 
        plate: plate.toUpperCase(), 
        state: state.toUpperCase(),
        type: 'plate_decode'
      }
    });

    if (error) {
      console.error('❌ License plate decode error:', error);
      throw new Error(`License plate lookup failed: ${error.message}`);
    }

    if (!data || !data.success) {
      const errorMsg = data?.error || 'License plate not found';
      console.error('❌ License plate not found:', errorMsg);
      throw new Error(errorMsg);
    }

    if (!data.vehicle) {
      throw new Error('No vehicle data found for this license plate');
    }

    console.log('✅ Real license plate data retrieved');
    return {
      plate,
      state,
      ...data.vehicle
    };
  } catch (error) {
    console.error("❌ License plate lookup failed:", error);
    throw error;
  }
};
