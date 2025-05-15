
import React, { useRef, useState, useEffect } from 'react';
import { PremiumHero } from '@/components/premium/PremiumHero';
import { Container } from '@/components/ui/container';
import PremiumManualEntryForm from '@/components/lookup/manual/PremiumManualEntryForm';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

const Premium: React.FC = () => {
  const formRef = useRef<HTMLDivElement>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  
  useEffect(() => {
    // Check if URL has a fragment identifier pointing to the form
    if (window.location.hash === '#premium-form') {
      scrollToForm();
    }
  }, []);
  
  const scrollToForm = () => {
    console.log("Scrolling to premium form");
    setIsFormVisible(true);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };
  
  const handleSubmit = (data: any) => {
    console.log("Premium form submitted:", data);
    
    // Check if user is logged in
    if (!user) {
      // Store form data in localStorage to retrieve after authentication
      localStorage.setItem('pendingPremiumData', JSON.stringify(data));
      
      // Redirect to auth page
      toast.info("Please sign in to continue with premium valuation");
      navigate('/auth', { state: { returnTo: '/premium#premium-form' } });
      return;
    }
    
    // Process the premium valuation
    toast.success("Processing your premium valuation...");
    
    // For now, just redirect to a success page
    // In a real implementation, you would submit this data to your backend
    setTimeout(() => {
      navigate('/valuation', { state: { premiumData: data } });
    }, 1500);
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
