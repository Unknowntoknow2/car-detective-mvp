import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { FollowUpAnswers, ServiceHistoryDetails, AccidentDetails } from '@/types/follow-up-answers';

// Import all tab components
import { BasicInfoTab } from './tabs/BasicInfoTab';
import { TitleOwnershipTab } from './tabs/TitleOwnershipTab';
import { AccidentHistoryTab } from './tabs/AccidentHistoryTab';
import { ServiceHistoryTab } from './tabs/ServiceHistoryTab';
import { ModificationsTab } from './tabs/ModificationsTab';
import { FeaturesTab } from './tabs/FeaturesTab';
import { DashboardLightsTab } from './tabs/DashboardLightsTab';
import { TiresBrakesTab } from './tabs/TiresBrakesTab';
import { VehicleIssuesTab } from './tabs/VehicleIssuesTab';

interface TabbedFollowUpFormProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
  onSubmit: () => Promise<void>;
  isLoading: boolean;
}

export function TabbedFollowUpForm({ 
  formData, 
  updateFormData, 
  onSubmit, 
  isLoading 
}: TabbedFollowUpFormProps) {
  const [activeTab, setActiveTab] = useState('basic');

  const tabs = [
    { 
      id: 'basic', 
      label: 'Basic Info', 
      icon: '📝',
      component: BasicInfoTab
    },
    { 
      id: 'title', 
      label: 'Title & Ownership', 
      icon: '📄',
      component: TitleOwnershipTab
    },
    { 
      id: 'accidents', 
      label: 'Accidents', 
      icon: '⚠️',
      component: AccidentHistoryTab
    },
    { 
      id: 'service', 
      label: 'Service History', 
      icon: '🔧',
      component: ServiceHistoryTab
    },
    { 
      id: 'modifications', 
      label: 'Modifications', 
      icon: '🛠️',
      component: ModificationsTab
    },
    { 
      id: 'features', 
      label: 'Features', 
      icon: '✨',
      component: FeaturesTab
    },
    { 
      id: 'dashboard', 
      label: 'Dashboard Lights', 
      icon: '💡',
      component: DashboardLightsTab
    },
    { 
      id: 'tires', 
      label: 'Tires & Brakes', 
      icon: '🛞',
      component: TiresBrakesTab
    },
    { 
      id: 'issues', 
      label: 'Vehicle Issues', 
      icon: '🔍',
      component: VehicleIssuesTab
    }
  ];

  const handleServiceHistoryChange = (serviceData: ServiceHistoryDetails) => {
    updateFormData({ serviceHistory: serviceData });
  };

  const handleAccidentChange = (accidentData: AccidentDetails) => {
    updateFormData({ accident_history: accidentData });
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'basic':
        return (
          <BasicInfoTab 
            formData={formData} 
            updateFormData={updateFormData}
          />
        );
      case 'condition':
        return (
          <VehicleConditionTab 
            formData={formData} 
            updateFormData={updateFormData}
          />
        );
      case 'accidents':
        return (
          <AccidentsTab 
            formData={formData} 
            onAccidentsChange={handleAccidentChange}
          />
        );
      case 'service':
        return (
          <ServiceHistoryTab 
            formData={formData} 
            onServiceHistoryChange={handleServiceHistoryChange}
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
      case 'dashboard':
        return (
          <DashboardLightsTab 
            formData={formData} 
            updateFormData={updateFormData}
          />
        );
      case 'tires':
        return (
          <TiresBrakesTab 
            formData={formData} 
            updateFormData={updateFormData}
          />
        );
      case 'issues':
        return (
          <VehicleIssuesTab 
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
      default:
        return null;
    }
  };

  // Calculate completion percentage based on filled fields
  const calculateCompletion = () => {
    let completed = 0;
    let total = tabs.length;

    // Basic scoring logic - can be enhanced
    if (formData.zip_code && formData.mileage) completed++;
    if (formData.title_status && formData.title_status !== 'unknown') completed++;
    if (formData.accident_history) completed++;
    if (formData.serviceHistory) completed++;
    if (formData.modifications) completed++;
    if (formData.features && formData.features.length > 0) completed++;
    if (formData.dashboard_lights) completed++;
    if (formData.tire_condition) completed++;
    if (formData.condition) completed++;

    return Math.round((completed / total) * 100);
  };

  const completionPercentage = calculateCompletion();

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Header */}
      <div className="mb-6 p-4 bg-white rounded-lg border shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-semibold">Vehicle Assessment Progress</h2>
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            {completionPercentage}% Complete
          </Badge>
        </div>
        <Progress value={completionPercentage} className="h-2" />
        <p className="text-sm text-gray-600 mt-2">
          Complete all sections for the most accurate valuation
        </p>
      </div>

      {/* Tabbed Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-9 h-auto">
          {tabs.map((tab) => (
            <TabsTrigger 
              key={tab.id} 
              value={tab.id} 
              className="flex flex-col items-center p-2 text-xs"
            >
              <span className="text-lg mb-1">{tab.icon}</span>
              <span className="hidden lg:block">{tab.label}</span>
              <span className="lg:hidden">{tab.label.split(' ')[0]}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map((tab) => {
          const TabComponent = tab.component;
          return (
            <TabsContent key={tab.id} value={tab.id} className="mt-6">
              {tab.id === 'service' ? (
                <TabComponent 
                  formData={formData} 
                  onServiceHistoryChange={handleServiceHistoryChange}
                />
              ) : (
                <TabComponent 
                  formData={formData} 
                  updateFormData={updateFormData} 
                />
              )}
            </TabsContent>
          );
        })}
      </Tabs>

      {/* Submit Button */}
      <div className="mt-8 p-4 bg-white rounded-lg border shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Ready to Submit?</h3>
            <p className="text-sm text-gray-600">
              Submit your assessment to get an updated valuation
            </p>
          </div>
          <Button 
            onClick={onSubmit} 
            disabled={isLoading || completionPercentage < 50}
            className="min-w-32"
          >
            {isLoading ? 'Submitting...' : 'Submit Assessment'}
          </Button>
        </div>
        {completionPercentage < 50 && (
          <p className="text-xs text-orange-600 mt-2">
            Complete at least 50% of the assessment to submit
          </p>
        )}
      </div>
    </div>
  );
}
