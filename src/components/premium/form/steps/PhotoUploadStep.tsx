<<<<<<< HEAD

import React, { useState, useCallback } from 'react';
import { FormData } from '@/types/premium-valuation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X, Image as ImageIcon, CheckCircle } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
=======
import React, { useCallback, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FormData } from "@/types/premium-valuation";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Camera, CheckCircle, Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { MAX_FILES, MIN_FILES, Photo } from "@/types/photo";
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

interface PhotoUploadStepProps {
  step: number;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  updateValidity: (step: number, isValid: boolean) => void;
}

export const PhotoUploadStep: React.FC<PhotoUploadStepProps> = ({
  step,
  formData,
  setFormData,
  updateValidity,
<<<<<<< HEAD
}) => {
  const [uploadedPhotos, setUploadedPhotos] = useState<File[]>(formData.photos || []);
  const [photoUrls, setPhotoUrls] = useState<string[]>(formData.photoUrls || []);
  const [isUploading, setIsUploading] = useState(false);
=======
  onPhotoUpload,
  isProcessing = false,
}: PhotoUploadStepProps) {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

  // Set initial validity based on existing data
  React.useEffect(() => {
    // Photos are optional, so this step is always valid
    updateValidity(step, true);
  }, [step, updateValidity]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

<<<<<<< HEAD
    // Create preview URLs
    const newUrls = acceptedFiles.map(file => URL.createObjectURL(file));
    
    // Update state
    setUploadedPhotos(prev => [...prev, ...acceptedFiles]);
    setPhotoUrls(prev => [...prev, ...newUrls]);
    
    // Simulate upload
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      
      // Update form data
      setFormData(prev => ({
        ...prev,
        photos: [...(prev.photos || []), ...acceptedFiles],
        photoUrls: [...(prev.photoUrls || []), ...newUrls]
      }));
    }, 1500);
  }, [setFormData]);
