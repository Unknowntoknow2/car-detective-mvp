
import { buildValuationReport } from '../lib/valuation/buildValuationReport';
import { decodeVin } from '../services/vinService';
import { lookupPlate } from '../services/plateService';
import { uploadAndAnalyzePhotos } from '../services/photoService';
import { supabase } from '../integrations/supabase/client';

// Mock the services
jest.mock('../services/vinService');
jest.mock('../services/plateService');
jest.mock('../services/photoService');
jest.mock('../integrations/supabase/client');

describe('buildValuationReport', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock Supabase functions.invoke
    (supabase.functions.invoke as jest.Mock).mockImplementation((functionName, { body }) => {
      if (functionName === 'verify-payment') {
        return { data: { hasPremiumAccess: true } };
      }
      
      if (functionName === 'generate-explanation') {
        return { data: { explanation: 'This is an AI-generated explanation for your vehicle valuation.' } };
      }
      
      if (functionName === 'generate-pdf') {
        return { data: { pdfUrl: 'https://example.com/reports/sample.pdf' } };
      }
      
      if (functionName === 'notify-dealers') {
        return { data: { success: true } };
      }
      
      return { data: null };
    });
    
    // Mock VIN decode
    (decodeVin as jest.Mock).mockResolvedValue({
      make: 'Toyota',
      model: 'Camry',
      year: 2018,
      trim: 'LE',
      transmission: 'Automatic',
      fuelType: 'Gasoline'
    });
    
    // Mock plate lookup
    (lookupPlate as jest.Mock).mockResolvedValue({
      make: 'Honda',
      model: 'Accord',
      year: 2019,
      mileage: 45000,
      transmission: 'Automatic',
      fuelType: 'Gasoline'
    });
    
    // Mock photo analysis
    (uploadAndAnalyzePhotos as jest.Mock).mockResolvedValue({
      overallScore: 0.85,
      individualScores: [{ url: 'https://example.com/photos/1.jpg', score: 0.85, isPrimary: true }],
      aiCondition: {
        condition: 'Good',
        confidenceScore: 85,
        issuesDetected: ['Minor scratches on front bumper']
      }
    });
    
    // Mock Supabase query builder
    (supabase.from as jest.Mock).mockReturnValue({
      upsert: jest.fn().mockReturnValue({
        error: null
      })
    });
  });

  test('Happy path: full premium user with VIN, photos, and GPT', async () => {
    const result = await buildValuationReport({
      identifierType: 'vin',
      vin: '1HGCM82633A123456',
      mileage: 50000,
      condition: 'Good',
      zipCode: '90210',
      photos: [new File([''], 'car-photo.jpg')],
      userId: 'user-123',
      valuationId: 'valuation-123',
      isPremium: true,
      isTestMode: false,
      notifyDealers: true
    });
    
    expect(result).toBeDefined();
    expect(result.make).toBe('Toyota');
    expect(result.model).toBe('Camry');
    expect(result.year).toBe(2018);
    expect(result.estimatedValue).toBeDefined();
    expect(result.confidenceScore).toBeDefined();
    expect(result.priceRange).toBeDefined();
    expect(result.photoScore).toBeCloseTo(0.85);
    expect(result.bestPhotoUrl).toBeDefined();
    expect(result.explanation).toBeDefined();
    expect(result.isPremium).toBe(true);
    expect(result.pdfUrl).toBeDefined();
    
    // Verify service calls
    expect(decodeVin).toHaveBeenCalledWith('1HGCM82633A123456');
    expect(uploadAndAnalyzePhotos).toHaveBeenCalled();
    expect(supabase.functions.invoke).toHaveBeenCalledWith('verify-payment', expect.any(Object));
    expect(supabase.functions.invoke).toHaveBeenCalledWith('generate-explanation', expect.any(Object));
    expect(supabase.functions.invoke).toHaveBeenCalledWith('generate-pdf', expect.any(Object));
    expect(supabase.functions.invoke).toHaveBeenCalledWith('notify-dealers', expect.any(Object));
    expect(supabase.from).toHaveBeenCalledWith('valuations');
  });

  test('Basic path: free user with plate lookup, no premium features', async () => {
    // Mock verify-payment to return false for premium access
    (supabase.functions.invoke as jest.Mock).mockImplementation((functionName, { body }) => {
      if (functionName === 'verify-payment') {
        return { data: { hasPremiumAccess: false } };
      }
      return { data: null };
    });
    
    const result = await buildValuationReport({
      identifierType: 'plate',
      plate: 'ABC123',
      state: 'CA',
      mileage: 60000,
      condition: 'Fair',
      zipCode: '94107',
      userId: 'user-456',
      valuationId: 'valuation-456',
      isPremium: false
    });
    
    expect(result).toBeDefined();
    expect(result.make).toBe('Honda');
    expect(result.model).toBe('Accord');
    expect(result.year).toBe(2019);
    expect(result.estimatedValue).toBeDefined();
    expect(result.confidenceScore).toBeDefined();
    expect(result.priceRange).toBeDefined();
    expect(result.photoScore).toBeUndefined();
    expect(result.bestPhotoUrl).toBeNull();
    expect(result.explanation).toBeUndefined();
    expect(result.isPremium).toBe(false);
    expect(result.pdfUrl).toBeUndefined();
    
    // Verify service calls
    expect(lookupPlate).toHaveBeenCalledWith('ABC123', 'CA');
    expect(uploadAndAnalyzePhotos).not.toHaveBeenCalled();
    expect(supabase.functions.invoke).toHaveBeenCalledWith('verify-payment', expect.any(Object));
    expect(supabase.functions.invoke).not.toHaveBeenCalledWith('generate-explanation', expect.any(Object));
    expect(supabase.functions.invoke).not.toHaveBeenCalledWith('generate-pdf', expect.any(Object));
    expect(supabase.functions.invoke).not.toHaveBeenCalledWith('notify-dealers', expect.any(Object));
  });

  test('Manual entry with features and accident history', async () => {
    const result = await buildValuationReport({
      identifierType: 'manual',
      make: 'Ford',
      model: 'Mustang',
      year: 2020,
      mileage: 30000,
      condition: 'Excellent',
      zipCode: '60601',
      fuelType: 'Gasoline',
      transmission: 'Manual',
      accidentCount: 1,
      features: ['Leather Seats', 'Navigation', 'Premium Sound'],
      userId: 'user-789',
      valuationId: 'valuation-789',
      isPremium: false
    });
    
    expect(result).toBeDefined();
    expect(result.make).toBe('Ford');
    expect(result.model).toBe('Mustang');
    expect(result.year).toBe(2020);
    expect(result.estimatedValue).toBeDefined();
    expect(result.confidenceScore).toBeDefined();
    expect(result.priceRange).toBeDefined();
    expect(result.features).toEqual(['Leather Seats', 'Navigation', 'Premium Sound']);
    
    // Check for accident adjustment in results
    const accidentAdjustment = result.adjustments.find(adj => adj.factor.toLowerCase().includes('accident'));
    expect(accidentAdjustment).toBeDefined();
    expect(accidentAdjustment?.impact).toBeLessThan(0); // Should be negative impact
  });

  test('Error handling: missing VIN', async () => {
    await expect(buildValuationReport({
      identifierType: 'vin',
      // vin: undefined, // Intentionally missing
      mileage: 50000,
      condition: 'Good',
      zipCode: '90210',
      userId: 'user-123',
      valuationId: 'valuation-123'
    })).rejects.toThrow('VIN is required');
  });

  test('Error handling: VIN decode failure', async () => {
    // Mock VIN decode to fail
    (decodeVin as jest.Mock).mockRejectedValue(new Error('Failed to decode VIN'));
    
    await expect(buildValuationReport({
      identifierType: 'vin',
      vin: 'INVALID-VIN',
      mileage: 50000,
      condition: 'Good',
      zipCode: '90210',
      userId: 'user-123',
      valuationId: 'valuation-123'
    })).rejects.toThrow('Failed to decode VIN');
  });

  test('Error handling: Photo analysis failure', async () => {
    // Mock photo analysis to fail
    (uploadAndAnalyzePhotos as jest.Mock).mockResolvedValue({
      overallScore: 0,
      individualScores: [],
      error: 'Failed to analyze photos'
    });
    
    // Test should still complete without photo data
    const result = await buildValuationReport({
      identifierType: 'vin',
      vin: '1HGCM82633A123456',
      mileage: 50000,
      condition: 'Good',
      zipCode: '90210',
      photos: [new File([''], 'car-photo.jpg')],
      userId: 'user-123',
      valuationId: 'valuation-123',
      isPremium: true
    });
    
    expect(result).toBeDefined();
    expect(result.photoScore).toBeUndefined();
    expect(result.bestPhotoUrl).toBeNull();
    expect(result.aiCondition).toBeUndefined();
  });
});
