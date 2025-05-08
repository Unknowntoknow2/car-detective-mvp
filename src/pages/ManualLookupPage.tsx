
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
      mileage: parseInt(data.mileage), // Added to match updated interface
      fuelType: data.fuelType || 'Gasoline',
      condition: data.condition, // Added to match updated interface
      zipCode: data.zipCode || '10001', // Added to match updated interface
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
        estimatedValue: 22500,
        condition: manualEntryResult.condition || 'Good',
        zipCode: manualEntryResult.zipCode || '10001',
        confidenceScore: 75,
        adjustments: [
          { 
            factor: "Mileage", 
            impact: -1200, 
            description: "Based on average mileage for this vehicle type and year", 
            name: "Mileage",
            value: -1200,
            percentAdjustment: -5
          },
          { 
            factor: "Condition", 
            impact: 800, 
            description: "Based on reported vehicle condition", 
            name: "Condition",
            value: 800,
            percentAdjustment: 3.5
          },
          { 
            factor: "Market Demand", 
            impact: 1500, 
            description: "Current market trends for this make/model", 
            name: "Market Demand",
            value: 1500,
            percentAdjustment: 6.5
          }
        ],
        aiCondition: {
          condition: 'Good',
          confidenceScore: 85
        },
        isPremium: false
      };
      
      const reportData = convertVehicleInfoToReportData(manualEntryResult, defaultValuationData);
      
      // Call the download function
      const pdfBlob = await downloadPdf(reportData);
      if (!pdfBlob) {
        throw new Error("Failed to generate PDF");
      }
      
      // Create a download link and trigger it
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${manualEntryResult.year}_${manualEntryResult.make}_${manualEntryResult.model}_Report.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("PDF report downloaded successfully");
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error("Failed to generate PDF report");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">Vehicle Information Lookup</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Enter Vehicle Information</CardTitle>
            <CardDescription>
              Choose a method to retrieve vehicle information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="vin">
                  <Search className="mr-2 h-4 w-4" />
                  VIN
                </TabsTrigger>
                <TabsTrigger value="plate">
                  <CarFront className="mr-2 h-4 w-4" />
                  License Plate
                </TabsTrigger>
                <TabsTrigger value="manual">
                  <FileText className="mr-2 h-4 w-4" />
                  Manual Entry
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="vin">
                <VinDecoderForm />
              </TabsContent>
              
              <TabsContent value="plate">
                <PlateDecoderForm />
              </TabsContent>
              
              <TabsContent value="manual">
                <ManualEntryForm onSubmit={handleManualSubmit} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        {manualEntryResult && (
          <div className="mt-8">
            <VehicleInfoCard 
              vehicleInfo={manualEntryResult} 
              onDownloadPdf={handleDownloadPdf}
            />
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
