
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useVinLookupFlow } from '@/hooks/useVinLookupFlow';
import { useFollowUpAnswers } from '@/components/valuation/enhanced-followup/hooks/useFollowUpAnswers';
import { ConditionSelector } from '@/components/valuation/enhanced-followup/ConditionSelector';
import { AccidentSection } from '@/components/valuation/enhanced-followup/AccidentSection';
import { ModificationsSection } from '@/components/valuation/enhanced-followup/ModificationsSection';
import { DashboardLightsSection } from '@/components/valuation/enhanced-followup/DashboardLightsSection';
import { AccidentDetails, ModificationDetails } from '@/types/follow-up-answers';
import { toast } from 'sonner';

export function VinFollowupFlow() {
  const { state, submitFollowup } = useVinLookupFlow();
  const { answers, updateAnswers, saveAnswers, saving } = useFollowUpAnswers(
    state.vin, 
    state.vehicle?.valuationId
  );
  
  const [localMileage, setLocalMileage] = useState<string>('');
  const [localZipCode, setLocalZipCode] = useState<string>('');

  // Calculate completion percentage
  const completionPercentage = answers.completion_percentage ?? 0;

  useEffect(() => {
    if (answers.mileage) {
      setLocalMileage(answers.mileage.toString());
    }
    if (answers.zip_code) {
      setLocalZipCode(answers.zip_code);
    }
  }, [answers.mileage, answers.zip_code]);

  const handleMileageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalMileage(value);
    
    const numericValue = parseInt(value);
    if (!isNaN(numericValue) && numericValue > 0) {
      updateAnswers({ mileage: numericValue });
    }
  };

  const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalZipCode(value);
    
    if (value.length === 5) {
      updateAnswers({ zip_code: value });
    }
  };

  const handleConditionChange = (condition: 'excellent' | 'good' | 'fair' | 'poor') => {
    updateAnswers({ condition });
  };

  const handleAccidentsChange = (accidents: AccidentDetails) => {
    updateAnswers({ accidents });
  };

  const handleModificationsChange = (modifications: ModificationDetails) => {
    updateAnswers({ modifications });
  };

  const handleDashboardLightsChange = (dashboard_lights: string[]) => {
    updateAnswers({ dashboard_lights });
  };

  const handleComplete = async () => {
    const followupData = {
      mileage: answers.mileage || 0,
      condition: answers.condition || 'good',
      zip_code: answers.zip_code || '',
      service_history: answers.service_history || '',
      completion_percentage: completionPercentage,
      is_complete: true,
      ...answers
    };

    const result = await submitFollowup(followupData);
    if (result) {
      toast.success('Vehicle assessment completed!');
    }
  };

  if (!state.vehicle) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">
            No vehicle data available for followup assessment.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Vehicle Assessment
            <span className="text-sm font-normal text-muted-foreground">
              {Math.round(completionPercentage)}% Complete
            </span>
          </CardTitle>
          <Progress value={completionPercentage} className="w-full" />
        </CardHeader>
      </Card>

      {/* Vehicle Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Vehicle Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Year</p>
              <p className="font-medium">{state.vehicle.year}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Make</p>
              <p className="font-medium">{state.vehicle.make}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Model</p>
              <p className="font-medium">{state.vehicle.model}</p>
            </div>
            <div>
              <p className="text-muted-foreground">VIN</p>
              <p className="font-medium font-mono text-xs">{state.vin}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="mileage">Current Mileage</Label>
              <Input
                id="mileage"
                type="number"
                placeholder="Enter current mileage"
                value={localMileage}
                onChange={handleMileageChange}
                min="0"
              />
            </div>
            <div>
              <Label htmlFor="zipcode">ZIP Code</Label>
              <Input
                id="zipcode"
                type="text"
                placeholder="Enter ZIP code"
                value={localZipCode}
                onChange={handleZipCodeChange}
                maxLength={5}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Condition Assessment */}
      <Card>
        <CardHeader>
          <CardTitle>Vehicle Condition</CardTitle>
        </CardHeader>
        <CardContent>
          <ConditionSelector
            value={answers.condition}
            onChange={handleConditionChange}
          />
        </CardContent>
      </Card>

      {/* Accident History */}
      <Card>
        <CardHeader>
          <CardTitle>Accident History</CardTitle>
        </CardHeader>
        <CardContent>
          <AccidentSection
            value={answers.accidents}
            onChange={handleAccidentsChange}
          />
        </CardContent>
      </Card>

      {/* Modifications */}
      <Card>
        <CardHeader>
          <CardTitle>Vehicle Modifications</CardTitle>
        </CardHeader>
        <CardContent>
          <ModificationsSection
            value={answers.modifications}
            onChange={handleModificationsChange}
          />
        </CardContent>
      </Card>

      {/* Dashboard Lights */}
      <Card>
        <CardHeader>
          <CardTitle>Dashboard Warning Lights</CardTitle>
        </CardHeader>
        <CardContent>
          <DashboardLightsSection
            value={answers.dashboard_lights}
            onChange={handleDashboardLightsChange}
          />
        </CardContent>
      </Card>

      {/* Completion Actions */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={handleComplete}
              disabled={state.isLoading || completionPercentage < 50}
              className="flex-1"
            >
              {state.isLoading ? 'Processing...' : 'Complete Assessment'}
            </Button>
            <Button
              variant="outline"
              onClick={() => saveAnswers()}
              disabled={saving}
              className="flex-1"
            >
              {saving ? 'Saving...' : 'Save Progress'}
            </Button>
          </div>
          
          {completionPercentage < 50 && (
            <p className="text-sm text-muted-foreground mt-2 text-center">
              Complete at least 50% of the assessment to proceed
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
