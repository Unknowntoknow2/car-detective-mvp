
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ImagePlus, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PhotoUploadProps {
  onSubmit: (files: File[]) => void;
  isLoading?: boolean;
}

export const PhotoUpload: React.FC<PhotoUploadProps> = ({
  onSubmit,
  isLoading = false
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    const files = Array.from(e.target.files);
    setSelectedFiles(files);

    // Create previews
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(newPreviews);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFiles.length > 0) {
      onSubmit(selectedFiles);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Photo Upload</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="photo-upload">Upload Vehicle Photos</Label>
            <div className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 transition-colors">
              <Label htmlFor="photo-upload" className="cursor-pointer">
                <ImagePlus className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-400">PNG, JPG or WEBP</p>
              </Label>
              <Input
                id="photo-upload"
                type="file"
                accept="image/png, image/jpeg, image/webp"
                multiple
                className="hidden"
                onChange={handleFileChange}
                disabled={isLoading}
              />
            </div>
          </div>

          {previews.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4">
              {previews.map((preview, index) => (
                <div key={index} className="aspect-square rounded overflow-hidden">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          <Button type="submit" disabled={isLoading || selectedFiles.length === 0} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              'Upload and Identify'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PhotoUpload;
