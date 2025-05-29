
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { FollowUpAnswers } from '@/types/follow-up-answers';

// Tab components
import { BasicInfoTab } from './tabs/BasicInfoTab';
import { TitleOwnershipTab } from './tabs/TitleOwnershipTab';
import { ServiceMaintenanceTab } from './tabs/ServiceMaintenanceTab';
import { VehicleConditionTab } from './tabs/VehicleConditionTab';
import { PhysicalFeaturesTab } from './tabs/PhysicalFeaturesTab';
import { FeaturesTab } from './tabs/FeaturesTab';
import { AccidentHistoryTab } from './tabs/AccidentHistoryTab';

interface UnifiedFollowUpFormProps {
  vin: string;
  initialData?: Partial<FollowUpAnswers>;
  onSubmit: (formData: FollowUpAnswers) => void;
  onSave?: (formData: FollowUpAnswers) => void;
}

const tabs = [
  { id: 'basic', label: 'Basic Info', component: BasicInfoTab },
  { id: 'title', label: 'Title & Ownership', component: TitleOwnershipTab },
  { id: 'service', label: 'Service & Maintenance', component: ServiceMaintenanceTab },
  { id: 'condition', label: 'Vehicle Condition', component: VehicleConditionTab },
  { id: 'physical', label: 'Physical Features', component: PhysicalFeaturesTab },
  { id: 'features', label: 'Features & Options', component: FeaturesTab },
  { id: 'accidents', label: 'Accident History', component: AccidentHistoryTab },
];

export function UnifiedFollowUpForm({ vin, initialData, onSubmit, onSave }: UnifiedFollowUpFormProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState<FollowUpAnswers>({
    vin,
    zip_code: '',
    condition: 'good',
    title_status: 'clean',
    previous_use: 'personal',
    service_history: 'good',
    maintenance_status: 'good',
    tire_condition: 'good',
    frame_damage: false,
    dashboard_lights: [],
    accidents: {
      hadAccident: false,
    },
    modifications: {
      modified: false,
      types: [],
    },
    features: [],
    completion_percentage: 0,
    is_complete: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...initialData, // Apply any initial data passed from parent
  });

  // Update form data and calculate completion
  const updateFormData = (updates: Partial<FollowUpAnswers>) => {
    const newFormData = { ...formData, ...updates, updated_at: new Date().toISOString() };
    
    // Calculate completion percentage
    const totalFields = 10; // Approximate number of required fields
    let completedFields = 0;
    
    if (newFormData.zip_code) completedFields++;
    if (newFormData.condition) completedFields++;
    if (newFormData.title_status) completedFields++;
    if (newFormData.previous_use) completedFields++;
    if (newFormData.service_history) completedFields++;
    if (newFormData.maintenance_status) completedFields++;
    if (newFormData.tire_condition) completedFields++;
    if (newFormData.dashboard_lights?.length >= 0) completedFields++;
    if (newFormData.accidents?.hadAccident !== undefined) completedFields++;
    if (newFormData.modifications?.modified !== undefined) completedFields++;
    
    const completionPercentage = Math.round((completedFields / totalFields) * 100);
    newFormData.completion_percentage = completionPercentage;
    newFormData.is_complete = completionPercentage >= 80;
    
    setFormData(newFormData);
    
    // Auto-save if onSave is provided
    if (onSave) {
      onSave(newFormData);
    }
  };

  const handleNext = () => {
    if (activeTab < tabs.length - 1) {
      setActiveTab(activeTab + 1);
    }
  };

  const handlePrevious = () => {
    if (activeTab > 0) {
      setActiveTab(activeTab - 1);
    }
  };

  const handleSubmit = () => {
    const finalFormData = {
      ...formData,
      is_complete: true,
      completion_percentage: 100,
      updated_at: new Date().toISOString(),
    };
    onSubmit(finalFormData);
  };

  const CurrentTabComponent = tabs[activeTab].component;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-3xl font-bold text-gray-900">
            Vehicle Assessment
          </CardTitle>
          <p className="text-gray-600 text-lg">
            Help us understand your vehicle better for accurate valuation
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-6">
            <span className="text-sm font-medium text-blue-600">
              Step {activeTab + 1} of {tabs.length}
            </span>
            <span className="text-sm font-medium text-blue-600">
              {formData.completion_percentage}% Complete
            </span>
          </div>
          <Progress value={formData.completion_percentage} className="h-3" />
        </CardContent>
      </Card>

      {/* Tab Navigation */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-2 mb-8">
            {tabs.map((tab, index) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(index)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === index
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {index < activeTab && (
                  <CheckCircle className="inline h-4 w-4 mr-2 text-green-500" />
                )}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="min-h-[600px]">
            <CurrentTabComponent 
              formData={formData} 
              updateFormData={updateFormData}
            />
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={activeTab === 0}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Previous</span>
            </Button>

            <div className="flex space-x-4">
              {activeTab === tabs.length - 1 ? (
                <Button
                  onClick={handleSubmit}
                  className="bg-green-600 hover:bg-green-700 text-white flex items-center space-x-2"
                  disabled={formData.completion_percentage < 50}
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>Complete Assessment</span>
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  className="flex items-center space-x-2"
                >
                  <span>Next</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
