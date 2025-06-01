
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingButton } from '@/components/ui/loading-button';
import { CheckCircle, Clock, FileText, Car, Settings, Shield, Eye, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { FollowUpAnswers } from '@/types/follow-up-answers';

// Import all tab components
import { BasicInfoTab } from './tabs/BasicInfoTab';
import { AccidentHistoryTab } from './tabs/AccidentHistoryTab';
import { ServiceHistoryTab } from './tabs/ServiceHistoryTab';
import { TitleOwnershipTab } from './tabs/TitleOwnershipTab';
import { ModificationsTab } from './tabs/ModificationsTab';
import { ConditionTab } from './tabs/ConditionTab';
import { FeaturesTab } from './tabs/FeaturesTab';
import { ReviewTab } from './tabs/ReviewTab';

interface TabbedFollowUpFormProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
  onSubmit: () => void;
  isLoading?: boolean;
}

const tabs = [
  {
    id: 'basic',
    label: 'Basic Info',
    icon: <Car className="h-4 w-4" />,
    component: BasicInfoTab,
  },
  {
    id: 'accident',
    label: 'Accident History',
    icon: <Shield className="h-4 w-4" />,
    component: AccidentHistoryTab,
  },
  {
    id: 'service',
    label: 'Service History',
    icon: <FileText className="h-4 w-4" />,
    component: ServiceHistoryTab,
  },
  {
    id: 'title',
    label: 'Title & Ownership',
    icon: <Eye className="h-4 w-4" />,
    component: TitleOwnershipTab,
  },
  {
    id: 'modifications',
    label: 'Modifications',
    icon: <Settings className="h-4 w-4" />,
    component: ModificationsTab,
  },
  {
    id: 'condition',
    label: 'Condition',
    icon: <Star className="h-4 w-4" />,
    component: ConditionTab,
  },
  {
    id: 'features',
    label: 'Features',
    icon: <Star className="h-4 w-4" />,
    component: FeaturesTab,
  },
  {
    id: 'review',
    label: 'Review',
    icon: <CheckCircle className="h-4 w-4" />,
    component: ReviewTab,
  },
];

export function TabbedFollowUpForm({ formData, updateFormData, onSubmit, isLoading }: TabbedFollowUpFormProps) {
  const [activeTab, setActiveTab] = useState('basic');

  const handleFeaturesChange = (features: Array<{value: string; label: string; icon?: string; impact?: number}>) => {
    updateFormData({ features });
  };

  const handleModificationsChange = (modified: boolean, types?: string[]) => {
    updateFormData({
      modifications: {
        modified,
        types: types || []
      }
    });
  };

  const getTabStatus = (tabId: string) => {
    // Add logic to determine if tab is completed
    return 'pending';
  };

  const completionPercentage = 75; // Calculate based on filled fields

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Follow-up Questions
          </CardTitle>
          <div className="flex items-center gap-4">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            <span className="text-sm font-medium">{completionPercentage}% Complete</span>
          </div>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <Card>
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 gap-1 p-1 h-auto">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="flex flex-col items-center gap-1 p-2 text-xs relative"
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
                <Badge 
                  variant={getTabStatus(tab.id) === 'completed' ? 'default' : 'secondary'}
                  className="absolute -top-1 -right-1 h-2 w-2 p-0"
                />
              </TabsTrigger>
            ))}
          </TabsList>

          {tabs.map((tab) => {
            return (
              <TabsContent key={tab.id} value={tab.id} className="mt-6">
                {tab.id === 'features' ? (
                  <FeaturesTab
                    formData={formData}
                    onFeaturesChange={handleFeaturesChange}
                  />
                ) : tab.id === 'basic' ? (
                  <BasicInfoTab
                    formData={formData}
                    updateFormData={updateFormData}
                  />
                ) : tab.id === 'accident' ? (
                  <AccidentHistoryTab
                    formData={formData}
                    updateFormData={updateFormData}
                  />
                ) : tab.id === 'service' ? (
                  <ServiceHistoryTab
                    formData={formData}
                    updateFormData={updateFormData}
                  />
                ) : tab.id === 'title' ? (
                  <TitleOwnershipTab
                    formData={formData}
                    updateFormData={updateFormData}
                  />
                ) : tab.id === 'modifications' ? (
                  <ModificationsTab
                    formData={formData}
                    onModificationsChange={handleModificationsChange}
                  />
                ) : tab.id === 'condition' ? (
                  <ConditionTab
                    formData={formData}
                    updateFormData={updateFormData}
                  />
                ) : tab.id === 'review' ? (
                  <ReviewTab
                    formData={formData}
                    updateFormData={updateFormData}
                  />
                ) : null}
              </TabsContent>
            );
          })}
        </Card>

        <div className="mt-6 flex justify-between">
          <Button
            variant="outline"
            onClick={() => {
              const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
              if (currentIndex > 0) {
                setActiveTab(tabs[currentIndex - 1].id);
              }
            }}
            disabled={activeTab === tabs[0].id}
          >
            Previous
          </Button>
          
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => {
                const currentIndex = tabs.findIndex(tab => tab.id === activeTab);
                if (currentIndex < tabs.length - 1) {
                  setActiveTab(tabs[currentIndex + 1].id);
                }
              }}
              disabled={activeTab === tabs[tabs.length - 1].id}
            >
              Next
            </Button>
            
            <LoadingButton
              onClick={onSubmit}
              isLoading={isLoading}
              loadingText="Submitting..."
              className="bg-blue-600 hover:bg-blue-700"
            >
              Submit Valuation
            </LoadingButton>
          </div>
        </div>
      </Tabs>
    </div>
  );
}
