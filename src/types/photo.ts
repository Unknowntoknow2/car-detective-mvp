
export interface AICondition {
  condition: "Excellent" | "Good" | "Fair" | "Poor";
  confidenceScore: number;
  aiSummary?: string;
  issuesDetected?: string[];
  photoUrl?: string;
  bestPhotoUrl?: string;
}

export interface GeneratedCondition {
  condition: string;
  confidenceScore: number;
  aiSummary?: string;
  issuesDetected?: string[];
  photoUrl?: string;
  bestPhotoUrl?: string;
}
