
// Response types for vehicle condition assessment
export interface ConditionAssessmentResult {
  condition: "Excellent" | "Good" | "Fair" | "Poor";
  confidenceScore: number; // 0 to 100
  issuesDetected: string[]; // e.g., ['Front bumper scratches', 'Faded roof paint']
  aiSummary: string; // ~1 paragraph
  id?: string; // Optional ID from database storage
}

// Error response interface
export interface ErrorResponse {
  error: string;
  details?: string;
}
