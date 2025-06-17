
export interface AccidentImpact {
  totalImpact: number;
  percentImpact: number;
  dollarImpact: number;
  severity: 'minor' | 'moderate' | 'major';
  description: string;
}

export interface AccidentHistory {
  hadAccident: boolean;
  accidentCount: number;
  severity?: 'minor' | 'moderate' | 'major';
  frameDamage?: boolean;
  airbagDeployment?: boolean;
  description?: string;
}
