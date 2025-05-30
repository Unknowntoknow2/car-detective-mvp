
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { FollowUpAnswers } from '@/types/follow-up-answers';
import { useFollowUpForm } from '@/hooks/useFollowUpForm';
import { BasicInfoTab } from './tabs/BasicInfoTab';
import { TitleOwnershipTab } from './tabs/TitleOwnershipTab';
import { VehicleConditionTab } from './tabs/VehicleConditionTab';
import { AccidentHistoryTab } from './tabs/AccidentHistoryTab';
import { ModificationsTab } from './tabs/ModificationsTab';
import { ServiceHistoryTab } from './tabs/ServiceHistoryTab';
import { FeaturesTab } from './tabs/FeaturesTab';
import { FinalReviewTab } from './tabs/FinalReviewTab';

interface TabbedFollowUpFormProps {
  vin: string;
  initialData?: Partial<FollowUpAnswers>;
  onSubmit: (values: FollowUpAnswers) => Promise<void>;
  onSave?: (values: FollowUpAnswers) => Promise<void>;
}

export function TabbedFollowUpForm({ vin, initialData, onSubmit, onSave }: TabbedFollowUpFormProps) {
  const { formData, updateFormData, submitForm, isLoading, isSaving } = useFollowUpForm(vin, initialData);
  const [activeTab, setActiveTab] = useState('basic');

  const tabs = [
    { id: 'basic', label: 'Basic Info', component: BasicInfoTab },
    { id: 'title', label: 'Title & Ownership', component: TitleOwnershipTab },
    { id: 'condition', label: 'Vehicle Condition', component: VehicleConditionTab },
    { id: 'accidents', label: 'Accident History', component: AccidentHistoryTab },
    { id: 'modifications', label: 'Modifications', component: ModificationsTab },
    { id: 'service', label: 'Service History', component: ServiceHistoryTab },
    { id: 'features', label: 'Features', component: FeaturesTab },
    { id: 'review', label: 'Review & Submit', component: FinalReviewTab }
  ];

  const calculateProgress = () => {
    let completed = 0;
    const total = 8;

    if (formData.zip_code && formData.mileage) completed++;
    if (formData.title_status && formData.previous_owners !== undefined) completed++;
    if (formData.condition && formData.exterior_condition && formData.interior_condition) completed++;
    if (formData.accident_history !== undefined) completed++;
    if (formData.modifications !== undefined) completed++;
    if (formData.serviceHistory !== undefined) completed++;
    if (formData.features && formData.features.length > 0) completed++;
    if (formData.additional_notes) completed++;

    return (completed / total) * 100;
  };

  const handleNext = () => {
    const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1].id);
    }
  };

  const handlePrevious = () => {
    const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1].id);
    }
  };

  const handleSubmit = async () => {
    const success = await submitForm();
    if (success) {
      await onSubmit(formData);
    }
  };

  const handleSave = async () => {
    if (onSave) {
      await onSave(formData);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Vehicle Follow-Up Questions</CardTitle>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Progress</span>
            <span>{Math.round(calculateProgress())}% Complete</span>
          </div>
          <Progress value={calculateProgress()} className="w-full" />
        </div>
        {isSaving && (
          <div className="text-sm text-blue-600">Saving...</div>
        )}
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id} className="text-xs">
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {tabs.map((tab) => {
            const TabComponent = tab.component;
            return (
              <TabsContent key={tab.id} value={tab.id} className="mt-6">
                <TabComponent 
                  formData={formData} 
                  updateFormData={updateFormData}
                  onFeaturesChange={tab.id === 'features' ? (features) => updateFormData({ features }) : undefined}
                  onSubmit={tab.id === 'review' ? handleSubmit : undefined}
                  isLoading={isLoading}
                />
              </TabsContent>
            );
          })}
        </Tabs>

        <div className="flex justify-between mt-8 pt-4 border-t">
          <Button 
            variant="outline" 
            onClick={handlePrevious}
            disabled={activeTab === 'basic'}
          >
            Previous
          </Button>
          
          <div className="flex gap-2">
            <Button 
              variant="secondary" 
              onClick={handleSave}
              disabled={isLoading || isSaving}
            >
              Save Progress
            </Button>
            
            {activeTab === 'review' ? (
              <Button 
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? 'Submitting...' : 'Submit Valuation'}
              </Button>
            ) : (
              <Button onClick={handleNext}>
                Next
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
