
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureIconProps {
  Icon: LucideIcon;
  colorClass: string;
}

export function FeatureIcon({ Icon, colorClass }: FeatureIconProps) {
  return (
    <div className={cn("p-3 rounded-lg border", colorClass)}>
      <Icon className="h-6 w-6" />
    </div>
  );
}
