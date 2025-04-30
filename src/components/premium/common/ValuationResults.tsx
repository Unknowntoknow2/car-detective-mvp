
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";

interface ValuationResultsProps {
  estimatedValue: number;
  confidenceScore: number;
  priceRange?: [number, number];
  adjustments?: {
    factor: string;
    impact: number;
    description?: string;
  }[];
}

export function ValuationResults({
  estimatedValue,
  confidenceScore,
  priceRange,
  adjustments,
}: ValuationResultsProps) {
  return (
    <Card className="mt-6 border border-primary/10 shadow-lg overflow-hidden">
      <CardContent className="space-y-6 pt-6">
        <div className="flex items-center gap-2 text-green-600">
          <CheckCircle2 className="w-5 h-5" />
          <h3 className="text-lg font-semibold">Valuation Complete</h3>
        </div>

        <div className="text-4xl font-bold text-primary tracking-tight">
          ${estimatedValue.toLocaleString()}
        </div>

        <div className="flex flex-wrap gap-3 items-center">
          <div className="px-3 py-1.5 bg-primary/5 rounded-full text-xs font-medium text-primary">
            {confidenceScore}% Confidence
          </div>
          
          {priceRange && (
            <div className="text-sm text-gray-700">
              Range: <span className="font-medium">${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()}</span>
            </div>
          )}
        </div>

        {adjustments && adjustments.length > 0 && (
          <div className="space-y-3 pt-2">
            <h4 className="text-sm font-semibold text-gray-700">
              Influencing Factors
            </h4>
            <div className="flex flex-wrap gap-2">
              {adjustments.map((adj, i) => (
                <Badge 
                  key={i} 
                  variant="outline" 
                  className={`py-1 ${
                    adj.impact > 0 
                      ? 'text-green-600 border-green-200 bg-green-50' 
                      : 'text-red-600 border-red-200 bg-red-50'
                  }`}
                >
                  {adj.factor}: {adj.impact > 0 ? "+" : ""}
                  {adj.impact}%
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
