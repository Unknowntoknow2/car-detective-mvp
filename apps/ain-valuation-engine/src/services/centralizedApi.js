// Centralized API service to eliminate duplication
// ⚠️ DEPRECATED: Use unifiedVinDecoder.ts instead for VIN decode operations
import { ApiClient } from './apiClient';
import { withErrorHandling } from '../utils/errorHandling';
import { decodeVin, isVinDecodeSuccessful } from './unifiedVinDecoder';
// Single instance of API client
export const apiClient = new ApiClient();
// VIN decoding service - DEPRECATED: Use unifiedVinDecoder.ts instead
export class VinService {
    static NHTSA_BASE_URL = 'https://vpic.nhtsa.dot.gov/api/vehicles';
    /**
     * @deprecated Use decodeVin from unifiedVinDecoder.ts instead
     * This method now redirects to the unified decoder for consistency
     */
    static async decodeVin(vin) {
        
        try {
            const result = await decodeVin(vin);
            if (!isVinDecodeSuccessful(result)) {
                return {
                    success: false,
                    error: result.metadata.errorText || 'VIN decode failed'
                };
            }
            // Convert to legacy format by using raw NHTSA data which already has correct structure
            const legacyData = [result.raw];
            return { success: true, data: legacyData };
        }
        catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }
    /**
     * @deprecated Use decodeVin from unifiedVinDecoder.ts instead
     * This method now redirects to the unified decoder for consistency
     */
    static async decodeVinValues(vin) {
        
        return this.decodeVin(vin); // Same implementation as decodeVin
    }
}
// Supabase service - centralized configuration
export class SupabaseService {
    static getConfig() {
        // Support both Vite (import.meta.env) and Node.js (process.env)
        const url = (typeof window !== 'undefined' && import.meta?.env?.VITE_SUPABASE_URL) || process.env.VITE_SUPABASE_URL;
        const key = (typeof window !== 'undefined' && import.meta?.env?.VITE_SUPABASE_ANON_KEY) || process.env.VITE_SUPABASE_ANON_KEY;
        if (!url || !key) {
            throw new Error('Supabase configuration missing');
        }
        return { url, key };
    }
    static async callFunction(functionName, payload = {}) {
        const result = await withErrorHandling(async () => {
            const { url, key } = this.getConfig();
            const response = await fetch(`${url}/functions/v1/${functionName}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${key}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Supabase function call failed: ${errorText}`);
            }
            return await response.json();
        }, 'supabase-function');
        return result.success
            ? { success: true, data: result.data }
            : { success: false, error: result.error?.message };
    }
}
// External API service for third-party integrations
export class ExternalApiService {
    // Centralized method for making external API calls with consistent error handling
    static async makeExternalCall(url, options = {}) {
        const result = await withErrorHandling(async () => {
            const response = await apiClient.get(url, options.headers);
            if (!response.ok) {
                const errorMsg = response.error || 'External API call failed';
                throw new Error(errorMsg);
            }
            return response.data;
        }, 'external-api');
        return (result && 'ok' in result)
            ? result
            : { ok: false, error: result?.error?.message };
    }
    // Fuel economy API
    static async getFuelEconomyData(year, make, model) {
        const baseUrl = 'https://www.fueleconomy.gov/ws/rest';
        return this.makeExternalCall(`${baseUrl}/vehicle/menu/options?year=${year}&make=${make}&model=${model}`);
    }
    // EIA energy data API
    static async getGasPrices(apiKey) {
        if (!apiKey) {
            return { ok: false, error: 'EIA API key not provided' };
        }
        const baseUrl = 'https://api.eia.gov/series/';
        return this.makeExternalCall(`${baseUrl}?api_key=${apiKey}&series_id=PET.EMM_EPMR_PTE_NUS_DPG.W`);
    }
}
// Environment configuration helper
export class ConfigService {
    static getRequiredEnvVar(name) {
        // Support both Vite (import.meta.env) and Node.js (process.env)
        const value = (typeof window !== 'undefined' && import.meta?.env?.[name]) || process.env[name];
        if (!value) {
            throw new Error(`Required environment variable ${name} is not set`);
        }
        return value;
    }
    static getOptionalEnvVar(name, defaultValue = '') {
        // Support both Vite (import.meta.env) and Node.js (process.env)
        return (typeof window !== 'undefined' && import.meta?.env?.[name]) || process.env[name] || defaultValue;
    }
    static getSupabaseConfig() {
        return {
            url: this.getRequiredEnvVar('VITE_SUPABASE_URL'),
            anonKey: this.getRequiredEnvVar('VITE_SUPABASE_ANON_KEY'),
        };
    }
    static getOpenAIConfig() {
        return {
            apiKey: this.getRequiredEnvVar('VITE_OPENAI_API_KEY'),
        };
    }
    static getApiKeys() {
        return {
            autotrader: this.getOptionalEnvVar('VITE_AUTOTRADER_API_KEY'),
            carsCom: this.getOptionalEnvVar('VITE_CARSCOM_API_KEY'),
            carGurus: this.getOptionalEnvVar('VITE_CARGURUS_API_KEY'),
            carfax: this.getOptionalEnvVar('VITE_CARFAX_API_KEY'),
            autocheck: this.getOptionalEnvVar('VITE_AUTOCHECK_API_KEY'),
            eia: this.getOptionalEnvVar('EIA_API_KEY'),
        };
    }
}
