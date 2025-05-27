
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useVinLookupFlow } from '@/hooks/useVinLookupFlow';
import { useFollowUpAnswers } from '@/components/valuation/enhanced-followup/hooks/useFollowUpAnswers';
import { ConditionSelector } from '@/components/valuation/enhanced-followup/ConditionSelector';
import { AccidentSection } from '@/components/valuation/enhanced-followup/AccidentSection';
import { ModificationsSection } from '@/components/valuation/enhanced-followup/ModificationsSection';
import { DashboardLightsSection } from '@/components/valuation/enhanced-followup/DashboardLightsSection';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { ConditionLevel } from '@/components/lookup/types/manualEntry';
import { FollowUpAnswers } from '@/types/follow-up-answers';

export function VinFollowupFlow() {
  const { state } = useVinLookupFlow();
  const { answers, updateAnswers, saveAnswers, saving } = useFollowUpAnswers(state.vin, state.vehicle?.valuationId);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  // Convert ConditionLevel enum to string literal type
  const convertConditionToString = (condition: ConditionLevel): 'excellent' | 'good' | 'fair' | 'poor' => {
    switch (condition) {
      case ConditionLevel.Excellent:
        return 'excellent';
      case ConditionLevel.VeryGood:
      case ConditionLevel.Good:
        return 'good';
      case ConditionLevel.Fair:
        return 'fair';
      case ConditionLevel.Poor:
        return 'poor';
      default:
        return 'good';
    }
  };

  // Convert string literal to ConditionLevel enum
  const convertStringToConditionLevel = (condition?: 'excellent' | 'good' | 'fair' | 'poor'): ConditionLevel => {
    switch (condition) {
      case 'excellent':
        return ConditionLevel.Excellent;
      case 'good':
        return ConditionLevel.Good;
      case 'fair':
        return ConditionLevel.Fair;
      case 'poor':
        return ConditionLevel.Poor;
      default:
        return ConditionLevel.Good;
    }
  };

  const handleConditionChange = (condition: 'excellent' | 'good' | 'fair' | 'poor') => {
    updateAnswers({ condition });
  };

  const handleMileageChange = (mileage: number) => {
    updateAnswers({ mileage });
  };

  const handleZipCodeChange = (zip_code: string) => {
    updateAnswers({ zip_code });
  };

  const handleServiceHistoryChange = (service_history: string) => {
    updateAnswers({ service_history });
  };

  const handleComplete = async () => {
    try {
      // Ensure all required fields are filled
      const completedAnswers: FollowUpAnswers = {
        ...answers,
        mileage: answers.mileage || 50000,
        condition: answers.condition || 'good',
        zip_code: answers.zip_code || '90210',
        service_history: answers.service_history || 'unknown',
        completion_percentage: 100,
        is_complete: true
      };

      updateAnswers(completedAnswers);
      const success = await saveAnswers(completedAnswers);
      
      if (success) {
        toast.success('Follow-up completed! Generating valuation...');
        // Navigate to results or trigger result generation
      }
    } catch (error) {
      console.error('Error completing follow-up:', error);
      toast.error('Failed to complete follow-up');
    }
  };

  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Vehicle Assessment</CardTitle>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Step {currentStep} of {totalSteps}</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {currentStep === 1 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="mileage">Current Mileage</Label>
                  <Input
                    id="mileage"
                    type="number"
                    value={answers.mileage || ''}
                    onChange={(e) => handleMileageChange(parseInt(e.target.value) || 0)}
                    placeholder="Enter current mileage"
                  />
                </div>

                <div>
                  <Label htmlFor="zip_code">ZIP Code</Label>
                  <Input
                    id="zip_code"
                    value={answers.zip_code || ''}
                    onChange={(e) => handleZipCodeChange(e.target.value)}
                    placeholder="Enter ZIP code"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Vehicle Condition</h3>
              <ConditionSelector
                value={answers.condition}
                onChange={handleConditionChange}
              />
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">History & Maintenance</h3>
              
              <div>
                <Label htmlFor="service_history">Service History</Label>
                <Select
                  value={answers.service_history || ''}
                  onValueChange={handleServiceHistoryChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select service history" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dealer">Dealer-maintained</SelectItem>
                    <SelectItem value="independent">Independent mechanic</SelectItem>
                    <SelectItem value="owner">Owner-maintained</SelectItem>
                    <SelectItem value="unknown">Unknown</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <AccidentSection
                accidents={answers.accidents}
                onChange={(accidents) => updateAnswers({ accidents })}
              />
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Additional Details</h3>
              
              <ModificationsSection
                modifications={answers.modifications}
                onChange={(modifications) => updateAnswers({ modifications })}
              />

              <DashboardLightsSection
                dashboardLights={answers.dashboard_lights}
                onChange={(dashboard_lights) => updateAnswers({ dashboard_lights })}
              />
            </div>
          )}

          <div className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
            >
              Previous
            </Button>

            {currentStep < totalSteps ? (
              <Button
                onClick={() => setCurrentStep(Math.min(totalSteps, currentStep + 1))}
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                disabled={saving}
              >
                {saving ? 'Completing...' : 'Complete Assessment'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
