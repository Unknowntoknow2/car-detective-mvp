
export interface AICondition {
  score: number;
  category: string;
  confidence: number;
  condition: string;
  summary?: string;
  issuesDetected?: string[];
}

export interface Photo {
  id: string;
  url: string;
  file?: File;
  timestamp?: Date;
  analyzed?: boolean;
  score?: number;
  name?: string;
  preview?: string;
  uploading?: boolean;
  error?: string;
}

export interface PhotoScore {
  overall: number;
  clarity: number;
  angle: number;
  lighting: number;
  condition: number;
}

export interface PhotoUploadProps {
  onPhotosChange: (photos: Photo[]) => void;
  maxFiles?: number;
  acceptedFileTypes?: string[];
  disabled?: boolean;
  onPhotoAnalysisComplete?: (analysis: AICondition) => void;
  onPhotoUpload?: (files: File[]) => void;
  isLoading?: boolean;
  vehicle?: any;
}

export const MAX_FILES = 10;
export const MIN_FILES = 1;

export const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg', 
  'image/png',
  'image/webp'
];
