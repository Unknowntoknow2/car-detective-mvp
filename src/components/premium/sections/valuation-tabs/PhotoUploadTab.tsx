
import React from "react";
import { PhotoUploadProps } from "@/types/photo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

export function PhotoUploadTab({ onPhotoAnalysisComplete, onPhotoUpload, isLoading, vehicle }: PhotoUploadProps) {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && onPhotoUpload) {
      onPhotoUpload(Array.from(files));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vehicle Photos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <div className="mt-4">
            <label htmlFor="photo-upload" className="cursor-pointer">
              <span className="mt-2 block text-sm font-medium text-gray-900">
                Upload vehicle photos
              </span>
              <input
                id="photo-upload"
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            PNG, JPG, GIF up to 10MB each
          </p>
        </div>
        <Button 
          onClick={() => onPhotoAnalysisComplete && onPhotoAnalysisComplete(vehicle)} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? "Analyzing..." : "Analyze Photos"}
        </Button>
      </CardContent>
    </Card>
  );
}
