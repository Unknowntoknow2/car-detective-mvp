
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { downloadPdf, convertVehicleInfoToReportData } from '@/utils/pdf';
import { toast } from 'sonner';
import { Valuation } from '@/types/dealer';
import { AlertCircle, CheckCircle, Shield, AlertTriangle } from 'lucide-react';
import { getCarfaxReport } from '@/utils/carfax/mockCarfaxService';

export const DealerValuationsList = () => {
  const [loadingCarfax, setLoadingCarfax] = useState<Record<string, boolean>>({});

  const { data: valuations, isLoading } = useQuery({
    queryKey: ['dealer-valuations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('valuations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Valuation[];
    }
  });

  const handleDownloadReport = async (valuation: Valuation, includePremium = false) => {
    try {
      setLoadingCarfax({...loadingCarfax, [valuation.id]: true});
      
      // Get CARFAX data if this is a premium report and we have a VIN
      let carfaxData = undefined;
      if (includePremium && valuation.vin) {
        carfaxData = await getCarfaxReport(valuation.vin);
      }
      
      const reportData = convertVehicleInfoToReportData(
        {
          make: valuation.make,
          model: valuation.model,
          year: valuation.year
        },
        {
          estimatedValue: valuation.estimated_value,
          confidenceScore: valuation.confidence_score,
          mileage: valuation.mileage,
          condition: valuation.condition,
          fuelType: valuation.fuel_type,
          zipCode: valuation.zip_code,
          carfaxData,
          isPremium: includePremium,
          adjustments: [] // Add the required adjustments property
        }
      );
      
      await downloadPdf(reportData);
      toast.success(`${includePremium ? 'Premium' : 'Standard'} PDF report downloaded`);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast.error('Failed to download PDF report');
    } finally {
      setLoadingCarfax({...loadingCarfax, [valuation.id]: false});
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading valuations...</div>;
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Recent Valuations</h2>
      <div className="space-y-4">
        {valuations?.map((valuation) => (
          <div key={valuation.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">
                  {valuation.year} {valuation.make} {valuation.model}
                  {valuation.vin && (
                    <span className="ml-2">
                      <Badge variant="outline" className="ml-2">
                        VIN Available
                      </Badge>
                    </span>
                  )}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Estimated Value: ${valuation.estimated_value?.toLocaleString()}
                </p>
                {valuation.mileage && (
                  <p className="text-sm text-muted-foreground">
                    Mileage: {valuation.mileage.toLocaleString()}
                  </p>
                )}
                {valuation.confidence_score && (
                  <div className="flex items-center mt-1">
                    <p className="text-sm text-muted-foreground mr-1">
                      Confidence:
                    </p>
                    <ConfidenceBadge score={valuation.confidence_score} />
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleDownloadReport(valuation)}
                  size="sm"
                >
                  Standard Report
                </Button>
                {valuation.vin && (
                  <Button
                    variant="default"
                    onClick={() => handleDownloadReport(valuation, true)}
                    disabled={loadingCarfax[valuation.id]}
                    size="sm"
                  >
                    {loadingCarfax[valuation.id] ? 'Loading CARFAX...' : 'Premium Report'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
        {valuations?.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            No valuations found
          </p>
        )}
      </div>
    </Card>
  );
};

// Helper component for displaying confidence badges
const ConfidenceBadge = ({ score }: { score: number }) => {
  if (score >= 80) {
    return (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
        <CheckCircle className="h-3 w-3 mr-1" />
        High ({score}%)
      </Badge>
    );
  } else if (score >= 60) {
    return (
      <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
        <Shield className="h-3 w-3 mr-1" />
        Good ({score}%)
      </Badge>
    );
  } else if (score >= 40) {
    return (
      <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
        <AlertCircle className="h-3 w-3 mr-1" />
        Moderate ({score}%)
      </Badge>
    );
  } else {
    return (
      <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
        <AlertTriangle className="h-3 w-3 mr-1" />
        Low ({score}%)
      </Badge>
    );
  }
};
