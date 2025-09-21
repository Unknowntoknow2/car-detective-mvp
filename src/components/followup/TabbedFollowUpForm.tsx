
import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { CheckCircle, Clock, AlertCircle, MapPin, Car, Wrench, AlertTriangle, Settings, Star } from 'lucide-react';
import { FollowUpAnswers } from '@/types/follow-up-answers';
import { useSimpleFollowUpForm } from '@/hooks/useSimpleFollowUpForm';
import { SilentSaveIndicator } from './SilentSaveIndicator';

// Import new redesigned stepper
import { LinearProgressStepper } from '../valuation/redesign/LinearProgressStepper';

// Import tab components
import { SimplifiedBasicInfoTab } from './tabs/SimplifiedBasicInfoTab';
import { ConditionTab } from './tabs/ConditionTab';
import { DashboardLightsTab } from './tabs/DashboardLightsTab';
import { ServiceMaintenanceTab } from './tabs/ServiceMaintenanceTab';
import { AccidentHistoryTab } from './tabs/AccidentHistoryTab';
import { ModificationsTab } from './tabs/ModificationsTab';
import { FeaturesTab } from './tabs/FeaturesTab';

interface TabbedFollowUpFormProps {
  vehicleData: {
    vin: string;
    year?: number;
    make?: string;
    model?: string;
  };
  onSubmit: () => Promise<boolean>;
}

const tabs = [
  {
    id: 'basic',
    label: 'Basic Info',
    icon: MapPin,
    component: SimplifiedBasicInfoTab,
    required: true,
    description: 'Location and mileage'
  },
  {
    id: 'condition',
    label: 'Condition',
    icon: Car,
    component: ConditionTab,
    required: true,
    description: 'Vehicle condition assessment'
  },
  {
    id: 'issues',
    label: 'Dashboard',
    icon: AlertCircle,
    component: DashboardLightsTab,
    required: false,
    description: 'Warning lights and issues'
  },
  {
    id: 'service',
    label: 'Service',
    icon: Wrench,
    component: ServiceMaintenanceTab,
    required: false,
    description: 'Maintenance history'
  },
  {
    id: 'accidents',
    label: 'Accidents',
    icon: AlertTriangle,
    component: AccidentHistoryTab,
    required: false,
    description: 'Accident history'
  },
  {
    id: 'modifications',
    label: 'Modifications',
    icon: Settings,
    component: ModificationsTab,
    required: false,
    description: 'Vehicle modifications'
  },
  {
    id: 'features',
    label: 'Features',
    icon: Star,
    component: FeaturesTab,
    required: false,
    description: 'Premium features'
  }
];

