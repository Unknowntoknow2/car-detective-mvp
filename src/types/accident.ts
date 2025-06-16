
export interface AccidentImpact {
  percentImpact: number;
  dollarImpact: number;
  severity: 'minor' | 'moderate' | 'major' | 'severe';
  description: string;
}

export interface AccidentDetails {
  hadAccident: boolean;
  count?: number;
  severity?: string;
  frameDamage?: boolean;
  repaired?: boolean;
  impact?: AccidentImpact;
}
