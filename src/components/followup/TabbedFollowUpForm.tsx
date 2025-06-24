
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
import { FollowUpAnswers } from '@/types/follow-up-answers';
import { CheckCircle, Circle } from 'lucide-react';

interface TabbedFollowUpFormProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
  onSubmit: () => Promise<void>;
  onSave: () => void;
  isLoading?: boolean;
}

export function TabbedFollowUpForm({
  formData,
  updateFormData,
  onSubmit,
  onSave,
  isLoading = false
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

  // Calculate completion status for each tab
  const tabCompletion = useMemo(() => {
    return {
      basic: !!(formData.zip_code && formData.mileage && formData.condition),
      condition: !!(formData.tire_condition && formData.exterior_condition && formData.interior_condition),
      issues: !!(formData.dashboard_lights !== undefined),
      service: !!(formData.serviceHistory?.hasRecords !== undefined),
      accidents: !!(formData.accidents?.hadAccident !== undefined),
      modifications: !!(formData.modifications?.hasModifications !== undefined),
      features: true // Features tab is always considered complete
    };
  }, [formData]);

  // Calculate overall progress
  const completionPercentage = useMemo(() => {
    const completedTabs = Object.values(tabCompletion).filter(Boolean).length;
    return Math.round((completedTabs / tabs.length) * 100);
  }, [tabCompletion, tabs.length]);

  // Update completion percentage in form data
  React.useEffect(() => {
    if (formData.completion_percentage !== completionPercentage) {
      updateFormData({ completion_percentage: completionPercentage });
    }
  }, [completionPercentage, formData.completion_percentage, updateFormData]);

  const currentTabValid = tabCompletion[activeTab as keyof typeof tabCompletion];
  const isLastTab = activeTab === "features";

  const handleServiceHistoryChange = (updates: Partial<FollowUpAnswers>) => {
    updateFormData(updates);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold text-gray-900">Complete Your Valuation</h3>
          <span className="text-sm font-medium text-gray-600">{completionPercentage}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-7 mb-6">
          {tabs.map((tab) => (
            <TabsTrigger 
              key={tab} 
              value={tab} 
              className="flex items-center gap-2 text-sm"
            >
              {tabCompletion[tab as keyof typeof tabCompletion] ? (
                <CheckCircle className="w-4 h-4 text-green-600" />
              ) : (
                <Circle className="w-4 h-4 text-gray-400" />
              )}
              {tabLabels[tab as keyof typeof tabLabels]}
            </TabsTrigger>
          ))}
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
          isSaving={false}
          tabs={tabs}
        />
      </Tabs>
    </div>
  );
}

export default TabbedFollowUpForm;
