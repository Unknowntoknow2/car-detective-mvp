
import { Badge } from "@/components/ui/badge";

interface FeatureHeaderProps {
  title: string;
  value: string;
  colorClass: string;
}

export function FeatureHeader({ title, value, colorClass }: FeatureHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-2">
      <h3 className="font-semibold text-lg text-slate-900">{title}</h3>
      <Badge variant="outline" className={colorClass}>
        {value}
      </Badge>
    </div>
  );
}
