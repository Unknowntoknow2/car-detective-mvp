
import React from 'react';
import { AccidentDetailsForm } from './AccidentDetailsForm';
import { AccidentDetails } from '../types/manualEntry';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { AlertCircle, ShieldAlert, CheckCircle } from 'lucide-react';
import { DesignCard } from '@/components/ui/design-system';

interface PremiumFieldsProps {
  accident: string;
  setAccident: (value: string) => void;
  accidentDetails: AccidentDetails;
  setAccidentDetails: (details: AccidentDetails) => void;
  isDisabled: boolean;
}

export const PremiumFields: React.FC<PremiumFieldsProps> = ({
  accident,
  setAccident,
  accidentDetails,
  setAccidentDetails,
  isDisabled
}) => {
  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-lg font-medium flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-primary" />
          Accident History
        </h3>
        
        <p className="text-sm text-text-secondary mb-4">
          Providing accurate accident information helps us deliver a more precise valuation.
          This information is validated against CARFAX® records in premium reports.
        </p>
        
        <div className="flex items-center gap-6">
          <Label className="font-medium">Has this vehicle been in an accident?</Label>
          <RadioGroup
            value={accident}
            onValueChange={setAccident}
            className="flex space-x-6"
            disabled={isDisabled}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="no" />
              <Label htmlFor="no" className="font-normal">No</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="yes" />
              <Label htmlFor="yes" className="font-normal">Yes</Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      {accident === "yes" ? (
        <DesignCard
          variant="outline"
          className="border-primary/20 bg-primary-light/10"
        >
          <div className="space-y-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
              <div>
                <h4 className="font-medium">Accident Details</h4>
                <p className="text-sm text-text-secondary mt-1">
                  Provide additional information about the accident(s) to improve valuation accuracy.
                  Premium reports include full CARFAX® accident history verification.
                </p>
              </div>
            </div>
            
            <AccidentDetailsForm
              accidentDetails={accidentDetails}
              setAccidentDetails={setAccidentDetails}
              disabled={isDisabled}
            />
          </div>
        </DesignCard>
      ) : (
        <DesignCard
          variant="outline"
          className="border-success/20 bg-success-light/10"
        >
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-success mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-medium">No Accidents Reported</h4>
              <p className="text-sm text-text-secondary mt-1">
                Vehicles without accident history typically maintain higher resale value.
                Our premium report will verify this status through CARFAX® records.
              </p>
            </div>
          </div>
        </DesignCard>
      )}
    </div>
  );
};