export function TabbedFollowUpForm({
  vehicleData,
  onSubmit
}: TabbedFollowUpFormProps) {
  const [currentTab, setCurrentTab] = useState('basic');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    formData,
    updateFormData,
    saveProgress,
    submitFollowUpAndStartValuation,
    isLoading,
    isSaving,
    saveError,
    lastSaveTime,
    isFormValid
  } = useSimpleFollowUpForm({
    vin: vehicleData.vin,
    initialData: { 
      year: vehicleData.year,
      make: vehicleData.make,
      model: vehicleData.model
    }
  });

  // Silent auto-save on tab change
  const handleTabChange = useCallback(async (tabId: string) => {
    await saveProgress(); // Silent save when changing tabs
    setCurrentTab(tabId);
  }, [saveProgress]);

  // Calculate completion status for each tab
  const getTabCompletion = useCallback((tabId: string): 'complete' | 'partial' | 'empty' => {
    switch (tabId) {
      case 'basic':
        const hasValidZip = Boolean(formData.zip_code && formData.zip_code.length === 5 && /^\d{5}$/.test(formData.zip_code));
        const hasValidMileage = Boolean(formData.mileage && formData.mileage > 0);
        const hasValidCondition = Boolean(formData.condition && ['excellent', 'good', 'fair', 'poor'].includes(formData.condition));
        
        return (hasValidZip && hasValidMileage && hasValidCondition) ? 'complete' : 'empty';
        
      case 'condition':
        const hasAllConditions = Boolean(
          formData.tire_condition && 
          formData.exterior_condition && 
          formData.interior_condition && 
          formData.brake_condition
        );
        return hasAllConditions ? 'complete' : 'partial';
        
      default:
        return 'partial';
    }
  }, [formData]);

  // Calculate overall progress
  const progressData = React.useMemo(() => {
    const requiredTabs = tabs.filter(tab => tab.required);
    const completedRequired = requiredTabs.filter(tab => getTabCompletion(tab.id) === 'complete').length;
    const progressPercentage = Math.round((completedRequired / requiredTabs.length) * 100);
    
    return {
      progressPercentage,
      canSubmit: isFormValid,
      completedRequired,
      requiredTabs
    };
  }, [getTabCompletion, isFormValid]);

  const getTabStatus = useCallback((tabId: string) => {
    const completion = getTabCompletion(tabId);
    
    if (completion === 'complete') {
      return { color: 'text-green-600', bg: 'bg-green-100', icon: CheckCircle };
    } else if (completion === 'partial') {
      return { color: 'text-yellow-600', bg: 'bg-yellow-100', icon: Clock };
    } else {
      return { color: 'text-gray-400', bg: 'bg-gray-100', icon: AlertCircle };
    }
  }, [getTabCompletion]);

  // Navigation functions
  const currentTabIndex = tabs.findIndex(tab => tab.id === currentTab);
  const isFirstTab = currentTabIndex === 0;
  const isLastTab = currentTabIndex === tabs.length - 1;

  const goToPreviousTab = useCallback(() => {
    if (!isFirstTab) {
      const previousTab = tabs[currentTabIndex - 1];
      handleTabChange(previousTab.id);
    }
  }, [currentTabIndex, isFirstTab, handleTabChange]);

  const goToNextTab = useCallback(() => {
    if (!isLastTab) {
      const nextTab = tabs[currentTabIndex + 1];
      handleTabChange(nextTab.id);
    }
  }, [currentTabIndex, isLastTab, handleTabChange]);

  const skipToFinalTab = useCallback(() => {
    handleTabChange(tabs[tabs.length - 1].id);
  }, [handleTabChange]);

  const handleSubmit = useCallback(async () => {
    if (!progressData.canSubmit) {
      return;
    }
    
    setIsSubmitting(true);
    try {
      
      // Use the new integrated submission function
      const result = await submitFollowUpAndStartValuation();
      
      if (result.success && result.valuationId) {
        // Navigate to results using the parent's onSubmit (which handles navigation)
        await onSubmit();
      } else if (result.requiresValuation) {
        // FIXED: Call parent's onSubmit when valuation creation is needed
        // This allows the parent (ValuationFollowUpPage) to create the valuation
        await onSubmit();
      } else {
        console.error('❌ [TabbedFollowUpForm] Submission failed:', result.message);
        // Only show error for actual failures, not when valuation creation is needed
        if (result.message !== 'NEEDS_VALUATION_CREATION') {
          // Could add toast error here if needed
        }
      }
    } catch (error) {
      console.error('❌ [TabbedFollowUpForm] Submit error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [progressData.canSubmit, submitFollowUpAndStartValuation, onSubmit]);

  if (isLoading) {
    return (
      <Card className="p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Loading your vehicle information...</span>
        </div>
      </Card>
    );
  }

  // Convert tabs to steps for LinearProgressStepper
  const steps = tabs.map(tab => ({
    id: tab.id,
    title: tab.label,
    description: tab.description,
    icon: tab.icon,
    required: tab.required,
    completed: getTabCompletion(tab.id) === 'complete',
    component: tab.component
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-5xl mx-auto space-y-6"
      id="follow-up-form"
    >
      <LinearProgressStepper
        steps={steps}
        currentStep={currentTab}
        formData={formData}
        updateFormData={updateFormData}
        onStepChange={handleTabChange}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        canSubmit={progressData.canSubmit}
        completionPercentage={progressData.progressPercentage}
      />
      
      {/* Silent Save Indicator */}
      <div className="flex justify-end">
        <SilentSaveIndicator
          isSaving={isSaving}
          saveError={saveError}
          lastSaveTime={lastSaveTime}
        />
      </div>
    </motion.div>
  );
}
