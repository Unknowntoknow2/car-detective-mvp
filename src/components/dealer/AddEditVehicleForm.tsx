
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { DealerVehicleFormData } from '@/types/vehicle';
import { toast } from 'sonner';
import { ImageUploadSection } from './vehicle-upload/ImageUploadSection';

export interface AddEditVehicleFormProps {
  vehicleId?: string;
  onSuccess?: () => void;
  initialData?: Partial<DealerVehicleFormData>;
  isSubmitting?: boolean;
}

const AddEditVehicleForm: React.FC<AddEditVehicleFormProps> = ({
  vehicleId,
  onSuccess,
  initialData = {},
  isSubmitting = false
}) => {
  const [formData, setFormData] = useState<DealerVehicleFormData>({
    make: initialData.make || '',
    model: initialData.model || '',
    year: initialData.year || new Date().getFullYear(),
    price: initialData.price,
    mileage: initialData.mileage,
    condition: initialData.condition || 'Good',
    status: initialData.status || 'Available',
    fuelType: initialData.fuelType,
    transmission: initialData.transmission,
    color: initialData.color || '',
    description: initialData.description || '',
    photos: initialData.photos || []
  });

  const [uploading, setUploading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (value === '') {
      setFormData(prev => ({ ...prev, [name]: undefined }));
      return;
    }
    
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue)) {
      setFormData(prev => ({ ...prev, [name]: numValue }));
    }
  };

  const handlePhotosChange = (photos: File[]) => {
    setFormData(prev => ({ ...prev, photos }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.make || !formData.model || !formData.year) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    try {
      setUploading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success(`Vehicle ${vehicleId ? 'updated' : 'added'} successfully!`);
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Error saving vehicle');
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="make">Make <span className="text-red-500">*</span></Label>
                <Input
                  id="make"
                  name="make"
                  value={formData.make}
                  onChange={handleChange}
                  placeholder="e.g., Toyota"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="model">Model <span className="text-red-500">*</span></Label>
                <Input
                  id="model"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  placeholder="e.g., Camry"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="year">Year <span className="text-red-500">*</span></Label>
                <Input
                  id="year"
                  name="year"
                  type="number"
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  value={formData.year}
                  onChange={handleNumberChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  value={formData.price || ''}
                  onChange={handleNumberChange}
                  placeholder="Enter price"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="mileage">Mileage</Label>
                <Input
                  id="mileage"
                  name="mileage"
                  type="number"
                  min="0"
                  value={formData.mileage || ''}
                  onChange={handleNumberChange}
                  placeholder="Enter mileage"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="condition">Condition</Label>
                <select
                  id="condition"
                  name="condition"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={formData.condition}
                  onChange={handleChange}
                >
                  <option value="Excellent">Excellent</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                  <option value="Poor">Poor</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fuelType">Fuel Type</Label>
                <select
                  id="fuelType"
                  name="fuelType"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={formData.fuelType || ''}
                  onChange={handleChange}
                >
                  <option value="">Select Fuel Type</option>
                  <option value="Gasoline">Gasoline</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Electric">Electric</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="transmission">Transmission</Label>
                <select
                  id="transmission"
                  name="transmission"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={formData.transmission || ''}
                  onChange={handleChange}
                >
                  <option value="">Select Transmission</option>
                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <Input
                  id="color"
                  name="color"
                  value={formData.color || ''}
                  onChange={handleChange}
                  placeholder="e.g., Silver"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  name="status"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="Available">Available</option>
                  <option value="Sold">Sold</option>
                  <option value="Pending">Pending</option>
                  <option value="Reserved">Reserved</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                name="description"
                rows={3}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formData.description || ''}
                onChange={handleChange}
                placeholder="Enter vehicle description..."
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <ImageUploadSection 
            onChange={handlePhotosChange} 
            maxPhotos={10} 
            onPhotosChange={handlePhotosChange}
          />
        </CardContent>
      </Card>
      
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting || uploading}>
          {isSubmitting || uploading ? 'Saving...' : vehicleId ? 'Update Vehicle' : 'Add Vehicle'}
        </Button>
      </div>
    </form>
  );
};

export default AddEditVehicleForm;
