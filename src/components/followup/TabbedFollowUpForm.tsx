
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Save, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FollowUpAnswers } from '@/types/follow-up-answers';

// Tab components
import {
  BasicInfoTab,
  ConditionTab,
  FeaturesTab,
  ModificationsTab,
  ServiceMaintenanceTab,
  AccidentHistoryTab,
  VehicleIssuesTab,
  TitleOwnershipTab,
} from './tabs';

const TABS = [
  { id: 'basics', label: '🚗 Basics', color: 'from-blue-400 to-blue-600', component: BasicInfoTab },
  { id: 'condition', label: '🎯 Condition', color: 'from-green-400 to-green-600', component: ConditionTab },
  { id: 'features', label: '⭐ Features', color: 'from-purple-400 to-purple-600', component: FeaturesTab },
  { id: 'modifications', label: '🛠 Modifications', color: 'from-pink-400 to-pink-600', component: ModificationsTab },
  { id: 'service', label: '🔧 Service History', color: 'from-orange-400 to-orange-600', component: ServiceMaintenanceTab },
  { id: 'accidents', label: '💥 Accidents', color: 'from-red-400 to-red-600', component: AccidentHistoryTab },
  { id: 'issues', label: '⚠️ Vehicle Issues', color: 'from-yellow-400 to-yellow-600', component: VehicleIssuesTab },
  { id: 'title', label: '📄 Title & Ownership', color: 'from-gray-400 to-gray-600', component: TitleOwnershipTab },
];

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
  const [lastSaved, setLastSaved] = useState<Date>(new Date());

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  const getCurrentTabComponent = () => {
    const currentTab = TABS.find(tab => tab.id === activeTab);
    if (!currentTab) return null;
    
    const TabComponent = currentTab.component;
    return (
      <TabComponent
        formData={formData}
        updateFormData={updateFormData}
        baseValue={25000} // This should come from your valuation data
      />
    );
  };

  const getTabCompletionStatus = (tabId: string) => {
    switch (tabId) {
      case 'basics':
        return !!(formData.zip_code && formData.mileage && formData.transmission);
      case 'condition':
        return !!(formData.condition && formData.tire_condition && formData.exterior_condition && formData.interior_condition);
      case 'features':
        return formData.features && formData.features.length > 0;
      case 'modifications':
        return formData.modifications?.hasModifications !== undefined;
      case 'service':
        return formData.serviceHistory?.hasRecords !== undefined;
      case 'accidents':
        return formData.accident_history?.hadAccident !== undefined;
      case 'issues':
        return !!(formData.dashboard_lights !== undefined && formData.rust !== undefined);
      case 'title':
        return !!(formData.title_status && formData.previous_owners !== undefined);
      default:
        return false;
    }
  };

  const completedTabs = TABS.filter(tab => getTabCompletionStatus(tab.id)).length;
  const completionPercentage = (completedTabs / TABS.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Vehicle Assessment</h1>
          <p className="text-gray-600">Complete your vehicle details for an accurate valuation</p>
          
          {/* Progress Section */}
          <div className="mt-4 bg-white rounded-xl p-4 shadow-sm border">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-sm font-medium text-gray-700">
                  {completedTabs} of {TABS.length} sections completed
                </span>
              </div>
              <Badge variant="secondary" className="text-green-600">
                {Math.round(completionPercentage)}% Complete
              </Badge>
            </div>
            <Progress value={completionPercentage} className="h-2" />
            <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
              <span>Last saved: {lastSaved.toLocaleTimeString()}</span>
              <div className="flex items-center gap-1">
                <Save className="h-3 w-3" />
                <span>Auto-saving</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="bg-white rounded-xl p-2 shadow-sm border overflow-x-auto">
            <div className="flex gap-2 min-w-max">
              {TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                const isCompleted = getTabCompletionStatus(tab.id);
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={cn(
                      "relative px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 whitespace-nowrap",
                      "hover:scale-105 transform",
                      isActive
                        ? `bg-gradient-to-r ${tab.color} text-white shadow-lg`
                        : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      {tab.label}
                      {isCompleted && (
                        <CheckCircle className="h-4 w-4 text-green-400" />
                      )}
                    </div>
                    {isActive && (
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="mb-6">
          {getCurrentTabComponent()}
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Complete all sections for the most accurate valuation
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  const currentIndex = TABS.findIndex(tab => tab.id === activeTab);
                  if (currentIndex > 0) {
                    setActiveTab(TABS[currentIndex - 1].id);
                  }
                }}
                disabled={TABS.findIndex(tab => tab.id === activeTab) === 0}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  const currentIndex = TABS.findIndex(tab => tab.id === activeTab);
                  if (currentIndex < TABS.length - 1) {
                    setActiveTab(TABS[currentIndex + 1].id);
                  }
                }}
                disabled={TABS.findIndex(tab => tab.id === activeTab) === TABS.length - 1}
              >
                Next
              </Button>
              <Button
                onClick={onSubmit}
                disabled={isLoading || completionPercentage < 75}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
              >
                {isLoading ? 'Processing...' : 'Get Valuation'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
