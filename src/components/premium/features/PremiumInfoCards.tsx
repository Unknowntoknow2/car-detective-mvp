
import { Shield, FileText, Car } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export function PremiumInfoCards() {
  return (
    <div className="grid md:grid-cols-3 gap-6 mb-8">
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-6">
          <Shield className="h-8 w-8 text-primary mb-4" />
          <h3 className="text-lg font-semibold mb-2">CARFAX® Integration</h3>
          <p className="text-sm text-muted-foreground">
            Complete vehicle history analysis for superior accuracy in valuations
          </p>
        </CardContent>
      </Card>
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-6">
          <FileText className="h-8 w-8 text-primary mb-4" />
          <h3 className="text-lg font-semibold mb-2">Market Analysis</h3>
          <p className="text-sm text-muted-foreground">
            Future value projections based on historical market data
          </p>
        </CardContent>
      </Card>
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-6">
          <Car className="h-8 w-8 text-primary mb-4" />
          <h3 className="text-lg font-semibold mb-2">Dealer Network</h3>
          <p className="text-sm text-muted-foreground">
            Compare prices across local dealers and get competitive offers
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
