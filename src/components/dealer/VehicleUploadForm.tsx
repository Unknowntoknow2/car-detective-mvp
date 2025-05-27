
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { DealerVehicleFormData } from '@/types/dealerVehicle';

interface VehicleUploadFormProps {
  onSubmit: (data: DealerVehicleFormData, photos?: File[]) => void;
  initialData?: Partial<DealerVehicleFormData>;
  isLoading?: boolean;
}

export const VehicleUploadForm: React.FC<VehicleUploadFormProps> = ({
  onSubmit,
  initialData,
  isLoading = false
}) => {
  const [formData, setFormData] = useState<DealerVehicleFormData>({
    make: initialData?.make || '',
    model: initialData?.model || '',
    year: initialData?.year || new Date().getFullYear(),
    price: initialData?.price || 0,
    mileage: initialData?.mileage || 0,
    vin: initialData?.vin || '',
    condition: initialData?.condition || 'Good',
    transmission: initialData?.transmission || '',
    fuelType: initialData?.fuelType || '',
    bodyType: initialData?.bodyType || '',
    color: initialData?.color || '',
    trim: initialData?.trim || '',
    status: initialData?.status || 'available',
    photos: initialData?.photos || [],
    zip_code: initialData?.zip_code || ''
  });

  const [photos, setPhotos] = useState<File[]>([]);

  const handleInputChange = (field: keyof DealerVehicleFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setPhotos(files);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData, photos);
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
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            type="number"
            value={formData.price}
            onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="mileage">Mileage</Label>
          <Input
            id="mileage"
            type="number"
            value={formData.mileage || ''}
            onChange={(e) => handleInputChange('mileage', parseInt(e.target.value) || 0)}
          />
        </div>
        <div>
          <Label htmlFor="vin">VIN</Label>
          <Input
            id="vin"
            value={formData.vin || ''}
            onChange={(e) => handleInputChange('vin', e.target.value)}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="condition">Condition</Label>
        <Select value={formData.condition} onValueChange={(value) => handleInputChange('condition', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Excellent">Excellent</SelectItem>
            <SelectItem value="Good">Good</SelectItem>
            <SelectItem value="Fair">Fair</SelectItem>
            <SelectItem value="Poor">Poor</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="photos">Photos</Label>
        <Input
          id="photos"
          type="file"
          multiple
          accept="image/*"
          onChange={handlePhotoUpload}
        />
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? 'Uploading...' : 'Add Vehicle'}
      </Button>
    </form>
  );
};
