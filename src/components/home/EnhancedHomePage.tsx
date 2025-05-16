
import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRightCircle, Brain, Check, Photo, ChartBar, Search, FileText, Users, Star, Car } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LookupTabs } from '@/components/home/LookupTabs';
import { toast } from 'sonner';
import { MarketTrendChart } from '@/components/valuation/market-trend/MarketTrendChart';
import { useValuation } from '@/contexts/ValuationContext';

const mockChartData = [
  { month: 'Jan', value: 22000 },
  { month: 'Feb', value: 21500 },
  { month: 'Mar', value: 22500 },
  { month: 'Apr', value: 23000 },
  { month: 'May', value: 22800 },
  { month: 'Jun', value: 23200 },
];

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Private Seller',
    avatar: '/images/avatars/avatar-1.png',
    text: 'Car Detective's valuation was spot-on. I sold my Honda CR-V for $2,300 more than the dealer offered!',
    stars: 5
  },
  {
    name: 'Michael Chen',
    role: 'First-time Buyer',
    avatar: '/images/avatars/avatar-2.png',
    text: 'The AI photo analysis caught undisclosed damage the seller never mentioned. Saved me thousands.',
    stars: 5
  },
  {
    name: 'James Williams',
    role: 'Car Enthusiast',
    avatar: '/images/avatars/avatar-3.png',
    text: 'Premium report's 12-month forecast helped me decide the perfect time to sell my BMW. Worth every penny.',
    stars: 5
  },
  {
    name: 'Emma Davis',
    role: 'Family Car Owner',
    avatar: '/images/avatars/avatar-4.png',
    text: 'I was skeptical, but the valuation was within $300 of what I eventually sold for. Incredibly accurate!',
    stars: 4
  }
];

