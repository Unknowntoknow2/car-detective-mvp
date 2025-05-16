
import React, { useRef, useState, useEffect } from 'react';
import { HeroSection } from '@/components/premium/HeroSection';
import { Container } from '@/components/ui/container';
import { PremiumValuationForm } from '@/components/premium/form/PremiumValuationForm';
import { EnhancedPremiumFeaturesTabs } from '@/components/premium/features/EnhancedPremiumFeaturesTabs';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { PremiumHero } from '@/components/premium/PremiumHero';
import { PremiumTabs } from '@/components/premium/PremiumTabs';

const Premium: React.FC = () => {
  const formRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const [cardRotation, setCardRotation] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Track mouse for 3D card effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const rotateY = ((e.clientX - centerX) / (rect.width / 2)) * 5;
        const rotateX = -((e.clientY - centerY) / (rect.height / 2)) * 5;
        
        setCardRotation({ x: rotateX, y: rotateY });
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  useEffect(() => {
    // Check if URL has a fragment identifier pointing to the form
    if (window.location.hash === '#premium-form') {
      scrollToForm();
    }
    
    // Check if there's a canceled payment
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('canceled') === 'true') {
      toast.error('Payment was canceled. Please try again if you want to unlock premium features.');
    }
  }, [location]);
  
  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  return (
    <div className="min-h-screen bg-background">
      <HeroSection
        scrollToFeatures={scrollToFeatures}
        scrollToForm={scrollToForm}
        cardRef={cardRef}
        cardRotation={cardRotation}
      />
      
      <div className="py-16 bg-white" ref={featuresRef}>
        <Container>
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Start Your Premium Valuation</h2>
            <PremiumTabs showFreeValuation={true} />
          </div>
        </Container>
      </div>
      
      <EnhancedPremiumFeaturesTabs />
      
      <div className="py-16 bg-gradient-to-b from-background to-primary/5" id="premium-form" ref={formRef}>
        <Container>
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Premium Valuation Form</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              Get the most accurate valuation with our premium multi-step form that considers every detail of your vehicle.
            </p>
            <div className="flex justify-center gap-4">
              <Button variant="outline" onClick={() => navigate('/valuation')}>
                Back to Basic Valuation
              </Button>
            </div>
          </div>
          
          <PremiumValuationForm />
        </Container>
      </div>
    </div>
  );
};

export default Premium;
