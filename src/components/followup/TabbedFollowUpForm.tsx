
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Save, CheckCircle } from 'lucide-react';
import { FollowUpAnswers } from '@/types/follow-up-answers';
import { ConditionForm } from './ConditionForm';
import { AdditionalDetailsForm } from './AdditionalDetailsForm';
import { LoanDetailsForm } from './LoanDetailsForm';

export interface TabbedFollowUpFormProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
  onSubmit: () => Promise<void>;
  isLoading: boolean;
  onSave: () => void;
}

const TabbedFollowUpForm: React.FC<TabbedFollowUpFormProps> = ({
  formData,
  updateFormData,
  onSubmit,
  isLoading,
  onSave,
}) => {
  const [activeTab, setActiveTab] = useState('condition');

  const tabs = [
    { id: 'condition', label: 'Condition', component: ConditionForm },
    { id: 'details', label: 'Additional Details', component: AdditionalDetailsForm },
    { id: 'loan', label: 'Loan Information', component: LoanDetailsForm },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Follow-Up Questions
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Progress value={formData.completion_percentage} className="w-32" />
              <span>{formData.completion_percentage}% complete</span>
              {formData.is_complete && <CheckCircle className="h-4 w-4 text-green-500" />}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              {tabs.map((tab) => (
                <TabsTrigger key={tab.id} value={tab.id}>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {tabs.map((tab) => {
              const Component = tab.component;
              return (
                <TabsContent key={tab.id} value={tab.id} className="mt-6">
                  <Component formData={formData} updateFormData={updateFormData} />
                </TabsContent>
              );
            })}
          </Tabs>

          <div className="flex justify-between mt-8 pt-6 border-t">
            <Button
              variant="outline"
              onClick={onSave}
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Save Progress
            </Button>

            <Button
              onClick={onSubmit}
              disabled={!formData.is_complete || isLoading}
              className="flex items-center gap-2"
            >
              {isLoading ? 'Submitting...' : 'Submit Valuation'}
              {formData.is_complete && <CheckCircle className="h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TabbedFollowUpForm;
