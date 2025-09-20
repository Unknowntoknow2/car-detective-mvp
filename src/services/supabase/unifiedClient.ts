/**
 * Unified Supabase Client Service
 * 
 * Consolidated from apps/ain-valuation-engine/src/services/unifiedSupabase.ts
 * Provides singleton pattern clients and managers for database operations.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { VehicleData, SessionData } from '@/types/vehicleData';

// Singleton pattern for client instances
class SupabaseManager {
  private static clientInstance: SupabaseClient | null = null;
  private static serviceInstance: SupabaseClient | null = null;

  // Public client with anon key (for frontend operations)
  static getClient(): SupabaseClient {
    if (!this.clientInstance) {
      const url = import.meta.env.VITE_SUPABASE_URL;
      const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!url || !anonKey) {
        throw new Error('Missing Supabase configuration');
      }
      
      this.clientInstance = createClient(url, anonKey);
    }
    return this.clientInstance;
  }

  // Service client with service role key (for backend operations)
  static getServiceClient(): SupabaseClient {
    if (!this.serviceInstance) {
      const url = import.meta.env.VITE_SUPABASE_URL;
      const serviceKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;
      
      if (!url || !serviceKey) {
        console.warn('Missing service role configuration, falling back to anon client');
        return this.getClient();
      }
      
      this.serviceInstance = createClient(url, serviceKey);
    }
    return this.serviceInstance;
  }

  // Helper method for Edge Functions
  static async callFunction<T = unknown>(
    functionName: string, 
    payload: Record<string, unknown> = {},
    useServiceRole = false
  ): Promise<{ data: T | null; error: Error | null }> {
    try {
      const client = useServiceRole ? this.getServiceClient() : this.getClient();
      
      const { data, error } = await client.functions.invoke(functionName, {
        body: payload
      });

      if (error) {
        throw new Error(`Supabase function error: ${error.message}`);
      }

      return { data, error: null };
    } catch (error) {
      return { 
        data: null, 
        error: error instanceof Error ? error : new Error(String(error))
      };
    }
  }
}

// Session management functions (consolidated from multiple files)
export class SessionManager {
  private static client = SupabaseManager.getServiceClient();

  static async storeSession(sessionId: string, sessionData: SessionData) {
    try {
      const { data, error } = await this.client
        .from('sessions')
        .insert({ 
          id: sessionId, 
          data: sessionData, 
          created_at: new Date().toISOString() 
        });
      
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error storing session:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : String(error) 
      };
    }
  }

  static async getSession(sessionId: string): Promise<{ success: boolean; data?: SessionData; error?: string }> {
    try {
      const { data, error } = await this.client
        .from('sessions')
        .select('data')
        .eq('id', sessionId)
        .single();
      
      if (error) throw error;
      return { success: true, data: data?.data };
    } catch (error) {
      console.error('Error retrieving session:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : String(error) 
      };
    }
  }

  static async updateSession(sessionId: string, sessionData: Partial<SessionData>) {
    try {
      const { data, error } = await this.client
        .from('sessions')
        .update({ 
          data: sessionData, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', sessionId);
      
      if (error) throw error;
      return { success: true, data, ok: true };
    } catch (error) {
      console.error('Error updating session:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : String(error) 
      };
    }
  }

  static async deleteSession(sessionId: string) {
    try {
      const { error } = await this.client
        .from('sessions')
        .delete()
        .eq('id', sessionId);
      
      if (error) throw error;
      return { success: true, ok: true };
    } catch (error) {
      console.error('Error deleting session:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : String(error) 
      };
    }
  }
}

// Vehicle data management
export class VehicleDataManager {
  private static client = SupabaseManager.getServiceClient();

  static async storeVehicleData(vin: string, vehicleData: VehicleData) {
    try {
      const { data, error } = await this.client
        .from('vehicle_data')
        .insert({ 
          vin, 
          data: vehicleData, 
          created_at: new Date().toISOString() 
        });
      
      if (error) throw error;
      return { success: true, data, ok: true };
    } catch (error) {
      console.error('Error storing vehicle data:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : String(error) 
      };
    }
  }

  static async getVehicleData(vin: string): Promise<{ success: boolean; data?: VehicleData; error?: string }> {
    try {
      const { data, error } = await this.client
        .from('vehicle_data')
        .select('data')
        .eq('vin', vin)
        .single();
      
      if (error) throw error;
      return { success: true, data: data?.data };
    } catch (error) {
      console.error('Error retrieving vehicle data:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : String(error) 
      };
    }
  }
}

// Export the unified clients and managers
export { SupabaseManager };
export const supabase = SupabaseManager.getClient();
export const supabaseService = SupabaseManager.getServiceClient();

// Default export for backward compatibility
export default supabase;