
import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Car, DollarSign, Info } from 'lucide-react';
import { useVehicleUploadModal } from '../hooks/useVehicleUploadModal';
import { ImageUploadSection } from './ImageUploadSection';
import { ConditionSelector } from './ConditionSelector';
import { toast } from 'sonner';

// Mock data for dropdowns
const MOCK_MAKES = ['Audi', 'BMW', 'Chevrolet', 'Dodge', 'Ford', 'Honda', 'Hyundai', 'Jeep', 'Kia', 'Lexus', 'Mazda', 'Mercedes-Benz', 'Nissan', 'Subaru', 'Tesla', 'Toyota', 'Volkswagen'];
const MOCK_MODELS: Record<string, string[]> = {
  'Audi': ['A3', 'A4', 'A5', 'A6', 'Q3', 'Q5', 'Q7', 'R8'],
  'BMW': ['1 Series', '2 Series', '3 Series', '5 Series', 'X1', 'X3', 'X5', 'Z4'],
  'Toyota': ['Camry', 'Corolla', 'Highlander', 'Prius', 'RAV4', 'Tacoma', '4Runner', 'Tundra'],
  // More models would be added here
};
const MOCK_YEARS = Array.from({ length: 30 }, (_, i) => (new Date().getFullYear() - i).toString());
const MOCK_TRANSMISSIONS = ['Automatic', 'Manual', 'CVT', 'Dual-Clutch'];
const MOCK_FUEL_TYPES = ['Gasoline', 'Diesel', 'Hybrid', 'Electric', 'Plug-in Hybrid'];

