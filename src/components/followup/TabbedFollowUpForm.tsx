
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
    description: 'Vehicle condition assessment'
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

  // Enhanced completion calculation
  const getTabCompletion = (tabId: string): 'complete' | 'partial' | 'empty' => {
    switch (tabId) {
      case 'basic':
        const hasValidZip = Boolean(formData.zip_code && formData.zip_code.length === 5 && /^\d{5}$/.test(formData.zip_code));
        const hasValidMileage = Boolean(formData.mileage && formData.mileage > 0);
        const hasCondition = Boolean(formData.condition);
        
        console.log('Basic tab completion check:', { hasValidZip, hasValidMileage, hasCondition, zip: formData.zip_code, mileage: formData.mileage, condition: formData.condition });
        return (hasValidZip && hasValidMileage && hasCondition) ? 'complete' : 'empty';
        
      case 'condition':
        const hasAllConditions = Boolean(
          formData.tire_condition && 
          formData.exterior_condition && 
          formData.interior_condition && 
          formData.brake_condition
        );
        console.log('Condition tab completion:', { 
          tire: formData.tire_condition, 
          exterior: formData.exterior_condition, 
          interior: formData.interior_condition, 
          brake: formData.brake_condition,
          complete: hasAllConditions
        });
        return hasAllConditions ? 'complete' : 'partial';
        
      case 'issues':
        // Dashboard lights are always optional
        return 'partial';
        
      case 'service':
        return formData.serviceHistory?.hasRecords !== undefined ? 'complete' : 'partial';
        
      case 'accidents':
        return formData.accidents?.hadAccident !== undefined ? 'complete' : 'partial';
        
      case 'modifications':
        return formData.modifications?.hasModifications !== undefined ? 'complete' : 'partial';
        
      case 'features':
        return 'partial'; // Features are always optional
        
      default:
        return 'empty';
    }
  };

  // Calculate overall progress
  const requiredTabs = tabs.filter(tab => tab.required);
  const optionalTabs = tabs.filter(tab => !tab.required);
  
  const completedRequired = requiredTabs.filter(tab => getTabCompletion(tab.id) === 'complete').length;
  const partialRequired = requiredTabs.filter(tab => getTabCompletion(tab.id) === 'partial').length;
  const completedOptional = optionalTabs.filter(tab => getTabCompletion(tab.id) === 'complete').length;
  
  // Required tabs count as 70%, optional as 30%
  const requiredWeight = 0.7;
  const optionalWeight = 0.3;
  
  const requiredProgress = ((completedRequired + (partialRequired * 0.5)) / requiredTabs.length) * requiredWeight;
  const optionalProgress = (completedOptional / optionalTabs.length) * optionalWeight;
  
  const progressPercentage = Math.round((requiredProgress + optionalProgress) * 100);

  // Can submit only if all required tabs are complete
  const canSubmit = completedRequired === requiredTabs.length;

  console.log('Form state summary:', {
    completedRequired,
    totalRequired: requiredTabs.length,
    canSubmit,
    progressPercentage,
    formData: {
      zip: formData.zip_code,
      mileage: formData.mileage,
      condition: formData.condition
    }
  });

  const getTabStatus = (tabId: string) => {
    const completion = getTabCompletion(tabId);
    const tab = tabs.find(t => t.id === tabId);
    
    if (completion === 'complete') {
      return { color: 'text-green-600', bg: 'bg-green-100', icon: CheckCircle };
    } else if (completion === 'partial' || !tab?.required) {
      return { color: 'text-yellow-600', bg: 'bg-yellow-100', icon: Clock };
    } else {
      return { color: 'text-gray-400', bg: 'bg-gray-100', icon: AlertCircle };
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
                  Optional: {completedOptional}/{optionalTabs.length}
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
                  Auto-saving...
                </div>
              )}
              {saveError && (
                <div className="text-sm text-red-600">
                  Save error: {saveError}
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
                <strong>Complete required sections:</strong> Please fill in all required fields in the Basic Info and Condition tabs to continue.
              </p>
              <div className="mt-2 text-xs text-yellow-700">
                Missing: {requiredTabs.filter(tab => getTabCompletion(tab.id) !== 'complete').map(tab => tab.label).join(', ')}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
