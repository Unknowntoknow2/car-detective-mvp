
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { FollowUpAnswers } from '@/types/follow-up-answers';

// Tab components
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
  onSubmit: () => Promise<void>;
  isLoading: boolean;
}

const TABS = [
  { id: 'basics', label: 'Basics', icon: '🚗' },
  { id: 'condition', label: 'Condition', icon: '🎯' },
  { id: 'features', label: 'Features', icon: '⭐' },
  { id: 'technology', label: 'Technology', icon: '📱' },
  { id: 'safety', label: 'Safety & Security', icon: '🛡️' },
  { id: 'driver-assistance', label: 'Driver Assistance', icon: '🤖' },
  { id: 'climate', label: 'Climate Control', icon: '❄️' },
  { id: 'audio', label: 'Audio & Entertainment', icon: '🎵' },
  { id: 'luxury', label: 'Luxury Materials', icon: '💎' },
  { id: 'performance', label: 'Performance Packages', icon: '🏎️' },
  { id: 'exterior', label: 'Exterior Features', icon: '🚪' },
  { id: 'interior', label: 'Interior Materials', icon: '🪑' },
  { id: 'tires', label: 'Tires & Brakes', icon: '🛞' },
  { id: 'dashboard', label: 'Dashboard Lights', icon: '⚠️' },
  { id: 'issues', label: 'Vehicle Issues', icon: '🔧' },
  { id: 'title', label: 'Title & Ownership', icon: '📄' },
  { id: 'service', label: 'Service & Maintenance', icon: '🔧' },
  { id: 'accidents', label: 'Accidents', icon: '💥' },
];

export function TabbedFollowUpForm({ 
  formData, 
  updateFormData, 
  onSubmit,
  isLoading 
}: TabbedFollowUpFormProps) {
  const [activeTab, setActiveTab] = useState('basics');
  const [completedTabs, setCompletedTabs] = useState<Set<string>>(new Set());

  // Calculate base value for feature calculations
  const baseValue = 25000; // This should come from initial valuation

  // Mark tab as completed when certain fields are filled
  const markTabCompleted = (tabId: string) => {
    setCompletedTabs(prev => new Set([...prev, tabId]));
  };

  // Calculate overall progress
  const progressPercentage = (completedTabs.size / TABS.length) * 100;

  const handleAccidentsChange = (accidentData: any) => {
    updateFormData({ accident_history: accidentData });
  };

  const renderTabContent = (tabId: string) => {
    const baseProps = {
      formData,
      updateFormData,
      baseValue,
    };

    switch (tabId) {
      case 'basics':
        return <BasicInfoTab {...baseProps} />;
      case 'condition':
        return <ConditionTab {...baseProps} />;
      case 'features':
        return <FeaturesTab {...baseProps} />;
      case 'technology':
        return <TechnologyTab {...baseProps} />;
      case 'safety':
        return <SafetySecurityTab {...baseProps} />;
      case 'driver-assistance':
        return <DriverAssistanceTab {...baseProps} />;
      case 'climate':
        return <ClimateControlTab {...baseProps} />;
      case 'audio':
        return <AudioEntertainmentTab {...baseProps} />;
      case 'luxury':
        return <LuxuryMaterialsTab {...baseProps} />;
      case 'performance':
        return <PerformancePackagesTab {...baseProps} />;
      case 'exterior':
        return <ExteriorFeaturesTab {...baseProps} />;
      case 'interior':
        return <InteriorMaterialsTab {...baseProps} />;
      case 'tires':
        return <TiresBrakesTab {...baseProps} />;
      case 'dashboard':
        return <DashboardLightsTab {...baseProps} />;
      case 'issues':
        return <VehicleIssuesTab {...baseProps} />;
      case 'title':
        return <TitleOwnershipTab {...baseProps} />;
      case 'service':
        return <ServiceMaintenanceTab {...baseProps} />;
      case 'accidents':
        return (
          <AccidentsTab 
            formData={formData}
            onAccidentsChange={handleAccidentsChange}
          />
        );
      default:
        return <div>Tab content not found</div>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Progress Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Follow-up Questions</h2>
            <div className="text-sm text-gray-600">
              {completedTabs.size} of {TABS.length} sections completed
            </div>
          </div>
          <Progress value={progressPercentage} className="w-full" />
        </CardContent>
      </Card>

      {/* Tabbed Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-6 lg:grid-cols-9 gap-1 h-auto p-2 bg-gray-100">
          {TABS.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="flex flex-col items-center gap-1 p-3 text-xs data-[state=active]:bg-white relative"
            >
              {completedTabs.has(tab.id) && (
                <CheckCircle className="absolute -top-1 -right-1 w-4 h-4 text-green-500" />
              )}
              <span className="text-lg">{tab.icon}</span>
              <span className="hidden sm:block">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Tab Contents */}
        {TABS.map((tab) => (
          <TabsContent key={tab.id} value={tab.id} className="space-y-6">
            {renderTabContent(tab.id)}
          </TabsContent>
        ))}
      </Tabs>

      {/* Submit Section */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Ready to Complete?</h3>
              <p className="text-sm text-gray-600">
                You can submit now or continue filling out more sections for a more accurate valuation.
              </p>
            </div>
            <Button 
              onClick={onSubmit}
              disabled={isLoading}
              size="lg"
              className="min-w-[120px]"
            >
              {isLoading ? 'Processing...' : 'Complete Valuation'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
