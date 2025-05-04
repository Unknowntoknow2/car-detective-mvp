
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Check, Shield, Zap } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

import { BasicVehicleInfo } from './form-parts/BasicVehicleInfo';
import { ConditionInput } from './form-parts/ConditionInput';
import { ComprehensiveFeatureSelector } from '@/components/premium/features/ComprehensiveFeatureSelector';
import { ConditionLevel } from '@/components/lookup/types/manualEntry';

// Import our new components
import { FormHeader } from './form-parts/FormHeader';
import { SectionCard } from './form-parts/SectionCard';
import { AccidentSection } from './form-parts/AccidentSection';
import { FeatureValueDisplay } from './form-parts/FeatureValueDisplay';
import { SubmitButton } from './form-parts/SubmitButton';

interface ManualLookupProps {
  isLoading?: boolean;
  onSubmit?: (data: any) => void;
}

export function ManualLookup({ isLoading = false, onSubmit }: ManualLookupProps) {
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState<number | ''>('');
  const [mileage, setMileage] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [condition, setCondition] = useState<ConditionLevel>('good');
  const [conditionValue, setConditionValue] = useState<number>(75);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [hasAccident, setHasAccident] = useState('no');
  const [accidentDescription, setAccidentDescription] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formTouched, setFormTouched] = useState(false);
  
  useEffect(() => {
    if (conditionValue <= 25) setCondition('poor');
    else if (conditionValue <= 50) setCondition('fair');
    else if (conditionValue <= 75) setCondition('good');
    else setCondition('excellent');
  }, [conditionValue]);

  const validateForm = (): boolean => {
    setFormTouched(true);
    const newErrors: Record<string, string> = {};
    
    if (!make) newErrors.make = "Make selection is required";
    if (!model) newErrors.model = "Model selection is required";
    if (!year) newErrors.year = "Year selection is required";
    
    if (!mileage) {
      newErrors.mileage = "Mileage is required";
    } else if (parseInt(mileage) <= 0) {
      newErrors.mileage = "Mileage must be greater than 0";
    }
    
    if (hasAccident === 'yes' && !accidentDescription.trim()) {
      newErrors.accidentDescription = "Please provide accident details";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please correct the errors before submitting");
      return;
    }
    
    if (onSubmit) {
      const data = {
        make,
        model,
        year,
        mileage: parseInt(mileage),
        zipCode,
        condition,
        selectedFeatures,
        hasAccident,
        accidentDescription: hasAccident === 'yes' ? accidentDescription : ''
      };
      onSubmit(data);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      <FormHeader />
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <SectionCard title="Vehicle Details" icon={Zap}>
          <BasicVehicleInfo
            selectedMakeId={make}
            setSelectedMakeId={setMake}
            selectedModel={model}
            setSelectedModel={setModel}
            selectedYear={year}
            setSelectedYear={setYear}
            mileage={mileage}
            setMileage={setMileage}
            zipCode={zipCode}
            setZipCode={setZipCode}
            isDisabled={isLoading}
            errors={errors}
          />
        </SectionCard>
        
        <SectionCard title="Condition & History" icon={Shield}>
          <ConditionInput
            condition={condition}
            conditionValue={conditionValue}
            onChange={setCondition}
            onSliderChange={setConditionValue}
            disabled={isLoading}
          />
          
          <Separator className="my-6" />
          
          <AccidentSection
            hasAccident={hasAccident}
            setHasAccident={setHasAccident}
            accidentDescription={accidentDescription}
            setAccidentDescription={setAccidentDescription}
            isDisabled={isLoading}
            error={errors.accidentDescription}
          />
        </SectionCard>
        
        <SectionCard 
          title="Premium Features" 
          icon={Check}
          rightContent={<FeatureValueDisplay selectedFeatures={selectedFeatures} />}
        >
          <p className="text-sm text-slate-500 mb-5">
            Select all premium features that are present in your vehicle
          </p>
          
          <ComprehensiveFeatureSelector
            selectedFeatures={selectedFeatures}
            onFeaturesChange={setSelectedFeatures}
            disabled={isLoading}
          />
        </SectionCard>
        
        <div className="sticky bottom-4 pt-4 flex justify-end">
          <SubmitButton isLoading={isLoading} />
        </div>
      </form>
    </motion.div>
  );
}
