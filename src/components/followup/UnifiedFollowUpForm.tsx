
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, MapPin, Wrench, Shield, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { ConditionSelector } from '@/components/valuation/enhanced-followup/ConditionSelector';
import { AccidentSection } from '@/components/valuation/enhanced-followup/AccidentSection';
import { DashboardLightsSection } from '@/components/valuation/enhanced-followup/DashboardLightsSection';
import { useFollowUpAnswers } from '@/components/valuation/enhanced-followup/hooks/useFollowUpAnswers';
import { FollowUpAnswers, AccidentDetails, ModificationDetails, CONDITION_OPTIONS } from '@/types/follow-up-answers';
import { ManualEntryFormData } from '@/components/lookup/types/manualEntry';

interface UnifiedFollowUpFormProps {
  vin?: string;
  plateNumber?: string;
  initialData?: ManualEntryFormData;
  entryMethod: 'vin' | 'plate' | 'manual';
  onComplete?: () => void;
}

export const UnifiedFollowUpForm: React.FC<UnifiedFollowUpFormProps> = ({
  vin,
  plateNumber,
  initialData,
  entryMethod,
  onComplete,
}) => {
  const [answers, setAnswers] = useState<Partial<FollowUpAnswers>>({});
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form data based on entry method
  useEffect(() => {
    const baseAnswers: Partial<FollowUpAnswers> = {};
    
    if (entryMethod === 'vin' && vin) {
      baseAnswers.vin = vin;
    } else if (entryMethod === 'manual' && initialData) {
      baseAnswers.vin = initialData.vin || '';
      baseAnswers.mileage = initialData.mileage;
      baseAnswers.zip_code = String(initialData.zipCode || '');
      baseAnswers.condition = initialData.condition as 'excellent' | 'good' | 'fair' | 'poor';
    }
    
    setAnswers(baseAnswers);
  }, [vin, plateNumber, initialData, entryMethod]);

  // Calculate completion percentage
  useEffect(() => {
    const totalFields = 8; // Adjust based on required fields
    const completedFields = Object.keys(answers).filter(key => {
      const value = answers[key as keyof FollowUpAnswers];
      return value !== undefined && value !== null && value !== '';
    }).length;
    
    setCompletionPercentage(Math.round((completedFields / totalFields) * 100));
  }, [answers]);

  const updateAnswer = (key: keyof FollowUpAnswers, value: any) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Assessment completed successfully!');
      console.log('Submitted answers:', answers);
      
      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error('Error submitting answers:', error);
      toast.error('Failed to submit assessment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Vehicle Assessment
            </CardTitle>
            <Badge variant="outline">
              {completionPercentage}% Complete
            </Badge>
          </div>
          <Progress value={completionPercentage} className="w-full" />
        </CardHeader>
      </Card>

      {/* Follow-up Sections */}
      <Accordion type="multiple">
        {/* Basic Information */}
        <AccordionItem value="basic-info">
          <AccordionTrigger className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Basic Information
          </AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="mileage">Current Mileage</Label>
                    <Input
                      id="mileage"
                      type="number"
                      value={answers.mileage || ''}
                      onChange={(e) => updateAnswer('mileage', parseInt(e.target.value) || 0)}
                      placeholder="Enter current mileage"
                    />
                  </div>
                  <div>
                    <Label htmlFor="zip_code">ZIP Code</Label>
                    <Input
                      id="zip_code"
                      value={answers.zip_code || ''}
                      onChange={(e) => updateAnswer('zip_code', e.target.value)}
                      placeholder="Enter ZIP code"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* Vehicle Condition */}
        <AccordionItem value="condition">
          <AccordionTrigger className="flex items-center gap-2">
            <Wrench className="h-4 w-4" />
            Vehicle Condition
          </AccordionTrigger>
          <AccordionContent>
            <ConditionSelector
              value={answers.condition}
              onChange={(value) => updateAnswer('condition', value)}
            />
          </AccordionContent>
        </AccordionItem>

        {/* Accident History */}
        <AccordionItem value="accidents">
          <AccordionTrigger className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Accident History
          </AccordionTrigger>
          <AccordionContent>
            <AccidentSection
              value={answers.accidents}
              onChange={(value) => updateAnswer('accidents', value)}
            />
          </AccordionContent>
        </AccordionItem>

        {/* Service History */}
        <AccordionItem value="service">
          <AccordionTrigger className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Service History
          </AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <Label htmlFor="service_history">Service History</Label>
                  <Input
                    id="service_history"
                    value={answers.service_history || ''}
                    onChange={(e) => updateAnswer('service_history', e.target.value)}
                    placeholder="Describe service history"
                  />
                </div>
                <div>
                  <Label htmlFor="last_service_date">Last Service Date</Label>
                  <Input
                    id="last_service_date"
                    type="date"
                    value={answers.last_service_date || ''}
                    onChange={(e) => updateAnswer('last_service_date', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* Dashboard Lights */}
        <AccordionItem value="dashboard">
          <AccordionTrigger className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Dashboard Warning Lights
          </AccordionTrigger>
          <AccordionContent>
            <DashboardLightsSection
              value={answers.dashboard_lights || []}
              onChange={(lights) => updateAnswer('dashboard_lights', lights)}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Submit Button */}
      <Card>
        <CardContent className="pt-6">
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting || completionPercentage < 60}
            className="w-full"
            size="lg"
          >
            {isSubmitting ? 'Processing...' : 'Complete Assessment'}
          </Button>
          {completionPercentage < 60 && (
            <p className="text-sm text-muted-foreground mt-2 text-center">
              Please complete at least 60% of the assessment to continue
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
