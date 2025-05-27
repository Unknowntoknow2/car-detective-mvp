
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Stepper } from '@/components/ui/stepper';
import { useFollowUpAnswers } from '@/components/valuation/enhanced-followup/hooks/useFollowUpAnswers';
import { AccidentSection } from '@/components/valuation/enhanced-followup/AccidentSection';
import { ModificationsSection } from '@/components/valuation/enhanced-followup/ModificationsSection';
import { DashboardLightsSection } from '@/components/valuation/enhanced-followup/DashboardLightsSection';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export function VinFollowupFlow() {
  const navigate = useNavigate();
  
  // Get VIN from localStorage or URL
  const [vin] = useState(() => {
    return localStorage.getItem('current_vin') || '';
  });

  const { answers, loading, saving, updateAnswers, saveAnswers } = useFollowUpAnswers(vin);
  const [currentStep, setCurrentStep] = useState(0);

  // Handle the case where completion_percentage might be undefined
  const completionPercentage = answers.completion_percentage ?? 0;
  const isComplete = completionPercentage >= 80;

  const steps = [
    'Basic Info',
    'Condition Details', 
    'History & Accidents',
    'Final Details'
  ];

  // Handle the case where completion_percentage might be undefined
  if (completionPercentage >= 100) {
    // Navigate to results when complete
    setTimeout(() => {
      navigate(`/valuation/${vin}`);
    }, 1000);
  }

  const handleBasicInfoSubmit = () => {
    const basicData = {
      mileage: parseInt((document.getElementById('mileage') as HTMLInputElement)?.value || '0'),
      condition: (document.getElementById('condition') as HTMLSelectElement)?.value as 'excellent' | 'good' | 'fair' | 'poor',
      zip_code: (document.getElementById('zip_code') as HTMLInputElement)?.value || '',
      service_history: (document.getElementById('service_history') as HTMLSelectElement)?.value || '',
      completion_percentage: 25,
      is_complete: false
    };

    updateAnswers(basicData);
    setCurrentStep(1);
  };

  const handleConditionSubmit = () => {
    const conditionData = {
      title_status: (document.getElementById('title_status') as HTMLSelectElement)?.value || '',
      previous_owners: parseInt((document.getElementById('previous_owners') as HTMLInputElement)?.value || '1'),
      previous_use: (document.getElementById('previous_use') as HTMLSelectElement)?.value || '',
      tire_condition: (document.getElementById('tire_condition') as HTMLSelectElement)?.value || '',
      completion_percentage: 50,
      is_complete: false
    };

    updateAnswers(conditionData);
    setCurrentStep(2);
  };

  const handleHistorySubmit = () => {
    updateAnswers({
      completion_percentage: 75,
      is_complete: false
    });
    setCurrentStep(3);
  };

  const handleFinalSubmit = async () => {
    const finalData = {
      completion_percentage: 100,
      is_complete: true
    };

    updateAnswers(finalData);
    await saveAnswers();
    
    toast.success('Follow-up completed! Proceeding to valuation results.');
    
    // Navigate to valuation results
    setTimeout(() => {
      navigate(`/valuation/${vin}`);
    }, 1500);
  };

  if (loading) {
    return (
      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-8 text-center">
          <div className="animate-pulse">Loading follow-up questions...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Header */}
      <Card>
        <CardHeader>
          <CardTitle>Vehicle Assessment Progress</CardTitle>
          <div className="space-y-4">
            <Progress value={completionPercentage} className="w-full" />
            <div className="text-sm text-muted-foreground text-center">
              {completionPercentage}% Complete
            </div>
            <Stepper steps={steps} currentStep={currentStep} />
          </div>
        </CardHeader>
      </Card>

      {/* Step Content */}
      <Card>
        <CardContent className="p-6">
          {currentStep === 0 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Basic Vehicle Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="mileage">Current Mileage</Label>
                  <Input
                    id="mileage"
                    type="number"
                    placeholder="Enter mileage"
                    defaultValue={answers.mileage?.toString() || ''}
                  />
                </div>
                
                <div>
                  <Label htmlFor="zip_code">Zip Code</Label>
                  <Input
                    id="zip_code"
                    placeholder="Enter zip code"
                    defaultValue={answers.zip_code || ''}
                  />
                </div>
                
                <div>
                  <Label htmlFor="condition">Overall Condition</Label>
                  <Select defaultValue={answers.condition || ''}>
                    <SelectTrigger id="condition">
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excellent">Excellent</SelectItem>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="fair">Fair</SelectItem>
                      <SelectItem value="poor">Poor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="service_history">Service History</Label>
                  <Select defaultValue={answers.service_history || ''}>
                    <SelectTrigger id="service_history">
                      <SelectValue placeholder="Select service history" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dealer">Dealer-maintained</SelectItem>
                      <SelectItem value="independent">Independent mechanic</SelectItem>
                      <SelectItem value="owner">Owner-maintained</SelectItem>
                      <SelectItem value="unknown">No known history</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button onClick={handleBasicInfoSubmit} className="w-full">
                Continue to Condition Details
              </Button>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Condition & Ownership Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title_status">Title Status</Label>
                  <Select defaultValue={answers.title_status || ''}>
                    <SelectTrigger id="title_status">
                      <SelectValue placeholder="Select title status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="clean">Clean</SelectItem>
                      <SelectItem value="salvage">Salvage</SelectItem>
                      <SelectItem value="rebuilt">Rebuilt</SelectItem>
                      <SelectItem value="branded">Branded</SelectItem>
                      <SelectItem value="lemon">Lemon Law</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="previous_owners">Number of Previous Owners</Label>
                  <Input
                    id="previous_owners"
                    type="number"
                    placeholder="Enter number"
                    defaultValue={answers.previous_owners?.toString() || '1'}
                  />
                </div>
                
                <div>
                  <Label htmlFor="previous_use">Previous Use</Label>
                  <Select defaultValue={answers.previous_use || ''}>
                    <SelectTrigger id="previous_use">
                      <SelectValue placeholder="Select previous use" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="personal">Personal</SelectItem>
                      <SelectItem value="commercial">Commercial / Fleet</SelectItem>
                      <SelectItem value="rental">Rental / Ride-share</SelectItem>
                      <SelectItem value="emergency">Police or Emergency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="tire_condition">Tire Condition</Label>
                  <Select defaultValue={answers.tire_condition || ''}>
                    <SelectTrigger id="tire_condition">
                      <SelectValue placeholder="Select tire condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excellent">Excellent (8/32"+ tread)</SelectItem>
                      <SelectItem value="good">Good (6–7/32")</SelectItem>
                      <SelectItem value="worn">Worn (3–5/32")</SelectItem>
                      <SelectItem value="replacement">Needs Replacement (<3/32")</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button onClick={handleConditionSubmit} className="w-full">
                Continue to History & Accidents
              </Button>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Accident History & Modifications</h3>
              
              <AccidentSection
                value={answers.accidents}
                onChange={(accidents) => updateAnswers({ accidents })}
              />
              
              <ModificationsSection
                value={answers.modifications}
                onChange={(modifications) => updateAnswers({ modifications })}
              />
              
              <DashboardLightsSection
                value={answers.dashboard_lights}
                onChange={(dashboard_lights) => updateAnswers({ dashboard_lights })}
              />
              
              <Button onClick={handleHistorySubmit} className="w-full">
                Continue to Final Details
              </Button>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold">Final Review</h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-semibold text-green-800">Assessment Nearly Complete</h4>
                  <p className="text-green-700">
                    You've provided detailed information about your vehicle. 
                    Click below to complete the assessment and view your valuation results.
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="frame_damage"
                    checked={answers.frame_damage || false}
                    onChange={(e) => updateAnswers({ frame_damage: e.target.checked })}
                  />
                  <Label htmlFor="frame_damage">Vehicle has frame damage</Label>
                </div>
              </div>
              
              <Button 
                onClick={handleFinalSubmit} 
                className="w-full"
                disabled={saving}
              >
                {saving ? 'Completing Assessment...' : 'Complete Assessment & View Results'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
