
import React, { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { VehicleFormData } from '../schemas/vehicleSchema';
import { useMakeModels } from '@/hooks/useMakeModels';
import { ConditionSelector } from '@/components/common/ConditionSelector';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Upload, X } from 'lucide-react';

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

interface VehicleFormProps {
  form: UseFormReturn<VehicleFormData>;
  onSubmit: (data: VehicleFormData) => void;
  photoUrls: string[];
  handlePhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removePhoto: (index: number) => void;
}

export const VehicleForm: React.FC<VehicleFormProps> = ({ 
  form, 
  onSubmit,
  photoUrls,
  handlePhotoUpload,
  removePhoto
}) => {
  const [selectedMake, setSelectedMake] = React.useState<string>('');
  const [selectedModel, setSelectedModel] = React.useState<string>('');
  
  const { 
    makes, 
    models, 
    trims,
    isLoading,
    getModelsByMakeId,
    getTrimsByModelId
  } = useMakeModels();

  // When make changes, fetch models
  useEffect(() => {
    if (selectedMake) {
      getModelsByMakeId(selectedMake);
      // Reset model selection
      setSelectedModel('');
      form.setValue('model', '');
      form.setValue('trim_id', undefined);
    }
  }, [selectedMake, getModelsByMakeId, form]);

  // When model changes, fetch trims
  useEffect(() => {
    if (selectedModel) {
      getTrimsByModelId(selectedModel);
    }
  }, [selectedModel, getTrimsByModelId]);

  // Generate years array
  const years = React.useMemo(() => {
    const currentYear = new Date().getFullYear();
    const yearList = [];
    for (let year = currentYear + 1; year >= 1950; year--) {
      yearList.push(year);
    }
    return yearList;
  }, []);

  return (
    <Form {...form}>
      <form id="vehicle-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                      // Find the make ID for the selected make name
                      const makeObj = makes.find(m => m.make_name === value);
                      if (makeObj) {
                        setSelectedMake(makeObj.id);
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
                        <SelectItem key={make.id} value={make.make_name}>
                          {make.make_name}
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
                    onValueChange={(value) => {
                      field.onChange(value);
                      // Find the model ID for the selected model name
                      const modelObj = models.find(m => m.model_name === value);
                      if (modelObj) {
                        setSelectedModel(modelObj.id);
                      }
                    }} 
                    defaultValue={field.value}
                    disabled={!selectedMake || models.length === 0}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select model" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {models.map((model) => (
                        <SelectItem key={model.id} value={model.model_name}>
                          {model.model_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Trim and Year */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="trim_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trim</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    disabled={!selectedModel || trims.length === 0}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select trim" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {trims.map((trim) => (
                        <SelectItem key={trim.id} value={trim.id}>
                          {trim.trim_name}
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
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Year*</FormLabel>
                  <Select 
                    onValueChange={(value) => field.onChange(parseInt(value))} 
                    defaultValue={field.value ? field.value.toString() : undefined}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {years.map((year) => (
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
          </div>

          {/* Mileage and Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>

          {/* Condition */}
          <FormField
            control={form.control}
            name="condition"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Condition*</FormLabel>
                <ConditionSelector
                  name="condition"
                  defaultValue={75}
                  className="mt-2"
                />
                <FormMessage />
              </FormItem>
            )}
          />

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
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select transmission" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Automatic">Automatic</SelectItem>
                      <SelectItem value="Manual">Manual</SelectItem>
                      <SelectItem value="CVT">CVT</SelectItem>
                      <SelectItem value="Semi-Automatic">Semi-Automatic</SelectItem>
                      <SelectItem value="Dual Clutch">Dual Clutch</SelectItem>
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
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select fuel type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Gasoline">Gasoline</SelectItem>
                      <SelectItem value="Diesel">Diesel</SelectItem>
                      <SelectItem value="Electric">Electric</SelectItem>
                      <SelectItem value="Hybrid">Hybrid</SelectItem>
                      <SelectItem value="Plug-in Hybrid">Plug-in Hybrid</SelectItem>
                      <SelectItem value="Natural Gas">Natural Gas</SelectItem>
                      <SelectItem value="Flex Fuel">Flex Fuel</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Zip Code and Status */}
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
                      maxLength={5}
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
                disabled={photoUrls.length >= 5} // Limiting to 5 photos
              />
            </label>
            {photoUrls.length >= 5 && (
              <p className="text-amber-600 text-xs">
                Maximum of 5 photos allowed. Remove some photos to add more.
              </p>
            )}
          </div>
        </div>
      </form>
    </Form>
  );
};
