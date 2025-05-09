import React, { useRef, useState, useEffect } from 'react';
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AnimatedButton } from '@/components/ui/animated-button';
import { EnhancedPremiumFeaturesTabs } from '@/components/premium/features/EnhancedPremiumFeaturesTabs';
import { PremiumValuationTabs } from '@/components/premium/sections/PremiumValuationTabs';
import { AnimatedCard } from '@/components/ui/animated-card';
import { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Award, ChartBar, FileText, Check, Zap } from 'lucide-react';
import { PremiumHero } from '@/components/premium/sections/PremiumHero';
import { motion, useTransform, useScroll } from 'framer-motion';
import { useInView } from '@/utils/animations';
import ConfettiEffect from '@/components/effects/ConfettiEffect';
import '@/styles/mobile-optimizations.css';

const PremiumPage = () => {
  const formRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const pricingRef = useRef<HTMLDivElement>(null);
  const [cardRotation, setCardRotation] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Check if sections are in view for animations
  const isPricingInView = useInView(pricingRef, { threshold: 0.2 });
  const areFeaturesInView = useInView(featuresRef, { threshold: 0.1 });
  
  // Parallax effect for background elements
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
    setShowConfetti(true);
  };
  
  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
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

  // Auto-hide confetti after 4 seconds
  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 4000);
      
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  return (
    <div className="flex min-h-screen flex-col bg-surface overflow-x-hidden">
      {/* Confetti effect */}
      <ConfettiEffect active={showConfetti} duration={4000} />
      
      {/* Hero Section with Premium Hero component */}
      <PremiumHero scrollToForm={scrollToForm} />
      
      {/* Premium Benefits Section */}
      <section className="py-16 bg-slate-50 relative">
        <motion.div 
          className="absolute inset-0 bg-gradient-to-b from-slate-100 to-slate-50 pointer-events-none"
          style={{ y: backgroundY }}
        />
        
        <div className="container mx-auto px-4 relative">
          <div className="text-center mb-12">
            <motion.h2 
              className="text-3xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Premium Benefits
            </motion.h2>
            <motion.p 
              className="text-slate-600 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Unlock a suite of advanced tools designed to give you the most accurate 
              and comprehensive vehicle valuation available.
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" ref={featuresRef}>
            <AnimatedCard className="border-none shadow-md" hoverEffect="lift" delay={0.1}>
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
            </AnimatedCard>
            
            <AnimatedCard className="border-none shadow-md" hoverEffect="lift" delay={0.2}>
              <CardHeader className="pb-2">
                <Award className="h-8 w-8 text-indigo-600 mb-2" />
                <CardTitle>Dealer Offers</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Compare offers from CarMax, Carvana, and local dealers who compete for your business.
                </CardDescription>
              </CardContent>
            </AnimatedCard>
            
            <AnimatedCard className="border-none shadow-md" hoverEffect="lift" delay={0.3}>
              <CardHeader className="pb-2">
                <ChartBar className="h-8 w-8 text-indigo-600 mb-2" />
                <CardTitle>12-Month Forecast</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Predictive analytics showing when to sell to maximize your return, with monthly value projections.
                </CardDescription>
              </CardContent>
            </AnimatedCard>
            
            <AnimatedCard className="border-none shadow-md" hoverEffect="lift" delay={0.4}>
              <CardHeader className="pb-2">
                <FileText className="h-8 w-8 text-indigo-600 mb-2" />
                <CardTitle>Premium Report</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Comprehensive, shareable PDF report with all analytics, perfect for negotiations or insurance claims.
                </CardDescription>
              </CardContent>
            </AnimatedCard>
          </div>
          
          <div className="mt-10 text-center">
            <AnimatedButton 
              onClick={scrollToFeatures}
              variant="outline"
              className="mt-4"
              iconAnimation="bounce"
            >
              <Zap className="mr-2 h-4 w-4" />
              Explore All Features
            </AnimatedButton>
          </div>
        </div>
      </section>

      {/* Feature Tabs Section */}
      <div ref={featuresRef} className="scroll-margin-top-16">
        <EnhancedPremiumFeaturesTabs />
      </div>

      {/* Pricing Section */}
      <section 
        id="premium-form" 
        ref={formRef}
        className="py-16 bg-white scroll-margin-top-16"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={isPricingInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-bold mb-4">Premium Pricing</h2>
              <p className="text-slate-600">
                One-time payment. No subscriptions. Get everything you need.
              </p>
            </motion.div>
            
            <motion.div
              ref={pricingRef}
              initial={{ opacity: 0, y: 20 }}
              animate={isPricingInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative"
            >
              <AnimatedCard className="border-2 border-indigo-600 overflow-hidden" hoverEffect="glow">
                <div className="bg-indigo-600 text-white py-4 px-6 text-center">
                  <h3 className="text-xl font-bold">Premium Valuation Report</h3>
                </div>
                <CardContent className="p-6">
                  <motion.div 
                    className="flex justify-center items-center mb-6"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={isPricingInView ? { scale: 1, opacity: 1 } : {}}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <span className="text-5xl font-bold">$29.99</span>
                    <span className="text-slate-500 ml-2">one-time</span>
                  </motion.div>
                  
                  <ul className="space-y-3 mb-8">
                    <motion.li 
                      className="flex items-start"
                      initial={{ x: -10, opacity: 0 }}
                      animate={isPricingInView ? { x: 0, opacity: 1 } : {}}
                      transition={{ duration: 0.3, delay: 0.4 }}
                    >
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span>Full CARFAX® Report ($44.99 value)</span>
                    </motion.li>
                    
                    <motion.li 
                      className="flex items-start"
                      initial={{ x: -10, opacity: 0 }}
                      animate={isPricingInView ? { x: 0, opacity: 1 } : {}}
                      transition={{ duration: 0.3, delay: 0.5 }}
                    >
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span>Dealer Competitive Offers</span>
                    </motion.li>
                    
                    <motion.li 
                      className="flex items-start"
                      initial={{ x: -10, opacity: 0 }}
                      animate={isPricingInView ? { x: 0, opacity: 1 } : {}}
                      transition={{ duration: 0.3, delay: 0.6 }}
                    >
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span>12-Month Value Forecast</span>
                    </motion.li>
                    
                    <motion.li 
                      className="flex items-start"
                      initial={{ x: -10, opacity: 0 }}
                      animate={isPricingInView ? { x: 0, opacity: 1 } : {}}
                      transition={{ duration: 0.3, delay: 0.7 }}
                    >
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span>Premium PDF Report</span>
                    </motion.li>
                    
                    <motion.li 
                      className="flex items-start"
                      initial={{ x: -10, opacity: 0 }}
                      animate={isPricingInView ? { x: 0, opacity: 1 } : {}}
                      transition={{ duration: 0.3, delay: 0.8 }}
                    >
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span>Feature Value Calculator</span>
                    </motion.li>
                  </ul>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={isPricingInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.3, delay: 0.9 }}
                  >
                    <AnimatedButton 
                      className="w-full" 
                      size="lg"
                      scaleOnHover
                      pulseOnHover
                      onClick={() => setShowConfetti(true)}
                    >
                      Get Premium Report
                    </AnimatedButton>
                  </motion.div>
                </CardContent>
              </AnimatedCard>
              
              {/* Star decorations */}
              <motion.div 
                className="absolute -top-5 -right-5 text-yellow-400"
                initial={{ opacity: 0, rotate: -45 }}
                animate={isPricingInView ? { opacity: 1, rotate: 0 } : {}}
                transition={{ duration: 0.6, delay: 1.0 }}
              >
                <svg width="50" height="50" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
              </motion.div>
            </motion.div>
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
    </div>
  );
}

export default PremiumPage;
