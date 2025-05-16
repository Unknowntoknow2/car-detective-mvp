
import React, { useRef, useState, useEffect } from 'react';
import { Container } from '@/components/ui/container';
import PremiumManualEntryForm from '@/components/lookup/manual/PremiumManualEntryForm';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { useValuation } from '@/contexts/ValuationContext';
import { PremiumHero } from '@/components/premium/PremiumHero';
import { PremiumTabs } from '@/components/premium/PremiumTabs';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Check } from 'lucide-react';

const Premium: React.FC = () => {
  const formRef = useRef<HTMLDivElement>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<"comparison" | "form">("comparison");
  const navigate = useNavigate();
  const location = useLocation();
  const { processPremiumValuation } = useValuation();
  
  useEffect(() => {
    // Check if URL has a fragment identifier pointing to the form
    if (window.location.hash === '#premium-form') {
      scrollToForm();
      setActiveTab("form");
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
      
      <div className="py-16 bg-white">
        <Container>
          <div className="max-w-5xl mx-auto">
            <Tabs defaultValue="comparison" value={activeTab} onValueChange={(value) => setActiveTab(value as "comparison" | "form")}>
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="comparison">Compare Free vs Premium</TabsTrigger>
                <TabsTrigger value="form">Premium Form</TabsTrigger>
              </TabsList>
              
              <TabsContent value="comparison">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Free Valuation Column */}
                  <div className="bg-gray-50 p-6 rounded-lg border">
                    <h3 className="text-xl font-bold mb-4">Free Valuation</h3>
                    <p className="text-gray-600 mb-6">Basic valuation with essential features</p>
                    <div className="text-2xl font-bold mb-6">$0</div>
                    
                    <ul className="space-y-3 mb-8">
                      <li className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Basic vehicle valuation</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>VIN decoder</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Basic vehicle information</span>
                      </li>
                    </ul>
                    
                    <div>
                      <PremiumTabs showFreeValuation={true} />
                    </div>
                  </div>
                  
                  {/* Premium Valuation Column */}
                  <div className="bg-primary/5 p-6 rounded-lg border-2 border-primary">
                    <h3 className="text-xl font-bold mb-4">Premium Valuation</h3>
                    <p className="text-gray-600 mb-6">Comprehensive valuation with premium insights</p>
                    <div className="text-2xl font-bold mb-6">$29.99</div>
                    
                    <ul className="space-y-3 mb-8">
                      <li className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>Everything in Free Valuation</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>Full CARFAX® History Report</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>Verified Dealer Offers</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>12-Month Resale Trend Forecast</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>Detailed Confidence Score</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>Professional PDF Report</span>
                      </li>
                    </ul>
                    
                    <button 
                      className="w-full bg-primary text-white font-medium py-3 px-4 rounded-md hover:bg-primary/90 transition-colors"
                      onClick={() => {
                        setActiveTab("form");
                        scrollToForm();
                      }}
                    >
                      Get Premium Valuation
                    </button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="form">
                <div id="premium-form" ref={formRef}>
                  <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-8">Premium Vehicle Valuation</h2>
                    <div className="mb-8">
                      <PremiumTabs showFreeValuation={false} />
                    </div>
                    <PremiumManualEntryForm onSubmit={handleSubmit} />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default Premium;
