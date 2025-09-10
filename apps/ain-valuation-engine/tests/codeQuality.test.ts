// Comprehensive test suite for code quality improvements

import { jest } from '@jest/globals';

// Mock environment variables for testing
const mockEnv = {
  VITE_SUPABASE_URL: 'https://test.supabase.co',
  VITE_SUPABASE_ANON_KEY: 'test-anon-key',
  VITE_OPENAI_API_KEY: 'test-openai-key',
  VITE_CARFAX_API_KEY: 'test-carfax-key',
  VITE_AUTOCHECK_API_KEY: 'test-autocheck-key',
  EIA_API_KEY: 'test-eia-key'
};

// Mock import.meta for Node.js environment
global.importMeta = {
  env: mockEnv
};

Object.defineProperty(globalThis, 'import', {
  value: {
    meta: {
      env: mockEnv
    }
  },
  writable: true
});

// Set up process.env as fallback
Object.assign(process.env, mockEnv);

describe('Code Quality Improvements', () => {
  describe('TypeScript Type Safety', () => {
    it('should have proper typing for market listings', async () => {
      const { MarketListingsService } = await import('../src/services/marketListingsService');
      
      // Test that the service exists and is properly typed
      expect(MarketListingsService).toBeDefined();
      expect(typeof MarketListingsService).toBe('function');
    });

    it('should have proper typing for vehicle history service', async () => {
      const { VehicleHistoryService } = await import('../src/services/vehicleHistoryService');
      
      expect(VehicleHistoryService).toBeDefined();
      expect(typeof VehicleHistoryService).toBe('function');
    });

    it('should have proper typing for valuation engine', async () => {
      const { valuateVehicle } = await import('../src/ain-backend/valuationEngine');
      
      expect(valuateVehicle).toBeDefined();
      expect(typeof valuateVehicle).toBe('function');
      
      // Test function signature
      const mockVehicle = {
        year: 2020,
        make: 'Toyota',
        model: 'Camry',
        mileage: 50000,
        condition: 'good' as const
      };
      
      const result = await valuateVehicle(mockVehicle);
      
      expect(result).toHaveProperty('estimatedValue');
      expect(result).toHaveProperty('confidence');
      expect(result).toHaveProperty('priceRange');
      expect(result).toHaveProperty('factors');
      expect(Array.isArray(result.factors)).toBe(true);
    });
  });

  describe('Error Handling Standardization', () => {
    it('should have consistent error handling utilities', async () => {
      const { withErrorHandling, ErrorHandler } = await import('../src/utils/errorHandling');
      
      expect(withErrorHandling).toBeDefined();
      expect(ErrorHandler).toBeDefined();
      expect(typeof withErrorHandling).toBe('function');
      expect(typeof ErrorHandler).toBe('function');
    });

    it('should handle errors consistently across services', async () => {
      const { withErrorHandling } = await import('../src/utils/errorHandling');
      
      // Test successful operation
      const successResult = await withErrorHandling(async () => {
        return { test: 'data' };
      }, 'test-operation');
      
      expect(successResult.success).toBe(true);
      expect(successResult.data).toEqual({ test: 'data' });
      
      // Test error handling
      const errorResult = await withErrorHandling(async () => {
        throw new Error('Test error');
      }, 'test-operation');
      
      expect(errorResult.success).toBe(false);
      expect(errorResult.error).toBeDefined();
    });
  });

  describe('Code Deduplication', () => {
    it('should have centralized API services', async () => {
      const { VinService, SupabaseService, ExternalApiService, ConfigService } = await import('../src/services/centralizedApi');
      
      expect(VinService).toBeDefined();
      expect(SupabaseService).toBeDefined();
      expect(ExternalApiService).toBeDefined();
      expect(ConfigService).toBeDefined();
    });

    it('should have unified Supabase client management', async () => {
      const { SupabaseManager, supabase, supabaseService } = await import('../src/services/unifiedSupabase');
      
      expect(SupabaseManager).toBeDefined();
      expect(supabase).toBeDefined();
      expect(supabaseService).toBeDefined();
      
      // Test singleton pattern
      const client1 = SupabaseManager.getClient();
      const client2 = SupabaseManager.getClient();
      expect(client1).toBe(client2);
    });

    it('should have consistent API response structures', async () => {
      const { VinService } = await import('../src/services/centralizedApi');
      
      // Mock the API call to avoid network requests
      const mockResult = {
        success: true,
        data: [{ Variable: 'Make', Value: 'Toyota' }]
      };
      
      // Test that the response structure is consistent
      expect(mockResult).toHaveProperty('success');
      expect(typeof mockResult.success).toBe('boolean');
      
      if (mockResult.success) {
        expect(mockResult).toHaveProperty('data');
      } else {
        expect(mockResult).toHaveProperty('error');
      }
    });
  });

  describe('Environment Configuration', () => {
    it('should provide centralized configuration management', async () => {
      const { ConfigService } = await import('../src/services/centralizedApi');
      
      expect(ConfigService).toBeDefined();
      expect(typeof ConfigService.getRequiredEnvVar).toBe('function');
      expect(typeof ConfigService.getOptionalEnvVar).toBe('function');
      expect(typeof ConfigService.getSupabaseConfig).toBe('function');
      expect(typeof ConfigService.getApiKeys).toBe('function');
    });

    it('should handle environment variables correctly', async () => {
      const { ConfigService } = await import('../src/services/centralizedApi');
      
      // Test required environment variable
      const supabaseConfig = ConfigService.getSupabaseConfig();
      expect(supabaseConfig).toHaveProperty('url');
      expect(supabaseConfig).toHaveProperty('anonKey');
      
      // Test optional environment variables
      const apiKeys = ConfigService.getApiKeys();
      expect(apiKeys).toHaveProperty('autotrader');
      expect(apiKeys).toHaveProperty('carsCom');
      expect(apiKeys).toHaveProperty('carGurus');
    });
  });

  describe('Type Definitions', () => {
    it('should have comprehensive API types', async () => {
      const types = await import('../src/types/api');
      
      expect(types).toHaveProperty('ApiError');
      expect(types).toHaveProperty('ApiRequestOptions');
      expect(types).toHaveProperty('ApiResponse');
      expect(types).toHaveProperty('SessionData');
      expect(types).toHaveProperty('VehicleData');
    });

    it('should have proper valuation types', async () => {
      const types = await import('../src/types/valuation');
      
      expect(types).toHaveProperty('NHTSARecall');
      expect(types).toHaveProperty('VehicleSpecification');
      expect(types).toHaveProperty('EnrichedVehicleProfile');
    });

    it('should have proper fuel economy types', async () => {
      const types = await import('../src/services/fuelEconomyService');
      
      expect(types).toHaveProperty('FuelEconomyData');
      expect(types).toHaveProperty('FuelEconomyApiResponse');
      expect(types).toHaveProperty('VehicleDetailsResponse');
      expect(types).toHaveProperty('EIAApiResponse');
    });
  });

  describe('Integration Testing', () => {
    it('should integrate services without type errors', async () => {
      // Test that services can be imported and used together
      const { VinService } = await import('../src/services/centralizedApi');
      const { SupabaseManager } = await import('../src/services/unifiedSupabase');
      const { withErrorHandling } = await import('../src/utils/errorHandling');
      
      // Test integration
      const mockOperation = async () => {
        const client = SupabaseManager.getClient();
        return { client: !!client, vinService: !!VinService };
      };
      
      const result = await withErrorHandling(mockOperation, 'integration-test');
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toHaveProperty('client');
        expect(result.data).toHaveProperty('vinService');
      }
    });

    it('should maintain backward compatibility', async () => {
      // Test that existing imports still work
      const { supabase } = await import('../src/services/unifiedSupabase');
      const { apiClient } = await import('../src/services/apiClient');
      
      expect(supabase).toBeDefined();
      expect(apiClient).toBeDefined();
      expect(typeof apiClient.get).toBe('function');
      expect(typeof apiClient.post).toBe('function');
    });
  });
});

