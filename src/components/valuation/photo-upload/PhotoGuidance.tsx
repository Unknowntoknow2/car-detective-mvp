
import { AlertCircle, Camera } from 'lucide-react';
import { MIN_FILES, MAX_FILES } from '@/types/photo';

interface PhotoGuidanceProps {
  photoCount: number;
}

export function PhotoGuidance({ photoCount }: PhotoGuidanceProps) {
  return (
    <div className="text-sm text-slate-700">
      <p className="mb-1 font-medium flex items-center gap-1.5">
        <Camera className="h-4 w-4" />
        Vehicle Photos ({photoCount}/{MAX_FILES})
      </p>
      <p className="text-xs text-slate-600">
        Upload {MIN_FILES}-{MAX_FILES} clear photos of your vehicle for our AI to analyze condition.
      </p>
    </div>
  );
}

export function PhotoTips() {
  return (
    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mt-4">
      <h3 className="text-sm font-medium text-blue-800 mb-2 flex items-center gap-1.5">
        <AlertCircle className="h-4 w-4" />
        Photo Tips for Best Results
      </h3>
      <ul className="text-xs text-blue-700 space-y-1 pl-5 list-disc">
        <li>Take photos in good natural lighting (avoid dark garages)</li>
        <li>Include clear shots of the exterior from multiple angles</li>
        <li>Add interior photos showing seats and dashboard</li>
        <li>If possible, capture any damage or issues that affect value</li>
        <li>Include a photo of the VIN plate if available</li>
      </ul>
    </div>
  );
}
