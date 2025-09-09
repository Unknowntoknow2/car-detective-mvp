import { z } from "zod";

/**
 * Schema validation for AIN API upstream responses
 * Prevents regressions and ensures data integrity
 */
export const AINResponseSchema = z.object({
  finalValue: z.number().min(0, "Final value must be positive"),
  priceRange: z.array(z.number()).length(2, "Price range must have exactly 2 values"),
  confidenceScore: z.number().min(0).max(100, "Confidence score must be between 0-100"),
  marketListingsCount: z.number().min(0, "Market listings count cannot be negative"),
  adjustments: z.array(z.any()).optional(),
  explanation: z.string().min(1, "Explanation is required"),
  sourcesUsed: z.array(z.string()).min(1, "At least one source must be specified")
});

export type AINResponse = z.infer<typeof AINResponseSchema>;

/**
 * Validates an AIN API response and returns typed data
 * @param data - Raw response data from AIN API
 * @returns Validated AIN response or throws validation error
 */
export function validateAINResponse(data: unknown): AINResponse {
  try {
    return AINResponseSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
      throw new Error(`AIN response validation failed: ${errorMessages.join(', ')}`);
    }
    throw error;
  }
}

/**
 * Safely validates an AIN API response without throwing
 * @param data - Raw response data from AIN API
 * @returns Validation result with success flag and data/error
 */
export function safeValidateAINResponse(data: unknown): {
  success: boolean;
  data?: AINResponse;
  error?: string;
} {
  try {
    const validatedData = validateAINResponse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown validation error"
    };
  }
}