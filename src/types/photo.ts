
export interface Photo {
  id: string;
  url: string;
  metadata?: Record<string, any>;
}

export interface PhotoScore {
  url: string;
  score: number;
  isPrimary?: boolean;
}

export interface AICondition {
  condition: "Excellent" | "Good" | "Fair" | "Poor";
  confidenceScore: number;
  issuesDetected?: string[];
  aiSummary?: string;
}
