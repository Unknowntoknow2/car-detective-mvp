
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { 
  FollowUpAnswers, 
  CONDITION_OPTIONS, 
  SERVICE_HISTORY_OPTIONS,
  TITLE_STATUS_OPTIONS,
  TIRE_CONDITION_OPTIONS,
  PREVIOUS_USE_OPTIONS,
  DASHBOARD_LIGHTS,
  MODIFICATION_TYPES
} from '@/types/follow-up-answers';
import { saveFollowUpAnswers, loadFollowUpAnswers } from '@/services/followUpService';

interface UnifiedFollowUpFormProps {
  vin: string;
  onComplete: (answers: FollowUpAnswers) => void;
}

export function UnifiedFollowUpForm({ vin, onComplete }: UnifiedFollowUpFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FollowUpAnswers>({
    vin,
    mileage: undefined,
    zip_code: '',
    condition: undefined,
    accidents: {
      hadAccident: false,
      count: undefined,
      severity: undefined,
      repaired: undefined,
      frameDamage: undefined,
      description: ''
    },
    service_history: undefined,
    maintenance_status: undefined,
    last_service_date: undefined,
    title_status: undefined,
    previous_owners: undefined,
    previous_use: undefined,
    tire_condition: undefined,
    dashboard_lights: [],
    frame_damage: undefined,
    modifications: {
      modified: false,
      types: [],
      reversible: undefined
    },
    completion_percentage: 0,
    is_complete: false
  });

  // Load existing answers on component mount
  useEffect(() => {
    const loadExistingAnswers = async () => {
      try {
        const existingAnswers = await loadFollowUpAnswers(vin);
        if (existingAnswers) {
          setFormData(existingAnswers);
        }
      } catch (error) {
        console.error('Failed to load existing answers:', error);
      }
    };

    if (vin) {
      loadExistingAnswers();
    }
  }, [vin]);

  const updateFormData = (updates: Partial<FollowUpAnswers>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const updateAccidents = (updates: Partial<typeof formData.accidents>) => {
    setFormData(prev => ({
      ...prev,
      accidents: {
        hadAccident: false,
        ...prev.accidents,
        ...updates
      }
    }));
  };

  const updateModifications = (updates: Partial<typeof formData.modifications>) => {
    setFormData(prev => ({
      ...prev,
      modifications: {
        modified: false,
        ...prev.modifications,
        ...updates
      }
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const completionPercentage = calculateCompletionPercentage();
      const finalData = {
        ...formData,
        completion_percentage: completionPercentage,
        is_complete: completionPercentage >= 80
      };

      await saveFollowUpAnswers(finalData);
      toast.success('Follow-up answers saved successfully!');
      onComplete(finalData);
    } catch (error) {
      console.error('Failed to save follow-up answers:', error);
      toast.error('Failed to save answers. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateCompletionPercentage = (): number => {
    const requiredFields = ['mileage', 'zip_code', 'condition', 'title_status'];
    const completedFields = requiredFields.filter(field => {
      const value = formData[field as keyof FollowUpAnswers];
      return value !== undefined && value !== '' && value !== null;
    });
    return Math.round((completedFields.length / requiredFields.length) * 100);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Vehicle Follow-up Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" className="w-full">
            {/* Basic Information */}
            <AccordionItem value="basic">
              <AccordionTrigger>Basic Information</AccordionTrigger>
              <AccordionContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="mileage">Current Mileage</Label>
                    <Input
                      id="mileage"
                      type="number"
                      value={formData.mileage || ''}
                      onChange={(e) => updateFormData({ mileage: parseInt(e.target.value) || undefined })}
                      placeholder="Enter current mileage"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip_code">ZIP Code</Label>
                    <Input
                      id="zip_code"
                      value={formData.zip_code || ''}
                      onChange={(e) => updateFormData({ zip_code: e.target.value })}
                      placeholder="Enter ZIP code"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Overall Condition</Label>
                  <Select value={formData.condition || ''} onValueChange={(value) => updateFormData({ condition: value as any })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      {CONDITION_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label} - {option.description}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Accident History */}
            <AccordionItem value="accidents">
              <AccordionTrigger>Accident History</AccordionTrigger>
              <AccordionContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Has this vehicle been in any accidents?</Label>
                  <RadioGroup
                    value={formData.accidents?.hadAccident ? 'yes' : 'no'}
                    onValueChange={(value) => updateAccidents({ hadAccident: value === 'yes' })}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="no-accident" />
                      <Label htmlFor="no-accident">No</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="yes-accident" />
                      <Label htmlFor="yes-accident">Yes</Label>
                    </div>
                  </RadioGroup>
                </div>

                {formData.accidents?.hadAccident && (
                  <div className="space-y-4 pl-4 border-l-2 border-gray-200">
                    <div className="space-y-2">
                      <Label htmlFor="accident-count">Number of Accidents</Label>
                      <Input
                        id="accident-count"
                        type="number"
                        value={formData.accidents?.count || ''}
                        onChange={(e) => updateAccidents({ count: parseInt(e.target.value) || undefined })}
                        placeholder="Number of accidents"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Severity of Most Recent Accident</Label>
                      <Select 
                        value={formData.accidents?.severity || ''} 
                        onValueChange={(value) => updateAccidents({ severity: value as any })}
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

                    <div className="space-y-2">
                      <Label>Was the damage properly repaired?</Label>
                      <RadioGroup
                        value={formData.accidents?.repaired !== undefined ? (formData.accidents.repaired ? 'yes' : 'no') : ''}
                        onValueChange={(value) => updateAccidents({ repaired: value === 'yes' })}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="repaired-yes" />
                          <Label htmlFor="repaired-yes">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="repaired-no" />
                          <Label htmlFor="repaired-no">No</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>

            {/* Service History */}
            <AccordionItem value="service">
              <AccordionTrigger>Service & Maintenance</AccordionTrigger>
              <AccordionContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Service History</Label>
                  <Select value={formData.service_history || ''} onValueChange={(value) => updateFormData({ service_history: value })}>
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

                <div className="space-y-2">
                  <Label>Tire Condition</Label>
                  <Select value={formData.tire_condition || ''} onValueChange={(value) => updateFormData({ tire_condition: value })}>
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
              </AccordionContent>
            </AccordionItem>

            {/* Title & Ownership */}
            <AccordionItem value="title">
              <AccordionTrigger>Title & Ownership</AccordionTrigger>
              <AccordionContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Title Status</Label>
                  <Select value={formData.title_status || ''} onValueChange={(value) => updateFormData({ title_status: value })}>
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

                <div className="space-y-2">
                  <Label>Previous Use</Label>
                  <Select value={formData.previous_use || ''} onValueChange={(value) => updateFormData({ previous_use: value })}>
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
              </AccordionContent>
            </AccordionItem>

            {/* Modifications */}
            <AccordionItem value="modifications">
              <AccordionTrigger>Modifications</AccordionTrigger>
              <AccordionContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Has this vehicle been modified?</Label>
                  <RadioGroup
                    value={formData.modifications?.modified ? 'yes' : 'no'}
                    onValueChange={(value) => updateModifications({ modified: value === 'yes' })}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="no-modifications" />
                      <Label htmlFor="no-modifications">No</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="yes-modifications" />
                      <Label htmlFor="yes-modifications">Yes</Label>
                    </div>
                  </RadioGroup>
                </div>

                {formData.modifications?.modified && (
                  <div className="space-y-4 pl-4 border-l-2 border-gray-200">
                    <div className="space-y-2">
                      <Label>Types of Modifications</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {MODIFICATION_TYPES.map((type) => (
                          <div key={type} className="flex items-center space-x-2">
                            <Checkbox
                              id={type}
                              checked={formData.modifications?.types?.includes(type) || false}
                              onCheckedChange={(checked) => {
                                const currentTypes = formData.modifications?.types || [];
                                const newTypes = checked
                                  ? [...currentTypes, type]
                                  : currentTypes.filter(t => t !== type);
                                updateModifications({ types: newTypes });
                              }}
                            />
                            <Label htmlFor={type} className="text-sm">{type}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="flex justify-between items-center mt-6 pt-4 border-t">
            <div className="text-sm text-gray-600">
              Completion: {calculateCompletionPercentage()}%
            </div>
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Complete Follow-up'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
