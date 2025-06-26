import { DecodedVehicleInfo } from "@/types/vehicle";
import { supabase } from '@/integrations/supabase/client';

export interface UnifiedVehicleLookupResult {
  success: boolean;
  vehicle?: DecodedVehicleInfo;
  source: 'vin' | 'plate' | 'manual' | 'vpic' | 'carfax' | 'cache' | 'fallback' | 'failed';
  tier: 'free' | 'premium';
  confidence?: number;
  error?: string;
  warning?: string;
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
    console.log("🚀 UnifiedLookupService: Starting direct NHTSA VIN lookup", vin, options);
    
    try {
      // Validate VIN format
      if (!this.validateVin(vin)) {
        console.error('❌ UnifiedLookupService: Invalid VIN format:', vin);
        return {
          success: false,
          source: 'failed',
          tier: options.tier,
          error: 'Invalid VIN format. VIN must be 17 characters (letters and numbers only, no I, O, Q)'
        };
      }

      // Call the unified-decode edge function directly (no retries)
      console.log('🔍 UnifiedLookupService: Calling unified-decode edge function for VIN:', vin);
      
      const response = await supabase.functions.invoke('unified-decode', {
        body: { vin: vin.toUpperCase() }
      });
      
      const { data, error } = response;

      if (error) {
        console.error('❌ UnifiedLookupService: Edge function error:', error);
        
        // Generate fallback vehicle data only on actual API failure
        const fallbackVehicle = this.generateFallbackVehicle(vin);
        
        return {
          success: true,
          vehicle: fallbackVehicle,
          source: 'fallback',
          tier: options.tier,
          confidence: 60,
          warning: 'NHTSA API temporarily unavailable. Using estimated vehicle data based on VIN pattern.'
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
          confidenceScore: data.source === 'nhtsa' ? 95 : (data.source === 'cache' ? 90 : 75),
        };

        console.log('🎉 UnifiedLookupService: Successfully processed NHTSA vehicle data:', vehicle);

        const result: UnifiedVehicleLookupResult = {
          success: true,
          vehicle,
          source: data.source === 'nhtsa' ? 'vpic' : data.source,
          tier: options.tier,
          confidence: vehicle.confidenceScore,
          warning: data.warning
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

      // Handle failed decode - generate fallback only if NHTSA returned empty/invalid data
      console.error('❌ UnifiedLookupService: NHTSA returned incomplete data, generating fallback:', data);
      
      const fallbackVehicle = this.generateFallbackVehicle(vin);
      
      return {
        success: true,
        vehicle: fallbackVehicle,
        source: 'fallback',
        tier: options.tier,
        confidence: 70,
        warning: data?.error || 'NHTSA returned incomplete vehicle data. Using VIN pattern analysis.'
      };

    } catch (error) {
      console.error("❌ UnifiedLookupService: VIN lookup exception:", error);
      
      // Final fallback for network errors
      const fallbackVehicle = this.generateFallbackVehicle(vin);
      
      return {
        success: true,
        vehicle: fallbackVehicle,
        source: 'fallback',
        tier: options.tier,
        confidence: 50,
        warning: 'Service temporarily unavailable. Using basic VIN pattern matching.'
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

  private static generateFallbackVehicle(vin: string): DecodedVehicleInfo {
    const currentYear = new Date().getFullYear();
    const yearChar = vin.charAt(9);
    
    // Enhanced year extraction from VIN
    let year = currentYear - 5; // Default to 5 years ago
    if (yearChar >= '1' && yearChar <= '9') {
      year = 2001 + parseInt(yearChar);
    } else if (yearChar >= 'A' && yearChar <= 'Y') {
      year = 2010 + (yearChar.charCodeAt(0) - 65);
    }
    
    // Enhanced make detection from WMI (first 3 characters) - focusing on Toyota patterns
    const wmi = vin.substring(0, 3);
    let make = "Unknown";
    let model = "Vehicle";
    
    // Toyota patterns (including 5TD for RAV4, Highlander, etc.)
    if (wmi.startsWith("5TD") || wmi.startsWith("5TF") || wmi.startsWith("5TB") || 
        wmi.startsWith("JT") || wmi.startsWith("4T")) {
      make = "Toyota";
      // More specific model detection for Toyota
      if (wmi === "5TD") {
        if (vin.charAt(3) === 'Y') {
          model = "RAV4";
        } else if (vin.charAt(3) === 'Z') {
          model = "Highlander";
        } else {
          model = "SUV";
        }
      } else {
        model = "Camry";
      }
    } else if (wmi.startsWith("1G") || wmi.startsWith("1GC")) {
      make = "Chevrolet";
      model = "Silverado";
    } else if (wmi.startsWith("1F")) {
      make = "Ford";
      model = "F-150";
    } else if (wmi.startsWith("1H") || wmi.startsWith("19")) {
      make = "Honda";
      model = "Accord";
    } else if (wmi.startsWith("WBA") || wmi.startsWith("WBS")) {
      make = "BMW";
      model = "3 Series";
    }
    
    console.log(`🔧 Fallback vehicle generated for VIN ${vin}: ${year} ${make} ${model}`);
    
    return {
      vin,
      year: Math.min(Math.max(year, 1980), currentYear + 1),
      make,
      model,
      trim: "Standard",
      engine: make === "Toyota" ? "4-Cylinder" : "V6",
      transmission: "Automatic",
      bodyType: model.includes("SUV") || model === "RAV4" || model === "Highlander" ? "SUV" : "Sedan",
      fuelType: "Gasoline",
      drivetrain: model.includes("SUV") || model === "RAV4" || model === "Highlander" ? "AWD" : "FWD",
      doors: "4",
      seats: "5",
      displacement: make === "Toyota" ? "2.5L" : "3.0L",
      confidenceScore: make !== "Unknown" ? 70 : 50,
      mileage: 75000,
      condition: "Good"
    };
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
