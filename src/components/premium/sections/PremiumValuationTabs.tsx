
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Star, Zap, Shield, TrendingUp, FileText, Users, BarChart3 } from "lucide-react";

interface PremiumValuationTabsProps {
  onGetStarted: () => void;
}

export function PremiumValuationTabs({ onGetStarted }: PremiumValuationTabsProps) {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="w-full max-w-6xl mx-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="comparison">Compare</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-3xl mb-2">Premium Vehicle Valuation</CardTitle>
              <CardDescription className="text-lg">
                Get the most accurate vehicle valuation with our premium analytics suite
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
                  <Shield className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                  <h3 className="font-semibold mb-2">CARFAX® Included</h3>
                  <p className="text-sm text-muted-foreground">
                    Complete vehicle history report with accident data, service records, and title information
                  </p>
                </div>
                
                <div className="text-center p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
                  <TrendingUp className="h-12 w-12 mx-auto mb-4 text-green-600" />
                  <h3 className="font-semibold mb-2">Market Analysis</h3>
                  <p className="text-sm text-muted-foreground">
                    Real-time pricing data from thousands of listings and recent sales
                  </p>
                </div>
                
                <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 text-purple-600" />
                  <h3 className="font-semibold mb-2">Price Forecasting</h3>
                  <p className="text-sm text-muted-foreground">
                    12-month value predictions to help you time your sale perfectly
                  </p>
                </div>
              </div>
              
              <div className="text-center">
                <Button size="lg" onClick={onGetStarted} className="bg-gradient-to-r from-blue-600 to-purple-600">
                  <Zap className="mr-2 h-5 w-5" />
                  Get Started - $29.99
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="features" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: FileText,
                title: "Comprehensive Vehicle History",
                description: "Full CARFAX® report with accident history, service records, and ownership details",
                included: true
              },
              {
                icon: TrendingUp,
                title: "Market Price Analysis",
                description: "Real-time pricing data from multiple sources including dealerships and private sales",
                included: true
              },
              {
                icon: BarChart3,
                title: "12-Month Price Forecast",
                description: "AI-powered predictions showing how your vehicle's value will change over time",
                included: true
              },
              {
                icon: Users,
                title: "Dealer Network Access",
                description: "Connect with verified dealers who are actively looking for your vehicle",
                included: true
              },
              {
                icon: Shield,
                title: "Guaranteed Accuracy",
                description: "Our valuations are backed by extensive market data and machine learning",
                included: true
              },
              {
                icon: Star,
                title: "Priority Support",
                description: "Direct access to our valuation experts for personalized assistance",
                included: true
              }
            ].map((feature, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <feature.icon className="h-6 w-6 text-blue-600" />
                    {feature.title}
                    {feature.included && (
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Included
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="pricing" className="space-y-6">
          <Card className="max-w-md mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Premium Valuation</CardTitle>
              <div className="text-4xl font-bold text-blue-600">$29.99</div>
              <CardDescription>One-time payment • No subscription required</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {[
                  "Complete CARFAX® vehicle history report",
                  "Real-time market price analysis",
                  "12-month value forecasting",
                  "Dealer network access",
                  "Professional PDF valuation report",
                  "Priority customer support"
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
              
              <Button className="w-full" size="lg" onClick={onGetStarted}>
                Get Premium Valuation
              </Button>
              
              <p className="text-xs text-center text-muted-foreground">
                Secure payment processing • 30-day money-back guarantee
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="comparison" className="space-y-6">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">Feature</th>
                  <th className="text-center p-4">Free Valuation</th>
                  <th className="text-center p-4 bg-blue-50">Premium Valuation</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: "Basic vehicle information", free: true, premium: true },
                  { feature: "Estimated market value", free: true, premium: true },
                  { feature: "CARFAX® vehicle history", free: false, premium: true },
                  { feature: "Market price analysis", free: false, premium: true },
                  { feature: "12-month forecasting", free: false, premium: true },
                  { feature: "Dealer network access", free: false, premium: true },
                  { feature: "PDF report download", free: false, premium: true },
                  { feature: "Priority support", free: false, premium: true }
                ].map((row, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-4">{row.feature}</td>
                    <td className="text-center p-4">
                      {row.free ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="text-center p-4 bg-blue-50">
                      {row.premium ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="text-center">
            <Button size="lg" onClick={onGetStarted}>
              Upgrade to Premium - $29.99
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
