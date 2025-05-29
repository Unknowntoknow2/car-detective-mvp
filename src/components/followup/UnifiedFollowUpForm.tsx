
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Car, Wrench, FileText, Eye, Star, AlertTriangle } from 'lucide-react';
import { FollowUpAnswers, AccidentDetails } from '@/types/follow-up-answers';
import { toast } from 'sonner';

// Import all tab components
import { BasicConditionTab } from './tabs/BasicConditionTab';
import { AccidentHistoryTab } from './tabs/AccidentHistoryTab';
import { ServiceMaintenanceTab } from './tabs/ServiceMaintenanceTab';
import { TitleOwnershipTab } from './tabs/TitleOwnershipTab';
import { PhysicalFeaturesTab } from './tabs/PhysicalFeaturesTab';
import { FeaturesTab } from './tabs/FeaturesTab';

interface UnifiedFollowUpFormProps {
  vin: string;
  initialData?: Partial<FollowUpAnswers>;
  onSubmit: (formData: FollowUpAnswers) => void;
  onSave?: (formData: FollowUpAnswers) => void;
}

const tabs = [
  {
    id: 'condition',
    name: 'Condition',
    icon: Car,
    color: 'bg-green-500',
    component: BasicConditionTab
  },
  {
    id: 'accidents',
    name: 'Accidents',
    icon: AlertTriangle,
    color: 'bg-red-500',
    component: AccidentHistoryTab
  },
  {
    id: 'service',
    name: 'Service',
    icon: Wrench,
    color: 'bg-blue-500',
    component: ServiceMaintenanceTab
  },
  {
    id: 'title',
    name: 'Title',
    icon: FileText,
    color: 'bg-purple-500',
    component: TitleOwnershipTab
  },
  {
    id: 'physical',
    name: 'Physical',
    icon: Eye,
    color: 'bg-orange-500',
    component: PhysicalFeaturesTab
  },
  {
    id: 'features',
    name: 'Features',
    icon: Star,
    color: 'bg-emerald-500',
    component: FeaturesTab
  }
];

export function UnifiedFollowUpForm({ vin, initialData, onSubmit, onSave }: UnifiedFollowUpFormProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState<FollowUpAnswers>({
    vin,
    ...initialData
  });

  const updateFormData = (updates: Partial<FollowUpAnswers>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleAccidentsChange = (hadAccident: boolean, details?: any) => {
    const accidentDetails: AccidentDetails = hadAccident ? {
      hadAccident: true,
      ...details
    } : {
      hadAccident: false
    };
    
    updateFormData({ accidents: accidentDetails });
  };

  const handleNext = () => {
    if (activeTab < tabs.length - 1) {
      setActiveTab(activeTab + 1);
    }
  };

  const handlePrevious = () => {
    if (activeTab > 0) {
      setActiveTab(activeTab - 1);
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave(formData);
      toast.success('Progress saved successfully!');
    }
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  const currentTab = tabs[activeTab];
  const TabComponent = currentTab.component;
  const progress = ((activeTab + 1) / tabs.length) * 100;

  return (
    <div className="space-y-6">
      {/* Header with Progress */}
      <Card className="bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 text-white">
        <CardContent className="p-8">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold">Vehicle Valuation Follow-up</h1>
            <p className="text-blue-100 text-lg">
              Complete these sections to get your most accurate vehicle valuation
            </p>
            
            {/* Progress Bar */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-blue-100">
                  Step {activeTab + 1} of {tabs.length}
                </span>
                <span className="text-sm font-medium text-blue-100">
                  {Math.round(progress)}% Complete
                </span>
              </div>
              <Progress value={progress} className="h-3 bg-blue-800/30" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tab Navigation */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-3 justify-center md:justify-start">
            {tabs.map((tab, index) => {
              const IconComponent = tab.icon;
              const isActive = index === activeTab;
              const isCompleted = index < activeTab;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(index)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-semibold transition-all duration-200 min-w-[120px] justify-center
                    ${isActive 
                      ? `${tab.color} text-white shadow-lg transform scale-105` 
                      : isCompleted
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                    }`}
                >
                  <IconComponent className={`h-5 w-5 ${isActive ? 'text-white' : ''}`} />
                  <span className="text-sm">{tab.name}</span>
                  {isCompleted && !isActive && (
                    <div className="w-2 h-2 bg-green-500 rounded-full ml-1"></div>
                  )}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Tab Content */}
      <Card className="min-h-[600px]">
        <CardContent className="p-8">
          <TabComponent 
            formData={formData} 
            updateFormData={updateFormData}
            onAccidentsChange={activeTab === 1 ? handleAccidentsChange : undefined}
          />
        </CardContent>
      </Card>

      {/* Navigation Controls */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={activeTab === 0}
              className="w-full sm:w-auto"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleSave}
                className="px-6"
              >
                Save Progress
              </Button>
              
              {activeTab === tabs.length - 1 ? (
                <Button
                  onClick={handleSubmit}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8"
                >
                  Complete Valuation
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  className="px-8"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
