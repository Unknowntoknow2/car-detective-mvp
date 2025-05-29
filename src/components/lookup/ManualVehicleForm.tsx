
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useMakeModels } from '@/hooks/useMakeModels';

const manualVehicleSchema = z.object({
  make: z.string().min(1, 'Make is required'),
  model: z.string().min(1, 'Model is required'),
  year: z.number().min(1980, 'Year must be 1980 or later').max(new Date().getFullYear() + 1),
  trim: z.string().optional(),
  fuelType: z.string().min(1, 'Fuel type is required'),
  transmission: z.string().min(1, 'Transmission is required'),
  drivetrain: z.string().min(1, 'Drivetrain is required'),
  bodyType: z.string().min(1, 'Body type is required'),
  vin: z.string().optional(),
});

type ManualVehicleFormData = z.infer<typeof manualVehicleSchema>;

interface ManualVehicleFormProps {
  onSubmit: (data: ManualVehicleFormData) => void;
  isLoading?: boolean;
}

export function ManualVehicleForm({ onSubmit, isLoading }: ManualVehicleFormProps) {
  const [selectedMakeId, setSelectedMakeId] = useState<string>('');
  const [selectedModelId, setSelectedModelId] = useState<string>('');
  
  const {
    makes,
    models,
    trims,
    isLoading: isLoadingData,
    isLoadingModels,
    isLoadingTrims,
    error,
    getModelsByMakeId,
    getTrimsByModelId,
    findMakeById,
    findModelById,
  } = useMakeModels();

  const form = useForm<ManualVehicleFormData>({
    resolver: zodResolver(manualVehicleSchema),
    defaultValues: {
      make: '',
      model: '',
      year: new Date().getFullYear(),
      trim: '',
      fuelType: '',
      transmission: '',
      drivetrain: '',
      bodyType: '',
      vin: '',
    },
  });

  const handleMakeChange = async (makeId: string) => {
    setSelectedMakeId(makeId);
    setSelectedModelId('');
    
    const make = findMakeById(makeId);
    if (make) {
      form.setValue('make', make.make_name);
      form.setValue('model', '');
      form.setValue('trim', '');
    }
    
    // Load models for this make
    await getModelsByMakeId(makeId);
  };

  const handleModelChange = async (modelId: string) => {
    setSelectedModelId(modelId);
    
    const model = findModelById(modelId);
    if (model) {
      form.setValue('model', model.model_name);
      form.setValue('trim', '');
    }
    
    // Load trims for this model
    await getTrimsByModelId(modelId);
  };

  const handleTrimChange = (trimName: string) => {
    form.setValue('trim', trimName);
  };

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: currentYear - 1979 }, (_, i) => currentYear - i);

  const fuelTypes = [
    { value: 'gasoline', label: 'Gasoline' },
    { value: 'diesel', label: 'Diesel' },
    { value: 'hybrid', label: 'Hybrid' },
    { value: 'electric', label: 'Electric' },
    { value: 'alternative', label: 'Alternative' },
  ];

  const transmissionTypes = [
    { value: 'automatic', label: 'Automatic' },
    { value: 'manual', label: 'Manual' },
    { value: 'cvt', label: 'CVT' },
    { value: 'dual_clutch', label: 'Dual Clutch' },
    { value: 'sequential', label: 'Sequential' },
  ];

  const drivetrainTypes = [
    { value: 'fwd', label: 'Front-Wheel Drive (FWD)' },
    { value: 'rwd', label: 'Rear-Wheel Drive (RWD)' },
    { value: 'awd', label: 'All-Wheel Drive (AWD)' },
    { value: '4wd', label: 'Four-Wheel Drive (4WD)' },
  ];

  const bodyTypes = [
    { value: 'sedan', label: 'Sedan' },
    { value: 'suv', label: 'SUV' },
    { value: 'coupe', label: 'Coupe' },
    { value: 'hatchback', label: 'Hatchback' },
    { value: 'wagon', label: 'Wagon' },
    { value: 'convertible', label: 'Convertible' },
    { value: 'pickup', label: 'Pickup Truck' },
    { value: 'van', label: 'Van' },
    { value: 'crossover', label: 'Crossover' },
  ];

  const filteredModels = models.filter(model => model.make_id === selectedMakeId);

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-red-600">
            <p className="mb-2">Error loading vehicle data</p>
            <p className="text-sm">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vehicle Specifications</CardTitle>
        <p className="text-sm text-muted-foreground">
          Enter your vehicle's basic information. Additional details will be collected in the next step.
        </p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Make Field */}
              <FormField
                control={form.control}
                name="make"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Make *</FormLabel>
                    <Select
                      value={selectedMakeId}
                      onValueChange={handleMakeChange}
                      disabled={isLoadingData}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={isLoadingData ? "Loading makes..." : "Select make"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {makes.map(make => (
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

              {/* Model Field */}
              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Model *</FormLabel>
                    <Select
                      value={selectedModelId}
                      onValueChange={handleModelChange}
                      disabled={!selectedMakeId || isLoadingModels}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={
                            !selectedMakeId 
                              ? "Select make first" 
                              : isLoadingModels
                                ? "Loading models..."
                                : filteredModels.length === 0
                                  ? "No models available"
                                  : "Select model"
                          } />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {filteredModels.map(model => (
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

              {/* Year Field */}
              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year *</FormLabel>
                    <Select
                      value={field.value?.toString()}
                      onValueChange={(value) => field.onChange(parseInt(value))}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {yearOptions.map(year => (
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

              {/* Trim Field */}
              <FormField
                control={form.control}
                name="trim"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trim Level (Optional)</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={handleTrimChange}
                      disabled={!selectedModelId || isLoadingTrims}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={
                            !selectedModelId
                              ? "Select model first"
                              : isLoadingTrims
                                ? "Loading trims..."
                                : trims.length === 0
                                  ? "No trims available"
                                  : "Select trim (optional)"
                          } />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {trims.map(trim => (
                          <SelectItem key={trim.id} value={trim.trim_name}>
                            {trim.trim_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Fuel Type Field */}
              <FormField
                control={form.control}
                name="fuelType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fuel Type *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select fuel type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {fuelTypes.map(fuel => (
                          <SelectItem key={fuel.value} value={fuel.value}>
                            {fuel.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Transmission Field */}
              <FormField
                control={form.control}
                name="transmission"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Transmission *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select transmission" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {transmissionTypes.map(trans => (
                          <SelectItem key={trans.value} value={trans.value}>
                            {trans.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Drivetrain Field */}
              <FormField
                control={form.control}
                name="drivetrain"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Drivetrain *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select drivetrain" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {drivetrainTypes.map(drive => (
                          <SelectItem key={drive.value} value={drive.value}>
                            {drive.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Body Type Field */}
              <FormField
                control={form.control}
                name="bodyType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Body Type *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select body type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {bodyTypes.map(body => (
                          <SelectItem key={body.value} value={body.value}>
                            {body.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* VIN Field */}
            <FormField
              control={form.control}
              name="vin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>VIN (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="17-character VIN for enhanced accuracy"
                      {...field}
                      maxLength={17}
                      className="uppercase"
                      onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                    />
                  </FormControl>
                  <p className="text-sm text-muted-foreground">
                    VIN helps improve valuation accuracy but is not required
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading || isLoadingData}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Continue to Vehicle Details'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
