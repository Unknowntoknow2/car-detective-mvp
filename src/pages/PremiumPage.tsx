
import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout';
import { SEO } from '@/components/layout/seo';
import { PremiumHero } from '@/components/premium/sections/PremiumHero';
import { PremiumFeatures } from '@/components/premium/sections/PremiumFeatures';
import { PremiumTestimonials } from '@/components/premium/sections/PremiumTestimonials';
import { PremiumPricing } from '@/components/premium/sections/PremiumPricing';
import { PremiumFaq } from '@/components/premium/sections/PremiumFaq';
import { Container } from '@/components/ui/container';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { CarFinderQaherHeader } from '@/components/common/CarFinderQaherHeader';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import PremiumVinLookupForm from '@/components/premium/forms/PremiumVinLookupForm';
import PremiumPlateLookupForm from '@/components/premium/forms/PremiumPlateLookupForm';
import PremiumManualEntryForm from '@/components/premium/forms/PremiumManualEntryForm';
import { toast } from 'sonner';

export default function PremiumPage() {
  const formRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [tab, setTab] = useState<'vin' | 'plate' | 'manual'>('vin');

  // State for VIN lookup
  const [vin, setVin] = useState('');

  // State for plate lookup
  const [plate, setPlate] = useState('');
  const [stateCode, setStateCode] = useState('');

  // State for manual entry
  const [premiumFormData, setPremiumFormData] = useState<any>(null);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // VIN lookup handler
  const handleVinSubmit = async () => {
    if (!vin || vin.length !== 17) {
      toast.error('Please enter a valid 17-character VIN');
      return;
    }
    
    console.log('Premium VIN submission:', vin);
    toast.success('Processing premium VIN lookup...');
    
    // Navigate to valuation page with premium flag
    navigate(`/valuation/${vin}?premium=true`);
  };

  // Plate lookup handler
  const handlePlateSubmit = async () => {
    if (!plate || !stateCode) {
      toast.error('Please enter both license plate and state');
      return;
    }
    
    console.log('Premium plate submission:', { plate, stateCode });
    toast.success('Processing premium plate lookup...');
    
    // Navigate to plate valuation page with premium flag
    navigate(`/valuation/plate/${plate}/${stateCode}?premium=true`);
  };

  // Manual entry handler
  const handleManualSubmit = async (formData: any) => {
    console.log('Premium manual submission:', formData);
    toast.success('Processing premium manual valuation...');
    
    // Store premium form data for valuation
    setPremiumFormData(formData);
    
    // Navigate to manual valuation page with premium flag
    navigate('/valuation/manual?premium=true', { state: { formData, isPremium: true } });
  };

  // Type annotation for valuationId parameter
  const handlePurchaseCredit = (valuationId: string) => {
    console.log(`Purchase credit for valuation ID: ${valuationId}`);
    // Implement your logic here, e.g., open a modal or redirect to a payment page
  };

  return (
    <MainLayout>
      <SEO title="Premium Valuation" description="Unlock the full potential of your vehicle's value with our premium valuation service." />
      
      <PremiumHero scrollToForm={scrollToForm} />
      
      <section className="bg-secondary py-12 md:py-20">
        <div className="container grid items-center justify-center gap-6 pt-6 md:pt-10 pb-8 md:pb-14">
          <h2 className="text-3xl font-bold text-center">Ready to see what your vehicle is really worth?</h2>
          <p className="max-w-[85%] md:max-w-[70%] mx-auto text-lg text-muted-foreground text-center">
            Our premium valuation service goes beyond the basics, providing you with an in-depth analysis of your vehicle's market value.
          </p>
          <Button onClick={scrollToForm} className="mx-auto flex items-center gap-2">
            Get Started <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </section>
      
      <PremiumFeatures />
      
      <div ref={formRef}>
        <Container className="max-w-6xl py-10">
          <CarFinderQaherHeader />

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
              Premium Valuation
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Unlock AI-powered insights, CARFAX data, and auction comparisons.
            </p>
          </div>

          <Tabs value={tab} onValueChange={(value) => setTab(value as 'vin' | 'plate' | 'manual')} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="vin">VIN Lookup</TabsTrigger>
              <TabsTrigger value="plate">License Plate</TabsTrigger>
              <TabsTrigger value="manual">Manual Entry</TabsTrigger>
            </TabsList>

            <TabsContent value="vin">
              <PremiumVinLookupForm 
                vin={vin}
                setVin={setVin}
                onSubmit={handleVinSubmit}
              />
            </TabsContent>

            <TabsContent value="plate">
              <PremiumPlateLookupForm 
                plate={plate}
                setPlate={setPlate}
                stateCode={stateCode}
                setStateCode={setStateCode}
                onSubmit={handlePlateSubmit}
              />
            </TabsContent>

            <TabsContent value="manual">
              <PremiumManualEntryForm 
                formData={premiumFormData}
                setFormData={setPremiumFormData}
                onSubmit={handleManualSubmit}
              />
            </TabsContent>
          </Tabs>
        </Container>
      </div>
      
      <PremiumTestimonials />
      
      <PremiumPricing onPurchaseCredit={handlePurchaseCredit} />
      
      <PremiumFaq />
    </MainLayout>
  );
}