export const VehicleUploadModal = () => {
  const { isOpen, setIsOpen } = useVehicleUploadModal();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: '',
    mileage: '',
    vin: '',
    color: '',
    transmission: '',
    fuelType: '',
    price: '',
    condition: 'Good' as 'Poor' | 'Fair' | 'Good' | 'Excellent',
  });
  
  const [images, setImages] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Get available models based on selected make
  const availableModels = formData.make ? (MOCK_MODELS[formData.make] || []) : [];
  
  // Handle input changes
  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field if it exists
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };
  
  // Simple validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.make) newErrors.make = 'Make is required';
    if (!formData.model) newErrors.model = 'Model is required';
    if (!formData.year) newErrors.year = 'Year is required';
    if (!formData.price) newErrors.price = 'Price is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Mock submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        setIsOpen(false);
        toast.success('Vehicle added successfully!');
        
        // Reset form for next use
        setFormData({
          make: '',
          model: '',
          year: '',
          mileage: '',
          vin: '',
          color: '',
          transmission: '',
          fuelType: '',
          price: '',
          condition: 'Good',
        });
        setImages([]);
      }, 1500);
    } else {
      toast.error('Please correct the errors in the form.');
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Car className="h-5 w-5" />
            Add New Vehicle
          </DialogTitle>
          <DialogDescription>
            Enter the details of the vehicle you want to add to your inventory.
          </DialogDescription>
        </DialogHeader>
        
        <motion.form 
          onSubmit={handleSubmit}
          className="space-y-6 py-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {/* Vehicle Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-medium">Vehicle Information</h3>
              <div className="h-px flex-1 bg-border"></div>
            </div>
            
            {/* Make, Model, Year */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="make" className={errors.make ? 'text-destructive' : ''}>
                  Make*
                </Label>
                <Select
                  value={formData.make}
                  onValueChange={(value) => handleChange('make', value)}
                >
                  <SelectTrigger id="make" className={errors.make ? 'border-destructive ring-destructive' : ''}>
                    <SelectValue placeholder="Select make" />
                  </SelectTrigger>
                  <SelectContent>
                    {MOCK_MAKES.map((make) => (
                      <SelectItem key={make} value={make}>
                        {make}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.make && (
                  <motion.p 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-destructive mt-1"
                  >
                    {errors.make}
                  </motion.p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="model" className={errors.model ? 'text-destructive' : ''}>
                  Model*
                </Label>
                <Select
                  value={formData.model}
                  onValueChange={(value) => handleChange('model', value)}
                  disabled={!formData.make}
                >
                  <SelectTrigger id="model" className={errors.model ? 'border-destructive ring-destructive' : ''}>
                    <SelectValue placeholder={formData.make ? 'Select model' : 'Select make first'} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableModels.map((model) => (
                      <SelectItem key={model} value={model}>
                        {model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.model && (
                  <motion.p 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-destructive mt-1"
                  >
                    {errors.model}
                  </motion.p>
                )}
              </div>
            </div>
            
            {/* Year and Mileage */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="year" className={errors.year ? 'text-destructive' : ''}>
                  Year*
                </Label>
                <Select
                  value={formData.year}
                  onValueChange={(value) => handleChange('year', value)}
                >
                  <SelectTrigger id="year" className={errors.year ? 'border-destructive ring-destructive' : ''}>
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {MOCK_YEARS.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.year && (
                  <motion.p 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-destructive mt-1"
                  >
                    {errors.year}
                  </motion.p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="mileage">
                  Mileage
                </Label>
                <Input
                  id="mileage"
                  type="number"
                  placeholder="e.g., 45000"
                  value={formData.mileage}
                  onChange={(e) => handleChange('mileage', e.target.value)}
                />
              </div>
            </div>
            
            {/* VIN and Color */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vin">VIN</Label>
                <Input
                  id="vin"
                  placeholder="Vehicle Identification Number"
                  value={formData.vin}
                  onChange={(e) => handleChange('vin', e.target.value)}
                  maxLength={17}
                />
                <p className="text-xs text-muted-foreground">
                  17-character identification code
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <Input
                  id="color"
                  placeholder="e.g., Midnight Blue"
                  value={formData.color}
                  onChange={(e) => handleChange('color', e.target.value)}
                />
              </div>
            </div>
            
            {/* Transmission and Fuel Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="transmission">Transmission</Label>
                <Select
                  value={formData.transmission}
                  onValueChange={(value) => handleChange('transmission', value)}
                >
                  <SelectTrigger id="transmission">
                    <SelectValue placeholder="Select transmission" />
                  </SelectTrigger>
                  <SelectContent>
                    {MOCK_TRANSMISSIONS.map((transmission) => (
                      <SelectItem key={transmission} value={transmission}>
                        {transmission}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fuelType">Fuel Type</Label>
                <Select
                  value={formData.fuelType}
                  onValueChange={(value) => handleChange('fuelType', value)}
                >
                  <SelectTrigger id="fuelType">
                    <SelectValue placeholder="Select fuel type" />
                  </SelectTrigger>
                  <SelectContent>
                    {MOCK_FUEL_TYPES.map((fuelType) => (
                      <SelectItem key={fuelType} value={fuelType}>
                        {fuelType}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Price and Condition */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="price" className={errors.price ? 'text-destructive' : ''}>
                  Price*
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="price"
                    type="number"
                    className={`pl-8 ${errors.price ? 'border-destructive ring-destructive' : ''}`}
                    placeholder="e.g., 25000"
                    value={formData.price}
                    onChange={(e) => handleChange('price', e.target.value)}
                  />
                </div>
                {errors.price && (
                  <motion.p 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-destructive mt-1"
                  >
                    {errors.price}
                  </motion.p>
                )}
              </div>
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={formData.condition}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ConditionSelector 
                    value={formData.condition} 
                    onChange={(value) => handleChange('condition', value)}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
          
          {/* Vehicle Photos */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="pt-2"
          >
            <ImageUploadSection
              images={images}
              onImagesChange={setImages}
            />
          </motion.div>
          
          {/* Form Actions */}
          <DialogFooter className="pt-4 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="mt-2 sm:mt-0"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              isLoading={isSubmitting}
              className="transition-all duration-300"
            >
              {isSubmitting ? 'Adding...' : 'Add Vehicle'}
            </Button>
          </DialogFooter>
        </motion.form>
      </DialogContent>
    </Dialog>
  );
};
