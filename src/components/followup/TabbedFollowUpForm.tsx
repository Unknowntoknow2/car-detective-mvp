
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Circle } from 'lucide-react';
import { BasicInfoTab } from './tabs/BasicInfoTab';
import { AccidentHistoryTab } from './tabs/AccidentHistoryTab';
import { ServiceHistoryTab } from './tabs/ServiceHistoryTab';
import { TitleOwnershipTab } from './tabs/TitleOwnershipTab';
import { FeaturesTab } from './tabs/FeaturesTab';
import { ModificationsTab } from './tabs/ModificationsTab';
import { ConditionTab } from './tabs/ConditionTab';
import { ReviewTab } from './tabs/ReviewTab';
import { FollowUpAnswers } from '@/types/follow-up-answers';

interface TabbedFollowUpFormProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
  onSubmit: () => Promise<void>;
  isLoading?: boolean;
}

const tabs = [
  { id: 'basic', label: 'Basic Info', component: BasicInfoTab },
  { id: 'accident', label: 'Accident History', component: AccidentHistoryTab },
  { id: 'service', label: 'Service History', component: ServiceHistoryTab },
  { id: 'title', label: 'Title & Ownership', component: TitleOwnershipTab },
  { id: 'features', label: 'Features', component: FeaturesTab },
  { id: 'modifications', label: 'Modifications', component: ModificationsTab },
  { id: 'condition', label: 'Condition', component: ConditionTab },
  { id: 'review', label: 'Review', component: ReviewTab },
];

export function TabbedFollowUpForm({ 
  formData, 
  updateFormData, 
  onSubmit, 
  isLoading = false 
}: TabbedFollowUpFormProps) {
  const [activeTab, setActiveTab] = useState('basic');
  const [completedTabs, setCompletedTabs] = useState<Set<string>>(new Set());

  const markTabCompleted = (tabId: string) => {
    setCompletedTabs(prev => new Set([...prev, tabId]));
  };

  const handleNext = () => {
    const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
    if (currentIndex < tabs.length - 1) {
      markTabCompleted(activeTab);
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
    markTabCompleted(activeTab);
    await onSubmit();
  };

  const handleFeaturesChange = (features: Array<{value: string; label: string; icon?: string; impact?: number}>) => {
    updateFormData({ features });
  };

  const isLastTab = activeTab === tabs[tabs.length - 1].id;
  const isFirstTab = activeTab === tabs[0].id;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Vehicle Information
        </CardTitle>
        <p className="text-center text-gray-600">
          Please provide additional details to get an accurate valuation
        </p>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 lg:grid-cols-8 mb-6">
            {tabs.map((tab) => (
              <TabsTrigger 
                key={tab.id} 
                value={tab.id}
                className="flex items-center gap-1 text-xs"
              >
                {completedTabs.has(tab.id) ? (
                  <CheckCircle className="h-3 w-3 text-green-600" />
                ) : (
                  <Circle className="h-3 w-3" />
                )}
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {tabs.map((tab) => {
            const TabComponent = tab.component;
            return (
              <TabsContent key={tab.id} value={tab.id} className="mt-6">
                {tab.id === 'features' ? (
                  <FeaturesTab
                    formData={formData}
                    onFeaturesChange={handleFeaturesChange}
                  />
                ) : (
                  <TabComponent
                    formData={formData}
                    updateFormData={updateFormData}
                  />
                )}
              </TabsContent>
            );
          })}

          <div className="flex justify-between mt-8 pt-6 border-t">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={isFirstTab}
            >
              Previous
            </Button>

            <div className="flex gap-2">
              {!isLastTab ? (
                <Button onClick={handleNext}>
                  Next
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading ? 'Submitting...' : 'Submit Valuation'}
                </Button>
              )}
            </div>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
}
