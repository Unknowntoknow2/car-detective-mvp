
export interface PhotoMetadata {
  id: string;
  url: string;
  uploadedAt: string;
  size: number;
  type: string;
}

export interface PhotoAnalysisResult {
  condition: string;
  score: number;
  issues: string[];
  confidence: number;
}

export interface PhotoUploadResult {
  success: boolean;
  photos: PhotoMetadata[];
  analysis?: PhotoAnalysisResult;
}
