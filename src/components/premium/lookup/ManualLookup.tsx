
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Loader2, Info, Check, Shield, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { BasicVehicleInfo } from './form-parts/BasicVehicleInfo';
import { ConditionInput } from './form-parts/ConditionInput';
import { ComprehensiveFeatureSelector } from '@/components/premium/features/ComprehensiveFeatureSelector';
import { toast } from 'sonner';
import { ConditionLevel } from '@/components/lookup/types/manualEntry';
import { motion } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { Card } from '@/components/ui/card';
import { AccidentToggle } from '../form/steps/vehicle-details/AccidentToggle';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { FormValidationError } from '../common/FormValidationError';

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
  const [hasAccident, setHasAccident] = useState(false);
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
    
    if (hasAccident && !accidentDescription.trim()) {
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
        accidentDescription: hasAccident ? accidentDescription : ''
      };
      onSubmit(data);
    }
  };

  const estimatedFeatureValue = selectedFeatures.length * 250;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-slate-100 text-slate-700 border-slate-200 px-3 py-1.5">
            <FileText className="h-4 w-4 mr-2" />
            Manual Entry
          </Badge>
          <p className="text-sm font-medium text-slate-600">Detailed Vehicle Information</p>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="sm" className="text-slate-500 h-8">
                <Info className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left" className="max-w-xs">
              <p className="text-sm">Enter your vehicle details manually for the most accurate valuation. More details = better results.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <Card className="p-6 border border-slate-200 shadow-sm bg-white">
          <h3 className="text-lg font-medium text-slate-800 mb-4 flex items-center">
            <Zap className="h-5 w-5 mr-2 text-primary" />
            Vehicle Details
          </h3>
          
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
        </Card>
        
        <Card className="p-6 border border-slate-200 shadow-sm bg-white">
          <h3 className="text-lg font-medium text-slate-800 mb-4 flex items-center">
            <Shield className="h-5 w-5 mr-2 text-primary" />
            Condition & History
          </h3>
          
          <ConditionInput
            condition={condition}
            conditionValue={conditionValue}
            onChange={setCondition}
            onSliderChange={setConditionValue}
            disabled={isLoading}
          />
          
          <Separator className="my-6" />
          
          <div className="space-y-4">
            <h4 className="text-base font-medium text-slate-700">Accident History</h4>
            <p className="text-sm text-slate-500 mb-3">
              Vehicles without accident history typically maintain 15-20% higher resale value
            </p>
            
            <AccidentToggle 
              hasAccident={hasAccident} 
              onToggle={setHasAccident} 
            />
            
            {hasAccident && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
                className="mt-4 space-y-2"
              >
                <Label htmlFor="accidentDescription" className="text-sm font-medium text-slate-700">
                  Accident Details <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="accidentDescription"
                  placeholder="Please describe the accident(s), including severity, when it happened, and what parts of the vehicle were affected."
                  value={accidentDescription}
                  onChange={(e) => setAccidentDescription(e.target.value)}
                  className={errors.accidentDescription ? "border-red-300 focus:ring-red-200" : ""}
                  rows={3}
                />
                {errors.accidentDescription && <FormValidationError error={errors.accidentDescription} />}
              </motion.div>
            )}
          </div>
        </Card>
        
        <Card className="p-6 border border-slate-200 shadow-sm bg-white">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-slate-800 flex items-center">
              <Check className="h-5 w-5 mr-2 text-primary" />
              Premium Features
            </h3>
            
            {selectedFeatures.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium"
              >
                +${estimatedFeatureValue.toLocaleString()} estimated value
              </motion.div>
            )}
          </div>
          
          <p className="text-sm text-slate-500 mb-5">
            Select all premium features that are present in your vehicle
          </p>
          
          <ComprehensiveFeatureSelector
            selectedFeatures={selectedFeatures}
            onFeaturesChange={setSelectedFeatures}
            disabled={isLoading}
          />
        </Card>
        
        <div className="sticky bottom-4 pt-4 flex justify-end">
          <motion.div
            whileHover={{ scale: isLoading ? 1 : 1.02 }}
            whileTap={{ scale: isLoading ? 1 : 0.98 }}
          >
            <Button 
              type="submit" 
              disabled={isLoading}
              className="px-6 py-2.5 h-12 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg shadow-sm hover:shadow-md transition-all"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                "Submit Vehicle Details"
              )}
            </Button>
          </motion.div>
        </div>
      </form>
    </motion.div>
  );
}
