
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

interface PremiumFeature {
  id: string;
  title: string;
  description: string;
  icon: string;
  categories: string[];
}

interface PremiumFeaturesGridProps {
  features: PremiumFeature[];
  selectedFeature: string;
  onSelectFeature: (featureId: string) => void;
}

export function PremiumFeaturesGrid({
  features,
  selectedFeature,
  onSelectFeature,
}: PremiumFeaturesGridProps) {
  if (!features?.length) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No features found in this category</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {features.map((feature) => (
        <motion.div
          key={feature.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <Card
            className={`cursor-pointer transition-all duration-300 h-full ${
              selectedFeature === feature.id
                ? "border-primary bg-primary/5"
                : "hover:border-primary/50"
            }`}
            onClick={() => onSelectFeature(feature.id)}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                  <span className="text-xl" role="img" aria-label={feature.title}>
                    {feature.icon}
                  </span>
                </div>
                <h3 className="text-lg font-semibold">{feature.title}</h3>
              </div>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
