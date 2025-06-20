
export interface AccidentDetails {
  hadAccident: boolean;
  count?: number;
  location?: string;
  severity?: 'minor' | 'moderate' | 'severe';
  repaired?: boolean;
  frameDamage?: boolean;
  description?: string;
  types?: string[];
  repairShops?: string[];
}
