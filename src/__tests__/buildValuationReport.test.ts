
import { buildValuationReport } from '@/lib/valuation/buildValuationReport';
import { calculateValuation } from '@/utils/valuation/valuationEngine';
import { supabase } from '@/integrations/supabase/client';
import { decodeVin } from '@/services/vinService';
import { lookupPlate } from '@/services/plateService';
import { downloadPdf } from '@/utils/pdf';

// Mock the dependencies
jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    upsert: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    maybeSingle: jest.fn().mockReturnThis(),
    single: jest.fn().mockReturnThis(),
    functions: {
      invoke: jest.fn()
    }
  }
}));

jest.mock('@/utils/valuation/valuationEngine');
jest.mock('@/services/vinService');
jest.mock('@/services/plateService');
jest.mock('@/utils/pdf');

// Test data
const mockVinData = {
  make: 'Toyota',
  model: 'Camry',
  year: 2020,
  trim: 'SE',
  bodyType: 'Sedan',
  transmission: 'Automatic',
  fuelType: 'Gasoline'
};

const mockPlateData = {
  vin: 'ABC123456789',
  make: 'Honda',
  model: 'Accord',
  year: 2019,
  mileage: 35000
};

const mockValuationResult = {
  estimatedValue: 25000,
  basePrice: 28000,
  adjustments: [
    { name: 'Mileage', value: -2000, description: 'Adjustment for mileage', percentAdjustment: -7.14 },
    { name: 'Condition', value: -1000, description: 'Vehicle in Good condition', percentAdjustment: -3.57 }
  ],
  priceRange: [23500, 26500],
  confidenceScore: 85
};

const mockPhoto = new File(['mock photo content'], 'test-photo.jpg', { type: 'image/jpeg' });

