
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { DealerVehicleFormData } from '@/types/dealerVehicle';

interface DealerVehicleFormProps {
  initialData?: Partial<DealerVehicleFormData>;
  onSubmit: (data: DealerVehicleFormData) => Promise<void>;
  isSubmitting?: boolean;
  submitLabel?: string;
  showCancel?: boolean;
  onCancel?: () => void;
}

export function DealerVehicleForm({
  initialData = {},
  onSubmit,
  isSubmitting = false,
  submitLabel = "Submit",
  showCancel = false,
  onCancel
}: DealerVehicleFormProps) {
  const [formData, setFormData] = useState<DealerVehicleFormData>({
    make: initialData.make || '',
    model: initialData.model || '',
    year: initialData.year || new Date().getFullYear(),
    price: initialData.price || 0,
    mileage: initialData.mileage || 0,
    condition: initialData.condition || 'Good',
    fuel_type: initialData.fuel_type || 'Gasoline',
    transmission: initialData.transmission || 'Automatic',
    description: initialData.description || '',
    status: initialData.status || 'available',
    vin: initialData.vin || '',
    color: initialData.color || '',
    zip_code: initialData.zip_code || '',
    features: initialData.features || [],
    photos: initialData.photos || [],
    vehicleId: initialData.vehicleId || '' // ID field as a string
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  // Check if form is an update form (has vehicleId) or a new vehicle form
  const isUpdateForm = Boolean(formData.vehicleId);

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* VIN */}
        <div>
          <Label htmlFor="vin">VIN</Label>
          <Input
            id="vin"
            name="vin"
            value={formData.vin}
            onChange={handleInputChange}
            placeholder="Vehicle Identification Number"
          />
        </div>

        {/* Make */}
        <div>
          <Label htmlFor="make">Make</Label>
          <Input
            id="make"
            name="make"
            value={formData.make}
            onChange={handleInputChange}
            placeholder="Brand (e.g., Toyota)"
            required
          />
        </div>

        {/* Model */}
        <div>
          <Label htmlFor="model">Model</Label>
          <Input
            id="model"
            name="model"
            value={formData.model}
            onChange={handleInputChange}
            placeholder="Model (e.g., Camry)"
            required
          />
        </div>

        {/* Year */}
        <div>
          <Label htmlFor="year">Year</Label>
          <Input
            id="year"
            name="year"
            type="number"
            value={formData.year}
            onChange={handleInputChange}
            min={1900}
            max={new Date().getFullYear() + 1}
            required
          />
        </div>

        {/* Price */}
        <div>
          <Label htmlFor="price">Price ($)</Label>
          <Input
            id="price"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleInputChange}
            min={0}
            placeholder="Listing price"
            required
          />
        </div>

        {/* Mileage */}
        <div>
          <Label htmlFor="mileage">Mileage</Label>
          <Input
            id="mileage"
            name="mileage"
            type="number"
            value={formData.mileage}
            onChange={handleInputChange}
            min={0}
            placeholder="Current mileage"
            required
          />
        </div>

        {/* Color */}
        <div>
          <Label htmlFor="color">Color</Label>
          <Input
            id="color"
            name="color"
            value={formData.color}
            onChange={handleInputChange}
            placeholder="Exterior color"
          />
        </div>

        {/* ZIP Code */}
        <div>
          <Label htmlFor="zip_code">ZIP Code</Label>
          <Input
            id="zip_code"
            name="zip_code"
            value={formData.zip_code}
            onChange={handleInputChange}
            placeholder="Vehicle location"
          />
        </div>
      </div>

      {/* Vehicle Details */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Condition */}
        <div>
          <Label htmlFor="condition">Condition</Label>
          <Select
            onValueChange={(value) => handleSelectChange('condition', value)}
            defaultValue={formData.condition}
          >
            <SelectTrigger id="condition">
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

        {/* Fuel Type */}
        <div>
          <Label htmlFor="fuel_type">Fuel Type</Label>
          <Select
            onValueChange={(value) => handleSelectChange('fuel_type', value)}
            defaultValue={formData.fuel_type}
          >
            <SelectTrigger id="fuel_type">
              <SelectValue placeholder="Select fuel type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Gasoline">Gasoline</SelectItem>
              <SelectItem value="Diesel">Diesel</SelectItem>
              <SelectItem value="Electric">Electric</SelectItem>
              <SelectItem value="Hybrid">Hybrid</SelectItem>
              <SelectItem value="Plug-in Hybrid">Plug-in Hybrid</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Transmission */}
        <div>
          <Label htmlFor="transmission">Transmission</Label>
          <Select
            onValueChange={(value) => handleSelectChange('transmission', value)}
            defaultValue={formData.transmission}
          >
            <SelectTrigger id="transmission">
              <SelectValue placeholder="Select transmission" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Automatic">Automatic</SelectItem>
              <SelectItem value="Manual">Manual</SelectItem>
              <SelectItem value="CVT">CVT</SelectItem>
              <SelectItem value="Semi-Automatic">Semi-Automatic</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Status */}
      <div>
        <Label htmlFor="status">Listing Status</Label>
        <Select
          onValueChange={(value) => handleSelectChange('status', value)}
          defaultValue={formData.status}
        >
          <SelectTrigger id="status">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="sold">Sold</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Description */}
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Vehicle description and details"
          rows={4}
        />
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-2">
        {showCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : submitLabel}
        </Button>
      </div>
    </form>
  );
}
