
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { downloadPdf, convertVehicleInfoToReportData } from '@/utils/pdfGenerator';
import { toast } from 'sonner';

export const DealerValuationsList = () => {
  const { data: valuations, isLoading } = useQuery({
    queryKey: ['dealer-valuations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('valuations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  const handleDownloadReport = async (valuation: any) => {
    try {
      const reportData = convertVehicleInfoToReportData(
        {
          make: valuation.make,
          model: valuation.model,
          year: valuation.year
        },
        {
          estimatedValue: valuation.estimated_value,
          confidenceScore: valuation.confidence_score,
          mileage: valuation.mileage || 0,
          condition: valuation.condition || 'unknown',
          fuelType: valuation.fuel_type || 'unknown',
          zipCode: valuation.zip_code
        }
      );
      
      await downloadPdf(reportData);
      toast.success('PDF report downloaded');
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast.error('Failed to download PDF report');
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
                </h3>
                <p className="text-sm text-muted-foreground">
                  Estimated Value: ${valuation.estimated_value?.toLocaleString()}
                </p>
                {valuation.mileage && (
                  <p className="text-sm text-muted-foreground">
                    Mileage: {valuation.mileage.toLocaleString()}
                  </p>
                )}
              </div>
              <Button
                variant="outline"
                onClick={() => handleDownloadReport(valuation)}
              >
                Download Report
              </Button>
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