export function EnhancedHomePage() {
  const navigate = useNavigate();
  const valuationRef = useRef<HTMLDivElement>(null);
  const [zipCode, setZipCode] = useState('90210');
  const [testimonialsIndex, setTestimonialsIndex] = useState(0);
  const [valuationType, setValuationType] = useState<'free' | 'premium'>('free');
  
  // Create mockValuationFunctions in case ValuationProvider is not available
  const defaultValuationFunctions = {
    processFreeValuation: async (data: any) => {
      console.log("Mock process free valuation", data);
      toast.error("Valuation service unavailable");
      return { error: "Valuation service unavailable" };
    },
    processPremiumValuation: async (data: any) => {
      console.log("Mock process premium valuation", data);
      toast.error("Premium valuation service unavailable");
      return { error: "Premium valuation service unavailable" };
    }
  };
  
  // Try to use the real valuation context, but fall back to mock if it's not available
  let valuationContext;
  try {
    valuationContext = useValuation();
  } catch (error) {
    console.error("ValuationContext not available:", error);
    valuationContext = defaultValuationFunctions;
  }
  
  const { processFreeValuation, processPremiumValuation } = valuationContext;
  
  const scrollToValuation = () => {
    valuationRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleValuationTypeChange = (value: string) => {
    setValuationType(value as 'free' | 'premium');
    
    try {
      // Analytics tracking would go here
      console.log(`User selected ${value} valuation type`);
    } catch (error) {
      console.error("Error tracking valuation type selection:", error);
    }
  };

  const goToFreeLookup = () => {
    scrollToValuation();
  };

  const goToPremium = () => {
    navigate('/premium');
  };

  return (
    <div className="flex-1 animate-fade-in overflow-x-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white to-primary-light/20 pointer-events-none">
          <div className="absolute inset-0 opacity-10">
            <svg width="100%" height="100%" className="opacity-20">
              <pattern id="pattern-circles" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse" patternContentUnits="userSpaceOnUse">
                <circle id="pattern-circle" cx="20" cy="20" r="6" fill="none" stroke="currentColor" strokeWidth="1"></circle>
              </pattern>
              <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern-circles)"></rect>
            </svg>
          </div>
          <div className="absolute right-0 bottom-0 opacity-20 pointer-events-none">
            <svg width="480" height="420" viewBox="0 0 480 420" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M140 168C140 168 176 96 240 96C304 96 340 168 340 168" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M374 174C374 174 368 172 364 172C360 172 354 174 354 174" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M126 174C126 174 132 172 136 172C140 172 146 174 146 174" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="262" cy="166" r="8" fill="currentColor"/>
              <circle cx="218" cy="166" r="8" fill="currentColor"/>
              <rect x="76" y="236" width="328" height="16" rx="8" fill="currentColor"/>
              <rect x="44" y="264" width="392" height="24" rx="12" fill="currentColor"/>
              <rect x="96" y="208" width="288" height="16" rx="8" fill="currentColor"/>
              <rect x="120" y="300" width="240" height="16" rx="8" fill="currentColor"/>
              <rect x="168" y="328" width="144" height="16" rx="8" fill="currentColor"/>
              <path d="M240 96C240 96 188 148 240 148C292 148 240 96 240 96Z" fill="currentColor"/>
            </svg>
          </div>
        </div>

        <div className="relative z-10 text-center px-4 py-16 md:py-24 max-w-4xl mx-auto">
          <motion.h1 
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-6 font-display"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Know your car's true value <span className="text-primary">in 60 seconds</span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-slate-700 max-w-3xl mx-auto mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            No more guesswork. Get instant AI-powered valuation with confidence.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Button 
              size="lg" 
              onClick={goToFreeLookup}
              className="w-full sm:w-auto px-8 py-6 h-auto text-lg font-medium"
            >
              Free Valuation
              <ArrowRightCircle className="ml-2 h-5 w-5" />
            </Button>
            
            <Button 
              variant="premium" 
              size="lg" 
              onClick={goToPremium}
              className="w-full sm:w-auto px-8 py-6 h-auto text-lg font-medium premium-shine"
            >
              Try Premium for $29.99
              <ArrowRightCircle className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* 2. AI CHAT / ASSISTANT TEASER */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div 
              className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 rounded-2xl p-8 md:p-10 shadow-sm relative overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="absolute -right-12 -top-12 w-40 h-40 bg-gradient-to-br from-indigo-100 to-white rounded-full blur-2xl opacity-70"></div>
              
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-slate-900 relative z-10">
                Ask our AI about your car's value
              </h2>
              
              <p className="text-lg text-slate-700 mb-6 relative z-10">
                Get instant answers to your valuation questions with our advanced AI assistant.
              </p>
              
              <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 mb-6 max-w-lg">
                <div className="flex gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                    <Brain size={18} />
                  </div>
                  <div className="flex-1 bg-slate-100 p-3 rounded-lg text-slate-800 text-sm">
                    Hello! I can help you understand your car's value. What would you like to know?
                  </div>
                </div>
                
                <div className="flex gap-3 justify-end">
                  <div className="flex-1 bg-indigo-100 p-3 rounded-lg text-slate-800 text-sm ml-12">
                    How much is my 2019 Honda Accord worth with 45,000 miles?
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                    <span className="text-xs font-medium">You</span>
                  </div>
                </div>
              </div>
              
              <div className="relative z-10">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="relative overflow-hidden group"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-indigo-700 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
                  <Brain className="mr-2 h-5 w-5 text-indigo-600" />
                  Chat with AI Assistant
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. AI PHOTO SCORING DEMO */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-center mb-12 text-slate-900">AI Photo Scoring</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-200">
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-4 text-slate-900">Upload your car photos</h3>
                  <p className="text-slate-600 mb-6">
                    Our advanced AI analyzes your car's condition from photos to provide a more accurate valuation.
                  </p>
                  
                  <div className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-lg p-8 flex flex-col items-center justify-center mb-4">
                    <Photo className="h-12 w-12 text-slate-400 mb-3" />
                    <p className="text-sm text-slate-500 text-center">
                      Drag & drop photos here or click to browse
                    </p>
                  </div>
                  
                  <Button className="w-full">
                    Upload Photos for Instant Scoring
                  </Button>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-200">
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-4 text-slate-900">AI Condition Analysis</h3>
                  <p className="text-slate-600 mb-6">
                    See how our AI scores photos to assess your vehicle's condition.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="relative rounded-lg overflow-hidden">
                      <img src="/demo-car-front.jpg" alt="Car front" className="w-full h-32 object-cover" />
                      <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                        95%
                      </div>
                    </div>
                    <div className="relative rounded-lg overflow-hidden">
                      <img src="/demo-car-side.jpg" alt="Car side" className="w-full h-32 object-cover" />
                      <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                        90%
                      </div>
                    </div>
                    <div className="relative rounded-lg overflow-hidden">
                      <img src="/demo-car-interior.jpg" alt="Car interior" className="w-full h-32 object-cover" />
                      <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                        75%
                      </div>
                    </div>
                    <div className="relative rounded-lg overflow-hidden">
                      <img src="/demo-car-rear.jpg" alt="Car rear" className="w-full h-32 object-cover" />
                      <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                        88%
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-slate-50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-slate-700">Overall Condition</span>
                      <span className="text-sm font-semibold text-slate-900">Excellent (87%)</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2.5">
                      <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '87%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 4. MARKET SNAPSHOT (ZIP-BASED) */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-center mb-2 text-slate-900">Market Snapshot</h2>
            <p className="text-lg text-center text-slate-600 mb-10">
              See average vehicle prices in your area
            </p>
            
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-200 p-6 md:p-8">
              <div className="flex flex-col md:flex-row gap-6 md:gap-10 items-center md:items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="px-3 py-1.5 bg-slate-100 rounded-md text-sm font-medium text-slate-600">
                      ZIP: {zipCode}
                    </div>
                    <Button variant="outline" size="sm" className="text-xs h-8">
                      Change
                    </Button>
                  </div>
                  
                  <h3 className="text-4xl font-bold text-slate-900 mb-2">$22,430</h3>
                  <p className="text-slate-600 mb-4">Average vehicle price in your area</p>
                  
                  <div className="flex flex-wrap gap-3 mb-4">
                    <div className="px-3 py-1.5 bg-slate-100 rounded-full text-sm font-medium text-slate-600 flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                      Sedans: $19,250
                    </div>
                    <div className="px-3 py-1.5 bg-slate-100 rounded-full text-sm font-medium text-slate-600 flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      SUVs: $27,800
                    </div>
                    <div className="px-3 py-1.5 bg-slate-100 rounded-full text-sm font-medium text-slate-600 flex items-center">
                      <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                      Trucks: $32,150
                    </div>
                  </div>
                  
                  <Button size="sm" variant="outline" className="text-primary">
                    View detailed market report
                    <ArrowRightCircle className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                
                <div className="w-full md:w-64 h-40">
                  <h4 className="text-sm font-medium text-slate-600 mb-2">6-Month Trend</h4>
                  <MarketTrendChart data={mockChartData} />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 5. SMART SEARCH BOX TABS */}
      <section ref={valuationRef} className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-center mb-2 text-slate-900">Get Your Vehicle Valuation</h2>
            <p className="text-lg text-center text-slate-600 mb-10">
              Find your car's value in under a minute — no signup required
            </p>
            
            <Tabs 
              defaultValue="free" 
              value={valuationType} 
              onValueChange={handleValuationTypeChange}
              className="w-full mb-8"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="free">Free Valuation</TabsTrigger>
                <TabsTrigger value="premium">Premium Report</TabsTrigger>
              </TabsList>
              
              <TabsContent value="free" className="mt-6">
                <div className="text-center mb-6">
                  <p className="text-lg text-slate-600">
                    Get a quick, AI-powered estimate based on market data.
                  </p>
                </div>
                <Card className="border-2 border-slate-200">
                  <CardContent className="pt-6">
                    <LookupTabs defaultTab="vin" />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="premium" className="mt-6">
                <div className="text-center mb-6">
                  <p className="text-lg text-slate-600">
                    Get comprehensive analysis with CARFAX® report and dealer-competitive offers.
                  </p>
                </div>
                <Card className="border-2 border-indigo-100 shadow-lg bg-gradient-to-br from-white to-indigo-50/30">
                  <CardContent className="pt-6">
                    <LookupTabs defaultTab="vin" />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </section>

      {/* 6. FREE VS PREMIUM COMPARISON */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-6xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-center mb-2 text-slate-900">Free vs Premium Comparison</h2>
            <p className="text-lg text-center text-slate-600 mb-10 max-w-3xl mx-auto">
              See how our Premium service provides the most comprehensive valuation data available anywhere
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {/* Free Card */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-200 transition-all hover:shadow-lg">
                <div className="p-6 border-b border-slate-100">
                  <h3 className="text-2xl font-bold text-slate-900 mb-1">Free Valuation</h3>
                  <p className="text-slate-600">Basic market estimate</p>
                </div>
                
                <div className="p-6">
                  <div className="text-3xl font-bold text-slate-900 mb-6">$0</div>
                  
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700">VIN/Plate/Manual Lookup</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700">Basic Market Estimate</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700">Single Photo AI Scoring</span>
                    </li>
                    <li className="flex items-start opacity-50">
                      <Check className="h-5 w-5 text-slate-300 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-500">Multi-Photo AI Analysis</span>
                    </li>
                    <li className="flex items-start opacity-50">
                      <Check className="h-5 w-5 text-slate-300 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-500">Full CARFAX® History Report</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700">Limited CARFAX® Preview</span>
                    </li>
                    <li className="flex items-start opacity-50">
                      <Check className="h-5 w-5 text-slate-300 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-500">Feature-Based Value Adjustments</span>
                    </li>
                    <li className="flex items-start opacity-50">
                      <Check className="h-5 w-5 text-slate-300 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-500">Dealer-Beat Offers</span>
                    </li>
                  </ul>
                  
                  <Button variant="outline" size="lg" className="w-full" onClick={goToFreeLookup}>
                    Get Free Valuation
                  </Button>
                </div>
              </div>
              
              {/* Premium Card */}
              <div className="bg-gradient-to-br from-white to-indigo-50/50 rounded-xl shadow-lg overflow-hidden border border-indigo-100 transition-all hover:shadow-xl relative">
                <div className="absolute -top-6 -right-6 w-32 h-32 bg-indigo-100 rounded-full blur-3xl opacity-50"></div>
                <div className="absolute top-3 right-3 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  RECOMMENDED
                </div>
                
                <div className="p-6 border-b border-indigo-100 relative z-10">
                  <h3 className="text-2xl font-bold text-slate-900 mb-1">Premium Report</h3>
                  <p className="text-slate-600">Comprehensive analysis with CARFAX®</p>
                </div>
                
                <div className="p-6 relative z-10">
                  <div className="text-3xl font-bold text-slate-900 mb-1">$29.99</div>
                  <p className="text-indigo-600 text-sm font-medium mb-6">Includes CARFAX® report ($44 value)</p>
                  
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700">VIN/Plate/Manual Lookup</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700">Enhanced Market Estimate</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700">Multi-Photo AI Analysis</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700">Full CARFAX® History Report</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700">Feature-Based Value Adjustments</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700">Dealer-Beat Offers</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700">Open Marketplace Pricing</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-700">12-Month Value Forecast</span>
                    </li>
                  </ul>
                  
                  <Button variant="premium" size="lg" className="w-full premium-shine" onClick={goToPremium}>
                    Get Premium Report
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 7. FEATURE EXPLAINER SECTION */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-6xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-center mb-2 text-slate-900">Premium Features</h2>
            <p className="text-lg text-center text-slate-600 mb-10 max-w-3xl mx-auto">
              Our premium report includes these powerful features to give you the most accurate valuation
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* CARFAX® Feature */}
              <motion.div 
                className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200 transition-all hover:shadow-md"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <div className="p-6">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                    <FileText className="h-6 w-6 text-red-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">CARFAX® Report</h3>
                  <p className="text-slate-600 mb-4">
                    Full vehicle history including accidents, service records, and ownership details.
                  </p>
                  <p className="text-sm text-indigo-600 font-medium">$44 value included</p>
                </div>
              </motion.div>
              
              {/* AI Photo Scoring */}
              <motion.div 
                className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200 transition-all hover:shadow-md"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <div className="p-6">
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                    <Photo className="h-6 w-6 text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">AI Photo Scoring</h3>
                  <p className="text-slate-600 mb-4">
                    Upload multiple photos for our AI to analyze and score your vehicle's condition.
                  </p>
                  <p className="text-sm text-indigo-600 font-medium">Up to 10 photos</p>
                </div>
              </motion.div>
              
              {/* Dealer Offers */}
              <motion.div 
                className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200 transition-all hover:shadow-md"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <div className="p-6">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Dealer Offers</h3>
                  <p className="text-slate-600 mb-4">
                    Compare offers from multiple dealers in your area to get the best deal.
                  </p>
                  <p className="text-sm text-indigo-600 font-medium">Dealer-beat guarantee</p>
                </div>
              </motion.div>
              
              {/* 12-Month Forecast */}
              <motion.div 
                className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200 transition-all hover:shadow-md"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <div className="p-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <ChartBar className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">12-Month Forecast</h3>
                  <p className="text-slate-600 mb-4">
                    Predict your vehicle's future value with our advanced market analysis.
                  </p>
                  <p className="text-sm text-indigo-600 font-medium">Exclusive to premium</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 8. DEALER CTA SECTION */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-5xl mx-auto"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">For Dealers</h2>
                <p className="text-xl text-slate-300 mb-6">
                  Run bulk valuations. Get more leads. Grow your business.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-300">Bulk VIN processing</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-300">Consumer-to-dealer matching</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-300">Advanced analytics dashboard</span>
                  </li>
                </ul>
                <div className="flex flex-wrap gap-4">
                  <Button variant="outline" className="text-white border-white/20 hover:bg-white/10">
                    View Dealer Tools
                  </Button>
                  <Button>
                    Sign Up for Dealer Access
                  </Button>
                </div>
              </div>
              
              <div className="relative">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 shadow-lg p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                      <Car className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Dealer Dashboard</h3>
                      <p className="text-sm text-slate-300">Manage your inventory and leads</p>
                    </div>
                  </div>
                  
                  <div className="bg-white/5 rounded-lg p-4 mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm">Total Leads</span>
                      <span className="text-lg font-bold">247</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-1.5 mb-4">
                      <div className="bg-primary h-1.5 rounded-full" style={{ width: '70%' }}></div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div>
                        <div className="text-lg font-bold">124</div>
                        <div className="text-xs text-slate-400">New</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold">89</div>
                        <div className="text-xs text-slate-400">In Progress</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold">34</div>
                        <div className="text-xs text-slate-400">Converted</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <Button variant="outline" size="sm" className="text-white border-white/20 hover:bg-white/10">
                      View Demo Dashboard
                    </Button>
                  </div>
                </div>
                
                <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-primary/20 rounded-full blur-3xl"></div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 9. TESTIMONIALS CAROUSEL */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-center mb-2 text-slate-900">What Our Users Say</h2>
            <p className="text-lg text-center text-slate-600 mb-10">
              Join thousands of satisfied users who've found their car's true value
            </p>
            
            <div className="relative">
              <motion.div 
                className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-200 p-6 md:p-8"
                animate={{ opacity: 1 }}
                initial={{ opacity: 0 }}
                key={testimonialsIndex}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center mb-6">
                  <div className="w-14 h-14 rounded-full bg-slate-200 overflow-hidden mr-4">
                    <img 
                      src={testimonials[testimonialsIndex].avatar || "/images/avatars/placeholder.jpg"} 
                      alt={testimonials[testimonialsIndex].name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{testimonials[testimonialsIndex].name}</h3>
                    <p className="text-slate-600">{testimonials[testimonialsIndex].role}</p>
                  </div>
                  <div className="ml-auto flex">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i}
                        className={`h-5 w-5 ${i < testimonials[testimonialsIndex].stars ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300'}`}
                      />
                    ))}
                  </div>
                </div>
                
                <blockquote className="text-xl text-slate-700 mb-6 italic">
                  "{testimonials[testimonialsIndex].text}"
                </blockquote>
                
                <div className="flex justify-center gap-2">
                  {testimonials.map((_, i) => (
                    <button 
                      key={i}
                      className={`w-2.5 h-2.5 rounded-full ${i === testimonialsIndex ? 'bg-primary' : 'bg-slate-300'}`}
                      onClick={() => setTestimonialsIndex(i)}
                      aria-label={`View testimonial ${i + 1}`}
                    />
                  ))}
                </div>
              </motion.div>
              
              <div className="absolute top-1/2 -translate-y-1/2 -left-4 md:-left-6">
                <button 
                  onClick={() => setTestimonialsIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))}
                  className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center border border-slate-200 hover:bg-slate-50"
                  aria-label="Previous testimonial"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              </div>
              
              <div className="absolute top-1/2 -translate-y-1/2 -right-4 md:-right-6">
                <button 
                  onClick={() => setTestimonialsIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))}
                  className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center border border-slate-200 hover:bg-slate-50"
                  aria-label="Next testimonial"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 10. PREMIUM PDF PREVIEW */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-center mb-2 text-slate-900">Premium PDF Report</h2>
            <p className="text-lg text-center text-slate-600 mb-10 max-w-3xl mx-auto">
              Get a professional, detailed PDF report that you can download, print, or share
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-4 text-slate-900">What's inside:</h3>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">Detailed vehicle specifications</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">Complete CARFAX® history</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">Dealer competitive offers</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">12-month value forecast</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">AI photo analysis score</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">Feature value breakdown</span>
                  </li>
                </ul>
                
                <Button 
                  variant="premium" 
                  size="lg" 
                  className="w-full sm:w-auto premium-shine"
                  onClick={goToPremium}
                >
                  Unlock Premium Report ($29.99)
                </Button>
                <div className="mt-3 text-sm text-slate-600 flex items-center gap-1">
                  <span className="inline-flex px-2 py-1 bg-red-50 text-red-600 rounded-full text-xs font-medium">Includes $44 CARFAX® report</span>
                </div>
              </div>
              
              <div className="relative">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-slate-200 aspect-[8.5/11] max-w-sm mx-auto relative">
                  <div className="absolute inset-0 backdrop-blur-[3px] flex items-center justify-center z-10">
                    <div className="bg-slate-900/70 rounded-full px-6 py-3 text-white font-medium">
                      Premium Feature
                    </div>
                  </div>
                  <img 
                    src="/images/premium-report-preview.jpg" 
                    alt="Premium report preview" 
                    className="w-full h-full object-cover opacity-70"
                  />
                </div>
                
                <div className="absolute -top-4 -right-4 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full transform rotate-12">
                  Professional Report
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 11. TRUST LOGOS BAR */}
      <section className="py-12 bg-white border-t border-slate-100">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-5xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <p className="text-xs uppercase tracking-wider text-slate-500 text-center mb-8">
              Trusted by thousands of customers
            </p>
            
            <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-12 md:gap-16">
              <div className="h-10 grayscale opacity-60 transition-opacity hover:opacity-100">
                <img src="/logos/carfax.png" alt="CARFAX" className="h-full" />
              </div>
              <div className="h-8 grayscale opacity-60 transition-opacity hover:opacity-100">
                <img src="/logos/stripe.png" alt="Stripe" className="h-full" />
              </div>
              <div className="h-9 grayscale opacity-60 transition-opacity hover:opacity-100">
                <img src="/logos/military.png" alt="Military-grade security" className="h-full" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
