
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
import { FollowUpAnswers } from '@/types/follow-up-answers';

// Import all tab components
import { BasicInfoTab } from './tabs/BasicInfoTab';
import { TitleOwnershipTab } from './tabs/TitleOwnershipTab';
import { AccidentsTab } from './tabs/AccidentsTab';
import { ServiceHistoryTab } from './tabs/ServiceHistoryTab';
import { TiresBrakesTab } from './tabs/TiresBrakesTab';
import { DashboardLightsTab } from './tabs/DashboardLightsTab';
import { VehicleIssuesTab } from './tabs/VehicleIssuesTab';
import { FeaturesTab } from './tabs/FeaturesTab';
import { ModificationsTab } from './tabs/ModificationsTab';

interface TabbedFollowUpFormProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
  onSubmit: () => Promise<void>;
  isLoading: boolean;
}

const TABS = [
  { id: 'basic', label: 'Basic Info', component: BasicInfoTab },
  { id: 'title', label: 'Title & Ownership', component: TitleOwnershipTab },
  { id: 'accidents', label: 'Accident History', component: AccidentsTab },
  { id: 'service', label: 'Service History', component: ServiceHistoryTab },
  { id: 'tires', label: 'Tires & Brakes', component: TiresBrakesTab },
  { id: 'dashboard', label: 'Dashboard Lights', component: DashboardLightsTab },
  { id: 'issues', label: 'Vehicle Issues', component: VehicleIssuesTab },
  { id: 'features', label: 'Features', component: FeaturesTab },
  { id: 'modifications', label: 'Modifications', component: ModificationsTab }
];

export function TabbedFollowUpForm({ formData, updateFormData, onSubmit, isLoading }: TabbedFollowUpFormProps) {
  const [currentTab, setCurrentTab] = useState(0);

  const calculateProgress = () => {
    const totalTabs = TABS.length;
    return Math.round(((currentTab + 1) / totalTabs) * 100);
  };

  const handleNext = () => {
    if (currentTab < TABS.length - 1) {
      setCurrentTab(currentTab + 1);
    }
  };

  const handlePrevious = () => {
    if (currentTab > 0) {
      setCurrentTab(currentTab - 1);
    }
  };

  const handleSubmit = async () => {
    await onSubmit();
  };

  const handleAccidentsChange = (accidentData: any) => {
    updateFormData({ accident_history: accidentData });
  };

  const handleServiceHistoryChange = (serviceData: any) => {
    updateFormData({ serviceHistory: serviceData });
  };

  const handleFeaturesChange = (features: any) => {
    updateFormData({ features });
  };

  const handleModificationsChange = (modified: boolean, types?: string[]) => {
    updateFormData({ 
      modifications: { 
        hasModifications: modified,
        modified,
        types: types || []
      }
    });
  };

  const CurrentTabComponent = TABS[currentTab].component;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Header */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle>Vehicle Follow-Up Questions</CardTitle>
            <Badge variant="outline">
              Step {currentTab + 1} of {TABS.length}
            </Badge>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{TABS[currentTab].label}</span>
              <span>{calculateProgress()}% Complete</span>
            </div>
            <Progress value={calculateProgress()} className="w-full" />
          </div>
        </CardHeader>
      </Card>

      {/* Tab Navigation */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            {TABS.map((tab, index) => (
              <Button
                key={tab.id}
                variant={index === currentTab ? "default" : index < currentTab ? "secondary" : "outline"}
                size="sm"
                onClick={() => setCurrentTab(index)}
                className="flex items-center gap-2"
              >
                {index < currentTab && <CheckCircle className="h-4 w-4" />}
                {tab.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Current Tab Content */}
      <div className="min-h-[400px]">
        {currentTab === 0 && (
          <BasicInfoTab formData={formData} updateFormData={updateFormData} />
        )}
        {currentTab === 1 && (
          <TitleOwnershipTab formData={formData} updateFormData={updateFormData} />
        )}
        {currentTab === 2 && (
          <AccidentsTab formData={formData} onAccidentsChange={handleAccidentsChange} />
        )}
        {currentTab === 3 && (
          <ServiceHistoryTab formData={formData} onServiceHistoryChange={handleServiceHistoryChange} />
        )}
        {currentTab === 4 && (
          <TiresBrakesTab formData={formData} updateFormData={updateFormData} />
        )}
        {currentTab === 5 && (
          <DashboardLightsTab formData={formData} updateFormData={updateFormData} />
        )}
        {currentTab === 6 && (
          <VehicleIssuesTab formData={formData} updateFormData={updateFormData} />
        )}
        {currentTab === 7 && (
          <FeaturesTab formData={formData} onFeaturesChange={handleFeaturesChange} />
        )}
        {currentTab === 8 && (
          <ModificationsTab formData={formData} onModificationsChange={handleModificationsChange} />
        )}
      </div>

      {/* Navigation Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={handlePrevious}
              disabled={currentTab === 0}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            {currentTab === TABS.length - 1 ? (
              <Button 
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                {isLoading ? 'Submitting...' : 'Complete Follow-Up'}
                <CheckCircle className="h-4 w-4" />
              </Button>
            ) : (
              <Button 
                onClick={handleNext}
                className="flex items-center gap-2"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
