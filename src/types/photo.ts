
export interface PhotoUploadProps {
  onUpload?: (files: File[]) => void;
  maxFiles?: number;
  acceptedFileTypes?: string[];
  maxFileSize?: number;
  disabled?: boolean;
  className?: string;
}

export interface PhotoData {
  id: string;
  url: string;
  filename: string;
  size: number;
  uploadedAt: Date;
}