describe('buildValuationReport', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock Supabase responses
    (supabase.from as jest.Mock).mockReturnThis();
    (supabase.select as jest.Mock).mockReturnThis();
    (supabase.eq as jest.Mock).mockReturnThis();
    (supabase.maybeSingle as jest.Mock).mockResolvedValue({ data: { base_price: 28000 }, error: null });
    (supabase.insert as jest.Mock).mockResolvedValue({ data: { id: 'test-session-id' }, error: null });
    (supabase.upsert as jest.Mock).mockResolvedValue({ data: null, error: null });
    
    // Mock function calls
    (decodeVin as jest.Mock).mockResolvedValue(mockVinData);
    (lookupPlate as jest.Mock).mockResolvedValue(mockPlateData);
    (calculateValuation as jest.Mock).mockResolvedValue(mockValuationResult);
    (downloadPdf as jest.Mock).mockResolvedValue(undefined);
    
    // Mock Supabase function invocations
    (supabase.functions.invoke as jest.Mock).mockImplementation((functionName, { body }) => {
      if (functionName === 'score-image') {
        return Promise.resolve({
          data: {
            scores: [{ url: 'https://example.com/photo.jpg', score: 0.85 }],
            aiCondition: {
              condition: 'Good',
              confidenceScore: 85,
              issuesDetected: ['Minor scratches']
            }
          },
          error: null
        });
      }
      
      if (functionName === 'generate-explanation') {
        return Promise.resolve({
          data: {
            explanation: 'This is a test explanation of the vehicle valuation.'
          },
          error: null
        });
      }
      
      if (functionName === 'verify-payment') {
        return Promise.resolve({
          data: {
            hasPremiumAccess: true
          },
          error: null
        });
      }
      
      return Promise.resolve({ data: null, error: null });
    });
  });

  // Test 1: Happy path - full premium user with photos, GPT, PDF
  test('should process a full premium valuation with photos, GPT, and PDF', async () => {
    // Arrange
    const input = {
      identifierType: 'vin',
      vin: 'JH4DA9370MS016526',
      userId: 'user-123',
      valuationId: 'val-123',
      mileage: 45000,
      condition: 'Good',
      zipCode: '90210',
      photos: [mockPhoto],
      isPremium: true,
      notifyDealers: true
    };
    
    // Act
    const result = await buildValuationReport(input);
    
    // Assert
    expect(result).toBeDefined();
    expect(result.make).toBe('Toyota');
    expect(result.model).toBe('Camry');
    expect(result.year).toBe(2020);
    expect(result.estimatedValue).toBe(25000);
    expect(result.isPremium).toBe(true);
    expect(result.photoScore).toBe(85);
    expect(result.gptExplanation).toBe('This is a test explanation of the vehicle valuation.');
    expect(result.pdfUrl).toContain('valuation-Toyota-Camry');
    
    // Verify function calls
    expect(decodeVin).toHaveBeenCalledWith('JH4DA9370MS016526');
    expect(calculateValuation).toHaveBeenCalled();
    expect(supabase.functions.invoke).toHaveBeenCalledWith('score-image', expect.any(Object));
    expect(supabase.functions.invoke).toHaveBeenCalledWith('generate-explanation', expect.any(Object));
    expect(supabase.functions.invoke).toHaveBeenCalledWith('verify-payment', expect.any(Object));
    expect(downloadPdf).toHaveBeenCalled();
    expect(supabase.upsert).toHaveBeenCalled();
  });

  // Test 2: Basic free user flow (no premium features)
  test('should process a basic free valuation without premium features', async () => {
    // Mock verify-payment to return no premium access
    (supabase.functions.invoke as jest.Mock).mockImplementation((functionName, { body }) => {
      if (functionName === 'verify-payment') {
        return Promise.resolve({
          data: {
            hasPremiumAccess: false,
            reason: 'No payment found'
          },
          error: null
        });
      }
      
      return Promise.resolve({ data: null, error: null });
    });
    
    // Arrange
    const input = {
      identifierType: 'manual',
      make: 'Ford',
      model: 'Mustang',
      year: 2018,
      mileage: 50000,
      condition: 'Good',
      zipCode: '60601',
      userId: 'user-456',
      valuationId: 'val-456'
    };
    
    // Act
    const result = await buildValuationReport(input);
    
    // Assert
    expect(result).toBeDefined();
    expect(result.make).toBe('Ford');
    expect(result.model).toBe('Mustang');
    expect(result.year).toBe(2018);
    expect(result.estimatedValue).toBe(25000);
    expect(result.isPremium).toBe(false);
    expect(result.gptExplanation).toBeNull();
    expect(result.pdfUrl).toBeNull();
    
    // Verify function calls
    expect(decodeVin).not.toHaveBeenCalled();
    expect(lookupPlate).not.toHaveBeenCalled();
    expect(calculateValuation).toHaveBeenCalled();
    expect(supabase.functions.invoke).toHaveBeenCalledWith('verify-payment', expect.any(Object));
    expect(downloadPdf).not.toHaveBeenCalled();
    expect(supabase.upsert).toHaveBeenCalled();
  });

  // Test 3: Error handling - missing VIN
  test('should handle errors when VIN lookup fails', async () => {
    // Mock VIN decoder to throw an error
    (decodeVin as jest.Mock).mockRejectedValue(new Error('Invalid VIN'));
    
    // Arrange
    const input = {
      identifierType: 'vin',
      vin: 'INVALID-VIN',
      userId: 'user-789',
      valuationId: 'val-789'
    };
    
    // Act & Assert
    await expect(buildValuationReport(input)).rejects.toThrow('Valuation failed: Failed to decode vehicle information');
  });

  // Test 4: Error handling - photo upload fails
  test('should handle errors when photo upload fails but continue with valuation', async () => {
    // Mock score-image function to return an error
    (supabase.functions.invoke as jest.Mock).mockImplementation((functionName, { body }) => {
      if (functionName === 'score-image') {
        return Promise.resolve({
          data: null,
          error: { message: 'Failed to process photos' }
        });
      }
      
      if (functionName === 'verify-payment') {
        return Promise.resolve({
          data: { hasPremiumAccess: true },
          error: null
        });
      }
      
      return Promise.resolve({ data: null, error: null });
    });
    
    // Arrange
    const input = {
      identifierType: 'vin',
      vin: 'JH4DA9370MS016526',
      userId: 'user-123',
      valuationId: 'val-123',
      mileage: 45000,
      condition: 'Good',
      zipCode: '90210',
      photos: [mockPhoto],
      isPremium: true
    };
    
    // Act
    const result = await buildValuationReport(input);
    
    // Assert
    expect(result).toBeDefined();
    expect(result.make).toBe('Toyota');
    expect(result.model).toBe('Camry');
    expect(result.photoScore).toBeUndefined();
    expect(result.bestPhotoUrl).toBeNull();
    
    // Valuation should still continue
    expect(result.estimatedValue).toBe(25000);
    expect(calculateValuation).toHaveBeenCalled();
  });

  // Test 5: Plate lookup and edge cases
  test('should process a valuation from license plate lookup', async () => {
    // Arrange
    const input = {
      identifierType: 'plate',
      plate: 'ABC123',
      state: 'CA',
      mileage: 40000,
      condition: 'Excellent',
      zipCode: '94105',
      userId: 'user-999',
      valuationId: 'val-999'
    };
    
    // Act
    const result = await buildValuationReport(input);
    
    // Assert
    expect(result).toBeDefined();
    expect(result.make).toBe('Honda');
    expect(result.model).toBe('Accord');
    expect(result.year).toBe(2019);
    expect(result.vin).toBe('ABC123456789');
    expect(result.mileage).toBe(35000); // From the plate data
    
    // Verify function calls
    expect(lookupPlate).toHaveBeenCalledWith('ABC123', 'CA');
    expect(calculateValuation).toHaveBeenCalled();
  });

  // Test 6: Mileage outlier and edge cases
  test('should handle edge cases like mileage outliers', async () => {
    // Arrange
    const input = {
      identifierType: 'manual',
      make: 'Tesla',
      model: 'Model 3',
      year: 2020,
      mileage: 300000, // Extremely high mileage
      condition: 'Poor',
      zipCode: '10001',
      userId: 'user-555',
      valuationId: 'val-555'
    };
    
    // Mock a different valuation result for high mileage
    const highMileageResult = {
      ...mockValuationResult,
      estimatedValue: 15000,
      adjustments: [
        { name: 'Mileage', value: -10000, description: 'Excessive mileage', percentAdjustment: -35.71 },
        { name: 'Condition', value: -3000, description: 'Vehicle in Poor condition', percentAdjustment: -10.71 }
      ],
      priceRange: [13500, 16500],
      confidenceScore: 70
    };
    
    (calculateValuation as jest.Mock).mockResolvedValue(highMileageResult);
    
    // Act
    const result = await buildValuationReport(input);
    
    // Assert
    expect(result).toBeDefined();
    expect(result.estimatedValue).toBe(15000);
    expect(result.confidenceScore).toBe(70);
    
    // Expect a larger adjustment for mileage
    expect(calculateValuation).toHaveBeenCalledWith(expect.objectContaining({
      mileage: 300000,
      condition: 'Poor'
    }), expect.any(Function));
  });
});
