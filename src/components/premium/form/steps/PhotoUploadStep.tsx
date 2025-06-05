
import React, { useEffect, useState } from "react";
import { FormData } from "@/types/premium-valuation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, X, Image } from "lucide-react";

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
  updateValidity,
}: PhotoUploadStepProps) {
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    // Photos are optional, so this step is always valid
    updateValidity(step, true);
  }, [step, updateValidity]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setUploading(true);
    try {
      const newPhotos: string[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        // Create a temporary URL for preview
        const url = URL.createObjectURL(file);
        newPhotos.push(url);
      }

      setFormData(prev => ({
        ...prev,
        photos: [...(prev.photos || []), ...newPhotos],
      }));
    } catch (error) {
      console.error("Error uploading photos:", error);
    } finally {
      setUploading(false);
    }
  };

  const removePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos?.filter((_, i) => i !== index) || [],
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Vehicle Photos
        </h2>
        <p className="text-gray-600 mb-6">
          Upload photos of your vehicle to help with the valuation. High-quality photos can improve accuracy.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload Photos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              id="photo-upload"
              disabled={uploading}
            />
            <label htmlFor="photo-upload" className="cursor-pointer">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-700 mb-2">
                Click to upload photos
              </p>
              <p className="text-sm text-gray-500">
                Upload multiple photos for better accuracy
              </p>
            </label>
          </div>

          {formData.photos && formData.photos.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {formData.photos.map((photo, index) => (
                <div key={index} className="relative">
                  <img
                    src={photo}
                    alt={`Vehicle photo ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 h-6 w-6 p-0"
                    onClick={() => removePhoto(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          <div className="text-sm text-gray-500">
            <p className="font-medium mb-1">Recommended photos:</p>
            <ul className="space-y-1">
              <li>• Front, rear, and side views</li>
              <li>• Interior dashboard and seats</li>
              <li>• Engine bay</li>
              <li>• Any damage or wear areas</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
