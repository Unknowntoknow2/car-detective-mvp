
import { Check } from "lucide-react";
import { HoverCardContent } from "@/components/ui/hover-card";

interface FeatureBenefitsListProps {
  benefits: string[];
}

export function FeatureBenefitsList({ benefits }: FeatureBenefitsListProps) {
  return (
    <HoverCardContent 
      align="start" 
      className="w-[320px] p-4"
      sideOffset={5}
    >
      <div className="space-y-4">
        <h4 className="font-semibold text-sm text-slate-900">Key Benefits</h4>
        <ul className="space-y-2">
          {benefits.map((benefit, index) => (
            <li key={index} className="flex items-start gap-2 text-sm">
              <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-slate-600">{benefit}</span>
            </li>
          ))}
        </ul>
      </div>
    </HoverCardContent>
  );
}
