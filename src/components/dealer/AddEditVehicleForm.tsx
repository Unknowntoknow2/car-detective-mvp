import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useMakeModels } from '@/hooks/useMakeModels';
import { useVehicleUpload } from '@/components/dealer/hooks';
import { v4 as uuid } from 'uuid';

// UI Components
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, X, Upload, Image as ImageIcon } from 'lucide-react';

// Define the form schema with Zod
const formSchema = z.object({
  make: z.string().min(1, { message: "Make is required" }),
  model: z.string().min(1, { message: "Model is required" }),
  trim: z.string().optional(),
  year: z.coerce.number().int().min(1900, { message: "Year must be after 1900" }).max(new Date().getFullYear() + 1, { message: "Year cannot be in the future" }),
  mileage: z.coerce.number().int().min(0, { message: "Mileage must be a positive number" }),
  price: z.coerce.number().min(1, { message: "Price is required" }),
  condition: z.enum(["Excellent", "Good", "Fair", "Poor"], { message: "Please select a condition" }),
  color: z.string().optional(),
  fuel_type: z.enum(["Gasoline", "Diesel", "Electric", "Hybrid", "Plug-in Hybrid"], { message: "Please select a fuel type" }),
  transmission: z.enum(["Automatic", "Manual", "CVT", "Semi-Automatic"], { message: "Please select a transmission type" }),
  vin: z.string().min(1, { message: "VIN is required" }).max(17, { message: "VIN cannot exceed 17 characters" }),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

// Define an interface for our vehicle database record
interface DealerVehicle {
  id: string;
  dealer_id: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  price: number;
  condition: string;
  status: string;
  created_at: string;
  updated_at: string;
  photos: string[];
  transmission?: string;
  fuel_type?: string;
  zip_code?: string;
  // Additional fields we need for the form
  trim?: string;
  color?: string;
  vin?: string;
  description?: string;
}

interface AddEditVehicleFormProps {
  vehicleId?: string;
  onSuccess?: () => void;
}

const AddEditVehicleForm: React.FC<AddEditVehicleFormProps> = ({ 
  vehicleId,
  onSuccess 
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEditMode = !!vehicleId;
  
  // State for form handling
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("details");
  
  // Use our makes and models hook
  const { makes, models, trims, isLoading: isMakesLoading, getModelsByMakeId, getTrimsByModelId } = useMakeModels();
  
  // State for dynamic dropdowns
  const [selectedMakeId, setSelectedMakeId] = useState<string>("");
  const [selectedModelId, setSelectedModelId] = useState<string>("");
  const [filteredModels, setFilteredModels] = useState<any[]>([]);
  const [filteredTrims, setFilteredTrims] = useState<any[]>([]);
  
  // Photo upload state and handler from our reusable hook
  const {
    photoUrls,
    uploadedPhotos,
    handlePhotoUpload,
    removePhoto,
    uploadPhotosToStorage,
    setSubmitting
  } = useVehicleUpload();

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      make: "",
      model: "",
      trim: "",
      year: new Date().getFullYear(),
      mileage: 0,
      price: 0,
      condition: "Good",
      color: "",
      fuel_type: "Gasoline",
      transmission: "Automatic",
      vin: "",
      description: ""
    }
  });

  // Load vehicle data if in edit mode
  useEffect(() => {
    const fetchVehicleData = async () => {
      if (!vehicleId || !user) return;
      
      setIsLoading(true);
      try {
        const { data: vehicle, error } = await supabase
          .from('dealer_vehicles')
          .select('*')
          .eq('id', vehicleId)
          .eq('dealer_id', user.id)
          .single();

        if (error) throw error;
        
        if (vehicle) {
          // Find the make ID based on the make name
          const makeObject = makes.find(m => m.make_name === vehicle.make);
          let foundModels: any[] = [];
          let foundModelObj = null;
          
          if (makeObject) {
            setSelectedMakeId(makeObject.id);
            // Load models for this make
            foundModels = await getModelsByMakeId(makeObject.id);
            setFilteredModels(foundModels);
            
            // Find the model ID based on the model name
            foundModelObj = foundModels.find(m => m.model_name === vehicle.model);
            if (foundModelObj) {
              setSelectedModelId(foundModelObj.id);
              
              // Load trims for this model
              const trims = await getTrimsByModelId(foundModelObj.id);
              setFilteredTrims(trims);
            }
          }
          
          // Cast vehicle to our extended interface
          const typedVehicle = vehicle as DealerVehicle;
          
          // Set form values from vehicle data
          form.reset({
            make: makeObject?.id || "",
            model: foundModelObj?.id || "",
            trim: typedVehicle.trim || "",
            year: typedVehicle.year,
            mileage: typedVehicle.mileage || 0,
            price: typedVehicle.price,
            condition: typedVehicle.condition as "Excellent" | "Good" | "Fair" | "Poor",
            color: typedVehicle.color || "",
            fuel_type: (typedVehicle.fuel_type as "Gasoline" | "Diesel" | "Electric" | "Hybrid" | "Plug-in Hybrid") || "Gasoline",
            transmission: (typedVehicle.transmission as "Automatic" | "Manual" | "CVT" | "Semi-Automatic") || "Automatic",
            vin: typedVehicle.vin || "",
            description: typedVehicle.description || ""
          });

          // Load photos if any
          if (typedVehicle.photos && Array.isArray(typedVehicle.photos)) {
            // Implementation would depend on how photos are stored
            // This is a simplified version assuming photos are URLs in an array
            const photoUrlsFromDb = typedVehicle.photos as string[];
            // You would need to set these to the state that holds photo previews
            // Simplified example - in reality would need more work to handle properly
            // setPhotoUrls(photoUrlsFromDb);
          }
        }
      } catch (error) {
        console.error('Error fetching vehicle:', error);
        toast.error('Failed to load vehicle data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchVehicleData();
  }, [vehicleId, user, makes, form]);

  // Handle make selection change
  useEffect(() => {
    const loadModels = async () => {
      if (!selectedMakeId) {
        setFilteredModels([]);
        setFilteredTrims([]);
        return;
      }
      
      const models = await getModelsByMakeId(selectedMakeId);
      setFilteredModels(models);
      // Reset model selection and trims when make changes
      setSelectedModelId("");
      setFilteredTrims([]);
      form.setValue('model', '');
      form.setValue('trim', '');
    };
    
    loadModels();
  }, [selectedMakeId, getModelsByMakeId, form]);

  // Handle model selection change
  useEffect(() => {
    const loadTrims = async () => {
      if (!selectedModelId) {
        setFilteredTrims([]);
        return;
      }
      
      const trims = await getTrimsByModelId(selectedModelId);
      setFilteredTrims(trims);
      // Reset trim selection when model changes
      form.setValue('trim', '');
    };
    
    loadTrims();
  }, [selectedModelId, getTrimsByModelId, form]);

  // Submit handler
  const onSubmit = async (values: FormValues) => {
    if (!user) {
      toast.error('You must be logged in to save a vehicle');
      return;
    }
    
    setIsLoading(true);
    setSubmitting(true);
    
    try {
      // Get the actual make and model names from their IDs
      const makeObject = makes.find(m => m.id === values.make);
      const modelObject = filteredModels.find(m => m.id === values.model);
      const trimObject = filteredTrims.find(t => t.id === values.trim);
      
      if (!makeObject || !modelObject) {
        throw new Error('Selected make or model not found');
      }

      // Generate new vehicle ID if not editing
      const vehicleUuid = isEditMode ? vehicleId : uuid();
      
      // Upload photos first
      let photoUrls: string[] = [];
      if (uploadedPhotos.length > 0) {
        photoUrls = await uploadPhotosToStorage() || [];
      }
      
      // Prepare vehicle data
      const vehicleData = {
        id: vehicleUuid,
        dealer_id: user.id,
        make: makeObject.make_name,
        model: modelObject.model_name,
        trim: trimObject?.trim_name || values.trim,
        year: values.year,
        mileage: values.mileage,
        price: values.price,
        condition: values.condition,
        color: values.color,
        fuel_type: values.fuel_type,
        transmission: values.transmission,
        vin: values.vin,
        description: values.description,
        status: 'available',
        // Merge with existing photos if in edit mode
        photos: isEditMode ? [...photoUrls] : photoUrls,
      };
      
      // Save to Supabase - either update or insert
      const { error } = isEditMode
        ? await supabase
            .from('dealer_vehicles')
            .update(vehicleData)
            .eq('id', vehicleUuid)
            .eq('dealer_id', user.id)
        : await supabase
            .from('dealer_vehicles')
            .insert(vehicleData);
      
      if (error) throw error;
      
      toast.success(isEditMode ? 'Vehicle updated successfully' : 'Vehicle added successfully');
      
      // Call onSuccess callback if provided
      if (onSuccess) onSuccess();
      
      // Navigate back to inventory
      navigate('/dealer/inventory');
      
    } catch (error: any) {
      console.error('Error saving vehicle:', error);
      toast.error(`Failed to save vehicle: ${error.message}`);
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  // Helper function to handle errors and scroll to them
  const handleFormErrors = (errors: any) => {
    if (Object.keys(errors).length > 0) {
      // Find the first error field
      const firstError = Object.keys(errors)[0];
      // Get the element and scroll to it
      const element = document.getElementById(firstError);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.focus();
      }
      // Switch to the appropriate tab
      const detailsFields = ['make', 'model', 'year', 'mileage', 'price', 'condition', 'fuel_type', 'transmission', 'vin'];
      if (detailsFields.includes(firstError)) {
        setActiveTab('details');
      } else {
        setActiveTab('additional');
      }
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{isEditMode ? 'Edit Vehicle' : 'Add New Vehicle'}</CardTitle>
        <CardDescription>
          {isEditMode 
            ? 'Update the details of your vehicle listing'
            : 'Enter the details of the vehicle you want to add to your inventory'}
        </CardDescription>
      </CardHeader>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, handleFormErrors)}>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="details">Vehicle Details</TabsTrigger>
              <TabsTrigger value="additional">Images & Additional Info</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details">
              <CardContent className="space-y-6">
                {/* Make and Model in a grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Make Dropdown */}
                  <FormField
                    control={form.control}
                    name="make"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Make <span className="text-red-500">*</span></FormLabel>
                        <Select
                          disabled={isLoading || isMakesLoading}
                          value={field.value}
                          onValueChange={(value) => {
                            field.onChange(value);
                            setSelectedMakeId(value);
                          }}
                        >
                          <FormControl>
                            <SelectTrigger id="make" className="w-full">
                              <SelectValue placeholder="Select make" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {makes.map((make) => (
                              <SelectItem key={make.id} value={make.id}>
                                {make.make_name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Model Dropdown */}
                  <FormField
                    control={form.control}
                    name="model"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Model <span className="text-red-500">*</span></FormLabel>
                        <Select
                          disabled={isLoading || !selectedMakeId}
                          value={field.value}
                          onValueChange={(value) => {
                            field.onChange(value);
                            setSelectedModelId(value);
                          }}
                        >
                          <FormControl>
                            <SelectTrigger id="model" className="w-full">
                              <SelectValue placeholder={selectedMakeId ? "Select model" : "Select make first"} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {filteredModels.map((model) => (
                              <SelectItem key={model.id} value={model.id}>
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
                
                {/* Trim */}
                <FormField
                  control={form.control}
                  name="trim"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trim (Optional)</FormLabel>
                      <Select
                        disabled={isLoading || !selectedModelId}
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger id="trim" className="w-full">
                            <SelectValue placeholder={selectedModelId ? "Select trim" : "Select model first"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="">None / Standard</SelectItem>
                          {filteredTrims.map((trim) => (
                            <SelectItem key={trim.id} value={trim.id}>
                              {trim.trim_name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Optional trim level or edition of this vehicle
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Year, Mileage, Price in a grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Year Input */}
                  <FormField
                    control={form.control}
                    name="year"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Year <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input
                            id="year"
                            type="number"
                            placeholder="2023"
                            disabled={isLoading}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Mileage Input */}
                  <FormField
                    control={form.control}
                    name="mileage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mileage <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input
                            id="mileage"
                            type="number"
                            placeholder="10000"
                            disabled={isLoading}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Price Input */}
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input
                            id="price"
                            type="number"
                            placeholder="25000"
                            disabled={isLoading}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                {/* Condition, Color in a grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Condition Dropdown */}
                  <FormField
                    control={form.control}
                    name="condition"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Condition <span className="text-red-500">*</span></FormLabel>
                        <Select
                          disabled={isLoading}
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger id="condition" className="w-full">
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
                  
                  {/* Color Input */}
                  <FormField
                    control={form.control}
                    name="color"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Color (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            id="color"
                            placeholder="Black"
                            disabled={isLoading}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                {/* Fuel Type, Transmission in a grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Fuel Type Dropdown */}
                  <FormField
                    control={form.control}
                    name="fuel_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fuel Type <span className="text-red-500">*</span></FormLabel>
                        <Select
                          disabled={isLoading}
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger id="fuel_type" className="w-full">
                              <SelectValue placeholder="Select fuel type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Gasoline">Gasoline</SelectItem>
                            <SelectItem value="Diesel">Diesel</SelectItem>
                            <SelectItem value="Electric">Electric</SelectItem>
                            <SelectItem value="Hybrid">Hybrid</SelectItem>
                            <SelectItem value="Plug-in Hybrid">Plug-in Hybrid</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Transmission Dropdown */}
                  <FormField
                    control={form.control}
                    name="transmission"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Transmission <span className="text-red-500">*</span></FormLabel>
                        <Select
                          disabled={isLoading}
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger id="transmission" className="w-full">
                              <SelectValue placeholder="Select transmission" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Automatic">Automatic</SelectItem>
                            <SelectItem value="Manual">Manual</SelectItem>
                            <SelectItem value="CVT">CVT</SelectItem>
                            <SelectItem value="Semi-Automatic">Semi-Automatic</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                {/* VIN */}
                <FormField
                  control={form.control}
                  name="vin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>VIN <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input
                          id="vin"
                          placeholder="Vehicle Identification Number"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        The 17-character Vehicle Identification Number
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </TabsContent>
            
            <TabsContent value="additional">
              <CardContent className="space-y-6">
                {/* Photo Upload */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">Vehicle Photos</h3>
                    <p className="text-sm text-muted-foreground">
                      Upload up to 10 photos of your vehicle
                    </p>
                  </div>
                  
                  {/* Photo Upload Button */}
                  <div className="flex items-center gap-4">
                    <label
                      htmlFor="photo-upload"
                      className={`cursor-pointer flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed rounded-lg hover:bg-muted transition-colors ${
                        isLoading ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <Upload className="h-4 w-4" />
                      <span>Upload Photos</span>
                      <input
                        id="photo-upload"
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={handlePhotoUpload}
                        disabled={isLoading || photoUrls.length >= 10}
                      />
                    </label>
                    
                    <span className="text-sm text-muted-foreground">
                      {photoUrls.length}/10 photos
                    </span>
                  </div>
                  
                  {/* Photo Previews */}
                  {photoUrls.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                      {photoUrls.map((url, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={url}
                            alt={`Vehicle photo ${index + 1}`}
                            className="w-full h-32 object-cover rounded-md"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removePhoto(index)}
                            disabled={isLoading}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {/* Empty State */}
                  {photoUrls.length === 0 && (
                    <div className="border border-dashed rounded-lg p-8 text-center">
                      <div className="flex justify-center mb-4">
                        <ImageIcon className="h-12 w-12 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">No photos yet</h3>
                      <p className="text-sm text-muted-foreground">
                        Upload photos to showcase your vehicle
                      </p>
                    </div>
                  )}
                </div>
                
                {/* Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          id="description"
                          placeholder="Describe the vehicle - include features, history, and selling points"
                          className="min-h-32"
                          disabled={isLoading}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        A detailed description helps attract more potential buyers
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </TabsContent>
          </Tabs>
          
          <CardFooter className="flex justify-between gap-4 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/dealer/inventory')}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="min-w-32"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditMode ? 'Updating...' : 'Saving...'}
                </>
              ) : (
                isEditMode ? 'Update Vehicle' : 'Save Vehicle'
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default AddEditVehicleForm;
