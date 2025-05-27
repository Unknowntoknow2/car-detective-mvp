
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useVinLookupFlow } from '@/hooks/useVinLookupFlow';
import { FoundCarCard } from '@/components/lookup/found/FoundCarCard';
import { MileageInput } from '@/components/valuation/enhanced-followup/MileageInput';
import { ConditionSelector } from '@/components/valuation/enhanced-followup/ConditionSelector';
import { ZipCodeInput } from '@/components/common/ZipCodeInput';
import { AccidentHistorySection } from '@/components/valuation/enhanced-followup/AccidentHistorySection';
import { MaintenanceStatusSelector } from '@/components/valuation/enhanced-followup/MaintenanceStatusSelector';
import { TireConditionSelector } from '@/components/valuation/enhanced-followup/TireConditionSelector';
import { ServiceHistorySelector } from '@/components/valuation/enhanced-followup/ServiceHistorySelector';
import { CheckCircle, Car, MapPin, Wrench, AlertTriangle } from 'lucide-react';
import type { AccidentDetails } from '@/types/follow-up-answers';

interface FollowUpAnswers {
  mileage?: number;
  condition?: string;
  zipCode?: string;
  accidents?: AccidentDetails;
  maintenanceStatus?: string;
  tireCondition?: string;
  serviceHistory?: string;
}

export function VinFollowupFlow() {
  const { state, updateFollowupProgress, submitFollowup } = useVinLookupFlow();
  const [answers, setAnswers] = useState<FollowUpAnswers>({});
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set());

  // Calculate progress based on completed sections
  const totalSections = 7;
  const progress = (completedSections.size / totalSections) * 100;

  useEffect(() => {
    updateFollowupProgress(progress);
  }, [progress, updateFollowupProgress]);

  const updateAnswer = (key: keyof FollowUpAnswers, value: any) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
    setCompletedSections(prev => new Set([...prev, key]));
  };

  const handleSubmit = async () => {
    if (!state.vehicle) return;

    const followupData = {
      mileage: answers.mileage,
      condition: answers.condition,
      zipCode: answers.zipCode,
      accidents: answers.accidents?.hadAccident ? answers.accidents.count || 0 : 0,
      titleStatus: 'clean',
      serviceHistory: answers.serviceHistory,
      maintenanceStatus: answers.maintenanceStatus,
      tireCondition: answers.tireCondition,
    };

    await submitFollowup(followupData);
  };

  const isReadyToSubmit = completedSections.size >= 4; // Require at least 4 sections

  if (!state.vehicle) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No vehicle data available</p>
      </div>
    );
  }

  if (state.stage === 'complete') {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-6 text-center">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-green-800 mb-2">
              Vehicle Assessment Complete!
            </h2>
            <p className="text-green-700">
              Your {state.vehicle.year} {state.vehicle.make} {state.vehicle.model} has been fully evaluated.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Vehicle Card */}
      <FoundCarCard vehicle={state.vehicle} />

      {/* Progress Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Car className="h-5 w-5" />
              Vehicle Assessment Questions
            </CardTitle>
            <div className="text-sm text-muted-foreground">
              {completedSections.size} of {totalSections} completed
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-muted-foreground mt-2">
            Answer these questions to get a more accurate valuation
          </p>
        </CardContent>
      </Card>

      {/* Follow-up Questions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mileage */}
        <MileageInput
          value={answers.mileage}
          onChange={(value) => updateAnswer('mileage', value)}
        />

        {/* Condition */}
        <ConditionSelector
          value={answers.condition}
          onChange={(value) => updateAnswer('condition', value)}
        />

        {/* ZIP Code */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-500" />
              <CardTitle className="text-lg">Location</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ZipCodeInput
              value={answers.zipCode || ''}
              onChange={(value: string) => updateAnswer('zipCode', value)}
              placeholder="Enter ZIP code"
              label="Vehicle Location"
            />
          </CardContent>
        </Card>

        {/* Accident History */}
        <AccidentHistorySection
          value={answers.accidents}
          onChange={(value) => updateAnswer('accidents', value)}
        />

        {/* Maintenance Status */}
        <MaintenanceStatusSelector
          value={answers.maintenanceStatus}
          onChange={(value) => updateAnswer('maintenanceStatus', value)}
        />

        {/* Tire Condition */}
        <TireConditionSelector
          value={answers.tireCondition}
          onChange={(value) => updateAnswer('tireCondition', value)}
        />

        {/* Service History */}
        <ServiceHistorySelector
          value={answers.serviceHistory}
          onChange={(value) => updateAnswer('serviceHistory', value)}
        />
      </div>

      {/* Vehicle Details Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Vehicle Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Year:</span>
              <div className="font-medium">{state.vehicle.year}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Make:</span>
              <div className="font-medium">{state.vehicle.make}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Model:</span>
              <div className="font-medium">{state.vehicle.model}</div>
            </div>
            {state.vehicle.trim && (
              <div>
                <span className="text-muted-foreground">Trim:</span>
                <div className="font-medium">{state.vehicle.trim}</div>
              </div>
            )}
            {state.vehicle.bodyType && (
              <div>
                <span className="text-muted-foreground">Body Type:</span>
                <div className="font-medium">{state.vehicle.bodyType}</div>
              </div>
            )}
            {state.vehicle.fuelType && (
              <div>
                <span className="text-muted-foreground">Fuel Type:</span>
                <div className="font-medium">{state.vehicle.fuelType}</div>
              </div>
            )}
            {state.vehicle.transmission && (
              <div>
                <span className="text-muted-foreground">Transmission:</span>
                <div className="font-medium">{state.vehicle.transmission}</div>
              </div>
            )}
            {state.vehicle.drivetrain && (
              <div>
                <span className="text-muted-foreground">Drivetrain:</span>
                <div className="font-medium">{state.vehicle.drivetrain}</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {isReadyToSubmit ? (
                <span className="text-green-600 flex items-center gap-1">
                  <CheckCircle className="h-4 w-4" />
                  Ready for valuation
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                  Complete at least 4 sections to continue
                </span>
              )}
            </div>
            <Button
              onClick={handleSubmit}
              disabled={!isReadyToSubmit || state.isLoading}
              size="lg"
              className="w-full sm:w-auto"
            >
              {state.isLoading ? 'Processing...' : 'Get Vehicle Valuation'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
