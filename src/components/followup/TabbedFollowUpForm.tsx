
import React, { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, AlertCircle, MapPin, Car, Wrench, AlertTriangle, Settings, Star, Send, ArrowLeft, ArrowRight, SkipForward } from 'lucide-react';
import { FollowUpAnswers } from '@/types/follow-up-answers';
import { useSimpleFollowUpForm } from '@/hooks/useSimpleFollowUpForm';
import { SilentSaveIndicator } from './SilentSaveIndicator';

// Import tab components
import { SimplifiedBasicInfoTab } from './tabs/SimplifiedBasicInfoTab';
import { ConditionTab } from './tabs/ConditionTab';
import { DashboardLightsTab } from './tabs/DashboardLightsTab';
import { ServiceMaintenanceTab } from './tabs/ServiceMaintenanceTab';
import { AccidentHistoryTab } from './tabs/AccidentHistoryTab';
import { ModificationsTab } from './tabs/ModificationsTab';
import { FeaturesTab } from './tabs/FeaturesTab';

interface TabbedFollowUpFormProps {
  vehicleData: {
    vin: string;
    year?: number;
    make?: string;
    model?: string;
  };
  onSubmit: () => Promise<boolean>;
}

const tabs = [
  {
    id: 'basic',
    label: 'Basic Info',
    icon: MapPin,
    component: SimplifiedBasicInfoTab,
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
  vehicleData,
  onSubmit
}: TabbedFollowUpFormProps) {
  const [currentTab, setCurrentTab] = useState('basic');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    formData,
    updateFormData,
    saveProgress,
    submitFollowUpAndStartValuation,
    isLoading,
    isSaving,
    saveError,
    lastSaveTime,
    isFormValid
  } = useSimpleFollowUpForm({
    vin: vehicleData.vin,
    initialData: { 
      year: vehicleData.year,
      make: vehicleData.make,
      model: vehicleData.model
    }
  });

  // Silent auto-save on tab change
  const handleTabChange = useCallback(async (tabId: string) => {
    await saveProgress(); // Silent save when changing tabs
    setCurrentTab(tabId);
  }, [saveProgress]);

  // Calculate completion status for each tab
  const getTabCompletion = useCallback((tabId: string): 'complete' | 'partial' | 'empty' => {
    switch (tabId) {
      case 'basic':
        const hasValidZip = Boolean(formData.zip_code && formData.zip_code.length === 5 && /^\d{5}$/.test(formData.zip_code));
        const hasValidMileage = Boolean(formData.mileage && formData.mileage > 0);
        const hasValidCondition = Boolean(formData.condition && ['excellent', 'good', 'fair', 'poor'].includes(formData.condition));
        
        return (hasValidZip && hasValidMileage && hasValidCondition) ? 'complete' : 'empty';
        
      case 'condition':
        const hasAllConditions = Boolean(
          formData.tire_condition && 
          formData.exterior_condition && 
          formData.interior_condition && 
          formData.brake_condition
        );
        return hasAllConditions ? 'complete' : 'partial';
        
      default:
        return 'partial';
    }
  }, [formData]);

  // Calculate overall progress
  const progressData = React.useMemo(() => {
    const requiredTabs = tabs.filter(tab => tab.required);
    const completedRequired = requiredTabs.filter(tab => getTabCompletion(tab.id) === 'complete').length;
    const progressPercentage = Math.round((completedRequired / requiredTabs.length) * 100);
    
    return {
      progressPercentage,
      canSubmit: isFormValid,
      completedRequired,
      requiredTabs
    };
  }, [getTabCompletion, isFormValid]);

  const getTabStatus = useCallback((tabId: string) => {
    const completion = getTabCompletion(tabId);
    
    if (completion === 'complete') {
      return { color: 'text-green-600', bg: 'bg-green-100', icon: CheckCircle };
    } else if (completion === 'partial') {
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
      handleTabChange(previousTab.id);
    }
  }, [currentTabIndex, isFirstTab, handleTabChange]);

  const goToNextTab = useCallback(() => {
    if (!isLastTab) {
      const nextTab = tabs[currentTabIndex + 1];
      handleTabChange(nextTab.id);
    }
  }, [currentTabIndex, isLastTab, handleTabChange]);

  const skipToFinalTab = useCallback(() => {
    handleTabChange(tabs[tabs.length - 1].id);
  }, [handleTabChange]);

  const handleSubmit = useCallback(async () => {
    if (!progressData.canSubmit) {
      return;
    }
    
    setIsSubmitting(true);
    try {
      console.log('🚀 [TabbedFollowUpForm] Starting form submission...');
      
      // Use the new integrated submission function
      const result = await submitFollowUpAndStartValuation();
      console.log('🔍 [TabbedFollowUpForm] Submission result:', result);
      
      if (result.success && result.valuationId) {
        console.log('✅ [TabbedFollowUpForm] Existing valuation found, navigating to results');
        // Navigate to results using the parent's onSubmit (which handles navigation)
        await onSubmit();
      } else if (result.requiresValuation) {
        console.log('🚀 [TabbedFollowUpForm] No valuation exists, calling parent to create valuation');
        // FIXED: Call parent's onSubmit when valuation creation is needed
        // This allows the parent (ValuationFollowUpPage) to create the valuation
        await onSubmit();
      } else {
        console.error('❌ [TabbedFollowUpForm] Submission failed:', result.message);
        // Only show error for actual failures, not when valuation creation is needed
        if (result.message !== 'NEEDS_VALUATION_CREATION') {
          // Could add toast error here if needed
        }
      }
    } catch (error) {
      console.error('❌ [TabbedFollowUpForm] Submit error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [progressData.canSubmit, submitFollowUpAndStartValuation, onSubmit]);

  if (isLoading) {
    return (
      <Card className="p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Loading your vehicle information...</span>
        </div>
      </Card>
    );
  }

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
              </div>
              
              <SilentSaveIndicator
                isSaving={isSaving}
                saveError={saveError}
                lastSaveTime={lastSaveTime}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Form */}
      <Tabs value={currentTab} onValueChange={handleTabChange} className="space-y-6">
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
                <strong>Complete Basic Info:</strong> Please fill in ZIP code, mileage, and condition to enable the Complete Valuation button.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
