
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import { FollowUpAnswers } from '@/types/follow-up-answers';

// Import all tab components
import { BasicInfoTab } from './tabs/BasicInfoTab';
import { TitleOwnershipTab } from './tabs/TitleOwnershipTab';
import { ServiceMaintenanceTab } from './tabs/ServiceMaintenanceTab';
import { VehicleConditionTab } from './tabs/VehicleConditionTab';
import { PhysicalFeaturesTab } from './tabs/PhysicalFeaturesTab';
import { FeaturesTab } from './tabs/FeaturesTab';
import { AccidentHistoryTab } from './tabs/AccidentHistoryTab';

export interface UnifiedFollowUpFormProps {
  vin: string;
  initialData?: Partial<FollowUpAnswers>;
  onSubmit: (formData: FollowUpAnswers) => void;
  onSave: (formData: FollowUpAnswers) => void;
}

export function UnifiedFollowUpForm({ vin, initialData, onSubmit, onSave }: UnifiedFollowUpFormProps) {
  const [currentTab, setCurrentTab] = useState(0);
  const [formData, setFormData] = useState<FollowUpAnswers>({
    vin,
    zip_code: '',
    condition: 'good',
    title_status: 'clean',
    previous_use: 'personal',
    service_history: 'good',
    maintenance_status: 'good',
    tire_condition: 'good',
    exterior_condition: 'good',
    interior_condition: 'good',
    frame_damage: false,
    dashboard_lights: [],
    accidents: {
      hadAccident: false,
      count: 0,
      frameDamage: false
    },
    modifications: {
      modified: false,
      types: [],
      reversible: true
    },
    features: [],
    completion_percentage: 0,
    is_complete: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...initialData
  });

  const tabs = [
    { id: 'basic', title: 'Basic Info', icon: '🚗', component: BasicInfoTab },
    { id: 'title', title: 'Title & Ownership', icon: '📄', component: TitleOwnershipTab },
    { id: 'service', title: 'Service & Maintenance', icon: '🔧', component: ServiceMaintenanceTab },
    { id: 'condition', title: 'Vehicle Condition', icon: '⭐', component: VehicleConditionTab },
    { id: 'physical', title: 'Physical Features', icon: '🔍', component: PhysicalFeaturesTab },
    { id: 'features', title: 'Features & Options', icon: '✨', component: FeaturesTab },
    { id: 'accidents', title: 'Accident History', icon: '⚠️', component: AccidentHistoryTab }
  ];

  const updateFormData = (updates: Partial<FollowUpAnswers>) => {
    setFormData(prev => {
      const updated = { ...prev, ...updates, updated_at: new Date().toISOString() };
      // Auto-save on every update
      onSave(updated);
      return updated;
    });
  };

  const calculateProgress = () => {
    const requiredFields = [
      formData.condition,
      formData.zip_code,
      formData.title_status,
      formData.previous_use,
      formData.service_history,
      formData.maintenance_status,
      formData.tire_condition
    ];
    
    const completedFields = requiredFields.filter(field => field && field !== '').length;
    return Math.round((completedFields / requiredFields.length) * 100);
  };

  const progress = calculateProgress();

  const canProceed = () => {
    switch (currentTab) {
      case 0: // Basic Info
        return formData.condition && formData.zip_code;
      case 1: // Title & Ownership
        return formData.title_status && formData.previous_use;
      case 2: // Service & Maintenance
        return formData.service_history && formData.maintenance_status;
      case 3: // Vehicle Condition
        return formData.exterior_condition && formData.interior_condition;
      case 4: // Physical Features
        return formData.tire_condition !== undefined;
      case 5: // Features & Options
        return true; // Optional tab
      case 6: // Accident History
        return true; // Optional tab
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (currentTab < tabs.length - 1) {
      setCurrentTab(currentTab + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentTab > 0) {
      setCurrentTab(currentTab - 1);
    }
  };

  const handleComplete = () => {
    const finalData: FollowUpAnswers = {
      ...formData,
      completion_percentage: 100,
      is_complete: true,
      updated_at: new Date().toISOString()
    };
    
    onSubmit(finalData);
  };

  const CurrentTabComponent = tabs[currentTab].component;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">Vehicle Assessment</h1>
        <p className="text-xl text-gray-600">Help us determine your vehicle's accurate value</p>
        
        {/* Progress Bar */}
        <div className="max-w-md mx-auto space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Progress</span>
            <span>{progress}% Complete</span>
          </div>
          <Progress value={progress} className="h-3" />
        </div>
      </div>

      {/* Tab Navigation */}
      <Card className="border-gray-200">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-2xl">{tabs[currentTab].icon}</span>
              <div>
                <CardTitle className="text-2xl">{tabs[currentTab].title}</CardTitle>
                <p className="text-gray-600">Step {currentTab + 1} of {tabs.length}</p>
              </div>
            </div>
            
            {/* Tab Pills */}
            <div className="hidden md:flex space-x-2">
              {tabs.map((tab, index) => (
                <button
                  key={tab.id}
                  onClick={() => setCurrentTab(index)}
                  className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                    index === currentTab
                      ? 'bg-blue-100 text-blue-700'
                      : index < currentTab
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {index < currentTab && <CheckCircle className="h-4 w-4 inline mr-1" />}
                  {tab.icon} {tab.title}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {/* Current Tab Content */}
          <CurrentTabComponent 
            formData={formData} 
            updateFormData={updateFormData}
          />

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentTab === 0}
              className="flex items-center space-x-2"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </Button>

            <div className="text-sm text-gray-500">
              {currentTab + 1} of {tabs.length}
            </div>

            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex items-center space-x-2"
            >
              <span>{currentTab === tabs.length - 1 ? 'Complete Assessment' : 'Next'}</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
