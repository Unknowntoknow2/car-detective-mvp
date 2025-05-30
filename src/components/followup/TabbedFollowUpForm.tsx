
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, ArrowRight, ArrowLeft } from 'lucide-react';
import { FollowUpAnswers } from '@/types/follow-up-answers';
import { useFollowUpForm } from '@/hooks/useFollowUpForm';
import { BasicInfoTab } from './tabs/BasicInfoTab';
import { TitleOwnershipTab } from './tabs/TitleOwnershipTab';
import { VehicleConditionTab } from './tabs/VehicleConditionTab';
import { AccidentHistoryTab } from './tabs/AccidentHistoryTab';
import { ServiceHistoryTab } from './tabs/ServiceHistoryTab';
import { FeaturesTab } from './tabs/FeaturesTab';
import { FinalReviewTab } from './tabs/FinalReviewTab';

interface TabbedFollowUpFormProps {
  vin: string;
  initialData?: Partial<FollowUpAnswers>;
  onSubmit: (data: FollowUpAnswers) => Promise<void>;
  onSave?: (data: FollowUpAnswers) => Promise<void>;
}

export function TabbedFollowUpForm({ vin, initialData, onSubmit, onSave }: TabbedFollowUpFormProps) {
  const { formData, updateFormData, submitForm, isLoading, isSaving } = useFollowUpForm(vin, initialData);
  const [activeTab, setActiveTab] = useState('basic-info');

  const tabs = [
    { id: 'basic-info', label: 'Basic Info', component: BasicInfoTab },
    { id: 'title-ownership', label: 'Title & Ownership', component: TitleOwnershipTab },
    { id: 'vehicle-condition', label: 'Vehicle Condition', component: VehicleConditionTab },
    { id: 'accident-history', label: 'Accident History', component: AccidentHistoryTab },
    { id: 'service-history', label: 'Service History', component: ServiceHistoryTab },
    { id: 'features', label: 'Features', component: FeaturesTab },
    { id: 'final-review', label: 'Final Review', component: FinalReviewTab }
  ];

  const currentTabIndex = tabs.findIndex(tab => tab.id === activeTab);
  const isLastTab = currentTabIndex === tabs.length - 1;
  const isFirstTab = currentTabIndex === 0;

  const handleNext = () => {
    if (!isLastTab) {
      setActiveTab(tabs[currentTabIndex + 1].id);
    }
  };

  const handlePrevious = () => {
    if (!isFirstTab) {
      setActiveTab(tabs[currentTabIndex - 1].id);
    }
  };

  const handleSubmit = async () => {
    try {
      await submitForm();
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const getTabStatus = (tabId: string) => {
    switch (tabId) {
      case 'basic-info':
        return formData.zip_code && formData.mileage ? 'complete' : 'incomplete';
      case 'title-ownership':
        return formData.title_status ? 'complete' : 'incomplete';
      case 'vehicle-condition':
        return formData.condition ? 'complete' : 'incomplete';
      default:
        return 'incomplete';
    }
  };

  const calculateProgress = () => {
    const completedTabs = tabs.filter(tab => getTabStatus(tab.id) === 'complete').length;
    return (completedTabs / tabs.length) * 100;
  };

  const handleFeaturesChange = (features: Array<{value: string; label: string; icon?: string; impact?: number}>) => {
    updateFormData({ features });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Vehicle Valuation Details</span>
            <Badge variant="secondary" className="text-sm">
              {Math.round(calculateProgress())}% Complete
            </Badge>
          </CardTitle>
          <Progress value={calculateProgress()} className="w-full" />
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-7">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="flex items-center space-x-2 text-xs"
            >
              {getTabStatus(tab.id) === 'complete' ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <Clock className="h-4 w-4" />
              )}
              <span className="hidden sm:inline">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map((tab) => {
          const TabComponent = tab.component;
          return (
            <TabsContent key={tab.id} value={tab.id} className="mt-6">
              <Card>
                <CardContent className="p-6">
                  {tab.id === 'features' ? (
                    <FeaturesTab
                      formData={formData}
                      onFeaturesChange={handleFeaturesChange}
                    />
                  ) : tab.id === 'final-review' ? (
                    <FinalReviewTab
                      formData={formData}
                      onSubmit={handleSubmit}
                      isLoading={isLoading}
                    />
                  ) : (
                    <TabComponent
                      formData={formData}
                      updateFormData={updateFormData}
                    />
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>

      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={isFirstTab}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Previous</span>
        </Button>

        <div className="flex items-center space-x-4">
          {onSave && (
            <Button
              variant="secondary"
              onClick={() => onSave(formData)}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Progress'}
            </Button>
          )}

          {!isLastTab ? (
            <Button
              onClick={handleNext}
              className="flex items-center space-x-2"
            >
              <span>Next</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700"
            >
              {isLoading ? 'Submitting...' : 'Complete Valuation'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
