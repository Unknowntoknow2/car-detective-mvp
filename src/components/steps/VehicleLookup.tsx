import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

interface VehicleLookupProps {
  onLookup: (data: { make: string; model: string; year?: number }) => void;
}

export function VehicleLookup({ onLookup }: VehicleLookupProps) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const make = searchParams.get('make') || '';
    const model = searchParams.get('model') || '';
    const yearParam = searchParams.get('year');
    const year = yearParam ? parseInt(yearParam, 10) : undefined;

    if (make && model) {
      onLookup({ make, model, year });
      toast.success(`Looking up: ${year ? year + ' ' : ''}${make} ${model}`);
    } else {
      toast.error('Make and model are required.');
    }
  };

  const handleVinLookup = () => {
    const vin = searchParams.get('vin') || undefined;
    if (vin) {
      navigate(`/valuation/vin?vin=${vin}`);
    } else {
      toast.error('VIN is required.');
    }
  };

  return (
    <Card>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="make">Make</Label>
            <Input
              type="text"
              id="make"
              placeholder="e.g., Toyota"
              value={searchParams.get('make') || ''}
              onChange={(e) => navigate(`?make=${e.target.value}`)}
              required
            />
          </div>
          <div>
            <Label htmlFor="model">Model</Label>
            <Input
              type="text"
              id="model"
              placeholder="e.g., Camry"
              value={searchParams.get('model') || ''}
              onChange={(e) => navigate(`?make=${searchParams.get('make')}&model=${e.target.value}`)}
              required
            />
          </div>
          <div>
            <Label htmlFor="year">Year</Label>
            <Input
              type="number"
              id="year"
              placeholder="e.g., 2018"
              value={searchParams.get('year') ? parseInt(searchParams.get('year') || '0', 10) : undefined}
              onChange={(e) => navigate(`?make=${searchParams.get('make')}&model=${searchParams.get('model')}&year=${e.target.value}`)}
            />
          </div>
          <Button type="submit">Lookup Vehicle</Button>
        </form>

        <div className="border-t pt-4 mt-4">
          <h3 className="text-lg font-semibold mb-2">Lookup by VIN</h3>
          <div className="flex items-center space-x-4">
            <Input
              type="text"
              id="vin"
              placeholder="Enter VIN"
              value={searchParams.get('vin') || ''}
              onChange={(e) => navigate(`?vin=${e.target.value}`)}
            />
            <Button type="button" onClick={handleVinLookup}>
              Lookup VIN
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
