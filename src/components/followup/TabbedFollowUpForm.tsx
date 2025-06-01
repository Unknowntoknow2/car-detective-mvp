
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CDTabs } from '@/components/ui-kit/CDTabs';
import { FollowUpAnswers } from '@/types/follow-up-answers';
import { calculateEnhancedFeatureValue } from '@/utils/enhanced-features-calculator';

// Import all tab components
import { VehicleBasicsTab } from './tabs/VehicleBasicsTab';
import { VehicleConditionTab } from './tabs/VehicleConditionTab';
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
  onSubmit: () => void;
  isLoading: boolean;
}

export function TabbedFollowUpForm({ 
  formData, 
  updateFormData, 
  onSubmit, 
  isLoading 
}: TabbedFollowUpFormProps) {
  const [activeTab, setActiveTab] = useState('basics');
  
  // Calculate base value for features (simplified - in real app would come from VIN lookup)
  const baseValue = 25000;
  
  // Calculate total feature value
  const featureValue = calculateEnhancedFeatureValue(formData.features || [], baseValue);

  // Check if we have detected features (simulated - would come from VIN/AI detection)
  const overrideDetected = false; // This would be based on actual detection logic

  const tabs = [
    {
      label: '🚗 Basics',
      value: 'basics',
      content: (
        <VehicleBasicsTab 
          formData={formData} 
          updateFormData={updateFormData} 
        />
      )
    },
    {
      label: '🎯 Condition',
      value: 'condition',
      content: (
        <VehicleConditionTab 
          formData={formData} 
          updateFormData={updateFormData} 
        />
      )
    },
    {
      label: '⭐ Features',
      value: 'features',
      content: (
        <FeaturesTab 
          formData={formData} 
          updateFormData={updateFormData}
          baseValue={baseValue}
          overrideDetected={overrideDetected}
        />
      )
    },
    {
      label: '📱 Technology',
      value: 'technology',
      content: (
        <TechnologyTab 
          formData={formData} 
          updateFormData={updateFormData}
          baseValue={baseValue}
        />
      )
    },
    {
      label: '🛡️ Safety & Security',
      value: 'safety',
      content: (
        <SafetySecurityTab 
          formData={formData} 
          updateFormData={updateFormData}
          baseValue={baseValue}
        />
      )
    },
    {
      label: '🤖 Driver Assistance',
      value: 'adas',
      content: (
        <DriverAssistanceTab 
          formData={formData} 
          updateFormData={updateFormData}
          baseValue={baseValue}
        />
      )
    },
    {
      label: '❄️ Climate Control',
      value: 'climate',
      content: (
        <ClimateControlTab 
          formData={formData} 
          updateFormData={updateFormData}
          baseValue={baseValue}
        />
      )
    },
    {
      label: '🎵 Audio & Entertainment',
      value: 'audio',
      content: (
        <AudioEntertainmentTab 
          formData={formData} 
          updateFormData={updateFormData}
          baseValue={baseValue}
        />
      )
    },
    {
      label: '💎 Luxury Materials',
      value: 'luxury',
      content: (
        <LuxuryMaterialsTab 
          formData={formData} 
          updateFormData={updateFormData}
          baseValue={baseValue}
        />
      )
    },
    {
      label: '🏎️ Performance Packages',
      value: 'performance',
      content: (
        <PerformancePackagesTab 
          formData={formData} 
          updateFormData={updateFormData}
          baseValue={baseValue}
        />
      )
    },
    {
      label: '🚪 Exterior Features',
      value: 'exterior',
      content: (
        <ExteriorFeaturesTab 
          formData={formData} 
          updateFormData={updateFormData}
          baseValue={baseValue}
        />
      )
    },
    {
      label: '🪑 Interior Materials',
      value: 'interior',
      content: (
        <InteriorMaterialsTab 
          formData={formData} 
          updateFormData={updateFormData}
          baseValue={baseValue}
        />
      )
    },
    {
      label: '🛞 Tires & Brakes',
      value: 'tires',
      content: (
        <TiresBrakesTab 
          formData={formData} 
          updateFormData={updateFormData} 
        />
      )
    },
    {
      label: '⚠️ Dashboard Lights',
      value: 'dashboard',
      content: (
        <DashboardLightsTab 
          formData={formData} 
          updateFormData={updateFormData} 
        />
      )
    },
    {
      label: '🔧 Vehicle Issues',
      value: 'issues',
      content: (
        <VehicleIssuesTab 
          formData={formData} 
          updateFormData={updateFormData} 
        />
      )
    },
    {
      label: '📄 Title & Ownership',
      value: 'title',
      content: (
        <TitleOwnershipTab 
          formData={formData} 
          updateFormData={updateFormData} 
        />
      )
    },
    {
      label: '🔧 Service & Maintenance',
      value: 'service',
      content: (
        <ServiceMaintenanceTab 
          formData={formData} 
          updateFormData={updateFormData} 
        />
      )
    },
    {
      label: '💥 Accidents',
      value: 'accidents',
      content: (
        <AccidentsTab 
          formData={formData} 
          updateFormData={updateFormData} 
        />
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Vehicle Valuation Details</h2>
              <p className="text-muted-foreground">
                Complete the information below for an accurate valuation
              </p>
            </div>
            {featureValue.totalAdjustment > 0 && (
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">
                  +${featureValue.totalAdjustment.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">
                  Feature Value Added
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tabbed Interface */}
      <CDTabs
        items={tabs}
        value={activeTab}
        onChange={setActiveTab}
        variant="underline"
        className="w-full"
        tabsClassName="overflow-x-auto"
        fullWidth={false}
      />

      {/* Submit Button */}
      <div className="flex justify-end pt-6">
        <Button 
          onClick={onSubmit}
          disabled={isLoading}
          size="lg"
          className="min-w-[200px]"
        >
          {isLoading ? 'Processing...' : 'Get My Valuation'}
        </Button>
      </div>
    </div>
  );
}
