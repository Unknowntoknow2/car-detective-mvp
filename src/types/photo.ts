
export interface AICondition {
  overall: string;
  exterior: string;
  interior: string;
  mechanical: string;
  score: number;
  confidence: number;
}

export interface PhotoAnalysis {
  id: string;
  photoUrl: string;
  condition: AICondition;
  timestamp: string;
}
