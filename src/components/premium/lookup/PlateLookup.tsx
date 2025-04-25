import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';

export function PlateLookup() {
  return (
    <Card className="p-6 border border-border/50">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input placeholder="License Plate" className="text-lg font-mono" />
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select State" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="CA">California</SelectItem>
            <SelectItem value="NY">New York</SelectItem>
            {/* ... other states */}
          </SelectContent>
        </Select>
      </div>
    </Card>
  );
}