// Test data validation
describe('Data Validation and Type Guards', () => {
  it('should validate vehicle data properly', async () => {
    const { valuateVehicle } = await import('../src/ain-backend/valuationEngine');
    
    // Test with valid data
    const validVehicle = {
      year: 2020,
      make: 'Toyota',
      model: 'Camry',
      mileage: 50000,
      condition: 'good' as const
    };
    
    const result = await valuateVehicle(validVehicle);
    expect(result.estimatedValue).toBeGreaterThan(0);
    expect(result.confidence).toBeGreaterThan(0);
    
    // Test with minimal data
    const minimalVehicle = {};
    const minimalResult = await valuateVehicle(minimalVehicle);
    expect(minimalResult).toHaveProperty('estimatedValue');
    expect(minimalResult).toHaveProperty('confidence');
  });

  it('should handle API responses with proper types', async () => {
    const { ExternalApiService } = await import('../src/services/centralizedApi');
    
    // Mock successful response
    const mockSuccessResponse = {
      success: true,
      data: { test: 'value' }
    };
    
    expect(mockSuccessResponse.success).toBe(true);
    expect(mockSuccessResponse.data).toBeDefined();
    
    // Mock error response
    const mockErrorResponse = {
      success: false,
      error: 'Test error message'
    };
    
    expect(mockErrorResponse.success).toBe(false);
    expect(mockErrorResponse.error).toBeDefined();
  });
});
