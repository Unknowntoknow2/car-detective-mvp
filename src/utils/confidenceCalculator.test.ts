
import { calculateConfidenceScore, getConfidenceLevel, InputFactors } from './confidenceCalculator';

describe('Confidence Calculator', () => {
  it('should calculate a perfect score with all factors present', () => {
    const perfectInput: InputFactors = {
      vin: 'WBAJB0C51JB085775',
      zip: '94103',
      mileage: 25000,
      year: 2019,
      make: 'BMW',
      model: '3 Series',
      condition: 'Excellent',
      hasCarfax: true,
      hasPhotoScore: true,
      hasTitleStatus: false,
      hasEquipment: true,
      hasTransmission: true,
      hasOpenRecall: false
    };

    const score = calculateConfidenceScore(perfectInput);
    expect(score).toBe(100);
    
    const level = getConfidenceLevel(score);
    expect(level).toBe('Very High');
  });

  it('should calculate a lower score with missing factors', () => {
    const partialInput: InputFactors = {
      vin: undefined,
      zip: undefined,
      mileage: 75000,
      year: 2015,
      make: 'Honda',
      model: 'Civic',
      condition: 'Good',
      hasCarfax: false,
      hasPhotoScore: false,
      hasTitleStatus: true,
      hasEquipment: false,
      hasTransmission: false,
      hasOpenRecall: true
    };

    const score = calculateConfidenceScore(partialInput);
    
    // Expect a lower score without VIN, ZIP, Carfax, etc.
    expect(score).toBeLessThan(70);
    
    const level = getConfidenceLevel(score);
    // Using toBe with a condition instead of .or which is not available in Jest
    expect(['Medium', 'Low'].includes(level)).toBeTruthy();
  });

  it('should handle negative factors properly', () => {
    const negativeFactorsInput: InputFactors = {
      vin: 'WBAJB0C51JB085775',
      zip: '94103',
      mileage: 25000,
      year: 2019,
      make: 'BMW',
      model: '3 Series',
      condition: 'Excellent',
      hasCarfax: true,
      hasPhotoScore: true,
      hasTitleStatus: true, // Negative factor
      hasEquipment: true,
      hasTransmission: true,
      hasOpenRecall: true // Negative factor
    };

    const score = calculateConfidenceScore(negativeFactorsInput);
    
    // Score should be reduced by negative factors
    expect(score).toBeLessThan(100);
  });

  it('should normalize the score between 0 and 100', () => {
    // Test with extreme values
    const extremeInput: InputFactors = {
      mileage: 1000000, // Very high mileage
      year: 1980, // Very old car
      make: '',
      model: '',
      condition: '',
      hasCarfax: false,
      hasPhotoScore: false,
      hasTitleStatus: true,
      hasEquipment: false
    };

    const score = calculateConfidenceScore(extremeInput);
    
    // Score should be normalized to be within 0-100 range
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });

  describe('getConfidenceLevel', () => {
    it('should return "Very High" for scores >= 90', () => {
      expect(getConfidenceLevel(90)).toBe('Very High');
      expect(getConfidenceLevel(95)).toBe('Very High');
      expect(getConfidenceLevel(100)).toBe('Very High');
    });

    it('should return "High" for scores >= 75 and < 90', () => {
      expect(getConfidenceLevel(75)).toBe('High');
      expect(getConfidenceLevel(80)).toBe('High');
      expect(getConfidenceLevel(89)).toBe('High');
    });

    it('should return "Medium" for scores >= 50 and < 75', () => {
      expect(getConfidenceLevel(50)).toBe('Medium');
      expect(getConfidenceLevel(60)).toBe('Medium');
      expect(getConfidenceLevel(74)).toBe('Medium');
    });

    it('should return "Low" for scores < 50', () => {
      expect(getConfidenceLevel(0)).toBe('Low');
      expect(getConfidenceLevel(25)).toBe('Low');
      expect(getConfidenceLevel(49)).toBe('Low');
    });
  });
});
