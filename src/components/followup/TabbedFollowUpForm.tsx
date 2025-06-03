
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { FollowUpAnswers } from '@/types/follow-up-answers';
import { BasicInfoTab } from './tabs/BasicInfoTab';
import { VehicleConditionTab } from './tabs/VehicleConditionTab';
import { FeaturesTab } from './tabs/FeaturesTab';
import { ServiceHistoryTab } from './tabs/ServiceHistoryTab';
import { AccidentsTab } from './tabs/AccidentsTab';
import { TitleOwnershipTab } from './tabs/TitleOwnershipTab';
import { VehicleIssuesTab } from './tabs/VehicleIssuesTab';
import { Loader2, Save } from 'lucide-react';

interface TabbedFollowUpFormProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
  onSubmit: () => Promise<void>;
  onSave?: () => void;
  isLoading: boolean;
}

export default function TabbedFollowUpForm({
  formData,
  updateFormData,
  onSubmit,
  onSave,
  isLoading
}: TabbedFollowUpFormProps) {
  const [activeTab, setActiveTab] = useState('basic-info');

  const tabs = [
    { id: 'basic-info', label: 'Basic Info', component: BasicInfoTab },
    { id: 'condition', label: 'Condition', component: VehicleConditionTab },
    { id: 'features', label: 'Features', component: FeaturesTab },
    { id: 'service', label: 'Service History', component: ServiceHistoryTab },
    { id: 'accidents', label: 'Accidents', component: AccidentsTab },
    { id: 'title', label: 'Title & Ownership', component: TitleOwnershipTab },
    { id: 'issues', label: 'Issues', component: VehicleIssuesTab },
  ];

  const completionPercentage = formData.completion_percentage || 0;
  const canSubmit = formData.is_complete && completionPercentage >= 60;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Vehicle Follow-Up Questions</span>
          <div className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">
              {completionPercentage}% Complete
            </div>
            <Progress value={completionPercentage} className="w-32" />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-7">
            {tabs.map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

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

        <div className="flex justify-between mt-8 pt-6 border-t">
          <Button
            variant="outline"
            onClick={onSave}
            disabled={isLoading}
          >
            <Save className="w-4 h-4 mr-2" />
            Save Progress
          </Button>

          <Button
            onClick={onSubmit}
            disabled={!canSubmit || isLoading}
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              'Complete Valuation'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
