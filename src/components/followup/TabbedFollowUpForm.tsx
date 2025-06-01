
import React, { useState } from 'react';
import { CDTabs, TabItem } from '@/components/ui-kit/CDTabs';
import { Card, CardContent } from '@/components/ui/card';
import { LoadingButton } from '@/components/ui/loading-button';
import { MapPin, FileText, Star, Settings, AlertTriangle, Wrench } from 'lucide-react';
import { FollowUpAnswers } from '@/types/follow-up-answers';
import { BasicInfoTab } from './tabs/BasicInfoTab';
import { TitleOwnershipTab } from './tabs/TitleOwnershipTab';
import { AccidentsTab } from './tabs/AccidentsTab';
import { ServiceHistoryTab } from './tabs/ServiceHistoryTab';
import { FeaturesTab } from './tabs/FeaturesTab';
import { ModificationsTab } from './tabs/ModificationsTab';

interface TabbedFollowUpFormProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
  onSubmit: () => Promise<void>;
  isLoading?: boolean;
}

export function TabbedFollowUpForm({
  formData,
  updateFormData,
  onSubmit,
  isLoading = false
}: TabbedFollowUpFormProps) {
  const [activeTab, setActiveTab] = useState('basic');

  const handleFeaturesChange = (features: Array<{value: string; label: string; icon?: string; impact?: number}>) => {
    updateFormData({ features });
  };

  const handleModificationsChange = (modified: boolean, types?: string[]) => {
    updateFormData({
      modifications: {
        hasModifications: modified,
        modified,
        types: types || []
      }
    });
  };

  const handleAccidentsChange = (accidentData: any) => {
    updateFormData({
      accident_history: accidentData,
      accidents: accidentData
    });
  };

  const handleServiceHistoryChange = (serviceData: any) => {
    updateFormData({
      service_history: serviceData,
      serviceHistory: serviceData
    });
  };

  const tabItems: TabItem[] = [
    {
      label: 'Basic Info',
      value: 'basic',
      icon: <MapPin className="h-4 w-4" />,
      content: (
        <BasicInfoTab
          formData={formData}
          updateFormData={updateFormData}
        />
      )
    },
    {
      label: 'Title & Ownership',
      value: 'title',
      icon: <FileText className="h-4 w-4" />,
      content: (
        <TitleOwnershipTab
          formData={formData}
          updateFormData={updateFormData}
        />
      )
    },
    {
      label: 'Accident History',
      value: 'accidents',
      icon: <AlertTriangle className="h-4 w-4" />,
      content: (
        <AccidentsTab
          formData={formData}
          onAccidentsChange={handleAccidentsChange}
        />
      )
    },
    {
      label: 'Service History',
      value: 'service',
      icon: <Wrench className="h-4 w-4" />,
      content: (
        <ServiceHistoryTab
          formData={formData}
          onServiceHistoryChange={handleServiceHistoryChange}
        />
      )
    },
    {
      label: 'Features',
      value: 'features',
      icon: <Star className="h-4 w-4" />,
      content: (
        <FeaturesTab
          formData={formData}
          onFeaturesChange={handleFeaturesChange}
        />
      )
    },
    {
      label: 'Modifications',
      value: 'modifications',
      icon: <Settings className="h-4 w-4" />,
      content: (
        <ModificationsTab
          formData={formData}
          onModificationsChange={handleModificationsChange}
        />
      )
    }
  ];

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Vehicle Details & Follow-up Questions
          </h2>
          <p className="text-gray-600">
            Please provide additional information to get the most accurate valuation
          </p>
        </div>

        <CDTabs
          items={tabItems}
          value={activeTab}
          onChange={setActiveTab}
          variant="underline"
          size="md"
          className="w-full"
        />

        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex justify-end">
            <LoadingButton
              onClick={onSubmit}
              isLoading={isLoading}
              loadingText="Processing valuation..."
              className="px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              Get My Valuation
            </LoadingButton>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
