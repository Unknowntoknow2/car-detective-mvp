import { DecodedVehicleInfo } from "@/types/vehicle";
import { supabase } from '@/integrations/supabase/client';

export interface UnifiedVehicleLookupResult {
  success: boolean;
  vehicle?: DecodedVehicleInfo;
  source: 'vin' | 'plate' | 'manual' | 'vpic' | 'carfax' | 'failed';
  tier: 'free' | 'premium';
  confidence?: number;
  error?: string;
  enhancedData?: {
    carfaxReport?: any;
    marketData?: any;
    historyRecords?: any[];
  };
}

export interface LookupOptions {
  tier: 'free' | 'premium';
  mode?: 'mock' | 'vpic' | 'carfax';
  includeHistory?: boolean;
  includeMarketData?: boolean;
}

export class UnifiedLookupService {
  static async lookupByVin(vin: string, options: LookupOptions): Promise<UnifiedVehicleLookupResult> {
    console.log("🚀 UnifiedLookupService: Starting VIN lookup with REAL NHTSA API", vin, options);
    
    try {
      // Validate VIN format
      if (!this.validateVin(vin)) {
        console.error('❌ UnifiedLookupService: Invalid VIN format:', vin);
        return {
          success: false,
          source: 'failed',
          tier: options.tier,
          error: 'Invalid VIN format'
        };
      }

      // Call the unified-decode edge function for REAL NHTSA data
      console.log('🔍 UnifiedLookupService: Calling unified-decode edge function for VIN:', vin);
      
      const { data, error } = await supabase.functions.invoke('unified-decode', {
        body: { vin: vin.toUpperCase() }
      });

      if (error) {
        console.error('❌ UnifiedLookupService: Edge function error:', error);
        return {
          success: false,
          source: 'failed',
          tier: options.tier,
          error: 'Service temporarily unavailable. Please try again.'
        };
      }

      console.log('✅ UnifiedLookupService: Edge function response:', data);

      // Handle successful decode
      if (data && data.success && data.decoded) {
        const decodedData = data.decoded;
        
        const vehicle: DecodedVehicleInfo = {
          vin: decodedData.vin,
          year: decodedData.year,
          make: decodedData.make,
          model: decodedData.model,
          trim: decodedData.trim || 'Standard',
          engine: decodedData.engine || decodedData.engineCylinders,
          transmission: decodedData.transmission,
          bodyType: decodedData.bodyType,
          fuelType: decodedData.fuelType,
          drivetrain: decodedData.drivetrain,
          doors: decodedData.doors,
          seats: decodedData.seats,
          displacement: decodedData.displacementL,
          confidenceScore: options.tier === 'premium' ? 95 : 85,
        };

        console.log('🎉 UnifiedLookupService: Successfully processed REAL vehicle data:', vehicle);

        const result: UnifiedVehicleLookupResult = {
          success: true,
          vehicle,
          source: data.source === 'nhtsa' ? 'vpic' : data.source,
          tier: options.tier,
          confidence: vehicle.confidenceScore
        };

        // Add premium features if applicable
        if (options.tier === 'premium') {
          result.enhancedData = {
            carfaxReport: { accidents: 0, owners: 1, serviceRecords: 15 },
            marketData: { averagePrice: 24500, priceRange: { min: 22000, max: 27000 } },
            historyRecords: []
          };
        }

        return result;
      }

      // Handle failed decode
      console.error('❌ UnifiedLookupService: Failed to decode VIN:', data);
      return {
        success: false,
        source: 'failed',
        tier: options.tier,
        error: data?.error || 'Unable to decode VIN'
      };

    } catch (error) {
      console.error("❌ UnifiedLookupService: VIN lookup exception:", error);
      return {
        success: false,
        source: 'failed',
        tier: options.tier,
        error: error instanceof Error ? error.message : 'VIN lookup failed'
      };
    }
  }

  static async lookupByPlate(plate: string, state: string, options: LookupOptions): Promise<UnifiedVehicleLookupResult> {
    console.log("UnifiedLookupService: Plate lookup", plate, state, options);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      const mockVehicle: DecodedVehicleInfo = {
        plate,
        state,
        year: 2020,
        make: 'Honda',
        model: 'Accord',
        trim: 'Sport',
        engine: '1.5L Turbo 4-Cylinder',
        transmission: 'CVT',
        bodyType: 'Sedan',
        fuelType: 'Gasoline',
        drivetrain: 'FWD',
        exteriorColor: 'Still Night Pearl',
        interiorColor: 'Black Leather',
        doors: '4',
        seats: '5',
        displacement: '1.5L',
        mileage: 52000,
        condition: 'Good',
        confidenceScore: options.tier === 'premium' ? 90 : 75,
        vin: 'MOCK_VIN_FROM_PLATE'
      };

      return {
        success: true,
        vehicle: mockVehicle,
        source: 'plate',
        tier: options.tier,
        confidence: mockVehicle.confidenceScore
      };
    } catch (error) {
      console.error("Plate lookup error:", error);
      return {
        success: false,
        source: 'failed',
        tier: options.tier,
        error: error instanceof Error ? error.message : 'Plate lookup failed'
      };
    }
  }

  static processManualEntry(data: any, options: LookupOptions): UnifiedVehicleLookupResult {
    console.log("UnifiedLookupService: Manual entry", data, options);
    
    try {
      const vehicle: DecodedVehicleInfo = {
        year: parseInt(data.year),
        make: data.make,
        model: data.model,
        trim: data.trim,
        mileage: data.mileage ? parseInt(data.mileage) : undefined,
        condition: data.condition,
        zipCode: data.zipCode,
        fuelType: data.fuelType,
        transmission: data.transmission,
        confidenceScore: 70 // Lower confidence for manual entry
      };

      return {
        success: true,
        vehicle,
        source: 'manual',
        tier: options.tier,
        confidence: vehicle.confidenceScore
      };
    } catch (error) {
      console.error("Manual entry processing error:", error);
      return {
        success: false,
        source: 'failed',
        tier: options.tier,
        error: 'Failed to process manual entry data'
      };
    }
  }

  private static validateVin(vin: string): boolean {
    if (!vin || vin.length !== 17) return false;
    const cleanVin = vin.replace(/[^A-HJ-NPR-Z0-9]/gi, '').toUpperCase();
    return cleanVin.length === 17 && /^[A-HJ-NPR-Z0-9]{17}$/i.test(cleanVin);
  }

  static startPremiumValuation = (vehicleData: DecodedVehicleInfo): void => {
    console.log("UnifiedLookupService: Starting premium valuation for", vehicleData);

    // Store vehicle data for premium valuation
    localStorage.setItem(
      "premium_vehicle",
      JSON.stringify({
        identifierType: vehicleData.vin ? "vin" : vehicleData.plate ? "plate" : "manual",
        identifier: vehicleData.vin || vehicleData.plate || `${vehicleData.make}_${vehicleData.model}`,
        make: vehicleData.make,
        model: vehicleData.model,
        year: vehicleData.year,
        trim: vehicleData.trim || "Standard",
      }),
    );
  };
}
