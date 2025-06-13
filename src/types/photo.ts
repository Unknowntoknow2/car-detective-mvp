
export interface PhotoUploadProps {
  onUpload?: (files: File[]) => void;
  maxFiles?: number;
  acceptedFileTypes?: string[];
  maxFileSize?: number;
  disabled?: boolean;
  className?: string;
  onPhotoAnalysisComplete?: (vehicle: any) => void;
  onPhotoUpload?: (files: File[]) => void;
  isLoading?: boolean;
  vehicle?: any;
}

export interface PhotoData {
  id: string;
  url: string;
  filename: string;
  size: number;
  uploadedAt: Date;
}

export interface AICondition {
  condition: string;
  confidence: number;
  details: string[];
}

export interface PhotoScore {
  url: string;
  score: number;
  issues?: string[];
}

export interface Photo {
  id: string;
  url: string;
  analysis?: {
    condition: AICondition;
    score: number;
  };
}
