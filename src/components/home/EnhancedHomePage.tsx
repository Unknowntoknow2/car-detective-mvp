
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  MessageCircle, 
  Camera, 
  ChartLine, 
  FileText, 
  ChevronRight 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
import { AiAssistantPreview } from './AiAssistantPreview';
import { PhotoScoringWidget } from './PhotoScoringWidget';
import { MarketSnapshot } from './MarketSnapshot';
import { EnhancedTestimonialsCarousel } from './EnhancedTestimonialsCarousel';
import { PdfPreview } from './PdfPreview';
import { useAuth } from '@/hooks/useAuth';

export function EnhancedHomePage() {
  const navigate = useNavigate();
  const { user, userDetails } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('vin');

  // Track scroll position for sticky header
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 50;
      setIsScrolled(scrolled);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Use react-intersection-observer to create fade-in effects
  const [heroRef, heroInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  const [featuresRef, featuresInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  const [widgetsRef, widgetsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  const [testimonialsRef, testimonialsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  const fadeInVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  // Handle tab switching for lookup methods
  const handleTabChange = (tab: string) => {
    setActiveSection(tab);
  };

  // Get CTA based on user role
  const getCtaButton = () => {
    if (!user) {
      return (
        <Button 
          className="px-8 py-6 text-lg font-medium"
          onClick={() => navigate('/auth/login')}
        >
          Sign In / Sign Up
        </Button>
      );
    } else if (userDetails?.role === 'dealer') {
      return (
        <Button 
          className="px-8 py-6 text-lg font-medium"
          onClick={() => navigate('/dealer/dashboard')}
        >
          Dealer Dashboard
        </Button>
      );
    } else {
      return (
        <Button 
          className="px-8 py-6 text-lg font-medium"
          onClick={() => navigate('/dashboard')}
        >
          My Valuations
        </Button>
      );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        <Container>
          <motion.div
            ref={heroRef}
            initial="hidden"
            animate={heroInView ? "visible" : "hidden"}
            variants={fadeInVariants}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Discover Your Car's <span className="text-primary">True Value</span> with AI
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-3xl mx-auto">
              Our AI analyzes 100+ factors to give you the most accurate valuation possible,
              including condition, market trends, and dealer data.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {getCtaButton()}
              <Button 
                variant="outline" 
                className="px-6 py-6 text-lg font-medium"
                onClick={() => {
                  const lookupSection = document.getElementById('lookup-section');
                  lookupSection?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Start Valuation <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </motion.div>
        </Container>
        
        {/* Background design elements */}
        <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-primary/5 to-transparent"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full filter blur-3xl opacity-50"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/10 rounded-full filter blur-3xl opacity-50"></div>
      </section>

      {/* Lookup Methods Section */}
      <section id="lookup-section" className="py-8 border-t border-muted">
        <Container>
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">
              How Would You Like to Value Your Car?
            </h2>
            <p className="text-muted-foreground text-center max-w-3xl mx-auto">
              Choose the method that works best for you. Each provides a comprehensive valuation tailored to your vehicle.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={`p-6 rounded-lg text-center transition-all ${
              activeSection === 'vin' ? 'bg-primary/10 border-primary' : 'bg-muted/50 hover:bg-muted'
            } border cursor-pointer`} onClick={() => handleTabChange('vin')}>
              <h3 className="text-xl font-semibold mb-2">VIN Lookup</h3>
              <p className="text-sm text-muted-foreground">Enter your 17-digit Vehicle Identification Number.</p>
            </div>
            
            <div className={`p-6 rounded-lg text-center transition-all ${
              activeSection === 'plate' ? 'bg-primary/10 border-primary' : 'bg-muted/50 hover:bg-muted'
            } border cursor-pointer`} onClick={() => handleTabChange('plate')}>
              <h3 className="text-xl font-semibold mb-2">License Plate</h3>
              <p className="text-sm text-muted-foreground">Use your license plate and state for quick lookup.</p>
            </div>
            
            <div className={`p-6 rounded-lg text-center transition-all ${
              activeSection === 'manual' ? 'bg-primary/10 border-primary' : 'bg-muted/50 hover:bg-muted'
            } border cursor-pointer`} onClick={() => handleTabChange('manual')}>
              <h3 className="text-xl font-semibold mb-2">Manual Entry</h3>
              <p className="text-sm text-muted-foreground">Enter your vehicle details manually for a tailored estimate.</p>
            </div>
          </div>
          
          <div className="mt-6 bg-card border rounded-lg p-6">
            {activeSection === 'vin' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Enter Your VIN</h3>
                <div className="flex flex-col sm:flex-row gap-4">
                  <input 
                    type="text" 
                    placeholder="Enter 17-digit VIN" 
                    className="flex h-12 w-full sm:w-3/4 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground"
                  />
                  <Button className="h-12 w-full sm:w-1/4">Look Up</Button>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">The VIN is usually located on your dashboard or door jamb sticker.</p>
              </div>
            )}
            
            {activeSection === 'plate' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Enter Your License Plate</h3>
                <div className="flex flex-col sm:flex-row gap-4">
                  <input 
                    type="text" 
                    placeholder="License Plate" 
                    className="flex h-12 w-full sm:w-2/5 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground"
                  />
                  <select className="flex h-12 w-full sm:w-2/5 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                    <option value="">Select State</option>
                    <option value="CA">California</option>
                    <option value="TX">Texas</option>
                    <option value="NY">New York</option>
                    {/* Add more states */}
                  </select>
                  <Button className="h-12 w-full sm:w-1/5">Look Up</Button>
                </div>
              </div>
            )}
            
            {activeSection === 'manual' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Enter Vehicle Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <label className="text-sm font-medium">Year</label>
                    <input 
                      type="number" 
                      placeholder="e.g. 2019" 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Make</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Honda" 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Model</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Civic" 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Mileage</label>
                    <input 
                      type="number" 
                      placeholder="e.g. 45000" 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground"
                    />
                  </div>
                </div>
                <Button>Continue</Button>
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24 bg-muted">
        <Container>
          <motion.div
            ref={featuresRef}
            initial="hidden"
            animate={featuresInView ? "visible" : "hidden"}
            variants={fadeInVariants}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Premium Valuation Features</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Our advanced AI-powered tools provide insights beyond a simple price estimate.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card p-6 rounded-lg border flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered Analysis</h3>
              <p className="text-muted-foreground">
                Our artificial intelligence analyzes market trends, vehicle condition, and historical data.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg border flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Camera className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Photo Analysis</h3>
              <p className="text-muted-foreground">
                Upload photos of your vehicle and our AI will assess condition and verify features.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg border flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Complete PDF Report</h3>
              <p className="text-muted-foreground">
                Receive a detailed PDF report with CARFAX® data, condition assessment, and market analysis.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Interactive Widgets Section */}
      <section className="py-16 lg:py-24">
        <Container>
          <motion.div
            ref={widgetsRef}
            initial="hidden"
            animate={widgetsInView ? "visible" : "hidden"}
            variants={fadeInVariants}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Experience Our Premium Tools</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Preview the advanced tools included with our premium valuation service.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <AiAssistantPreview />
            <PdfPreview />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <PhotoScoringWidget />
            <MarketSnapshot />
          </div>
        </Container>
      </section>

      {/* Testimonials Section */}
      <section 
        ref={testimonialsRef}
        className="py-16 lg:py-24 bg-muted"
      >
        <Container>
          <motion.div
            initial="hidden"
            animate={testimonialsInView ? "visible" : "hidden"}
            variants={fadeInVariants}
          >
            <EnhancedTestimonialsCarousel />
          </motion.div>
        </Container>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 lg:py-24 bg-primary text-primary-foreground">
        <Container>
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">Ready to Discover Your Car's Value?</h2>
            <p className="text-xl mb-8 text-primary-foreground/85">
              Get an accurate valuation in minutes, backed by our advanced AI technology and comprehensive market data.
            </p>
            {getCtaButton()}
          </div>
        </Container>
      </section>

      {/* Mobile CTA Sticky Bar (only shown on mobile) */}
      <div className={`md:hidden fixed bottom-0 left-0 right-0 bg-background border-t shadow-lg p-3 z-40 ${
        isScrolled ? 'translate-y-0' : 'translate-y-full'
      } transition-transform duration-300`}>
        <Button 
          className="w-full flex items-center justify-center gap-2"
          onClick={() => {
            const lookupSection = document.getElementById('lookup-section');
            lookupSection?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          Start Valuation <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
      
      {/* HOMEPAGE_FINAL_PASS_V3 */}
    </div>
  );
}
