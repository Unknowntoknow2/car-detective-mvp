import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { ManualEntryFormData } from '@/components/lookup/types/manualEntry';
import { supabase } from '@/lib/supabaseClient';
import { VehicleDetailsInputs } from '@/components/lookup/form-parts/VehicleDetailsInputs';
import { ConditionAndFuelInputs } from '@/components/lookup/form-parts/ConditionAndFuelInputs';
import { ZipCodeInput } from '@/components/lookup/form-parts/ZipCodeInput';

export interface PremiumManualEntryFormProps {
  onSubmit?: (data: ManualEntryFormData) => void;
  isLoading?: boolean;
  submitButtonText?: string;
  isPremium?: boolean;
}

export const PremiumManualEntryForm: React.FC<PremiumManualEntryFormProps> = ({
  onSubmit,
  isLoading = false,
  submitButtonText = "Get Premium Valuation",
  isPremium = true
}) => {
  const navigate = useNavigate();
  const [formLoading, setFormLoading] = useState(false);
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState<number | string | ''>(new Date().getFullYear());
  const [mileage, setMileage] = useState<number | string>(0);
  const [condition, setCondition] = useState('good');
  const [zipCode, setZipCode] = useState('');
  const [fuelType, setFuelType] = useState('Gasoline');
  const [transmission, setTransmission] = useState('Automatic');
  const [trim, setTrim] = useState('');
  const [color, setColor] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!make.trim()) {
      toast({
        title: "Error",
        description: "Please enter the vehicle make",
        variant: "destructive"
      });
      return;
    }
    
    if (!model.trim()) {
      toast({
        title: "Error",
        description: "Please enter the vehicle model",
        variant: "destructive"
      });
      return;
    }
    
    if (!zipCode || zipCode.length !== 5) {
      toast({
        title: "Error",
        description: "Please enter a valid ZIP code",
        variant: "destructive"
      });
      return;
    }
    
    const formattedData: ManualEntryFormData = {
      make,
      model,
      year: typeof year === 'number' ? year : parseInt(year.toString()) || new Date().getFullYear(),
      mileage: typeof mileage === 'number' ? mileage : parseInt(mileage.toString()) || 0,
      condition,
      zipCode,
      fuelType,
      transmission,
      trim: trim || undefined,
      color: color || undefined
    };
    
    // If parent component provides onSubmit handler, use it
    if (onSubmit) {
      onSubmit(formattedData);
      return;
    }
    
    // Otherwise, handle submission internally
    setFormLoading(true);
    
    try {
      // Store data in Supabase
      const { data, error } = await supabase
        .from('valuations')
        .insert({
          make: formattedData.make,
          model: formattedData.model,
          year: formattedData.year,
          mileage: formattedData.mileage,
          condition: formattedData.condition,
          state: formattedData.zipCode,
          fuel_type: formattedData.fuelType,
          transmission: formattedData.transmission,
          color: formattedData.color,
          body_type: 'Unknown', // Default value
          is_vin_lookup: false,
          estimated_value: calculateEstimatedValue(formattedData),
          confidence_score: 75 // Manual entries get a medium confidence score
        })
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      // Navigate to the result page with the new valuation ID
      if (data && data.id) {
        toast({
          title: "Valuation Created",
          description: "Your vehicle valuation has been created successfully.",
          variant: "success"
        });
        navigate(`/valuation/${data.id}`);
      }
    } catch (error: any) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error",
        description: error.message || "There was an error creating your valuation.",
        variant: "destructive"
      });
    } finally {
      setFormLoading(false);
    }
  };

  // Helper function to calculate estimated value
  const calculateEstimatedValue = (data: ManualEntryFormData): number => {
    // Basic formula: base price adjusted for year, mileage, and condition
    const basePrice = 15000;
    const yearFactor = 1 + ((data.year - 2010) * 0.05);
    const mileageFactor = data.mileage ? 1 - ((data.mileage / 100000) * 0.2) : 1;
    
    let conditionFactor = 1;
    switch (data.condition) {
      case 'excellent':
        conditionFactor = 1.2;
        break;
      case 'good':
        conditionFactor = 1.0;
        break;
      case 'fair':
        conditionFactor = 0.8;
        break;
      case 'poor':
        conditionFactor = 0.6;
        break;
      default:
        conditionFactor = 1.0;
    }
    
    return Math.floor(basePrice * yearFactor * mileageFactor * conditionFactor);
  };

  // Create wrapper functions to handle the type differences
  const handleYearChange = (value: number | string | '') => {
    setYear(value);
  };

  const handleMileageChange = (value: number | string) => {
    setMileage(value);
  };
  
  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-4">
            <VehicleDetailsInputs 
              make={make}
              setMake={setMake}
              model={model}
              setModel={setModel}
              year={year}
              setYear={handleYearChange}
              mileage={mileage}
              setMileage={handleMileageChange}
              trim={trim}
              setTrim={setTrim}
              color={isPremium ? color : ''}
              setColor={isPremium ? setColor : undefined}
            />
          </div>
          
          <div className="space-y-4">
            <ConditionAndFuelInputs 
              condition={condition}
              setCondition={setCondition}
              fuelType={fuelType}
              setFuelType={setFuelType}
              transmission={transmission}
              setTransmission={setTransmission}
            />
          </div>
          
          <div className="space-y-4">
            <ZipCodeInput 
              zipCode={zipCode}
              setZipCode={setZipCode}
            />
          </div>
        </CardContent>
        
        <CardFooter className="border-t p-6 bg-gray-50">
          <Button 
            type="submit"
            className="w-full" 
            disabled={isLoading || formLoading}
          >
            {(isLoading || formLoading) ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              submitButtonText
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default PremiumManualEntryForm;
