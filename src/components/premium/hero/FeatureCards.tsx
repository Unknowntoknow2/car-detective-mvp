
import { motion } from "framer-motion";
import { FileText, DollarSign, BarChart3 } from "lucide-react";

export function FeatureCards() {
  const features = [
    {
      icon: <FileText className="h-5 w-5" />,
      title: "Complete Vehicle History",
      description: "Full CARFAX® history report with accident records, service history, and ownership details."
    },
    {
      icon: <DollarSign className="h-5 w-5" />,
      title: "Dealer Offers",
      description: "See what dealers in your area would actually pay for your vehicle."
    },
    {
      icon: <BarChart3 className="h-5 w-5" />,
      title: "Market Forecast",
      description: "12-month price forecast with ideal selling time and market trend analysis."
    }
  ];
  
  return (
    <div className="mt-8 grid grid-cols-1 gap-4">
      {features.map((feature, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
          className="flex items-start gap-3 p-4 rounded-lg border border-border bg-card/50"
        >
          <div className="p-2 bg-primary/10 rounded-full text-primary">
            {feature.icon}
          </div>
          <div>
            <h3 className="font-medium mb-1">{feature.title}</h3>
            <p className="text-sm text-muted-foreground">{feature.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
