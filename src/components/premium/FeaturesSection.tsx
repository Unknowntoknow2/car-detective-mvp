
import { Card, CardContent } from "@/components/ui/card";
import { 
  FileText, 
  Car, 
  ChartBar, 
  Shield, 
  FileBarChart, 
  Camera, 
  Store, 
  Calendar
} from "lucide-react";

interface FeaturesSectionProps {
  featuresRef: React.RefObject<HTMLDivElement>;
}

export function FeaturesSection({ featuresRef }: FeaturesSectionProps) {
  const features = [
    {
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "Full CARFAX® Report",
      description: "Complete vehicle history with accident records, service history, and title verification",
      metric: "$44 Value",
      color: "blue"
    },
    {
      icon: <Camera className="h-8 w-8 text-green-600" />,
      title: "AI Photo Analysis",
      description: "Upload up to 5 photos for AI to analyze condition, damage, and wear patterns",
      metric: "+15% Accuracy",
      color: "green"
    },
    {
      icon: <Store className="h-8 w-8 text-orange-500" />,
      title: "Dealer-Beat Offers",
      description: "Compare offers from CarMax, Carvana, and local dealers who compete for your business",
      metric: "Increased Offers",
      color: "orange"
    },
    {
      icon: <ChartBar className="h-8 w-8 text-purple-600" />,
      title: "Open Marketplace Data",
      description: "See average prices on Facebook, Craigslist, and other platforms in your area",
      metric: "Real-time Data",
      color: "purple"
    },
    {
      icon: <Calendar className="h-8 w-8 text-indigo-600" />,
      title: "12-Month Forecast",
      description: "Predictive analysis of your vehicle's value over the next year with optimal selling time",
      metric: "Strategic Timing",
      color: "indigo"
    },
    {
      icon: <FileBarChart className="h-8 w-8 text-rose-600" />,
      title: "Feature Value Calculator",
      description: "See exactly how much each option and feature adds to your vehicle's worth",
      metric: "+20% Granularity",
      color: "rose"
    },
    {
      icon: <Car className="h-8 w-8 text-cyan-600" />,
      title: "ZIP Market Analysis",
      description: "Location-adjusted valuation based on supply and demand in your specific region",
      metric: "Localized Accuracy",
      color: "cyan"
    },
    {
      icon: <FileText className="h-8 w-8 text-amber-600" />,
      title: "Professional PDF Report",
      description: "Comprehensive, shareable report with all insights and data in a professional format",
      metric: "Shareable Report",
      color: "amber"
    }
  ];

  const getColorClass = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: "bg-blue-50 text-primary border-blue-100",
      green: "bg-green-50 text-green-600 border-green-100",
      orange: "bg-orange-50 text-orange-500 border-orange-100",
      purple: "bg-purple-50 text-purple-600 border-purple-100",
      indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
      rose: "bg-rose-50 text-rose-600 border-rose-100",
      cyan: "bg-cyan-50 text-cyan-600 border-cyan-100",
      amber: "bg-amber-50 text-amber-600 border-amber-100"
    };
    return colorMap[color] || "bg-primary/10 text-primary";
  };
  
  return (
    <section ref={featuresRef} className="py-24 px-4 bg-white">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900">
            Premium Valuation Features
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Our premium valuation service combines multiple data sources, AI analysis, and market intelligence 
            to deliver the most accurate and comprehensive vehicle valuation available.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="overflow-hidden hover:shadow-lg transition-shadow border-slate-200 bg-white"
            >
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${getColorClass(feature.color)} border`}>
                    {feature.icon}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-slate-900">{feature.title}</h3>
                    </div>
                    <p className="text-sm text-slate-600">{feature.description}</p>
                  </div>
                </div>
                <div className="pt-2">
                  <span className="inline-block py-1 px-3 bg-slate-100 text-xs font-medium rounded-full text-slate-800">
                    {feature.metric}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
