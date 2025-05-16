
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { File, Clock, DollarSign, ShieldCheck, Sparkles } from "lucide-react";

interface PremiumFeaturesTabsProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export function PremiumFeaturesTabs({ activeCategory, onCategoryChange }: PremiumFeaturesTabsProps) {
  const categories = [
    { id: "all", label: "All Features", icon: <Sparkles className="h-4 w-4" /> },
    { id: "history", label: "Vehicle History", icon: <Clock className="h-4 w-4" /> },
    { id: "market", label: "Market Analysis", icon: <DollarSign className="h-4 w-4" /> },
    { id: "report", label: "Reports", icon: <File className="h-4 w-4" /> },
    { id: "verification", label: "Verification", icon: <ShieldCheck className="h-4 w-4" /> },
  ];

  return (
    <TabsList className="grid grid-cols-2 md:grid-cols-5 h-auto">
      {categories.map((category) => (
        <TabsTrigger
          key={category.id}
          value={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={`flex items-center gap-2 py-3 px-4 rounded-md ${
            activeCategory === category.id
              ? "data-[state=active]:shadow-sm"
              : ""
          }`}
        >
          {category.icon}
          <span>{category.label}</span>
        </TabsTrigger>
      ))}
    </TabsList>
  );
}
