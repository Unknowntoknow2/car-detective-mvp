
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

export interface AICondition {
  overall: string;
  exterior: number;
  interior: number;
  mechanical: number;
  confidence: number;
}

export interface PhotoUploadProps {
  onPhotoAnalysisComplete?: (vehicleData: any) => void;
  onPhotoUpload?: (files: File[]) => void;
  isLoading?: boolean;
  vehicle?: any;
}

export interface PhotoLookupTabProps {
  isLoading: boolean;
  vehicle: any;
  onPhotoUpload: (files: File[]) => void;
}
