
import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PlateLookupInfo } from "@/types/lookup";
import { downloadPdf, convertVehicleInfoToReportData } from "@/utils/pdf";
import { toast } from "sonner";
import PlateDecoderForm from "@/components/lookup/PlateDecoderForm";
import { VinDecoderForm } from "@/components/lookup/VinDecoderForm";
import { ManualEntryForm } from "@/components/lookup/ManualEntryForm";
import { CarFront, Search, FileText } from "lucide-react";

export default function PlateLookupPage() {
  const [lookupResult, setLookupResult] = useState<PlateLookupInfo | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("plate");

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
                  <PlateDecoderForm 
                    onLookupComplete={handleLookupComplete} 
                    onDownloadPdf={handleDownloadPdf}
                    isDownloading={isDownloading}
                  />
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
                  <ManualEntryForm />
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
