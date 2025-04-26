
import { Badge } from "@/components/ui/badge";

export function TabHeader() {
  return (
    <div className="max-w-5xl mx-auto text-center space-y-6 px-4 pb-8">
      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 text-base px-4 py-1.5">
        Premium Vehicle Valuation
      </Badge>
      <div className="space-y-4">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900">
          Vehicle Identification Methods
        </h2>
        <p className="text-lg text-slate-600 max-w-3xl mx-auto">
          Choose your preferred method to identify your vehicle. For the most accurate valuation, we recommend
          using the VIN lookup which provides detailed manufacturer specifications.
        </p>
      </div>
    </div>
  );
}
