
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle } from 'lucide-react';

export function VinLookup() {
  return (
    <Card className="p-6 border border-border/50">
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="outline" className="bg-primary/5 text-primary border-primary/30">
            Recommended
          </Badge>
          <p className="text-sm text-muted-foreground">Fast & Accurate</p>
        </div>
        
        <Input 
          placeholder="Enter VIN (e.g., 1HGCM82633A004352)" 
          className="text-lg font-mono tracking-wide" 
        />
        
        <div className="flex items-start gap-2 text-xs text-muted-foreground">
          <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <p>
            Find your 17-character VIN on your vehicle registration, insurance card, or on the driver's side dashboard.
          </p>
        </div>
      </div>
    </Card>
  );
}
