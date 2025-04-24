
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ManualEntryForm } from '@/components/lookup/ManualEntryForm';
import { VinDecoderForm } from '@/components/lookup/VinDecoderForm';
import { PlateDecoderForm } from '@/components/lookup/PlateDecoderForm';
import { useNavigate } from 'react-router-dom';
import { SectionHeader, DesignCard } from '@/components/ui/design-system';
import { CarFront, FileText, Search } from 'lucide-react';

export default function PremiumPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <main className="bg-surface min-h-screen px-4 py-12 animate-fade-in">
      <div className="max-w-4xl mx-auto space-y-8">
        <SectionHeader
          title="Premium Vehicle Valuation"
          description="Get comprehensive vehicle information including CARFAX® report, future price forecasts, dealer offers, and premium market insights."
          className="text-center"
        />

        <DesignCard variant="info" className="border-warning/20">
          <p className="text-small text-warning-700">
            Our premium valuation includes verified CARFAX® accident and vehicle history data 
            for the most accurate valuation available.
          </p>
        </DesignCard>

        <Tabs defaultValue="vin" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="vin" className="space-x-2">
              <CarFront className="w-4 h-4" />
              <span>VIN Lookup</span>
            </TabsTrigger>
            <TabsTrigger value="plate" className="space-x-2">
              <Search className="w-4 h-4" />
              <span>Plate Lookup</span>
            </TabsTrigger>
            <TabsTrigger value="manual" className="space-x-2">
              <FileText className="w-4 h-4" />
              <span>Manual Entry</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="vin">
            <Card>
              <CardHeader>
                <SectionHeader
                  title="VIN Lookup"
                  description="Enter your Vehicle Identification Number for detailed information"
                />
              </CardHeader>
              <CardContent>
                <VinDecoderForm />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="plate">
            <Card>
              <CardHeader>
                <SectionHeader
                  title="License Plate Lookup"
                  description="Look up vehicle details using a license plate number"
                />
              </CardHeader>
              <CardContent>
                <PlateDecoderForm />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="manual">
            <Card>
              <CardHeader>
                <SectionHeader
                  title="Manual Entry"
                  description="Enter vehicle details manually for a custom valuation"
                />
              </CardHeader>
              <CardContent>
                <ManualEntryForm 
                  onSubmit={async (data) => {
                    try {
                      setIsSubmitting(true);
                      const response = await fetch("/functions/car-price-prediction", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          ...data,
                          includeCarfax: true
                        })
                      });
                      
                      if (!response.ok) throw new Error('Failed to get valuation');
                      
                      const result = await response.json();
                      if (result?.id) {
                        navigate(`/valuation/${result.id}`);
                      }
                    } catch (error) {
                      console.error('Premium valuation error:', error);
                    } finally {
                      setIsSubmitting(false);
                    }
                  }}
                  submitButtonText="Get Premium Valuation with CARFAX"
                  isPremium={true}
                  isLoading={isSubmitting}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
