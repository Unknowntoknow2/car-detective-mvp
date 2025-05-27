
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle } from 'lucide-react';
import { useFollowUpAnswers } from './hooks/useFollowUpAnswers';
import { MileageInput } from './MileageInput';
import { ConditionSelector } from './ConditionSelector';
import { DashboardLightsSection } from './DashboardLightsSection';
import { ModificationsSection } from './ModificationsSection';
import { AccidentHistorySection } from './AccidentHistorySection';
import { ServiceHistorySelector } from './ServiceHistorySelector';
import { TireConditionSelector } from './TireConditionSelector';
import { MaintenanceStatusSelector } from './MaintenanceStatusSelector';
import { PreviousUseSelector } from './PreviousUseSelector';
import { ZipCodeInput } from './ZipCodeInput';

export interface EnhancedFollowUpFormProps {
  vin: string;
  onComplete?: () => void;
}

export function EnhancedFollowUpForm({ vin, onComplete }: EnhancedFollowUpFormProps) {
  const { answers, loading, saving, updateAnswers, saveAnswers } = useFollowUpAnswers(vin);

  const handleComplete = async () => {
    const success = await saveAnswers();
    if (success && onComplete) {
      onComplete();
    }
  };

  const completionPercentage = answers.completionPercentage || 0;
  const isComplete = completionPercentage >= 80;

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Vehicle Assessment</CardTitle>
            <div className="flex items-center gap-2">
              {isComplete && <CheckCircle className="h-5 w-5 text-green-500" />}
              <span className="text-sm text-muted-foreground">
                {completionPercentage}% Complete
              </span>
            </div>
          </div>
          <Progress value={completionPercentage} className="w-full" />
        </CardHeader>
      </Card>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <MileageInput
            value={answers.mileage}
            onChange={(mileage) => updateAnswers({ mileage })}
          />
          
          <ZipCodeInput
            value={answers.zipCode}
            onChange={(zipCode) => updateAnswers({ zipCode })}
          />
        </CardContent>
      </Card>

      {/* Vehicle Condition */}
      <Card>
        <CardHeader>
          <CardTitle>Vehicle Condition</CardTitle>
        </CardHeader>
        <CardContent>
          <ConditionSelector
            value={answers.condition as 'excellent' | 'good' | 'fair' | 'poor'}
            onChange={(condition) => updateAnswers({ condition })}
          />
        </CardContent>
      </Card>

      {/* Accident History */}
      <AccidentHistorySection
        value={answers.accidents}
        onChange={(accidents) => updateAnswers({ accidents })}
      />

      {/* Service & Maintenance */}
      <ServiceHistorySelector
        value={answers.serviceHistory}
        onChange={(serviceHistory) => updateAnswers({ serviceHistory })}
      />

      <MaintenanceStatusSelector
        value={answers.maintenanceStatus}
        onChange={(maintenanceStatus) => updateAnswers({ maintenanceStatus })}
      />

      <TireConditionSelector
        value={answers.tireCondition}
        onChange={(tireCondition) => updateAnswers({ tireCondition })}
      />

      {/* Dashboard Lights */}
      <DashboardLightsSection
        value={answers.dashboardLights}
        onChange={(dashboardLights) => updateAnswers({ dashboardLights })}
      />

      {/* Previous Use */}
      <Card>
        <CardHeader>
          <CardTitle>Vehicle History</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <PreviousUseSelector
            value={answers.previousUse}
            onChange={(previousUse) => updateAnswers({ previousUse })}
          />

          <div className="space-y-2">
            <label className="text-sm font-medium">Number of Previous Owners</label>
            <input
              type="number"
              min="0"
              max="10"
              value={answers.previousOwners || ''}
              onChange={(e) => updateAnswers({ previousOwners: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Enter number of previous owners"
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium">Frame Damage</label>
            <div className="flex gap-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="frameDamage"
                  checked={answers.frameDamage === false}
                  onChange={() => updateAnswers({ frameDamage: false })}
                />
                <span>No Frame Damage</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="frameDamage"
                  checked={answers.frameDamage === true}
                  onChange={() => updateAnswers({ frameDamage: true })}
                />
                <span>Has Frame Damage</span>
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modifications */}
      <ModificationsSection
        value={answers.modifications}
        onChange={(modifications) => updateAnswers({ modifications })}
      />

      {/* Complete Button */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              {saving ? 'Saving...' : 'Auto-saved'}
            </div>
            <Button
              onClick={handleComplete}
              disabled={!isComplete || saving}
              className="px-8"
            >
              {isComplete ? 'Complete Assessment' : `Complete Assessment (${completionPercentage}%)`}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
