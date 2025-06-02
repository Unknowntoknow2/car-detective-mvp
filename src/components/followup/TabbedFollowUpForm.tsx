
import React, { useState } from 'react';
import { cn } from '@/utils/cn';
import { BasicInfoTab } from './tabs/BasicInfoTab';
import { ConditionTab } from './tabs/ConditionTab';
import { FeaturesTab } from './tabs/FeaturesTab';
import { ModificationsTab } from './tabs/ModificationsTab';
import { ServiceMaintenanceTab } from './tabs/ServiceMaintenanceTab';
import { AccidentHistoryTab } from './tabs/AccidentHistoryTab';
import { VehicleIssuesTab } from './tabs/VehicleIssuesTab';
import { TitleOwnershipTab } from './tabs/TitleOwnershipTab';
import { FollowUpAnswers } from '@/types/follow-up-answers';

interface TabbedFollowUpFormProps {
  formData: FollowUpAnswers;
  updateFormData: (data: Partial<FollowUpAnswers>) => void;
  onSubmit: () => void;
  isLoading?: boolean;
}

const tabs = [
  { id: 'basics', label: '🚗 Basics', color: 'from-blue-400 to-blue-600' },
  { id: 'condition', label: '🎯 Condition', color: 'from-green-400 to-green-600' },
  { id: 'features', label: '⭐ Features', color: 'from-purple-400 to-purple-600' },
  { id: 'modifications', label: '🛠 Modifications', color: 'from-pink-400 to-pink-600' },
  { id: 'service', label: '🔧 Service History', color: 'from-orange-400 to-orange-600' },
  { id: 'accidents', label: '💥 Accidents', color: 'from-red-400 to-red-600' },
  { id: 'issues', label: '⚠️ Vehicle Issues', color: 'from-yellow-400 to-yellow-600' },
  { id: 'title', label: '📄 Title & Ownership', color: 'from-gray-400 to-gray-600' },
];

export function TabbedFollowUpForm({
  formData,
  updateFormData,
  onSubmit,
  isLoading = false,
}: TabbedFollowUpFormProps) {
  const [activeTab, setActiveTab] = useState('basics');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'basics':
        return <BasicInfoTab formData={formData} updateFormData={updateFormData} />;
      case 'condition':
        return <ConditionTab formData={formData} updateFormData={updateFormData} />;
      case 'features':
        return <FeaturesTab formData={formData} updateFormData={updateFormData} />;
      case 'modifications':
        return <ModificationsTab formData={formData} updateFormData={updateFormData} />;
      case 'service':
        return <ServiceMaintenanceTab formData={formData} updateFormData={updateFormData} />;
      case 'accidents':
        return <AccidentHistoryTab formData={formData} updateFormData={updateFormData} />;
      case 'issues':
        return <VehicleIssuesTab formData={formData} updateFormData={updateFormData} />;
      case 'title':
        return <TitleOwnershipTab formData={formData} updateFormData={updateFormData} />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 p-1 bg-gray-50 rounded-xl">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 whitespace-nowrap',
                isActive
                  ? `text-white bg-gradient-to-r ${tab.color} shadow-md`
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {renderTabContent()}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end pt-6 border-t">
        <button
          onClick={onSubmit}
          disabled={isLoading}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {isLoading ? 'Saving...' : 'Complete Valuation'}
        </button>
      </div>
    </div>
  );
}
