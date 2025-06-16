
// Photo upload constants and types
export const MAX_FILES = 10;
export const MIN_FILES = 1;
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export interface Photo {
  id: string;
  url: string;
  name: string;
  file?: File;
  preview?: string;
  uploading?: boolean;
  uploaded?: boolean;
  error?: string;
  size?: number;
  type?: string;
}

export interface PhotoUploadState {
  photos: Photo[];
  isUploading: boolean;
  maxFiles: number;
  acceptedFileTypes: string[];
}

export interface PhotoUploadActions {
  addPhotos: (files: File[]) => void;
  removePhoto: (id: string) => void;
  clearPhotos: () => void;
  uploadPhotos: () => Promise<void>;
}

export interface PhotoUploadProps {
  onPhotoAnalysisComplete?: (vehicle: any) => void;
  onPhotoUpload?: (files: File[]) => void;
  isLoading?: boolean;
  vehicle?: any;
}

export interface AICondition {
  score: number;
  category: string;
  confidence: number;
  summary?: string;
  issuesDetected?: string[];
}

export interface PhotoScore {
  overall: number;
  exterior: number;
  interior: number;
  issues: string[];
}
