import React, { useState, useCallback, useEffect } from 'react';
import {
  DialogClose,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from 'sonner';
import { ImageIcon, Loader2 } from 'lucide-react';
import { uploadImage } from '@/lib/utils';
import { VehicleFormValues, vehicleSchema } from './schemas/vehicleSchema';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from 'next-auth/react';
import { DealerVehicle, DealerVehicleFormData } from '@/types/dealerVehicle';
import { VinLookupForm } from './forms/VinLookupForm';
import { YearMileageInputs } from '../premium/lookup/form-parts/fields/YearMileageInputs';

interface AddEditVehicleFormProps {
  vehicleId?: string;
  onSuccess?: () => void;
}

const AddEditVehicleForm: React.FC<AddEditVehicleFormProps> = ({ vehicleId, onSuccess }) => {
  const [isVinLookupMode, setIsVinLookupMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | ''>('');
  const [mileage, setMileage] = useState('');
  const router = useRouter();
  const { toast } = useToast();
	const { data: session } = useSession()

  const form = useForm<DealerVehicleFormData>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      make: '',
      model: '',
      year: new Date().getFullYear(),
      mileage: null,
      price: 0,
      condition: 'Good',
      status: 'available',
      photos: [],
      zip_code: '',
    },
  });

  const { register, handleSubmit, control, formState: { errors, isSubmitting }, reset, watch } = form;

  useEffect(() => {
    const fetchVehicleData = async () => {
      if (vehicleId) {
        setIsLoading(true);
        try {
          const { data: vehicle, error } = await supabase
            .from('dealer_vehicles')
            .select('*')
            .eq('id', vehicleId)
            .single();

          if (error) {
            console.error("Error fetching vehicle:", error);
            toast({
              title: "Error",
              description: "Failed to fetch vehicle data.",
              variant: "destructive",
            });
          }

          if (vehicle) {
            // Convert mileage to string for the Input component
            const mileageString = vehicle.mileage !== null ? vehicle.mileage.toString() : '';

            reset({
              ...vehicle,
              mileage: vehicle.mileage,
              zip_code: vehicle.zip_code || '',
            });
            setPhotos(vehicle.photos || []);
            setSelectedYear(vehicle.year);
            setMileage(mileageString);
          }
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchVehicleData();
  }, [vehicleId, reset, toast]);

  const onSubmit = async (data: DealerVehicleFormData) => {
    setIsLoading(true);
    try {
      if (!session?.user?.id) {
        throw new Error("User not authenticated");
      }

      const vehicleData = {
        ...data,
        dealer_id: session.user.id,
        photos: photos,
        year: selectedYear,
        mileage: data.mileage
      };

      let response;
      if (vehicleId) {
        const { data: updatedVehicle, error } = await supabase
          .from('dealer_vehicles')
          .update(vehicleData)
          .eq('id', vehicleId)
          .select()
          .single();

        if (error) {
          console.error("Error updating vehicle:", error);
          toast({
            title: "Error",
            description: "Failed to update vehicle.",
            variant: "destructive",
          });
          return;
        }
        response = updatedVehicle;
      } else {
        const { data: newVehicle, error } = await supabase
          .from('dealer_vehicles')
          .insert([vehicleData])
          .select()
          .single();

        if (error) {
          console.error("Error creating vehicle:", error);
          toast({
            title: "Error",
            description: "Failed to create vehicle.",
            variant: "destructive",
          });
          return;
        }
        response = newVehicle;
      }

      toast({
        title: "Success",
        description: vehicleId ? "Vehicle updated successfully." : "Vehicle added successfully.",
      });
      onSuccess?.();
      router.refresh();
    } catch (error: any) {
      console.error("Error during form submission:", error);
      toast({
        title: "Error",
        description: error.message || "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      toast({
        title: "Error",
        description: "No files selected.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        return await uploadImage(file);
      });

      const newPhotos = await Promise.all(uploadPromises);
      setPhotos((prevPhotos) => [...prevPhotos, ...newPhotos]);
      toast({
        title: "Success",
        description: "Images uploaded successfully.",
      });
    } catch (error: any) {
      console.error("Image upload error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to upload images.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemovePhoto = (photoToRemove: string) => {
    setPhotos((prevPhotos) => prevPhotos.filter((photo) => photo !== photoToRemove));
  };

  const toggleVinLookupMode = () => {
    setIsVinLookupMode(!isVinLookupMode);
  };

  const handleVinLookupSuccess = (data: Partial<DealerVehicleFormData>) => {
    form.setValue('make', data.make || '');
    form.setValue('model', data.model || '');
    setSelectedYear(data.year || new Date().getFullYear());
    form.setValue('transmission', data.transmission || undefined);
    form.setValue('fuel_type', data.fuel_type || undefined);
    form.setValue('vin', data.vin || '');
    setIsVinLookupMode(false);
  };

  const handleVinLookupCancel = () => {
    setIsVinLookupMode(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {isVinLookupMode ? (
          <VinLookupForm onSuccess={handleVinLookupSuccess} onCancel={handleVinLookupCancel} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="make"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Make</FormLabel>
                  <FormControl>
                    <Input placeholder="Make" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Model</FormLabel>
                  <FormControl>
                    <Input placeholder="Model" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        {!isVinLookupMode && (
          <Button type="button" variant="secondary" onClick={toggleVinLookupMode}>
            Lookup VIN
          </Button>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="vin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>VIN</FormLabel>
                <FormControl>
                  <Input placeholder="Vehicle Identification Number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="zip_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Zip Code</FormLabel>
                <FormControl>
                  <Input placeholder="Zip Code" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <YearMileageInputs
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            mileage={mileage}
            setMileage={setMileage}
            errors={errors}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Price" {...field} />
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
                <FormLabel>Condition</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a condition" />
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a status" />
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

          <FormField
            control={form.control}
            name="transmission"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Transmission</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="fuel_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fuel Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
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

        <div>
          <Label>Photos</Label>
          <div className="flex items-center space-x-4">
            <Input
              id="upload"
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <Button asChild variant="secondary" disabled={isLoading}>
              <Label htmlFor="upload" className="cursor-pointer">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <ImageIcon className="mr-2 h-4 w-4" />
                    Upload Images
                  </>
                )}
              </Label>
            </Button>
          </div>
          <div className="mt-2 grid grid-cols-3 gap-4">
            {photos.map((photo, index) => (
              <div key={index} className="relative">
                <img src={photo} alt={`Uploaded ${index + 1}`} className="rounded-md" />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 rounded-full"
                  onClick={() => handleRemovePhoto(photo)}
                >
                  <DialogClose>
                    <span className="sr-only">Remove</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </DialogClose>
                </Button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Description"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <DialogFooter>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {vehicleId ? 'Updating...' : 'Adding...'}
              </>
            ) : (
              vehicleId ? 'Update Vehicle' : 'Add Vehicle'
            )}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default AddEditVehicleForm;
