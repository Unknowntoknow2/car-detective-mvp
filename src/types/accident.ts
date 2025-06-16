export interface Accident {
  id: string;
  date: string;
  description: string;
  location: string;
  severity: 'minor' | 'moderate' | 'severe';
}

export interface AccidentImpact {
  severity: 'minor' | 'moderate' | 'severe';
  impact: number;
  percentImpact: number;
  dollarImpact: number;
  description: string;
}
