
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { BasicInfoTab } from './tabs/BasicInfoTab';
import { ConditionTab } from './tabs/ConditionTab';
import { FeaturesTab } from './tabs/FeaturesTab';
import { ModificationsTab } from './tabs/ModificationsTab';
import { ServiceHistoryTab } from './tabs/ServiceHistoryTab';
import { AccidentHistoryTab } from './tabs/AccidentHistoryTab';
import { VehicleIssuesTab } from './tabs/VehicleIssuesTab';
import { TitleOwnershipTab } from './tabs/TitleOwnershipTab';
import { FollowUpAnswers, AccidentDetails, ServiceHistoryDetails } from '@/types/follow-up-answers';

interface TabbedFollowUpFormProps {
  formData: FollowUpAnswers;
  updateFormData: (data: Partial<FollowUpAnswers>) => void;
  onAccidentsChange: (accidents: AccidentDetails) => void;
  onServiceHistoryChange: (history: ServiceHistoryDetails) => void;
  onModificationsChange: (mods: FollowUpAnswers['modifications']) => void;
  onSubmit: () => void;
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

const TabbedFollowUpForm: React.FC<TabbedFollowUpFormProps> = ({
  formData,
  updateFormData,
  onAccidentsChange,
  onServiceHistoryChange,
  onModificationsChange,
  onSubmit,
}) => {
  const [activeTab, setActiveTab] = useState('basics');

  const renderTab = () => {
    switch (activeTab) {
      case 'basics':
        return <BasicInfoTab formData={formData} updateFormData={updateFormData} />;
      case 'condition':
        return <ConditionTab formData={formData} updateFormData={updateFormData} />;
      case 'features':
        return <FeaturesTab 
          formData={formData} 
          updateFormData={updateFormData} 
          baseValue={30000}
        />;
      case 'modifications':
        return <ModificationsTab formData={formData} updateFormData={updateFormData} />;
      case 'service':
        return <ServiceHistoryTab formData={formData} onServiceHistoryChange={onServiceHistoryChange} />;
      case 'accidents':
        return <AccidentHistoryTab formData={formData} onAccidentsChange={onAccidentsChange} />;
      case 'issues':
        return <VehicleIssuesTab formData={formData} updateFormData={updateFormData} />;
      case 'title':
        return <TitleOwnershipTab formData={formData} updateFormData={updateFormData} />;
      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200',
                isActive
                  ? `text-white bg-gradient-to-r ${tab.color}`
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      <div className="w-full">{renderTab()}</div>
    </div>
  );
};

export default TabbedFollowUpForm;
