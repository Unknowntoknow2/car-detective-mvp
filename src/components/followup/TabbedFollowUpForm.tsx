
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { FollowUpAnswers } from '@/types/follow-up-answers';
import { VehicleBasicsTab } from './tabs/VehicleBasicsTab';
import { ConditionTab } from './tabs/ConditionTab';
import { FeaturesTab } from './tabs/FeaturesTab';
import { AccidentHistoryTab } from './tabs/AccidentHistoryTab';
import { ServiceMaintenanceTab } from './tabs/ServiceMaintenanceTab';
import { TechnologyTab } from './tabs/TechnologyTab';
import { SafetySecurityTab } from './tabs/SafetySecurityTab';
import { DriverAssistanceTab } from './tabs/DriverAssistanceTab';
import { ClimateControlTab } from './tabs/ClimateControlTab';
import { AudioEntertainmentTab } from './tabs/AudioEntertainmentTab';
import { LuxuryMaterialsTab } from './tabs/LuxuryMaterialsTab';
import { PerformancePackagesTab } from './tabs/PerformancePackagesTab';
import { ExteriorFeaturesTab } from './tabs/ExteriorFeaturesTab';
import { InteriorMaterialsTab } from './tabs/InteriorMaterialsTab';
import { Loader2, Settings, Eye } from 'lucide-react';

interface TabbedFollowUpFormProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
  onSubmit: () => Promise<void>;
  isLoading: boolean;
  userType?: 'individual' | 'dealer' | 'power_user';
  hasVinDecoding?: boolean;
  hasAiPhotoAnalysis?: boolean;
}

