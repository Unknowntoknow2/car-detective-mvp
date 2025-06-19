
import { ValuationData, Adjustment } from './rules/types';
import { supabase } from '@/integrations/supabase/client';

export const calculateValuationAdjustments = async (data: ValuationData): Promise<Adjustment[]> => {
  try {
    const { data: rules, error } = await supabase
      .from('valuation_rules')
      .select('*')
      .eq('active', true);

    if (error) throw error;

    const adjustments: Adjustment[] = [];

    // Apply rules based on data
    rules.forEach(rule => {
      const adjustment = applyRule(rule, data);
      if (adjustment) {
        adjustments.push(adjustment);
      }
    });

    return adjustments;
  } catch (error) {
    console.error('Error calculating adjustments:', error);
    return [];
  }
};

function applyRule(rule: any, data: ValuationData): Adjustment | null {
  // Rule application logic would go here
  // This is a simplified version
  return null;
}

export const calculateFinalValuation = (baseValue: number, adjustments: Adjustment[]): number => {
  return adjustments.reduce((total, adj) => total + adj.impact, baseValue);
};

export type { ValuationData, Adjustment } from './rules/types';
