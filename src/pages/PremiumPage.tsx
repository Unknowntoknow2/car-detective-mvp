
import React, { useRef, useState, useEffect } from 'react';
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from '@/components/ui/button';
import { EnhancedPremiumFeaturesTabs } from '@/components/premium/features/EnhancedPremiumFeaturesTabs';
import { PremiumValuationTabs } from '@/components/premium/sections/PremiumValuationTabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Award, ChartBar, FileText } from 'lucide-react';
import { PremiumHero } from '@/components/premium/sections/PremiumHero';
import '@/styles/mobile-optimizations.css';

const PremiumPage = () => {
  const formRef = useRef<HTMLDivElement>(null);
  const [cardRotation, setCardRotation] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!cardRef.current) return;
      
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      const rotationX = y / 20;
      const rotationY = -x / 20;
      
      setCardRotation({
        x: rotationX,
        y: rotationY
      });
    };
    
    const resetRotation = () => {
      setCardRotation({ x: 0, y: 0 });
    };
    
    const cardElement = cardRef.current;
    
    if (cardElement) {
      cardElement.addEventListener('mousemove', handleMouseMove);
      cardElement.addEventListener('mouseleave', resetRotation);
      
      return () => {
        cardElement.removeEventListener('mousemove', handleMouseMove);
        cardElement.removeEventListener('mouseleave', resetRotation);
      };
    }
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <Navbar />
      <main className="flex-1 animate-fade-in">
        {/* Hero Section with Premium Hero component */}
        <PremiumHero scrollToForm={scrollToForm} />
        
        {/* Premium Benefits Section */}
        <section className="py-16 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Premium Benefits</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Unlock a suite of advanced tools designed to give you the most accurate 
                and comprehensive vehicle valuation available.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-none shadow-md">
                <CardHeader className="pb-2">
                  <Shield className="h-8 w-8 text-indigo-600 mb-2" />
                  <CardTitle>CARFAX® Report</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Full accident history, service records, and title verification to ensure you know 
                    the complete story of your vehicle.
                  </CardDescription>
                </CardContent>
              </Card>
              
              <Card className="border-none shadow-md">
                <CardHeader className="pb-2">
                  <Award className="h-8 w-8 text-indigo-600 mb-2" />
                  <CardTitle>Dealer Offers</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Compare offers from CarMax, Carvana, and local dealers who compete for your business.
                  </CardDescription>
                </CardContent>
              </Card>
              
              <Card className="border-none shadow-md">
                <CardHeader className="pb-2">
                  <ChartBar className="h-8 w-8 text-indigo-600 mb-2" />
                  <CardTitle>12-Month Forecast</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Predictive analytics showing when to sell to maximize your return, with monthly value projections.
                  </CardDescription>
                </CardContent>
              </Card>
              
              <Card className="border-none shadow-md">
                <CardHeader className="pb-2">
                  <FileText className="h-8 w-8 text-indigo-600 mb-2" />
                  <CardTitle>Premium Report</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Comprehensive, shareable PDF report with all analytics, perfect for negotiations or insurance claims.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Feature Tabs Section */}
        <EnhancedPremiumFeaturesTabs />

        {/* Pricing Section */}
        <section id="premium-form" ref={formRef} className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Premium Pricing</h2>
                <p className="text-slate-600">
                  One-time payment. No subscriptions. Get everything you need.
                </p>
              </div>
              
              <Card className="border-2 border-indigo-600 overflow-hidden">
                <div className="bg-indigo-600 text-white py-4 px-6 text-center">
                  <h3 className="text-xl font-bold">Premium Valuation Report</h3>
                </div>
                <CardContent className="p-6">
                  <div className="flex justify-center items-center mb-6">
                    <span className="text-5xl font-bold">$29.99</span>
                    <span className="text-slate-500 ml-2">one-time</span>
                  </div>
                  
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Full CARFAX® Report ($44.99 value)</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Dealer Competitive Offers</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>12-Month Value Forecast</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Premium PDF Report</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Feature Value Calculator</span>
                    </li>
                  </ul>
                  
                  <Button className="w-full" size="lg">
                    Get Premium Report
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Valuation Tabs */}
        <div className="bg-white py-8">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold">Try Our Premium Valuation Tools</h2>
              <p className="text-slate-600 mt-2">
                Experience the difference with our comprehensive valuation system
              </p>
            </div>
          </div>
          <PremiumValuationTabs />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PremiumPage;
