
// Define the ValuationResult interface
export interface ValuationResult {
  id?: string;
  estimatedValue: number;
  estimated_value?: number; // For backward compatibility
  confidenceScore?: number;
  confidence_score?: number; // For backward compatibility
  priceRange: [number, number] | { min: number; max: number; } | number[];
  basePrice?: number;
  base_price?: number; // For backward compatibility
  baseValue?: number;
  finalValue?: number;
  adjustments: Array<{
    factor: string;
    impact: number;
    description?: string;
  }>;
  make?: string;
  model?: string;
  year?: number;
  mileage?: number;
  condition?: string;
  vin?: string;
  isPremium?: boolean;
  is_premium?: boolean; // For backward compatibility
  premium_unlocked?: boolean; // For backward compatibility
  features?: string[];
  color?: string;
  bodyStyle?: string;
  bodyType?: string;
  fuelType?: string;
  fuel_type?: string; // For backward compatibility
  explanation?: string;
  gptExplanation?: string; // For backward compatibility
  transmission?: string;
  bestPhotoUrl?: string;
  photoUrl?: string;
  photo_url?: string; // For backward compatibility
  photoScore?: number;
  photoExplanation?: string;
  pdfUrl?: string;
  userId?: string;
  zipCode?: string;
  zip_code?: string; // For backward compatibility
  zip?: string; // For backward compatibility
  aiCondition?: any;
  photoUrls?: string[];
}
