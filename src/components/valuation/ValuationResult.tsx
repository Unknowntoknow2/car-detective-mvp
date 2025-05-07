
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

interface ValuationResultProps {
  valuationId: string;
}

export function ValuationResult({ valuationId }: ValuationResultProps) {
  const { toast } = useToast();
  const [isDownloading, setIsDownloading] = useState(false);
  
  // Fetch valuation data from the database
  const { data: valuation, isLoading, error } = useQuery({
    queryKey: ['valuation', valuationId],
    queryFn: async () => {
      const response = await fetch(`/api/valuations/${valuationId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch valuation data');
      }
      return response.json();
    }
  });

  const downloadPdf = async () => {
    if (!valuation) return;
    
    setIsDownloading(true);
    toast({
      title: "Generating PDF",
      description: "Please wait while we prepare your valuation report...",
    });
    
    try {
      // Extract vehicle info from valuation data
      const vehicleInfo: DecodedVehicleInfo = {
        vin: valuation.vin || '',
        make: valuation.make || '',
        model: valuation.model || '',
        year: valuation.year || 0,
        mileage: valuation.mileage || 0,
        condition: valuation.condition || 'Good',
        zipCode: valuation.zip_code || '',
        bodyType: valuation.body_type || '',
        color: valuation.color || '',
        fuelType: valuation.data?.fuel_type || '',
        transmission: valuation.data?.transmission || '',
      };
      
      // Extract AI condition data if available
      const aiCondition: AICondition | null = valuation.data?.ai_condition ? {
        condition: valuation.data.ai_condition.condition || null,
        confidenceScore: valuation.data.ai_condition.confidenceScore || 0,
        issuesDetected: valuation.data.ai_condition.issuesDetected || [],
        aiSummary: valuation.data.ai_condition.aiSummary || ''
      } : null;

      // Generate PDF with best photo and explanation
      const pdfBytes = await generateValuationPdf({
        vehicle: vehicleInfo,
        valuation: valuation.estimated_value,
        explanation: valuation.explanation || 'Valuation based on market data analysis',
        valuationId: valuationId,
        aiCondition: aiCondition,
        bestPhotoUrl: valuation.data?.best_photo_url || undefined,
        photoExplanation: valuation.data?.photo_explanation || undefined
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

  if (isLoading) {
    return (
      <Card className="p-6">
        <Skeleton className="h-12 w-3/4 mb-4" />
        <Skeleton className="h-8 w-1/2 mb-2" />
        <Skeleton className="h-8 w-1/3 mb-4" />
        <Skeleton className="h-24 w-full" />
      </Card>
    );
  }

  if (error || !valuation) {
    return (
      <Card className="p-6 text-center">
        <h3 className="text-xl font-bold text-red-500 mb-2">Error Loading Valuation</h3>
        <p>Unable to load valuation data. Please try again later.</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex flex-col md:flex-row justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold">
            {valuation.year} {valuation.make} {valuation.model}
          </h2>
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge variant="outline">{valuation.condition} Condition</Badge>
            <Badge variant="outline">{valuation.mileage.toLocaleString()} miles</Badge>
            {valuation.data?.fuel_type && (
              <Badge variant="outline">{valuation.data.fuel_type}</Badge>
            )}
            {valuation.data?.transmission && (
              <Badge variant="outline">{valuation.data.transmission}</Badge>
            )}
          </div>
        </div>
        <div className="mt-4 md:mt-0">
          <h3 className="text-xl font-bold text-green-600">
            {formatCurrency(valuation.estimated_value)}
          </h3>
          <p className="text-sm text-muted-foreground">
            Confidence: {valuation.confidence_score || 85}%
          </p>
        </div>
      </div>

      {valuation.data?.best_photo_url && (
        <PhotoView 
          photoUrl={valuation.data.best_photo_url} 
          explanation={valuation.data.photo_explanation}
          condition={valuation.data.ai_condition}
        />
      )}

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Why this price?</h3>
        <p className="text-gray-700">{valuation.explanation}</p>
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
