
export interface AccidentImpact {
  totalImpact: number;
  percentImpact: number;
  dollarImpact: number;
  severity: 'minor' | 'moderate' | 'major';
  description: string;
  recommendations?: string[];
  isPremium?: boolean;
}

export interface AccidentHistory {
  hadAccident: boolean;
  accidentCount: number;
  severity?: 'minor' | 'moderate' | 'major'; // Changed from 'severe' to 'major'
  frameDamage?: boolean;
  airbagDeployment?: boolean;
  description?: string;
}
