
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { FollowUpAnswers } from '@/types/follow-up-answers';
import { ServiceMaintenanceTab } from './tabs/ServiceMaintenanceTab';
import { TitleOwnershipTab } from './tabs/TitleOwnershipTab';
import { PhysicalFeaturesTab } from './tabs/PhysicalFeaturesTab';
import { ModificationsTab } from './tabs/ModificationsTab';
import { FeaturesTab } from './tabs/FeaturesTab';
import { toast } from 'sonner';

interface UnifiedFollowUpFormProps {
  vin: string;
  initialData?: Partial<FollowUpAnswers>;
  onSubmit: (formData: FollowUpAnswers) => void;
  onSave: (formData: FollowUpAnswers) => void;
}

type ColorScheme = {
  bg: string;
  border: string;
  text: string;
};

type ColorSchemes = {
  red: ColorScheme;
  blue: ColorScheme;
  purple: ColorScheme;
  orange: ColorScheme;
  green: ColorScheme;
  indigo: ColorScheme;
};

export function UnifiedFollowUpForm({ vin, initialData, onSubmit, onSave }: UnifiedFollowUpFormProps) {
  const [currentTab, setCurrentTab] = useState(0);
  const [formData, setFormData] = useState<FollowUpAnswers>({
    vin,
    ...initialData
  });

  const tabs = [
    { id: 'condition', name: 'Basic Info', color: 'red' },
    { id: 'service', name: 'Service & Maintenance', color: 'blue' },
    { id: 'title', name: 'Title & Ownership', color: 'purple' },
    { id: 'physical', name: 'Physical Features', color: 'orange' },
    { id: 'modifications', name: 'Modifications', color: 'green' },
    { id: 'features', name: 'Features', color: 'indigo' }
  ];

  const colors: ColorSchemes = {
    red: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700' },
    blue: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700' },
    purple: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700' },
    orange: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700' },
    green: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700' },
    indigo: { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-700' }
  };

  const updateFormData = (updates: Partial<FollowUpAnswers>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleTabClick = (index: number) => {
    setCurrentTab(index);
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

  const handleSave = () => {
    onSave(formData);
    toast.success('Progress saved successfully!');
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  const getCurrentTabColor = () => {
    const colorKey = tabs[currentTab].color as keyof ColorSchemes;
    return colors[colorKey];
  };

  const renderTabContent = () => {
    switch (currentTab) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="text-center py-8">
              <h3 className="text-xl font-semibold mb-4">Basic Vehicle Information</h3>
              <p className="text-gray-600">This section will contain basic condition and mileage inputs.</p>
            </div>
          </div>
        );
      case 1:
        return <ServiceMaintenanceTab formData={formData} updateFormData={updateFormData} />;
      case 2:
        return <TitleOwnershipTab formData={formData} updateFormData={updateFormData} />;
      case 3:
        return <PhysicalFeaturesTab formData={formData} updateFormData={updateFormData} />;
      case 4:
        return (
          <ModificationsTab 
            formData={formData} 
            onModificationsChange={(modified: boolean, types?: string[]) => {
              updateFormData({
                modifications: {
                  modified,
                  types: types || [],
                  reversible: formData.modifications?.reversible
                }
              });
            }}
          />
        );
      case 5:
        return <FeaturesTab formData={formData} updateFormData={updateFormData} />;
      default:
        return null;
    }
  };

  const currentColor = getCurrentTabColor();

  return (
    <div className="max-w-6xl mx-auto">
      {/* Tab Navigation */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map((tab, index) => {
            const tabColorKey = tab.color as keyof ColorSchemes;
            const tabColor = colors[tabColorKey];
            const isActive = currentTab === index;
            const isCompleted = index < currentTab;

            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(index)}
                className={`
                  flex items-center px-4 py-3 rounded-lg font-medium transition-all duration-200
                  ${isActive 
                    ? `${tabColor.bg} ${tabColor.border} ${tabColor.text} border-2 shadow-md` 
                    : isCompleted
                      ? 'bg-green-50 border-green-200 text-green-700 border-2'
                      : 'bg-gray-50 border-gray-200 text-gray-600 border hover:bg-gray-100'
                  }
                `}
              >
                {isCompleted && <Check className="h-4 w-4 mr-2" />}
                <span className="text-sm">{tab.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <Card className={`${currentColor.border} border-2 ${currentColor.bg}`}>
        <CardContent className="p-8">
          {renderTabContent()}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
        <Button
          onClick={handlePrevious}
          disabled={currentTab === 0}
          variant="outline"
          className="flex items-center"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>

        <div className="flex space-x-4">
          <Button onClick={handleSave} variant="outline">
            Save Progress
          </Button>
          
          {currentTab === tabs.length - 1 ? (
            <Button onClick={handleSubmit} className="flex items-center">
              Complete Valuation
              <Check className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleNext} className="flex items-center">
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
