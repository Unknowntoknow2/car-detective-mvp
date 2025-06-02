
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FollowUpAnswers, AccidentDetails } from '@/types/follow-up-answers';
import { BasicInfoTab } from './tabs/BasicInfoTab';
import { ConditionTab } from './tabs/ConditionTab';
import { FeaturesTab } from './tabs/FeaturesTab';
import { TechnologyTab } from './tabs/TechnologyTab';
import { SafetySecurityTab } from './tabs/SafetySecurityTab';
import { DriverAssistanceTab } from './tabs/DriverAssistanceTab';
import { ClimateControlTab } from './tabs/ClimateControlTab';
import { AudioEntertainmentTab } from './tabs/AudioEntertainmentTab';
import { LuxuryMaterialsTab } from './tabs/LuxuryMaterialsTab';
import { PerformancePackagesTab } from './tabs/PerformancePackagesTab';
import { ExteriorFeaturesTab } from './tabs/ExteriorFeaturesTab';
import { InteriorMaterialsTab } from './tabs/InteriorMaterialsTab';
import { TiresBrakesTab } from './tabs/TiresBrakesTab';
import { DashboardLightsTab } from './tabs/DashboardLightsTab';
import { VehicleIssuesTab } from './tabs/VehicleIssuesTab';
import { TitleOwnershipTab } from './tabs/TitleOwnershipTab';
import { ServiceMaintenanceTab } from './tabs/ServiceMaintenanceTab';
import { AccidentsTab } from './tabs/AccidentsTab';

interface TabbedFollowUpFormProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
  baseValue?: number;
}

export function TabbedFollowUpForm({ 
  formData, 
  updateFormData, 
  baseValue = 25000 
}: TabbedFollowUpFormProps) {
  const [activeTab, setActiveTab] = useState('basics');

  const handleAccidentsChange = (accidentData: AccidentDetails) => {
    updateFormData({ accident_history: accidentData });
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-6 lg:grid-cols-9 gap-1 h-auto p-1">
          <TabsTrigger value="basics" className="text-xs p-2">
            🚗 Basics
          </TabsTrigger>
          <TabsTrigger value="condition" className="text-xs p-2">
            🎯 Condition
          </TabsTrigger>
          <TabsTrigger value="features" className="text-xs p-2">
            ⭐ Features
          </TabsTrigger>
          <TabsTrigger value="technology" className="text-xs p-2">
            📱 Technology
          </TabsTrigger>
          <TabsTrigger value="safety" className="text-xs p-2">
            🛡️ Safety
          </TabsTrigger>
          <TabsTrigger value="adas" className="text-xs p-2">
            🤖 Driver Assist
          </TabsTrigger>
          <TabsTrigger value="climate" className="text-xs p-2">
            ❄️ Climate
          </TabsTrigger>
          <TabsTrigger value="audio" className="text-xs p-2">
            🎵 Audio
          </TabsTrigger>
          <TabsTrigger value="luxury" className="text-xs p-2">
            💎 Luxury
          </TabsTrigger>
          <TabsTrigger value="performance" className="text-xs p-2">
            🏎️ Performance
          </TabsTrigger>
          <TabsTrigger value="exterior" className="text-xs p-2">
            🚪 Exterior
          </TabsTrigger>
          <TabsTrigger value="interior" className="text-xs p-2">
            🪑 Interior
          </TabsTrigger>
          <TabsTrigger value="tires" className="text-xs p-2">
            🛞 Tires
          </TabsTrigger>
          <TabsTrigger value="dashboard" className="text-xs p-2">
            ⚠️ Dashboard
          </TabsTrigger>
          <TabsTrigger value="issues" className="text-xs p-2">
            🔧 Issues
          </TabsTrigger>
          <TabsTrigger value="title" className="text-xs p-2">
            📄 Title
          </TabsTrigger>
          <TabsTrigger value="service" className="text-xs p-2">
            🔧 Service
          </TabsTrigger>
          <TabsTrigger value="accidents" className="text-xs p-2">
            💥 Accidents
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="basics" className="space-y-4">
            <BasicInfoTab 
              formData={formData}
              updateFormData={updateFormData}
            />
          </TabsContent>

          <TabsContent value="condition" className="space-y-4">
            <ConditionTab 
              formData={formData}
              updateFormData={updateFormData}
            />
          </TabsContent>

          <TabsContent value="features" className="space-y-4">
            <FeaturesTab 
              formData={formData}
              updateFormData={updateFormData}
              baseValue={baseValue}
            />
          </TabsContent>

          <TabsContent value="technology" className="space-y-4">
            <TechnologyTab 
              formData={formData}
              updateFormData={updateFormData}
              baseValue={baseValue}
            />
          </TabsContent>

          <TabsContent value="safety" className="space-y-4">
            <SafetySecurityTab 
              formData={formData}
              updateFormData={updateFormData}
              baseValue={baseValue}
            />
          </TabsContent>

          <TabsContent value="adas" className="space-y-4">
            <DriverAssistanceTab 
              formData={formData}
              updateFormData={updateFormData}
              baseValue={baseValue}
            />
          </TabsContent>

          <TabsContent value="climate" className="space-y-4">
            <ClimateControlTab 
              formData={formData}
              updateFormData={updateFormData}
              baseValue={baseValue}
            />
          </TabsContent>

          <TabsContent value="audio" className="space-y-4">
            <AudioEntertainmentTab 
              formData={formData}
              updateFormData={updateFormData}
              baseValue={baseValue}
            />
          </TabsContent>

          <TabsContent value="luxury" className="space-y-4">
            <LuxuryMaterialsTab 
              formData={formData}
              updateFormData={updateFormData}
              baseValue={baseValue}
            />
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <PerformancePackagesTab 
              formData={formData}
              updateFormData={updateFormData}
              baseValue={baseValue}
            />
          </TabsContent>

          <TabsContent value="exterior" className="space-y-4">
            <ExteriorFeaturesTab 
              formData={formData}
              updateFormData={updateFormData}
              baseValue={baseValue}
            />
          </TabsContent>

          <TabsContent value="interior" className="space-y-4">
            <InteriorMaterialsTab 
              formData={formData}
              updateFormData={updateFormData}
              baseValue={baseValue}
            />
          </TabsContent>

          <TabsContent value="tires" className="space-y-4">
            <TiresBrakesTab 
              formData={formData}
              updateFormData={updateFormData}
            />
          </TabsContent>

          <TabsContent value="dashboard" className="space-y-4">
            <DashboardLightsTab 
              formData={formData}
              updateFormData={updateFormData}
            />
          </TabsContent>

          <TabsContent value="issues" className="space-y-4">
            <VehicleIssuesTab 
              formData={formData}
              updateFormData={updateFormData}
            />
          </TabsContent>

          <TabsContent value="title" className="space-y-4">
            <TitleOwnershipTab 
              formData={formData}
              updateFormData={updateFormData}
            />
          </TabsContent>

          <TabsContent value="service" className="space-y-4">
            <ServiceMaintenanceTab 
              formData={formData}
              updateFormData={updateFormData}
            />
          </TabsContent>

          <TabsContent value="accidents" className="space-y-4">
            <AccidentsTab 
              formData={formData}
              onAccidentsChange={handleAccidentsChange}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
