
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartBar } from "lucide-react";

interface LocalMarketCardProps {
  similarVehiclesNearby: number;
  demandScore: number;
}

export function LocalMarketCard({ similarVehiclesNearby, demandScore }: LocalMarketCardProps) {
  const getMarketStatus = (score: number) => {
    if (score > 7) return { text: "High Demand", color: "text-green-600" };
    if (score > 4) return { text: "Moderate", color: "text-orange-500" };
    return { text: "Low Demand", color: "text-red-600" };
  };

  const marketStatus = getMarketStatus(demandScore);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <ChartBar className="mr-2 h-5 w-5 text-primary" />
          Local Market
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Nearby Listings</span>
            <span>{similarVehiclesNearby} vehicles</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Demand Score</span>
            <span className="font-bold">{demandScore}/10</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Market Status</span>
            <span className={marketStatus.color}>{marketStatus.text}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
