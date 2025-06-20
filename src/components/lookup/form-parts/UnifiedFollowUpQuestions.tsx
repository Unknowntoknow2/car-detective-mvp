
import React from 'react';
import { TitleStatusSection } from './TitleStatusSection';
import { ServiceHistorySection } from './ServiceHistorySection';
import { AccidentHistorySection } from './AccidentHistorySection';
import { AdditionalDetailsSection } from './AdditionalDetailsSection';
import { ManualEntryFormData } from '@/types/manual-entry';
import { AccidentDetails } from '@/types/accident-details';

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

  // Service History handlers
  const setServiceHistory = (value: 'dealer' | 'independent' | 'owner' | 'unknown') => {
    updateFormData({ serviceHistory: value });
  };

  const setHasRegularMaintenance = (value: boolean | undefined) => {
    updateFormData({ hasRegularMaintenance: value });
  };

  const setMaintenanceNotes = (value: string) => {
    updateFormData({ maintenanceNotes: value });
  };

  // Helper function to safely get existing accident details
  const getExistingAccidentDetails = (): AccidentDetails => {
    const existing = formData.accidentDetails;
    if (!existing) return defaultAccidentDetails;
    
    // Safely extract properties with proper typing
    return {
      hadAccident: Boolean(existing.hadAccident),
      severity: (existing.severity === 'minor' || existing.severity === 'moderate' || existing.severity === 'severe') 
        ? existing.severity 
        : 'minor',
      repaired: existing.repaired ?? false,
      count: existing.count ?? 0,
      location: existing.location ?? '',
      description: existing.description ?? ''
    };
  };

  // Accident History handlers
  const setHasAccident = (value: boolean | null) => {
    const existingDetails = getExistingAccidentDetails();
    const updatedDetails: AccidentDetails = {
      ...existingDetails,
      hadAccident: value !== null ? value : false
    };
    updateFormData({ accidentDetails: updatedDetails });
  };

  const setAccidentSeverity = (value: 'minor' | 'moderate' | 'severe') => {
    const existingDetails = getExistingAccidentDetails();
    const updatedDetails: AccidentDetails = {
      ...existingDetails,
      severity: value
    };
    updateFormData({ accidentDetails: updatedDetails });
  };

  const setAccidentRepaired = (value: boolean) => {
    const existingDetails = getExistingAccidentDetails();
    const updatedDetails: AccidentDetails = {
      ...existingDetails,
      repaired: value
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
  const setTireCondition = (value: 'excellent' | 'good' | 'worn' | 'replacement') => {
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
  
  // Convert boolean | undefined to boolean | null for compatibility
  const hasAccidentValue: boolean | null = currentAccidentDetails.hadAccident !== undefined 
    ? currentAccidentDetails.hadAccident 
    : null;

  const hasRegularMaintenanceValue: boolean | null = formData.hasRegularMaintenance !== undefined 
    ? formData.hasRegularMaintenance 
    : null;

  // Handler that converts null back to undefined
  const handleHasRegularMaintenanceChange = (value: boolean | null) => {
    setHasRegularMaintenance(value === null ? undefined : value);
  };

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

      <ServiceHistorySection
        serviceHistory={formData.serviceHistory || 'unknown'}
        setServiceHistory={setServiceHistory}
        hasRegularMaintenance={hasRegularMaintenanceValue}
        setHasRegularMaintenance={handleHasRegularMaintenanceChange}
        maintenanceNotes={formData.maintenanceNotes || ''}
        setMaintenanceNotes={setMaintenanceNotes}
      />

      <AccidentHistorySection
        hasAccident={hasAccidentValue}
        setHasAccident={setHasAccident}
        accidentSeverity={currentAccidentDetails.severity || 'minor'}
        setAccidentSeverity={setAccidentSeverity}
        accidentRepaired={currentAccidentDetails.repaired || false}
        setAccidentRepaired={setAccidentRepaired}
        accidentDescription={currentAccidentDetails.description || ''}
        setAccidentDescription={setAccidentDescription}
      />

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Additional Details</h3>
        
        <div>
          <label className="block text-sm font-medium mb-2">Tire Condition</label>
          <select 
            value={formData.tireCondition || 'good'} 
            onChange={(e) => setTireCondition(e.target.value as 'excellent' | 'good' | 'worn' | 'replacement')}
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
