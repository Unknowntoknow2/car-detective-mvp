
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FollowUpAnswers, ServiceHistoryDetails, AccidentDetails, ModificationDetails } from '@/types/follow-up-answers';
import { BasicInfoTab } from './tabs/BasicInfoTab';
import { VehicleConditionTab } from './tabs/VehicleConditionTab';
import { TiresBrakesTab } from './tabs/TiresBrakesTab';
import { AccidentsTab } from './tabs/AccidentsTab';
import { ServiceHistoryTab } from './tabs/ServiceHistoryTab';
import { FeaturesTab } from './tabs/FeaturesTab';
import { ModificationsTab } from './tabs/ModificationsTab';
import { DashboardLightsTab } from './tabs/DashboardLightsTab';
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
    { id: 'basic', label: '📝 Basic Info', icon: '📝' },
    { id: 'condition', label: '🚗 Condition', icon: '🚗' },
    { id: 'tires', label: '🛞 Tires & Brakes', icon: '🛞' },
    { id: 'accidents', label: '⚠️ Accidents', icon: '⚠️' },
    { id: 'service', label: '🔧 Service History', icon: '🔧' },
    { id: 'features', label: '✨ Features', icon: '✨' },
    { id: 'modifications', label: '🛠️ Modifications', icon: '🛠️' },
    { id: 'dashboard', label: '⚡ Dashboard', icon: '⚡' },
    { id: 'issues', label: '🔍 Issues', icon: '🔍' }
  ];

  const handleServiceHistoryChange = (serviceData: ServiceHistoryDetails) => {
    updateFormData({ serviceHistory: serviceData });
  };

  const handleAccidentsChange = (accidentData: AccidentDetails) => {
    updateFormData({ accident_history: accidentData });
  };

  const handleModificationsChange = (modificationData: ModificationDetails) => {
    updateFormData({ modifications: modificationData });
  };

  const calculateProgress = () => {
    const totalFields = 10;
    let filledFields = 0;

    if (formData.zip_code) filledFields++;
    if (formData.mileage) filledFields++;
    if (formData.condition) filledFields++;
    if (formData.transmission) filledFields++;
    if (formData.tire_condition) filledFields++;
    if (formData.exterior_condition) filledFields++;
    if (formData.interior_condition) filledFields++;
    if (formData.serviceHistory?.hasRecords !== undefined) filledFields++;
    if (formData.accident_history?.hadAccident !== undefined) filledFields++;
    if (formData.modifications?.hasModifications !== undefined) filledFields++;

    return Math.round((filledFields / totalFields) * 100);
  };

  const progress = calculateProgress();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Vehicle Follow-Up Questions</span>
            <span className="text-sm font-normal text-muted-foreground">
              Progress: {progress}%
            </span>
          </CardTitle>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </CardHeader>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 lg:grid-cols-9 gap-1 h-auto p-1">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="flex flex-col items-center gap-1 p-2 text-xs"
            >
              <span className="text-lg">{tab.icon}</span>
              <span className="hidden lg:block">{tab.label.split(' ')[1] || tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="mt-6">
          <TabsContent value="basic">
            <BasicInfoTab
              formData={formData}
              updateFormData={updateFormData}
            />
          </TabsContent>

          <TabsContent value="condition">
            <VehicleConditionTab
              formData={formData}
              updateFormData={updateFormData}
            />
          </TabsContent>

          <TabsContent value="tires">
            <TiresBrakesTab
              formData={formData}
              updateFormData={updateFormData}
            />
          </TabsContent>

          <TabsContent value="accidents">
            <AccidentsTab
              formData={formData}
              onAccidentsChange={handleAccidentsChange}
            />
          </TabsContent>

          <TabsContent value="service">
            <ServiceHistoryTab
              formData={formData}
              onServiceHistoryChange={handleServiceHistoryChange}
            />
          </TabsContent>

          <TabsContent value="features">
            <FeaturesTab
              formData={formData}
              updateFormData={updateFormData}
            />
          </TabsContent>

          <TabsContent value="modifications">
            <ModificationsTab
              formData={formData}
              onModificationsChange={handleModificationsChange}
            />
          </TabsContent>

          <TabsContent value="dashboard">
            <DashboardLightsTab
              formData={formData}
              updateFormData={updateFormData}
            />
          </TabsContent>

          <TabsContent value="issues">
            <VehicleIssuesTab
              formData={formData}
              updateFormData={updateFormData}
            />
          </TabsContent>
        </div>
      </Tabs>

      {/* Submit Button */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              Complete at least {Math.max(0, 70 - progress)}% more to submit
            </div>
            <Button
              onClick={onSubmit}
              disabled={isLoading || progress < 70}
              className="min-w-32"
            >
              {isLoading ? 'Submitting...' : 'Submit Follow-Up'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
