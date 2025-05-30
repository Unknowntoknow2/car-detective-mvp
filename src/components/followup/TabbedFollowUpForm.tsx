
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { FollowUpAnswers } from '@/types/follow-up-answers';
import { useFollowUpForm } from '@/hooks/useFollowUpForm';
import { getCompletionPercentage } from '@/utils/followUpDataHelpers';

// Import all the tab components
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
  onSubmit: (formData: FollowUpAnswers) => Promise<void>;
  onSave?: (formData: FollowUpAnswers) => Promise<void>;
}

export function TabbedFollowUpForm({ vin, initialData, onSubmit, onSave }: TabbedFollowUpFormProps) {
  const { formData, updateFormData, submitForm, isLoading, isSaving } = useFollowUpForm(vin, initialData);
  const [activeTab, setActiveTab] = useState('basic-info');

  const completionPercentage = getCompletionPercentage(formData);

  const tabs = [
    { id: 'basic-info', label: 'Basic Info', icon: '🏠' },
    { id: 'title-ownership', label: 'Title & Ownership', icon: '📋' },
    { id: 'vehicle-condition', label: 'Vehicle Condition', icon: '🚗' },
    { id: 'accident-history', label: 'Accident History', icon: '⚠️' },
    { id: 'service-history', label: 'Service History', icon: '🔧' },
    { id: 'features', label: 'Features', icon: '⭐' },
    { id: 'review', label: 'Review & Submit', icon: '✅' }
  ];

  const getTabStatus = (tabId: string) => {
    switch (tabId) {
      case 'basic-info':
        return formData.zip_code && formData.mileage ? 'complete' : 'incomplete';
      case 'title-ownership':
        return formData.title_status ? 'complete' : 'incomplete';
      case 'vehicle-condition':
        return formData.condition && formData.exterior_condition && formData.interior_condition ? 'complete' : 'incomplete';
      case 'accident-history':
        return formData.accident_history ? 'complete' : 'incomplete';
      case 'service-history':
        return formData.serviceHistory ? 'complete' : 'incomplete';
      case 'features':
        return 'optional';
      case 'review':
        return completionPercentage >= 70 ? 'complete' : 'incomplete';
      default:
        return 'incomplete';
    }
  };

  const handleSubmit = async () => {
    try {
      await submitForm();
      await onSubmit(formData);
    } catch (error) {
      console.error('Failed to submit follow-up form:', error);
    }
  };

  const handleFeaturesChange = (features: Array<{value: string; label: string; icon?: string; impact?: number}>) => {
    updateFormData({ features });
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Progress Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Vehicle Follow-up Questions</h2>
              <p className="text-gray-600">Help us provide a more accurate valuation</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500 mb-1">Completion</div>
              <div className="text-2xl font-bold text-blue-600">{completionPercentage}%</div>
            </div>
          </div>
          <Progress value={completionPercentage} className="h-2" />
          {isSaving && (
            <div className="flex items-center text-sm text-blue-600 mt-2">
              <Clock className="h-4 w-4 mr-1 animate-spin" />
              Saving...
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tabbed Form */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Tab Navigation Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-4">
                <TabsList className="flex flex-col w-full h-auto bg-transparent space-y-2">
                  {tabs.map((tab) => {
                    const status = getTabStatus(tab.id);
                    return (
                      <TabsTrigger
                        key={tab.id}
                        value={tab.id}
                        className="w-full justify-start text-left h-auto p-3 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
                      >
                        <div className="flex items-center space-x-3 w-full">
                          <span className="text-lg">{tab.icon}</span>
                          <div className="flex-1">
                            <div className="font-medium text-sm">{tab.label}</div>
                          </div>
                          <div className="flex-shrink-0">
                            {status === 'complete' && <CheckCircle className="h-4 w-4 text-green-500" />}
                            {status === 'incomplete' && <AlertCircle className="h-4 w-4 text-red-500" />}
                            {status === 'optional' && <Badge variant="secondary" className="text-xs">Optional</Badge>}
                          </div>
                        </div>
                      </TabsTrigger>
                    );
                  })}
                </TabsList>
              </CardContent>
            </Card>
          </div>

          {/* Tab Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardContent className="p-6">
                <TabsContent value="basic-info" className="mt-0">
                  <BasicInfoTab formData={formData} updateFormData={updateFormData} />
                </TabsContent>

                <TabsContent value="title-ownership" className="mt-0">
                  <TitleOwnershipTab formData={formData} updateFormData={updateFormData} />
                </TabsContent>

                <TabsContent value="vehicle-condition" className="mt-0">
                  <VehicleConditionTab formData={formData} updateFormData={updateFormData} />
                </TabsContent>

                <TabsContent value="accident-history" className="mt-0">
                  <AccidentHistoryTab formData={formData} updateFormData={updateFormData} />
                </TabsContent>

                <TabsContent value="service-history" className="mt-0">
                  <ServiceHistoryTab formData={formData} updateFormData={updateFormData} />
                </TabsContent>

                <TabsContent value="features" className="mt-0">
                  <FeaturesTab 
                    formData={formData} 
                    updateFormData={updateFormData}
                    onFeaturesChange={handleFeaturesChange}
                  />
                </TabsContent>

                <TabsContent value="review" className="mt-0">
                  <FinalReviewTab 
                    formData={formData} 
                    updateFormData={updateFormData}
                    onSubmit={handleSubmit} 
                    isLoading={isLoading} 
                  />
                </TabsContent>
              </CardContent>
            </Card>
          </div>
        </div>
      </Tabs>
    </div>
  );
}
