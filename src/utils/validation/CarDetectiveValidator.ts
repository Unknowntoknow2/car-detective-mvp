
import { z } from "zod";
import { validateStatePlate } from "./plate-validation-helpers";

// Types for the validator
export type VehicleFormData = {
  make?: string;
  model?: string;
  year?: number | string;
  mileage?: number | string;
  zipCode?: string;
  condition?: string;
  fuelType?: string;
  transmission?: string;
  vin?: string;
  plate?: string;
  state?: string;
  features?: string[];
  accidentCount?: number;
  hasOpenRecall?: boolean;
  photoScore?: number;
  bodyType?: string;
  trim?: string;
  [key: string]: any; // Allow for future field additions
};

export type FieldErrorMap = {
  [key in keyof VehicleFormData]?: string;
};

export type ValidationResult = {
  valid: boolean;
  errors: FieldErrorMap;
};

export class CarDetectiveValidator {
  private static readonly CURRENT_YEAR = new Date().getFullYear();
  
  // Allowed values
  private static readonly ALLOWED_CONDITIONS = ["Excellent", "Good", "Fair", "Poor"];
  private static readonly ALLOWED_FUEL_TYPES = ["Gasoline", "Diesel", "Electric", "Hybrid", "Plug-in Hybrid", "Natural Gas", "Flex Fuel"];
  private static readonly ALLOWED_TRANSMISSIONS = ["Automatic", "Manual", "CVT", "Semi-Automatic", "Dual Clutch"];
  
  // Zod schema for vehicle data
  private static vehicleSchema = z.object({
    make: z.string().min(1, "Make is required"),
    model: z.string().min(1, "Model is required"),
    year: z.preprocess(
      (val) => (typeof val === "string" ? parseInt(val, 10) : val),
      z.number()
        .int("Year must be a whole number")
        .min(1980, "Year must be 1980 or later")
        .max(CarDetectiveValidator.CURRENT_YEAR, `Year cannot be greater than ${CarDetectiveValidator.CURRENT_YEAR}`)
    ),
    mileage: z.preprocess(
      (val) => (typeof val === "string" ? parseInt(val, 10) : val),
      z.number()
        .int("Mileage must be a whole number")
        .min(0, "Mileage must be 0 or greater")
        .max(300000, "Mileage must be 300,000 or less")
    ),
    zipCode: z.string()
      .regex(/^\d{5}$/, "ZIP code must be a 5-digit number"),
    condition: z.enum(CarDetectiveValidator.ALLOWED_CONDITIONS as [string, ...string[]], {
      errorMap: () => ({ message: `Condition must be one of: ${CarDetectiveValidator.ALLOWED_CONDITIONS.join(", ")}` }),
    }),
    fuelType: z.enum(CarDetectiveValidator.ALLOWED_FUEL_TYPES as [string, ...string[]], {
      errorMap: () => ({ message: `Fuel type must be one of: ${CarDetectiveValidator.ALLOWED_FUEL_TYPES.join(", ")}` }),
    }),
    transmission: z.enum(CarDetectiveValidator.ALLOWED_TRANSMISSIONS as [string, ...string[]], {
      errorMap: () => ({ message: `Transmission must be one of: ${CarDetectiveValidator.ALLOWED_TRANSMISSIONS.join(", ")}` }),
    }),
    vin: z.string().optional(),
    plate: z.string().optional(),
    state: z.string().optional(),
    features: z.array(z.string()).optional(),
    accidentCount: z.number().int().min(0).optional(),
    hasOpenRecall: z.boolean().optional(),
    photoScore: z.number().min(0).max(1).optional(),
    bodyType: z.string().optional(),
    trim: z.string().optional(),
  }).partial();

  /**
   * Validates a complete vehicle form
   * @param data Vehicle form data to validate
   * @returns Validation result with valid flag and error messages
   */
  public static isValidForm(data: VehicleFormData): ValidationResult {
    // Create a sub-schema based on which fields are present
    // This allows us to only validate the fields that are provided
    const result = this.vehicleSchema.safeParse(data);
    
    if (result.success) {
      return { valid: true, errors: {} };
    }
    
    // Format Zod errors into our error map format
    const errors: FieldErrorMap = {};
    result.error.errors.forEach((err) => {
      const path = err.path[0] as keyof VehicleFormData;
      errors[path] = err.message;
    });
    
    return { valid: false, errors };
  }

  /**
   * Validates a single field
   * @param field Field name to validate
   * @param value Field value to validate
   * @returns Error message or null if valid
   */
  public static validateField(field: keyof VehicleFormData, value: any): string | null {
    // Create a schema just for this field
    // Fix for TS7053 error: use type assertion for shape indexing
    const fieldSchema = z.object({ 
      [field]: (this.vehicleSchema.shape as any)[field] || z.any() 
    }).partial();
    
    const result = fieldSchema.safeParse({ [field]: value });
    
    if (result.success) {
      return null;
    }
    
    return result.error.errors[0]?.message || `Invalid ${field}`;
  }

  /**
   * Validates a VIN
   * @param vin VIN to validate
   * @returns Whether the VIN is valid
   */
  public static isValidVIN(vin: string): boolean {
    if (!vin) return false;
    
    // Remove spaces and make uppercase
    vin = vin.replace(/\s/g, "").toUpperCase();
    
    // Check length and character set (excluding I, O, Q)
    const vinRegex = /^[A-HJ-NPR-Z0-9]{17}$/;
    if (!vinRegex.test(vin)) return false;
    
    // Simple checksum validation (could be expanded in the future)
    // This is a basic implementation and doesn't cover all cases
    return true;
  }

  /**
   * Validates a license plate
   * @param plate License plate to validate
   * @param state Two-letter state code
   * @returns Whether the plate is valid for the given state
   */
  public static isValidPlate(plate: string, state: string): boolean {
    if (!plate || !state) return false;
    
    // Use the state-specific validation
    const validationResult = validateStatePlate(plate, state);
    return validationResult.valid;
  }

  /**
   * Asynchronously validates a VIN against an external API
   * @param vin VIN to validate
   * @returns Promise resolving to whether the VIN is valid
   */
  public static async isAsyncValidVIN(vin: string): Promise<boolean> {
    // Basic validation first
    if (!this.isValidVIN(vin)) return false;
    
    try {
      // This could be replaced with an actual API call
      // For now, we'll just use the sync validator
      return true;
    } catch (error) {
      console.error("Error validating VIN:", error);
      return false;
    }
  }
}
