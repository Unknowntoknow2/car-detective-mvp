
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, UploadCloud } from 'lucide-react';

interface PhotoLookupTabProps {
  isLoading: boolean;
  vehicle: any;
  onPhotoUpload: (file: File) => void;
}

export function PhotoLookupTab({
  isLoading,
  vehicle,
  onPhotoUpload
}: PhotoLookupTabProps) {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };
  
  const handleUpload = () => {
    if (selectedFile) {
      onPhotoUpload(selectedFile);
    }
  };
  
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <UploadCloud className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Upload Vehicle Photo</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Take a clear photo of your vehicle's front, side, or rear view
            </p>
            
            <div className="flex flex-col items-center">
              <Label 
                htmlFor="photo-upload" 
                className="cursor-pointer bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90"
              >
                Select Photo
              </Label>
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              
              {selectedFile && (
                <div className="mt-4 text-sm">
                  <p>Selected: {selectedFile.name}</p>
                  <Button 
                    onClick={handleUpload} 
                    disabled={isLoading}
                    className="mt-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Upload & Identify'
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          <div className="text-sm text-center text-muted-foreground">
            <p>
              Note: Photo recognition is a premium feature that uses AI to identify your vehicle.
            </p>
          </div>
          
          {vehicle && (
            <div className="mt-4 p-4 bg-primary/5 rounded-md">
              <p className="font-medium">Identified: {vehicle.year} {vehicle.make} {vehicle.model}</p>
              {vehicle.trim && <p className="text-sm text-muted-foreground">Trim: {vehicle.trim}</p>}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
