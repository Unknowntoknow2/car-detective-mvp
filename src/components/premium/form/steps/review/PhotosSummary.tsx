
import React from "react";
import { FormData } from "@/types/premium-valuation";

interface PhotosSummaryProps {
  formData: FormData;
}

export function PhotosSummary({ formData }: PhotosSummaryProps) {
  const photos = formData.photos || [];
  
  if (photos.length === 0) {
    return (
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 className="text-md font-medium mb-2">Vehicle Photos</h3>
        <p className="text-sm text-gray-500">No photos uploaded</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
      <h3 className="text-md font-medium mb-2">Vehicle Photos</h3>
      <p className="text-sm text-gray-600 mb-3">
        {photos.length} photo{photos.length !== 1 ? 's' : ''} uploaded
      </p>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
        {photos.slice(0, 6).map((photo: any, index: number) => (
          <div key={index} className="aspect-square bg-gray-200 rounded border">
            <img
              src={photo instanceof File ? URL.createObjectURL(photo) : photo}
              alt={`Vehicle photo ${index + 1}`}
              className="w-full h-full object-cover rounded"
            />
          </div>
        ))}
        {photos.length > 6 && (
          <div className="aspect-square bg-gray-300 rounded border flex items-center justify-center">
            <span className="text-xs text-gray-600">+{photos.length - 6}</span>
          </div>
        )}
      </div>
    </div>
  );
}
