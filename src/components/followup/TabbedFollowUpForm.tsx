
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle } from 'lucide-react';
import { FollowUpAnswers } from '@/types/follow-up-answers';

// Import all tab components
import {
  BasicInfoTab,
  ConditionTab,
  VehicleIssuesTab,
  DashboardLightsTab,
  TitleOwnershipTab,
  ServiceMaintenanceTab,
  AccidentHistoryTab,
  ModificationsTab,
  // Feature category tabs
  TechnologyTab,
  SafetySecurityTab,
  ClimateControlTab,
  AudioEntertainmentTab,
  InteriorMaterialsTab,
  ExteriorFeaturesTab,
  LuxuryMaterialsTab,
  DriverAssistanceTab,
  PerformancePackagesTab,
} from './tabs';

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
  const baseValue = 25000; // This should come from vehicle valuation data

  // Define the 8 main tabs in correct order
  const mainTabs = [
    {
      id: 'basics',
      label: '🚗 Basics',
      component: BasicInfoTab,
      gradient: 'from-blue-400 to-blue-600'
    },
    {
      id: 'condition',
      label: '🎯 Condition',
      component: ConditionTab,
      gradient: 'from-green-400 to-green-600'
    },
    {
      id: 'features',
      label: '⭐ Features',
      component: null, // Special handling for features
      gradient: 'from-purple-400 to-purple-600'
    },
    {
      id: 'modifications',
      label: '🛠 Modifications',
      component: ModificationsTab,
      gradient: 'from-orange-400 to-orange-600'
    },
    {
      id: 'service',
      label: '🔧 Service History',
      component: ServiceMaintenanceTab,
      gradient: 'from-teal-400 to-teal-600'
    },
    {
      id: 'accidents',
      label: '💥 Accidents',
      component: AccidentHistoryTab,
      gradient: 'from-red-400 to-red-600'
    },
    {
      id: 'issues',
      label: '⚠️ Vehicle Issues',
      component: VehicleIssuesTab,
      gradient: 'from-yellow-400 to-yellow-600'
    },
    {
      id: 'title',
      label: '📄 Title & Ownership',
      component: TitleOwnershipTab,
      gradient: 'from-indigo-400 to-indigo-600'
    }
  ];

  // Feature category sub-tabs for the Features tab
  const featureTabs = [
    { id: 'technology', label: '📱 Technology', component: TechnologyTab },
    { id: 'safety', label: '🛡️ Safety & Security', component: SafetySecurityTab },
    { id: 'climate', label: '❄️ Climate Control', component: ClimateControlTab },
    { id: 'audio', label: '🎵 Audio & Entertainment', component: AudioEntertainmentTab },
    { id: 'interior', label: '🪑 Interior Materials', component: InteriorMaterialsTab },
    { id: 'exterior', label: '🚪 Exterior Features', component: ExteriorFeaturesTab },
    { id: 'luxury', label: '💎 Luxury Materials', component: LuxuryMaterialsTab },
    { id: 'adas', label: '🤖 Driver Assistance', component: DriverAssistanceTab },
    { id: 'performance', label: '🏎️ Performance Packages', component: PerformancePackagesTab }
  ];

  const [activeFeatureTab, setActiveFeatureTab] = useState('technology');

  // Calculate completion status for each tab
  const getTabCompletion = (tabId: string): boolean => {
    switch (tabId) {
      case 'basics':
        return !!(formData.zip_code && formData.mileage && formData.transmission);
      case 'condition':
        return !!(formData.condition && formData.tire_condition && formData.exterior_condition && formData.interior_condition);
      case 'features':
        return (formData.features && formData.features.length > 0) || false;
      case 'modifications':
        return formData.modifications?.hasModifications !== undefined;
      case 'service':
        return formData.serviceHistory?.hasRecords !== undefined;
      case 'accidents':
        return formData.accident_history?.hadAccident !== undefined;
      case 'issues':
        return true; // Optional tab
      case 'title':
        return !!(formData.title_status && formData.previous_use);
      default:
        return false;
    }
  };

  const renderTabContent = (tab: any) => {
    if (!tab.component) return null;
    
    const TabComponent = tab.component;
    return (
      <TabComponent
        formData={formData}
        updateFormData={updateFormData}
        baseValue={baseValue}
      />
    );
  };

  const renderFeaturesContent = () => {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">⭐</span>
              Vehicle Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Select the features your vehicle has. Each feature may impact the vehicle's value.
            </p>
            
            <Tabs value={activeFeatureTab} onValueChange={setActiveFeatureTab}>
              <TabsList className="grid w-full grid-cols-3 lg:grid-cols-5 gap-1 h-auto p-1">
                {featureTabs.map((tab) => (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="text-xs p-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {featureTabs.map((tab) => (
                <TabsContent key={tab.id} value={tab.id} className="mt-4">
                  <tab.component
                    formData={formData}
                    updateFormData={updateFormData}
                    baseValue={baseValue}
                  />
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Progress Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Vehicle Valuation Follow-up</CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {formData.completion_percentage}% Complete
              </span>
              <Progress value={formData.completion_percentage} className="w-24" />
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 gap-1 h-auto p-1">
          {mainTabs.map((tab) => {
            const isCompleted = getTabCompletion(tab.id);
            return (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className={`relative flex flex-col items-center gap-1 p-3 text-xs bg-gradient-to-r ${tab.gradient} text-white data-[state=active]:ring-2 data-[state=active]:ring-offset-2 data-[state=active]:ring-primary`}
              >
                <div className="flex items-center gap-1">
                  {isCompleted ? (
                    <CheckCircle className="h-3 w-3" />
                  ) : (
                    <Circle className="h-3 w-3" />
                  )}
                  <span>{tab.label}</span>
                </div>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {/* Tab Content */}
        {mainTabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id} className="space-y-6">
            {tab.id === 'features' ? renderFeaturesContent() : renderTabContent(tab)}
          </TabsContent>
        ))}
      </Tabs>

      {/* Submit Section */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Badge variant="secondary">
                {mainTabs.filter(tab => getTabCompletion(tab.id)).length} of {mainTabs.length} sections completed
              </Badge>
              <span className="text-sm text-muted-foreground">
                Auto-saving progress...
              </span>
            </div>
            <Button 
              onClick={onSubmit}
              disabled={isLoading || formData.completion_percentage < 80}
              size="lg"
            >
              {isLoading ? 'Submitting...' : 'Get Vehicle Valuation'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
