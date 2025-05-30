
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useFollowUpForm } from '@/hooks/useFollowUpForm';
import { FollowUpAnswers } from '@/types/follow-up-answers';
import { getCompletionPercentage } from '@/utils/followUpDataHelpers';

// Import tab components
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
  onSubmit?: (formData: FollowUpAnswers) => Promise<void>;
  onSave?: (formData: FollowUpAnswers) => Promise<void>;
}

const tabs = [
  { id: 'basic', label: 'Basic Info', icon: '📍' },
  { id: 'title', label: 'Title & Ownership', icon: '📋' },
  { id: 'condition', label: 'Vehicle Condition', icon: '⭐' },
  { id: 'accidents', label: 'Accident History', icon: '🚗' },
  { id: 'service', label: 'Service History', icon: '🔧' },
  { id: 'features', label: 'Features', icon: '✨' },
  { id: 'review', label: 'Final Review', icon: '✅' }
];

export function TabbedFollowUpForm({ 
  vin, 
  initialData, 
  onSubmit, 
  onSave 
}: TabbedFollowUpFormProps) {
  const [activeTab, setActiveTab] = useState('basic');
  const { formData, updateFormData, submitForm, isLoading, isSaving } = useFollowUpForm(vin, initialData);

  const completionPercentage = getCompletionPercentage(formData);

  const handleSubmit = async () => {
    try {
      const success = await submitForm();
      if (success && onSubmit) {
        await onSubmit(formData);
      }
    } catch (error) {
      console.error('Error submitting follow-up form:', error);
    }
  };

  const handleFeaturesChange = (features: Array<{value: string; label: string; icon?: string; impact?: number}>) => {
    updateFormData({ features });
  };

  const getTabStatus = (tabId: string): 'complete' | 'current' | 'pending' => {
    if (tabId === activeTab) return 'current';
    
    const tabIndex = tabs.findIndex(tab => tab.id === tabId);
    const activeIndex = tabs.findIndex(tab => tab.id === activeTab);
    
    if (tabIndex < activeIndex) return 'complete';
    return 'pending';
  };

  const StatusIcon = ({ status }: { status: string }) => {
    switch (status) {
      case 'complete':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'current':
        return <Clock className="h-4 w-4 text-blue-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Vehicle Follow-up Questions</CardTitle>
              <p className="text-gray-600 mt-2">Complete these questions to get the most accurate valuation</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{completionPercentage}%</div>
              <p className="text-sm text-gray-500">Complete</p>
            </div>
          </div>
          <Progress value={completionPercentage} className="mt-4" />
        </CardHeader>
      </Card>

      {/* Tab Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="overflow-x-auto">
          <TabsList className="grid w-full grid-cols-7 min-w-max">
            {tabs.map((tab) => {
              const status = getTabStatus(tab.id);
              return (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="flex items-center space-x-2 min-w-fit px-3"
                >
                  <StatusIcon status={status} />
                  <span className="hidden sm:inline">{tab.icon}</span>
                  <span className="text-xs sm:text-sm">{tab.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          <TabsContent value="basic">
            <BasicInfoTab formData={formData} updateFormData={updateFormData} />
          </TabsContent>

          <TabsContent value="title">
            <TitleOwnershipTab formData={formData} updateFormData={updateFormData} />
          </TabsContent>

          <TabsContent value="condition">
            <VehicleConditionTab formData={formData} updateFormData={updateFormData} />
          </TabsContent>

          <TabsContent value="accidents">
            <AccidentHistoryTab formData={formData} updateFormData={updateFormData} />
          </TabsContent>

          <TabsContent value="service">
            <ServiceHistoryTab formData={formData} updateFormData={updateFormData} />
          </TabsContent>

          <TabsContent value="features">
            <FeaturesTab 
              formData={formData} 
              onFeaturesChange={handleFeaturesChange}
            />
          </TabsContent>

          <TabsContent value="review">
            <FinalReviewTab 
              formData={formData} 
              updateFormData={updateFormData}
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />
          </TabsContent>
        </div>
      </Tabs>

      {/* Navigation Footer */}
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              {isSaving && (
                <Badge variant="outline" className="animate-pulse">
                  <Clock className="h-3 w-3 mr-1" />
                  Saving...
                </Badge>
              )}
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
                  if (currentIndex > 0) {
                    setActiveTab(tabs[currentIndex - 1].id);
                  }
                }}
                disabled={activeTab === 'basic'}
              >
                Previous
              </Button>
              <Button
                onClick={() => {
                  const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
                  if (currentIndex < tabs.length - 1) {
                    setActiveTab(tabs[currentIndex + 1].id);
                  }
                }}
                disabled={activeTab === 'review'}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
