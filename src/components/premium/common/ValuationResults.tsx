
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";

interface ValuationResultsProps {
  estimatedValue: number;
  confidenceScore: number;
  priceRange?: [number, number];
  adjustments?: {
    label: string;
    value: number;
  }[];
}

export function ValuationResults({
  estimatedValue,
  confidenceScore,
  priceRange,
  adjustments,
}: ValuationResultsProps) {
  return (
    <Card className="mt-6">
      <CardContent className="space-y-6 pt-6">
        <div className="flex items-center gap-2 text-green-600">
          <CheckCircle2 className="w-5 h-5" />
          <h3 className="text-lg font-semibold">Valuation Complete</h3>
        </div>

        <div className="text-3xl font-bold text-gray-900">
          ${estimatedValue.toLocaleString()}
        </div>

        <div className="text-sm text-gray-500">
          Confidence Score:{" "}
          <span className="font-medium text-gray-800">
            {confidenceScore}%
          </span>
        </div>

        {priceRange && (
          <div className="text-sm text-gray-500">
            Price Range:{" "}
            <span className="text-gray-800 font-medium">
              ${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()}
            </span>
          </div>
        )}

        {adjustments && adjustments.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-700">
              Influencing Factors
            </h4>
            <div className="flex flex-wrap gap-2">
              {adjustments.map((adj, i) => (
                <Badge key={i} variant="outline">
                  {adj.label}: {adj.value > 0 ? "+" : ""}
                  {adj.value}%
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
