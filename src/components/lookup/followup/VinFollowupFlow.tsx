
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFollowUpAnswers } from '@/components/valuation/enhanced-followup/hooks/useFollowUpAnswers';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AccidentSection } from '@/components/valuation/enhanced-followup/AccidentSection';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';

interface VinFollowupFlowProps {
  vin?: string;
}

export function VinFollowupFlow({ vin }: VinFollowupFlowProps) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  
  // Get VIN from localStorage if not provided
  const currentVin = vin || localStorage.getItem('current_vin') || '';
  
  const { answers, loading, saving, updateAnswers, saveAnswers } = useFollowUpAnswers(currentVin);

  const steps = [
    { id: 'mileage', title: 'Vehicle Mileage', component: 'MileageStep' },
    { id: 'condition', title: 'Vehicle Condition', component: 'ConditionStep' },
    { id: 'accidents', title: 'Accident History', component: 'AccidentStep' },
    { id: 'maintenance', title: 'Maintenance History', component: 'MaintenanceStep' },
    { id: 'title', title: 'Title Status', component: 'TitleStep' },
    { id: 'usage', title: 'Previous Usage', component: 'UsageStep' },
    { id: 'review', title: 'Review & Submit', component: 'ReviewStep' }
  ];

  const progress = ((completedSteps.size / steps.length) * 100);

  useEffect(() => {
    // Mark steps as completed based on answers
    const completed = new Set<number>();
    if (answers.mileage) completed.add(0);
    if (answers.condition) completed.add(1);
    if (answers.accidents?.hadAccident !== undefined) completed.add(2);
    if (answers.service_history) completed.add(3);
    if (answers.title_status) completed.add(4);
    if (answers.previous_use) completed.add(5);
    
    setCompletedSteps(completed);
  }, [answers]);

  const handleMileageChange = (value: string) => {
    const mileage = parseInt(value) || 0;
    updateAnswers({ mileage });
    if (mileage > 0) {
      setCompletedSteps(prev => new Set([...prev, 0]));
    }
  };

  const handleConditionChange = (value: string) => {
    updateAnswers({ condition: value });
    if (value) {
      setCompletedSteps(prev => new Set([...prev, 1]));
    }
  };

  const handleAccidentChange = (value: any) => {
    updateAnswers({ accidents: value });
    setCompletedSteps(prev => new Set([...prev, 2]));
  };

  const handleMaintenanceChange = (value: string) => {
    updateAnswers({ service_history: value });
    if (value) {
      setCompletedSteps(prev => new Set([...prev, 3]));
    }
  };

  const handleTitleChange = (value: string) => {
    updateAnswers({ title_status: value });
    if (value) {
      setCompletedSteps(prev => new Set([...prev, 4]));
    }
  };

  const handleUsageChange = (value: string) => {
    updateAnswers({ previous_use: value });
    if (value) {
      setCompletedSteps(prev => new Set([...prev, 5]));
    }
  };

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
    const success = await saveAnswers();
    if (success) {
      // Navigate to valuation results
      navigate(`/valuation-result?vin=${currentVin}`);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Mileage
        return (
          <div className="space-y-4">
            <Label htmlFor="mileage">Current Mileage</Label>
            <Input
              id="mileage"
              type="number"
              placeholder="Enter current mileage"
              value={answers.mileage || ''}
              onChange={(e) => handleMileageChange(e.target.value)}
            />
          </div>
        );

      case 1: // Condition
        return (
          <div className="space-y-4">
            <Label>Overall Vehicle Condition</Label>
            <RadioGroup
              value={answers.condition || ''}
              onValueChange={handleConditionChange}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="excellent" id="excellent" />
                <Label htmlFor="excellent">Excellent</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="good" id="good" />
                <Label htmlFor="good">Good</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="fair" id="fair" />
                <Label htmlFor="fair">Fair</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="poor" id="poor" />
                <Label htmlFor="poor">Poor</Label>
              </div>
            </RadioGroup>
          </div>
        );

      case 2: // Accidents
        return (
          <AccidentSection
            value={answers.accidents}
            onChange={handleAccidentChange}
          />
        );

      case 3: // Maintenance
        return (
          <div className="space-y-4">
            <Label htmlFor="maintenance">Service History</Label>
            <Textarea
              id="maintenance"
              placeholder="Describe the vehicle's maintenance history..."
              value={answers.service_history || ''}
              onChange={(e) => handleMaintenanceChange(e.target.value)}
            />
          </div>
        );

      case 4: // Title
        return (
          <div className="space-y-4">
            <Label>Title Status</Label>
            <Select
              value={answers.title_status || ''}
              onValueChange={handleTitleChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select title status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="clean">Clean Title</SelectItem>
                <SelectItem value="salvage">Salvage Title</SelectItem>
                <SelectItem value="rebuilt">Rebuilt Title</SelectItem>
                <SelectItem value="flood">Flood Title</SelectItem>
                <SelectItem value="lemon">Lemon Title</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );

      case 5: // Usage
        return (
          <div className="space-y-4">
            <Label>Previous Use</Label>
            <Select
              value={answers.previous_use || ''}
              onValueChange={handleUsageChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select previous use" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="personal">Personal Use</SelectItem>
                <SelectItem value="commercial">Commercial Use</SelectItem>
                <SelectItem value="rental">Rental Vehicle</SelectItem>
                <SelectItem value="fleet">Fleet Vehicle</SelectItem>
                <SelectItem value="taxi">Taxi/Rideshare</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );

      case 6: // Review
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Review Your Answers</h3>
            <div className="space-y-2">
              <p><strong>Mileage:</strong> {answers.mileage || 'Not provided'}</p>
              <p><strong>Condition:</strong> {answers.condition || 'Not provided'}</p>
              <p><strong>Accidents:</strong> {answers.accidents?.hadAccident ? 'Yes' : 'No'}</p>
              <p><strong>Service History:</strong> {answers.service_history ? 'Provided' : 'Not provided'}</p>
              <p><strong>Title Status:</strong> {answers.title_status || 'Not provided'}</p>
              <p><strong>Previous Use:</strong> {answers.previous_use || 'Not provided'}</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Vehicle Assessment</span>
            <span className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {steps.length}
            </span>
          </CardTitle>
          <Progress value={progress} className="w-full" />
        </CardHeader>
      </Card>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {completedSteps.has(currentStep) && (
              <CheckCircle className="h-5 w-5 text-green-500" />
            )}
            {steps[currentStep].title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {renderStepContent()}

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            {currentStep === steps.length - 1 ? (
              <Button onClick={handleSubmit} disabled={saving}>
                {saving ? 'Submitting...' : 'Complete Assessment'}
              </Button>
            ) : (
              <Button onClick={handleNext}>
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
