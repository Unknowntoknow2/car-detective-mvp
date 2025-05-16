
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, FileBarChart, Car, Building, Camera, FileText, Clock, ChartBar } from 'lucide-react';

export function EnhancedPremiumFeaturesTabs() {
  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Premium Features</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our premium valuation includes comprehensive tools and data to give you the most accurate 
            vehicle valuation possible.
          </p>
        </div>
        
        <Tabs defaultValue="carfax" className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto">
            <TabsTrigger value="carfax" className="py-3 px-2 text-xs md:text-sm">
              CARFAX®
            </TabsTrigger>
            <TabsTrigger value="market" className="py-3 px-2 text-xs md:text-sm">
              Market Data
            </TabsTrigger>
            <TabsTrigger value="dealers" className="py-3 px-2 text-xs md:text-sm">
              Dealer Offers
            </TabsTrigger>
            <TabsTrigger value="ai" className="py-3 px-2 text-xs md:text-sm">
              AI Analysis
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="carfax" className="mt-6 space-y-4">
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 p-3 rounded-lg flex-shrink-0">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-semibold">CARFAX® Vehicle History Report</h3>
                  <Badge className="bg-amber-100 text-amber-800">$44 Value</Badge>
                </div>
                <p className="text-gray-600 mb-4">
                  Get a complete vehicle history report that reveals accident history, service records, 
                  previous owners, title information, and more.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-2">Accident History</h4>
                      <p className="text-sm text-gray-600">
                        Detailed report of any reported accidents, damage, or airbag deployments.
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-2">Service Records</h4>
                      <p className="text-sm text-gray-600">
                        Comprehensive maintenance history from service centers across the country.
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-2">Title Information</h4>
                      <p className="text-sm text-gray-600">
                        Verify clean title status and check for salvage, flood, or other title issues.
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-2">Ownership History</h4>
                      <p className="text-sm text-gray-600">
                        See how many previous owners the vehicle has had and their locations.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="market" className="mt-6 space-y-4">
            <div className="flex items-start gap-4">
              <div className="bg-green-100 p-3 rounded-lg flex-shrink-0">
                <ChartBar className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Real-Time Market Analysis</h3>
                <p className="text-gray-600 mb-4">
                  Get comprehensive market data analysis showing how your vehicle compares to similar ones 
                  in your region and nationwide.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-2">Price Comparison</h4>
                      <p className="text-sm text-gray-600">
                        See how your vehicle compares to similar ones in your market.
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-2">Market Trends</h4>
                      <p className="text-sm text-gray-600">
                        Understand if prices are trending up or down for your vehicle type.
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-2">Days on Market</h4>
                      <p className="text-sm text-gray-600">
                        See how quickly similar vehicles are selling in your area.
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-2">Value Forecasting</h4>
                      <p className="text-sm text-gray-600">
                        Get 12-month prediction for your vehicle's future value.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="dealers" className="mt-6 space-y-4">
            <div className="flex items-start gap-4">
              <div className="bg-indigo-100 p-3 rounded-lg flex-shrink-0">
                <Building className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Competitive Dealer Offers</h3>
                <p className="text-gray-600 mb-4">
                  Connect with local dealers who can provide competitive offers for your vehicle. 
                  Compare offers and find the best deal.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-2">Multiple Dealer Quotes</h4>
                      <p className="text-sm text-gray-600">
                        Receive competitive offers from multiple dealers in your area.
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-2">No-Haggle Pricing</h4>
                      <p className="text-sm text-gray-600">
                        Get firm offers without having to negotiate at the dealership.
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-2">Trade-In Options</h4>
                      <p className="text-sm text-gray-600">
                        Explore trade-in opportunities with participating dealers.
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-2">Private Sale Comparison</h4>
                      <p className="text-sm text-gray-600">
                        Compare dealer offers to estimated private sale values.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="ai" className="mt-6 space-y-4">
            <div className="flex items-start gap-4">
              <div className="bg-purple-100 p-3 rounded-lg flex-shrink-0">
                <Camera className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">AI-Powered Analysis</h3>
                <p className="text-gray-600 mb-4">
                  Our advanced AI systems analyze photos, market data, and vehicle specifics to provide 
                  the most accurate valuation possible.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-2">Photo Condition Analysis</h4>
                      <p className="text-sm text-gray-600">
                        AI evaluates photos to assess vehicle condition more accurately.
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-2">Feature Recognition</h4>
                      <p className="text-sm text-gray-600">
                        AI identifies premium features that add value to your vehicle.
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-2">Predictive Modeling</h4>
                      <p className="text-sm text-gray-600">
                        Advanced algorithms predict market movements and value trends.
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-2">Comprehensive Report</h4>
                      <p className="text-sm text-gray-600">
                        Generate a detailed PDF report with all valuation factors explained.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
