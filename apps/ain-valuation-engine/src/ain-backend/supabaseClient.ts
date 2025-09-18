import { createClient } from "@supabase/supabase-js";
import logger from "../utils/logger";
import type { VehicleData, SessionData } from "@/types/ValuationTypes";

const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Session and vehicle data functions
export async function storeSession(sessionId: string, sessionData: SessionData) {
  try {
    const { data, error } = await supabase
      .from('sessions')
      .insert({ 
        id: sessionId, 
        data: sessionData, 
        created_at: new Date().toISOString() 
      });
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    logger.error('Error storing session:', error);
    return { success: false, error };
  }
}

export async function retrieveSession(sessionId: string) {
  try {
    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .eq('id', sessionId)
      .single();
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    logger.error('Error retrieving session:', error);
    return { success: false, error };
  }
}

export async function storeVehicleData(vehicleId: string, vehicleData: VehicleData) {
  try {
    const { data, error } = await supabase
      .from('vehicles')
      .upsert({ 
        id: vehicleId, 
        data: vehicleData, 
        updated_at: new Date().toISOString() 
      });
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    logger.error('Error storing vehicle data:', error);
    return { success: false, error };
  }
}

export async function retrieveVehicleData(vehicleId: string) {
  try {
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .eq('id', vehicleId)
      .single();
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    logger.error('Error retrieving vehicle data:', error);
    return { success: false, error };
  }
}
