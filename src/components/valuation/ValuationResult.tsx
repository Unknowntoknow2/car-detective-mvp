
import React, { useState, useEffect } from 'react';
import { generateValuationExplanation } from '@/utils/generateValuationExplanation';
import { Button } from '@/components/ui/button';
import { Loader2, Download } from 'lucide-react';
import { downloadPdf, convertVehicleInfoToReportData } from '@/utils/pdf';
import { toast } from 'sonner';

interface ValuationResultProps {
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: string;
  location: string;
  valuation: number;
}

const ValuationResult: React.FC<ValuationResultProps> = ({
  make,
  model,
  year,
  mileage,
  condition,
  location,
  valuation,
}) => {
  const [explanation, setExplanation] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isDownloading, setIsDownloading] = useState<boolean>(false);

  useEffect(() => {
    async function fetchExplanation() {
      setLoading(true);
      setError('');
      try {
        const result = await generateValuationExplanation({
          make,
          model,
          year,
          mileage,
          condition,
          location,
          valuation,
        });
        setExplanation(result);
      } catch (e: any) {
        console.error(e);
        setError('Failed to load explanation.');
      } finally {
        setLoading(false);
      }
    }
    fetchExplanation();
  }, [make, model, year, mileage, condition, location, valuation]);

  const handleDownloadPdf = async () => {
    setIsDownloading(true);
    try {
      // Prepare the vehicle information and valuation data
      const vehicleInfo = {
        vin: 'MANUAL-ENTRY', // Placeholder for manual entries
        make,
        model,
        year,
        mileage,
        transmission: 'Unknown', // Default value
        condition,
        zipCode: location
      };

      // Prepare valuation data for PDF generation
      const valuationData = {
        estimatedValue: valuation,
        mileage: mileage.toString(),
        condition,
        zipCode: location,
        confidenceScore: 80, // Default value
        adjustments: [],
        fuelType: 'Not Specified'
      };

      // Convert to report data format
      const reportData = convertVehicleInfoToReportData(vehicleInfo, valuationData);
      
      // Generate and download the PDF
      await downloadPdf(reportData);
      toast.success("PDF report downloaded successfully");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF report");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-2">Valuation Result</h2>
      <p className="mb-4">
        A {year} {make} {model} with {mileage.toLocaleString()} miles in{' '}
        <span className="capitalize">{condition}</span> condition in {location} is
        valued at <span className="font-bold">${valuation.toLocaleString()}</span>.
      </p>
      {loading ? (
        <p>Loading explanation...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div>
          <h3 className="text-xl font-medium mb-2">Why this price?</h3>
          <p className="mb-6">{explanation}</p>
          
          <Button 
            onClick={handleDownloadPdf}
            disabled={isDownloading}
            className="w-full"
          >
            {isDownloading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating PDF...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Download Report
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ValuationResult;
