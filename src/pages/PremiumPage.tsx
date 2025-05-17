
import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PremiumFeaturesTabs } from '@/components/premium/features/PremiumFeaturesTabs';
import { PremiumFeaturesGrid } from '@/components/premium/features/PremiumFeaturesGrid';
import { PremiumCard } from '@/components/premium/PremiumCard';
import { PremiumConditionSection } from '@/components/premium/sections/PremiumConditionSection';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { CarfaxBadge } from '@/components/premium/hero/CarfaxBadge';
import { PriceDisplay } from '@/components/premium/hero/PriceDisplay';
import { FeatureCards } from '@/components/premium/hero/FeatureCards';
import { FileText, Car, Gauge, Shield, BarChart } from 'lucide-react';

export default function PremiumPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedFeature, setSelectedFeature] = useState('');
  
  // Premium features data
  const premiumFeatures = [
    {
      id: 'history-report',
      title: 'Full Vehicle History',
      description: 'Complete CARFAX® history report with accident records, service history, and ownership details.',
      icon: '📋',
      categories: ['all', 'history']
    },
    {
      id: 'market-analysis',
      title: 'Market Analysis',
      description: 'Get detailed market analysis with price trends and future value projections.',
      icon: '📈',
      categories: ['all', 'market']
    },
    {
      id: 'condition-rating',
      title: 'Detailed Condition Rating',
      description: 'Evaluate your vehicle condition across multiple categories for more precise valuation.',
      icon: '⭐',
      categories: ['all', 'verification']
    },
    {
      id: 'dealer-offers',
      title: 'Dealer Offers',
      description: 'See what dealers in your area would pay for your vehicle.',
      icon: '💰',
      categories: ['all', 'market']
    },
    {
      id: 'title-check',
      title: 'Title Verification',
      description: 'Verify the vehicle title status and check for any liens or issues.',
      icon: '🔍',
      categories: ['all', 'verification', 'history']
    },
    {
      id: 'ownership-cost',
      title: 'Ownership Cost Analysis',
      description: 'Detailed breakdown of anticipated ownership costs including maintenance, insurance, and depreciation.',
      icon: '💵',
      categories: ['all', 'report']
    },
    {
      id: 'premium-report',
      title: 'Premium PDF Report',
      description: 'Downloadable and printable comprehensive PDF report with all valuation details.',
      icon: '📑',
      categories: ['all', 'report']
    },
    {
      id: 'forecast',
      title: 'Value Forecast',
      description: '12-month value projection to help you time your sale or purchase.',
      icon: '🔮',
      categories: ['all', 'market']
    }
  ];

  // Filter features based on active category
  const filteredFeatures = premiumFeatures.filter(feature => 
    feature.categories.includes(activeCategory)
  );

  // Handle condition save
  const handleSaveCondition = (values: Record<string, number>) => {
    console.log('Condition values:', values);
    
    // Calculate overall condition
    const overallScore = Object.values(values).reduce((sum, val) => sum + val, 0) / Object.keys(values).length;
    
    // Store in localStorage for demonstration
    localStorage.setItem('premium_condition_values', JSON.stringify(values));
    localStorage.setItem('premium_condition_score', overallScore.toString());
    
    toast.success('Condition assessment saved successfully');
  };

  return (
    <div>
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="bg-slate-50 py-12 md:py-20 border-b">
          <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <CarfaxBadge />
              <PriceDisplay />
              <div className="flex flex-col sm:flex-row gap-4 mt-2">
                <Button size="lg" className="gap-2">
                  <FileText className="h-5 w-5" />
                  Get Premium Report
                </Button>
                <Button variant="outline" size="lg">
                  Learn More
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="absolute w-72 h-72 rounded-full bg-primary/10 -right-20 -top-10 filter blur-3xl"></div>
              <div className="relative">
                <PremiumCard />
              </div>
            </div>
          </div>
        </section>

        {/* Feature Cards */}
        <section className="container mx-auto py-16 px-4">
          <div className="max-w-3xl mx-auto mb-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Premium Features</h2>
            <p className="text-xl text-gray-600">
              Get comprehensive insights with our premium vehicle valuation
            </p>
          </div>
          <FeatureCards />
        </section>

        {/* Tabs Section */}
        <section className="bg-gray-50 py-16 border-y">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-8 text-center">
                Explore Premium Vehicle Data
              </h2>
              
              <Tabs defaultValue="features" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-8">
                  <TabsTrigger value="features">Premium Features</TabsTrigger>
                  <TabsTrigger value="condition">Condition Assessment</TabsTrigger>
                  <TabsTrigger value="compare">Free vs Premium</TabsTrigger>
                </TabsList>
                
                <TabsContent value="features" className="space-y-6">
                  <div className="mb-6">
                    <PremiumFeaturesTabs
                      activeCategory={activeCategory}
                      onCategoryChange={setActiveCategory}
                    />
                  </div>
                  
                  <PremiumFeaturesGrid
                    features={filteredFeatures}
                    selectedFeature={selectedFeature}
                    onSelectFeature={setSelectedFeature}
                  />
                </TabsContent>
                
                <TabsContent value="condition">
                  <PremiumConditionSection onSaveCondition={handleSaveCondition} />
                </TabsContent>
                
                <TabsContent value="compare">
                  <Card>
                    <CardHeader>
                      <CardTitle>Free vs Premium Comparison</CardTitle>
                      <CardDescription>
                        See what additional features and benefits you get with our premium valuation
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-1"></div>
                        <div className="text-center font-medium">Free</div>
                        <div className="text-center font-medium text-primary">Premium</div>
                        
                        {/* Feature rows */}
                        <div className="col-span-1 py-2 font-medium">Basic Valuation</div>
                        <div className="text-center py-2">✓</div>
                        <div className="text-center py-2">✓</div>
                        
                        <div className="col-span-1 py-2 font-medium">Vehicle History</div>
                        <div className="text-center py-2">Basic</div>
                        <div className="text-center py-2 text-primary">CARFAX® Full Report</div>
                        
                        <div className="col-span-1 py-2 font-medium">Condition Assessment</div>
                        <div className="text-center py-2">Basic</div>
                        <div className="text-center py-2 text-primary">Detailed (4 categories)</div>
                        
                        <div className="col-span-1 py-2 font-medium">Market Analysis</div>
                        <div className="text-center py-2">Limited</div>
                        <div className="text-center py-2 text-primary">Comprehensive</div>
                        
                        <div className="col-span-1 py-2 font-medium">Value Forecast</div>
                        <div className="text-center py-2">—</div>
                        <div className="text-center py-2 text-primary">12-month Projection</div>
                        
                        <div className="col-span-1 py-2 font-medium">Dealer Network</div>
                        <div className="text-center py-2">—</div>
                        <div className="text-center py-2 text-primary">Included</div>

                        <div className="col-span-1 py-2 font-medium">PDF Report</div>
                        <div className="text-center py-2">—</div>
                        <div className="text-center py-2 text-primary">Included</div>
                      </div>
                      
                      <div className="mt-6 border-t pt-6">
                        <Button className="w-full">Upgrade to Premium</Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>

        {/* VIN Lookup Section */}
        <section className="container mx-auto py-16 px-4">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">Start Your Premium Valuation</h2>
            <p className="text-xl text-gray-600">
              Enter your vehicle information to get a comprehensive valuation report
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Vehicle Lookup</CardTitle>
                <CardDescription>
                  Enter your VIN, license plate, or vehicle details to get started
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="vin" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 mb-6">
                    <TabsTrigger value="vin" className="flex items-center gap-2">
                      <Car className="h-4 w-4" />
                      VIN
                    </TabsTrigger>
                    <TabsTrigger value="plate" className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      License Plate
                    </TabsTrigger>
                    <TabsTrigger value="manual" className="flex items-center gap-2">
                      <Gauge className="h-4 w-4" />
                      Manual Entry
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="vin">
                    <div className="space-y-4">
                      <div className="grid w-full items-center gap-2">
                        <label htmlFor="vin" className="text-sm font-medium">
                          Vehicle Identification Number (VIN)
                        </label>
                        <input
                          id="vin"
                          type="text"
                          placeholder="Enter 17-character VIN"
                          className="w-full px-3 py-2 border rounded-md"
                        />
                        <p className="text-xs text-muted-foreground">
                          Your VIN can be found on your registration, insurance card, or driver's side dashboard
                        </p>
                      </div>
                      <Button className="w-full">Look Up Vehicle</Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="plate">
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-2">
                          <label htmlFor="plate" className="text-sm font-medium">
                            License Plate
                          </label>
                          <input
                            id="plate"
                            type="text"
                            placeholder="Enter license plate"
                            className="w-full px-3 py-2 border rounded-md mt-1"
                          />
                        </div>
                        <div>
                          <label htmlFor="state" className="text-sm font-medium">
                            State
                          </label>
                          <select 
                            id="state" 
                            className="w-full px-3 py-2 border rounded-md mt-1"
                          >
                            <option value="">Select State</option>
                            <option value="CA">California</option>
                            <option value="NY">New York</option>
                            <option value="TX">Texas</option>
                            <option value="FL">Florida</option>
                          </select>
                        </div>
                      </div>
                      <Button className="w-full">Look Up Vehicle</Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="manual">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="make" className="text-sm font-medium">
                            Make
                          </label>
                          <input
                            id="make"
                            type="text"
                            placeholder="e.g., Toyota"
                            className="w-full px-3 py-2 border rounded-md mt-1"
                          />
                        </div>
                        <div>
                          <label htmlFor="model" className="text-sm font-medium">
                            Model
                          </label>
                          <input
                            id="model"
                            type="text"
                            placeholder="e.g., Camry"
                            className="w-full px-3 py-2 border rounded-md mt-1"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="year" className="text-sm font-medium">
                            Year
                          </label>
                          <input
                            id="year"
                            type="number"
                            placeholder="e.g., 2019"
                            className="w-full px-3 py-2 border rounded-md mt-1"
                          />
                        </div>
                        <div>
                          <label htmlFor="mileage" className="text-sm font-medium">
                            Mileage
                          </label>
                          <input
                            id="mileage"
                            type="number"
                            placeholder="e.g., 45000"
                            className="w-full px-3 py-2 border rounded-md mt-1"
                          />
                        </div>
                      </div>
                      <Button className="w-full">Get Premium Valuation</Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
