
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormData } from "@/types/premium-valuation";

interface PhotoUploadStepProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  updateValidity: (isValid: boolean) => void;
}

export function PhotoUploadStep({
  formData,
  setFormData,
  updateValidity,
}: PhotoUploadStepProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileUpload = (files: FileList) => {
    const fileArray = Array.from(files);
    setFormData((prev: FormData) => ({
      ...prev,
      photos: [...(prev.photos || []), ...fileArray],
    }));
    updateValidity(true);
  };

  const removePhoto = (index: number) => {
    setFormData((prev: FormData) => ({
      ...prev,
      photos: prev.photos?.filter((_: any, i: number) => i !== index) || [],
    }));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Vehicle Photos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center ${
            isDragging ? "border-primary bg-primary/10" : "border-gray-300"
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <p>Drag and drop photos here or click to upload</p>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
            className="hidden"
            id="photo-upload"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById("photo-upload")?.click()}
          >
            Select Photos
          </Button>
        </div>

        {formData.photos && formData.photos.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {formData.photos.map((photo: any, index: number) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(photo)}
                  alt={`Vehicle photo ${index + 1}`}
                  className="w-full h-24 object-cover rounded"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => removePhoto(index)}
                  className="absolute top-1 right-1"
                >
                  ×
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
