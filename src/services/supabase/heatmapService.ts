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
  const { data, error } = await supabase.rpc('get_adjustment_breakdown_heatmap');
  if (error) {
    throw error;
  }
  return data || [];
}