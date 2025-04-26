
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface PriceDistributionChartProps {
  distribution: number[];
  listingCount: number;
  vehicleInfo: {
    year: number;
    make: string;
    model: string;
  };
  priceRange: {
    lowest: number;
    average: number;
    highest: number;
  };
}

export function PriceDistributionChart({ 
  distribution, 
  listingCount, 
  vehicleInfo,
  priceRange 
}: PriceDistributionChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Price Distribution</CardTitle>
        <CardDescription>
          Distribution of {listingCount} similar {vehicleInfo.year} {vehicleInfo.make} {vehicleInfo.model} listings
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-40 flex items-end justify-between gap-1">
          {distribution.map((count, index) => (
            <div 
              key={index} 
              className="bg-primary/80 rounded-t w-full"
              style={{ 
                height: `${(count / Math.max(...distribution)) * 100}%`,
                opacity: index === 3 || index === 4 ? 1 : 0.7
              }}
            />
          ))}
        </div>
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>${Math.round(priceRange.lowest / 1000)}k</span>
          <span>${Math.round(priceRange.average / 1000) - 2}k</span>
          <span>${Math.round(priceRange.average / 1000)}k</span>
          <span>${Math.round(priceRange.average / 1000) + 2}k</span>
          <span>${Math.round(priceRange.highest / 1000)}k</span>
        </div>
      </CardContent>
    </Card>
  );
}
