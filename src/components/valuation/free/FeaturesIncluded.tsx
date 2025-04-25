
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Check } from 'lucide-react';

export function FeaturesIncluded() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">What's included in the free valuation</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {[
            'Basic market estimate (national average)',
            'Single-photo AI scoring demo',
            'CARFAX preview (owners & accident count)',
          ].map((feature, index) => (
            <li key={index} className="flex items-center gap-2">
              <Check className="h-4 w-4 text-primary" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
