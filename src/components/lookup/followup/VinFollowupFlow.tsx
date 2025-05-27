
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { useFollowUpAnswers } from '@/components/valuation/enhanced-followup/hooks/useFollowUpAnswers';
import { ConditionSelector } from '@/components/valuation/enhanced-followup/ConditionSelector';
import { AccidentSection } from '@/components/valuation/enhanced-followup/AccidentSection';
import { ModificationsSection } from '@/components/valuation/enhanced-followup/ModificationsSection';
import { DashboardLightsSection } from '@/components/valuation/enhanced-followup/DashboardLightsSection';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { CONDITION_OPTIONS, SERVICE_HISTORY_OPTIONS, TITLE_STATUS_OPTIONS, TIRE_CONDITION_OPTIONS, PREVIOUS_USE_OPTIONS } from '@/types/follow-up-answers';

export function VinFollowupFlow() {
  const { vin } = useParams<{ vin: string }>();
  const navigate = useNavigate();
  
  if (!vin) {
    navigate('/vin-lookup');
    return null;
  }

  const { answers, loading, saving, updateAnswers, saveAnswers } = useFollowUpAnswers(vin);

  // Auto-save when answers change
  useEffect(() => {
    if (!loading && answers.completion_percentage > 0) {
      const timeoutId = setTimeout(() => {
        saveAnswers();
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [answers, loading, saveAnswers]);

  const handleComplete = async () => {
    if (answers.completion_percentage < 80) {
      toast.error('Please complete more questions before finishing');
      return;
    }

    const success = await saveAnswers({
      ...answers,
      is_complete: true,
      completion_percentage: 100
    });

    if (success) {
      toast.success('Follow-up complete! Generating your valuation...');
      navigate(`/valuation/${vin}`);
    }
  };

  const handleBack = () => {
    navigate(`/vin-lookup?vin=${vin}`);
  };

  if (loading) {
    return (
      <Container className="max-w-4xl py-8">
        <div className="text-center">Loading follow-up questions...</div>
      </Container>
    );
  }

  const completionPercentage = answers.completion_percentage || 0;

  return (
    <Container className="max-w-4xl py-8">
      {/* Header */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleBack}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <div>
                <CardTitle>Additional Vehicle Information</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  VIN: {vin}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium">
                {completionPercentage}% Complete
              </div>
              <Progress value={completionPercentage} className="w-32 mt-1" />
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Follow-up Questions */}
      <div className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="mileage">Current Mileage</Label>
                <Input
                  id="mileage"
                  type="number"
                  placeholder="Enter mileage"
                  value={answers.mileage || ''}
                  onChange={(e) => updateAnswers({ mileage: parseInt(e.target.value) || undefined })}
                />
              </div>
              <div>
                <Label htmlFor="zip_code">ZIP Code</Label>
                <Input
                  id="zip_code"
                  placeholder="Enter ZIP code"
                  value={answers.zip_code || ''}
                  onChange={(e) => updateAnswers({ zip_code: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vehicle Condition */}
        <ConditionSelector
          value={answers.condition as 'excellent' | 'good' | 'fair' | 'poor' | undefined}
          onChange={(condition) => updateAnswers({ condition })}
        />

        {/* Accident History */}
        <AccidentSection
          value={answers.accidents}
          onChange={(accidents) => updateAnswers({ accidents })}
        />

        {/* Service History */}
        <Card>
          <CardHeader>
            <CardTitle>Service & Maintenance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Service History Type</Label>
              <Select
                value={answers.service_history || ''}
                onValueChange={(service_history) => updateAnswers({ service_history })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select service history type" />
                </SelectTrigger>
                <SelectContent>
                  {SERVICE_HISTORY_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Maintenance Status</Label>
              <RadioGroup
                value={answers.maintenance_status || ''}
                onValueChange={(maintenance_status) => updateAnswers({ maintenance_status })}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="up_to_date" id="maintenance-current" />
                  <Label htmlFor="maintenance-current">Up to date</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="needs_service" id="maintenance-needs" />
                  <Label htmlFor="maintenance-needs">Needs service</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="unknown" id="maintenance-unknown" />
                  <Label htmlFor="maintenance-unknown">Unknown</Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>

        {/* Modifications */}
        <ModificationsSection
          value={answers.modifications}
          onChange={(modifications) => updateAnswers({ modifications })}
        />

        {/* Dashboard Warning Lights */}
        <DashboardLightsSection
          value={answers.dashboard_lights}
          onChange={(dashboard_lights) => updateAnswers({ dashboard_lights })}
        />

        {/* Title & Ownership */}
        <Card>
          <CardHeader>
            <CardTitle>Title & Ownership</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Title Status</Label>
              <Select
                value={answers.title_status || ''}
                onValueChange={(title_status) => updateAnswers({ title_status })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select title status" />
                </SelectTrigger>
                <SelectContent>
                  {TITLE_STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="previous_owners">Number of Previous Owners</Label>
              <Input
                id="previous_owners"
                type="number"
                min="0"
                max="10"
                value={answers.previous_owners || ''}
                onChange={(e) => updateAnswers({ previous_owners: parseInt(e.target.value) || undefined })}
              />
            </div>

            <div>
              <Label>Previous Use</Label>
              <Select
                value={answers.previous_use || ''}
                onValueChange={(previous_use) => updateAnswers({ previous_use })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select previous use" />
                </SelectTrigger>
                <SelectContent>
                  {PREVIOUS_USE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Physical Condition */}
        <Card>
          <CardHeader>
            <CardTitle>Physical Condition</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Tire Condition</Label>
              <Select
                value={answers.tire_condition || ''}
                onValueChange={(tire_condition) => updateAnswers({ tire_condition })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select tire condition" />
                </SelectTrigger>
                <SelectContent>
                  {TIRE_CONDITION_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Frame Damage</Label>
              <RadioGroup
                value={answers.frame_damage ? 'yes' : 'no'}
                onValueChange={(value) => updateAnswers({ frame_damage: value === 'yes' })}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="frame-no" />
                  <Label htmlFor="frame-no">No frame damage</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="frame-yes" />
                  <Label htmlFor="frame-yes">Has frame damage</Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                {saving && 'Saving...'}
                {completionPercentage >= 80 && (
                  <span className="text-green-600 flex items-center gap-1">
                    <CheckCircle className="h-4 w-4" />
                    Ready to complete
                  </span>
                )}
              </div>
              
              <Button 
                onClick={handleComplete}
                disabled={completionPercentage < 80 || saving}
                size="lg"
              >
                {completionPercentage >= 80 ? 'Complete Valuation' : `Complete ${completionPercentage}% to finish`}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
