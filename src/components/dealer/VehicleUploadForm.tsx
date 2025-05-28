
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DealerVehicleFormData } from '@/types/dealerVehicle';

interface VehicleUploadFormProps {
  onSubmit: (data: DealerVehicleFormData, photos?: File[]) => Promise<void>;
}

export const VehicleUploadForm: React.FC<VehicleUploadFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<DealerVehicleFormData>({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    mileage: null,
    price: 0,
    condition: 'Good',
    status: 'available',
    photos: []
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const handleInputChange = (field: keyof DealerVehicleFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="make">Make</Label>
          <Input
            id="make"
            value={formData.make}
            onChange={(e) => handleInputChange('make', e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="model">Model</Label>
          <Input
            id="model"
            value={formData.model}
            onChange={(e) => handleInputChange('model', e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="year">Year</Label>
          <Input
            id="year"
            type="number"
            value={formData.year}
            onChange={(e) => handleInputChange('year', parseInt(e.target.value))}
            required
          />
        </div>
        <div>
          <Label htmlFor="mileage">Mileage</Label>
          <Input
            id="mileage"
            type="number"
            value={formData.mileage || ''}
            onChange={(e) => handleInputChange('mileage', parseInt(e.target.value) || null)}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="price">Price</Label>
        <Input
          id="price"
          type="number"
          value={formData.price}
          onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
          required
        />
      </div>

      <div>
        <Label htmlFor="condition">Condition</Label>
        <Select value={formData.condition} onValueChange={(value) => handleInputChange('condition', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select condition" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Excellent">Excellent</SelectItem>
            <SelectItem value="Good">Good</SelectItem>
            <SelectItem value="Fair">Fair</SelectItem>
            <SelectItem value="Poor">Poor</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="w-full">
        Add Vehicle
      </Button>
    </form>
  );
};
