
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, AlertCircle } from 'lucide-react';
import { Label } from '@/components/ui/label';

export function PlateLookup() {
  return (
    <Card className="p-6 border border-border/50">
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="outline" className="bg-primary/5 text-primary border-primary/30">
            <Search className="h-3.5 w-3.5 mr-1" />
            License Plate
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>License Plate</Label>
            <Input placeholder="Enter plate number" className="text-lg font-mono tracking-wide border-border/60" />
          </div>
          
          <div className="space-y-2">
            <Label>State</Label>
            <Select>
              <SelectTrigger className="border-border/60">
                <SelectValue placeholder="Select State" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CA">California</SelectItem>
                <SelectItem value="NY">New York</SelectItem>
                <SelectItem value="TX">Texas</SelectItem>
                <SelectItem value="FL">Florida</SelectItem>
                <SelectItem value="WA">Washington</SelectItem>
                <SelectItem value="IL">Illinois</SelectItem>
                <SelectItem value="PA">Pennsylvania</SelectItem>
                <SelectItem value="OH">Ohio</SelectItem>
                <SelectItem value="GA">Georgia</SelectItem>
                <SelectItem value="NC">North Carolina</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex items-start gap-2 text-xs text-muted-foreground">
          <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <p>
            Enter the full license plate number exactly as it appears on the vehicle. Special characters and spaces should be included.
          </p>
        </div>
      </div>
    </Card>
  );
}
