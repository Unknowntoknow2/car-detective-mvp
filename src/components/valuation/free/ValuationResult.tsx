
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

export function ValuationResult() {
  return (
    <Card className="bg-white border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-primary" />
          <CardTitle>Your free valuation is ready</CardTitle>
        </div>
        <CardDescription>
          Based on current market data and vehicle information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-4">
          <p className="text-sm text-muted-foreground mb-2">Estimated Value</p>
          <p className="text-4xl font-bold text-primary">$24,500</p>
          <p className="text-sm text-muted-foreground mt-2">
            National average for your vehicle
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
