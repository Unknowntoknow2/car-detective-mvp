import React from 'react';
import { TitleStatusSection } from './TitleStatusSection';
// Manual entry types (inline since we removed the separate file)
interface ManualEntryFormData {
  year: string;
  make: string;
  model: string;
  trim?: string;
  mileage: string;
  condition: string;
  zipCode: string;
  fuelType?: string;
  transmission?: string;
  accidentDetails?: AccidentDetails;
  titleStatus?: 'clean' | 'salvage' | 'rebuilt' | 'branded' | 'lemon';
  previousOwners?: number;
  previousUse?: 'personal' | 'commercial' | 'rental' | 'emergency';
  serviceHistory?: 'dealer' | 'independent' | 'owner' | 'unknown';
  hasRegularMaintenance?: boolean;
  maintenanceNotes?: string;
  tireCondition?: TireConditionOption;
  dashboardLights?: string[];
  hasModifications?: boolean;
  modificationTypes?: string[];
  [key: string]: any;
}
import { AccidentDetails } from '@/types/follow-up-answers';
import { TireConditionOption } from '@/types/condition';

// Use shared components from premium
import { AccidentSection } from '@/components/premium/lookup/form-parts/AccidentSection';

interface UnifiedFollowUpQuestionsProps {
  formData: ManualEntryFormData;
  updateFormData: (updates: Partial<ManualEntryFormData>) => void;
}

export function UnifiedFollowUpQuestions({
  formData,
  updateFormData
}: UnifiedFollowUpQuestionsProps) {
  // Default accident details with all required properties
  const defaultAccidentDetails: AccidentDetails = {
    hadAccident: false,
    severity: 'minor',
    repaired: false,
    frameDamage: false,
    count: 0,
    location: '',
    description: ''
  };

  // Title Status handlers
  const setTitleStatus = (value: 'clean' | 'salvage' | 'rebuilt' | 'branded' | 'lemon') => {
    updateFormData({ titleStatus: value });
  };

  const setPreviousOwners = (value: number) => {
    updateFormData({ previousOwners: value });
  };

  const setPreviousUse = (value: 'personal' | 'commercial' | 'rental' | 'emergency') => {
    updateFormData({ previousUse: value });
  };

  // Helper function to safely get existing accident details
  const getExistingAccidentDetails = (): AccidentDetails => {
    const existing = formData.accidentDetails;
    if (!existing) return defaultAccidentDetails;
    
    return {
      hadAccident: Boolean(existing.hadAccident),
      severity: (existing.severity === 'minor' || existing.severity === 'moderate' || existing.severity === 'major') 
        ? existing.severity 
        : 'minor',
      repaired: existing.repaired ?? false,
      frameDamage: existing.frameDamage ?? false,
      count: existing.count ?? 0,
      location: existing.location ?? '',
      description: existing.description ?? ''
    };
  };

  // Accident History handlers using shared component format
  const setHasAccident = (value: string) => {
    const existingDetails = getExistingAccidentDetails();
    const updatedDetails: AccidentDetails = {
      ...existingDetails,
      hadAccident: value === 'yes'
    };
    updateFormData({ accidentDetails: updatedDetails });
  };

  const setAccidentDescription = (value: string) => {
    const existingDetails = getExistingAccidentDetails();
    const updatedDetails: AccidentDetails = {
      ...existingDetails,
      description: value
    };
    updateFormData({ accidentDetails: updatedDetails });
  };

  // Additional Details handlers
  const setTireCondition = (value: TireConditionOption) => {
    updateFormData({ tireCondition: value });
  };

  const setDashboardLights = (value: string[]) => {
    updateFormData({ dashboardLights: value });
  };

  const setHasModifications = (value: boolean) => {
    updateFormData({ hasModifications: value });
  };

  const setModificationTypes = (value: string[]) => {
    updateFormData({ modificationTypes: value });
  };

  // Safely get accident details with proper typing
  const currentAccidentDetails = getExistingAccidentDetails();
  
  const hasAccidentValue: string = currentAccidentDetails.hadAccident ? 'yes' : 'no';

  return (
    <div className="space-y-8">
      <TitleStatusSection
        titleStatus={formData.titleStatus || 'clean'}
        setTitleStatus={setTitleStatus}
        previousOwners={formData.previousOwners || 1}
        setPreviousOwners={setPreviousOwners}
        previousUse={formData.previousUse || 'personal'}
        setPreviousUse={setPreviousUse}
      />

      <AccidentSection
        hasAccident={hasAccidentValue}
        setHasAccident={setHasAccident}
        accidentSeverity={currentAccidentDetails.severity || 'minor'}
        setAccidentSeverity={(value: string) => {
          const existingDetails = getExistingAccidentDetails();
          const updatedDetails: AccidentDetails = {
            ...existingDetails,
            severity: value as 'minor' | 'moderate' | 'major'
          };
          updateFormData({ accidentDetails: updatedDetails });
        }}
      />

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Additional Details</h3>
        
        <div>
          <label className="block text-sm font-medium mb-2">Tire Condition</label>
          <select 
            value={formData.tireCondition || 'good'} 
            onChange={(e) => setTireCondition(e.target.value as TireConditionOption)}
            className="w-full p-2 border rounded"
          >
            <option value="excellent">Excellent</option>
            <option value="good">Good</option>
            <option value="worn">Worn</option>
            <option value="replacement">Needs Replacement</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Dashboard Warning Lights</label>
          <textarea
            value={formData.dashboardLights?.join(', ') || ''}
            onChange={(e) => setDashboardLights(e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
            placeholder="Enter any dashboard warning lights"
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.hasModifications || false}
              onChange={(e) => setHasModifications(e.target.checked)}
            />
            <span>Vehicle has modifications</span>
          </label>
        </div>

        {formData.hasModifications && (
          <div>
            <label className="block text-sm font-medium mb-2">Modification Types</label>
            <textarea
              value={formData.modificationTypes?.join(', ') || ''}
              onChange={(e) => setModificationTypes(e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
              placeholder="Describe modifications"
              className="w-full p-2 border rounded"
            />
          </div>
        )}
      </div>
    </div>
  );
}
