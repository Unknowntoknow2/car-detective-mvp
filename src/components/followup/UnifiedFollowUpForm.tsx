
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Car, 
  FileText, 
  Wrench, 
  CircleCheck,
  AlertTriangle,
  Settings,
  DollarSign,
  HelpCircle,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { 
  FollowUpAnswers, 
  AccidentDetails, 
  ModificationDetails,
  CONDITION_OPTIONS,
  SERVICE_HISTORY_OPTIONS,
  TITLE_STATUS_OPTIONS,
  TIRE_CONDITION_OPTIONS,
  PREVIOUS_USE_OPTIONS,
  DASHBOARD_LIGHTS,
  MODIFICATION_TYPES,
  MAINTENANCE_STATUS_OPTIONS
} from '@/types/follow-up-answers';
import { saveFollowUpAnswers, loadFollowUpAnswers } from '@/services/followUpService';

const followUpSchema = z.object({
  mileage: z.number().min(0).optional(),
  zip_code: z.string().optional(),
  condition: z.enum(['excellent', 'good', 'fair', 'poor']).optional(),
  accidents: z.object({
    hadAccident: z.boolean(),
    count: z.number().optional(),
    severity: z.enum(['minor', 'moderate', 'major']).optional(),
    repaired: z.boolean().optional(),
    frameDamage: z.boolean().optional(),
    description: z.string().optional(),
  }).optional(),
  service_history: z.string().optional(),
  maintenance_status: z.string().optional(),
  last_service_date: z.string().optional(),
  title_status: z.string().optional(),
  previous_owners: z.number().optional(),
  previous_use: z.string().optional(),
  tire_condition: z.string().optional(),
  dashboard_lights: z.array(z.string()).optional(),
  frame_damage: z.boolean().optional(),
  modifications: z.object({
    modified: z.boolean(),
    types: z.array(z.string()).optional(),
    reversible: z.boolean().optional(),
  }).optional(),
});

type FormData = z.infer<typeof followUpSchema>;

interface UnifiedFollowUpFormProps {
  vin: string;
  onComplete: (data: FollowUpAnswers) => void;
}

