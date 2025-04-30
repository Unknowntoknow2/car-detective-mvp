
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Share, BookmarkPlus } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';

interface ValuationHeaderProps {
  valuationData: {
    make: string;
    model: string;
    year: number;
    trim?: string;
    mileage?: number;
    estimatedValue?: number;
  };
  photoSubmitted: boolean;
  photoScore: number | null;
  estimatedValue: number | undefined;
  calculationInProgress: boolean;
  onShareValuation: () => void;
  onSaveToAccount: () => void;
  isSaving: boolean;
}

export function ValuationHeader({
  valuationData,
  photoSubmitted,
  photoScore,
  estimatedValue,
  calculationInProgress,
  onShareValuation,
  onSaveToAccount,
  isSaving
}: ValuationHeaderProps) {
  return (
    <Card>
      <CardHeader className="bg-primary/5">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Valuation Complete</h2>
          <Badge variant="outline" className="px-3">
            {valuationData.year} {valuationData.make} {valuationData.model} {valuationData.trim || ''}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-6 pb-4">
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Estimated Value</p>
              <p className="text-2xl font-semibold">
                {estimatedValue 
                  ? formatCurrency(estimatedValue)
                  : calculationInProgress ? 'Calculating...' : 'Not available'}
              </p>
              {photoSubmitted && photoScore && (
                <p className="text-xs text-green-600">Includes photo analysis ({Math.round(photoScore * 100)}% condition score)</p>
              )}
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-gray-500">Mileage</p>
              <p className="text-lg">
                {valuationData.mileage 
                  ? `${new Intl.NumberFormat('en-US').format(valuationData.mileage)} miles`
                  : 'Not specified'}
              </p>
            </div>
          </div>

          {!photoSubmitted && (
            <Alert>
              <AlertTitle>Improve your valuation accuracy</AlertTitle>
              <AlertDescription>
                Upload a photo of your vehicle below to get a more accurate valuation based on visual condition.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2 border-t bg-gray-50 p-4">
        <Button variant="outline" onClick={onShareValuation}>
          <Share className="mr-2 h-4 w-4" /> Share
        </Button>
        <Button variant="outline" onClick={onSaveToAccount} disabled={isSaving}>
          <BookmarkPlus className="mr-2 h-4 w-4" /> {isSaving ? 'Saving...' : 'Save'}
        </Button>
      </CardFooter>
    </Card>
  );
}
