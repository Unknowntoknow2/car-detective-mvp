
import { Badge } from "@/components/ui/badge";

export function TabHeader() {
  return (
    <div className="mb-8 text-center max-w-3xl mx-auto">
      <Badge variant="outline" className="mb-4 bg-primary/10 text-primary border-primary/30">
        Professional Valuation
      </Badge>
      <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
        Vehicle Identification Methods
      </h2>
      <p className="text-slate-600">
        Choose your preferred method to identify your vehicle. For the most accurate valuation, we recommend
        using the VIN lookup which provides detailed manufacturer specifications.
      </p>
    </div>
  );
}
