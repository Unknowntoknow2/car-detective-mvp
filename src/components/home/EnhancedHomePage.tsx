
import React from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  ArrowRight, 
  Sparkles, 
  Camera, 
  ChartBar, 
  Search, 
  Check, 
  MessageSquare, 
  Clock, 
  FileText, 
  Building, 
  Star, 
  ChevronRight, 
  ChevronLeft
} from 'lucide-react';
import { LockIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

export const EnhancedHomePage: React.FC = () => {
  const navigate = useNavigate();

  const goToValuation = () => {
    navigate('/valuation');
  };

  const goToPremium = () => {
    navigate('/premium');
  };

  return (
    <AppLayout>
      {/* 1. 🔝 Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
        <Container className="py-16 md:py-24">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
              Know your car's true value in 60 seconds
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              No more guesswork. Get instant AI-powered valuation with confidence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                onClick={goToValuation} 
                className="animate-pulse-subtle"
              >
                Free Valuation <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                size="lg" 
                onClick={goToPremium} 
                variant="outline" 
                className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Try Premium for $29.99
              </Button>
            </div>
            
            <div className="w-full max-w-2xl h-48 mt-16 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl opacity-60 relative overflow-hidden">
              {/* Abstract car outline animation could go here */}
              <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] bg-center opacity-10"></div>
            </div>
          </div>
        </Container>
      </section>

      {/* 2. 🧠 AI Chat / Assistant Teaser */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <Container>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Ask our AI about your car's value</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Our AI assistant can answer questions about your vehicle's value, market conditions, and more in seconds.
              </p>
              <Button 
                className="group border border-blue-200 dark:border-blue-800 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 dark:hover:from-blue-900/40 dark:hover:to-indigo-900/40 text-blue-600 dark:text-blue-300"
              >
                <Sparkles className="mr-2 h-4 w-4 text-blue-500" />
                Chat with AI Assistant
                <span className="ml-2 group-hover:translate-x-1 transition-transform duration-200">→</span>
              </Button>
            </div>
            <div className="flex-1 border border-blue-200 dark:border-blue-800 rounded-xl p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 shadow-sm">
              <div className="flex items-start gap-4 mb-4">
                <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                </div>
                <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    How much is my 2018 Honda Accord worth with 50,000 miles?
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-800 flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="h-4 w-4 text-indigo-600 dark:text-indigo-300" />
                </div>
                <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-lg p-3 shadow-sm">
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Based on current market data, a 2018 Honda Accord with 50,000 miles is worth approximately <span className="font-semibold text-indigo-600 dark:text-indigo-300">$21,500 - $23,100</span> depending on condition and trim level...
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 3. 📸 AI Photo Scoring Demo */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">AI Photo Scoring</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Our AI analyzes your vehicle photos to provide an accurate condition assessment and valuation adjustment.
            </p>
          </div>
          <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <div className="grid grid-cols-2 gap-3">
                    {[1, 2, 3, 4].map((index) => (
                      <div key={index} className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden relative hover:opacity-90 transition-opacity">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Camera className="h-8 w-8 text-gray-400" />
                        </div>
                        <div className="absolute bottom-0 right-0 m-2 bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                          {index === 1 ? "Primary" : ""}
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full mt-4">
                    <Camera className="mr-2 h-4 w-4" />
                    Upload Your Photos for Instant Scoring
                  </Button>
                </div>
                <div className="flex-1 border-l pl-6">
                  <h3 className="font-semibold mb-3">AI Photo Analysis</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Overall Condition</span>
                        <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">Good</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: "75%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Exterior</span>
                        <span className="text-sm text-blue-600 dark:text-blue-400">85%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: "85%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Interior</span>
                        <span className="text-sm text-blue-600 dark:text-blue-400">70%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: "70%" }}></div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      <p>Identified Issues:</p>
                      <ul className="list-disc pl-5 text-xs mt-1 space-y-1">
                        <li>Minor scratches on rear bumper</li>
                        <li>Light wear on driver's seat</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 4. 📊 Market Snapshot (ZIP-Based) */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <Container>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Real-Time Market Snapshot</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                See how the market is trending in your area with our real-time data.
              </p>
              <div className="flex items-end gap-2 mb-4">
                <div>
                  <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Your ZIP Code
                  </label>
                  <Input id="zipCode" placeholder="90210" defaultValue="90210" className="w-32" />
                </div>
                <Button variant="outline" className="mb-0.5">Update</Button>
              </div>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Average Vehicle Price</div>
                <div className="text-3xl font-bold mb-1">$22,430</div>
                <div className="flex items-center text-sm text-green-600 dark:text-green-400">
                  <ChartBar className="h-4 w-4 mr-1" />
                  <span>+2.3% last 30 days</span>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 shadow-sm">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Available Listings</div>
                <div className="text-3xl font-bold mb-1">1,248</div>
                <div className="flex items-center text-sm text-blue-600 dark:text-blue-400">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>Avg. 23 days on market</span>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 shadow-sm col-span-2">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  Price Trend - 90210
                </div>
                <div className="h-16 w-full">
                  {/* Sparkline chart would go here */}
                  <div className="w-full h-full flex items-end">
                    {[35, 40, 45, 35, 60, 45, 50, 55, 70, 75, 65, 75].map((value, i) => (
                      <div 
                        key={i} 
                        className="flex-1 bg-blue-500 dark:bg-blue-600 mx-px rounded-t-sm"
                        style={{ height: `${value}%` }}
                      ></div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
                  <span>Jan</span>
                  <span>Jun</span>
                  <span>Dec</span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 5. 🔎 Smart Search Box Tabs */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <Container>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Find Your Vehicle Valuation</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Choose your preferred lookup method below to get started.
            </p>
          </div>
          <div className="max-w-xl mx-auto">
            <Tabs defaultValue="vin" className="w-full">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="vin">VIN Lookup</TabsTrigger>
                <TabsTrigger value="plate">Plate Lookup</TabsTrigger>
                <TabsTrigger value="manual">Manual Entry</TabsTrigger>
              </TabsList>
              <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm">
                <TabsContent value="vin" className="mt-0">
                  <label htmlFor="vin" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Enter your 17-digit VIN
                  </label>
                  <div className="flex gap-2">
                    <Input id="vin" placeholder="e.g. 1HGCM82633A004352" className="flex-1" />
                    <Button type="submit">
                      <Search className="mr-2 h-4 w-4" />
                      Search
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    The VIN can be found on your vehicle registration or on the driver's side dashboard.
                  </p>
                </TabsContent>
                <TabsContent value="plate" className="mt-0">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="plateNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        License Plate
                      </label>
                      <Input id="plateNumber" placeholder="ABC1234" />
                    </div>
                    <div>
                      <label htmlFor="plateState" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        State
                      </label>
                      <Input id="plateState" placeholder="CA" />
                    </div>
                  </div>
                  <Button type="submit" className="w-full">
                    <Search className="mr-2 h-4 w-4" />
                    Search by Plate
                  </Button>
                </TabsContent>
                <TabsContent value="manual" className="mt-0">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="make" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Make
                      </label>
                      <Input id="make" placeholder="e.g. Toyota" />
                    </div>
                    <div>
                      <label htmlFor="model" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Model
                      </label>
                      <Input id="model" placeholder="e.g. Camry" />
                    </div>
                    <div>
                      <label htmlFor="year" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Year
                      </label>
                      <Input id="year" placeholder="e.g. 2019" />
                    </div>
                    <div>
                      <label htmlFor="miles" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Mileage
                      </label>
                      <Input id="miles" placeholder="e.g. 45000" />
                    </div>
                  </div>
                  <Button type="submit" className="w-full">
                    Get Valuation
                  </Button>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </Container>
      </section>

      {/* 6. 🆚 Free vs Premium Comparison Cards */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Choose Your Valuation Plan</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Compare our free and premium options to find what works best for you.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold mb-2">Free Valuation</h3>
                <div className="text-3xl font-bold mb-1">$0</div>
                <p className="text-gray-500 dark:text-gray-400">Basic vehicle valuation</p>
              </div>
              <div className="space-y-3">
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Basic vehicle valuation estimate</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Market-based pricing</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>VIN and license plate lookup</span>
                </div>
                <div className="flex items-start text-gray-400">
                  <Check className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                  <span>CARFAX® history report</span>
                </div>
                <div className="flex items-start text-gray-400">
                  <Check className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                  <span>AI photo scoring</span>
                </div>
                <div className="flex items-start text-gray-400">
                  <Check className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Dealer offers</span>
                </div>
              </div>
              <div className="mt-8">
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={goToValuation}
                >
                  Get Free Valuation
                </Button>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 shadow-md relative overflow-hidden hover:shadow-lg transition-shadow">
              <div className="absolute top-0 right-0">
                <Badge className="rounded-bl-lg rounded-tr-lg rounded-br-none rounded-tl-none bg-blue-600 text-white">
                  Recommended
                </Badge>
              </div>
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold mb-2">Premium Valuation</h3>
                <div className="text-3xl font-bold mb-1">$29.99</div>
                <p className="text-gray-600 dark:text-gray-400">One-time payment, no subscription</p>
              </div>
              <div className="space-y-3">
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Everything in Free, plus:</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span><span className="font-semibold">Full CARFAX®</span> history report ($44 value)</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span><span className="font-semibold">Multi-photo AI</span> condition scoring</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Detailed PDF report</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Real dealer offers</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>12-month price forecast</span>
                </div>
              </div>
              <div className="mt-8">
                <Button 
                  className="w-full premium-shine" 
                  onClick={goToPremium}
                >
                  Upgrade to Premium
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 7. 💡 Feature Explainer Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Premium Features</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Unlock these powerful tools with a one-time Premium upgrade.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-white dark:bg-gray-900 hover:shadow-md transition-all">
              <div className="p-6">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">CARFAX® Report</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Full vehicle history report including accidents, service records, and ownership details.
                </p>
              </div>
            </Card>
            <Card className="bg-white dark:bg-gray-900 hover:shadow-md transition-all">
              <div className="p-6">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mb-4">
                  <Camera className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">AI Photo Scoring</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Upload multiple photos for AI-powered condition assessment that improves valuation accuracy.
                </p>
              </div>
            </Card>
            <Card className="bg-white dark:bg-gray-900 hover:shadow-md transition-all">
              <div className="p-6">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mb-4">
                  <Building className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Dealer Offers</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Receive real purchase offers from local dealers interested in your vehicle.
                </p>
              </div>
            </Card>
            <Card className="bg-white dark:bg-gray-900 hover:shadow-md transition-all">
              <div className="p-6">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center mb-4">
                  <ChartBar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold mb-2">12-Month Forecast</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Predictive analysis of your vehicle's value over the next 12 months to optimize selling time.
                </p>
              </div>
            </Card>
          </div>
        </Container>
      </section>

      {/* 8. 🧰 Dealer CTA Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <Container>
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/30 dark:to-blue-900/30 border border-blue-100 dark:border-blue-800 rounded-xl p-8 shadow-sm">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 mb-3">
                  For Dealerships
                </Badge>
                <h2 className="text-3xl font-bold tracking-tight mb-4">Car Dealers: Grow Your Business</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Expand your inventory, find motivated sellers, and increase your margins with our dealer tools.
                </p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Run bulk valuations for your inventory</span>
                  </div>
                  <div className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Get direct leads from vehicle owners</span>
                  </div>
                  <div className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <span>Premium analytics and market insights</span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button>
                    Run Bulk Valuations
                  </Button>
                  <Button variant="outline">
                    View Dealer Tools
                  </Button>
                </div>
              </div>
              <div className="flex-1 flex justify-center">
                <div className="w-full max-w-md h-64 bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                  <div className="h-12 bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 flex items-center px-4">
                    <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 ml-2">Dealer Dashboard</div>
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                        <div className="text-xs text-gray-500 dark:text-gray-400">New Leads</div>
                        <div className="text-xl font-bold">24</div>
                      </div>
                      <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                        <div className="text-xs text-gray-500 dark:text-gray-400">Conversions</div>
                        <div className="text-xl font-bold">8</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {[1, 2, 3].map((item) => (
                        <div key={item} className="bg-gray-50 dark:bg-gray-700 p-2 rounded flex justify-between items-center">
                          <div className="text-xs">2019 Honda Civic</div>
                          <Badge className="text-xs">New Lead</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 9. 💬 Testimonials Carousel */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">What Our Users Say</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Thousands of vehicle owners trust our valuations every day.
            </p>
          </div>
          <div className="relative max-w-4xl mx-auto">
            <div className="overflow-hidden">
              <div className="flex flex-nowrap transition-transform duration-500">
                <div className="flex-none w-full">
                  <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center mb-4">
                      <div className="flex text-yellow-400">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="h-5 w-5 fill-current" />
                        ))}
                      </div>
                    </div>
                    <blockquote className="text-gray-700 dark:text-gray-300 mb-4">
                      "I was able to negotiate $2,300 more on my trade-in by showing the dealer my premium valuation report. Best $30 I've ever spent!"
                    </blockquote>
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                        <span className="text-blue-600 dark:text-blue-400 font-medium">JD</span>
                      </div>
                      <div className="ml-3">
                        <div className="font-medium">James D.</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Toyota Highlander Owner</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <button className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-4 w-8 h-8 rounded-full bg-white dark:bg-gray-700 shadow-md flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-4 w-8 h-8 rounded-full bg-white dark:bg-gray-700 shadow-md flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600">
              <ChevronRight className="h-4 w-4" />
            </button>
            <div className="flex justify-center mt-6 space-x-2">
              <button className="w-2 h-2 rounded-full bg-blue-600"></button>
              <button className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600"></button>
              <button className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600"></button>
              <button className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600"></button>
            </div>
          </div>
        </Container>
      </section>

      {/* 10. 📥 Premium PDF Preview */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <Container>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 mb-3">
                Premium Feature
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight mb-4">Professional PDF Report</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Get a detailed valuation report you can download, print, and share with dealers or private buyers.
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Full vehicle details and specifications</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Comprehensive condition assessment</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Comparable vehicle listings</span>
                </div>
                <div className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>Price breakdown with adjustments</span>
                </div>
              </div>
              <Button onClick={goToPremium} className="premium-shine">
                <LockIcon className="mr-2 h-4 w-4" />
                Unlock Premium Report ($29.99)
              </Button>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
                Includes $44 CARFAX® report at no additional cost
              </p>
            </div>
            <div className="flex-1">
              <div className="relative">
                <div className="aspect-[3/4] bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg relative">
                  <div className="absolute inset-0 p-6 flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                      <div className="w-1/3 h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      <div className="w-1/4 h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                    <div className="flex-1 grid grid-cols-2 gap-4 mb-4">
                      <div className="h-full bg-gray-200 dark:bg-gray-700 rounded"></div>
                      <div className="space-y-4">
                        <div className="h-1/3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        <div className="h-1/3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        <div className="h-1/3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      </div>
                    </div>
                    <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                    <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                  {/* Blur overlay */}
                  <div className="absolute inset-0 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm flex items-center justify-center">
                    <div className="text-center">
                      <LockIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p className="text-lg font-medium text-gray-600 dark:text-gray-300">
                        Premium Report
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Unlock with Premium
                      </p>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 rotate-6">
                  <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-3 border border-gray-200 dark:border-gray-700">
                    <div className="text-xs font-medium text-blue-600 dark:text-blue-400">CARFAX®</div>
                    <div className="text-sm font-bold">Vehicle History</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Included with Premium</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 11. 🔒 Trust Logos Bar */}
      <section className="py-10 bg-gray-50 dark:bg-gray-800 border-t border-b border-gray-200 dark:border-gray-700">
        <Container>
          <div className="flex flex-wrap items-center justify-around gap-8">
            <div className="flex flex-col items-center">
              <img src="/logos/carfax.png" alt="CARFAX" className="h-8 object-contain opacity-70 hover:opacity-100 transition-opacity" />
              <span className="text-xs text-gray-500 dark:text-gray-400 mt-2">Authorized Partner</span>
            </div>
            <div className="flex flex-col items-center">
              <img src="/logos/stripe.png" alt="Stripe" className="h-8 object-contain opacity-70 hover:opacity-100 transition-opacity" />
              <span className="text-xs text-gray-500 dark:text-gray-400 mt-2">Secure Payments</span>
            </div>
            <div className="flex flex-col items-center">
              <img src="/logos/military.png" alt="Military Grade" className="h-8 object-contain opacity-70 hover:opacity-100 transition-opacity" />
              <span className="text-xs text-gray-500 dark:text-gray-400 mt-2">Data Protection</span>
            </div>
          </div>
        </Container>
      </section>

      {/* 12. 📞 Footer */}
      <section className="py-12 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="/valuation" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Free Valuation</a></li>
                <li><a href="/premium" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Premium Valuation</a></li>
                <li><a href="/vin-lookup" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">VIN Lookup</a></li>
                <li><a href="/dealer" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">For Dealers</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">About</h3>
              <ul className="space-y-2">
                <li><a href="/about" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Our Story</a></li>
                <li><a href="/how-it-works" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">How It Works</a></li>
                <li><a href="/careers" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Careers</a></li>
                <li><a href="/contact" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="/terms" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Terms of Service</a></li>
                <li><a href="/privacy" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Privacy Policy</a></li>
                <li><a href="/cookies" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Cookie Policy</a></li>
                <li><a href="/data" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">Data Processing</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Connect</h3>
              <ul className="space-y-2">
                <li><a href="mailto:support@cardetective.com" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">support@cardetective.com</a></li>
                <li><a href="tel:+18005551234" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">1-800-555-1234</a></li>
                <li className="mt-4">
                  <div className="flex space-x-4">
                    <a href="#" className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                      <span className="sr-only">Facebook</span>
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                      </svg>
                    </a>
                    <a href="#" className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                      <span className="sr-only">Twitter</span>
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                      </svg>
                    </a>
                    <a href="#" className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                      <span className="sr-only">Instagram</span>
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                      </svg>
                    </a>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8 text-center text-sm text-gray-500 dark:text-gray-400">
            <p>© {new Date().getFullYear()} Car Detective. All rights reserved.</p>
          </div>
        </Container>
      </section>
    </AppLayout>
  );
};

export default function HomePage() {
  return (
    <EnhancedHomePage />
  );
}
