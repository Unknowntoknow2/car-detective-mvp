
import React, { useState, useMemo } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BasicInfoTab } from './tabs/BasicInfoTab';
import { ConditionTab } from './tabs/ConditionTab';
import { VehicleIssuesTab } from './tabs/VehicleIssuesTab';
import { ServiceHistoryTab } from './tabs/ServiceHistoryTab';
import { AccidentsTab } from './tabs/AccidentsTab';
import { ModificationsTab } from './tabs/ModificationsTab';
import { FeaturesTab } from './tabs/FeaturesTab';
import { TabNavigation } from './TabNavigation';
import { TabValidation } from './validation/TabValidation';
import { FollowUpAnswers } from '@/types/follow-up-answers';
import { CheckCircle, Circle, AlertTriangle, Wifi, WifiOff, Save } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface TabbedFollowUpFormProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
  onSubmit: () => Promise<void>;
  onSave: () => void;
  isLoading?: boolean;
  isSaving?: boolean;
  saveError?: string | null;
}

export function TabbedFollowUpForm({
  formData,
  updateFormData,
  onSubmit,
  onSave,
  isLoading = false,
  isSaving = false,
  saveError = null
}: TabbedFollowUpFormProps) {
  const [activeTab, setActiveTab] = useState("basic");

  const tabs = ["basic", "condition", "issues", "service", "accidents", "modifications", "features"];
  
  const tabLabels = {
    basic: "Basic Info",
    condition: "Condition", 
    issues: "Issues",
    service: "Service History",
    accidents: "Accidents",
    modifications: "Modifications",
    features: "Features"
  };

  // Calculate validation and completion status for each tab
  const tabValidations = useMemo(() => {
    return TabValidation.validateAllTabs(formData);
  }, [formData]);

  const tabCompletion = useMemo(() => {
    const validations = tabValidations;
    return {
      basic: validations.basic.isValid,
      condition: validations.condition.isValid,
      issues: validations.issues.isValid,
      service: validations.service.isValid,
      accidents: validations.accidents.isValid,
      modifications: validations.modifications.isValid,
      features: validations.features.isValid
    };
  }, [tabValidations]);

  // Calculate overall progress
  const completionPercentage = useMemo(() => {
    return TabValidation.getOverallCompletion(formData);
  }, [formData]);

  // Update completion percentage in form data
  React.useEffect(() => {
    if (formData.completion_percentage !== completionPercentage) {
      updateFormData({ completion_percentage: completionPercentage });
    }
  }, [completionPercentage, formData.completion_percentage, updateFormData]);

  const currentTabValid = tabCompletion[activeTab as keyof typeof tabCompletion];
  const currentTabValidation = tabValidations[activeTab as keyof typeof tabValidations];
  const isLastTab = activeTab === "features";

  const handleServiceHistoryChange = (updates: Partial<FollowUpAnswers>) => {
    updateFormData(updates);
  };

  const getTabIcon = (tabKey: string) => {
    const validation = tabValidations[tabKey as keyof typeof tabValidations];
    
    if (validation.isValid) {
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    } else if (validation.errors.length > 0) {
      return <Circle className="w-4 h-4 text-red-400" />;
    } else {
      return <Circle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getSaveStatusIcon = () => {
    if (saveError) {
      return <WifiOff className="w-4 h-4 text-red-500" />;
    }
    if (isSaving) {
      return <Save className="w-4 h-4 text-blue-500 animate-pulse" />;
    }
    return <Wifi className="w-4 h-4 text-green-500" />;
  };

  const getSaveStatusText = () => {
    if (saveError) {
      return "Save Failed";
    }
    if (isSaving) {
      return "Saving...";
    }
    return "Auto-saved";
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      {/* Progress Bar with Save Status */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold text-gray-900">Complete Your Valuation</h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              {getSaveStatusIcon()}
              <span className={`${saveError ? 'text-red-600' : isSaving ? 'text-blue-600' : 'text-green-600'}`}>
                {getSaveStatusText()}
              </span>
            </div>
            <span className="text-sm font-medium text-gray-600">{completionPercentage}% Complete</span>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      {/* Error Alert */}
      {saveError && (
        <Alert className="mb-4 border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Connection Issue:</strong> {saveError}
            <br />
            <span className="text-sm">Your changes are being saved locally. They will sync when the connection is restored.</span>
          </AlertDescription>
        </Alert>
      )}
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-7 mb-6 h-auto p-1">
          {tabs.map((tab) => {
            const validation = tabValidations[tab as keyof typeof tabValidations];
            return (
              <TabsTrigger 
                key={tab} 
                value={tab} 
                className="flex flex-col items-center gap-1 text-xs p-2 h-auto relative"
              >
                <div className="flex items-center gap-1">
                  {getTabIcon(tab)}
                  <span className="hidden sm:inline">{tabLabels[tab as keyof typeof tabLabels]}</span>
                  <span className="sm:hidden">{tab === 'basic' ? 'Info' : tab === 'condition' ? 'Cond' : tab === 'service' ? 'Svc' : tab === 'accidents' ? 'Acc' : tab === 'modifications' ? 'Mod' : tab === 'features' ? 'Feat' : 'Issues'}</span>
                </div>
                {validation.warnings.length > 0 && (
                  <AlertTriangle className="w-3 h-3 text-yellow-500" />
                )}
              </TabsTrigger>
            );
          })}
        </TabsList>
        
        {/* Current Tab Validation Status */}
        {currentTabValidation && (currentTabValidation.errors.length > 0 || currentTabValidation.warnings.length > 0) && (
          <div className="mb-4 space-y-2">
            {currentTabValidation.errors.map((error, index) => (
              <div key={index} className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded-md">
                <Circle className="w-4 h-4 text-red-500" />
                <span className="text-sm text-red-700">{error}</span>
              </div>
            ))}
            {currentTabValidation.warnings.map((warning, index) => (
              <div key={index} className="flex items-center gap-2 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
                <AlertTriangle className="w-4 h-4 text-yellow-500" />
                <span className="text-sm text-yellow-700">{warning}</span>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-6 min-h-[400px]">
          <TabsContent value="basic" className="space-y-6">
            <BasicInfoTab
              formData={formData}
              updateFormData={updateFormData}
            />
          </TabsContent>
          
          <TabsContent value="condition" className="space-y-6">
            <ConditionTab
              formData={formData}
              updateFormData={updateFormData}
            />
          </TabsContent>
          
          <TabsContent value="issues" className="space-y-6">
            <VehicleIssuesTab
              formData={formData}
              updateFormData={updateFormData}
            />
          </TabsContent>
          
          <TabsContent value="service" className="space-y-6">
            <ServiceHistoryTab
              formData={formData}
              updateFormData={updateFormData}
              onServiceHistoryChange={handleServiceHistoryChange}
            />
          </TabsContent>
          
          <TabsContent value="accidents" className="space-y-6">
            <AccidentsTab
              formData={formData}
              updateFormData={updateFormData}
            />
          </TabsContent>
          
          <TabsContent value="modifications" className="space-y-6">
            <ModificationsTab
              formData={formData}
              updateFormData={updateFormData}
            />
          </TabsContent>
          
          <TabsContent value="features" className="space-y-6">
            <FeaturesTab
              formData={formData}
              updateFormData={updateFormData}
            />
          </TabsContent>
        </div>

        <TabNavigation
          currentTab={activeTab}
          onTabChange={setActiveTab}
          onSave={onSave}
          onSubmit={onSubmit}
          isLastTab={isLastTab}
          isValid={currentTabValid}
          isLoading={isLoading}
          isSaving={isSaving}
          tabs={tabs}
        />
      </Tabs>
    </div>
  );
}

export default TabbedFollowUpForm;
