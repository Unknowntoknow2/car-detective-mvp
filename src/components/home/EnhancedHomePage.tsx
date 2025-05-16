
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import { motion } from 'framer-motion';
import { Brain, Car, ChartBar, FileText, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAnimatedInView } from '@/hooks/useAnimatedInView';

export const EnhancedHomePage = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState('vin');
  const [zipCode, setZipCode] = useState('90210');
  
  // Animation hooks for each section
  const { ref: heroRef, isInView: heroInView } = useAnimatedInView();
  const { ref: aiRef, isInView: aiInView } = useAnimatedInView({ delay: 0.2 });
  const { ref: photoRef, isInView: photoInView } = useAnimatedInView({ delay: 0.3 });
  const { ref: marketRef, isInView: marketInView } = useAnimatedInView({ delay: 0.4 });
  const { ref: searchRef, isInView: searchInView } = useAnimatedInView({ delay: 0.5 });
  const { ref: comparisonRef, isInView: comparisonInView } = useAnimatedInView({ delay: 0.6 });
  const { ref: featuresRef, isInView: featuresInView } = useAnimatedInView({ delay: 0.7 });
  const { ref: dealerRef, isInView: dealerInView } = useAnimatedInView({ delay: 0.8 });
  const { ref: testimonialsRef, isInView: testimonialsInView } = useAnimatedInView({ delay: 0.9 });
  const { ref: pdfRef, isInView: pdfInView } = useAnimatedInView({ delay: 1.0 });
  const { ref: trustRef, isInView: trustInView } = useAnimatedInView({ delay: 1.1 });

  const handleFreeValuationClick = () => {
    navigate('/valuation');
  };

  const handlePremiumClick = () => {
    navigate('/premium');
  };

  const handleDealerToolsClick = () => {
    navigate('/dealer');
  };

  return (
    <MainLayout>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* 1. Hero Section */}
        <motion.section 
          ref={heroRef}
          initial={{ opacity: 0, y: 20 }}
          animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="py-16 md:py-24 text-center md:text-left relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-50 to-purple-50 opacity-70"></div>
          <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Know your car's <span className="text-primary">true value</span> in 60 seconds
              </h1>
              <p className="text-lg md:text-xl text-gray-700 max-w-xl">
                No more guesswork. Get instant AI-powered valuation with confidence.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button size="lg" onClick={handleFreeValuationClick} className="hover-lift">
                  Free Valuation
                </Button>
                <Button size="lg" variant="outline" onClick={handlePremiumClick} className="border-primary/30 text-primary hover:bg-primary-light/20 hover-lift">
                  Try Premium for $29.99
                </Button>
              </div>
              <div className="pt-4 flex items-center text-sm text-primary-accent">
                <Sparkles className="h-4 w-4 mr-2" />
                <span>Includes CARFAX® report ($44 value)</span>
              </div>
            </div>
            <div className="hidden md:block">
              <motion.div 
                className="bg-white p-8 rounded-xl shadow-lg border border-gray-100"
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              >
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">My Car's Value</h3>
                  <div className="text-4xl font-bold text-primary mb-4">$22,450</div>
                  <div className="flex justify-center gap-2">
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Great Price</Badge>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">High Confidence</Badge>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* 2. AI Chat / Assistant Teaser */}
        <motion.section
          ref={aiRef}
          initial={{ opacity: 0, y: 20 }}
          animate={aiInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="py-16 md:py-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ask our AI about your car's value</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our advanced AI can answer any questions about your car's valuation, market trends, and more.
            </p>
          </div>
          <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            <div className="bg-primary/5 p-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                <h3 className="font-medium">Car Detective AI Assistant</h3>
              </div>
            </div>
            <div className="p-6">
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-gray-700">How much is my 2018 Honda Accord worth?</p>
              </div>
              <div className="bg-primary/10 rounded-lg p-4 mb-4">
                <p className="text-gray-800">
                  Based on market data, a 2018 Honda Accord in good condition with average mileage is 
                  worth between $18,200 and $22,400 in your area. Would you like to get a more precise 
                  valuation by answering a few questions about your specific vehicle?
                </p>
              </div>
              <div className="mt-4">
                <Button className="w-full group hover-lift" size="lg">
                  <span>Chat with AI Assistant</span>
                  <Sparkles className="ml-2 h-4 w-4 group-hover:animate-pulse" />
                </Button>
              </div>
            </div>
          </div>
        </motion.section>

        {/* 3. AI Photo Scoring Demo */}
        <motion.section
          ref={photoRef}
          initial={{ opacity: 0, y: 20 }}
          animate={photoInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="py-16 md:py-20 bg-gray-50 rounded-3xl"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">AI Photo Scoring</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our AI analyzes your car photos to provide an accurate condition assessment.
            </p>
          </div>
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="aspect-video bg-gray-100 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-sm text-gray-500">Exterior Front</div>
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Condition Score</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700">Excellent</Badge>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="aspect-video bg-gray-100 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-sm text-gray-500">Interior</div>
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Condition Score</span>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">Good</Badge>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="aspect-video bg-gray-100 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-sm text-gray-500">Exterior Side</div>
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Condition Score</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700">Very Good</Badge>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center mt-10">
            <Button size="lg" className="hover-lift">
              Upload Your Photos for Instant Scoring
            </Button>
          </div>
        </motion.section>

        {/* 4. Market Snapshot */}
        <motion.section
          ref={marketRef}
          initial={{ opacity: 0, y: 20 }}
          animate={marketInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="py-16 md:py-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Market Snapshot</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              See real-time market data for your area.
            </p>
          </div>
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Average Price in {zipCode}</CardTitle>
                <CardDescription>Based on recent transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">$22,430</div>
                <div className="text-sm text-green-600 flex items-center mt-1">
                  <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                  2.4% from last month
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Market Demand</CardTitle>
                <CardDescription>Time on market</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">34 days</div>
                <div className="text-sm text-red-600 flex items-center mt-1">
                  <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                  5.1% from last month
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">ZIP Code</CardTitle>
                <CardDescription>Enter your ZIP for local data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex">
                  <Input 
                    type="text" 
                    placeholder="Enter ZIP" 
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    className="mr-2"
                    maxLength={5}
                  />
                  <Button variant="outline">Update</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.section>

        {/* 5. Smart Search Box Tabs */}
        <motion.section
          ref={searchRef}
          initial={{ opacity: 0, y: 20 }}
          animate={searchInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="py-16 md:py-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Quick Vehicle Lookup</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose your preferred method to lookup your vehicle.
            </p>
          </div>
          <div className="max-w-2xl mx-auto">
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
              <TabsList className="grid grid-cols-3 mb-8">
                <TabsTrigger value="vin">VIN Lookup</TabsTrigger>
                <TabsTrigger value="plate">Plate Lookup</TabsTrigger>
                <TabsTrigger value="manual">Manual Entry</TabsTrigger>
              </TabsList>
              <TabsContent value="vin" className="space-y-4">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="text-lg font-medium mb-4">Enter your Vehicle Identification Number</h3>
                  <div className="space-y-4">
                    <Input placeholder="Enter VIN (e.g., 1HGCM82633A004352)" />
                    <Button className="w-full">Lookup VIN</Button>
                  </div>
                  <p className="text-sm text-gray-500 mt-4">
                    Your VIN is a 17-character code that can be found on your vehicle registration, insurance card, or inside the driver's door jamb.
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="plate" className="space-y-4">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="text-lg font-medium mb-4">Enter your License Plate</h3>
                  <div className="space-y-4 grid grid-cols-2 gap-4">
                    <Input placeholder="License Plate" />
                    <Input placeholder="State" />
                    <Button className="w-full col-span-2">Lookup Plate</Button>
                  </div>
                  <p className="text-sm text-gray-500 mt-4">
                    Enter your license plate number and state to retrieve your vehicle information.
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="manual" className="space-y-4">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="text-lg font-medium mb-4">Enter Vehicle Details</h3>
                  <div className="space-y-4 grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <Input placeholder="Year (e.g., 2019)" />
                    </div>
                    <Input placeholder="Make (e.g., Honda)" />
                    <Input placeholder="Model (e.g., Civic)" />
                    <Button className="w-full col-span-2">Continue</Button>
                  </div>
                  <p className="text-sm text-gray-500 mt-4">
                    Can't find your VIN? Enter your vehicle details manually.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </motion.section>

        {/* 6. Free vs Premium Comparison Cards */}
        <motion.section
          ref={comparisonRef}
          initial={{ opacity: 0, y: 20 }}
          animate={comparisonInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="py-16 md:py-20 bg-gradient-to-b from-gray-50 to-white rounded-3xl"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Choose Your Valuation Plan</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Select the plan that best fits your needs.
            </p>
          </div>
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Free Plan */}
            <Card className="border border-gray-200 hover:border-gray-300 transition-all">
              <CardHeader>
                <CardTitle>Free Valuation</CardTitle>
                <CardDescription>Basic vehicle value estimate</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold">$0</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Basic vehicle valuation</span>
                </div>
                <div className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>VIN and plate lookup</span>
                </div>
                <div className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Basic vehicle details</span>
                </div>
                <div className="flex items-start text-gray-400">
                  <svg className="h-5 w-5 text-gray-300 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>No CARFAX® report</span>
                </div>
                <div className="flex items-start text-gray-400">
                  <svg className="h-5 w-5 text-gray-300 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>No dealer offers</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" onClick={handleFreeValuationClick} className="w-full">
                  Start Free Valuation
                </Button>
              </CardFooter>
            </Card>
            
            {/* Premium Plan */}
            <Card className="border-2 border-primary shadow-lg relative">
              <div className="absolute top-0 right-0 bg-primary text-white px-3 py-1 text-sm font-medium rounded-bl-lg rounded-tr-lg">
                Recommended
              </div>
              <CardHeader>
                <CardTitle>Premium Valuation</CardTitle>
                <CardDescription>Complete vehicle analysis with CARFAX®</CardDescription>
                <div className="mt-4">
                  <span className="text-3xl font-bold">$29.99</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Comprehensive vehicle valuation</span>
                </div>
                <div className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Complete CARFAX® report ($44 value)</span>
                </div>
                <div className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Multi-photo AI condition scoring</span>
                </div>
                <div className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Dealer offers in your area</span>
                </div>
                <div className="flex items-start">
                  <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Downloadable PDF report</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handlePremiumClick} className="w-full">
                  Get Premium Valuation
                </Button>
              </CardFooter>
            </Card>
          </div>
        </motion.section>

        {/* 7. Feature Explainer Section */}
        <motion.section
          ref={featuresRef}
          initial={{ opacity: 0, y: 20 }}
          animate={featuresInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="py-16 md:py-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Premium Features</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get the most accurate valuation with our advanced features.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-md transition-all">
              <CardHeader>
                <div className="h-12 w-12 rounded-full bg-red-50 flex items-center justify-center text-red-500 mb-4">
                  <FileText className="h-6 w-6" />
                </div>
                <CardTitle>CARFAX® Report</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Get a complete vehicle history report including accidents, service records, and previous owners.
                </p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-all">
              <CardHeader>
                <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 mb-4">
                  <Car className="h-6 w-6" />
                </div>
                <CardTitle>AI Photo Scoring</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Our AI analyzes your car photos to provide an accurate condition assessment and valuation adjustment.
                </p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-all">
              <CardHeader>
                <div className="h-12 w-12 rounded-full bg-green-50 flex items-center justify-center text-green-500 mb-4">
                  <Sparkles className="h-6 w-6" />
                </div>
                <CardTitle>Dealer Offers</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Receive actual purchase offers from dealerships in your area interested in your vehicle.
                </p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-all">
              <CardHeader>
                <div className="h-12 w-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-500 mb-4">
                  <ChartBar className="h-6 w-6" />
                </div>
                <CardTitle>12-Month Forecast</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  View projected value changes for your vehicle over the next 12 months to time your sale perfectly.
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.section>

        {/* 8. Dealer CTA Section */}
        <motion.section
          ref={dealerRef}
          initial={{ opacity: 0, x: -50 }}
          animate={dealerInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
          transition={{ duration: 0.5 }}
          className="py-16 md:py-20 bg-gradient-to-r from-slate-900 to-blue-900 text-white rounded-3xl"
        >
          <div className="max-w-4xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Are You a Dealer?</h2>
                <p className="text-lg opacity-80 mb-6">
                  Run bulk valuations, get more leads, and grow your business with our dealer tools.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    size="lg" 
                    onClick={handleDealerToolsClick}
                    className="bg-white text-slate-900 hover:bg-gray-200 hover-lift"
                  >
                    View Dealer Tools
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="border-white text-white hover:bg-white/10 hover-lift"
                  >
                    Learn More
                  </Button>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
                  <h3 className="text-xl font-semibold mb-4">Dealer Advantages</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-green-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Bulk VIN lookup and valuations</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-green-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Direct customer leads</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-green-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Market analytics dashboard</span>
                    </li>
                    <li className="flex items-center">
                      <svg className="h-5 w-5 text-green-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Inventory management tools</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* 9. Testimonials Carousel */}
        <motion.section
          ref={testimonialsRef}
          initial={{ opacity: 0, y: 20 }}
          animate={testimonialsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="py-16 md:py-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Thousands of car owners trust our valuations every day.
            </p>
          </div>
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border border-gray-200 hover:border-gray-300 transition-all">
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    <div className="text-yellow-400 flex">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 mb-6">
                    "Car Detective gave me an accurate valuation that was spot on with what the dealer offered. The CARFAX report saved me from buying a car with hidden damage. Worth every penny!"
                  </p>
                  <div className="flex items-center">
                    <div className="ml-3">
                      <h4 className="font-semibold">Michael T.</h4>
                      <p className="text-sm text-gray-500">Toyota Camry Owner</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border border-gray-200 hover:border-gray-300 transition-all">
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    <div className="text-yellow-400 flex">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700 mb-6">
                    "The AI photo scoring was incredibly accurate! It detected minor scratches I hadn't even mentioned and adjusted the valuation accordingly. This is next-level technology."
                  </p>
                  <div className="flex items-center">
                    <div className="ml-3">
                      <h4 className="font-semibold">Sarah L.</h4>
                      <p className="text-sm text-gray-500">BMW X5 Owner</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.section>

        {/* 10. Premium PDF Preview */}
        <motion.section
          ref={pdfRef}
          initial={{ opacity: 0, y: 20 }}
          animate={pdfInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="py-16 md:py-20 bg-gray-50 rounded-3xl"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Premium PDF Report</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get a comprehensive PDF report with all the details about your vehicle.
            </p>
          </div>
          <div className="max-w-4xl mx-auto px-6">
            <div className="bg-white p-6 rounded-xl shadow-md relative overflow-hidden">
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10">
                <div className="text-center">
                  <div className="mb-4">
                    <Lock className="h-12 w-12 text-primary mx-auto" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Premium Report Preview</h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Unlock the full report with CARFAX® history, market analysis, and more.
                  </p>
                  <Button onClick={handlePremiumClick} size="lg" className="hover-lift">
                    Unlock Premium Report ($29.99)
                  </Button>
                  <div className="mt-3 text-sm text-primary flex items-center justify-center">
                    <Sparkles className="h-4 w-4 mr-1" />
                    <span>Includes $44 CARFAX® report</span>
                  </div>
                </div>
              </div>
              <div className="aspect-[8.5/11] bg-gray-100 rounded-lg"></div>
            </div>
          </div>
        </motion.section>

        {/* 11. Trust Logos Bar */}
        <motion.section
          ref={trustRef}
          initial={{ opacity: 0, y: 20 }}
          animate={trustInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="py-16 md:py-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold mb-4">Trusted Partners</h2>
          </div>
          <div className="max-w-4xl mx-auto grid grid-cols-3 gap-8 items-center justify-items-center">
            <div className="grayscale hover:grayscale-0 transition duration-300">
              <img src="/logos/carfax.png" alt="CARFAX" className="h-12 object-contain" />
            </div>
            <div className="grayscale hover:grayscale-0 transition duration-300">
              <img src="/logos/stripe.png" alt="Stripe" className="h-12 object-contain" />
            </div>
            <div className="grayscale hover:grayscale-0 transition duration-300">
              <img src="/logos/military.png" alt="Military Grade Security" className="h-12 object-contain" />
            </div>
          </div>
        </motion.section>
      </div>
    </MainLayout>
  );
};
