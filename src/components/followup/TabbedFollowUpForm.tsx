
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { FollowUpAnswers } from '@/types/follow-up-answers';

// Import all tab components
import { BasicInfoTab } from './tabs/BasicInfoTab';
import { TitleOwnershipTab } from './tabs/TitleOwnershipTab';
import { AccidentsTab } from './tabs/AccidentsTab';
import { ServiceHistoryTab } from './tabs/ServiceHistoryTab';
import { TiresBrakesTab } from './tabs/TiresBrakesTab';
import { DashboardLightsTab } from './tabs/DashboardLightsTab';
import { VehicleIssuesTab } from './tabs/VehicleIssuesTab';
import { FeaturesTab } from './tabs/FeaturesTab';
import { ModificationsTab } from './tabs/ModificationsTab';

interface TabbedFollowUpFormProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
  onSubmit: () => Promise<void>;
  isLoading: boolean;
}

const tabs = [
  {
    id: 'basic-info',
    label: 'Basic Info',
    component: BasicInfoTab,
    icon: '🚗',
    requiredFields: ['zip_code', 'mileage', 'condition', 'transmission']
  },
  {
    id: 'title-ownership',
    label: 'Title & Ownership',
    component: TitleOwnershipTab,
    icon: '📋',
    requiredFields: ['title_status']
  },
  {
    id: 'accidents',
    label: 'Accident History',
    component: AccidentsTab,
    icon: '⚠️',
    requiredFields: []
  },
  {
    id: 'service-history',
    label: 'Service History',
    component: ServiceHistoryTab,
    icon: '🔧',
    requiredFields: []
  },
  {
    id: 'tires-brakes',
    label: 'Tires & Brakes',
    component: TiresBrakesTab,
    icon: '🛞',
    requiredFields: ['tire_condition']
  },
  {
    id: 'dashboard-lights',
    label: 'Dashboard Lights',
    component: DashboardLightsTab,
    icon: '💡',
    requiredFields: []
  },
  {
    id: 'vehicle-issues',
    label: 'Vehicle Issues',
    component: VehicleIssuesTab,
    icon: '🔍',
    requiredFields: []
  },
  {
    id: 'features',
    label: 'Features',
    component: FeaturesTab,
    icon: '⭐',
    requiredFields: []
  },
  {
    id: 'modifications',
    label: 'Modifications',
    component: ModificationsTab,
    icon: '⚙️',
    requiredFields: []
  }
];

export function TabbedFollowUpForm({ formData, updateFormData, onSubmit, isLoading }: TabbedFollowUpFormProps) {
  const [activeTab, setActiveTab] = useState('basic-info');

  // Calculate completion percentage
  const calculateCompletion = () => {
    const totalRequiredFields = tabs.reduce((total, tab) => total + tab.requiredFields.length, 0);
    let completedFields = 0;

    tabs.forEach(tab => {
      tab.requiredFields.forEach(field => {
        const value = formData[field as keyof FollowUpAnswers];
        if (value !== undefined && value !== null && value !== '') {
          completedFields++;
        }
      });
    });

    return totalRequiredFields > 0 ? Math.round((completedFields / totalRequiredFields) * 100) : 0;
  };

  const getTabStatus = (tab: typeof tabs[0]) => {
    const completedFields = tab.requiredFields.filter(field => {
      const value = formData[field as keyof FollowUpAnswers];
      return value !== undefined && value !== null && value !== '';
    });
    
    if (tab.requiredFields.length === 0) return 'optional';
    return completedFields.length === tab.requiredFields.length ? 'complete' : 'incomplete';
  };

  const completionPercentage = calculateCompletion();
  const currentTabIndex = tabs.findIndex(tab => tab.id === activeTab);

  const handleNext = () => {
    if (currentTabIndex < tabs.length - 1) {
      setActiveTab(tabs[currentTabIndex + 1].id);
    }
  };

  const handlePrevious = () => {
    if (currentTabIndex > 0) {
      setActiveTab(tabs[currentTabIndex - 1].id);
    }
  };

  const handleAccidentChange = (accidentData: any) => {
    updateFormData({ accident_history: accidentData });
  };

  const handleServiceHistoryChange = (serviceData: any) => {
    updateFormData({ serviceHistory: serviceData });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Header */}
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Vehicle Details</h2>
              <p className="text-gray-600">Complete your vehicle information for an accurate valuation</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">{completionPercentage}%</div>
              <div className="text-sm text-gray-500">Complete</div>
            </div>
          </div>
          <Progress value={completionPercentage} className="h-3 bg-white" />
        </CardContent>
      </Card>

      {/* Tab Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="sticky top-0 bg-white z-10 border-b border-gray-200 pb-4 mb-6">
          <TabsList className="grid w-full grid-cols-5 lg:grid-cols-9 bg-gray-100 p-1 h-auto">
            {tabs.map((tab) => {
              const status = getTabStatus(tab);
              return (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="relative flex flex-col items-center p-3 text-xs data-[state=active]:bg-white data-[state=active]:shadow-sm min-h-[60px]"
                >
                  <div className="flex items-center space-x-1 mb-1">
                    <span className="text-lg">{tab.icon}</span>
                    {status === 'complete' && (
                      <CheckCircle className="h-3 w-3 text-green-500" />
                    )}
                    {status === 'incomplete' && (
                      <AlertCircle className="h-3 w-3 text-orange-500" />
                    )}
                  </div>
                  <span className="text-center leading-tight">{tab.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>

        {/* Tab Content */}
        {tabs.map((tab) => {
          const TabComponent = tab.component;
          return (
            <TabsContent key={tab.id} value={tab.id} className="mt-0">
              <Card className="border-gray-200 shadow-sm">
                <CardContent className="p-6">
                  {tab.id === 'accidents' ? (
                    <TabComponent
                      formData={formData}
                      onAccidentsChange={handleAccidentChange}
                    />
                  ) : tab.id === 'service-history' ? (
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
                </CardContent>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>

      {/* Navigation Controls */}
      <Card className="border-gray-200 bg-gray-50">
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentTabIndex === 0}
              className="min-w-[100px]"
            >
              Previous
            </Button>
            
            <div className="text-sm text-gray-500">
              Step {currentTabIndex + 1} of {tabs.length}
            </div>

            {currentTabIndex === tabs.length - 1 ? (
              <Button
                onClick={onSubmit}
                disabled={isLoading}
                className="min-w-[100px] bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                {isLoading ? 'Submitting...' : 'Complete Valuation'}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                className="min-w-[100px]"
              >
                Next
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
