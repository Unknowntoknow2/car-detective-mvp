
import { MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface LocalMarketCardProps {
  similarVehiclesNearby: number;
  demandScore: number; // 1-10 scale
}

export function LocalMarketCard(
  { similarVehiclesNearby, demandScore }: LocalMarketCardProps,
) {
  // Determine demand level based on score (1-10 scale)
  let demandLevel: string;
  let demandColor: string;

  if (demandScore >= 8) {
    demandLevel = "High";
    demandColor = "text-green-600";
  } else if (demandScore >= 5) {
    demandLevel = "Medium";
    demandColor = "text-amber-600";
  } else {
    demandLevel = "Low";
    demandColor = "text-red-600";
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <MapPin className="h-4 w-4" /> Local Market
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold mb-2">
          {similarVehiclesNearby}
        </div>
        <p className="text-sm text-slate-500 mb-4">Similar vehicles nearby</p>

        <div className="pt-2 border-t border-slate-100">
          <div className="mb-1 flex justify-between items-center">
            <span className="text-sm font-medium">Demand</span>
            <span className={`text-sm font-medium ${demandColor}`}>
              {demandLevel}
            </span>
          </div>

          <div className="h-2 w-full bg-slate-200 rounded-full">
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${demandScore * 10}%` }}
            />
          </div>

          <div className="mt-2 text-xs text-slate-500">
            Based on search interest and inventory levels
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
