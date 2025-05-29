
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { FollowUpAnswers } from '@/types/follow-up-answers';
import { BasicInfoTab } from './tabs/BasicInfoTab';
import { TitleOwnershipTab } from './tabs/TitleOwnershipTab';
import { ServiceMaintenanceTab } from './tabs/ServiceMaintenanceTab';
import { PhysicalFeaturesTab } from './tabs/PhysicalFeaturesTab';
import { AccidentHistoryTab } from './tabs/AccidentHistoryTab';
import { VehicleConditionTab } from './tabs/VehicleConditionTab';
import { FeaturesTab } from './tabs/FeaturesTab';

interface UnifiedFollowUpFormProps {
  vin: string;
  vehicleInfo?: {
    make: string;
    model: string;
    year: number;
    trim?: string;
  };
  onComplete: (formData: FollowUpAnswers) => void;
}

const TABS = [
  { id: 'basic', label: 'Basic Info', icon: '🚗' },
  { id: 'title', label: 'Title & Ownership', icon: '📋' },
  { id: 'service', label: 'Service & Maintenance', icon: '🔧' },
  { id: 'physical', label: 'Physical Features', icon: '🔍' },
  { id: 'accidents', label: 'Accident History', icon: '⚠️' },
  { id: 'condition', label: 'Vehicle Condition', icon: '⭐' },
  { id: 'features', label: 'Features & Options', icon: '✨' },
];

export function UnifiedFollowUpForm({ vin, vehicleInfo, onComplete }: UnifiedFollowUpFormProps) {
  const [activeTab, setActiveTab] = useState('basic');
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
    accidents: { hadAccident: false },
    modifications: { modified: false, types: [] },
    completion_percentage: 0,
    is_complete: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  const updateFormData = (updates: Partial<FollowUpAnswers>) => {
    setFormData(prev => ({
      ...prev,
      ...updates,
      updated_at: new Date().toISOString(),
    }));
  };

  const getCurrentTabIndex = () => TABS.findIndex(tab => tab.id === activeTab);
  const isFirstTab = getCurrentTabIndex() === 0;
  const isLastTab = getCurrentTabIndex() === TABS.length - 1;

  const goToPrevious = () => {
    const currentIndex = getCurrentTabIndex();
    if (currentIndex > 0) {
      setActiveTab(TABS[currentIndex - 1].id);
    }
  };

  const goToNext = () => {
    const currentIndex = getCurrentTabIndex();
    if (currentIndex < TABS.length - 1) {
      setActiveTab(TABS[currentIndex + 1].id);
    }
  };

  const handleComplete = () => {
    const completedData = {
      ...formData,
      completion_percentage: 100,
      is_complete: true,
    };
    onComplete(completedData);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'basic':
        return <BasicInfoTab formData={formData} updateFormData={updateFormData} />;
      case 'title':
        return <TitleOwnershipTab formData={formData} updateFormData={updateFormData} />;
      case 'service':
        return <ServiceMaintenanceTab formData={formData} updateFormData={updateFormData} />;
      case 'physical':
        return <PhysicalFeaturesTab formData={formData} updateFormData={updateFormData} />;
      case 'accidents':
        return <AccidentHistoryTab formData={formData} updateFormData={updateFormData} />;
      case 'condition':
        return <VehicleConditionTab formData={formData} updateFormData={updateFormData} />;
      case 'features':
        return <FeaturesTab formData={formData} updateFormData={updateFormData} />;
      default:
        return <BasicInfoTab formData={formData} updateFormData={updateFormData} />;
    }
  };

  const progress = ((getCurrentTabIndex() + 1) / TABS.length) * 100;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Follow-up Questions</h1>
        <p className="text-lg text-gray-600">
          Help us provide the most accurate valuation for your {vehicleInfo?.year} {vehicleInfo?.make} {vehicleInfo?.model}
        </p>
        <div className="flex items-center justify-center space-x-4">
          <Progress value={progress} className="w-64" />
          <Badge variant="outline" className="text-sm">
            {getCurrentTabIndex() + 1} of {TABS.length}
          </Badge>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {TABS.map((tab, index) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-4 py-3 rounded-lg border-2 transition-all ${
              activeTab === tab.id
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
            }`}
          >
            <span className="text-lg">{tab.icon}</span>
            <span className="font-medium">{tab.label}</span>
            {index < getCurrentTabIndex() && (
              <CheckCircle className="h-4 w-4 text-green-500" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <Card className="min-h-[600px]">
        <CardContent className="p-8">
          {renderTabContent()}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={goToPrevious}
          disabled={isFirstTab}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Previous</span>
        </Button>

        <div className="text-center">
          <p className="text-sm text-gray-500">
            Step {getCurrentTabIndex() + 1} of {TABS.length}
          </p>
        </div>

        {isLastTab ? (
          <Button
            onClick={handleComplete}
            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="h-4 w-4" />
            <span>Complete Valuation</span>
          </Button>
        ) : (
          <Button
            onClick={goToNext}
            className="flex items-center space-x-2"
          >
            <span>Next</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
