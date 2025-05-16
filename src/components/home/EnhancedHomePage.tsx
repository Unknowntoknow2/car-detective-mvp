
import React from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import { 
  Sparkles, 
  Camera, 
  MapPin, 
  ArrowRight, 
  CheckCircle, 
  ChevronRight, 
  Star, 
  Download, 
  Lock as LockIcon // Import Lock icon with proper alias to avoid conflicts
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export const EnhancedHomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <AppLayout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-16 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 md:pr-12">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Know your car's true value in 60 seconds
              </h1>
              <p className="mt-4 text-xl text-gray-600">
                No more guesswork. Get instant AI-powered valuation with confidence.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button 
                  size="lg" 
                  onClick={() => navigate('/valuation')}
                  className="bg-primary hover:bg-primary/90 text-white"
                >
                  Free Valuation
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => navigate('/premium')}
                  className="border-primary text-primary hover:bg-primary/10"
                >
                  Try Premium for $29.99
                </Button>
              </div>
            </div>
            <div className="mt-10 md:mt-0 md:w-1/2">
              <div className="relative">
                <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 border border-gray-100">
                  <img 
                    src="/placeholder.svg"
                    alt="Car valuation visualization" 
                    className="w-full rounded-lg"
                  />
                  <div className="absolute -bottom-4 -right-4 bg-accent text-white px-4 py-2 rounded-lg text-sm font-medium">
                    AI-Powered
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* AI Chat / Assistant Teaser */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">Ask our AI about your car's value</h2>
            <p className="mt-4 text-xl text-gray-600">Get expert insights with our AI assistant</p>
          </div>
          
          <div className="max-w-3xl mx-auto bg-gradient-to-r from-gray-50 to-white p-1 rounded-xl border border-gray-200 shadow-sm">
            <div className="bg-white rounded-lg p-6">
              <div className="flex items-start mb-6">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div className="bg-gray-100 rounded-2xl rounded-tl-none p-4 text-gray-700">
                  How can I help you understand your vehicle's value today?
                </div>
              </div>
              
              <div className="flex items-start mb-6 justify-end">
                <div className="bg-primary/10 rounded-2xl rounded-tr-none p-4 text-gray-800">
                  What factors affect my 2019 Toyota Camry's value the most?
                </div>
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center ml-4">
                  <span className="text-sm font-medium">You</span>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div className="bg-gray-100 rounded-2xl rounded-tl-none p-4 text-gray-700">
                  <p>The top factors affecting your 2019 Camry's value are:</p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Mileage (each 10K miles ≈ 5-7% value impact)</li>
                    <li>Accident history (clean CARFAX adds ~12% value)</li>
                    <li>Condition (excellent vs. good ≈ 8-10% difference)</li>
                    <li>Location (urban markets pay 4-6% premium)</li>
                    <li>Optional features (premium package adds ~$800-1200)</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-6">
                <Button 
                  className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-medium"
                >
                  <Sparkles className="h-4 w-4 mr-2" /> Chat with AI Assistant
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Photo Scoring Demo */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">AI Photo Analysis</h2>
            <p className="mt-4 text-xl text-gray-600">Upload photos and get detailed condition assessment</p>
          </div>
          
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative group">
                  <img 
                    src="/placeholder.svg" 
                    alt="Car front view"
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute inset-0 bg-primary/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute bottom-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    Excellent
                  </div>
                </div>
                
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative group">
                  <img 
                    src="/placeholder.svg" 
                    alt="Car side view"
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute inset-0 bg-primary/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute bottom-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
                    Good
                  </div>
                </div>
                
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative group">
                  <img 
                    src="/placeholder.svg" 
                    alt="Car interior view"
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute inset-0 bg-primary/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute bottom-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    Excellent
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-700">Overall Condition</span>
                  <span className="font-bold text-green-600">Excellent (92/100)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '92%' }}></div>
                </div>
                
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Exterior Assessment</h4>
                    <ul className="text-sm space-y-1">
                      <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" /> No visible scratches</li>
                      <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" /> Paint in excellent condition</li>
                      <li className="flex items-center"><CheckCircle className="h-4 w-4 text-yellow-500 mr-2" /> Minor wheel scuff detected</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Interior Assessment</h4>
                    <ul className="text-sm space-y-1">
                      <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" /> Clean upholstery</li>
                      <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" /> Dashboard in good condition</li>
                      <li className="flex items-center"><CheckCircle className="h-4 w-4 text-green-500 mr-2" /> No visible wear on seats</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                <Camera className="h-4 w-4 mr-2" /> Upload Your Photos for Instant Scoring
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Market Snapshot */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">Market Snapshot</h2>
            <p className="mt-4 text-xl text-gray-600">Current vehicle values in your area</p>
          </div>
          
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-gray-50 to-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-primary mr-2" />
                  <span className="text-lg font-medium">90210</span>
                </div>
                <div className="relative">
                  <select className="bg-white border border-gray-300 text-gray-700 py-2 pl-3 pr-8 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary">
                    <option>Change ZIP</option>
                    <option value="90210">90210</option>
                    <option value="10001">10001</option>
                    <option value="60601">60601</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-medium text-gray-700 mb-1">Average Sedan</h3>
                  <p className="text-2xl font-bold text-gray-900">$22,430</p>
                  <div className="flex items-center mt-2 text-sm text-green-600">
                    <ArrowRight className="h-4 w-4 transform rotate-45 mr-1" />
                    <span>+2.4% from last month</span>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-medium text-gray-700 mb-1">Average SUV</h3>
                  <p className="text-2xl font-bold text-gray-900">$31,850</p>
                  <div className="flex items-center mt-2 text-sm text-green-600">
                    <ArrowRight className="h-4 w-4 transform rotate-45 mr-1" />
                    <span>+1.7% from last month</span>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-medium text-gray-700 mb-1">Average Truck</h3>
                  <p className="text-2xl font-bold text-gray-900">$39,720</p>
                  <div className="flex items-center mt-2 text-sm text-red-600">
                    <ArrowRight className="h-4 w-4 transform -rotate-45 mr-1" />
                    <span>-0.8% from last month</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                  View Full Market Report
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Smart Search Box Tabs */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">Start Your Valuation</h2>
            <p className="mt-4 text-xl text-gray-600">Choose your preferred lookup method</p>
          </div>
          
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
            <div className="border-b border-gray-200">
              <nav className="flex" aria-label="Tabs">
                <button className="px-4 py-4 border-b-2 border-primary text-primary font-medium flex-1 focus:outline-none">
                  VIN Lookup
                </button>
                <button className="px-4 py-4 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium flex-1 focus:outline-none">
                  Plate Lookup
                </button>
                <button className="px-4 py-4 border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 font-medium flex-1 focus:outline-none">
                  Manual Entry
                </button>
              </nav>
            </div>
            
            <div className="p-6 md:p-8">
              <label htmlFor="vin" className="block text-sm font-medium text-gray-700 mb-2">
                Vehicle Identification Number (VIN)
              </label>
              <div className="flex">
                <input
                  type="text"
                  id="vin"
                  className="flex-1 rounded-l-md border border-gray-300 px-4 py-3 focus:border-primary focus:ring-primary/30 focus:outline-none focus:ring-2"
                  placeholder="Enter 17-digit VIN"
                  maxLength={17}
                />
                <Button className="rounded-l-none bg-primary hover:bg-primary/90 text-white">
                  Look Up
                </Button>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Enter your vehicle's VIN to get the most accurate valuation
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Free vs Premium Comparison */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">Choose Your Valuation</h2>
            <p className="mt-4 text-xl text-gray-600">Compare our free and premium options</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transform transition hover:shadow-md hover:-translate-y-1">
              <div className="p-6 md:p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Free Valuation</h3>
                <p className="text-gray-600 mb-6">Basic valuation for quick estimates</p>
                <p className="text-4xl font-bold text-gray-900 mb-6">$0</p>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span>Basic vehicle valuation</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span>Current market value</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span>Basic valuation explanation</span>
                  </li>
                  <li className="flex items-start text-gray-400">
                    <CheckCircle className="h-5 w-5 text-gray-300 mr-3 mt-0.5 flex-shrink-0" />
                    <span>CARFAX® report</span>
                  </li>
                  <li className="flex items-start text-gray-400">
                    <CheckCircle className="h-5 w-5 text-gray-300 mr-3 mt-0.5 flex-shrink-0" />
                    <span>Multi-photo AI scoring</span>
                  </li>
                  <li className="flex items-start text-gray-400">
                    <CheckCircle className="h-5 w-5 text-gray-300 mr-3 mt-0.5 flex-shrink-0" />
                    <span>Premium PDF report</span>
                  </li>
                </ul>
                
                <Button 
                  size="lg" 
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white"
                  onClick={() => navigate('/valuation')}
                >
                  Get Free Valuation
                </Button>
              </div>
            </div>
            
            {/* Premium Plan */}
            <div className="bg-gradient-to-br from-primary/5 to-white rounded-xl border border-primary/20 shadow-sm overflow-hidden relative transform transition hover:shadow-md hover:-translate-y-1">
              <div className="absolute top-0 right-0">
                <div className="bg-accent text-white px-4 py-1 text-sm font-medium">
                  RECOMMENDED
                </div>
              </div>
              
              <div className="p-6 md:p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Premium Valuation</h3>
                <p className="text-gray-600 mb-6">Professional-grade complete analysis</p>
                <p className="text-4xl font-bold text-gray-900 mb-6">$29.99</p>
                
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span>Advanced vehicle valuation</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span>Current market value</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span>Detailed valuation breakdown</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span>CARFAX® report ($44 value)</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span>Multi-photo AI scoring</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span>Premium PDF report</span>
                  </li>
                </ul>
                
                <Button 
                  size="lg" 
                  className="w-full bg-primary hover:bg-primary/90 text-white"
                  onClick={() => navigate('/premium')}
                >
                  Get Premium Valuation
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Explainer Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">Premium Features</h2>
            <p className="mt-4 text-xl text-gray-600">Unlock advanced tools with Premium</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* CARFAX */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <img 
                  src="/logos/carfax.png" 
                  alt="CARFAX" 
                  className="h-6" 
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">CARFAX® Report</h3>
              <p className="text-gray-600 mb-4">Access comprehensive vehicle history including accidents, service records, and ownership data.</p>
              <div className="text-primary font-medium">
                <span>$44 value included</span>
              </div>
            </div>
            
            {/* AI Photo Scoring */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                <Camera className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">AI Photo Scoring</h3>
              <p className="text-gray-600 mb-4">Upload photos of your vehicle for AI analysis to get a more accurate condition assessment.</p>
              <div className="text-primary font-medium">
                <span>Exclusive to Premium</span>
              </div>
            </div>
            
            {/* Dealer Offers */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Dealer Offers</h3>
              <p className="text-gray-600 mb-4">Receive purchase offers from certified dealers in your area without any obligation.</p>
              <div className="text-primary font-medium">
                <span>Exclusive to Premium</span>
              </div>
            </div>
            
            {/* 12-Month Forecast */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                <ArrowRight className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">12-Month Forecast</h3>
              <p className="text-gray-600 mb-4">View projected value changes over the next year to make informed decisions about selling timing.</p>
              <div className="text-primary font-medium">
                <span>Exclusive to Premium</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dealer CTA Section */}
      <section className="py-16 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="md:w-1/2 md:pr-10">
              <h2 className="text-3xl font-bold mb-4">For Dealerships</h2>
              <p className="text-xl text-gray-300 mb-6">Access powerful valuation tools, run bulk analyses, and connect with potential sellers.</p>
              <div className="flex flex-wrap gap-4">
                <Button 
                  size="lg" 
                  className="bg-white text-gray-900 hover:bg-gray-100"
                  onClick={() => navigate('/dealer/signup')}
                >
                  Run Bulk Valuations. Get More Leads.
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                >
                  View Dealer Tools
                </Button>
              </div>
            </div>
            <div className="mt-10 md:mt-0 md:w-1/2">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <h3 className="text-xl font-bold mb-4">Dealer Advantage Includes:</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-accent mr-3 mt-0.5 flex-shrink-0" />
                    <span>Bulk valuation tools for inventory management</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-accent mr-3 mt-0.5 flex-shrink-0" />
                    <span>Direct connections with motivated sellers</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-accent mr-3 mt-0.5 flex-shrink-0" />
                    <span>Real-time market data and competitive insights</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-accent mr-3 mt-0.5 flex-shrink-0" />
                    <span>Integration with your existing dealer systems</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Carousel */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">What Our Users Say</h2>
            <p className="mt-4 text-xl text-gray-600">Real experiences from Car Detective users</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Testimonial 1 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
              <div className="flex items-center mb-4">
                <div className="text-amber-400 flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-6 italic">
                "I got $3,200 more than the dealer initially offered by showing them my Car Detective premium report. Best $30 I ever spent!"
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-200 mr-3"></div>
                <div>
                  <h4 className="font-medium text-gray-900">Michael S.</h4>
                  <p className="text-sm text-gray-500">Toyota Highlander Owner</p>
                </div>
              </div>
            </div>
            
            {/* Testimonial 2 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
              <div className="flex items-center mb-4">
                <div className="text-amber-400 flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-6 italic">
                "The AI photo analysis caught details I didn't even notice about my car's condition. Super thorough and professional."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-200 mr-3"></div>
                <div>
                  <h4 className="font-medium text-gray-900">Jennifer L.</h4>
                  <p className="text-sm text-gray-500">BMW 3 Series Owner</p>
                </div>
              </div>
            </div>
            
            {/* Testimonial 3 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
              <div className="flex items-center mb-4">
                <div className="text-amber-400 flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 mb-6 italic">
                "I compared three different valuation tools and Car Detective was consistently the most accurate. Sold my car within $300 of their estimate."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-200 mr-3"></div>
                <div>
                  <h4 className="font-medium text-gray-900">Robert T.</h4>
                  <p className="text-sm text-gray-500">Honda Accord Owner</p>
                </div>
              </div>
            </div>
            
            {/* Testimonial 4 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition">
              <div className="flex items-center mb-4">
                <div className="text-amber-400 flex">
                  {[...Array(4)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                  <Star className="h-5 w-5 text-gray-300" />
                </div>
              </div>
              <p className="text-gray-600 mb-6 italic">
                "The premium report answered questions I didn't even know to ask. Getting dealer offers without giving my contact info to 20 places was fantastic."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-200 mr-3"></div>
                <div>
                  <h4 className="font-medium text-gray-900">Sarah K.</h4>
                  <p className="text-sm text-gray-500">Ford Explorer Owner</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Premium PDF Preview */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">Premium Report</h2>
            <p className="mt-4 text-xl text-gray-600">Professional-grade vehicle valuation report</p>
          </div>
          
          <div className="max-w-4xl mx-auto relative">
            <div className="aspect-[3/4] bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden relative">
              <div className="absolute inset-0 bg-gray-100/80 backdrop-blur-sm flex flex-col items-center justify-center">
                <div className="bg-white rounded-xl p-6 shadow-lg max-w-md">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Comprehensive PDF Report</h3>
                  <p className="text-gray-600 mb-6">
                    Get a detailed 10-page valuation report with complete market analysis, condition breakdown, and CARFAX® data.
                  </p>
                  <div className="flex items-center justify-center mb-6">
                    <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium flex items-center">
                      <LockIcon className="h-4 w-4 mr-2" />
                      Includes $44 CARFAX® report
                    </span>
                  </div>
                  <Button 
                    size="lg" 
                    className="w-full bg-primary hover:bg-primary/90 text-white"
                    onClick={() => navigate('/premium')}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Unlock Premium Report ($29.99)
                  </Button>
                </div>
              </div>
              <img 
                src="/placeholder.svg" 
                alt="Premium report preview" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Trust Logos Bar */}
      <section className="py-12 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div className="flex justify-center">
              <img 
                src="/logos/carfax.png" 
                alt="CARFAX" 
                className="h-8 opacity-70 hover:opacity-100 transition-opacity"
              />
            </div>
            <div className="flex justify-center">
              <img 
                src="/logos/stripe.png" 
                alt="Stripe" 
                className="h-8 opacity-70 hover:opacity-100 transition-opacity"
              />
            </div>
            <div className="flex justify-center">
              <img 
                src="/logos/military.png" 
                alt="Military Grade Encryption" 
                className="h-8 opacity-70 hover:opacity-100 transition-opacity"
              />
            </div>
          </div>
        </div>
      </section>
    </AppLayout>
  );
};

export default function HomePage() {
  return <EnhancedHomePage />;
}
