
// Centralized accident detail types
export interface AccidentDetails {
  hadAccident: boolean;
  severity?: 'minor' | 'moderate' | 'severe';
  repaired?: boolean;
  count?: number;
  location?: string;
  description?: string;
  frameDamage?: boolean;
  types?: string[];
  repairShops?: string[];
  airbagDeployment?: boolean;
}

// Legacy alias for backward compatibility
export type AccidentHistory = AccidentDetails;