=======
      // Limit to MAX_FILES
      const filesToAdd = acceptedFiles.slice(0, MAX_FILES - photos.length);

      if (filesToAdd.length === 0) {
        toast.error(`Maximum ${MAX_FILES} photos allowed`);
        return;
      }

      // Create preview URLs and add to photos array
      const newPhotos = filesToAdd.map((file) => ({
        id: crypto.randomUUID(),
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        preview: URL.createObjectURL(file),
        uploading: false,
        uploaded: false,
      }));

      const updatedPhotos = [...photos, ...newPhotos];
      setPhotos(updatedPhotos);

      // Update formData with new photos
      const photoFiles = updatedPhotos
        .filter((p) => p.file)
        .map((p) => p.file as File);

      setFormData((prev) => ({
        ...prev,
        photos: photoFiles,
      }));

      // If there are enough photos, trigger AI analysis
      if (photoFiles.length >= MIN_FILES && onPhotoUpload) {
        setUploadProgress(25);
        await onPhotoUpload(photoFiles);
        setUploadProgress(100);

        // Update all photos to uploaded status
        setPhotos((prev) =>
          prev.map((photo) => ({
            ...photo,
            uploading: false,
            uploaded: true,
          }))
        );
      }
    },
    [photos, setFormData, onPhotoUpload],
  );
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
<<<<<<< HEAD
      'image/*': ['.jpeg', '.jpg', '.png', '.heic']
    },
    maxSize: 10485760 // 10MB
  });

  const removePhoto = (index: number) => {
    const newPhotos = [...uploadedPhotos];
    const newUrls = [...photoUrls];
    
    // Release object URL to avoid memory leaks
    URL.revokeObjectURL(newUrls[index]);
    
    newPhotos.splice(index, 1);
    newUrls.splice(index, 1);
    
    setUploadedPhotos(newPhotos);
    setPhotoUrls(newUrls);
    
    setFormData(prev => ({
      ...prev,
      photos: newPhotos,
      photoUrls: newUrls
=======
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/heic": [".heic"],
      "image/heif": [".heif"],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    maxFiles: MAX_FILES,
    disabled: photos.length >= MAX_FILES || isProcessing,
  });

  const removePhoto = (id: string) => {
    setPhotos(photos.filter((photo) => photo.id !== id));

    // Update formData.photos
    const updatedPhotos = photos
      .filter((photo) => photo.id !== id)
      .filter((p) => p.file)
      .map((p) => p.file as File);

    setFormData((prev) => ({
      ...prev,
      photos: updatedPhotos,
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
    }));
  };

  return (
<<<<<<< HEAD
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Upload Vehicle Photos</h2>
        <p className="text-muted-foreground">
          Adding photos helps us provide a more accurate valuation based on your vehicle's condition.
=======
    <Card className="animate-in fade-in duration-500">
      <CardContent className="pt-6">
        <h2 className="text-2xl font-semibold mb-4">Upload Vehicle Photos</h2>
        <p className="text-muted-foreground mb-6">
          Photos help our AI provide a more accurate valuation. Upload at least
          {" "}
          {MIN_FILES} photo of your vehicle.
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
        </p>
      </div>

<<<<<<< HEAD
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-lg font-medium mb-1">Drag and drop photos here</p>
        <p className="text-sm text-muted-foreground mb-4">
          or click to browse files (JPEG, PNG, up to 10MB)
        </p>
        <Button variant="outline" type="button" disabled={isUploading}>
          {isUploading ? 'Uploading...' : 'Select Photos'}
        </Button>
      </div>

      {photoUrls.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-medium">Uploaded Photos ({photoUrls.length})</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {photoUrls.map((url, index) => (
              <Card key={index} className="overflow-hidden group relative">
                <CardContent className="p-0">
                  <div className="relative pt-[75%] bg-muted">
=======
        <div className="space-y-6">
          {/* Dropzone area */}
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-md p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? "border-primary bg-primary/5"
                : "border-gray-300 hover:border-primary/50"
            } ${
              photos.length >= MAX_FILES || isProcessing
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center justify-center gap-2">
              {isDragActive
                ? (
                  <>
                    <Upload className="h-10 w-10 text-primary" />
                    <p>Drop your photos here</p>
                  </>
                )
                : (
                  <>
                    <Camera className="h-10 w-10 text-muted-foreground" />
                    <p>Drag & drop photos here, or click to select files</p>
                    <p className="text-xs text-muted-foreground">
                      JPG, PNG • Up to 10MB • Max {MAX_FILES} photos
                    </p>
                  </>
                )}
            </div>
          </div>

          {/* Processing indicator */}
          {isProcessing && (
            <div className="p-4 bg-blue-50 text-blue-700 rounded-md flex items-center gap-3">
              <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
              <div>
                <p className="font-medium">Analyzing photos with AI...</p>
                <p className="text-sm">
                  We're processing your photos to assess vehicle condition
                </p>
              </div>
              <Progress value={uploadProgress} className="h-2 ml-auto w-1/4" />
            </div>
          )}

          {/* Photo thumbnails */}
          {photos.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
              {photos.map((photo) => (
                <div key={photo.id} className="relative group">
                  <div className="aspect-square bg-gray-100 rounded-md overflow-hidden border">
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
                    <img
                      src={url}
                      alt={`Vehicle photo ${index + 1}`}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
<<<<<<< HEAD
=======
                  </div>

                  {/* Remove button */}
                  {!isProcessing && (
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removePhoto(index);
                      }}
                      className="absolute top-2 right-2 bg-background/80 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
<<<<<<< HEAD
                    <div className="absolute bottom-0 left-0 right-0 bg-background/80 py-1 px-2 text-xs truncate">
                      Photo {index + 1}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
=======
                  )}

                  {/* Upload status */}
                  {photo.uploaded && (
                    <div className="absolute bottom-2 right-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Photo count and help text */}
          <div className="flex justify-between text-sm text-muted-foreground">
            <p>
              {photos.length} of {MAX_FILES} photos added
              {photos.length >= MIN_FILES
                ? <span className="text-green-600 ml-2">(Minimum met)</span>
                : (
                  <span className="text-amber-600 ml-2">
                    (Add at least {MIN_FILES - photos.length} more)
                  </span>
                )}
            </p>
          </div>

          {formData.photoAnalysisResult && (
            <div className="p-4 bg-green-50 text-green-700 rounded-md">
              <h3 className="font-semibold flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                AI Analysis Complete
              </h3>
              <p className="mt-1 text-sm">
                Condition:{" "}
                <span className="font-medium">
                  {formData.photoAnalysisResult.aiCondition?.condition ||
                    "Good"}
                </span>{" "}
                • Confidence:{" "}
                <span className="font-medium">
                  {formData.photoAnalysisResult.aiCondition?.confidenceScore ||
                    80}%
                </span>
              </p>
              {formData.photoAnalysisResult.aiCondition?.issuesDetected
                    ?.length > 0 && (
                <p className="mt-1 text-sm">
                  Issues detected:{" "}
                  {formData.photoAnalysisResult.aiCondition.issuesDetected.join(
                    ", ",
                  )}
                </p>
              )}
            </div>
          )}

          {/* Skip button */}
          {!formData.photoAnalysisResult && !isProcessing &&
            photos.length === 0 && (
            <div className="text-center pt-4">
              <Button variant="outline" type="button" onClick={() => {}}>
                Skip Photo Analysis
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                Photos are recommended for accurate valuations, but optional.
              </p>
            </div>
          )}
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
        </div>
      )}

      <div className="bg-muted/40 rounded-lg p-4 flex items-start space-x-3">
        <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
        <div className="text-sm">
          <p className="font-medium">Photo tips for the best valuation:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1 text-muted-foreground">
            <li>Include exterior photos from multiple angles</li>
            <li>Show the interior, including dashboard and seats</li>
            <li>Capture any damage or special features</li>
            <li>Good lighting helps us assess condition better</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
