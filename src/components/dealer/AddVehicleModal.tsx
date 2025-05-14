
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMakeModels } from '@/hooks/useMakeModels';
import { useVehicleSelectors } from '@/hooks/useVehicleSelectors';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { X, Plus, Upload, Car } from 'lucide-react';
import { uuid } from '@supabase/supabase-js/dist/module/helpers';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { vehicleSchema, VehicleFormData } from './schemas/vehicleSchema';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface AddVehicleModalProps {
  onVehicleAdded?: () => void;
}

const AddVehicleModal: React.FC<AddVehicleModalProps> = ({ onVehicleAdded }) => {
  const [open, setOpen] = useState(false);
  const [uploadedPhotos, setUploadedPhotos] = useState<File[]>([]);
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const { user } = useAuth();
  const { 
    makes, 
    models, 
    selectedMakeId, 
    setSelectedMakeId,
    isLoading,
    getYearOptions 
  } = useVehicleSelectors();

  const form = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      make: '',
      model: '',
      year: new Date().getFullYear(),
      mileage: null,
      price: 0,
      condition: 'Good',
      transmission: 'Automatic',
      fuel_type: 'Gasoline',
      zip_code: '',
      photos: [],
      status: 'available'
    }
  });

  // Reset the form when the dialog is closed
  useEffect(() => {
    if (!open) {
      form.reset();
      setUploadedPhotos([]);
      setPhotoUrls([]);
    }
  }, [open, form]);

  const yearOptions = getYearOptions(1990);

  // Handle photo uploads
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newPhotos = Array.from(files);
    setUploadedPhotos(prev => [...prev, ...newPhotos]);

    // Create temporary URLs for preview
    const newUrls = newPhotos.map(file => URL.createObjectURL(file));
    setPhotoUrls(prev => [...prev, ...newUrls]);
  };

  // Remove photo from the preview
  const removePhoto = (index: number) => {
    setUploadedPhotos(prev => prev.filter((_, i) => i !== index));
    
    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(photoUrls[index]);
    setPhotoUrls(prev => prev.filter((_, i) => i !== index));
  };

  // Upload photos to Supabase Storage
  const uploadPhotosToStorage = async (): Promise<string[]> => {
    if (!user?.id || uploadedPhotos.length === 0) return [];

    try {
      setPhotoUploading(true);
      const uploadPromises = uploadedPhotos.map(async (photo) => {
        const fileExt = photo.name.split('.').pop();
        const fileName = `${uuid()}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        const { data, error } = await supabase.storage
          .from('vehicle_photos')
          .upload(filePath, photo);

        if (error) {
          console.error('Error uploading photo:', error);
          throw error;
        }

        // Get public URL for the uploaded file
        const { data: { publicUrl } } = supabase.storage
          .from('vehicle_photos')
          .getPublicUrl(filePath);

        return publicUrl;
      });

      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error('Error uploading photos:', error);
      toast.error('Failed to upload photos');
      return [];
    } finally {
      setPhotoUploading(false);
    }
  };

  // Handle form submission
  const onSubmit = async (data: VehicleFormData) => {
    if (!user?.id) {
      toast.error('You must be logged in to add a vehicle');
      return;
    }

    try {
      setSubmitting(true);

      // Upload photos to storage
      const photoUrls = await uploadPhotosToStorage();

      // Insert vehicle data into the database
      const { data: vehicleData, error } = await supabase
        .from('dealer_vehicles')
        .insert({
          dealer_id: user.id,
          make: data.make,
          model: data.model,
          year: data.year,
          mileage: data.mileage,
          price: data.price,
          condition: data.condition,
          transmission: data.transmission,
          fuel_type: data.fuel_type,
          zip_code: data.zip_code,
          photos: photoUrls,
          status: data.status
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding vehicle:', error);
        toast.error('Failed to add vehicle');
        return;
      }

      // Success!
      toast.success('Vehicle added successfully');
      setOpen(false);
      
      // Call the callback if provided
      if (onVehicleAdded) {
        onVehicleAdded();
      }

    } catch (error) {
      console.error('Error in form submission:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus size={16} />
          Add Vehicle
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Car size={18} /> Add New Vehicle
          </DialogTitle>
          <DialogDescription>
            Add a new vehicle to your dealer inventory. Fill out the details below.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Vehicle Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Vehicle Information</h3>
              
              {/* Make and Model */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="make"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Make*</FormLabel>
                      <Select 
                        onValueChange={(value) => {
                          field.onChange(value);
                          const makeObj = makes.find(m => m.name === value);
                          if (makeObj) {
                            setSelectedMakeId(makeObj.id);
                          }
                        }} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select make" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {makes.map((make) => (
                            <SelectItem key={make.id} value={make.name}>
                              {make.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="model"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Model*</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        disabled={!selectedMakeId || models.length === 0}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select model" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {models.map((model) => (
                            <SelectItem key={model.id} value={model.name}>
                              {model.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Year and Mileage */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year*</FormLabel>
                      <Select 
                        onValueChange={(value) => field.onChange(parseInt(value))} 
                        defaultValue={field.value.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select year" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {yearOptions.map((year) => (
                            <SelectItem key={year} value={year.toString()}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="mileage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mileage</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="e.g., 25000" 
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value ? parseInt(e.target.value) : null;
                            field.onChange(value);
                          }}
                          value={field.value === null ? '' : field.value}
                        />
                      </FormControl>
                      <FormDescription>Leave empty if unknown</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Price and Condition */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price ($)*</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="e.g., 15000" 
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value ? parseFloat(e.target.value) : 0;
                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="condition"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Condition*</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select condition" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Excellent">Excellent</SelectItem>
                          <SelectItem value="Good">Good</SelectItem>
                          <SelectItem value="Fair">Fair</SelectItem>
                          <SelectItem value="Poor">Poor</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Transmission and Fuel Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="transmission"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Transmission</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value || undefined}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select transmission" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Automatic">Automatic</SelectItem>
                          <SelectItem value="Manual">Manual</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fuel_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fuel Type</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value || undefined}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select fuel type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Gasoline">Gasoline</SelectItem>
                          <SelectItem value="Diesel">Diesel</SelectItem>
                          <SelectItem value="Hybrid">Hybrid</SelectItem>
                          <SelectItem value="Electric">Electric</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Zip Code */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="zip_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Zip Code</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., 90210" 
                          {...field}
                          maxLength={10}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status*</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="available">Available</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="sold">Sold</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Photo Upload Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Vehicle Photos</h3>
              
              <div className="flex flex-col gap-4">
                {/* Photo Preview Grid */}
                {photoUrls.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {photoUrls.map((url, index) => (
                      <div key={index} className="relative group">
                        <AspectRatio ratio={4/3}>
                          <img 
                            src={url} 
                            alt={`Vehicle preview ${index + 1}`}
                            className="object-cover w-full h-full rounded-md" 
                          />
                        </AspectRatio>
                        <button
                          type="button"
                          onClick={() => removePhoto(index)}
                          className="absolute top-1 right-1 bg-black/70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Upload Button */}
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-md cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-2 text-gray-500" />
                    <p className="mb-1 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      JPEG, PNG or WebP (max 10MB)
                    </p>
                  </div>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*" 
                    multiple 
                    onChange={handlePhotoUpload}
                  />
                </label>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={submitting || photoUploading}
                isLoading={submitting || photoUploading}
              >
                {submitting ? 'Adding...' : 'Add Vehicle'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddVehicleModal;