export function TabbedFollowUpForm({ 
  formData, 
  updateFormData, 
  onSubmit, 
  isLoading,
  userType = 'individual',
  hasVinDecoding = false,
  hasAiPhotoAnalysis = false
}: TabbedFollowUpFormProps) {
  const [activeTab, setActiveTab] = useState('basics');
  const [showAllTabs, setShowAllTabs] = useState(userType === 'dealer' || userType === 'power_user');
  const [overrideDetectedFeatures, setOverrideDetectedFeatures] = useState(false);

  const basicTabs = [
    { id: 'basics', label: 'Vehicle Basics', icon: '🚗', color: 'text-blue-600' },
    { id: 'condition', label: 'Condition', icon: '✨', color: 'text-green-600' },
    { id: 'features', label: 'Features', icon: '⚙️', color: 'text-purple-600' },
    { id: 'accidents', label: 'History', icon: '📋', color: 'text-orange-600' },
    { id: 'maintenance', label: 'Maintenance', icon: '🔧', color: 'text-red-600' }
  ];

  const allTabs = [
    ...basicTabs,
    { id: 'technology', label: 'Technology', icon: '📱', color: 'text-indigo-600' },
    { id: 'safety', label: 'Safety & Security', icon: '🛡️', color: 'text-emerald-600' },
    { id: 'driver-assistance', label: 'Driver Assistance', icon: '🤖', color: 'text-cyan-600' },
    { id: 'climate', label: 'Climate Control', icon: '❄️', color: 'text-sky-600' },
    { id: 'audio', label: 'Audio/Entertainment', icon: '🎵', color: 'text-pink-600' },
    { id: 'luxury-materials', label: 'Luxury Materials', icon: '💎', color: 'text-yellow-600' },
    { id: 'performance', label: 'Performance Packages', icon: '🏎️', color: 'text-red-700' },
    { id: 'exterior', label: 'Exterior Features', icon: '🚪', color: 'text-gray-600' },
    { id: 'interior', label: 'Interior Materials', icon: '🪑', color: 'text-brown-600' }
  ];

  const tabs = showAllTabs ? allTabs : basicTabs;

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
  const estimatedBaseValue = 25000;
  const detectedFeatures = hasVinDecoding || hasAiPhotoAnalysis;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Progress Header */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Vehicle Valuation Details</CardTitle>
            <Badge variant={progress === 100 ? "default" : "secondary"}>
              {progress}% Complete
            </Badge>
          </div>
          <Progress value={progress} className="mt-2" />
        </CardHeader>
      </Card>

      {/* Smart UX Controls */}
      {(userType === 'individual' || detectedFeatures) && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="show-all-tabs"
                    checked={showAllTabs}
                    onCheckedChange={setShowAllTabs}
                  />
                  <Label htmlFor="show-all-tabs" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Show all feature categories
                  </Label>
                </div>
                
                {detectedFeatures && (
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="override-detected"
                      checked={overrideDetectedFeatures}
                      onCheckedChange={setOverrideDetectedFeatures}
                    />
                    <Label htmlFor="override-detected" className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      Edit or override detected features
                    </Label>
                  </div>
                )}
              </div>
              
              <div className="text-sm text-muted-foreground">
                {userType === 'dealer' && <Badge variant="outline">Dealer Mode</Badge>}
                {userType === 'power_user' && <Badge variant="outline">Power User</Badge>}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="overflow-x-auto">
          <TabsList className={`grid w-full ${tabs.length <= 5 ? 'grid-cols-5' : 'grid-cols-7'} gap-1 min-w-max`}>
            {tabs.map(tab => (
              <TabsTrigger 
                key={tab.id} 
                value={tab.id}
                className={`flex items-center gap-1 text-xs whitespace-nowrap ${tab.color}`}
              >
                <span>{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value="basics" className="mt-6">
          <VehicleBasicsTab formData={formData} updateFormData={updateFormData} />
        </TabsContent>

        <TabsContent value="condition" className="mt-6">
          <ConditionTab formData={formData} updateFormData={updateFormData} />
        </TabsContent>

        <TabsContent value="features" className="mt-6">
          <FeaturesTab 
            formData={formData} 
            updateFormData={updateFormData}
            baseValue={estimatedBaseValue}
            overrideDetected={overrideDetectedFeatures}
          />
        </TabsContent>

        <TabsContent value="accidents" className="mt-6">
          <AccidentHistoryTab 
            formData={formData} 
            onAccidentsChange={(accidentData) => updateFormData({ accident_history: accidentData })}
          />
        </TabsContent>

        <TabsContent value="maintenance" className="mt-6">
          <ServiceMaintenanceTab formData={formData} updateFormData={updateFormData} />
        </TabsContent>

        {showAllTabs && (
          <>
            <TabsContent value="technology" className="mt-6">
              <TechnologyTab formData={formData} updateFormData={updateFormData} baseValue={estimatedBaseValue} />
            </TabsContent>

            <TabsContent value="safety" className="mt-6">
              <SafetySecurityTab formData={formData} updateFormData={updateFormData} baseValue={estimatedBaseValue} />
            </TabsContent>

            <TabsContent value="driver-assistance" className="mt-6">
              <DriverAssistanceTab formData={formData} updateFormData={updateFormData} baseValue={estimatedBaseValue} />
            </TabsContent>

            <TabsContent value="climate" className="mt-6">
              <ClimateControlTab formData={formData} updateFormData={updateFormData} baseValue={estimatedBaseValue} />
            </TabsContent>

            <TabsContent value="audio" className="mt-6">
              <AudioEntertainmentTab formData={formData} updateFormData={updateFormData} baseValue={estimatedBaseValue} />
            </TabsContent>

            <TabsContent value="luxury-materials" className="mt-6">
              <LuxuryMaterialsTab formData={formData} updateFormData={updateFormData} baseValue={estimatedBaseValue} />
            </TabsContent>

            <TabsContent value="performance" className="mt-6">
              <PerformancePackagesTab formData={formData} updateFormData={updateFormData} baseValue={estimatedBaseValue} />
            </TabsContent>

            <TabsContent value="exterior" className="mt-6">
              <ExteriorFeaturesTab formData={formData} updateFormData={updateFormData} baseValue={estimatedBaseValue} />
            </TabsContent>

            <TabsContent value="interior" className="mt-6">
              <InteriorMaterialsTab formData={formData} updateFormData={updateFormData} baseValue={estimatedBaseValue} />
            </TabsContent>
          </>
        )}
      </Tabs>

      {/* Submit Button */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Complete all sections to get your accurate valuation
            </div>
            <Button 
              onClick={onSubmit}
              disabled={isLoading || progress < 80}
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Get My Valuation'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
