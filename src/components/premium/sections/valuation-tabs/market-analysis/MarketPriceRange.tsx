
import { DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MarketPriceRangeProps {
  averagePrice: number;
  lowestPrice: number;
  highestPrice: number;
}

export function MarketPriceRange({ averagePrice, lowestPrice, highestPrice }: MarketPriceRangeProps) {
  const range = highestPrice - lowestPrice;
  const avgPosition = ((averagePrice - lowestPrice) / range) * 100;
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <DollarSign className="h-4 w-4" /> Market Price Range
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-primary mb-2">
          ${averagePrice.toLocaleString()}
        </div>
        <p className="text-sm text-slate-500 mb-3">Average Market Price</p>
        
        <div className="relative h-2 bg-slate-200 rounded-full mb-3">
          <div 
            className="absolute h-full bg-slate-300 rounded-full" 
            style={{ left: "0%", width: "100%" }} 
          />
          <div 
            className="absolute h-full bg-primary rounded-full" 
            style={{ left: "0%", width: `${avgPosition}%` }} 
          />
          <div 
            className="absolute bottom-full left-0 -translate-x-1/2 mb-1.5"
            style={{ left: "0%" }}
          >
            <div className="text-xs font-semibold mb-1">${lowestPrice.toLocaleString()}</div>
            <div className="w-1 h-3 bg-slate-400 mx-auto rounded-full" />
          </div>
          <div 
            className="absolute bottom-full left-0 -translate-x-1/2 mb-1.5"
            style={{ left: `${avgPosition}%` }}
          >
            <div className="w-2 h-4 bg-primary mx-auto rounded-full" />
          </div>
          <div 
            className="absolute bottom-full left-0 -translate-x-1/2 mb-1.5"
            style={{ left: "100%" }}
          >
            <div className="text-xs font-semibold mb-1">${highestPrice.toLocaleString()}</div>
            <div className="w-1 h-3 bg-slate-400 mx-auto rounded-full" />
          </div>
        </div>
        
        <div className="flex justify-between text-xs text-slate-500 mt-6">
          <span>Based on {82} similar listings</span>
        </div>
      </CardContent>
    </Card>
  );
}
