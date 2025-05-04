
import { useState } from "react";
import PlateDecoderForm from "@/components/lookup/PlateDecoderForm";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PlateLookupInfo } from "@/types/lookup";
import { downloadPdf, convertVehicleInfoToReportData } from "@/utils/pdf";
import { toast } from "sonner";

export default function PlateLookupPage() {
  const [lookupResult, setLookupResult] = useState<PlateLookupInfo | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleLookupComplete = (result: PlateLookupInfo | null) => {
    setLookupResult(result);
  };

  const handleDownloadPdf = async () => {
    if (!lookupResult) {
      toast.error("No vehicle data available to generate a report");
      return;
    }

    setIsDownloading(true);
    try {
      const reportData = convertVehicleInfoToReportData(lookupResult, lookupResult.estimatedValue || 24500);
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
          <h1 className="text-3xl font-bold text-center mb-8">License Plate Lookup</h1>
          <p className="text-center text-muted-foreground mb-8">
            Look up any US license plate to get information about the vehicle.
          </p>
          <PlateDecoderForm 
            onLookupComplete={handleLookupComplete} 
            onDownloadPdf={handleDownloadPdf}
            isDownloading={isDownloading}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
