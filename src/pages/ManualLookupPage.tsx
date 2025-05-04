
import { useState } from 'react';
import { ManualEntryForm } from '@/components/lookup/ManualEntryForm';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { downloadPdf, convertVehicleInfoToReportData } from '@/utils/pdf';
import { toast } from 'sonner';
import type { DecodedVehicleInfo } from '@/types/vehicle';
import { VehicleInfoCard } from '@/components/lookup/VehicleInfoCard';
import type { ManualEntryFormData } from '@/components/lookup/types/manualEntry';

export default function ManualLookupPage() {
  const [manualEntryResult, setManualEntryResult] = useState<DecodedVehicleInfo | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleManualSubmit = async (data: ManualEntryFormData) => {
    // Convert ManualEntryFormData to DecodedVehicleInfo format
    const vehicleInfo: DecodedVehicleInfo = {
      vin: 'MANUAL-ENTRY', // Placeholder for manual entries
      make: data.make,
      model: data.model,
      year: data.year,
      mileage: data.mileage,
      fuelType: data.fuelType || 'Gasoline',
      condition: data.condition,
      transmission: 'Unknown', // Required field in DecodedVehicleInfo
    };
    
    // Process the manual entry form submission
    setManualEntryResult(vehicleInfo);
    toast.success(`Details received for ${vehicleInfo.year} ${vehicleInfo.make} ${vehicleInfo.model}`);
  };

  const handleDownloadPdf = async () => {
    if (!manualEntryResult) {
      toast.error("No vehicle data available to generate a report");
      return;
    }

    setIsDownloading(true);
    try {
      // For manual entries, we'll use some default values for non-provided fields
      const defaultValuationData = {
        mileage: manualEntryResult.mileage || 50000,
        estimatedValue: 23500, // Default value
        fuelType: manualEntryResult.fuelType || "Gasoline",
        condition: manualEntryResult.condition || "Good",
        zipCode: manualEntryResult.zipCode || "10001",
        confidenceScore: 80,
        adjustments: []
      };

      const reportData = convertVehicleInfoToReportData(
        manualEntryResult, 
        defaultValuationData
      );
      
      await downloadPdf(reportData);
      toast.success("PDF report generated successfully");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate PDF report");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container py-10">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-3xl font-bold text-center mb-8">Manual Vehicle Entry</h1>
          <p className="text-center text-muted-foreground mb-8">
            Enter your vehicle details manually to get a valuation
          </p>
          
          <ManualEntryForm onSubmit={handleManualSubmit} />
          
          {manualEntryResult && (
            <div className="mt-8">
              <VehicleInfoCard 
                vehicleInfo={manualEntryResult}
                onDownloadPdf={handleDownloadPdf}
              />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
