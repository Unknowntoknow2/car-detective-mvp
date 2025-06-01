
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { FollowUpAnswers } from '@/types/follow-up-answers';
import { VehicleBasicsTab } from './tabs/VehicleBasicsTab';
import { ConditionTab } from './tabs/ConditionTab';
import { FeaturesTab } from './tabs/FeaturesTab';
import { AccidentHistoryTab } from './tabs/AccidentHistoryTab';
import { ServiceMaintenanceTab } from './tabs/ServiceMaintenanceTab';
import { Loader2 } from 'lucide-react';

interface TabbedFollowUpFormProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
  onSubmit: () => Promise<void>;
  isLoading: boolean;
}

export function TabbedFollowUpForm({ formData, updateFormData, onSubmit, isLoading }: TabbedFollowUpFormProps) {
  const [activeTab, setActiveTab] = useState('basics');

  const tabs = [
    { id: 'basics', label: 'Vehicle Basics', icon: '🚗' },
    { id: 'condition', label: 'Condition', icon: '✨' },
    { id: 'features', label: 'Features', icon: '⚙️' },
    { id: 'accidents', label: 'History', icon: '📋' },
    { id: 'maintenance', label: 'Maintenance', icon: '🔧' }
  ];

  const calculateProgress = () => {
    const requiredFields = [
      formData.zip_code,
      formData.mileage,
      formData.condition,
      formData.transmission,
      formData.title_status,
      formData.tire_condition,
      formData.exterior_condition,
      formData.interior_condition
    ];
    
    const completedFields = requiredFields.filter(field => 
      field !== undefined && field !== null && field !== ''
    ).length;
    
    return Math.round((completedFields / requiredFields.length) * 100);
  };

  const progress = calculateProgress();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Header */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Vehicle Valuation Details</CardTitle>
            <Badge variant={progress === 100 ? "default" : "secondary"}>
              {progress}% Complete
            </Badge>
          </div>
          <Progress value={progress} className="mt-2" />
        </CardHeader>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          {tabs.map(tab => (
            <TabsTrigger 
              key={tab.id} 
              value={tab.id}
              className="flex items-center gap-1 text-xs"
            >
              <span>{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="basics" className="mt-6">
          <VehicleBasicsTab formData={formData} updateFormData={updateFormData} />
        </TabsContent>

        <TabsContent value="condition" className="mt-6">
          <ConditionTab formData={formData} updateFormData={updateFormData} />
        </TabsContent>

        <TabsContent value="features" className="mt-6">
          <FeaturesTab formData={formData} updateFormData={updateFormData} />
        </TabsContent>

        <TabsContent value="accidents" className="mt-6">
          <AccidentHistoryTab 
            formData={formData} 
            onAccidentsChange={(accidentData) => updateFormData({ accident_history: accidentData })}
          />
        </TabsContent>

        <TabsContent value="maintenance" className="mt-6">
          <ServiceMaintenanceTab formData={formData} updateFormData={updateFormData} />
        </TabsContent>
      </Tabs>

      {/* Submit Button */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Complete all sections to get your accurate valuation
            </div>
            <Button 
              onClick={onSubmit}
              disabled={isLoading || progress < 80}
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Get My Valuation'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
