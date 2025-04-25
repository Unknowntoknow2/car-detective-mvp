
import { 
  Camera, FileText, Car, ChartBar, Shield, 
  FileBarChart, FileClock 
} from "lucide-react";
import { Card } from "@/components/ui/card";

interface ServiceItem {
  icon: JSX.Element;
  title: string;
  impact: string;
}

const services: ServiceItem[] = [
  {
    icon: <Car className="h-5 w-5 text-primary" />,
    title: "VIN/Plate/Manual Lookup",
    impact: "Base Service"
  },
  {
    icon: <Camera className="h-5 w-5 text-primary" />,
    title: "AI Photo Scoring",
    impact: "+15% Accuracy"
  },
  {
    icon: <ChartBar className="h-5 w-5 text-primary" />,
    title: "Real-Time Market Offers",
    impact: "Included"
  },
  {
    icon: <Shield className="h-5 w-5 text-primary" />,
    title: "CARFAX Report",
    impact: "Valued at $44"
  },
  {
    icon: <FileBarChart className="h-5 w-5 text-primary" />,
    title: "Feature-Based Adjustments",
    impact: "+20% Granularity"
  },
  {
    icon: <FileClock className="h-5 w-5 text-primary" />,
    title: "12-Month Value Forecast",
    impact: "Trends & Stats"
  },
  {
    icon: <FileText className="h-5 w-5 text-primary" />,
    title: "Professional PDF Report",
    impact: "Shareable Summary"
  }
];

export function PremiumServicesGrid() {
  return (
    <section className="py-16 bg-surface">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-semibold text-center mb-10">
          Premium Valuation Services
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map((service, index) => (
            <Card key={index} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  {service.icon}
                </div>
                <span className="flex-grow font-medium">{service.title}</span>
                <span className="text-sm text-text-secondary">{service.impact}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
