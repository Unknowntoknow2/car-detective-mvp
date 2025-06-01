
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Car, FileText, AlertTriangle, Wrench, Zap, AlertCircle, Bug, Star, Settings } from 'lucide-react';
import { BasicInfoTab } from './tabs/BasicInfoTab';
import { TitleOwnershipTab } from './tabs/TitleOwnershipTab';
import { AccidentsTab } from './tabs/AccidentsTab';
import { ServiceHistoryTab } from './tabs/ServiceHistoryTab';
import { TiresBrakesTab } from './tabs/TiresBrakesTab';
import { DashboardLightsTab } from './tabs/DashboardLightsTab';
import { VehicleIssuesTab } from './tabs/VehicleIssuesTab';
import { FeaturesTab } from './tabs/FeaturesTab';
import { ModificationsTab } from './tabs/ModificationsTab';
import { FollowUpAnswers, AccidentDetails, ServiceHistoryDetails } from '@/types/follow-up-answers';

interface TabbedFollowUpFormProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
  onSubmit: () => Promise<void>;
  isLoading: boolean;
}

const tabs = [
  { id: 'basicInfo', label: 'Basic Info', icon: Car, color: 'bg-blue-500' },
  { id: 'titleOwnership', label: 'Title & Ownership', icon: FileText, color: 'bg-purple-500' },
  { id: 'accidents', label: 'Accident History', icon: AlertTriangle, color: 'bg-red-500' },
  { id: 'serviceHistory', label: 'Service History', icon: Wrench, color: 'bg-green-500' },
  { id: 'tiresBrakes', label: 'Tires & Brakes', icon: Zap, color: 'bg-orange-500' },
  { id: 'dashboardLights', label: 'Dashboard Lights', icon: AlertCircle, color: 'bg-yellow-500' },
  { id: 'vehicleIssues', label: 'Vehicle Issues', icon: Bug, color: 'bg-pink-500' },
  { id: 'features', label: 'Features', icon: Star, color: 'bg-indigo-500' },
  { id: 'modifications', label: 'Modifications', icon: Settings, color: 'bg-gray-500' }
];

export function TabbedFollowUpForm({ 
  formData, 
  updateFormData, 
  onSubmit, 
  isLoading 
}: TabbedFollowUpFormProps) {
  const [activeTab, setActiveTab] = useState('basicInfo');

  // Calculate completion percentage
  const calculateProgress = () => {
    const requiredFields = [
      formData.zip_code,
      formData.mileage,
      formData.condition,
      formData.transmission,
      formData.title_status,
      formData.tire_condition,
      formData.exterior_condition,
      formData.interior_condition
    ];
    
    const completedFields = requiredFields.filter(field => 
      field !== undefined && field !== null && field !== ''
    ).length;
    
    return Math.round((completedFields / requiredFields.length) * 100);
  };

  const progress = calculateProgress();

  // Helper functions for nested object updates
  const handleAccidentsChange = (accidentData: AccidentDetails) => {
    updateFormData({ accident_history: accidentData });
  };

  const handleServiceHistoryChange = (serviceData: ServiceHistoryDetails) => {
    updateFormData({ serviceHistory: serviceData });
  };

  const currentTabIndex = tabs.findIndex(tab => tab.id === activeTab);
  const isLastTab = currentTabIndex === tabs.length - 1;
  const isFirstTab = currentTabIndex === 0;

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

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Completion Progress</span>
          <span>{progress}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* Enhanced Tab Navigation */}
        <TabsList className="grid grid-cols-3 lg:grid-cols-9 w-full h-auto p-1 bg-muted rounded-lg">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="flex flex-col items-center p-3 text-xs gap-1 data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                <div className={`p-1.5 rounded-full ${tab.color} text-white`}>
                  <Icon className="h-3 w-3" />
                </div>
                <span className="hidden lg:block font-medium">{tab.label}</span>
                <span className="lg:hidden">{tab.label.split(' ')[0]}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {/* Tab Content */}
        <div className="mt-6">
          <TabsContent value="basicInfo" className="space-y-6">
            <BasicInfoTab
              formData={formData}
              updateFormData={updateFormData}
            />
          </TabsContent>

          <TabsContent value="titleOwnership" className="space-y-6">
            <TitleOwnershipTab
              formData={formData}
              updateFormData={updateFormData}
            />
          </TabsContent>

          <TabsContent value="accidents" className="space-y-6">
            <AccidentsTab
              formData={formData}
              onAccidentsChange={handleAccidentsChange}
            />
          </TabsContent>

          <TabsContent value="serviceHistory" className="space-y-6">
            <ServiceHistoryTab
              formData={formData}
              onServiceHistoryChange={handleServiceHistoryChange}
            />
          </TabsContent>

          <TabsContent value="tiresBrakes" className="space-y-6">
            <TiresBrakesTab
              formData={formData}
              updateFormData={updateFormData}
            />
          </TabsContent>

          <TabsContent value="dashboardLights" className="space-y-6">
            <DashboardLightsTab
              formData={formData}
              updateFormData={updateFormData}
            />
          </TabsContent>

          <TabsContent value="vehicleIssues" className="space-y-6">
            <VehicleIssuesTab
              formData={formData}
              updateFormData={updateFormData}
            />
          </TabsContent>

          <TabsContent value="features" className="space-y-6">
            <FeaturesTab
              formData={formData}
              updateFormData={updateFormData}
            />
          </TabsContent>

          <TabsContent value="modifications" className="space-y-6">
            <ModificationsTab
              formData={formData}
              updateFormData={updateFormData}
            />
          </TabsContent>
        </div>

        {/* Navigation Controls */}
        <div className="flex justify-between items-center mt-8 pt-6 border-t">
          <Button
            variant="outline"
            onClick={goToPreviousTab}
            disabled={isFirstTab}
          >
            Previous
          </Button>

          <div className="text-sm text-muted-foreground">
            Step {currentTabIndex + 1} of {tabs.length}
          </div>

          {isLastTab ? (
            <Button
              onClick={onSubmit}
              disabled={isLoading || progress < 50}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {isLoading ? 'Submitting...' : 'Complete Valuation'}
            </Button>
          ) : (
            <Button onClick={goToNextTab}>
              Next
            </Button>
          )}
        </div>
      </Tabs>
    </div>
  );
}
