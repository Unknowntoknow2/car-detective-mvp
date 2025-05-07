
import { supabase } from '@/integrations/supabase/client';

/**
 * Updates a single field in the data JSONB column for a valuation
 * @param valuationId The ID of the valuation to update
 * @param key The key in the data JSONB object
 * @param value The value to set for the key
 * @returns Promise resolving to the update result
 */
export async function updateValuationDataField(
  valuationId: string,
  key: string,
  value: any
): Promise<boolean> {
  try {
    // First get the current data object
    const { data: valuation, error: fetchError } = await supabase
      .from('valuations')
      .select('data')
      .eq('id', valuationId)
      .single();
      
    if (fetchError) {
      console.error('Error fetching valuation data:', fetchError);
      return false;
    }
    
    // Create a new data object with the updated field
    const currentData = valuation?.data || {};
    const updatedData = {
      ...currentData,
      [key]: value
    };
    
    // Update the valuation with the new data
    const { error: updateError } = await supabase
      .from('valuations')
      .update({ data: updatedData })
      .eq('id', valuationId);
      
    if (updateError) {
      console.error('Error updating valuation data:', updateError);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('Exception in updateValuationDataField:', err);
    return false;
  }
}

/**
 * Updates multiple fields in the data JSONB column for a valuation
 * @param valuationId The ID of the valuation to update
 * @param fields Object with key-value pairs to update in the data JSONB
 * @returns Promise resolving to the update result
 */
export async function updateValuationDataFields(
  valuationId: string,
  fields: Record<string, any>
): Promise<boolean> {
  try {
    // First get the current data object
    const { data: valuation, error: fetchError } = await supabase
      .from('valuations')
      .select('data')
      .eq('id', valuationId)
      .single();
      
    if (fetchError) {
      console.error('Error fetching valuation data:', fetchError);
      return false;
    }
    
    // Create a new data object with the updated fields
    const currentData = valuation?.data || {};
    const updatedData = {
      ...currentData,
      ...fields
    };
    
    // Update the valuation with the new data
    const { error: updateError } = await supabase
      .from('valuations')
      .update({ data: updatedData })
      .eq('id', valuationId);
      
    if (updateError) {
      console.error('Error updating valuation data:', updateError);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('Exception in updateValuationDataFields:', err);
    return false;
  }
}
