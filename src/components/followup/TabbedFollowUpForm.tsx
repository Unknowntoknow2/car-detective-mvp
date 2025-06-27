
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, AlertCircle, MapPin, Car, Wrench, AlertTriangle, Settings, Star, Save, Send, ArrowLeft, ArrowRight, SkipForward } from 'lucide-react';
import { FollowUpAnswers } from '@/types/follow-up-answers';
import { toast } from 'sonner';

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
  onSubmit: () => Promise<boolean>;
  onSave: () => void;
  isLoading?: boolean;
  isSaving?: boolean;
  saveError?: string | null;
  lastSaveTime?: Date | null;
  isFormValid?: boolean;
  currentTab: string;
  onTabChange: (tabId: string) => void;
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
  lastSaveTime,
  isFormValid = false,
  currentTab,
  onTabChange
}: TabbedFollowUpFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Debounced auto-save that triggers after 2 seconds of inactivity
  useEffect(() => {
    if (formData && Object.keys(formData).length > 0) {
      const timeoutId = setTimeout(() => {
        if (!isSaving && !isSubmitting) {
          onSave();
        }
      }, 2000);

      return () => clearTimeout(timeoutId);
    }
  }, [formData, onSave, isSaving, isSubmitting]);

  // Enhanced completion calculation
  const getTabCompletion = useCallback((tabId: string): 'complete' | 'partial' | 'empty' => {
    switch (tabId) {
      case 'basic':
        const hasValidZip = Boolean(formData.zip_code && formData.zip_code.length === 5 && /^\d{5}$/.test(formData.zip_code));
        const hasValidMileage = Boolean(formData.mileage && formData.mileage > 0);
        const hasCondition = Boolean(formData.condition);
        
        return (hasValidZip && hasValidMileage && hasCondition) ? 'complete' : 'empty';
        
      case 'condition':
        const hasAllConditions = Boolean(
          formData.tire_condition && 
          formData.exterior_condition && 
          formData.interior_condition && 
          formData.brake_condition
        );
        return hasAllConditions ? 'complete' : 'partial';
        
      case 'issues':
        return 'partial'; // Dashboard lights are always optional
        
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
  }, [formData]);

  // Calculate overall progress
  const progressData = React.useMemo(() => {
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
    const canSubmit = completedRequired === requiredTabs.length && isFormValid;

    return {
      progressPercentage,
      canSubmit,
      completedRequired,
      completedOptional,
      requiredTabs,
      optionalTabs
    };
  }, [getTabCompletion, isFormValid]);

  const getTabStatus = useCallback((tabId: string) => {
    const completion = getTabCompletion(tabId);
    const tab = tabs.find(t => t.id === tabId);
    
    if (completion === 'complete') {
      return { color: 'text-green-600', bg: 'bg-green-100', icon: CheckCircle };
    } else if (completion === 'partial' || !tab?.required) {
      return { color: 'text-yellow-600', bg: 'bg-yellow-100', icon: Clock };
    } else {
      return { color: 'text-gray-400', bg: 'bg-gray-100', icon: AlertCircle };
    }
  }, [getTabCompletion]);

  // Navigation functions
  const currentTabIndex = tabs.findIndex(tab => tab.id === currentTab);
  const isFirstTab = currentTabIndex === 0;
  const isLastTab = currentTabIndex === tabs.length - 1;

  const goToPreviousTab = useCallback(() => {
    if (!isFirstTab) {
      const previousTab = tabs[currentTabIndex - 1];
      onTabChange(previousTab.id);
    }
  }, [currentTabIndex, isFirstTab, onTabChange]);

  const goToNextTab = useCallback(() => {
    if (!isLastTab) {
      const nextTab = tabs[currentTabIndex + 1];
      onTabChange(nextTab.id);
    }
  }, [currentTabIndex, isLastTab, onTabChange]);

  const skipToFinalTab = useCallback(() => {
    onTabChange(tabs[tabs.length - 1].id);
    toast.info('Skipped to final section. You can always come back to fill in more details.');
  }, [onTabChange]);

  const handleManualSave = useCallback(() => {
    onSave();
    toast.success('Progress saved successfully!');
  }, [onSave]);

  const handleSubmit = useCallback(async () => {
    if (!progressData.canSubmit) {
      toast.error('Please complete all required sections before submitting.');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const success = await onSubmit();
      if (success) {
        toast.success('Valuation completed successfully!');
      }
    } catch (error) {
      toast.error('Failed to complete valuation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [progressData.canSubmit, onSubmit]);

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
                <div className="text-2xl font-bold text-blue-600">{progressData.progressPercentage}%</div>
                <div className="text-sm text-gray-500">Complete</div>
              </div>
            </div>
            
            <Progress value={progressData.progressPercentage} className="h-2" />
            
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Required: {progressData.completedRequired}/{progressData.requiredTabs.length}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-600" />
                  Optional: {progressData.completedOptional}/{progressData.optionalTabs.length}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                {isSaving && (
                  <div className="flex items-center gap-1 text-gray-500">
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                    <span className="text-xs">Auto-saving...</span>
                  </div>
                )}
                {lastSaveTime && !isSaving && (
                  <div className="flex items-center gap-1 text-gray-500">
                    <Save className="w-3 h-3" />
                    <span className="text-xs">Saved {lastSaveTime.toLocaleTimeString()}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Form */}
      <Tabs value={currentTab} onValueChange={onTabChange} className="space-y-6">
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

      {/* Navigation Controls */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={goToPreviousTab}
                disabled={isFirstTab}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </Button>
              
              <Button
                variant="outline"
                onClick={handleManualSave}
                disabled={isSaving}
                className="flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Saving...' : 'Save Progress'}
              </Button>

              {!isLastTab && currentTabIndex < tabs.length - 2 && (
                <Button
                  variant="ghost"
                  onClick={skipToFinalTab}
                  className="flex items-center gap-2 text-gray-600"
                >
                  <SkipForward className="w-4 h-4" />
                  Skip to Finish
                </Button>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              {!isLastTab && (
                <span className="text-sm text-gray-500">
                  {Math.round(((currentTabIndex + 1) / tabs.length) * 100)}% complete
                </span>
              )}
              
              {!isLastTab ? (
                <Button
                  onClick={goToNextTab}
                  className="flex items-center gap-2"
                >
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!progressData.canSubmit || isSubmitting}
                  className={`flex items-center gap-2 ${
                    progressData.canSubmit 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  {isSubmitting ? (
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
              )}
            </div>
          </div>
          
          {!progressData.canSubmit && isLastTab && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Complete required sections:</strong> Please fill in all required fields in the Basic Info and Condition tabs to continue.
              </p>
              <div className="mt-2 text-xs text-yellow-700">
                Missing: {progressData.requiredTabs.filter(tab => getTabCompletion(tab.id) !== 'complete').map(tab => tab.label).join(', ')}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
