
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus } from "lucide-react";
import { FeatureOption } from "@/types/premium-valuation";

interface FeatureCardProps {
  feature: FeatureOption;
  isSelected: boolean;
  onToggle: (featureId: string) => void;
}

export function FeatureCard(
  { feature, isSelected, onToggle }: FeatureCardProps,
) {
  return (
    <Card
      className={`p-4 cursor-pointer transition-all ${
        isSelected
          ? "border-primary bg-primary/5"
          : "hover:border-gray-300 hover:bg-gray-50"
      }`}
      onClick={() => onToggle(feature.id)}
    >
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0">
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => onToggle(feature.id)}
            className="pointer-events-none"
          />
        </div>
        <div className="flex-grow">
          <p className="font-medium text-gray-900">{feature.name}</p>
          <p className="text-sm text-green-600">
            +${feature.value.toLocaleString()}
          </p>
        </div>
        {isSelected && (
          <Plus className="h-4 w-4 text-primary transform rotate-45" />
        )}
      </div>
    </Card>
  );
}
