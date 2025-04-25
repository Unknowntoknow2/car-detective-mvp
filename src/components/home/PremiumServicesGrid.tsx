
import { 
  Shield, FileText, Car, ChartBar, FileBarChart, FileClock, Camera, Building, Search
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/design-system";

interface ServiceItem {
  icon: JSX.Element;
  title: string;
  impact: string;
  isPremium: boolean;
}

export function PremiumServicesGrid() {
  const services: ServiceItem[] = [
    {
      icon: <Car className="h-5 w-5 text-primary" />,
      title: "VIN/Plate/Manual Lookup",
      impact: "Base Service",
      isPremium: false
    },
    {
      icon: <Camera className="h-5 w-5 text-green-600" />,
      title: "Multi-Photo AI Scoring",
      impact: "+15% Accuracy",
      isPremium: true
    },
    {
      icon: <Building className="h-5 w-5 text-orange-500" />,
      title: "Dealer-Beat Offers",
      impact: "Compare & Save",
      isPremium: true
    },
    {
      icon: <Shield className="h-5 w-5 text-primary" />,
      title: "Full CARFAX® Report",
      impact: "Valued at $44",
      isPremium: true
    },
    {
      icon: <FileBarChart className="h-5 w-5 text-purple-600" />,
      title: "Feature-Based Adjustments",
      impact: "+20% Granularity",
      isPremium: true
    },
    {
      icon: <FileClock className="h-5 w-5 text-indigo-600" />,
      title: "12-Month Value Forecast",
      impact: "Trends & Stats",
      isPremium: true
    },
    {
      icon: <Search className="h-5 w-5 text-cyan-600" />,
      title: "Open Marketplace Analysis",
      impact: "Facebook, Craigslist, etc.",
      isPremium: true
    },
    {
      icon: <FileText className="h-5 w-5 text-amber-600" />,
      title: "Professional PDF Report",
      impact: "Shareable Summary",
      isPremium: true
    }
  ];

  return (
    <section className="py-16 bg-surface">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="Premium Valuation Services"
          description="Comprehensive tools and data to get the most accurate and complete picture of your vehicle's value"
          className="text-center mb-12"
        />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {services.map((service, index) => (
            <Card 
              key={index} 
              className={`p-0 hover:shadow-md transition-shadow ${
                service.isPremium ? 'border-primary/20 bg-primary/5' : 'border-border bg-background'
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${service.isPremium ? 'bg-white/80' : 'bg-primary/10'}`}>
                    {service.icon}
                  </div>
                  <div className="flex-grow">
                    <span className="font-medium text-sm">{service.title}</span>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs text-text-secondary">{service.impact}</span>
                      {service.isPremium && (
                        <span className="text-[10px] font-medium bg-primary/20 text-primary px-1.5 py-0.5 rounded-full">
                          PREMIUM
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
