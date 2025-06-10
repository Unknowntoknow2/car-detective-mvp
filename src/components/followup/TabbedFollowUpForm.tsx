import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress";
import { BasicInfoTab } from './tabs/BasicInfoTab';
import { ConditionTab } from './tabs/ConditionTab';
import { IssuesTab } from './tabs/IssuesTab';
import { ServiceHistoryTab } from './tabs/ServiceHistoryTab';
import { AccidentsTab } from './tabs/AccidentsTab';
import { ModificationsTab } from './tabs/ModificationsTab';
import { FeaturesTab } from './tabs/FeaturesTab';
import { FollowUpAnswers } from '@/types/follow-up-answers';

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

  const handleServiceHistoryChange = (updates: Partial<FollowUpAnswers>) => {
    updateFormData(updates);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="mb-4">
        <ProgressBar value={formData.completion_percentage || 0} />
        <p className="text-sm text-muted-foreground mt-2">
          {formData.completion_percentage || 0}% Complete
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="condition">Condition</TabsTrigger>
          <TabsTrigger value="issues">Issues</TabsTrigger>
          <TabsTrigger value="service">Service History</TabsTrigger>
          <TabsTrigger value="accidents">Accidents</TabsTrigger>
          <TabsTrigger value="modifications">Modifications</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
        </TabsList>
        
        <div className="mt-6">
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
            <IssuesTab
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
      </Tabs>
      
      <div className="flex justify-between mt-8">
        <Button variant="secondary" onClick={onSave}>
          Save Progress
        </Button>
        <Button onClick={onSubmit} disabled={isLoading}>
          {isLoading ? "Submitting..." : "Submit Valuation"}
        </Button>
      </div>
    </div>
  );
}

export default TabbedFollowUpForm;
