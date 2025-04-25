
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

export function VinLookup() {
  return (
    <Card className="p-6 border border-border/50">
      <Input 
        placeholder="Enter VIN (17 characters)" 
        maxLength={17}
        className="text-lg font-mono"
      />
    </Card>
  );
}
