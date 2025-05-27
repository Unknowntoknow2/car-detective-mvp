
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import { useVinLookupFlow } from '@/hooks/useVinLookupFlow';
import { MileageInput } from '@/components/valuation/enhanced-followup/MileageInput';
import { ConditionSelector } from '@/components/valuation/enhanced-followup/ConditionSelector';
import { ZipCodeInput } from '@/components/valuation/enhanced-followup/ZipCodeInput';
import { AccidentHistorySection } from '@/components/valuation/enhanced-followup/AccidentHistorySection';
import { ServiceHistorySelector } from '@/components/valuation/enhanced-followup/ServiceHistorySelector';
import { MaintenanceStatusSelector } from '@/components/valuation/enhanced-followup/MaintenanceStatusSelector';
import { TireConditionSelector } from '@/components/valuation/enhanced-followup/TireConditionSelector';
import { useFollowUpAnswers } from '@/components/valuation/enhanced-followup/hooks/useFollowUpAnswers';
import { toast } from 'sonner';

export function VinFollowupFlow() {
  const { state, submitFollowup, updateFollowupProgress } = useVinLookupFlow();
  const { answers, updateAnswers, saving } = useFollowUpAnswers(state.vin, state.vehicle?.valuationId);

  const handleSubmitFollowup = async () => {
    try {
      // Prepare followup data from answers
      const followupData = {
        mileage: answers.mileage,
        condition: answers.condition,
        zipCode: answers.zip_code,
        accidents: answers.accidents?.hadAccident ? 1 : 0,
        titleStatus: answers.title_status,
        serviceHistory: answers.service_history,
        maintenanceStatus: answers.maintenance_status,
        tireCondition: answers.tire_condition,
        photos: [] // Will be added later when photo upload is implemented
      };

      const result = await submitFollowup(followupData);
      if (result) {
        toast.success('Vehicle assessment completed successfully!');
      }
    } catch (error) {
      console.error('Error submitting followup:', error);
      toast.error('Failed to complete assessment');
    }
  };

  // Auto-update progress based on completed fields
  React.useEffect(() => {
    const totalFields = 7;
    let completedFields = 0;
    
    if (answers.mileage) completedFields++;
    if (answers.condition) completedFields++;
    if (answers.zip_code) completedFields++;
    if (answers.accidents?.hadAccident !== undefined) completedFields++;
    if (answers.service_history) completedFields++;
    if (answers.maintenance_status) completedFields++;
    if (answers.tire_condition) completedFields++;
    
    const progress = Math.round((completedFields / totalFields) * 100);
    updateFollowupProgress(progress);
  }, [answers, updateFollowupProgress]);

  if (state.stage === 'input' || state.isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Looking up vehicle...</span>
      </div>
    );
  }

  if (state.stage === 'error') {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <CardTitle className="text-red-700">VIN Lookup Error</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-red-600 mb-4">{state.error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            variant="outline"
            className="border-red-300 text-red-700 hover:bg-red-100"
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (state.stage === 'complete') {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <CardTitle className="text-green-700">Assessment Complete!</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-green-600 mb-4">
            Your vehicle assessment has been completed successfully.
          </p>
          <div className="flex gap-2">
            <Button className="bg-green-600 hover:bg-green-700">
              View Full Report
            </Button>
            <Button variant="outline" onClick={() => window.location.href = '/valuation'}>
              New Valuation
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show vehicle card and follow-up questions together for 'results' stage
  if (state.stage === 'results' && state.vehicle) {
    return (
      <div className="space-y-6">
        {/* Vehicle Found Card */}
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-green-500" />
                <div>
                  <CardTitle className="text-green-800">Vehicle Found!</CardTitle>
                  <p className="text-green-600 text-sm mt-1">
                    VIN: {state.vin}
                  </p>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-white rounded-lg p-4 border border-green-200">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {state.vehicle.year} {state.vehicle.make} {state.vehicle.model}
                {state.vehicle.trim && ` ${state.vehicle.trim}`}
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Engine:</span>
                  <div className="font-medium">{state.vehicle.engine || 'N/A'}</div>
                </div>
                <div>
                  <span className="text-gray-500">Transmission:</span>
                  <div className="font-medium">{state.vehicle.transmission || 'N/A'}</div>
                </div>
                <div>
                  <span className="text-gray-500">Drive Type:</span>
                  <div className="font-medium">{state.vehicle.driveType || 'N/A'}</div>
                </div>
                <div>
                  <span className="text-gray-500">Fuel Type:</span>
                  <div className="font-medium">{state.vehicle.fuelType || 'N/A'}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress Indicator */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Assessment Progress</span>
              <span className="text-sm text-muted-foreground">{state.followupProgress}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300" 
                style={{ width: `${state.followupProgress}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Follow-up Questions */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Help us provide a more accurate valuation
            </h2>
            <p className="text-gray-600">
              Please answer the following questions about your vehicle's condition and history.
            </p>
          </div>

          <div className="grid gap-6">
            <MileageInput
              value={answers.mileage}
              onChange={(mileage) => updateAnswers({ mileage })}
            />

            <ZipCodeInput
              value={answers.zip_code || ''}
              onChange={(zip_code) => updateAnswers({ zip_code })}
            />

            <ConditionSelector
              value={answers.condition}
              onChange={(condition) => updateAnswers({ condition })}
            />

            <AccidentHistorySection
              value={answers.accidents}
              onChange={(accidents) => updateAnswers({ accidents })}
            />

            <ServiceHistorySelector
              value={answers.service_history}
              onChange={(service_history) => updateAnswers({ service_history })}
            />

            <MaintenanceStatusSelector
              value={answers.maintenance_status}
              onChange={(maintenance_status) => updateAnswers({ maintenance_status })}
            />

            <TireConditionSelector
              value={answers.tire_condition}
              onChange={(tire_condition) => updateAnswers({ tire_condition })}
            />
          </div>

          {/* Submit Button */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  {saving && (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Saving answers...</span>
                    </div>
                  )}
                </div>
                
                <Button
                  onClick={handleSubmitFollowup}
                  disabled={state.isLoading || saving || state.followupProgress < 50}
                  size="lg"
                  className="min-w-[200px]"
                >
                  {state.isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Complete Assessment
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
              
              {state.followupProgress < 50 && (
                <p className="text-sm text-muted-foreground mt-2 text-center">
                  Please complete at least 50% of the questions to continue
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return null;
}
