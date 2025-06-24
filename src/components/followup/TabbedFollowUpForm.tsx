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
import { SaveStatusIndicator } from './SaveStatusIndicator';
import { QuickOverviewCard } from './QuickOverviewCard';
import { TabProgressHeader } from './TabProgressHeader';
import { TabValidationAlerts } from './TabValidationAlerts';
import { FollowUpAnswers } from '@/types/follow-up-answers';
import { CheckCircle, Circle, AlertTriangle, Eye, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface TabbedFollowUpFormProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
  onSubmit: () => Promise<void>;
  onSave: () => void;
  isLoading?: boolean;
  isSaving?: boolean;
  saveError?: string | null;
  lastSaveTime?: Date | null;
}

export function TabbedFollowUpForm({
  formData,
  updateFormData,
  onSubmit,
  onSave,
  isLoading = false,
  isSaving = false,
  saveError = null,
  lastSaveTime = null
}: TabbedFollowUpFormProps) {
  const [activeTab, setActiveTab] = useState("basic");
  const [showQuickOverview, setShowQuickOverview] = useState(false);

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

  const handleRetryConnection = () => {
    onSave(); // Trigger a manual save
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

  if (showQuickOverview) {
    return (
      <div className="w-full max-w-6xl mx-auto p-6">
        <QuickOverviewCard
          formData={formData}
          updateFormData={updateFormData}
          onSubmit={onSubmit}
          onBack={() => setShowQuickOverview(false)}
          isLoading={isLoading}
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <TabProgressHeader
        completionPercentage={completionPercentage}
        onShowQuickOverview={() => setShowQuickOverview(true)}
        saveStatusIndicator={
          <SaveStatusIndicator 
            isSaving={isSaving}
            saveError={saveError}
            lastSaveTime={lastSaveTime}
            onRetry={handleRetryConnection}
          />
        }
      />

      <TabValidationAlerts
        saveError={saveError}
        currentTabValidation={currentTabValidation}
        isLastTab={isLastTab}
        activeTab={activeTab}
        tabs={tabs}
        onTabChange={setActiveTab}
        onRetryConnection={handleRetryConnection}
        isSaving={isSaving}
      />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-7 mb-6 h-auto p-1">
          {tabs.map((tab) => {
            const validation = tabValidations[tab as keyof typeof tabValidations];
            const isCompleted = tabCompletion[tab as keyof typeof tabCompletion];
            
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
                {isCompleted && (
                  <Badge variant="secondary" className="text-xs px-1 py-0">
                    Done
                  </Badge>
                )}
              </TabsTrigger>
            );
          })}
        </TabsList>
        
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
