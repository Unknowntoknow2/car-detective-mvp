
import React, { useRef, useState, useEffect } from 'react';
import { Container } from '@/components/ui/container';
import PremiumManualEntryForm from '@/components/lookup/manual/PremiumManualEntryForm';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { useValuation } from '@/contexts/ValuationContext';
import { PremiumHero } from '@/components/premium/PremiumHero';

const Premium: React.FC = () => {
  const formRef = useRef<HTMLDivElement>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { processPremiumValuation } = useValuation();
  
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
    console.log("Scrolling to premium form");
    setIsFormVisible(true);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };
  
  const handleSubmit = (data: any) => {
    console.log("Premium form submitted:", data);
    
    // Store form data in localStorage to retrieve after authentication if needed
    localStorage.setItem('pendingPremiumData', JSON.stringify(data));
    
    // Process the premium valuation
    processPremiumValuation(data).then(result => {
      if (result && result.valuationId) {
        toast.success("Premium valuation processed successfully!");
        navigate(`/valuation-result?id=${result.valuationId}`);
      } else {
        // Redirect to auth page if valuation couldn't be processed
        // (this could be due to not having premium access)
        toast.info("Please sign in to continue with premium valuation");
        navigate('/auth', { state: { returnTo: '/premium#premium-form' } });
      }
    }).catch(error => {
      console.error("Error processing premium valuation:", error);
      toast.error("Failed to process premium valuation");
    });
  };
  
  return (
    <div>
      <PremiumHero scrollToForm={scrollToForm} />
      
      <div id="premium-form" ref={formRef} className="py-16 bg-white">
        {isFormVisible && (
          <Container>
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-8">Premium Vehicle Valuation</h2>
              <PremiumManualEntryForm onSubmit={handleSubmit} />
            </div>
          </Container>
        )}
      </div>
    </div>
  );
};

export default Premium;
