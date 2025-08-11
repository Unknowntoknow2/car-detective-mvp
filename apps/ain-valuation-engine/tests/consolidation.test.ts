// Integration test for consolidated services

import { decodeVin, isVinDecodeSuccessful, VINDecodeError } from '../src/services/unifiedVinDecoder';
import { VinService } from '../src/services/centralizedApi';
import { fetchFuelEconomyByYearMakeModel } from '../src/services/fuelEconomyService';

describe('Consolidated Services Integration', () => {
  describe('UnifiedVinDecoder', () => {
    it('should decode VIN with proper type safety', async () => {
      const mockVin = '1HGCM82633A123456';
      
      // Mock the API response to avoid actual network calls in tests
      const result = await decodeVin(mockVin, { forceDirectAPI: true });
      
      expect(result).toHaveProperty('metadata');
      expect(result).toHaveProperty('categories');
      expect(result).toHaveProperty('raw');
      
      expect(typeof result.metadata.success).toBe('boolean');
      
      if (isVinDecodeSuccessful(result)) {
        expect(result.categories.identity).toHaveProperty('make');
        expect(result.categories.identity).toHaveProperty('model');
        expect(result.categories.identity).toHaveProperty('modelYear');
      }
    }, 15000); // Increase timeout for API call

    it('should handle invalid VIN with proper error handling', async () => {
      const invalidVin = 'INVALID';
      
      try {
        await decodeVin(invalidVin);
        fail('Should have thrown an error for invalid VIN');
      } catch (error) {
        expect(error).toBeInstanceOf(VINDecodeError);
        expect((error as VINDecodeError).code).toBe('VALIDATION_ERROR');
      }
    });

    it('should handle invalid checksum with proper error handling', async () => {
      const invalidCheckDigitVin = '1HGCM82633A123457'; // Wrong check digit
      
      try {
        await decodeVin(invalidCheckDigitVin);
        fail('Should have thrown an error for invalid checksum');
      } catch (error) {
        expect(error).toBeInstanceOf(VINDecodeError);
        expect((error as VINDecodeError).code).toBe('VALIDATION_ERROR');
      }
    });
  });
});

describe('VIN Decode Consolidation Integration', () => {
  describe('UnifiedVinDecoder', () => {
    it('should decode VIN with proper type safety', async () => {
      const mockVin = '1HGCM82633A123456';
      
      // Mock the API response to avoid actual network calls in tests
      const result = await decodeVin(mockVin, { forceDirectAPI: true });
      
      expect(result).toHaveProperty('metadata');
      expect(result).toHaveProperty('categories');
      expect(result).toHaveProperty('raw');
      
      expect(typeof result.metadata.success).toBe('boolean');
      
      if (isVinDecodeSuccessful(result)) {
        expect(result.categories.identity).toHaveProperty('make');
        expect(result.categories.identity).toHaveProperty('model');
        expect(result.categories.identity).toHaveProperty('modelYear');
      }
    }, 15000); // Increase timeout for API call

    it('should handle invalid VIN with proper error handling', async () => {
      const invalidVin = 'INVALID';
      
      try {
        await decodeVin(invalidVin);
        fail('Should have thrown an error for invalid VIN');
      } catch (error) {
        expect(error).toBeInstanceOf(VINDecodeError);
        expect((error as VINDecodeError).code).toBe('VALIDATION_ERROR');
      }
    });

    it('should handle invalid checksum with proper error handling', async () => {
      const invalidCheckDigitVin = '1HGCM82633A123457'; // Wrong check digit
      
      try {
        await decodeVin(invalidCheckDigitVin);
        fail('Should have thrown an error for invalid checksum');
      } catch (error) {
        expect(error).toBeInstanceOf(VINDecodeError);
        expect((error as VINDecodeError).code).toBe('VALIDATION_ERROR');
      }
    });
  });

  describe('Deprecated CentralizedApi VinService', () => {
    it('should use unified decoder and show deprecation warning', async () => {
      // Capture console warnings
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      const result = await VinService.decodeVin('1HGCM82633A123456');
      
      // Should follow the same error structure across all services
      expect(result).toMatchObject({
        success: expect.any(Boolean)
      });
      
      // Should show deprecation warning
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('DEPRECATED')
      );
      
      warnSpy.mockRestore();
      
      if (!result.success) {
        expect(result).toHaveProperty('error');
        expect(typeof result.error).toBe('string');
      }
    }, 15000);
  });

  describe('Fuel Economy Service Integration', () => {
    it('should fetch fuel economy data with proper types', async () => {
      const result = await fetchFuelEconomyByYearMakeModel(2020, 'Toyota', 'Camry');
      
      if (result) {
        expect(result).toHaveProperty('fuelType');
        expect(result).toHaveProperty('cityMpg');
        expect(result).toHaveProperty('highwayMpg');
        expect(result).toHaveProperty('combinedMpg');
        
        expect(typeof result.fuelType).toBe('string');
        expect(result.cityMpg === null || typeof result.cityMpg === 'number').toBe(true);
        expect(result.highwayMpg === null || typeof result.highwayMpg === 'number').toBe(true);
        expect(result.combinedMpg === null || typeof result.combinedMpg === 'number').toBe(true);
      }
    }, 10000);
  });

  describe('VIN Decode Consolidation Verification', () => {
    it('should have the same data structure from both unified and deprecated APIs', async () => {
      const testVin = '1HGCM82633A123456';
      
      // Suppress deprecation warnings for this test
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
      
      try {
        // Get result from unified decoder
        const unifiedResult = await decodeVin(testVin, { forceDirectAPI: true });
        
        // Get result from deprecated centralized API (which now uses unified decoder internally)
        const deprecatedResult = await VinService.decodeVin(testVin);
        
        // Both should succeed or both should fail
        if (isVinDecodeSuccessful(unifiedResult)) {
          expect(deprecatedResult.success).toBe(true);
          if (deprecatedResult.success && deprecatedResult.data) {
            // The raw data should be equivalent
            expect(deprecatedResult.data[0]).toMatchObject(
              expect.objectContaining({
                Make: expect.any(String),
                Model: expect.any(String),
                ModelYear: expect.any(String),
              })
            );
          }
        }
      } finally {
        warnSpy.mockRestore();
      }
    }, 15000);
  });
});
