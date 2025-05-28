
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { ArrowRight, Loader2 } from 'lucide-react';
import { VehicleDetailsInputs } from './form-parts/VehicleDetailsInputs';
import { ConditionAndFuelInputs } from './form-parts/ConditionAndFuelInputs';
import { ZipCodeInput } from './form-parts/ZipCodeInput';
import { AccidentHistorySection } from './form-parts/AccidentHistorySection';
import { ServiceHistorySection } from './form-parts/ServiceHistorySection';
import { TitleStatusSection } from './form-parts/TitleStatusSection';
import { AdditionalDetailsSection } from './form-parts/AdditionalDetailsSection';
import { ManualEntryFormData, ConditionLevel, ManualEntryFormProps } from './types/manualEntry';

export const ManualEntryFormFree: React.FC<ManualEntryFormProps> = ({
  onSubmit,
  isLoading = false,
  submitButtonText = "Get Valuation",
  isPremium = false
}) => {
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState<number | string | ''>(new Date().getFullYear());
  const [mileage, setMileage] = useState<number | string>(0);
  const [condition, setCondition] = useState<ConditionLevel>(ConditionLevel.Good);
  const [zipCode, setZipCode] = useState('');
  const [fuelType, setFuelType] = useState('Gasoline');
  const [transmission, setTransmission] = useState('Automatic');
  const [trim, setTrim] = useState('');
  const [color, setColor] = useState('');
  const [vin, setVin] = useState('');
  
  // Follow-up questions state
  const [hasAccident, setHasAccident] = useState<boolean | null>(null);
  const [accidentSeverity, setAccidentSeverity] = useState<'minor' | 'moderate' | 'severe'>('minor');
  const [accidentRepaired, setAccidentRepaired] = useState<boolean>(true);
  const [accidentDescription, setAccidentDescription] = useState('');
  
  const [serviceHistory, setServiceHistory] = useState<'dealer' | 'independent' | 'owner' | 'unknown'>('dealer');
  const [hasRegularMaintenance, setHasRegularMaintenance] = useState<boolean | null>(null);
  const [maintenanceNotes, setMaintenanceNotes] = useState('');
  
  const [titleStatus, setTitleStatus] = useState<'clean' | 'salvage' | 'rebuilt' | 'branded' | 'lemon'>('clean');
  const [previousOwners, setPreviousOwners] = useState<number>(1);
  const [previousUse, setPreviousUse] = useState<'personal' | 'commercial' | 'rental' | 'emergency'>('personal');
  
  const [tireCondition, setTireCondition] = useState<'excellent' | 'good' | 'worn' | 'replacement'>('good');
  const [dashboardLights, setDashboardLights] = useState<string[]>([]);
  const [hasModifications, setHasModifications] = useState<boolean>(false);
  const [modificationTypes, setModificationTypes] = useState<string[]>([]);
  
  const [isValid, setIsValid] = useState(false);
  
  // Validate form fields
  useEffect(() => {
    const isValidForm = Boolean(
      make.trim() !== '' && 
      model.trim() !== '' && 
      zipCode.length === 5
    );
    setIsValid(isValidForm);
  }, [make, model, zipCode]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!make.trim()) {
      toast({
        title: "Please enter the vehicle make",
        variant: "destructive"
      });
      return;
    }
    
    if (!model.trim()) {
      toast({
        title: "Please enter the vehicle model",
        variant: "destructive"
      });
      return;
    }
    
    if (!zipCode || zipCode.length !== 5) {
      toast({
        title: "Please enter a valid ZIP code",
        variant: "destructive"
      });
      return;
    }
    
    const formattedData: ManualEntryFormData = {
      make,
      model,
      year: typeof year === 'number' ? year : new Date().getFullYear(),
      mileage: typeof mileage === 'number' ? mileage : parseInt(mileage.toString()) || 0,
      condition,
      zipCode,
      fuelType,
      transmission,
      trim: trim || undefined,
      color: color || undefined,
      vin: vin || undefined,
      accidentDetails: {
        hasAccident: hasAccident || false,
        severity: hasAccident ? accidentSeverity : undefined,
        repaired: hasAccident ? accidentRepaired : undefined,
        description: hasAccident && accidentDescription ? accidentDescription : undefined
      },
      selectedFeatures: []
    };
    
    onSubmit(formattedData);
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
        <CardContent className="space-y-6 pt-6">
          {/* Basic Vehicle Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Vehicle Details</h3>
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
            
            {isPremium && (
              <div>
                <label htmlFor="vin" className="block text-sm font-medium text-gray-700 mb-1">
                  VIN (Optional)
                </label>
                <input
                  id="vin"
                  value={vin}
                  onChange={(e) => setVin(e.target.value)}
                  placeholder="Enter 17-character VIN"
                  maxLength={17}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
          </div>
          
          {/* Condition and Fuel */}
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
          
          {/* ZIP Code */}
          <div className="space-y-4">
            <ZipCodeInput 
              zipCode={zipCode}
              setZipCode={setZipCode}
            />
          </div>

          {/* Follow-up Questions */}
          <AccidentHistorySection
            hasAccident={hasAccident}
            setHasAccident={setHasAccident}
            accidentSeverity={accidentSeverity}
            setAccidentSeverity={setAccidentSeverity}
            accidentRepaired={accidentRepaired}
            setAccidentRepaired={setAccidentRepaired}
            accidentDescription={accidentDescription}
            setAccidentDescription={setAccidentDescription}
          />

          <ServiceHistorySection
            serviceHistory={serviceHistory}
            setServiceHistory={setServiceHistory}
            hasRegularMaintenance={hasRegularMaintenance}
            setHasRegularMaintenance={setHasRegularMaintenance}
            maintenanceNotes={maintenanceNotes}
            setMaintenanceNotes={setMaintenanceNotes}
          />

          <TitleStatusSection
            titleStatus={titleStatus}
            setTitleStatus={setTitleStatus}
            previousOwners={previousOwners}
            setPreviousOwners={setPreviousOwners}
            previousUse={previousUse}
            setPreviousUse={setPreviousUse}
          />

          <AdditionalDetailsSection
            tireCondition={tireCondition}
            setTireCondition={setTireCondition}
            dashboardLights={dashboardLights}
            setDashboardLights={setDashboardLights}
            hasModifications={hasModifications}
            setHasModifications={setHasModifications}
            modificationTypes={modificationTypes}
            setModificationTypes={setModificationTypes}
          />
        </CardContent>
        
        <CardFooter className="border-t p-6 bg-gray-50">
          <Button 
            type="submit"
            className="w-full" 
            disabled={isLoading || !isValid}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                {submitButtonText} <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ManualEntryFormFree;
