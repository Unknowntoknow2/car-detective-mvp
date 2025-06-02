
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FollowUpAnswers } from '@/types/follow-up-answers';
import { calculateEnhancedFeatureValue } from '@/utils/enhanced-features-calculator';

// Import all tab components
import { BasicInfoTab } from './tabs/BasicInfoTab';
import { ConditionTab } from './tabs/ConditionTab';
import { VehicleIssuesTab } from './tabs/VehicleIssuesTab';
import { DashboardLightsTab } from './tabs/DashboardLightsTab';
import { TitleOwnershipTab } from './tabs/TitleOwnershipTab';
import { ServiceMaintenanceTab } from './tabs/ServiceMaintenanceTab';
import { AccidentHistoryTab } from './tabs/AccidentHistoryTab';
import { ModificationsTab } from './tabs/ModificationsTab';

// Feature category tabs
import { TechnologyTab } from './tabs/TechnologyTab';
import { SafetySecurityTab } from './tabs/SafetySecurityTab';
import { ClimateControlTab } from './tabs/ClimateControlTab';
import { AudioEntertainmentTab } from './tabs/AudioEntertainmentTab';
import { InteriorMaterialsTab } from './tabs/InteriorMaterialsTab';
import { ExteriorFeaturesTab } from './tabs/ExteriorFeaturesTab';
import { LuxuryMaterialsTab } from './tabs/LuxuryMaterialsTab';
import { DriverAssistanceTab } from './tabs/DriverAssistanceTab';
import { PerformancePackagesTab } from './tabs/PerformancePackagesTab';

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
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate base vehicle value for feature calculations (placeholder - would come from valuation)
  const baseVehicleValue = 25000; // This would typically come from initial VIN lookup

  // Calculate total feature value
  const featureValue = calculateEnhancedFeatureValue(formData.features || [], baseVehicleValue);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit();
    } finally {
      setIsSubmitting(false);
    }
  };

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: '📋' },
    { id: 'condition', label: 'Condition', icon: '⭐' },
    { id: 'issues', label: 'Issues', icon: '⚠️' },
    { id: 'lights', label: 'Warning Lights', icon: '💡' },
    { id: 'title', label: 'Title & Ownership', icon: '📄' },
    { id: 'service', label: 'Service History', icon: '🔧' },
    { id: 'accidents', label: 'Accident History', icon: '🚗' },
    { id: 'modifications', label: 'Modifications', icon: '⚙️' },
    { id: 'features', label: 'Features', icon: '✨' }
  ];

  const featureTabs = [
    { id: 'technology', label: 'Technology', icon: '📱' },
    { id: 'safety', label: 'Safety', icon: '🛡️' },
    { id: 'climate', label: 'Climate', icon: '❄️' },
    { id: 'audio', label: 'Audio', icon: '🎵' },
    { id: 'interior', label: 'Interior', icon: '🪑' },
    { id: 'exterior', label: 'Exterior', icon: '🚪' },
    { id: 'luxury', label: 'Luxury', icon: '💎' },
    { id: 'adas', label: 'Driver Assist', icon: '🤖' },
    { id: 'performance', label: 'Performance', icon: '🏎️' }
  ];

  const renderTabContent = (tabId: string) => {
    switch (tabId) {
      case 'basic':
        return <BasicInfoTab formData={formData} updateFormData={updateFormData} />;
      case 'condition':
        return <ConditionTab formData={formData} updateFormData={updateFormData} />;
      case 'issues':
        return <VehicleIssuesTab formData={formData} updateFormData={updateFormData} />;
      case 'lights':
        return <DashboardLightsTab formData={formData} updateFormData={updateFormData} />;
      case 'title':
        return <TitleOwnershipTab formData={formData} updateFormData={updateFormData} />;
      case 'service':
        return <ServiceMaintenanceTab formData={formData} updateFormData={updateFormData} />;
      case 'accidents':
        return <AccidentHistoryTab formData={formData} updateFormData={updateFormData} />;
      case 'modifications':
        return <ModificationsTab formData={formData} updateFormData={updateFormData} />;
      case 'features':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Vehicle Features</span>
                  {featureValue.totalAdjustment > 0 && (
                    <Badge variant="secondary" className="text-lg">
                      +${featureValue.totalAdjustment.toLocaleString()}
                    </Badge>
                  )}
                </CardTitle>
                {featureValue.featuresCount > 0 && (
                  <p className="text-sm text-muted-foreground">
                    {featureValue.featuresCount} features selected • 
                    {featureValue.percentageOfBase.toFixed(1)}% of base value
                  </p>
                )}
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="technology" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 lg:grid-cols-9">
                    {featureTabs.map((tab) => (
                      <TabsTrigger key={tab.id} value={tab.id} className="text-xs">
                        <span className="mr-1">{tab.icon}</span>
                        <span className="hidden lg:inline">{tab.label}</span>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  {featureTabs.map((tab) => (
                    <TabsContent key={tab.id} value={tab.id}>
                      {renderFeatureTabContent(tab.id)}
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          </div>
        );
      default:
        return <div>Tab content not found</div>;
    }
  };

  const renderFeatureTabContent = (tabId: string) => {
    switch (tabId) {
      case 'technology':
        return <TechnologyTab formData={formData} updateFormData={updateFormData} baseValue={baseVehicleValue} />;
      case 'safety':
        return <SafetySecurityTab formData={formData} updateFormData={updateFormData} baseValue={baseVehicleValue} />;
      case 'climate':
        return <ClimateControlTab formData={formData} updateFormData={updateFormData} baseValue={baseVehicleValue} />;
      case 'audio':
        return <AudioEntertainmentTab formData={formData} updateFormData={updateFormData} baseValue={baseVehicleValue} />;
      case 'interior':
        return <InteriorMaterialsTab formData={formData} updateFormData={updateFormData} baseValue={baseVehicleValue} />;
      case 'exterior':
        return <ExteriorFeaturesTab formData={formData} updateFormData={updateFormData} baseValue={baseVehicleValue} />;
      case 'luxury':
        return <LuxuryMaterialsTab formData={formData} updateFormData={updateFormData} baseValue={baseVehicleValue} />;
      case 'adas':
        return <DriverAssistanceTab formData={formData} updateFormData={updateFormData} baseValue={baseVehicleValue} />;
      case 'performance':
        return <PerformancePackagesTab formData={formData} updateFormData={updateFormData} baseValue={baseVehicleValue} />;
      default:
        return <div>Feature tab content not found</div>;
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Progress Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Vehicle Information</CardTitle>
              <p className="text-sm text-muted-foreground">
                Complete the form to get an accurate valuation
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">
                {formData.completion_percentage}%
              </div>
              <p className="text-xs text-muted-foreground">Complete</p>
            </div>
          </div>
          <Progress value={formData.completion_percentage} className="w-full" />
        </CardHeader>
      </Card>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-9">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id} className="text-xs">
              <span className="mr-1">{tab.icon}</span>
              <span className="hidden lg:inline">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id} className="space-y-6">
            {renderTabContent(tab.id)}
          </TabsContent>
        ))}
      </Tabs>

      {/* Submit Section */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium">
                Form Completion: {formData.completion_percentage}%
              </p>
              {featureValue.totalAdjustment > 0 && (
                <p className="text-sm text-muted-foreground">
                  Feature Value: +${featureValue.totalAdjustment.toLocaleString()}
                </p>
              )}
            </div>
            <Button 
              onClick={handleSubmit}
              disabled={isSubmitting || isLoading}
              size="lg"
              className="min-w-[140px]"
            >
              {isSubmitting ? 'Submitting...' : 'Get Valuation'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
