
import React, { useEffect, useState } from 'react';
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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Car, 
  FileText, 
  Wrench, 
  AlertTriangle, 
  Tire, 
  TrendingUp,
  Info,
  CheckCircle2
} from 'lucide-react';
import { FollowUpAnswers, CONDITION_OPTIONS, SERVICE_HISTORY_OPTIONS, TITLE_STATUS_OPTIONS, TIRE_CONDITION_OPTIONS, PREVIOUS_USE_OPTIONS, DASHBOARD_LIGHTS, MODIFICATION_TYPES } from '@/types/follow-up-answers';
import { saveFollowUpAnswers, loadFollowUpAnswers } from '@/services/followUpService';
import { toast } from 'sonner';

// Create a Zod schema that matches FollowUpAnswers
const followUpSchema = z.object({
  mileage: z.number().optional(),
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
  onComplete: (answers: FollowUpAnswers) => void;
}

export function UnifiedFollowUpForm({ vin, onComplete }: UnifiedFollowUpFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);

  const form = useForm<FormData>({
    resolver: zodResolver(followUpSchema),
    defaultValues: {
      accidents: { hadAccident: false },
      modifications: { modified: false },
      dashboard_lights: [],
    },
  });

  // Load existing answers
  useEffect(() => {
    const loadExistingAnswers = async () => {
      setIsLoading(true);
      try {
        const existingAnswers = await loadFollowUpAnswers(vin);
        if (existingAnswers) {
          console.log('📥 Loading existing answers:', existingAnswers);
          
          // Set form values individually to avoid type issues
          if (existingAnswers.mileage) form.setValue('mileage', existingAnswers.mileage);
          if (existingAnswers.zip_code) form.setValue('zip_code', existingAnswers.zip_code);
          if (existingAnswers.condition) form.setValue('condition', existingAnswers.condition);
          if (existingAnswers.service_history) form.setValue('service_history', existingAnswers.service_history);
          if (existingAnswers.maintenance_status) form.setValue('maintenance_status', existingAnswers.maintenance_status);
          if (existingAnswers.last_service_date) form.setValue('last_service_date', existingAnswers.last_service_date);
          if (existingAnswers.title_status) form.setValue('title_status', existingAnswers.title_status);
          if (existingAnswers.previous_owners) form.setValue('previous_owners', existingAnswers.previous_owners);
          if (existingAnswers.previous_use) form.setValue('previous_use', existingAnswers.previous_use);
          if (existingAnswers.tire_condition) form.setValue('tire_condition', existingAnswers.tire_condition);
          if (existingAnswers.dashboard_lights) form.setValue('dashboard_lights', existingAnswers.dashboard_lights);
          if (existingAnswers.frame_damage !== undefined) form.setValue('frame_damage', existingAnswers.frame_damage);
          
          // Handle accidents object
          if (existingAnswers.accidents) {
            form.setValue('accidents', {
              hadAccident: existingAnswers.accidents.hadAccident || false,
              count: existingAnswers.accidents.count,
              severity: existingAnswers.accidents.severity,
              repaired: existingAnswers.accidents.repaired,
              frameDamage: existingAnswers.accidents.frameDamage,
              description: existingAnswers.accidents.description,
            });
          }
          
          // Handle modifications object
          if (existingAnswers.modifications) {
            form.setValue('modifications', {
              modified: existingAnswers.modifications.modified || false,
              types: existingAnswers.modifications.types,
              reversible: existingAnswers.modifications.reversible,
            });
          }
        }
      } catch (error) {
        console.error('❌ Error loading existing answers:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (vin) {
      loadExistingAnswers();
    }
  }, [vin, form]);

  // Calculate progress based on filled fields
  const watchedValues = form.watch();
  useEffect(() => {
    const totalFields = 13; // Total number of main fields
    let filledFields = 0;

    if (watchedValues.mileage) filledFields++;
    if (watchedValues.zip_code) filledFields++;
    if (watchedValues.condition) filledFields++;
    if (watchedValues.service_history) filledFields++;
    if (watchedValues.maintenance_status) filledFields++;
    if (watchedValues.title_status) filledFields++;
    if (watchedValues.previous_owners) filledFields++;
    if (watchedValues.previous_use) filledFields++;
    if (watchedValues.tire_condition) filledFields++;
    if (watchedValues.dashboard_lights && watchedValues.dashboard_lights.length > 0) filledFields++;
    if (watchedValues.frame_damage !== undefined) filledFields++;
    if (watchedValues.accidents?.hadAccident !== undefined) filledFields++;
    if (watchedValues.modifications?.modified !== undefined) filledFields++;

    const newProgress = Math.round((filledFields / totalFields) * 100);
    setProgress(newProgress);
  }, [watchedValues]);

  const handleSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      console.log('📤 Submitting follow-up answers:', data);

      const followUpAnswers: FollowUpAnswers = {
        vin,
        mileage: data.mileage,
        zip_code: data.zip_code,
        condition: data.condition,
        accidents: data.accidents,
        service_history: data.service_history,
        maintenance_status: data.maintenance_status,
        last_service_date: data.last_service_date,
        title_status: data.title_status,
        previous_owners: data.previous_owners,
        previous_use: data.previous_use,
        tire_condition: data.tire_condition,
        dashboard_lights: data.dashboard_lights,
        frame_damage: data.frame_damage,
        modifications: data.modifications,
        completion_percentage: progress,
        is_complete: progress >= 80,
      };

      await saveFollowUpAnswers(followUpAnswers);
      toast.success('Follow-up information saved successfully!');
      onComplete(followUpAnswers);
    } catch (error) {
      console.error('❌ Error submitting follow-up answers:', error);
      toast.error('Failed to save follow-up information');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2">Loading your information...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <TooltipProvider>
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-6 w-6 text-primary" />
            Complete Your Vehicle Assessment
          </CardTitle>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Completion Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <Accordion type="multiple" className="w-full" defaultValue={["vehicle-details"]}>
              
              {/* Vehicle Details Section */}
              <AccordionItem value="vehicle-details">
                <AccordionTrigger className="flex items-center gap-2">
                  <Car className="h-5 w-5" />
                  Vehicle Details
                </AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="mileage">Current Mileage</Label>
                      <Input
                        id="mileage"
                        type="number"
                        placeholder="e.g., 75000"
                        {...form.register('mileage', { valueAsNumber: true })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="zip_code">ZIP Code</Label>
                      <Input
                        id="zip_code"
                        placeholder="e.g., 90210"
                        {...form.register('zip_code')}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Overall Vehicle Condition</Label>
                    <Select
                      value={form.watch('condition') || ''}
                      onValueChange={(value) => form.setValue('condition', value as any)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        {CONDITION_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex flex-col">
                              <span>{option.label}</span>
                              <span className="text-xs text-muted-foreground">{option.description}</span>
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
                <AccordionTrigger className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Ownership & Title
                </AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Title Status</Label>
                      <Select
                        value={form.watch('title_status') || ''}
                        onValueChange={(value) => form.setValue('title_status', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select title status" />
                        </SelectTrigger>
                        <SelectContent>
                          {TITLE_STATUS_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex flex-col">
                                <span>{option.label}</span>
                                <span className="text-xs text-muted-foreground">{option.impact}</span>
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
                        min="1"
                        placeholder="e.g., 2"
                        {...form.register('previous_owners', { valueAsNumber: true })}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Previous Use</Label>
                    <Select
                      value={form.watch('previous_use') || ''}
                      onValueChange={(value) => form.setValue('previous_use', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select previous use" />
                      </SelectTrigger>
                      <SelectContent>
                        {PREVIOUS_USE_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex flex-col">
                              <span>{option.label}</span>
                              <span className="text-xs text-muted-foreground">{option.impact}</span>
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
                <AccordionTrigger className="flex items-center gap-2">
                  <Wrench className="h-5 w-5" />
                  Service History
                </AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Service History Type</Label>
                    <Select
                      value={form.watch('service_history') || ''}
                      onValueChange={(value) => form.setValue('service_history', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select service history" />
                      </SelectTrigger>
                      <SelectContent>
                        {SERVICE_HISTORY_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex flex-col">
                              <span>{option.label}</span>
                              <span className="text-xs text-muted-foreground">{option.impact}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Maintenance Status</Label>
                      <Select
                        value={form.watch('maintenance_status') || ''}
                        onValueChange={(value) => form.setValue('maintenance_status', value)}
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
                    
                    <div className="space-y-2">
                      <Label htmlFor="last_service_date">Last Service Date</Label>
                      <Input
                        id="last_service_date"
                        type="date"
                        {...form.register('last_service_date')}
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Damage / Accidents Section */}
              <AccordionItem value="damage-accidents">
                <AccordionTrigger className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Damage / Accidents
                </AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <Label>Has this vehicle been in an accident?</Label>
                      <RadioGroup
                        value={form.watch('accidents')?.hadAccident?.toString() || 'false'}
                        onValueChange={(value) => {
                          const hadAccident = value === 'true';
                          const currentAccidents = form.watch('accidents') || { hadAccident: false };
                          form.setValue('accidents', {
                            ...currentAccidents,
                            hadAccident,
                          });
                        }}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="false" id="no-accident" />
                          <Label htmlFor="no-accident">No accidents</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="true" id="has-accident" />
                          <Label htmlFor="has-accident">Yes, has been in accident(s)</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {form.watch('accidents')?.hadAccident && (
                      <div className="space-y-4 pl-4 border-l-2 border-orange-200">
                        <div className="space-y-2">
                          <Label>Accident Severity</Label>
                          <Select
                            value={form.watch('accidents')?.severity || ''}
                            onValueChange={(value) => {
                              const currentAccidents = form.watch('accidents') || { hadAccident: true };
                              form.setValue('accidents', {
                                ...currentAccidents,
                                hadAccident: currentAccidents.hadAccident ?? true,
                                severity: value as any,
                              });
                            }}
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
                            placeholder="e.g., 1"
                            value={form.watch('accidents')?.count || ''}
                            onChange={(e) => {
                              const count = e.target.value ? parseInt(e.target.value) : undefined;
                              const currentAccidents = form.watch('accidents') || { hadAccident: true };
                              form.setValue('accidents', {
                                ...currentAccidents,
                                hadAccident: currentAccidents.hadAccident ?? true,
                                count,
                              });
                            }}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="accident_description">Accident Description</Label>
                          <Textarea
                            id="accident_description"
                            placeholder="Describe the accident(s), repairs made, etc."
                            value={form.watch('accidents')?.description || ''}
                            onChange={(e) => {
                              const currentAccidents = form.watch('accidents') || { hadAccident: true };
                              form.setValue('accidents', {
                                ...currentAccidents,
                                hadAccident: currentAccidents.hadAccident ?? true,
                                description: e.target.value,
                              });
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label>Frame Damage</Label>
                    <RadioGroup
                      value={form.watch('frame_damage')?.toString() || ''}
                      onValueChange={(value) => form.setValue('frame_damage', value === 'true')}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="false" id="no-frame-damage" />
                        <Label htmlFor="no-frame-damage">No frame damage</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="true" id="has-frame-damage" />
                        <Label htmlFor="has-frame-damage">Has frame damage</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Tires & Maintenance Section */}
              <AccordionItem value="tires-maintenance">
                <AccordionTrigger className="flex items-center gap-2">
                  <Tire className="h-5 w-5" />
                  Tires & Dashboard
                </AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Tire Condition</Label>
                    <Select
                      value={form.watch('tire_condition') || ''}
                      onValueChange={(value) => form.setValue('tire_condition', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select tire condition" />
                      </SelectTrigger>
                      <SelectContent>
                        {TIRE_CONDITION_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex flex-col">
                              <span>{option.label}</span>
                              <span className="text-xs text-muted-foreground">{option.impact}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-3">
                    <Label>Dashboard Warning Lights</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {DASHBOARD_LIGHTS.map((light) => (
                        <div key={light.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={`light-${light.value}`}
                            checked={form.watch('dashboard_lights')?.includes(light.value) || false}
                            onCheckedChange={(checked) => {
                              const currentLights = form.watch('dashboard_lights') || [];
                              const newLights = checked
                                ? [...currentLights, light.value]
                                : currentLights.filter(l => l !== light.value);
                              form.setValue('dashboard_lights', newLights);
                            }}
                          />
                          <Label htmlFor={`light-${light.value}`} className="text-sm flex items-center gap-1">
                            <span>{light.icon}</span>
                            {light.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Modifications Section */}
              <AccordionItem value="modifications">
                <AccordionTrigger className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Vehicle Modifications
                </AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <div className="space-y-3">
                    <Label>Has this vehicle been modified?</Label>
                    <RadioGroup
                      value={form.watch('modifications')?.modified?.toString() || 'false'}
                      onValueChange={(value) => {
                        const modified = value === 'true';
                        const currentMods = form.watch('modifications') || { modified: false };
                        form.setValue('modifications', {
                          ...currentMods,
                          modified,
                        });
                      }}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="false" id="no-modifications" />
                        <Label htmlFor="no-modifications">No modifications</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="true" id="has-modifications" />
                        <Label htmlFor="has-modifications">Yes, has modifications</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {form.watch('modifications')?.modified && (
                    <div className="space-y-4 pl-4 border-l-2 border-blue-200">
                      <div className="space-y-3">
                        <Label>Types of Modifications</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {MODIFICATION_TYPES.map((type) => (
                            <div key={type} className="flex items-center space-x-2">
                              <Checkbox
                                id={`mod-${type}`}
                                checked={form.watch('modifications')?.types?.includes(type) || false}
                                onCheckedChange={(checked) => {
                                  const currentMods = form.watch('modifications') || { modified: true };
                                  const currentTypes = currentMods.types || [];
                                  const newTypes = checked
                                    ? [...currentTypes, type]
                                    : currentTypes.filter(t => t !== type);
                                  form.setValue('modifications', {
                                    ...currentMods,
                                    modified: currentMods.modified ?? true,
                                    types: newTypes,
                                  });
                                }}
                              />
                              <Label htmlFor={`mod-${type}`} className="text-sm">{type}</Label>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <Label>Are modifications reversible?</Label>
                        <RadioGroup
                          value={form.watch('modifications')?.reversible?.toString() || ''}
                          onValueChange={(value) => {
                            const currentMods = form.watch('modifications') || { modified: true };
                            form.setValue('modifications', {
                              ...currentMods,
                              modified: currentMods.modified ?? true,
                              reversible: value === 'true',
                            });
                          }}
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="true" id="reversible-yes" />
                            <Label htmlFor="reversible-yes">Yes, easily reversible</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="false" id="reversible-no" />
                            <Label htmlFor="reversible-no">No, permanent modifications</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className="flex justify-between items-center pt-6 border-t">
              <div className="text-sm text-muted-foreground">
                {progress >= 80 ? (
                  <span className="text-green-600 font-medium">✓ Ready to submit</span>
                ) : (
                  <span>Complete more fields for better accuracy</span>
                )}
              </div>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="min-w-32"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  'Complete Assessment'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
