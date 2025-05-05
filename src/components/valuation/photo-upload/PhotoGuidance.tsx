
import { Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface PhotoGuidanceProps {
  photoCount: number;
}

export function PhotoGuidance({ photoCount }: PhotoGuidanceProps) {
  // Only show the alert if we have less than 3 photos
  if (photoCount >= 3) return null;
  
  return (
    <Alert>
      <Info className="h-4 w-4" />
      <AlertTitle>Enhanced valuation with photos</AlertTitle>
      <AlertDescription>
        Upload at least 3 photos (up to 5) of your vehicle for an AI-enhanced valuation that's more accurate.
      </AlertDescription>
    </Alert>
  );
}

export function PhotoTips() {
  return (
    <div className="text-xs text-gray-500">
      <p>Upload 3-5 clear photos of your vehicle to improve valuation accuracy.</p>
      <p>Include exterior from different angles, interior, and any damage for the best results.</p>
      <p>Our AI will analyze the condition and features to provide a more personalized estimate.</p>
    </div>
  );
}
