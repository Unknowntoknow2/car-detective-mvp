
import { Card, CardContent } from "@/components/ui/card";
import { ChartBar, Shield, Camera, Car, Database } from "lucide-react";

export function KeyFeatures() {
  const features = [
    {
      icon: <ChartBar className="h-6 w-6 text-primary" />,
      title: "Real-Time Market Data",
      description: "Get accurate valuations based on up-to-the-minute market trends and sales data."
    },
    {
      icon: <Shield className="h-6 w-6 text-primary" />,
      title: "CARFAX Included",
      description: "Premium valuations include a complete CARFAX report ($44 value)."
    },
    {
      icon: <Camera className="h-6 w-6 text-primary" />,
      title: "AI Photo Scoring",
      description: "Upload photos for AI condition analysis and more accurate valuations."
    },
    {
      icon: <Car className="h-6 w-6 text-primary" />,
      title: "Dealer Offers",
      description: "Receive and compare offers from multiple dealers in your area."
    },
    {
      icon: <Database className="h-6 w-6 text-primary" />,
      title: "12-Month Value Forecast",
      description: "See how your vehicle's value may change over the next year."
    }
  ];

  return (
    <section className="py-16 bg-surface">
      <div className="container mx-auto max-w-6xl px-4">
        <h2 className="text-3xl font-semibold text-center mb-12">Key Features</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="bg-white border border-border hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-medium text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-text-secondary">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
