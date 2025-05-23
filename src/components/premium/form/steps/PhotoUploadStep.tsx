
import React, { useState, useEffect } from 'react';
import { FormData } from '@/types/premium-valuation';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

interface PhotoUploadStepProps {
  step: number;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  updateValidity: (step: number, isValid: boolean) => void;
}

export function PhotoUploadStep({
  step,
  formData,
  setFormData,
  updateValidity
}: PhotoUploadStepProps) {
  const [photos, setPhotos] = useState<File[]>(formData.photos || []);
  const [previewUrls, setPreviewUrls] = useState<string[]>(formData.photoUrls || []);
  
  // Set initial validity
  useEffect(() => {
    // This step is optional, so always valid
    updateValidity(step, true);
  }, [step, updateValidity]);
  
  // Update form data when photos change
  useEffect(() => {
    if (photos.length > 0) {
      setFormData(prev => ({
        ...prev,
        photos: photos,
        photoUrls: previewUrls
      }));
    }
  }, [photos, previewUrls, setFormData]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      setPhotos(prev => [...prev, ...selectedFiles]);
      
      // Create preview URLs
      const newPreviewUrls = selectedFiles.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
    }
  };
  
  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
    
    // Revoke object URL to avoid memory leaks
    URL.revokeObjectURL(previewUrls[index]);
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    
    setFormData(prev => ({
      ...prev,
      photos: photos.filter((_, i) => i !== index),
      photoUrls: previewUrls.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Vehicle Photos</h2>
        <p className="text-gray-600 mb-6">
          Adding photos of your vehicle can increase the accuracy of your valuation.
          Photos are analyzed by our AI to detect condition factors.
        </p>
      </div>
      
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id="photo-upload"
        />
        <label
          htmlFor="photo-upload"
          className="flex flex-col items-center justify-center cursor-pointer"
        >
          <Upload className="h-12 w-12 text-gray-400 mb-3" />
          <span className="text-sm font-medium text-gray-900">Click to upload</span>
          <span className="text-xs text-gray-500 mt-1">
            JPG, PNG, WEBP (max 10MB)
          </span>
        </label>
      </div>
      
      {previewUrls.length > 0 && (
        <div className="mt-4 space-y-3">
          <h3 className="text-lg font-medium">Uploaded Photos</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {previewUrls.map((url, index) => (
              <div key={index} className="relative">
                <img
                  src={url}
                  alt={`Vehicle photo ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removePhoto(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-sm text-blue-700">
          <strong>Pro Tip:</strong> Include clear photos of the exterior (all sides), interior,
          dashboard, and any damage or special features for the most accurate assessment.
        </p>
      </div>
    </div>
  );
}

export default PhotoUploadStep;
