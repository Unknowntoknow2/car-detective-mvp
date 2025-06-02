
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Car, Wrench, Shield, History, FileText, Star, Settings } from 'lucide-react';
import { FollowUpAnswers } from '@/types/follow-up-answers';

// Import all tab components
import { BasicInfoTab } from './tabs/BasicInfoTab';
import { ConditionTab } from './tabs/ConditionTab';
import { FeaturesTab } from './tabs/FeaturesTab';
import { ServiceHistoryTab } from './tabs/ServiceHistoryTab';
import { AccidentHistoryTab } from './tabs/AccidentHistoryTab';
import { VehicleIssuesTab } from './tabs/VehicleIssuesTab';
import { TitleOwnershipTab } from './tabs/TitleOwnershipTab';
import { ModificationsTab } from './tabs/ModificationsTab';

interface TabbedFollowUpFormProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
  onSubmit: () => Promise<void>;
  isLoading: boolean;
}

interface TabConfig {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  component: React.ComponentType<any>;
  gradient: string;
  borderColor: string;
  badgeColor: string;
}

const TABS: TabConfig[] = [
  {
    id: 'basic',
    label: 'Basic Info',
    icon: Car,
    component: BasicInfoTab,
    gradient: 'from-blue-50 to-cyan-50',
    borderColor: 'border-l-blue-500',
    badgeColor: 'bg-blue-500'
  },
  {
    id: 'condition',
    label: 'Condition',
    icon: Star,
    component: ConditionTab,
    gradient: 'from-green-50 to-emerald-50',
    borderColor: 'border-l-green-500',
    badgeColor: 'bg-green-500'
  },
  {
    id: 'features',
    label: 'Features',
    icon: Settings,
    component: FeaturesTab,
    gradient: 'from-purple-50 to-violet-50',
    borderColor: 'border-l-purple-500',
    badgeColor: 'bg-purple-500'
  },
  {
    id: 'service',
    label: 'Service History',
    icon: History,
    component: ServiceHistoryTab,
    gradient: 'from-orange-50 to-amber-50',
    borderColor: 'border-l-orange-500',
    badgeColor: 'bg-orange-500'
  },
  {
    id: 'accidents',
    label: 'Accident History',
    icon: Shield,
    component: AccidentHistoryTab,
    gradient: 'from-red-50 to-rose-50',
    borderColor: 'border-l-red-500',
    badgeColor: 'bg-red-500'
  },
  {
    id: 'issues',
    label: 'Vehicle Issues',
    icon: Clock,
    component: VehicleIssuesTab,
    gradient: 'from-yellow-50 to-orange-50',
    borderColor: 'border-l-yellow-500',
    badgeColor: 'bg-yellow-500'
  },
  {
    id: 'title',
    label: 'Title & Ownership',
    icon: FileText,
    component: TitleOwnershipTab,
    gradient: 'from-indigo-50 to-blue-50',
    borderColor: 'border-l-indigo-500',
    badgeColor: 'bg-indigo-500'
  },
  {
    id: 'modifications',
    label: 'Modifications',
    icon: Wrench,
    component: ModificationsTab,
    gradient: 'from-purple-50 to-indigo-50',
    borderColor: 'border-l-purple-500',
    badgeColor: 'bg-purple-500'
  }
];

export function TabbedFollowUpForm({ formData, updateFormData, onSubmit, isLoading }: TabbedFollowUpFormProps) {
  const [activeTab, setActiveTab] = useState('basic');
  
  const currentTabIndex = TABS.findIndex(tab => tab.id === activeTab);
  const currentTab = TABS[currentTabIndex];
  const TabComponent = currentTab.component;

  const completionPercentage = formData.completion_percentage || 0;

  const getTabStatus = (tabId: string) => {
    switch (tabId) {
      case 'basic':
        return !!(formData.zip_code && formData.mileage && formData.condition);
      case 'condition':
        return !!(formData.tire_condition && formData.exterior_condition && formData.interior_condition);
      case 'features':
        return formData.features && formData.features.length > 0;
      case 'service':
        return !!formData.serviceHistory?.hasRecords;
      case 'accidents':
        return formData.accident_history?.hadAccident !== undefined;
      case 'issues':
        return true; // Optional tab
      case 'title':
        return !!formData.title_status;
      case 'modifications':
        return formData.modifications?.hasModifications !== undefined;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentTabIndex < TABS.length - 1) {
      setActiveTab(TABS[currentTabIndex + 1].id);
    }
  };

  const handlePrevious = () => {
    if (currentTabIndex > 0) {
      setActiveTab(TABS[currentTabIndex - 1].id);
    }
  };

  const canSubmit = completionPercentage >= 70; // Minimum 70% completion required

  return (
    <div className="max-w-6xl mx-auto">
      {/* Progress Header */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Vehicle Valuation Details</h2>
              <p className="text-gray-600 mt-1">Complete the sections below for an accurate valuation</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary">{completionPercentage}%</div>
              <div className="text-sm text-gray-500">Complete</div>
            </div>
          </div>
          <Progress value={completionPercentage} className="h-2" />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Tab Navigation Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Sections</h3>
              <div className="space-y-2">
                {TABS.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  const isCompleted = getTabStatus(tab.id);

                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-all ${
                        isActive
                          ? 'bg-primary text-primary-foreground shadow-md'
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <div className={`flex-shrink-0 ${isActive ? 'text-primary-foreground' : 'text-gray-400'}`}>
                        {isCompleted ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <Icon className="h-5 w-5" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{tab.label}</div>
                        {isCompleted && (
                          <div className="text-xs opacity-75 mt-0.5">Completed</div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Active Tab Content */}
          <Card className={`border-l-4 ${currentTab.borderColor}`}>
            <div className={`bg-gradient-to-r ${currentTab.gradient} px-6 py-4 border-b`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${currentTab.badgeColor} text-white`}>
                    <currentTab.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{currentTab.label}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Step {currentTabIndex + 1} of {TABS.length}
                    </p>
                  </div>
                </div>
                {getTabStatus(currentTab.id) && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Complete
                  </Badge>
                )}
              </div>
            </div>
            <CardContent className="p-6">
              <TabComponent formData={formData} updateFormData={updateFormData} />
            </CardContent>
          </Card>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentTabIndex === 0}
              className="flex items-center space-x-2"
            >
              <span>Previous</span>
            </Button>

            <div className="flex items-center space-x-4">
              {currentTabIndex < TABS.length - 1 ? (
                <Button
                  onClick={handleNext}
                  className="flex items-center space-x-2"
                >
                  <span>Next</span>
                </Button>
              ) : (
                <Button
                  onClick={onSubmit}
                  disabled={!canSubmit || isLoading}
                  className="bg-green-600 hover:bg-green-700 text-white px-8"
                >
                  {isLoading ? 'Submitting...' : 'Get My Valuation'}
                </Button>
              )}
            </div>
          </div>

          {/* Completion Message */}
          {!canSubmit && (
            <Card className="border-amber-200 bg-amber-50">
              <CardContent className="pt-4">
                <div className="flex items-center space-x-2 text-amber-800">
                  <Clock className="h-5 w-5" />
                  <div>
                    <p className="font-medium">Almost there!</p>
                    <p className="text-sm">
                      Complete at least 70% of the form to get your valuation. 
                      Current progress: {completionPercentage}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
