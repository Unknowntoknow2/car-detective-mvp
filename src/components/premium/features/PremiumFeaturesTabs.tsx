
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { featureCategories } from "./data/premium-features";

interface PremiumFeaturesTabsProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export function PremiumFeaturesTabs({
  activeCategory,
  onCategoryChange
}: PremiumFeaturesTabsProps) {
  return (
    <Tabs 
      defaultValue="all" 
      value={activeCategory}
      onValueChange={onCategoryChange}
      className="w-full"
    >
      <TabsList className="grid grid-cols-2 sm:grid-cols-4 w-full h-auto p-1 bg-slate-100 rounded-lg gap-1 mb-8">
        {featureCategories.map(category => (
          <TabsTrigger 
            key={category.value} 
            value={category.value}
          >
            {category.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
