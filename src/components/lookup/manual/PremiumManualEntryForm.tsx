import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
<<<<<<< HEAD
import { AutoCompleteVehicleSelector } from '@/components/lookup/form-parts/AutoCompleteVehicleSelector';
import { ZipCodeInput } from '@/components/lookup/form-parts/ZipCodeInput';
import { Checkbox } from '@/components/ui/checkbox';
=======
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.string().min(4, "Year must be 4 digits").max(4, "Year must be 4 digits"),
  mileage: z.string().min(1, "Mileage is required"),
  condition: z.string().min(1, "Condition is required"),
  zipCode: z.string().min(5, "ZIP Code must be 5 digits").max(5, "ZIP Code must be 5 digits"),
  transmission: z.string().optional(),
  fuelType: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;
>>>>>>> origin/main

interface PremiumManualEntryFormProps {
  onSubmit: (data: any) => void;
  isLoading?: boolean;
  submitButtonText?: string;
}

<<<<<<< HEAD
const PremiumManualEntryForm: React.FC<PremiumManualEntryFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<ManualEntryFormData>({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    mileage: 0,
    condition: ConditionLevel.Good,
    zipCode: '',
    fuelType: 'Gasoline',
    transmission: 'Automatic',
    vin: '',
    valuationId: '',
    confidenceScore: 0,
    accident: false,
    accidentDetails: {
      severity: 'Minor'
=======
const PremiumManualEntryForm: React.FC<PremiumManualEntryFormProps> = ({ 
  onSubmit, 
  isLoading = false, 
  submitButtonText = "Get Premium Valuation" 
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      make: '',
      model: '',
      year: '',
      mileage: '',
      condition: 'Good',
      zipCode: '',
      transmission: 'Automatic',
      fuelType: 'Gasoline',
>>>>>>> origin/main
    },
  });
<<<<<<< HEAD

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMakeChange = (make: string) => {
    setFormData(prev => ({ ...prev, make }));
  };

  const handleModelChange = (model: string) => {
    setFormData(prev => ({ ...prev, model }));
  };

  const handleZipCodeChange = (zipCode: string) => {
    setFormData(prev => ({ ...prev, zipCode }));
  };

  const handleFeatureChange = (feature: string, checked: boolean) => {
    const current = formData.selectedFeatures || [];
    const updated = checked ? [...current, feature] : current.filter(f => f !== feature);
    setFormData(prev => ({ ...prev, selectedFeatures: updated }));
  };

  const handleAccidentDetailChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      accidentDetails: {
        ...prev.accidentDetails,
        [name]: value
      }
    }));
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!formData.make) errors.make = 'Make is required';
    if (!formData.model) errors.model = 'Model is required';
    if (!formData.year) errors.year = 'Year is required';
    if (!formData.mileage && formData.mileage !== 0) errors.mileage = 'Mileage is required';
    if (!formData.zipCode) errors.zipCode = 'ZIP Code is required';
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const processedData = {
        ...formData,
        year: typeof formData.year === 'string' ? parseInt(formData.year) : formData.year,
        mileage: typeof formData.mileage === 'string' ? parseInt(formData.mileage) : formData.mileage
      };
      onSubmit(processedData);
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  const features = [
    'Leather Seats',
    'Sunroof',
    'Navigation System',
    'Bluetooth',
    'Backup Camera',
    'Heated Seats',
    'Third Row Seating',
    'Premium Sound System'
  ];

  const accidentSeverities = ['Minor', 'Moderate', 'Severe'];

=======
  
  const handleSubmit = (values: FormValues) => {
    setIsSubmitting(true);
    
    // Convert form data to the format expected by the valuation system
    const processedData = {
      identifierType: 'manual',
      identifier: JSON.stringify({
        make: values.make,
        model: values.model,
        year: values.year,
        mileage: values.mileage,
        zipCode: values.zipCode,
      }),
      make: values.make,
      model: values.model,
      year: parseInt(values.year),
      mileage: parseInt(values.mileage),
      condition: values.condition,
      zipCode: values.zipCode,
      transmission: values.transmission,
      fuelType: values.fuelType,
    };
    
    onSubmit(processedData);
    setIsSubmitting(false);
  };
  
>>>>>>> origin/main
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="make"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Make</FormLabel>
                <FormControl>
                  <Input placeholder="Toyota" {...field} />
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
                  <Input placeholder="Camry" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
<<<<<<< HEAD

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Year</Label>
            <Select
              value={formData.year.toString()}
              onValueChange={(val) => handleSelectChange('year', parseInt(val))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {validationErrors.year && <p className="text-sm text-red-500">{validationErrors.year}</p>}
          </div>

          <div>
            <Label>Mileage</Label>
            <Input
              name="mileage"
              type="number"
              value={formData.mileage.toString()}
              onChange={(e) => handleSelectChange('mileage', parseInt(e.target.value))}
              placeholder="e.g. 45000"
            />
            {validationErrors.mileage && <p className="text-sm text-red-500">{validationErrors.mileage}</p>}
          </div>
=======
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Year</FormLabel>
                <FormControl>
                  <Input placeholder="2020" {...field} />
                </FormControl>
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
                  <Input placeholder="15000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="zipCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ZIP Code</FormLabel>
                <FormControl>
                  <Input placeholder="90210" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
>>>>>>> origin/main
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="condition"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Condition</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Excellent">Excellent</SelectItem>
                    <SelectItem value="Very Good">Very Good</SelectItem>
                    <SelectItem value="Good">Good</SelectItem>
                    <SelectItem value="Fair">Fair</SelectItem>
                    <SelectItem value="Poor">Poor</SelectItem>
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
                    <SelectItem value="Dual-Clutch">Dual-Clutch</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="fuelType"
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
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                    <SelectItem value="Electric">Electric</SelectItem>
                    <SelectItem value="Plug-in Hybrid">Plug-in Hybrid</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
<<<<<<< HEAD

        <div>
          <Label>Accident Details</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Severity</Label>
              <Select
                value={formData.accidentDetails.severity}
                onValueChange={(val) => handleAccidentDetailChange('severity', val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Severity" />
                </SelectTrigger>
                <SelectContent>
                  {accidentSeverities.map((severity) => (
                    <SelectItem key={severity} value={severity}>{severity}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div>
          <Label>Features (Optional)</Label>
          <div className="grid grid-cols-2 gap-2">
            {features.map((feature) => (
              <div key={feature} className="flex items-center space-x-2">
                <Checkbox
                  id={`feature-${feature}`}
                  checked={(formData.selectedFeatures || []).includes(feature)}
                  onCheckedChange={(checked) => handleFeatureChange(feature, !!checked)}
                />
                <Label htmlFor={`feature-${feature}`}>{feature}</Label>
              </div>
            ))}
          </div>
=======
        
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting || isLoading}>
            {isSubmitting || isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              submitButtonText
            )}
          </Button>
>>>>>>> origin/main
        </div>
      </form>
    </Form>
  );
};

export default PremiumManualEntryForm;
