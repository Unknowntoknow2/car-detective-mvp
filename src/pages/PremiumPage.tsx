
import { useState, useRef, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/premium/HeroSection';
import { FeaturesSection } from '@/components/premium/FeaturesSection';
import { ComparisonSection } from '@/components/premium/ComparisonSection';
import PremiumValuationSection from '@/components/premium/PremiumValuationSection';
import { PremiumServicesGrid } from '@/components/home/PremiumServicesGrid';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BadgeCheck, ArrowRight } from "lucide-react";
import { Button } from '@/components/ui/button';

export default function PremiumPage() {
  const [cardRotation, setCardRotation] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!cardRef.current) return;
      
      const card = cardRef.current;
      const rect = card.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const normalizedX = Math.min(Math.max((e.clientX - centerX) / (rect.width / 2), -1), 1);
      const normalizedY = Math.min(Math.max((e.clientY - centerY) / (rect.height / 2), -1), 1);
      
      setCardRotation({
        x: normalizedY * 3,
        y: -normalizedX * 3
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <Navbar />
      <main className="flex-1 animate-fade-in">
        {/* Announcement Banner */}
        <Alert className="bg-primary/10 border-primary/20 rounded-none">
          <AlertDescription className="flex items-center justify-center py-1 text-sm font-medium text-primary">
            <BadgeCheck className="h-4 w-4 mr-2" /> New! Dealer-beat Offers & Open-Marketplace Data now in Premium Valuation
            <Button variant="link" className="ml-2 h-auto p-0 text-primary" onClick={scrollToForm}>
              Get Started <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </AlertDescription>
        </Alert>
        
        <HeroSection 
          scrollToFeatures={scrollToFeatures} 
          scrollToForm={scrollToForm}
          cardRef={cardRef}
          cardRotation={cardRotation}
        />
        <PremiumServicesGrid />
        <FeaturesSection featuresRef={featuresRef} />
        <ComparisonSection scrollToForm={scrollToForm} />
        <div ref={formRef}>
          <PremiumValuationSection />
        </div>
      </main>
      <Footer />
    </div>
  );
}
