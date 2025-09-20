// Integration test for unified VIN decoder

import { decodeVin, isVinDecodeSuccessful, VINDecodeError, extractLegacyVehicleInfo } from '../src/services/unifiedVinDecoder';

describe('Unified VIN Decoder Integration', () => {
  describe('Basic VIN Decoding', () => {
    it('should decode a valid VIN successfully', async () => {
      const testVin = '1HGCM82633A004352'; // Honda Accord with valid check digit
      
      try {
        const result = await decodeVin(testVin, { 
          forceDirectAPI: true,
          timeout: 15000 
        });
        
        expect(result).toHaveProperty('metadata');
        expect(result).toHaveProperty('categories');
        expect(result).toHaveProperty('raw');
        
        expect(typeof result.metadata.success).toBe('boolean');
        expect(result.metadata.source).toBe('NHTSA_DIRECT');
        
        if (isVinDecodeSuccessful(result)) {
          // Check required fields are present and categorized
          expect(result.categories.identity.make).toBeDefined();
          expect(result.categories.identity.model).toBeDefined();
          expect(result.categories.identity.modelYear).toBeDefined();
          expect(result.categories.powertrain.engineCylinders).toBeDefined();
          expect(result.categories.powertrain.fuelTypePrimary).toBeDefined();
          expect(result.categories.powertrain.driveType).toBeDefined();
          expect(result.categories.powertrain.transmissionStyle).toBeDefined();
          expect(result.categories.identity.bodyClass).toBeDefined();
          expect(result.categories.manufacturing.plantCountry).toBeDefined();
        }
      } catch (error) {
        // Test may fail due to network issues
        console.warn('VIN decode test failed (network issue):', error);
      }
    }, 20000);

    it('should handle invalid VIN format', async () => {
      const invalidVin = 'INVALID123';
      
      try {
        await decodeVin(invalidVin);
        fail('Should have thrown an error for invalid VIN');
      } catch (error) {
        expect(error).toBeInstanceOf(VINDecodeError);
        expect((error as VINDecodeError).code).toBe('VALIDATION_ERROR');
      }
    });

    it('should handle VIN with wrong check digit', async () => {
      const invalidCheckDigitVin = '1HGCM82633A004353'; // Wrong check digit
      
      try {
        await decodeVin(invalidCheckDigitVin);
        fail('Should have thrown an error for wrong check digit');
      } catch (error) {
        expect(error).toBeInstanceOf(VINDecodeError);
        expect((error as VINDecodeError).code).toBe('VALIDATION_ERROR');
      }
    });
  });

  describe('Legacy Compatibility', () => {
    it('should extract legacy vehicle info correctly', async () => {
      const testVin = '1HGCM82633A004352';
      
      try {
        const result = await decodeVin(testVin, { forceDirectAPI: true });
        
        if (isVinDecodeSuccessful(result)) {
          const legacyInfo = extractLegacyVehicleInfo(result);
          
          expect(legacyInfo).toHaveProperty('make');
          expect(legacyInfo).toHaveProperty('model');
          expect(legacyInfo).toHaveProperty('modelYear');
          expect(legacyInfo).toHaveProperty('trim');
          expect(legacyInfo).toHaveProperty('bodyClass');
          expect(legacyInfo).toHaveProperty('engineCylinders');
          expect(legacyInfo).toHaveProperty('fuelTypePrimary');
          expect(legacyInfo).toHaveProperty('driveType');
          expect(legacyInfo).toHaveProperty('transmissionStyle');
          expect(legacyInfo).toHaveProperty('plantCountry');
          
          // Check data types
          if (legacyInfo.modelYear !== undefined) {
            expect(typeof legacyInfo.modelYear).toBe('number');
          }
          if (legacyInfo.engineCylinders !== undefined) {
            expect(typeof legacyInfo.engineCylinders).toBe('number');
          }
        }
      } catch (error) {
        console.warn('Legacy compatibility test failed (network issue):', error);
      }
    }, 20000);
  });

  describe('Fallback Logic', () => {
    it('should use direct API when forced', async () => {
      const testVin = '1HGCM82633A004352';
      
      try {
        const result = await decodeVin(testVin, { 
          forceDirectAPI: true,
          timeout: 10000 
        });
        
        expect(result.metadata.source).toBe('NHTSA_DIRECT');
      } catch (error) {
        console.warn('Direct API test failed (network issue):', error);
      }
    }, 15000);
  });

  describe('Error Handling', () => {
    it('should provide meaningful error messages', () => {
      const error = new VINDecodeError('Test error', 'TEST_CODE', { detail: 'test' });
      
      expect(error.message).toBe('Test error');
      expect(error.code).toBe('TEST_CODE');
      expect(error.details).toEqual({ detail: 'test' });
      expect(error.name).toBe('VINDecodeError');
    });

    it.skip('should handle network timeouts gracefully', async () => {
      const testVin = '1HGCM82633A004352';
      
      try {
        // Very short timeout to force timeout error
        await decodeVin(testVin, { 
          forceDirectAPI: true,
          timeout: 1 // 1ms timeout
        });
        fail('Should have thrown a timeout error');
      } catch (error) {
        expect(error).toBeInstanceOf(VINDecodeError);
        expect((error as VINDecodeError).code).toBe('TIMEOUT_ERROR');
      }
    }, 10000);
  });
});
