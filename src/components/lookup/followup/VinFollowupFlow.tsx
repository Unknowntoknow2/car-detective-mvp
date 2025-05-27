
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useVinLookupFlow } from '@/hooks/useVinLookupFlow';
import VehicleFoundCard from '@/components/lookup/found/FoundCarCard';
import { MileageInput } from '@/components/valuation/enhanced-followup/MileageInput';
import { ConditionSelector } from '@/components/valuation/enhanced-followup/ConditionSelector';
import { PreviousUseSelector } from '@/components/valuation/enhanced-followup/PreviousUseSelector';
import { AccidentSection } from '@/components/valuation/enhanced-followup/AccidentSection';
import { AccidentDetails } from '@/types/follow-up-answers';

export function VinFollowupFlow() {
  const { state, startFollowup, updateFollowupProgress, submitFollowup } = useVinLookupFlow();
  
  // Local form state
  const [mileage, setMileage] = useState<number>();
  const [condition, setCondition] = useState<'excellent' | 'good' | 'fair' | 'poor'>();
  const [previousUse, setPreviousUse] = useState<string>();
  const [accidents, setAccidents] = useState<AccidentDetails>({ hadAccident: false });

  // Calculate progress based on completed fields
  const calculateProgress = () => {
    let completed = 0;
    const total = 4;
    
    if (mileage && mileage > 0) completed++;
    if (condition) completed++;
    if (previousUse) completed++;
    if (accidents.hadAccident !== undefined) completed++;
    
    const progress = (completed / total) * 100;
    updateFollowupProgress(progress);
    return progress;
  };

  const handleSubmit = async () => {
    if (!mileage || !condition) {
      return;
    }

    const followupData = {
      mileage,
      condition,
      previousUse,
      accidents: accidents.hadAccident ? (accidents.count || 1) : 0,
    };

    await submitFollowup(followupData);
  };

  const canSubmit = mileage && mileage > 0 && condition;
  const progress = calculateProgress();

  // Show vehicle found card when in results stage
  if (state.stage === 'results' && state.vehicle) {
    return (
      <div className="space-y-6">
        <VehicleFoundCard 
          vehicle={state.vehicle}
          showActions={true}
          onContinue={() => startFollowup()}
        />
      </div>
    );
  }

  // Show followup questions when in followup stage
  if (state.stage !== 'followup' || !state.vehicle) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress indicator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Vehicle Assessment</span>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</span>
          </CardTitle>
          <Progress value={progress} className="w-full" />
        </CardHeader>
      </Card>

      {/* Vehicle Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Vehicle Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="font-medium">Year</p>
              <p className="text-muted-foreground">{state.vehicle.year}</p>
            </div>
            <div>
              <p className="font-medium">Make</p>
              <p className="text-muted-foreground">{state.vehicle.make}</p>
            </div>
            <div>
              <p className="font-medium">Model</p>
              <p className="text-muted-foreground">{state.vehicle.model}</p>
            </div>
            <div>
              <p className="font-medium">VIN</p>
              <p className="text-muted-foreground font-mono text-xs">{state.vin}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Followup Questions */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Current Mileage</CardTitle>
          </CardHeader>
          <CardContent>
            <MileageInput value={mileage} onChange={setMileage} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Vehicle Condition</CardTitle>
          </CardHeader>
          <CardContent>
            <ConditionSelector value={condition} onChange={setCondition} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Previous Use</CardTitle>
          </CardHeader>
          <CardContent>
            <PreviousUseSelector value={previousUse} onChange={setPreviousUse} />
          </CardContent>
        </Card>

        <AccidentSection value={accidents} onChange={setAccidents} />
      </div>

      {/* Submit Section */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-muted-foreground">
                {canSubmit ? 'Ready to complete assessment' : 'Please fill in required fields'}
              </p>
            </div>
            <Button 
              onClick={handleSubmit}
              disabled={!canSubmit || state.isLoading}
              size="lg"
            >
              {state.isLoading ? 'Processing...' : 'Complete Assessment'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
