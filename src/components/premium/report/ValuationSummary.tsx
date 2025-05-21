
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ValuationSummaryProps {
  valuationResult: any;
  isPremium?: boolean;
}

export const ValuationSummary = ({ valuationResult, isPremium = false }: ValuationSummaryProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">Valuation Summary</CardTitle>
          {isPremium && (
            <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-200">
              Premium
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col">
            <span className="text-muted-foreground text-sm">Estimated Value</span>
            <span className="text-3xl font-bold">
              {valuationResult?.estimatedValue 
                ? formatCurrency(valuationResult.estimatedValue) 
                : 'N/A'}
            </span>
          </div>

          {valuationResult?.priceRange && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-muted-foreground text-sm">Low Estimate</span>
                <p className="text-lg font-medium">{formatCurrency(valuationResult.priceRange[0])}</p>
              </div>
              <div>
                <span className="text-muted-foreground text-sm">High Estimate</span>
                <p className="text-lg font-medium">{formatCurrency(valuationResult.priceRange[1])}</p>
              </div>
            </div>
          )}

          {valuationResult?.confidenceScore !== undefined && (
            <div>
              <span className="text-muted-foreground text-sm">Confidence</span>
              <div className="flex items-center gap-2">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-primary h-2.5 rounded-full" 
                    style={{ width: `${valuationResult.confidenceScore}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{valuationResult.confidenceScore}%</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ValuationSummary;
