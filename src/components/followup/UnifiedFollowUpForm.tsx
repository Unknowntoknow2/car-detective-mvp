
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Info, Car, AlertTriangle, Wrench, FileText, Settings, Star, ChevronDown, ChevronUp } from 'lucide-react';
import { FollowUpAnswers, CONDITION_OPTIONS, SERVICE_HISTORY_OPTIONS, TITLE_STATUS_OPTIONS, TIRE_CONDITION_OPTIONS, PREVIOUS_USE_OPTIONS, DASHBOARD_LIGHTS, MODIFICATION_TYPES } from '@/types/follow-up-answers';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface UnifiedFollowUpFormProps {
  vin: string;
  valuationId?: string;
  onComplete: (answers: FollowUpAnswers) => void;
  onSkip?: () => void;
}

export function UnifiedFollowUpForm({ vin, valuationId, onComplete, onSkip }: UnifiedFollowUpFormProps) {
  const [formData, setFormData] = useState<FollowUpAnswers>({
    vin,
    valuation_id: valuationId,
    mileage: undefined,
    zip_code: '',
    exterior_condition: undefined,
    interior_condition: undefined,
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
    features: [],
    completion_percentage: 0,
    is_complete: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set());

  // Calculate completion percentage
  useEffect(() => {
    const totalSections = 7; // Basic Info, Exterior, Interior, Accidents, Service, Title/Ownership, Modifications
    const completion = Math.round((completedSections.size / totalSections) * 100);
    setFormData(prev => ({ ...prev, completion_percentage: completion }));
  }, [completedSections]);

  // Check section completion
  const checkSectionCompletion = (sectionId: string, isComplete: boolean) => {
    setCompletedSections(prev => {
      const updated = new Set(prev);
      if (isComplete) {
        updated.add(sectionId);
      } else {
        updated.delete(sectionId);
      }
      return updated;
    });
  };

  // Condition selection handlers
  const handleExteriorConditionChange = (condition: 'excellent' | 'good' | 'fair' | 'poor') => {
    setFormData(prev => ({ ...prev, exterior_condition: condition }));
    checkSectionCompletion('exterior', !!condition);
  };

  const handleInteriorConditionChange = (condition: 'excellent' | 'good' | 'fair' | 'poor') => {
    setFormData(prev => ({ ...prev, interior_condition: condition }));
    checkSectionCompletion('interior', !!condition);
  };

  // Enhanced accident handlers
  const handleAccidentChange = (hasAccident: boolean) => {
    setFormData(prev => ({
      ...prev,
      accidents: {
        ...prev.accidents,
        hadAccident: hasAccident,
        // Reset other fields if no accident
        ...(hasAccident ? {} : {
          count: undefined,
          severity: undefined,
          repaired: undefined,
          frameDamage: undefined,
          description: ''
        })
      }
    }));
  };

  const handleAccidentDetailsChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      accidents: {
        ...prev.accidents,
        [field]: value
      }
    }));
  };

  // Modifications handlers
  const handleModificationChange = (modified: boolean) => {
    setFormData(prev => ({
      ...prev,
      modifications: {
        ...prev.modifications,
        modified,
        ...(modified ? {} : { types: [], reversible: undefined })
      }
    }));
  };

  const handleModificationTypeToggle = (type: string) => {
    setFormData(prev => ({
      ...prev,
      modifications: {
        ...prev.modifications,
        types: prev.modifications?.types?.includes(type)
          ? prev.modifications.types.filter(t => t !== type)
          : [...(prev.modifications?.types || []), type]
      }
    }));
  };

  // Features handlers
  const handleFeatureToggle = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features?.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...(prev.features || []), feature]
    }));
  };

  // Dashboard lights handler
  const handleDashboardLightToggle = (light: string) => {
    setFormData(prev => ({
      ...prev,
      dashboard_lights: prev.dashboard_lights?.includes(light)
        ? prev.dashboard_lights.filter(l => l !== light)
        : [...(prev.dashboard_lights || []), light]
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const submissionData = {
        ...formData,
        is_complete: true,
        completion_percentage: 100,
        updated_at: new Date().toISOString()
      };

      if (formData.id) {
        const { error } = await supabase
          .from('follow_up_answers')
          .update(submissionData)
          .eq('id', formData.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('follow_up_answers')
          .insert([submissionData]);
        if (error) throw error;
      }

      toast.success('Vehicle details saved successfully!');
      onComplete(submissionData);
    } catch (error) {
      console.error('Error saving follow-up answers:', error);
      toast.error('Failed to save vehicle details. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderConditionOption = (condition: any, isSelected: boolean, onClick: () => void) => (
    <button
      type="button"
      onClick={onClick}
      className={`p-4 rounded-lg border-2 transition-all text-left ${
        isSelected 
          ? 'border-blue-500 bg-blue-50' 
          : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      <div className="font-medium">{condition.label}</div>
      <div className="text-sm text-gray-600 mt-1">{condition.description}</div>
      <div className={`text-xs mt-2 font-medium ${
        condition.impact.includes('+') ? 'text-green-600' : 
        condition.impact.includes('-') ? 'text-red-600' : 'text-gray-600'
      }`}>
        {condition.impact}
      </div>
    </button>
  );

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Car className="h-5 w-5" />
          Vehicle Details Assessment
        </CardTitle>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Completion Progress</span>
            <span>{formData.completion_percentage}%</span>
          </div>
          <Progress value={formData.completion_percentage} className="h-2" />
        </div>
      </CardHeader>

      <CardContent>
        <Accordion type="multiple" defaultValue={["basic", "exterior", "interior"]} className="space-y-4">
          
          {/* Basic Information */}
          <AccordionItem value="basic">
            <AccordionTrigger className="text-lg font-medium">
              Basic Information
              {completedSections.has('basic') && <Badge variant="secondary" className="ml-2">Complete</Badge>}
            </AccordionTrigger>
            <AccordionContent className="space-y-6 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="mileage">Current Mileage</Label>
                  <Input
                    id="mileage"
                    type="number"
                    placeholder="Enter mileage"
                    value={formData.mileage || ''}
                    onChange={(e) => {
                      const mileage = parseInt(e.target.value);
                      setFormData(prev => ({ ...prev, mileage: isNaN(mileage) ? undefined : mileage }));
                      checkSectionCompletion('basic', !isNaN(mileage) && !!formData.zip_code);
                    }}
                  />
                </div>
                <div>
                  <Label htmlFor="zip_code">ZIP Code</Label>
                  <Input
                    id="zip_code"
                    placeholder="Enter ZIP code"
                    value={formData.zip_code || ''}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, zip_code: e.target.value }));
                      checkSectionCompletion('basic', !!e.target.value && !!formData.mileage);
                    }}
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Exterior Condition */}
          <AccordionItem value="exterior">
            <AccordionTrigger className="text-lg font-medium">
              Exterior Condition
              {completedSections.has('exterior') && <Badge variant="secondary" className="ml-2">Complete</Badge>}
            </AccordionTrigger>
            <AccordionContent className="space-y-6 pt-4">
              <p className="text-sm text-gray-600">
                Assess the exterior condition including paint, body panels, glass, wheels, and overall appearance.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {CONDITION_OPTIONS.map((condition) => 
                  renderConditionOption(
                    condition, 
                    formData.exterior_condition === condition.value,
                    () => handleExteriorConditionChange(condition.value as any)
                  )
                )}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Interior Condition */}
          <AccordionItem value="interior">
            <AccordionTrigger className="text-lg font-medium">
              Interior Condition
              {completedSections.has('interior') && <Badge variant="secondary" className="ml-2">Complete</Badge>}
            </AccordionTrigger>
            <AccordionContent className="space-y-6 pt-4">
              <p className="text-sm text-gray-600">
                Evaluate the interior including seats, dashboard, electronics, cleanliness, and wear.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {CONDITION_OPTIONS.map((condition) => 
                  renderConditionOption(
                    condition, 
                    formData.interior_condition === condition.value,
                    () => handleInteriorConditionChange(condition.value as any)
                  )
                )}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Enhanced Accident History */}
          <AccordionItem value="accidents">
            <AccordionTrigger className="text-lg font-medium">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Accident History
              {completedSections.has('accidents') && <Badge variant="secondary" className="ml-2">Complete</Badge>}
            </AccordionTrigger>
            <AccordionContent className="space-y-6 pt-4">
              <div>
                <Label className="text-base font-medium mb-4 block">Has this vehicle been in any accidents?</Label>
                <RadioGroup 
                  value={formData.accidents?.hadAccident ? 'yes' : 'no'}
                  onValueChange={(value) => handleAccidentChange(value === 'yes')}
                  className="flex gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="no-accident" />
                    <Label htmlFor="no-accident">No accidents</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="yes-accident" />
                    <Label htmlFor="yes-accident">Yes, has accident history</Label>
                  </div>
                </RadioGroup>
              </div>

              {formData.accidents?.hadAccident && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-6 border-t pt-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="accident-count">Number of Accidents</Label>
                      <Input
                        id="accident-count"
                        type="number"
                        min="1"
                        placeholder="Enter number"
                        value={formData.accidents?.count || ''}
                        onChange={(e) => handleAccidentDetailsChange('count', parseInt(e.target.value))}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="accident-severity">Severity of Damage</Label>
                      <Select 
                        value={formData.accidents?.severity || ''} 
                        onValueChange={(value) => handleAccidentDetailsChange('severity', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select severity" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="minor">Minor (cosmetic damage only)</SelectItem>
                          <SelectItem value="moderate">Moderate (required repairs)</SelectItem>
                          <SelectItem value="major">Major (structural damage)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label className="text-base font-medium mb-3 block">Was the damage professionally repaired?</Label>
                    <RadioGroup 
                      value={formData.accidents?.repaired ? 'yes' : 'no'}
                      onValueChange={(value) => handleAccidentDetailsChange('repaired', value === 'yes')}
                      className="flex gap-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="repaired-yes" />
                        <Label htmlFor="repaired-yes">Yes, professionally repaired</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="repaired-no" />
                        <Label htmlFor="repaired-no">No, not properly repaired</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label className="text-base font-medium mb-3 block">Any frame damage?</Label>
                    <RadioGroup 
                      value={formData.accidents?.frameDamage ? 'yes' : 'no'}
                      onValueChange={(value) => handleAccidentDetailsChange('frameDamage', value === 'yes')}
                      className="flex gap-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="frame-no" />
                        <Label htmlFor="frame-no">No frame damage</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="frame-yes" />
                        <Label htmlFor="frame-yes">Yes, frame damage reported</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label htmlFor="accident-description">Additional Accident Details</Label>
                    <Textarea
                      id="accident-description"
                      placeholder="Describe the accident location (front, rear, side), when it occurred, and any other relevant details..."
                      value={formData.accidents?.description || ''}
                      onChange={(e) => handleAccidentDetailsChange('description', e.target.value)}
                      rows={4}
                    />
                  </div>
                </motion.div>
              )}
            </AccordionContent>
          </AccordionItem>

          {/* Service & Maintenance */}
          <AccordionItem value="service">
            <AccordionTrigger className="text-lg font-medium">
              <Wrench className="h-4 w-4 mr-2" />
              Service & Maintenance
              {completedSections.has('service') && <Badge variant="secondary" className="ml-2">Complete</Badge>}
            </AccordionTrigger>
            <AccordionContent className="space-y-6 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="service-history">Service History</Label>
                  <Select 
                    value={formData.service_history || ''} 
                    onValueChange={(value) => {
                      setFormData(prev => ({ ...prev, service_history: value }));
                      checkSectionCompletion('service', !!value && !!formData.maintenance_status);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select service type" />
                    </SelectTrigger>
                    <SelectContent>
                      {SERVICE_HISTORY_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div>
                            <div>{option.label}</div>
                            <div className="text-xs text-gray-500">{option.impact}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="maintenance-status">Maintenance Status</Label>
                  <Select 
                    value={formData.maintenance_status || ''} 
                    onValueChange={(value) => {
                      setFormData(prev => ({ ...prev, maintenance_status: value }));
                      checkSectionCompletion('service', !!value && !!formData.service_history);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Up to date">Up to date</SelectItem>
                      <SelectItem value="Overdue">Overdue</SelectItem>
                      <SelectItem value="Unknown">Unknown</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="tire-condition">Tire Condition</Label>
                <Select 
                  value={formData.tire_condition || ''} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, tire_condition: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select tire condition" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIRE_CONDITION_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div>
                          <div>{option.label}</div>
                          <div className="text-xs text-gray-500">{option.impact}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-base font-medium mb-3 block">Dashboard Warning Lights</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {DASHBOARD_LIGHTS.map((light) => (
                    <div key={light.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={light.value}
                        checked={formData.dashboard_lights?.includes(light.value)}
                        onCheckedChange={() => handleDashboardLightToggle(light.value)}
                      />
                      <Label htmlFor={light.value} className="flex items-center gap-2 cursor-pointer">
                        <span>{light.icon}</span>
                        <span className="text-sm">{light.label}</span>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Title & Ownership */}
          <AccordionItem value="ownership">
            <AccordionTrigger className="text-lg font-medium">
              <FileText className="h-4 w-4 mr-2" />
              Title & Ownership
              {completedSections.has('ownership') && <Badge variant="secondary" className="ml-2">Complete</Badge>}
            </AccordionTrigger>
            <AccordionContent className="space-y-6 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="title-status">Title Status</Label>
                  <Select 
                    value={formData.title_status || ''} 
                    onValueChange={(value) => {
                      setFormData(prev => ({ ...prev, title_status: value }));
                      checkSectionCompletion('ownership', !!value && !!formData.previous_use);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select title status" />
                    </SelectTrigger>
                    <SelectContent>
                      {TITLE_STATUS_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div>
                            <div>{option.label}</div>
                            <div className="text-xs text-gray-500">{option.impact}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="previous-use">Previous Use</Label>
                  <Select 
                    value={formData.previous_use || ''} 
                    onValueChange={(value) => {
                      setFormData(prev => ({ ...prev, previous_use: value }));
                      checkSectionCompletion('ownership', !!value && !!formData.title_status);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select previous use" />
                    </SelectTrigger>
                    <SelectContent>
                      {PREVIOUS_USE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div>
                            <div>{option.label}</div>
                            <div className="text-xs text-gray-500">{option.impact}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="previous-owners">Number of Previous Owners</Label>
                <Input
                  id="previous-owners"
                  type="number"
                  min="0"
                  placeholder="Enter number of owners"
                  value={formData.previous_owners || ''}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    previous_owners: parseInt(e.target.value) || undefined 
                  }))}
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Modifications */}
          <AccordionItem value="modifications">
            <AccordionTrigger className="text-lg font-medium">
              <Settings className="h-4 w-4 mr-2" />
              Modifications
              {completedSections.has('modifications') && <Badge variant="secondary" className="ml-2">Complete</Badge>}
            </AccordionTrigger>
            <AccordionContent className="space-y-6 pt-4">
              <div>
                <Label className="text-base font-medium mb-4 block">Has this vehicle been modified?</Label>
                <RadioGroup 
                  value={formData.modifications?.modified ? 'yes' : 'no'}
                  onValueChange={(value) => {
                    const modified = value === 'yes';
                    handleModificationChange(modified);
                    checkSectionCompletion('modifications', true);
                  }}
                  className="flex gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="mod-no" />
                    <Label htmlFor="mod-no">No modifications</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="mod-yes" />
                    <Label htmlFor="mod-yes">Yes, has modifications</Label>
                  </div>
                </RadioGroup>
              </div>

              {formData.modifications?.modified && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-6 border-t pt-6"
                >
                  <div>
                    <Label className="text-base font-medium mb-3 block">Types of Modifications</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {MODIFICATION_TYPES.map((type) => (
                        <div key={type} className="flex items-center space-x-2">
                          <Checkbox
                            id={type}
                            checked={formData.modifications?.types?.includes(type)}
                            onCheckedChange={() => handleModificationTypeToggle(type)}
                          />
                          <Label htmlFor={type} className="cursor-pointer text-sm">{type}</Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-base font-medium mb-3 block">Are modifications reversible?</Label>
                    <RadioGroup 
                      value={formData.modifications?.reversible ? 'yes' : 'no'}
                      onValueChange={(value) => setFormData(prev => ({
                        ...prev,
                        modifications: {
                          ...prev.modifications,
                          reversible: value === 'yes'
                        }
                      }))}
                      className="flex gap-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="rev-yes" />
                        <Label htmlFor="rev-yes">Yes, reversible</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="rev-no" />
                        <Label htmlFor="rev-no">No, permanent</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </motion.div>
              )}
            </AccordionContent>
          </AccordionItem>

        </Accordion>

        <div className="flex justify-between mt-8 pt-6 border-t">
          {onSkip && (
            <Button variant="outline" onClick={onSkip}>
              Skip Assessment
            </Button>
          )}
          <div className="flex gap-3 ml-auto">
            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting || formData.completion_percentage < 50}
              className="px-8"
            >
              {isSubmitting ? 'Saving...' : 'Complete Assessment'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
