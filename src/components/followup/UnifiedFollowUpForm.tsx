import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { FollowUpAnswers } from '@/types/follow-up-answers';
import { VehicleConditionTab } from './tabs/VehicleConditionTab';
import { AccidentHistoryTab } from './tabs/AccidentHistoryTab';
import { ServiceMaintenanceTab } from './tabs/ServiceMaintenanceTab';
import { TitleOwnershipTab } from './tabs/TitleOwnershipTab';
import { PhysicalFeaturesTab } from './tabs/PhysicalFeaturesTab';
import { ModificationsTab } from './tabs/ModificationsTab';

export interface UnifiedFollowUpFormProps {
  vin: string;
  initialData: FollowUpAnswers;
  onSubmit: (formData: FollowUpAnswers) => void;
  onSave: (formData: FollowUpAnswers) => void;
}

const TABS = [
  { id: 'condition', label: 'Vehicle Condition', icon: '🚗', color: 'emerald' },
  { id: 'accidents', label: 'Accident History', icon: '⚠️', color: 'red' },
  { id: 'service', label: 'Service & Maintenance', icon: '🔧', color: 'blue' },
  { id: 'title', label: 'Title & Ownership', icon: '📄', color: 'purple' },
  { id: 'physical', label: 'Physical Features', icon: '🔍', color: 'orange' },
  { id: 'modifications', label: 'Modifications', icon: '⚙️', color: 'gray' }
];

export function UnifiedFollowUpForm({ 
  vin, 
  initialData, 
  onSubmit, 
  onSave 
}: UnifiedFollowUpFormProps) {
  const [activeTab, setActiveTab] = useState('condition');
  const [formData, setFormData] = useState<FollowUpAnswers>({
    vin,
    accidents: { hadAccident: false },
    modifications: { modified: false },
    updated_at: new Date().toISOString()
  });

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const currentTabIndex = TABS.findIndex(tab => tab.id === activeTab);
  const progress = ((currentTabIndex + 1) / TABS.length) * 100;

  const updateFormData = (updates: Partial<FollowUpAnswers>) => {
    setFormData(prev => ({
      ...prev,
      ...updates,
      updated_at: new Date().toISOString()
    }));
  };

  const handleAccidentChange = (hadAccident: boolean, details?: any) => {
    setFormData(prev => ({
      ...prev,
      accidents: {
        ...prev.accidents,
        hadAccident: hadAccident,
        ...details
      },
      updated_at: new Date().toISOString()
    }));
  };

  const handleModificationChange = (modified: boolean, types?: string[]) => {
    setFormData(prev => ({
      ...prev,
      modifications: {
        ...prev.modifications,
        modified: modified,
        types: types
      },
      updated_at: new Date().toISOString()
    }));
  };

  const goToNextTab = () => {
    if (currentTabIndex < TABS.length - 1) {
      setActiveTab(TABS[currentTabIndex + 1].id);
    }
  };

  const goToPreviousTab = () => {
    if (currentTabIndex > 0) {
      setActiveTab(TABS[currentTabIndex - 1].id);
    }
  };

  const handleComplete = () => {
    onSubmit({
      ...formData,
      completion_percentage: 100,
      is_complete: true
    });
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'condition':
        return (
          <VehicleConditionTab
            formData={formData}
            updateFormData={updateFormData}
          />
        );
      case 'accidents':
        return (
          <AccidentHistoryTab
            formData={formData}
            onAccidentsChange={handleAccidentChange}
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
            onModificationsChange={handleModificationChange}
          />
        );
      default:
        return null;
    }
  };

  const getTabColorClasses = (color: string, isActive: boolean) => {
    const colorMap = {
      emerald: isActive ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100',
      red: isActive ? 'bg-red-500 text-white border-red-500' : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100',
      blue: isActive ? 'bg-blue-500 text-white border-blue-500' : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
      purple: isActive ? 'bg-purple-500 text-white border-purple-500' : 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100',
      orange: isActive ? 'bg-orange-500 text-white border-orange-500' : 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100',
      gray: isActive ? 'bg-gray-500 text-white border-gray-500' : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.gray;
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Vehicle Assessment</h1>
        <p className="text-gray-600 text-lg">Help us provide the most accurate valuation for your vehicle</p>
        
        {/* Progress Bar */}
        <div className="space-y-2">
          <Progress value={progress} className="h-3" />
          <p className="text-sm text-gray-500">
            Step {currentTabIndex + 1} of {TABS.length} - {Math.round(progress)}% Complete
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {TABS.map((tab, index) => {
          const isActive = activeTab === tab.id;
          const isCompleted = index < currentTabIndex;
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                relative p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer
                ${getTabColorClasses(tab.color, isActive)}
                ${isCompleted ? 'ring-2 ring-green-400' : ''}
              `}
            >
              <div className="text-center space-y-2">
                <div className="text-2xl">{tab.icon}</div>
                <div className="font-medium text-sm leading-tight">{tab.label}</div>
                {isCompleted && (
                  <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1">
                    <Check className="h-3 w-3" />
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <Card className="border-2 shadow-lg">
        <CardContent className="p-8">
          {renderTabContent()}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center pt-6 border-t">
        <Button
          variant="outline"
          onClick={goToPreviousTab}
          disabled={currentTabIndex === 0}
          className="flex items-center space-x-2 px-6 py-3"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Previous</span>
        </Button>

        <div className="text-center">
          <p className="text-sm text-gray-500">
            {currentTabIndex + 1} of {TABS.length}
          </p>
        </div>

        {currentTabIndex === TABS.length - 1 ? (
          <Button
            onClick={handleComplete}
            className="flex items-center space-x-2 px-6 py-3 bg-green-600 hover:bg-green-700"
          >
            <Check className="h-4 w-4" />
            <span>Complete Assessment</span>
          </Button>
        ) : (
          <Button
            onClick={goToNextTab}
            className="flex items-center space-x-2 px-6 py-3"
          >
            <span>Next</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
