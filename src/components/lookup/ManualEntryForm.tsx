
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { ManualEntryFormData } from '@/components/lookup/types/manualEntry';

export interface ManualEntryFormProps {
  onSubmit?: (data: ManualEntryFormData) => void;
  onVehicleFound?: (data: any) => void;
  isLoading?: boolean;
  submitButtonText?: string;
  isPremium?: boolean;
}

export function ManualEntryForm({ 
  onSubmit, 
  onVehicleFound, 
  isLoading = false, 
  submitButtonText = 'Continue with Manual Entry',
  isPremium = false 
}: ManualEntryFormProps) {
  const [formData, setFormData] = useState({
    year: '',
    make: '',
    model: '',
    mileage: '',
    vin: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Simulate manual entry processing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const vehicleData = {
        ...formData,
        year: parseInt(formData.year),
        mileage: parseInt(formData.mileage),
        vin: formData.vin || 'MANUAL_ENTRY'
      };

      toast.success('Vehicle information entered successfully!');
      
      // Call the appropriate handler
      if (onSubmit) {
        onSubmit(vehicleData as ManualEntryFormData);
      }
      if (onVehicleFound) {
        onVehicleFound(vehicleData);
      }
    } catch (error) {
      console.error('Manual entry error:', error);
      toast.error('Failed to process vehicle information');
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Manual Vehicle Entry</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                type="number"
                value={formData.year}
                onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))}
                placeholder="2020"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="make">Make</Label>
              <Input
                id="make"
                value={formData.make}
                onChange={(e) => setFormData(prev => ({ ...prev, make: e.target.value }))}
                placeholder="Toyota"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Input
                id="model"
                value={formData.model}
                onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
                placeholder="Camry"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mileage">Mileage</Label>
              <Input
                id="mileage"
                type="number"
                value={formData.mileage}
                onChange={(e) => setFormData(prev => ({ ...prev, mileage: e.target.value }))}
                placeholder="50000"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="vin">VIN (Optional)</Label>
            <Input
              id="vin"
              value={formData.vin}
              onChange={(e) => setFormData(prev => ({ ...prev, vin: e.target.value.toUpperCase() }))}
              placeholder="17-character VIN (optional)"
              maxLength={17}
            />
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              submitButtonText
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

// Default export for compatibility
export default ManualEntryForm;
