
import { supabase } from '@/integrations/supabase/client';

/**
 * Updates a specific field in the valuation data JSONB object
 * @param valuationId Valuation ID
 * @param key Key to update
 * @param value Value to set
 */
export async function updateValuationDataField(
  valuationId: string,
  key: string,
  value: any
): Promise<boolean> {
  try {
    // First get the current data
    const { data: valuation, error: fetchError } = await supabase
      .from('valuations')
      .select('*')
      .eq('id', valuationId)
      .single();
    
    if (fetchError) {
      console.error('Error fetching valuation data:', fetchError);
      return false;
    }
    
    // Create or update the data field
    const currentData = valuation.data || {};
    const updatedData = {
      ...currentData,
      [key]: value
    };
    
    // Update the valuation with the new data
    const { error: updateError } = await supabase
      .from('valuations')
      .update({
        data: updatedData
      })
      .eq('id', valuationId);
    
    if (updateError) {
      console.error('Error updating valuation data:', updateError);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('Error in updateValuationDataField:', err);
    return false;
  }
}

/**
 * Updates multiple fields in the valuation data JSONB object
 * @param valuationId Valuation ID
 * @param updates Object containing key/value pairs to update
 */
export async function updateValuationDataFields(
  valuationId: string,
  updates: Record<string, any>
): Promise<boolean> {
  try {
    // First get the current data
    const { data: valuation, error: fetchError } = await supabase
      .from('valuations')
      .select('*')
      .eq('id', valuationId)
      .single();
    
    if (fetchError) {
      console.error('Error fetching valuation data:', fetchError);
      return false;
    }
    
    // Create or update the data field
    const currentData = valuation.data || {};
    const updatedData = {
      ...currentData,
      ...updates
    };
    
    // Update the valuation with the new data
    const { error: updateError } = await supabase
      .from('valuations')
      .update({
        data: updatedData
      })
      .eq('id', valuationId);
    
    if (updateError) {
      console.error('Error updating valuation data:', updateError);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('Error in updateValuationDataFields:', err);
    return false;
  }
}

/**
 * Gets a specific field from the valuation data JSONB object
 * @param valuationId Valuation ID
 * @param key Key to retrieve
 * @param defaultValue Default value if key doesn't exist
 */
export async function getValuationDataField<T>(
  valuationId: string,
  key: string,
  defaultValue: T
): Promise<T> {
  try {
    // Get the valuation data
    const { data: valuation, error } = await supabase
      .from('valuations')
      .select('*')
      .eq('id', valuationId)
      .single();
    
    if (error) {
      console.error('Error fetching valuation data:', error);
      return defaultValue;
    }
    
    // Return the requested field or default value
    const data = valuation.data || {};
    return data[key] !== undefined ? data[key] : defaultValue;
  } catch (err) {
    console.error('Error in getValuationDataField:', err);
    return defaultValue;
  }
}
