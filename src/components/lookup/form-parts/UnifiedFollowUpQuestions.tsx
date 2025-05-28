
import React from 'react';
import { TitleStatusSection } from './TitleStatusSection';
import { ServiceHistorySection } from './ServiceHistorySection';
import { AccidentHistorySection } from './AccidentHistorySection';
import { AdditionalDetailsSection } from './AdditionalDetailsSection';
import { ManualEntryFormData } from '../types/manualEntry';

interface UnifiedFollowUpQuestionsProps {
  formData: ManualEntryFormData;
  updateFormData: (updates: Partial<ManualEntryFormData>) => void;
}

export function UnifiedFollowUpQuestions({
  formData,
  updateFormData
}: UnifiedFollowUpQuestionsProps) {
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

  const setHasRegularMaintenance = (value: boolean | null) => {
    updateFormData({ hasRegularMaintenance: value });
  };

  const setMaintenanceNotes = (value: string) => {
    updateFormData({ maintenanceNotes: value });
  };

  // Accident History handlers
  const setHasAccident = (value: boolean | null) => {
    updateFormData({
      accidentDetails: {
        ...formData.accidentDetails,
        hasAccident: value !== null ? value : false
      }
    });
  };

  const setAccidentSeverity = (value: 'minor' | 'moderate' | 'severe') => {
    updateFormData({
      accidentDetails: {
        hasAccident: formData.accidentDetails?.hasAccident || false,
        ...formData.accidentDetails,
        severity: value
      }
    });
  };

  const setAccidentRepaired = (value: boolean) => {
    updateFormData({
      accidentDetails: {
        hasAccident: formData.accidentDetails?.hasAccident || false,
        ...formData.accidentDetails,
        repaired: value
      }
    });
  };

  const setAccidentDescription = (value: string) => {
    updateFormData({
      accidentDetails: {
        hasAccident: formData.accidentDetails?.hasAccident || false,
        ...formData.accidentDetails,
        description: value
      }
    });
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
        hasRegularMaintenance={formData.hasRegularMaintenance || null}
        setHasRegularMaintenance={setHasRegularMaintenance}
        maintenanceNotes={formData.maintenanceNotes || ''}
        setMaintenanceNotes={setMaintenanceNotes}
      />

      <AccidentHistorySection
        hasAccident={formData.accidentDetails?.hasAccident !== undefined ? formData.accidentDetails.hasAccident : null}
        setHasAccident={setHasAccident}
        accidentSeverity={formData.accidentDetails?.severity || 'minor'}
        setAccidentSeverity={setAccidentSeverity}
        accidentRepaired={formData.accidentDetails?.repaired || false}
        setAccidentRepaired={setAccidentRepaired}
        accidentDescription={formData.accidentDetails?.description || ''}
        setAccidentDescription={setAccidentDescription}
      />

      <AdditionalDetailsSection
        tireCondition={formData.tireCondition || 'good'}
        setTireCondition={setTireCondition}
        dashboardLights={formData.dashboardLights || []}
        setDashboardLights={setDashboardLights}
        hasModifications={formData.hasModifications || false}
        setHasModifications={setHasModifications}
        modificationTypes={formData.modificationTypes || []}
        setModificationTypes={setModificationTypes}
      />
    </div>
  );
}
