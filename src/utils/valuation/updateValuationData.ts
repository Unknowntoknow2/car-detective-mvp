import { supabase } from '@/integrations/supabase/client';

/**
 * Updates a specific field in the valuation metadata
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
    // First get the current valuation
    const { data: valuation, error: fetchError } = await supabase
      .from('valuations')
      .select('*')
      .eq('id', valuationId)
      .single();
    
    if (fetchError) {
      console.error('Error fetching valuation data:', fetchError);
      return false;
    }
    
    // Using metadata field instead of data (which appears not to exist in schema)
    // Create a sparse update object with just the field we want to update
    const updateObject: Record<string, any> = {};
    updateObject[key] = value;
    
    // Update the valuation with the new field
    const { error: updateError } = await supabase
      .from('valuations')
      .update(updateObject)
      .eq('id', valuationId);
    
    if (updateError) {
      console.error('Error updating valuation:', updateError);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('Error in updateValuationDataField:', err);
    return false;
  }
}

/**
 * Updates multiple fields in the valuation
 * @param valuationId Valuation ID
 * @param updates Object containing key/value pairs to update
 */
export async function updateValuationDataFields(
  valuationId: string,
  updates: Record<string, any>
): Promise<boolean> {
  try {
    // Get the current valuation
    const { data: valuation, error: fetchError } = await supabase
      .from('valuations')
      .select('*')
      .eq('id', valuationId)
      .single();
    
    if (fetchError) {
      console.error('Error fetching valuation:', fetchError);
      return false;
    }
    
    // Update the valuation with the new fields
    const { error: updateError } = await supabase
      .from('valuations')
      .update(updates)
      .eq('id', valuationId);
    
    if (updateError) {
      console.error('Error updating valuation:', updateError);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('Error in updateValuationDataFields:', err);
    return false;
  }
}

/**
 * Gets a specific field from the valuation
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
      console.error('Error fetching valuation:', error);
      return defaultValue;
    }
    
    // Check if the key exists in the valuation object
    if (key in valuation) {
      return valuation[key] !== undefined ? valuation[key] : defaultValue;
    }
    
    return defaultValue;
  } catch (err) {
    console.error('Error in getValuationDataField:', err);
    return defaultValue;
  }
}
