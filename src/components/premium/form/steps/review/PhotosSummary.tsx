
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FormData } from '@/types/premium-valuation';
import { Image } from 'lucide-react';

interface PhotosSummaryProps {
  formData: FormData;
}

export function PhotosSummary({ formData }: PhotosSummaryProps) {
  const photoCount = formData.photos?.length || 0;
  
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3">Photos</h3>
      <Card className="border-gray-200 shadow-sm">
        <CardContent className="p-6">
          {photoCount > 0 ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Photos Uploaded:</span>
                <span className="text-right font-medium text-gray-800">{photoCount}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {Array.from({ length: Math.min(photoCount, 3) }).map((_, index) => (
                  <div 
                    key={index} 
                    className="aspect-square bg-gray-100 rounded-md flex items-center justify-center"
                  >
                    <Image className="h-8 w-8 text-gray-400" />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center text-muted-foreground">
              No photos uploaded
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
