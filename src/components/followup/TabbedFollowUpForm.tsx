
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FollowUpAnswers } from '@/types/follow-up-answers';
import { BasicInfoTab } from './tabs/BasicInfoTab';
import { ConditionTab } from './tabs/ConditionTab';
import { FeaturesTab } from './tabs/FeaturesTab';
import { ServiceHistoryTab } from './tabs/ServiceHistoryTab';
import { AccidentHistoryTab } from './tabs/AccidentHistoryTab';
import { VehicleIssuesTab } from './tabs/VehicleIssuesTab';
import { TitleOwnershipTab } from './tabs/TitleOwnershipTab';

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
  const [activeTab, setActiveTab] = useState('basics');

  const tabs = [
    { id: 'basics', label: '🚗 Basics', icon: '🚗' },
    { id: 'condition', label: '🎯 Condition', icon: '🎯' },
    { id: 'features', label: '⭐ Features', icon: '⭐' },
    { id: 'service', label: '🔧 Service History', icon: '🔧' },
    { id: 'accidents', label: '💥 Accidents', icon: '💥' },
    { id: 'issues', label: '⚠️ Vehicle Issues', icon: '⚠️' },
    { id: 'title', label: '📄 Title & Ownership', icon: '📄' }
  ];

  // Handler for service history updates
  const handleServiceHistoryChange = (serviceHistory: any) => {
    updateFormData({ 
      serviceHistory,
      service_history: serviceHistory.description || ''
    });
  };

  // Handler for accident history updates
  const handleAccidentsChange = (accidents: any) => {
    updateFormData({ 
      accident_history: accidents,
      accidents: accidents.count || 0,
      frame_damage: accidents.frameDamage || false
    });
  };

  // Calculate completion percentage
  const calculateCompletion = () => {
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

  const handleSubmit = async () => {
    await onSubmit();
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">
          Vehicle Details & Follow-up Questions
        </h2>
        <p className="text-gray-600">
          Complete these sections to get the most accurate valuation for your vehicle
        </p>
        <div className="text-sm text-gray-500">
          Completion: {calculateCompletion()}%
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7 gap-1 h-auto p-1">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="flex flex-col items-center gap-1 p-3 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span className="hidden sm:inline">{tab.label.split(' ').slice(1).join(' ')}</span>
                  <span className="sm:hidden">{tab.icon}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="mt-6">
              <TabsContent value="basics" className="space-y-6">
                <BasicInfoTab
                  formData={formData}
                  updateFormData={updateFormData}
                />
              </TabsContent>

              <TabsContent value="condition" className="space-y-6">
                <ConditionTab
                  formData={formData}
                  updateFormData={updateFormData}
                />
              </TabsContent>

              <TabsContent value="features" className="space-y-6">
                <FeaturesTab
                  formData={formData}
                  updateFormData={updateFormData}
                  baseValue={25000}
                  overrideDetected={false}
                />
              </TabsContent>

              <TabsContent value="service" className="space-y-6">
                <ServiceHistoryTab
                  formData={formData}
                  onServiceHistoryChange={handleServiceHistoryChange}
                />
              </TabsContent>

              <TabsContent value="accidents" className="space-y-6">
                <AccidentHistoryTab
                  formData={formData}
                  onAccidentsChange={handleAccidentsChange}
                />
              </TabsContent>

              <TabsContent value="issues" className="space-y-6">
                <VehicleIssuesTab
                  formData={formData}
                  updateFormData={updateFormData}
                />
              </TabsContent>

              <TabsContent value="title" className="space-y-6">
                <TitleOwnershipTab
                  formData={formData}
                  updateFormData={updateFormData}
                />
              </TabsContent>
            </div>
          </Tabs>

          <div className="flex justify-between items-center mt-8 pt-6 border-t">
            <div className="text-sm text-gray-500">
              Complete all relevant sections for the most accurate valuation
            </div>
            <Button 
              onClick={handleSubmit}
              disabled={isLoading}
              size="lg"
              className="px-8"
            >
              {isLoading ? 'Processing...' : 'Get Final Valuation'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
