
import React, { useRef } from 'react';
import { MainLayout } from '@/components/layout';
import { SEO } from '@/components/layout/seo';
import { PremiumHero } from '@/components/premium/sections/PremiumHero';
import { PremiumFeatures } from '@/components/premium/sections/PremiumFeatures';
import PremiumValuationForm from '@/components/premium/form/PremiumValuationForm';
import { PremiumTestimonials } from '@/components/premium/sections/PremiumTestimonials';
import { PremiumPricing } from '@/components/premium/sections/PremiumPricing';
import { PremiumFaq } from '@/components/premium/sections/PremiumFaq';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

export default function PremiumPage() {
  const formRef = useRef<HTMLDivElement>(null);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
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
        <PremiumValuationForm />
      </div>
      
      <PremiumTestimonials />
      
      <PremiumPricing onPurchaseCredit={handlePurchaseCredit} />
      
      <PremiumFaq />
    </MainLayout>
  );
}
