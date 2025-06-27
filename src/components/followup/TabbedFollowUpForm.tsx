
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, AlertCircle, MapPin, Car, Wrench, AlertTriangle, Settings, Star, Save, Send } from 'lucide-react';
import { FollowUpAnswers } from '@/types/follow-up-answers';

// Import all tab components
import { BasicInfoTab } from './tabs/BasicInfoTab';
import { ConditionTab } from './tabs/ConditionTab';
import { DashboardLightsTab } from './tabs/DashboardLightsTab';
import { ServiceMaintenanceTab } from './tabs/ServiceMaintenanceTab';
import { AccidentHistoryTab } from './tabs/AccidentHistoryTab';
import { ModificationsTab } from './tabs/ModificationsTab';
import { FeaturesTab } from './tabs/FeaturesTab';
import { VehicleIssuesTab } from './tabs/VehicleIssuesTab';

interface TabbedFollowUpFormProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
  onSubmit: () => void;
  onSave: () => void;
  isLoading?: boolean;
  isSaving?: boolean;
  saveError?: string | null;
  lastSaveTime?: Date | null;
}

const tabs = [
  {
    id: 'basic',
    label: 'Basic Info',
    icon: MapPin,
    component: BasicInfoTab,
    required: true,
    description: 'Location and mileage'
  },
  {
    id: 'condition',
    label: 'Condition',
    icon: Car,
    component: ConditionTab,
    required: true,
    description: 'Overall vehicle condition'
  },
  {
    id: 'issues',
    label: 'Dashboard',
    icon: AlertCircle,
    component: DashboardLightsTab,
    required: false,
    description: 'Warning lights and issues'
  },
  {
    id: 'service',
    label: 'Service',
    icon: Wrench,
    component: ServiceMaintenanceTab,
    required: false,
    description: 'Maintenance history'
  },
  {
    id: 'accidents',
    label: 'Accidents',
    icon: AlertTriangle,
    component: AccidentHistoryTab,
    required: false,
    description: 'Accident history'
  },
  {
    id: 'modifications',
    label: 'Modifications',
    icon: Settings,
    component: ModificationsTab,
    required: false,
    description: 'Vehicle modifications'
  },
  {
    id: 'features',
    label: 'Features',
    icon: Star,
    component: FeaturesTab,
    required: false,
    description: 'Premium features'
  }
];

export function TabbedFollowUpForm({
  formData,
  updateFormData,
  onSubmit,
  onSave,
  isLoading = false,
  isSaving = false,
  saveError,
  lastSaveTime
}: TabbedFollowUpFormProps) {
  const [activeTab, setActiveTab] = useState('basic');

  // Calculate completion for each tab
  const getTabCompletion = (tabId: string): 'complete' | 'partial' | 'empty' => {
    switch (tabId) {
      case 'basic':
        return (formData.mileage && formData.zip_code) ? 'complete' : 'empty';
      case 'condition':
        return formData.condition ? 'complete' : 'empty';
      case 'issues':
        return (formData.dashboard_lights && formData.dashboard_lights.length > 0) ? 'complete' : 'partial';
      case 'service':
        return formData.serviceHistory?.hasRecords ? 'complete' : 'partial';
      case 'accidents':
        return formData.accidents?.hadAccident !== undefined ? 'complete' : 'partial';
      case 'modifications':
        return formData.modifications?.hasModifications !== undefined ? 'complete' : 'partial';
      case 'features':
        return (formData.features && formData.features.length > 0) ? 'complete' : 'partial';
      default:
        return 'empty';
    }
  };

  // Calculate overall progress
  const requiredTabs = tabs.filter(tab => tab.required);
  const completedRequired = requiredTabs.filter(tab => getTabCompletion(tab.id) === 'complete').length;
  const totalOptionalCompleted = tabs.filter(tab => !tab.required && getTabCompletion(tab.id) === 'complete').length;
  const progressPercentage = Math.round(((completedRequired + totalOptionalCompleted * 0.5) / (requiredTabs.length + tabs.filter(t => !t.required).length * 0.5)) * 100);

  const canSubmit = completedRequired === requiredTabs.length;

  const getTabStatus = (tabId: string) => {
    const completion = getTabCompletion(tabId);
    const tab = tabs.find(t => t.id === tabId);
    
    if (completion === 'complete') {
      return { color: 'text-green-600', bg: 'bg-green-100', icon: CheckCircle };
    } else if (completion === 'partial' || !tab?.required) {
      return { color: 'text-yellow-600', bg: 'bg-yellow-100', icon: Clock };
    } else {
      return { color: 'text-gray-400', bg: 'bg-gray-100', icon: Clock };
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Follow-up Questions</h2>
                <p className="text-sm text-gray-600">
                  Complete the required sections to get your accurate valuation
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{progressPercentage}%</div>
                <div className="text-sm text-gray-500">Complete</div>
              </div>
            </div>
            
            <Progress value={progressPercentage} className="h-2" />
            
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Required: {completedRequired}/{requiredTabs.length}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-600" />
                  Optional: {totalOptionalCompleted}/{tabs.filter(t => !t.required).length}
                </span>
              </div>
              
              {lastSaveTime && (
                <div className="flex items-center gap-1 text-gray-500">
                  <Save className="w-4 h-4" />
                  Last saved: {lastSaveTime.toLocaleTimeString()}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Form */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <TabsList className="grid w-full grid-cols-7 gap-1">
              {tabs.map((tab) => {
                const status = getTabStatus(tab.id);
                const IconComponent = tab.icon;
                const StatusIcon = status.icon;
                
                return (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="flex flex-col items-center gap-1 p-3 h-auto data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
                  >
                    <div className="flex items-center gap-1">
                      <IconComponent className="w-4 h-4" />
                      <StatusIcon className={`w-3 h-3 ${status.color}`} />
                    </div>
                    <span className="text-xs font-medium">{tab.label}</span>
                    <span className="text-xs text-gray-500 hidden md:block">{tab.description}</span>
                    {tab.required && (
                      <Badge variant="secondary" className="text-xs py-0 px-1">Required</Badge>
                    )}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </CardContent>
        </Card>

        {/* Tab Content */}
        {tabs.map((tab) => {
          const TabComponent = tab.component;
          return (
            <TabsContent key={tab.id} value={tab.id} className="mt-6">
              <TabComponent
                formData={formData}
                updateFormData={updateFormData}
              />
            </TabsContent>
          );
        })}
      </Tabs>

      {/* Action Buttons */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isSaving && (
                <div className="text-sm text-gray-600 flex items-center gap-1">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  Saving...
                </div>
              )}
              {saveError && (
                <div className="text-sm text-red-600">
                  Save failed: {saveError}
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={onSave}
                disabled={isSaving}
                className="flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Progress
              </Button>
              
              <Button
                onClick={onSubmit}
                disabled={!canSubmit || isLoading}
                className="flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Complete Valuation
                  </>
                )}
              </Button>
            </div>
          </div>
          
          {!canSubmit && (
            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Complete required sections:</strong> Please fill in the Basic Info and Condition tabs to continue.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
