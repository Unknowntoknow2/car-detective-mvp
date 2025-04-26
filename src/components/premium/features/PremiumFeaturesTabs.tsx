
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { 
  FileText, 
  Camera, 
  Store, 
  ChartBar, 
  Calendar,
  FileBarChart,
  MapPin,
  FileImage,
  Check,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    id: "carfax",
    title: "Full CARFAX® Report",
    icon: FileText,
    badge: "$44 Value",
    color: "blue",
    description: "Complete vehicle history with accident records, service history, and title verification",
    benefits: [
      "Uncover accident history and severity",
      "View complete service records",
      "Verify title status and ownership history",
      "Check reported mileage accuracy",
      "Identify fleet/commercial use"
    ]
  },
  {
    id: "photo",
    title: "AI Photo Analysis",
    icon: Camera,
    badge: "+15% Accuracy",
    color: "green",
    description: "Upload up to 5 photos for AI to analyze condition, damage, and wear patterns",
    benefits: [
      "Detect visible damage and wear",
      "Assess paint condition and body panels",
      "Identify interior wear patterns",
      "Compare to similar vehicles",
      "Generate condition score"
    ]
  },
  {
    id: "dealers",
    title: "Dealer-Beat Offers",
    icon: Store,
    badge: "Increased Offers",
    color: "orange",
    description: "Compare offers from CarMax, Carvana, and local dealers who compete for your business",
    benefits: [
      "Get multiple dealer offers instantly",
      "Compare against major buyers",
      "Leverage competing offers",
      "Access dealer-only pricing",
      "Skip dealership visits"
    ]
  },
  {
    id: "market",
    title: "Open Marketplace Data",
    icon: ChartBar,
    badge: "Real-time Data",
    color: "purple",
    description: "See average prices on Facebook, Craigslist, and other platforms in your area",
    benefits: [
      "Track private party listings",
      "Monitor price trends",
      "Compare across platforms",
      "Identify best marketplaces",
      "Get real-time updates"
    ]
  },
  {
    id: "forecast",
    title: "12-Month Forecast",
    icon: Calendar,
    badge: "Strategic Timing",
    color: "indigo",
    description: "Predictive analysis of your vehicle's value over the next year with optimal selling time",
    benefits: [
      "Predict value changes",
      "Identify best selling time",
      "Account for seasonal trends",
      "Plan ahead for sales",
      "Maximize return"
    ]
  },
  {
    id: "calculator",
    title: "Feature Value Calculator",
    icon: FileBarChart,
    badge: "+20% Granularity",
    color: "rose",
    description: "See exactly how much each option and feature adds to your vehicle's worth",
    benefits: [
      "Calculate feature premiums",
      "Compare trim levels",
      "Assess upgrade value",
      "Optimize modifications",
      "Understand market preferences"
    ]
  },
  {
    id: "zip",
    title: "ZIP Market Analysis",
    icon: MapPin,
    badge: "Localized Accuracy",
    color: "cyan",
    description: "Location-adjusted valuation based on supply and demand in your specific region",
    benefits: [
      "Get location-specific pricing",
      "See local market demand",
      "Compare regional differences",
      "Track inventory levels",
      "Access demographic data"
    ]
  },
  {
    id: "report",
    title: "Professional PDF Report",
    icon: FileImage,
    badge: "Shareable Report",
    color: "amber",
    description: "Comprehensive, shareable report with all insights and data in a professional format",
    benefits: [
      "Generate professional reports",
      "Include all analytics",
      "Share with potential buyers",
      "Export data easily",
      "Access historical reports"
    ]
  }
];

const getColorClass = (color: string) => {
  const colorMap: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    green: "bg-green-50 text-green-600 border-green-100",
    orange: "bg-orange-50 text-orange-500 border-orange-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
    rose: "bg-rose-50 text-rose-600 border-rose-100",
    cyan: "bg-cyan-50 text-cyan-600 border-cyan-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100"
  };
  return colorMap[color] || "bg-slate-50 text-slate-600 border-slate-100";
};

export function PremiumFeaturesTabs() {
  return (
    <div className="py-24 bg-white">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl mb-4">
            Premium Features
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Discover how our premium features provide the most comprehensive vehicle valuation available
          </p>
        </div>

        <Tabs defaultValue="carfax" className="w-full">
          <TabsList className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 w-full h-auto p-1 bg-slate-100 rounded-lg gap-1">
            {features.map((feature) => (
              <TabsTrigger
                key={feature.id}
                value={feature.id}
                className="flex flex-col items-center gap-2 p-3 data-[state=active]:bg-white rounded-md transition-all"
              >
                <feature.icon className="h-5 w-5" />
                <span className="text-xs font-medium text-center line-clamp-2">
                  {feature.title}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>

          {features.map((feature) => (
            <TabsContent key={feature.id} value={feature.id}>
              <Card className="mt-6 p-6 border-slate-200">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${getColorClass(feature.color)} border`}>
                        <feature.icon className="h-8 w-8" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-2xl font-bold text-slate-900">{feature.title}</h3>
                          <Badge variant="outline" className={getColorClass(feature.color)}>
                            {feature.badge}
                          </Badge>
                        </div>
                        <p className="text-slate-600">{feature.description}</p>
                      </div>
                    </div>

                    <Button className="w-full sm:w-auto">
                      Try Premium Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg text-slate-900">Key Benefits</h4>
                    <ul className="space-y-3">
                      {feature.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-slate-600">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
