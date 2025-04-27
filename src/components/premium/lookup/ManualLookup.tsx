
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { BasicVehicleInfo } from './form-parts/BasicVehicleInfo';
import { ConditionInput } from './form-parts/ConditionInput';
import { ComprehensiveFeatureSelector } from '@/components/premium/features/ComprehensiveFeatureSelector';
import { toast } from 'sonner';
import { ConditionLevel } from '@/components/lookup/types/manualEntry';

interface ManualLookupProps {
  isLoading?: boolean;
  onSubmit?: (data: any) => void;
}

export function ManualLookup({ isLoading = false, onSubmit }: ManualLookupProps) {
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState<number | ''>('');
  const [mileage, setMileage] = useState('');
  const [condition, setCondition] = useState<ConditionLevel>('good');
  const [conditionValue, setConditionValue] = useState<number>(75);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [formTouched, setFormTouched] = useState(false);
  
  useEffect(() => {
    if (conditionValue <= 25) setCondition('poor');
    else if (conditionValue <= 50) setCondition('fair');
    else if (conditionValue <= 75) setCondition('good');
    else setCondition('excellent');
  }, [conditionValue]);

  const validateForm = (): boolean => {
    setFormTouched(true);
    
    if (!make || !model || !year || !mileage) {
      toast.error("Please fill in all required fields");
      return false;
    }
    
    if (parseInt(mileage) <= 0) {
      toast.error("Mileage must be greater than 0");
      return false;
    }
    
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    if (onSubmit) {
      const data = {
        make,
        model,
        year,
        mileage: parseInt(mileage),
        condition,
        selectedFeatures
      };
      onSubmit(data);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <Badge variant="outline" className="bg-slate-100 text-slate-700 border-slate-200">
          <FileText className="h-4 w-4 mr-1" />
          Manual Entry
        </Badge>
        <p className="text-sm text-slate-500">Full Control & Customization</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <BasicVehicleInfo
          selectedMakeId={make}
          setSelectedMakeId={setMake}
          selectedModel={model}
          setSelectedModel={setModel}
          selectedYear={year}
          setSelectedYear={setYear}
          mileage={mileage}
          setMileage={setMileage}
          isDisabled={isLoading}
        />
        
        <ConditionInput
          condition={condition}
          conditionValue={conditionValue}
          onChange={setCondition}
          onSliderChange={setConditionValue}
          disabled={isLoading}
        />
        
        <div className="space-y-4">
          <ComprehensiveFeatureSelector
            selectedFeatures={selectedFeatures}
            onFeaturesChange={setSelectedFeatures}
            disabled={isLoading}
          />
        </div>
        
        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={isLoading}
            className="px-6"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Get Vehicle Valuation"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
