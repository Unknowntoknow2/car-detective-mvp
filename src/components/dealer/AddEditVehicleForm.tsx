
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DealerInventoryItem } from '@/types/vehicle';

interface AddEditVehicleFormProps {
  vehicle?: DealerInventoryItem;
  onSubmit: (vehicle: Partial<DealerInventoryItem>) => void;
  onCancel: () => void;
}

export const AddEditVehicleForm: React.FC<AddEditVehicleFormProps> = ({
  vehicle,
  onSubmit,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    make: vehicle?.make || '',
    model: vehicle?.model || '',
    year: vehicle?.year || new Date().getFullYear(),
    price: vehicle?.price || 0,
    mileage: vehicle?.mileage || 0,
    vin: vehicle?.vin || '',
    status: vehicle?.status || 'available'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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

      <div>
        <Label htmlFor="year">Year</Label>
        <Input
          id="year"
          type="number"
          value={formData.year}
          onChange={(e) => handleInputChange('year', parseInt(e.target.value) || new Date().getFullYear())}
          required
        />
      </div>

      <div>
        <Label htmlFor="price">Price</Label>
        <Input
          id="price"
          type="number"
          value={formData.price}
          onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
          required
        />
      </div>

      <div>
        <Label htmlFor="mileage">Mileage</Label>
        <Input
          id="mileage"
          type="number"
          value={formData.mileage}
          onChange={(e) => handleInputChange('mileage', parseInt(e.target.value) || 0)}
          required
        />
      </div>

      <div>
        <Label htmlFor="vin">VIN</Label>
        <Input
          id="vin"
          value={formData.vin}
          onChange={(e) => handleInputChange('vin', e.target.value)}
          required
        />
      </div>

      <div className="flex gap-2">
        <Button type="submit">
          {vehicle ? 'Update Vehicle' : 'Add Vehicle'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default AddEditVehicleForm;
