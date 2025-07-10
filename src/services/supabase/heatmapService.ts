import { supabase } from '@/integrations/supabase/client';

export interface HeatmapData {
  zip_code: string;
  fuel_type: string;
  condition: string;
  average_condition_adj: number;
  average_fuel_adj: number;
  average_mileage_adj: number;
  average_market_adj: number;
  final_value_avg: number;
  sample_count: number;
}

export async function getAdjustmentBreakdownHeatmap(): Promise<HeatmapData[]> {
  try {
    const { data, error } = await supabase.rpc('get_adjustment_breakdown_heatmap');
    
    if (error) {
      console.error('Error fetching heatmap data:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Failed to fetch adjustment breakdown heatmap:', error);
    throw error;
  }
}