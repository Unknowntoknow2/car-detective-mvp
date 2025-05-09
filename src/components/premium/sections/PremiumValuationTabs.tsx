
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { AnimatedButton } from '@/components/ui/animated-button';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Zap, Check, Car, DollarSign, BarChart, FileText } from 'lucide-react';
import { getFeatureAdjustments } from '@/utils/adjustments/features';

export function PremiumValuationTabs() {
  const [activeTab, setActiveTab] = useState('value-calculator');
  const [basePrice, setBasePrice] = useState(25000);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [mileage, setMileage] = useState(50000);
  const [calculationDone, setCalculationDone] = useState(false);

  const featuresList = [
    { id: 'leather_seats', name: 'Leather Seats' },
    { id: 'navigation', name: 'Navigation System' },
    { id: 'premium_audio', name: 'Premium Audio' },
    { id: 'panoramic_roof', name: 'Panoramic Sunroof' },
    { id: 'heated_seats', name: 'Heated Seats' },
  ];
  
  const toggleFeature = (featureId: string) => {
    setSelectedFeatures(prev => 
      prev.includes(featureId) 
        ? prev.filter(id => id !== featureId) 
        : [...prev, featureId]
    );
    setCalculationDone(false);
  };
  
  const handleCalculate = () => {
    setCalculationDone(true);
  };
  
  // Get feature adjustments based on selected features
  const featureAdjustments = getFeatureAdjustments({ features: selectedFeatures, basePrice });
  const totalValue = basePrice + featureAdjustments.totalAdjustment;
  
  const mileageAdjustment = Math.round((100000 - mileage) * 0.00002 * basePrice);
  const finalValue = totalValue + mileageAdjustment;

  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full max-w-6xl mx-auto px-4">
      <TabsList className="grid w-full grid-cols-3 mb-8">
        <TabsTrigger value="value-calculator" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white py-3">
          <Car className="mr-2 h-4 w-4" />
          Feature Calculator
        </TabsTrigger>
        <TabsTrigger value="dealer-offers" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white py-3">
          <DollarSign className="mr-2 h-4 w-4" />
          Dealer Offers
        </TabsTrigger>
        <TabsTrigger value="market-forecast" className="data-[state=active]:bg-indigo-600 data-[state=active]:text-white py-3">
          <BarChart className="mr-2 h-4 w-4" />
          Value Forecast
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="value-calculator">
        <motion.div
          variants={tabVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <AnimatedCard className="md:col-span-2">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">Feature Value Calculator</h3>
              <p className="text-slate-600 mb-6">
                Select your vehicle features to see how they impact the overall value.
              </p>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Base Price</label>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-medium">$</span>
                    <Input
                      type="number"
                      value={basePrice}
                      onChange={(e) => {
                        setBasePrice(Number(e.target.value));
                        setCalculationDone(false);
                      }}
                      className="w-full"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Mileage</label>
                  <div className="space-y-2">
                    <Slider
                      value={[mileage]}
                      min={0}
                      max={200000}
                      step={1000}
                      trackClassName="bg-slate-200"
                      rangeClassName="bg-indigo-600"
                      onValueChange={(value) => {
                        setMileage(value[0]);
                        setCalculationDone(false);
                      }}
                    />
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>0 miles</span>
                      <span>{mileage.toLocaleString()} miles</span>
                      <span>200,000 miles</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Features</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {featuresList.map((feature) => (
                      <motion.div
                        key={feature.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div
                          className={`border rounded-md p-3 cursor-pointer transition-colors ${
                            selectedFeatures.includes(feature.id)
                              ? 'bg-indigo-50 border-indigo-300'
                              : 'hover:bg-slate-50'
                          }`}
                          onClick={() => toggleFeature(feature.id)}
                        >
                          <div className="flex items-center justify-between">
                            <span>{feature.name}</span>
                            {selectedFeatures.includes(feature.id) && (
                              <Check className="h-4 w-4 text-indigo-600" />
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
                
                <AnimatedButton 
                  onClick={handleCalculate}
                  className="w-full"
                  scaleOnHover
                >
                  <Zap className="mr-2 h-4 w-4" />
                  Calculate Value
                </AnimatedButton>
              </div>
            </CardContent>
          </AnimatedCard>
          
          <AnimatedCard delay={0.3}>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">Value Breakdown</h3>
              
              {calculationDone ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-6">
                    <p className="text-sm text-slate-500">Estimated Value</p>
                    <p className="text-4xl font-bold text-indigo-600">
                      ${finalValue.toLocaleString()}
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span>Base Price</span>
                      <span className="font-medium">${basePrice.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span>Mileage Adjustment</span>
                      <span className={`font-medium ${mileageAdjustment >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {mileageAdjustment >= 0 ? '+' : ''}{mileageAdjustment.toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span>Features Value</span>
                      <span className="font-medium text-green-600">
                        +${Math.round(featureAdjustments.totalAdjustment).toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="pt-2 border-t">
                      <div className="flex justify-between font-medium">
                        <span>Total Value</span>
                        <span className="text-indigo-600">${finalValue.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <AnimatedButton 
                      variant="outline" 
                      className="w-full"
                      iconAnimation="pulse"
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Get Full Premium Report
                    </AnimatedButton>
                  </div>
                </motion.div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
                  <BarChart className="h-12 w-12 mb-4 text-slate-300" />
                  <p>Configure your vehicle and click "Calculate Value" to see the detailed breakdown.</p>
                </div>
              )}
            </CardContent>
          </AnimatedCard>
        </motion.div>
      </TabsContent>
      
      <TabsContent value="dealer-offers">
        <motion.div
          variants={tabVariants}
          initial="hidden"
          animate="visible"
          className="text-center py-12"
        >
          <BarChart className="h-16 w-16 mx-auto mb-4 text-indigo-200" />
          <h3 className="text-xl font-medium mb-2">Compare Dealer Offers</h3>
          <p className="text-slate-600 max-w-md mx-auto mb-6">
            Upgrade to premium to see what dealers in your area are willing to pay for your vehicle.
          </p>
          <AnimatedButton 
            className="mt-4" 
            scaleOnHover
            pulseOnHover
          >
            <Zap className="mr-2 h-4 w-4" />
            Unlock Premium Features
          </AnimatedButton>
        </motion.div>
      </TabsContent>
      
      <TabsContent value="market-forecast">
        <motion.div
          variants={tabVariants}
          initial="hidden"
          animate="visible"
          className="text-center py-12"
        >
          <BarChart className="h-16 w-16 mx-auto mb-4 text-indigo-200" />
          <h3 className="text-xl font-medium mb-2">12-Month Value Forecast</h3>
          <p className="text-slate-600 max-w-md mx-auto mb-6">
            Upgrade to premium to see how your vehicle's value will change over the next 12 months.
          </p>
          <AnimatedButton 
            className="mt-4" 
            scaleOnHover
            pulseOnHover
          >
            <Zap className="mr-2 h-4 w-4" />
            Unlock Premium Features
          </AnimatedButton>
        </motion.div>
      </TabsContent>
    </Tabs>
  );
}