export function UnifiedFollowUpForm({ vin, onComplete }: UnifiedFollowUpFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingAnswers, setLoadingAnswers] = useState(true);
  const [progressValue, setProgressValue] = useState(0);

  const form = useForm<FormData>({
    resolver: zodResolver(followUpSchema),
    defaultValues: {
      accidents: { hadAccident: false },
      modifications: { modified: false },
      dashboard_lights: [],
    },
  });

  const watchedValues = form.watch();

  // Calculate completion percentage
  useEffect(() => {
    const totalFields = 15; // Total trackable fields
    let completedFields = 0;

    if (watchedValues.mileage) completedFields++;
    if (watchedValues.zip_code) completedFields++;
    if (watchedValues.condition) completedFields++;
    if (watchedValues.accidents?.hadAccident !== undefined) completedFields++;
    if (watchedValues.service_history) completedFields++;
    if (watchedValues.maintenance_status) completedFields++;
    if (watchedValues.title_status) completedFields++;
    if (watchedValues.previous_owners) completedFields++;
    if (watchedValues.previous_use) completedFields++;
    if (watchedValues.tire_condition) completedFields++;
    if (watchedValues.dashboard_lights && watchedValues.dashboard_lights.length > 0) completedFields++;
    if (watchedValues.frame_damage !== undefined) completedFields++;
    if (watchedValues.modifications?.modified !== undefined) completedFields++;
    if (watchedValues.last_service_date) completedFields++;

    const percentage = Math.round((completedFields / totalFields) * 100);
    setProgressValue(percentage);
  }, [watchedValues]);

  // Load existing answers
  useEffect(() => {
    const loadExistingAnswers = async () => {
      try {
        console.log('🔍 Loading existing follow-up answers for VIN:', vin);
        const existingAnswers = await loadFollowUpAnswers(vin);
        
        if (existingAnswers) {
          console.log('✅ Found existing answers, populating form:', existingAnswers);
          form.reset({
            mileage: existingAnswers.mileage,
            zip_code: existingAnswers.zip_code,
            condition: existingAnswers.condition,
            accidents: existingAnswers.accidents || { hadAccident: false },
            service_history: existingAnswers.service_history,
            maintenance_status: existingAnswers.maintenance_status,
            last_service_date: existingAnswers.last_service_date,
            title_status: existingAnswers.title_status,
            previous_owners: existingAnswers.previous_owners,
            previous_use: existingAnswers.previous_use,
            tire_condition: existingAnswers.tire_condition,
            dashboard_lights: existingAnswers.dashboard_lights || [],
            frame_damage: existingAnswers.frame_damage,
            modifications: existingAnswers.modifications || { modified: false },
          });
        }
      } catch (error) {
        console.error('❌ Error loading existing answers:', error);
      } finally {
        setLoadingAnswers(false);
      }
    };

    if (vin) {
      loadExistingAnswers();
    } else {
      setLoadingAnswers(false);
    }
  }, [vin, form]);

  const setAnswer = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    form.setValue(key, value);
  };

  const handleSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      console.log('💾 Submitting follow-up form:', data);

      const followUpAnswers: FollowUpAnswers = {
        vin,
        mileage: data.mileage,
        zip_code: data.zip_code,
        condition: data.condition,
        accidents: data.accidents as AccidentDetails,
        service_history: data.service_history,
        maintenance_status: data.maintenance_status,
        last_service_date: data.last_service_date,
        title_status: data.title_status,
        previous_owners: data.previous_owners,
        previous_use: data.previous_use,
        tire_condition: data.tire_condition,
        dashboard_lights: data.dashboard_lights,
        frame_damage: data.frame_damage,
        modifications: data.modifications as ModificationDetails,
        completion_percentage: progressValue,
        is_complete: progressValue >= 80,
        updated_at: new Date().toISOString(),
      };

      await saveFollowUpAnswers(followUpAnswers);
      toast.success('Follow-up answers saved successfully!');
      onComplete(followUpAnswers);
    } catch (error) {
      console.error('❌ Error submitting follow-up:', error);
      toast.error('Failed to save answers. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (loadingAnswers) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-8 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your previous answers...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <TooltipProvider>
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">Vehicle Assessment</CardTitle>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CircleCheck className="h-4 w-4" />
              {progressValue}% Complete
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Progress</span>
              <span className="font-medium">{progressValue}%</span>
            </div>
            <Progress value={progressValue} className="h-2" />
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <Accordion type="multiple" defaultValue={["vehicle-details"]} className="w-full">
              
              {/* Vehicle Details Section */}
              <AccordionItem value="vehicle-details">
                <AccordionTrigger className="text-lg font-semibold flex items-center gap-2">
                  <Car className="h-5 w-5" />
                  Vehicle Details
                </AccordionTrigger>
                <AccordionContent className="space-y-6 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="mileage" className="flex items-center gap-2">
                        Current Mileage
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Enter the current odometer reading</p>
                          </TooltipContent>
                        </Tooltip>
                      </Label>
                      <Input
                        id="mileage"
                        type="number"
                        placeholder="e.g., 45000"
                        value={watchedValues.mileage || ''}
                        onChange={(e) => setAnswer('mileage', e.target.value ? parseInt(e.target.value) : undefined)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="zip_code">ZIP Code</Label>
                      <Input
                        id="zip_code"
                        placeholder="e.g., 90210"
                        value={watchedValues.zip_code || ''}
                        onChange={(e) => setAnswer('zip_code', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Overall Vehicle Condition</Label>
                    <Select value={watchedValues.condition || ''} onValueChange={(value) => setAnswer('condition', value as any)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        {CONDITION_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex flex-col">
                              <span>{option.label}</span>
                              <span className="text-xs text-gray-500">{option.impact}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Ownership & Title Section */}
              <AccordionItem value="ownership-title">
                <AccordionTrigger className="text-lg font-semibold flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Ownership & Title
                </AccordionTrigger>
                <AccordionContent className="space-y-6 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Title Status</Label>
                      <Select value={watchedValues.title_status || ''} onValueChange={(value) => setAnswer('title_status', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select title status" />
                        </SelectTrigger>
                        <SelectContent>
                          {TITLE_STATUS_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex flex-col">
                                <span>{option.label}</span>
                                <span className="text-xs text-gray-500">{option.impact}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="previous_owners">Number of Previous Owners</Label>
                      <Input
                        id="previous_owners"
                        type="number"
                        min="0"
                        max="10"
                        value={watchedValues.previous_owners || ''}
                        onChange={(e) => setAnswer('previous_owners', e.target.value ? parseInt(e.target.value) : undefined)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Previous Use</Label>
                    <Select value={watchedValues.previous_use || ''} onValueChange={(value) => setAnswer('previous_use', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select previous use" />
                      </SelectTrigger>
                      <SelectContent>
                        {PREVIOUS_USE_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex flex-col">
                              <span>{option.label}</span>
                              <span className="text-xs text-gray-500">{option.impact}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Service History Section */}
              <AccordionItem value="service-history">
                <AccordionTrigger className="text-lg font-semibold flex items-center gap-2">
                  <Wrench className="h-5 w-5" />
                  Service History
                </AccordionTrigger>
                <AccordionContent className="space-y-6 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Service History Type</Label>
                      <Select value={watchedValues.service_history || ''} onValueChange={(value) => setAnswer('service_history', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select service type" />
                        </SelectTrigger>
                        <SelectContent>
                          {SERVICE_HISTORY_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex flex-col">
                                <span>{option.label}</span>
                                <span className="text-xs text-gray-500">{option.impact}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Maintenance Status</Label>
                      <Select value={watchedValues.maintenance_status || ''} onValueChange={(value) => setAnswer('maintenance_status', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select maintenance status" />
                        </SelectTrigger>
                        <SelectContent>
                          {MAINTENANCE_STATUS_OPTIONS.map((status) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="last_service_date">Last Service Date (Optional)</Label>
                    <Input
                      id="last_service_date"
                      type="date"
                      value={watchedValues.last_service_date || ''}
                      onChange={(e) => setAnswer('last_service_date', e.target.value)}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Damage/Accidents Section */}
              <AccordionItem value="damage-accidents">
                <AccordionTrigger className="text-lg font-semibold flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Damage & Accidents
                </AccordionTrigger>
                <AccordionContent className="space-y-6 pt-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Has this vehicle been in an accident?</Label>
                      <RadioGroup 
                        value={watchedValues.accidents?.hadAccident ? 'yes' : 'no'} 
                        onValueChange={(value) => setAnswer('accidents', { ...watchedValues.accidents, hadAccident: value === 'yes' })}
                        className="flex space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="accident-yes" />
                          <Label htmlFor="accident-yes">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="accident-no" />
                          <Label htmlFor="accident-no">No</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {watchedValues.accidents?.hadAccident && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="space-y-2">
                          <Label>Accident Severity</Label>
                          <Select 
                            value={watchedValues.accidents?.severity || ''} 
                            onValueChange={(value) => setAnswer('accidents', { ...watchedValues.accidents, severity: value as any })}
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
                          <Label htmlFor="accident_count">Number of Accidents</Label>
                          <Input
                            id="accident_count"
                            type="number"
                            min="1"
                            value={watchedValues.accidents?.count || ''}
                            onChange={(e) => setAnswer('accidents', { 
                              ...watchedValues.accidents, 
                              count: e.target.value ? parseInt(e.target.value) : undefined 
                            })}
                          />
                        </div>

                        <div className="md:col-span-2 space-y-2">
                          <Label htmlFor="accident_description">Accident Description (Optional)</Label>
                          <Textarea
                            id="accident_description"
                            placeholder="Describe the accident..."
                            value={watchedValues.accidents?.description || ''}
                            onChange={(e) => setAnswer('accidents', { 
                              ...watchedValues.accidents, 
                              description: e.target.value 
                            })}
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="frame_damage"
                        checked={watchedValues.frame_damage || false}
                        onCheckedChange={(checked) => setAnswer('frame_damage', !!checked)}
                      />
                      <Label htmlFor="frame_damage">Frame damage present</Label>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Tires & Maintenance Section */}
              <AccordionItem value="tires-maintenance">
                <AccordionTrigger className="text-lg font-semibold flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Tires & Maintenance
                </AccordionTrigger>
                <AccordionContent className="space-y-6 pt-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Tire Condition</Label>
                      <Select value={watchedValues.tire_condition || ''} onValueChange={(value) => setAnswer('tire_condition', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select tire condition" />
                        </SelectTrigger>
                        <SelectContent>
                          {TIRE_CONDITION_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex flex-col">
                                <span>{option.label}</span>
                                <span className="text-xs text-gray-500">{option.impact}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Dashboard Warning Lights</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {DASHBOARD_LIGHTS.map((light) => (
                          <div key={light.value} className="flex items-center space-x-2">
                            <Checkbox
                              id={light.value}
                              checked={(watchedValues.dashboard_lights || []).includes(light.value)}
                              onCheckedChange={(checked) => {
                                const currentLights = watchedValues.dashboard_lights || [];
                                if (checked) {
                                  setAnswer('dashboard_lights', [...currentLights, light.value]);
                                } else {
                                  setAnswer('dashboard_lights', currentLights.filter(l => l !== light.value));
                                }
                              }}
                            />
                            <Label htmlFor={light.value} className="text-sm">
                              {light.icon} {light.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Modifications Section */}
              <AccordionItem value="modifications">
                <AccordionTrigger className="text-lg font-semibold flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Modifications & Upgrades
                </AccordionTrigger>
                <AccordionContent className="space-y-6 pt-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Has this vehicle been modified?</Label>
                      <RadioGroup 
                        value={watchedValues.modifications?.modified ? 'yes' : 'no'} 
                        onValueChange={(value) => setAnswer('modifications', { ...watchedValues.modifications, modified: value === 'yes' })}
                        className="flex space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="modified-yes" />
                          <Label htmlFor="modified-yes">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="modified-no" />
                          <Label htmlFor="modified-no">No</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {watchedValues.modifications?.modified && (
                      <div className="p-4 bg-gray-50 rounded-lg space-y-4">
                        <div className="space-y-2">
                          <Label>Type of Modifications</Label>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {MODIFICATION_TYPES.map((type) => (
                              <div key={type} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`mod-${type}`}
                                  checked={(watchedValues.modifications?.types || []).includes(type)}
                                  onCheckedChange={(checked) => {
                                    const currentTypes = watchedValues.modifications?.types || [];
                                    if (checked) {
                                      setAnswer('modifications', { 
                                        ...watchedValues.modifications, 
                                        types: [...currentTypes, type] 
                                      });
                                    } else {
                                      setAnswer('modifications', { 
                                        ...watchedValues.modifications, 
                                        types: currentTypes.filter(t => t !== type) 
                                      });
                                    }
                                  }}
                                />
                                <Label htmlFor={`mod-${type}`} className="text-sm">{type}</Label>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="reversible"
                            checked={watchedValues.modifications?.reversible || false}
                            onCheckedChange={(checked) => setAnswer('modifications', { 
                              ...watchedValues.modifications, 
                              reversible: !!checked 
                            })}
                          />
                          <Label htmlFor="reversible">Modifications are reversible</Label>
                        </div>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>

            </Accordion>

            <div className="flex justify-end pt-6 border-t">
              <Button 
                type="submit" 
                disabled={isLoading} 
                className="px-8 py-2 bg-primary text-white hover:bg-primary/90"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <CircleCheck className="h-4 w-4 mr-2" />
                    Complete Assessment
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
