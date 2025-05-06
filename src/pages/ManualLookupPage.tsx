
import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { downloadPdf, convertVehicleInfoToReportData } from '@/utils/pdf';
import { toast } from 'sonner';
import type { DecodedVehicleInfo } from '@/types/vehicle';
import { VehicleInfoCard } from '@/components/lookup/VehicleInfoCard';
import type { ManualEntryFormData } from '@/components/lookup/types/manualEntry';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { VinDecoderForm } from "@/components/lookup/VinDecoderForm";
import PlateDecoderForm from "@/components/lookup/PlateDecoderForm";
import ManualEntryForm from "@/components/lookup/ManualEntryForm";
import { CarFront, Search, FileText } from "lucide-react";

export default function ManualLookupPage() {
  const [manualEntryResult, setManualEntryResult] = useState<DecodedVehicleInfo | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("manual");

  const handleManualSubmit = async (data: ManualEntryFormData) => {
    // Convert ManualEntryFormData to DecodedVehicleInfo format
    const vehicleInfo: DecodedVehicleInfo = {
      vin: 'MANUAL-ENTRY', // Placeholder for manual entries
      make: data.make,
      model: data.model,
      year: parseInt(data.year), // Convert string to number
      mileage: parseInt(data.mileage), // Convert string to number
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
          <h1 className="text-3xl font-bold text-center mb-8">Vehicle Lookup</h1>
          <p className="text-center text-muted-foreground mb-8">
            Look up vehicle information using VIN, license plate, or manual entry
          </p>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 h-auto p-1 rounded-lg">
              <TabsTrigger 
                value="vin" 
                className="py-4 px-2 rounded-md data-[state=active]:bg-primary data-[state=active]:text-white z-10"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <CarFront className="w-5 h-5" />
                  <span>VIN Lookup</span>
                </div>
              </TabsTrigger>
              
              <TabsTrigger 
                value="plate" 
                className="py-4 px-2 rounded-md data-[state=active]:bg-primary data-[state=active]:text-white z-10"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <Search className="w-5 h-5" />
                  <span>Plate Lookup</span>
                </div>
              </TabsTrigger>
              
              <TabsTrigger 
                value="manual" 
                className="py-4 px-2 rounded-md data-[state=active]:bg-primary data-[state=active]:text-white z-10"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <FileText className="w-5 h-5" />
                  <span>Manual Entry</span>
                </div>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="vin" className="mt-6 z-0">
              <Card className="border-2 border-primary/20">
                <CardHeader>
                  <CardTitle>VIN Lookup</CardTitle>
                  <CardDescription>Enter your Vehicle Identification Number for a detailed analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <VinDecoderForm />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="plate" className="mt-6 z-0">
              <Card className="border-2 border-primary/20">
                <CardHeader>
                  <CardTitle>License Plate Lookup</CardTitle>
                  <CardDescription>Look up your vehicle using license plate information</CardDescription>
                </CardHeader>
                <CardContent>
                  <PlateDecoderForm />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="manual" className="mt-6 z-0">
              <Card className="border-2 border-primary/20">
                <CardHeader>
                  <CardTitle>Manual Entry</CardTitle>
                  <CardDescription>Enter vehicle details manually for a custom valuation</CardDescription>
                </CardHeader>
                <CardContent>
                  <ManualEntryForm onSubmit={handleManualSubmit} />
                  
                  {manualEntryResult && (
                    <div className="mt-8">
                      <VehicleInfoCard 
                        vehicleInfo={manualEntryResult}
                        onDownloadPdf={handleDownloadPdf}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}
