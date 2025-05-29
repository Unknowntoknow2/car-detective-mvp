
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { FollowUpAnswers } from '@/types/follow-up-answers';
import { AccidentHistoryTab } from './tabs/AccidentHistoryTab';
import { ServiceMaintenanceTab } from './tabs/ServiceMaintenanceTab';
import { TitleOwnershipTab } from './tabs/TitleOwnershipTab';
import { PhysicalFeaturesTab } from './tabs/PhysicalFeaturesTab';
import { ModificationsTab } from './tabs/ModificationsTab';
import { FeaturesTab } from './tabs/FeaturesTab';

interface UnifiedFollowUpFormProps {
  vin: string;
  initialData?: Partial<FollowUpAnswers>;
  onSubmit: (formData: FollowUpAnswers) => void;
  onSave: (formData: FollowUpAnswers) => void;
}

const tabs = [
  { id: 'accidents', label: 'Accident History', icon: '🚗', color: 'red' },
  { id: 'service', label: 'Service & Maintenance', icon: '🔧', color: 'blue' },
  { id: 'title', label: 'Title & Ownership', icon: '📄', color: 'purple' },
  { id: 'physical', label: 'Physical Features', icon: '🔍', color: 'orange' },
  { id: 'modifications', label: 'Modifications', icon: '⚙️', color: 'green' },
  { id: 'features', label: 'Features', icon: '✨', color: 'indigo' }
];

export function UnifiedFollowUpForm({ vin, initialData = {}, onSubmit, onSave }: UnifiedFollowUpFormProps) {
  const [currentTab, setCurrentTab] = useState(0);
  const [formData, setFormData] = useState<FollowUpAnswers>({
    vin,
    ...initialData
  });

  const updateFormData = (updates: Partial<FollowUpAnswers>) => {
    const newFormData = { ...formData, ...updates };
    setFormData(newFormData);
    onSave(newFormData);
  };

  const handleAccidentsChange = (hadAccident: boolean, details?: any) => {
    updateFormData({
      accidents: {
        hadAccident,
        ...details
      }
    });
  };

  const handleNext = () => {
    if (currentTab < tabs.length - 1) {
      setCurrentTab(currentTab + 1);
    }
  };

  const handlePrevious = () => {
    if (currentTab > 0) {
      setCurrentTab(currentTab - 1);
    }
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  const getColorClasses = (color: string, variant: 'bg' | 'border' | 'text' = 'bg') => {
    const colorMap = {
      red: { bg: 'bg-red-500', border: 'border-red-500', text: 'text-red-600' },
      blue: { bg: 'bg-blue-500', border: 'border-blue-500', text: 'text-blue-600' },
      purple: { bg: 'bg-purple-500', border: 'border-purple-500', text: 'text-purple-600' },
      orange: { bg: 'bg-orange-500', border: 'border-orange-500', text: 'text-orange-600' },
      green: { bg: 'bg-green-500', border: 'border-green-500', text: 'text-green-600' },
      indigo: { bg: 'bg-indigo-500', border: 'border-indigo-500', text: 'text-indigo-600' }
    };
    return colorMap[color]?.[variant] || colorMap.blue[variant];
  };

  const renderTabContent = () => {
    const currentTabId = tabs[currentTab].id;
    
    switch (currentTabId) {
      case 'accidents':
        return (
          <AccidentHistoryTab 
            formData={formData} 
            onAccidentsChange={handleAccidentsChange}
          />
        );
      case 'service':
        return (
          <ServiceMaintenanceTab 
            formData={formData} 
            updateFormData={updateFormData}
          />
        );
      case 'title':
        return (
          <TitleOwnershipTab 
            formData={formData} 
            updateFormData={updateFormData}
          />
        );
      case 'physical':
        return (
          <PhysicalFeaturesTab 
            formData={formData} 
            updateFormData={updateFormData}
          />
        );
      case 'modifications':
        return (
          <ModificationsTab 
            formData={formData} 
            updateFormData={updateFormData}
          />
        );
      case 'features':
        return (
          <FeaturesTab 
            formData={formData} 
            updateFormData={updateFormData}
          />
        );
      default:
        return <div>Tab content not found</div>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Tab Navigation */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab, index) => {
            const isActive = index === currentTab;
            const isCompleted = index < currentTab;
            
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(index)}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200
                  ${isActive 
                    ? `${getColorClasses(tab.color, 'bg')} text-white shadow-md transform scale-105` 
                    : isCompleted
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                  }
                `}
              >
                <span className="text-lg">{isCompleted ? '✅' : tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {renderTabContent()}
      </div>

      {/* Navigation Footer */}
      <div className="bg-gray-50 px-6 py-4 border-t flex justify-between items-center">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentTab === 0}
          className="flex items-center space-x-2"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Previous</span>
        </Button>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">
            {currentTab + 1} of {tabs.length}
          </span>
        </div>

        {currentTab === tabs.length - 1 ? (
          <Button
            onClick={handleSubmit}
            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
          >
            <Check className="h-4 w-4" />
            <span>Complete Valuation</span>
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            className="flex items-center space-x-2"
          >
            <span>Next</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
