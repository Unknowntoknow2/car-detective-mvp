
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { TabsUnderlined, TabsListUnderlined, TabsTriggerUnderlined, TabsContent } from "@/components/ui/tabs-improved";
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  BarChart3, 
  Car, 
  FileText, 
  Camera, 
  Store, 
  LineChart 
} from 'lucide-react';

const features = [
  {
    id: "real-time",
    title: "Real-Time Market Data",
    description: "Get accurate valuations based on up-to-the-minute market trends and sales data.",
    icon: <BarChart3 className="h-6 w-6" />,
    cta: "Try Our Valuation",
    ctaLink: "/valuation"
  },
  {
    id: "carfax",
    title: "CARFAX Included",
    description: "Premium valuations include a complete CARFAX report ($44 value).",
    icon: <FileText className="h-6 w-6" />,
    cta: "Get Premium Valuation",
    ctaLink: "/premium"
  },
  {
    id: "photo",
    title: "AI Photo Scoring",
    description: "Upload photos for AI condition analysis and more accurate valuations.",
    icon: <Camera className="h-6 w-6" />,
    cta: "Try Photo Analysis",
    ctaLink: "/premium"
  },
  {
    id: "dealers",
    title: "Dealer Offers",
    description: "Receive and compare offers from multiple dealers in your area.",
    icon: <Store className="h-6 w-6" />,
    cta: "Connect With Dealers",
    ctaLink: "/premium"
  },
  {
    id: "forecast",
    title: "12-Month Value Forecast",
    description: "See how your vehicle's value may change over the next year.",
    icon: <LineChart className="h-6 w-6" />,
    cta: "See Price Prediction",
    ctaLink: "/premium"
  }
];

export function KeyFeatures() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(features[0].id);

  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Key Features</h2>
        
        <Card className="border-none shadow-lg">
          <TabsUnderlined 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="max-w-5xl mx-auto"
          >
            <TabsListUnderlined className="grid grid-cols-2 md:grid-cols-5 border-b border-gray-200">
              {features.map((feature) => (
                <TabsTriggerUnderlined 
                  key={feature.id} 
                  value={feature.id}
                  className="py-3 text-sm"
                >
                  <span className="hidden md:inline">{feature.title}</span>
                  <span className="md:hidden flex flex-col items-center">
                    {feature.icon}
                    <span className="mt-1 text-xs">{feature.title.split(' ')[0]}</span>
                  </span>
                </TabsTriggerUnderlined>
              ))}
            </TabsListUnderlined>
            
            {features.map((feature) => (
              <TabsContent 
                key={feature.id} 
                value={feature.id}
                className="pt-6 pb-8 px-4"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  <div className="md:w-1/4 flex justify-center">
                    <div className="p-6 bg-primary/10 rounded-full text-primary">
                      {feature.icon}
                    </div>
                  </div>
                  <div className="md:w-3/4 space-y-4">
                    <h3 className="text-xl font-bold">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                    <Button 
                      onClick={() => navigate(feature.ctaLink)}
                      className="mt-4"
                    >
                      {feature.cta}
                    </Button>
                  </div>
                </div>
              </TabsContent>
            ))}
          </TabsUnderlined>
        </Card>
      </div>
    </section>
  );
}

export default KeyFeatures;
