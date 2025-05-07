
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { Download, Camera } from 'lucide-react';
import { generateValuationPdf } from '@/utils/generateValuationPdf';
import { DecodedVehicleInfo } from '@/types/vehicle';
import { formatCurrency } from '@/utils/formatters';
import { AICondition } from '@/types/photo';
import PhotoView from './result/PhotoView';
import { ValuationResultProps } from '@/types/valuation-result';

export function ValuationResult({ 
  valuationId,
  make,
  model,
  year,
  mileage,
  condition,
  location,
  valuation,
  isManualValuation
}: ValuationResultProps) {
  const { toast } = useToast();
  const [isDownloading, setIsDownloading] = useState(false);
  
  // Fetch valuation data from the database
  const { data: valuationData, isLoading, error } = useQuery({
    queryKey: ['valuation', valuationId],
    queryFn: async () => {
      const response = await fetch(`/api/valuations/${valuationId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch valuation data');
      }
      return response.json();
    },
    // Skip the query if we're using manual valuation data
    enabled: !!valuationId && !isManualValuation
  });

  // Use either fetched data or manual props
  const vehicle = valuationData || {
    make,
    model,
    year,
    mileage,
    condition,
    zipCode: location,
    valuation
  };

  const downloadPdf = async () => {
    if (!vehicle) return;
    
    setIsDownloading(true);
    toast({
      title: "Generating PDF",
      description: "Please wait while we prepare your valuation report...",
    });
    
    try {
      // Extract vehicle info from valuation data
      const vehicleInfo: DecodedVehicleInfo = {
        vin: vehicle.vin || '',
        make: vehicle.make || '',
        model: vehicle.model || '',
        year: vehicle.year || 0,
        mileage: vehicle.mileage || 0,
        condition: vehicle.condition || 'Good',
        zipCode: vehicle.zip_code || vehicle.zipCode || '',
        bodyType: vehicle.body_type || '',
        color: vehicle.color || '',
        fuelType: vehicle.data?.fuel_type || '',
        transmission: vehicle.data?.transmission || '',
      };
      
      // Extract AI condition data if available
      const aiCondition: AICondition | null = vehicle.data?.ai_condition ? {
        condition: vehicle.data.ai_condition.condition || null,
        confidenceScore: vehicle.data.ai_condition.confidenceScore || 0,
        issuesDetected: vehicle.data.ai_condition.issuesDetected || [],
        aiSummary: vehicle.data.ai_condition.aiSummary || ''
      } : null;

      // Generate PDF with best photo and explanation
      const pdfBytes = await generateValuationPdf({
        vehicle: vehicleInfo,
        valuation: vehicle.estimated_value || vehicle.valuation || 0,
        explanation: vehicle.explanation || vehicle.data?.explanation || 'Valuation based on market data analysis',
        valuationId: valuationId,
        aiCondition: aiCondition,
        bestPhotoUrl: vehicle.data?.best_photo_url || undefined,
        photoExplanation: vehicle.data?.photo_explanation || undefined
      });
      
      // Create download link
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${vehicleInfo.year}-${vehicleInfo.make}-${vehicleInfo.model}-valuation.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "PDF Generated Successfully",
        description: "Your valuation report has been downloaded.",
      });
    } catch (err) {
      console.error('Error generating PDF:', err);
      toast({
        title: "PDF Generation Failed",
        description: "There was an error generating your report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading && !isManualValuation) {
    return (
      <Card className="p-6">
        <Skeleton className="h-12 w-3/4 mb-4" />
        <Skeleton className="h-8 w-1/2 mb-2" />
        <Skeleton className="h-8 w-1/3 mb-4" />
        <Skeleton className="h-24 w-full" />
      </Card>
    );
  }

  if ((error || !vehicle) && !isManualValuation) {
    return (
      <Card className="p-6 text-center">
        <h3 className="text-xl font-bold text-red-500 mb-2">Error Loading Valuation</h3>
        <p>Unable to load valuation data. Please try again later.</p>
      </Card>
    );
  }

  // Create a fallback for the fetched data or manual props
  const displayVehicle = valuationData || {
    year: year || 0,
    make: make || '',
    model: model || '',
    mileage: mileage || 0,
    condition: condition || 'Good',
    estimated_value: valuation || 0,
    confidence_score: 85,
    data: {}
  };

  return (
    <Card className="p-6">
      <div className="flex flex-col md:flex-row justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold">
            {displayVehicle.year} {displayVehicle.make} {displayVehicle.model}
          </h2>
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge variant="outline">{displayVehicle.condition} Condition</Badge>
            <Badge variant="outline">{(displayVehicle.mileage || 0).toLocaleString()} miles</Badge>
            {displayVehicle.data?.fuel_type && (
              <Badge variant="outline">{displayVehicle.data.fuel_type}</Badge>
            )}
            {displayVehicle.data?.transmission && (
              <Badge variant="outline">{displayVehicle.data.transmission}</Badge>
            )}
          </div>
        </div>
        <div className="mt-4 md:mt-0">
          <h3 className="text-xl font-bold text-green-600">
            {formatCurrency(displayVehicle.estimated_value || displayVehicle.valuation || 0)}
          </h3>
          <p className="text-sm text-muted-foreground">
            Confidence: {displayVehicle.confidence_score || 85}%
          </p>
        </div>
      </div>

      {displayVehicle.data?.best_photo_url && (
        <PhotoView 
          photoUrl={displayVehicle.data.best_photo_url} 
          explanation={displayVehicle.data.photo_explanation}
          condition={displayVehicle.data.ai_condition}
        />
      )}

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Why this price?</h3>
        <p className="text-gray-700">{displayVehicle.explanation || displayVehicle.data?.explanation || 'Based on current market data and vehicle condition.'}</p>
      </div>

      <div className="mt-6">
        <Button 
          onClick={downloadPdf} 
          disabled={isDownloading}
          className="w-full sm:w-auto"
        >
          {isDownloading ? 'Generating...' : 'Download Report'}
          {isDownloading ? null : <Download className="ml-2 h-4 w-4" />}
        </Button>
      </div>
    </Card>
  );
}

export default ValuationResult;
