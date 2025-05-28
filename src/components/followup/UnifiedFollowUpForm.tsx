
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { toast } from 'sonner';
import { ConditionSelector } from '@/components/valuation/enhanced-followup/ConditionSelector';
import { AccidentSection } from '@/components/valuation/enhanced-followup/AccidentSection';
import { DashboardLightsSection } from '@/components/valuation/enhanced-followup/DashboardLightsSection';
import { useFollowUpAnswers } from '@/components/valuation/enhanced-followup/hooks/useFollowUpAnswers';
import { 
  FollowUpAnswers, 
  AccidentDetails, 
  ModificationDetails,
  SERVICE_HISTORY_OPTIONS,
  TITLE_STATUS_OPTIONS,
  PREVIOUS_USE_OPTIONS
} from '@/types/follow-up-answers';
import { ManualEntryFormData } from '@/components/lookup/types/manualEntry';

export interface UnifiedFollowUpFormProps {
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
  onComplete
}) => {
  // Determine the primary identifier for the follow-up
  const primaryId = vin || plateNumber || 'manual-entry';
  
  // Use the follow-up answers hook
  const { answers, loading, saving, updateAnswers, saveAnswers } = useFollowUpAnswers(primaryId);
  
  // Local form state
  const [formData, setFormData] = useState<FollowUpAnswers>({
    ...answers,
    // Initialize from manual entry data if provided
    mileage: initialData?.mileage ? Number(initialData.mileage) : answers.mileage,
    zip_code: initialData?.zipCode || answers.zip_code,
    condition: answers.condition || 'good',
    vin: vin || answers.vin || primaryId,
  });

  // Update form data when answers change
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      ...answers,
      // Preserve manual entry data if it exists
      mileage: initialData?.mileage ? Number(initialData.mileage) : answers.mileage,
      zip_code: initialData?.zipCode || answers.zip_code,
    }));
  }, [answers, initialData]);

  const handleSubmit = async () => {
    try {
      // Convert string values to appropriate types
      const dataToSave: FollowUpAnswers = {
        ...formData,
        mileage: typeof formData.mileage === 'string' ? Number(formData.mileage) : formData.mileage,
        previous_owners: typeof formData.previous_owners === 'string' ? Number(formData.previous_owners) : formData.previous_owners,
        completion_percentage: 100,
        is_complete: true
      };

      const success = await saveAnswers(dataToSave);
      
      if (success) {
        toast.success('Follow-up completed successfully!');
        onComplete?.();
      }
    } catch (error) {
      console.error('Error submitting follow-up:', error);
      toast.error('Failed to submit follow-up. Please try again.');
    }
  };

  const updateField = (field: keyof FollowUpAnswers, value: any) => {
    const updatedData = { ...formData, [field]: value };
    setFormData(updatedData);
    updateAnswers({ [field]: value });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading vehicle details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Complete Your Vehicle Assessment</CardTitle>
          <p className="text-muted-foreground">
            Provide additional details to get the most accurate valuation for your vehicle.
          </p>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" defaultValue={["basic-info", "condition"]} className="space-y-4">
            
            {/* Basic Vehicle Information */}
            <AccordionItem value="basic-info">
              <AccordionTrigger>Basic Vehicle Information</AccordionTrigger>
              <AccordionContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="mileage">Current Mileage</Label>
                    <Input
                      id="mileage"
                      type="number"
                      value={formData.mileage || ''}
                      onChange={(e) => updateField('mileage', e.target.value)}
                      placeholder="e.g. 45000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="zip_code">ZIP Code</Label>
                    <Input
                      id="zip_code"
                      value={formData.zip_code || ''}
                      onChange={(e) => updateField('zip_code', e.target.value)}
                      placeholder="e.g. 90210"
                      maxLength={5}
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Vehicle Condition */}
            <AccordionItem value="condition">
              <AccordionTrigger>Vehicle Condition</AccordionTrigger>
              <AccordionContent>
                <ConditionSelector
                  value={formData.condition}
                  onChange={(value) => updateField('condition', value)}
                  readonly={false}
                />
              </AccordionContent>
            </AccordionItem>

            {/* Accident History */}
            <AccordionItem value="accidents">
              <AccordionTrigger>Accident History</AccordionTrigger>
              <AccordionContent>
                <AccidentSection
                  value={formData.accidents}
                  onChange={(value) => updateField('accidents', value)}
                />
              </AccordionContent>
            </AccordionItem>

            {/* Service History & Title */}
            <AccordionItem value="service-title">
              <AccordionTrigger>Service History & Title Status</AccordionTrigger>
              <AccordionContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="service_history">Service History</Label>
                    <Select
                      value={formData.service_history || ''}
                      onValueChange={(value) => updateField('service_history', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select service history" />
                      </SelectTrigger>
                      <SelectContent>
                        {SERVICE_HISTORY_OPTIONS.map((option: any) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="title_status">Title Status</Label>
                    <Select
                      value={formData.title_status || ''}
                      onValueChange={(value) => updateField('title_status', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select title status" />
                      </SelectTrigger>
                      <SelectContent>
                        {TITLE_STATUS_OPTIONS.map((option: any) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="previous_owners">Number of Previous Owners</Label>
                    <Input
                      id="previous_owners"
                      type="number"
                      min="0"
                      max="10"
                      value={formData.previous_owners || ''}
                      onChange={(e) => updateField('previous_owners', e.target.value)}
                      placeholder="e.g. 2"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="previous_use">Previous Use</Label>
                    <Select
                      value={formData.previous_use || ''}
                      onValueChange={(value) => updateField('previous_use', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select previous use" />
                      </SelectTrigger>
                      <SelectContent>
                        {PREVIOUS_USE_OPTIONS.map((option: any) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Dashboard Warning Lights */}
            <AccordionItem value="dashboard-lights">
              <AccordionTrigger>Dashboard Warning Lights</AccordionTrigger>
              <AccordionContent>
                <DashboardLightsSection
                  value={formData.dashboard_lights}
                  onChange={(value) => updateField('dashboard_lights', value)}
                  readonly={false}
                />
              </AccordionContent>
            </AccordionItem>

          </Accordion>

          <div className="mt-8 flex justify-end">
            <Button 
              onClick={handleSubmit}
              disabled={saving}
              className="px-8"
            >
              {saving ? 'Saving...' : 'Complete Assessment'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UnifiedFollowUpForm;
