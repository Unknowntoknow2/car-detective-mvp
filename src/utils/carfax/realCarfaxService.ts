
import { supabase } from '@/integrations/supabase/client';

export interface CarfaxData {
  accidentsReported: number;
  owners: number;
  serviceRecords: number;
  salvageTitle: boolean;
  titleEvents: string[];
  reportUrl: string;
  damageSeverity?: string;
}

export const getCarfaxReport = async (vin: string): Promise<CarfaxData> => {
  try {
    // Call Supabase edge function for real Carfax data
    const { data, error } = await supabase.functions.invoke('fetch-vehicle-history', {
      body: { vin, type: 'carfax' }
    });
    
    if (error) {
      throw new Error(`Carfax lookup failed: ${error.message}`);
    }
    
    if (!data || !data.success) {
      throw new Error(data?.error || 'Failed to retrieve Carfax report');
    }
    
    return {
      accidentsReported: data.carfax?.accidents || 0,
      owners: data.carfax?.owners || 1,
      serviceRecords: data.carfax?.serviceRecords || 0,
      salvageTitle: data.carfax?.salvageTitle || false,
      titleEvents: data.carfax?.titleEvents || ['Clean Title'],
      reportUrl: data.carfax?.reportUrl || `https://www.carfax.com/vehicle/${vin}`,
      damageSeverity: data.carfax?.damageSeverity
    };
  } catch (error) {
    console.error('Carfax API error:', error);
    throw error;
  }
};
