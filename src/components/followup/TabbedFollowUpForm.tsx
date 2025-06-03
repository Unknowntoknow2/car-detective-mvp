
import React, { useState } from 'react';
import { cn } from '@/utils/cn';
import { BasicInfoTab } from './tabs/BasicInfoTab';
import { ConditionTab } from './tabs/ConditionTab';
import { VehicleConditionTab } from './tabs/VehicleConditionTab';
import { FeaturesTab } from './tabs/FeaturesTab';
import { ModificationsTab } from './tabs/ModificationsTab';
import { ServiceMaintenanceTab } from './tabs/ServiceMaintenanceTab';
import { AccidentHistoryTab } from './tabs/AccidentHistoryTab';
import { VehicleIssuesTab } from './tabs/VehicleIssuesTab';
import { TitleOwnershipTab } from './tabs/TitleOwnershipTab';
import { FollowUpAnswers, AccidentDetails, ServiceHistoryDetails } from '@/types/follow-up-answers';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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

  const currentTabIndex = tabs.findIndex(tab => tab.id === activeTab);
  const isFirstTab = currentTabIndex === 0;
  const isLastTab = currentTabIndex === tabs.length - 1;

  const goToNextTab = () => {
    if (!isLastTab) {
      setActiveTab(tabs[currentTabIndex + 1].id);
    }
  };

  const goToPreviousTab = () => {
    if (!isFirstTab) {
      setActiveTab(tabs[currentTabIndex - 1].id);
    }
  };

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
    <div className="w-full">
      {/* Tab Navigation */}
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
                  ? `text-white bg-gradient-to-r ${tab.color} shadow-lg transform scale-105`
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-102'
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="w-full min-h-[500px] bg-white rounded-lg border border-gray-200 p-6">
        {renderTab()}
      </div>

      {/* Tab Navigation Buttons */}
      <div className="flex justify-between items-center mt-6">
        <button
          onClick={goToPreviousTab}
          disabled={isFirstTab}
          className={cn(
            'flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all',
            isFirstTab 
              ? 'opacity-40 cursor-not-allowed bg-gray-100 text-gray-500'
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
          )}
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Previous</span>
        </button>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">
            {currentTabIndex + 1} of {tabs.length}
          </span>
        </div>

        <button
          onClick={isLastTab ? onSubmit : goToNextTab}
          className={cn(
            'flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all',
            isLastTab
              ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700'
              : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700'
          )}
        >
          <span>{isLastTab ? 'Complete Valuation' : 'Next'}</span>
          {!isLastTab && <ChevronRight className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
};

export default TabbedFollowUpForm;
