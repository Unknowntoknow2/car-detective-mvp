
import { Photo, AICondition, PhotoScore } from '@/types/photo';

/**
 * Interface for photo uploading API response
 */
export interface PhotoUploadResponse {
  photoUrls: string[];
  condition?: string;
  confidenceScore: number;
  issuesDetected?: string[];
  aiSummary?: string;
  individualScores?: {
    url: string;
    score: number;
  }[];
}

/**
 * Interface for the response from photo upload and analysis
 */
export interface PhotoAnalysisResult {
  photoUrls: string[];
  score: number;
  aiCondition?: AICondition;
  individualScores?: PhotoScore[];
}
