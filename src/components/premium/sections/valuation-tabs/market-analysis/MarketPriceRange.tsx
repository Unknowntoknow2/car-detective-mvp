
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Banknote } from "lucide-react";

interface MarketPriceRangeProps {
  averagePrice: number;
  lowestPrice: number;
  highestPrice: number;
}

export function MarketPriceRange({ averagePrice, lowestPrice, highestPrice }: MarketPriceRangeProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Banknote className="mr-2 h-5 w-5 text-primary" />
          Price Range
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Average</span>
            <span className="font-bold">${averagePrice.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Lowest</span>
            <span className="text-green-600">${lowestPrice.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Highest</span>
            <span className="text-red-600">${highestPrice.toLocaleString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
