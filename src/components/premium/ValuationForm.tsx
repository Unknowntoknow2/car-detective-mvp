
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SectionHeader } from "@/components/ui/design-system";
import { Button } from "@/components/ui/button";
import { CarFront, Search, FileText, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefObject } from 'react';

// Import custom form components with proper types
import { VinDecoderForm } from '@/components/lookup/VinDecoderForm';
import { PlateDecoderForm } from '@/components/lookup/PlateDecoderForm';
import { ManualEntryForm } from '@/components/lookup/ManualEntryForm';
import { ManualEntryFormData } from '@/components/lookup/types/manualEntry';

interface ValuationFormProps {
  formRef: RefObject<HTMLDivElement>;
}

export function ValuationForm({ formRef }: ValuationFormProps) {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: any) => {
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
  };

  return (
    <section ref={formRef} className="py-20 px-4 bg-gradient-to-b from-surface to-background">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          title="Start Your Premium Valuation"
          description="Choose your preferred lookup method below"
          className="mb-12"
        />
        
        <Tabs defaultValue="manual" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 h-auto p-1 rounded-lg">
            <TabsTrigger value="vin" className="py-4 px-2 rounded-md data-[state=active]:bg-primary data-[state=active]:text-white">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <CarFront className="w-5 h-5" />
                <span>VIN Lookup</span>
              </div>
            </TabsTrigger>
            
            <TabsTrigger value="plate" className="py-4 px-2 rounded-md data-[state=active]:bg-primary data-[state=active]:text-white">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <Search className="w-5 h-5" />
                <span>Plate Lookup</span>
              </div>
            </TabsTrigger>
            
            <TabsTrigger value="manual" className="py-4 px-2 rounded-md data-[state=active]:bg-primary data-[state=active]:text-white">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <FileText className="w-5 h-5" />
                <span>Manual Entry</span>
              </div>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="vin">
            <Card className="border-2 border-primary/20 shadow-xl rounded-xl overflow-hidden">
              <CardHeader className="bg-primary/5 border-b border-border">
                <SectionHeader
                  title="VIN Lookup"
                  description="Enter your Vehicle Identification Number for detailed information"
                  size="md"
                />
              </CardHeader>
              <CardContent className="pt-8">
                <VinDecoderForm />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="plate">
            <Card className="border-2 border-primary/20 shadow-xl rounded-xl overflow-hidden">
              <CardHeader className="bg-primary/5 border-b border-border">
                <SectionHeader
                  title="License Plate Lookup"
                  description="Look up vehicle details using a license plate number"
                  size="md"
                />
              </CardHeader>
              <CardContent className="pt-8">
                <PlateDecoderForm />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="manual">
            <Card className="border-2 border-primary/20 shadow-xl rounded-xl overflow-hidden">
              <CardHeader className="bg-primary/5 border-b border-border">
                <SectionHeader
                  title="Manual Entry"
                  description="Enter vehicle details manually for a custom valuation"
                  size="md"
                />
              </CardHeader>
              <CardContent className="pt-8">
                <ManualEntryForm 
                  onSubmit={handleSubmit}
                  isLoading={isSubmitting}
                  submitButtonText="Get Premium Valuation with CARFAX"
                  isPremium={true}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
