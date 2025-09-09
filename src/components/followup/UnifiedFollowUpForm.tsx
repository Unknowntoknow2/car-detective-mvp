
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useFollowUpForm } from "@/hooks/useFollowUpForm";
import { VehicleFoundCard } from "@/components/premium/lookup/plate/VehicleFoundCard";
import { FollowUpAnswers } from "@/types/follow-up-answers";

interface UnifiedFollowUpFormProps {
  vehicleData: any;
  onComplete: (data: FollowUpAnswers) => void;
  tier: "free" | "premium";
}

export function UnifiedFollowUpForm({ vehicleData, onComplete, tier }: UnifiedFollowUpFormProps) {
  const { formData, updateFormData, submitForm, isLoading, formMethods } = useFollowUpForm(vehicleData.vin);
  
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { id: 'vehicle', title: 'Vehicle Confirmation', required: true },
    { id: 'basic', title: 'Basic Information', required: true },
    { id: 'condition', title: 'Vehicle Condition', required: true },
    { id: 'history', title: 'Vehicle History', required: tier === "premium" },
    { id: 'features', title: 'Features & Options', required: false }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    const currentFormData = formMethods.getValues();
    const success = await submitForm(currentFormData);
    if (success) {
      onComplete(formData);
    }
  };

  const renderStep = () => {
    switch (steps[currentStep].id) {
      case 'vehicle':
        return (
          <div className="space-y-4">
            <VehicleFoundCard vehicle={vehicleData} />
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="confirm-vehicle"
                checked={formData.vehicleConfirmed === true}
                onCheckedChange={(checked) => updateFormData({ vehicleConfirmed: checked === true })}
              />
              <Label htmlFor="confirm-vehicle">
                This information is correct
              </Label>
            </div>
          </div>
        );

      case 'basic':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="mileage">Current Mileage *</Label>
              <Input
                id="mileage"
                type="number"
                value={formData.mileage || ''}
                onChange={(e) => updateFormData({ mileage: parseInt(e.target.value) })}
                placeholder="Enter current mileage"
              />
            </div>
            
            <div>
              <Label htmlFor="zip_code">ZIP Code *</Label>
              <Input
                id="zip_code"
                value={formData.zip_code || ''}
                onChange={(e) => updateFormData({ zip_code: e.target.value })}
                placeholder="Enter your ZIP code"
              />
            </div>

            <div>
              <Label htmlFor="condition">Overall Condition *</Label>
              <Select 
                value={formData.condition || 'good'} 
                onValueChange={(value) => updateFormData({ condition: value })}
                required
              >
                <SelectTrigger className={!formData.condition ? 'border-red-300' : ''}>
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excellent">Excellent</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="fair">Fair</SelectItem>
                  <SelectItem value="poor">Poor</SelectItem>
                </SelectContent>
              </Select>
              {!formData.condition && (
                <p className="text-sm text-red-600 mt-1">Vehicle condition is required</p>
              )}
            </div>
          </div>
        );

      case 'condition':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="tire_condition">Tire Condition</Label>
              <Select 
                value={formData.tire_condition || ''} 
                onValueChange={(value) => updateFormData({ tire_condition: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select tire condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excellent">Excellent</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="fair">Fair</SelectItem>
                  <SelectItem value="poor">Poor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Dashboard Warning Lights</Label>
              {['Check Engine', 'Oil Pressure', 'Battery', 'Brake', 'ABS', 'Airbag'].map((light) => (
                <div key={light} className="flex items-center space-x-2">
                  <Checkbox 
                    id={light}
                    checked={formData.dashboard_lights?.includes(light) || false}
                    onCheckedChange={(checked) => {
                      const lights = formData.dashboard_lights || [];
                      const updated = checked === true 
                        ? [...lights, light]
                        : lights.filter(l => l !== light);
                      updateFormData({ dashboard_lights: updated });
                    }}
                  />
                  <Label htmlFor={light}>{light}</Label>
                </div>
              ))}
            </div>
          </div>
        );

      case 'history':
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="accidents"
                checked={formData.accidents?.hadAccident || false}
                onCheckedChange={(checked) => updateFormData({ 
                  accidents: { 
                    hadAccident: checked === true,
                    count: checked === true ? (formData.accidents?.count || 1) : 0,
                    severity: formData.accidents?.severity || 'minor',
                    repaired: formData.accidents?.repaired || false,
                    frameDamage: formData.accidents?.frameDamage || false
                  }
                })}
              />
              <Label htmlFor="accidents">Vehicle has been in an accident</Label>
            </div>

            {formData.accidents?.hadAccident && (
              <div className="space-y-3 ml-6">
                <div>
                  <Label htmlFor="accident-severity">Accident Severity</Label>
                  <Select 
                    value={formData.accidents?.severity || 'minor'} 
                    onValueChange={(value: 'minor' | 'moderate' | 'major') => updateFormData({ 
                      accidents: { 
                        ...formData.accidents, 
                        severity: value,
                        hadAccident: formData.accidents?.hadAccident || false,
                        count: formData.accidents?.count || 1,
                        repaired: formData.accidents?.repaired || false,
                        frameDamage: formData.accidents?.frameDamage || false
                      }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="minor">Minor</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="major">Major</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="frame-damage"
                    checked={formData.accidents?.frameDamage || false}
                    onCheckedChange={(checked) => updateFormData({ 
                      accidents: { 
                        ...formData.accidents, 
                        frameDamage: checked === true,
                        hadAccident: formData.accidents?.hadAccident || false,
                        count: formData.accidents?.count || 1,
                        severity: formData.accidents?.severity || 'minor',
                        repaired: formData.accidents?.repaired || false
                      }
                    })}
                  />
                  <Label htmlFor="frame-damage">Frame damage</Label>
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="serviceHistory">Service History</Label>
              <Textarea
                id="serviceHistory"
                value={formData.serviceHistory?.description || ''}
                onChange={(e) => updateFormData({ 
                  serviceHistory: {
                    ...formData.serviceHistory,
                    description: e.target.value,
                    hasRecords: Boolean(e.target.value),
                    frequency: formData.serviceHistory?.frequency || 'unknown',
                    dealerMaintained: formData.serviceHistory?.dealerMaintained || false,
                    services: formData.serviceHistory?.services || []
                  }
                })}
                placeholder="Describe maintenance and service history..."
              />
            </div>
          </div>
        );

      case 'features':
        return (
          <div className="space-y-4">
            <div>
              <Label>Additional Features</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {['Leather Seats', 'Sunroof', 'Navigation', 'Heated Seats', 'Premium Audio', 'Backup Camera'].map((feature) => (
                  <div key={feature} className="flex items-center space-x-2">
                    <Checkbox 
                      id={feature}
                      checked={formData.features?.includes(feature) || false}
                      onCheckedChange={(checked) => {
                        const features = formData.features || [];
                        const updated = checked === true 
                          ? [...features, feature]
                          : features.filter(f => f !== feature);
                        updateFormData({ features: updated });
                      }}
                    />
                    <Label htmlFor={feature}>{feature}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="additional_notes">Additional Notes</Label>
              <Textarea
                id="additional_notes"
                value={formData.additional_notes || ''}
                onChange={(e) => updateFormData({ additional_notes: e.target.value })}
                placeholder="Any additional information about the vehicle..."
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}
          {tier === "premium" && <span className="ml-2 text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">Premium</span>}
        </CardTitle>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {renderStep()}
        
        <div className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            Previous
          </Button>
          
          {currentStep === steps.length - 1 ? (
            <Button 
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? "Submitting..." : "Complete Valuation"}
            </Button>
          ) : (
            <Button onClick={handleNext}>
              Next
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
