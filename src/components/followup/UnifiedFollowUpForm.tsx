
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
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Car, 
  FileText, 
  Wrench, 
  ShieldAlert, 
  Gauge,
  Offer,
  Info,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { FollowUpAnswers, CONDITION_OPTIONS, SERVICE_HISTORY_OPTIONS, TITLE_STATUS_OPTIONS, TIRE_CONDITION_OPTIONS, PREVIOUS_USE_OPTIONS, DASHBOARD_LIGHTS, MODIFICATION_TYPES } from '@/types/follow-up-answers';
import { VehicleFormTooltip } from '@/components/form/VehicleFormToolTip';
import { toast } from 'sonner';

// Form schema for validation
const followUpSchema = z.object({
  mileage: z.number().min(0).optional(),
  zip_code: z.string().min(5).max(5).optional(),
  condition: z.enum(['excellent', 'good', 'fair', 'poor']).optional(),
  accidents: z.object({
    hadAccident: z.boolean(),
    count: z.number().min(0).optional(),
    severity: z.enum(['minor', 'moderate', 'major']).optional(),
    repaired: z.boolean().optional(),
    frameDamage: z.boolean().optional(),
    description: z.string().optional(),
  }).optional(),
  service_history: z.string().optional(),
  maintenance_status: z.string().optional(),
  last_service_date: z.string().optional(),
  title_status: z.string().optional(),
  previous_owners: z.number().min(0).optional(),
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
  initialData?: Partial<FollowUpAnswers>;
}

export function UnifiedFollowUpForm({ vin, onComplete, initialData }: UnifiedFollowUpFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedSections, setCompletedSections] = useState<string[]>([]);

  const form = useForm<FormData>({
    resolver: zodResolver(followUpSchema),
    defaultValues: {
      mileage: initialData?.mileage,
      zip_code: initialData?.zip_code,
      condition: initialData?.condition,
      accidents: initialData?.accidents || { hadAccident: false },
      service_history: initialData?.service_history,
      maintenance_status: initialData?.maintenance_status,
      last_service_date: initialData?.last_service_date,
      title_status: initialData?.title_status,
      previous_owners: initialData?.previous_owners,
      previous_use: initialData?.previous_use,
      tire_condition: initialData?.tire_condition,
      dashboard_lights: initialData?.dashboard_lights || [],
      frame_damage: initialData?.frame_damage,
      modifications: initialData?.modifications || { modified: false },
    },
  });

  const watchedValues = form.watch();

  // Calculate progress based on completed fields
  const calculateProgress = () => {
    const totalFields = 13; // Total number of important fields
    let completedFields = 0;

    if (watchedValues.mileage) completedFields++;
    if (watchedValues.zip_code) completedFields++;
    if (watchedValues.condition) completedFields++;
    if (watchedValues.accidents?.hadAccident !== undefined) completedFields++;
    if (watchedValues.service_history) completedFields++;
    if (watchedValues.maintenance_status) completedFields++;
    if (watchedValues.title_status) completedFields++;
    if (watchedValues.previous_owners !== undefined) completedFields++;
    if (watchedValues.previous_use) completedFields++;
    if (watchedValues.tire_condition) completedFields++;
    if (watchedValues.dashboard_lights?.length) completedFields++;
    if (watchedValues.frame_damage !== undefined) completedFields++;
    if (watchedValues.modifications?.modified !== undefined) completedFields++;

    return Math.round((completedFields / totalFields) * 100);
  };

  const progress = calculateProgress();

  // Helper function to update nested form values
  const setAnswer = (field: keyof FormData, value: any) => {
    form.setValue(field, value);
  };

  const handleSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      const formattedData: FollowUpAnswers = {
        vin,
        ...data,
        completion_percentage: progress,
        is_complete: progress >= 80,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      console.log('✅ UnifiedFollowUpForm: Submitting data:', formattedData);
      await onComplete(formattedData);
      toast.success('Follow-up completed successfully!');
    } catch (error) {
      console.error('❌ UnifiedFollowUpForm: Error submitting:', error);
      toast.error('Failed to submit follow-up information');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Section completion status
  const getSectionStatus = (sectionKey: string) => {
    switch (sectionKey) {
      case 'vehicle-details':
        return watchedValues.mileage && watchedValues.zip_code && watchedValues.condition;
      case 'ownership-title':
        return watchedValues.title_status && watchedValues.previous_owners !== undefined && watchedValues.previous_use;
      case 'service-history':
        return watchedValues.service_history && watchedValues.maintenance_status;
      case 'damage-accidents':
        return watchedValues.accidents?.hadAccident !== undefined && watchedValues.frame_damage !== undefined;
      case 'tires-maintenance':
        return watchedValues.tire_condition && watchedValues.dashboard_lights;
      case 'modifications':
        return watchedValues.modifications?.modified !== undefined;
      default:
        return false;
    }
  };

  return (
    <TooltipProvider>
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">Vehicle Follow-Up Information</CardTitle>
            <Badge variant={progress >= 80 ? "default" : "secondary"} className="text-sm">
              {progress}% Complete
            </Badge>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Completion Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-muted-foreground">
              Complete at least 80% for the most accurate valuation
            </p>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            
            <Accordion type="multiple" defaultValue={["vehicle-details"]} className="space-y-4">
              
              {/* Vehicle Details Section */}
              <AccordionItem value="vehicle-details" className="border rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3">
                    <Car className="h-5 w-5 text-primary" />
                    <span className="font-semibold">Vehicle Details</span>
                    {getSectionStatus('vehicle-details') && (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="mileage">Current Mileage</Label>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Enter the current odometer reading</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <Input
                        id="mileage"
                        type="number"
                        placeholder="150,000"
                        {...form.register('mileage', { valueAsNumber: true })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="zip_code">ZIP Code</Label>
                      <Input
                        id="zip_code"
                        placeholder="90210"
                        maxLength={5}
                        {...form.register('zip_code')}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label>Overall Condition</Label>
                      <VehicleFormTooltip content="Rate the overall condition of your vehicle considering wear, maintenance, and functionality" />
                    </div>
                    <Select
                      value={watchedValues.condition}
                      onValueChange={(value) => setAnswer('condition', value as any)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        {CONDITION_OPTIONS.map((option) => (
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

              {/* Ownership & Title Section */}
              <AccordionItem value="ownership-title" className="border rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-primary" />
                    <span className="font-semibold">Ownership & Title</span>
                    {getSectionStatus('ownership-title') && (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Title Status</Label>
                      <Select
                        value={watchedValues.title_status}
                        onValueChange={(value) => setAnswer('title_status', value)}
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
                      <Label htmlFor="previous_owners">Previous Owners</Label>
                      <Input
                        id="previous_owners"
                        type="number"
                        min="0"
                        placeholder="1"
                        {...form.register('previous_owners', { valueAsNumber: true })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Previous Use</Label>
                    <Select
                      value={watchedValues.previous_use}
                      onValueChange={(value) => setAnswer('previous_use', value)}
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
              <AccordionItem value="service-history" className="border rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3">
                    <Wrench className="h-5 w-5 text-primary" />
                    <span className="font-semibold">Service History</span>
                    {getSectionStatus('service-history') && (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Service History</Label>
                      <Select
                        value={watchedValues.service_history}
                        onValueChange={(value) => setAnswer('service_history', value)}
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

                    <div className="space-y-2">
                      <Label>Maintenance Status</Label>
                      <Select
                        value={watchedValues.maintenance_status}
                        onValueChange={(value) => setAnswer('maintenance_status', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="up-to-date">Up to Date</SelectItem>
                          <SelectItem value="overdue">Overdue</SelectItem>
                          <SelectItem value="unknown">Unknown</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="last_service_date">Last Service Date</Label>
                    <Input
                      id="last_service_date"
                      type="date"
                      {...form.register('last_service_date')}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Damage & Accidents Section */}
              <AccordionItem value="damage-accidents" className="border rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3">
                    <ShieldAlert className="h-5 w-5 text-primary" />
                    <span className="font-semibold">Damage & Accidents</span>
                    {getSectionStatus('damage-accidents') && (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <Label>Has this vehicle been in any accidents?</Label>
                      <RadioGroup
                        value={watchedValues.accidents?.hadAccident?.toString()}
                        onValueChange={(value) => setAnswer('accidents', {
                          ...watchedValues.accidents,
                          hadAccident: value === 'true'
                        })}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="false" id="no-accident" />
                          <Label htmlFor="no-accident">No accidents</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="true" id="has-accident" />
                          <Label htmlFor="has-accident">Has been in accident(s)</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {watchedValues.accidents?.hadAccident && (
                      <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Accident Severity</Label>
                            <Select
                              value={watchedValues.accidents?.severity}
                              onValueChange={(value) => setAnswer('accidents', {
                                ...watchedValues.accidents,
                                hadAccident: true,
                                severity: value as any
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

                          <div className="space-y-2">
                            <Label htmlFor="accident_count">Number of Accidents</Label>
                            <Input
                              id="accident_count"
                              type="number"
                              min="1"
                              placeholder="1"
                              value={watchedValues.accidents?.count || ''}
                              onChange={(e) => setAnswer('accidents', {
                                ...watchedValues.accidents,
                                hadAccident: true,
                                count: parseInt(e.target.value) || undefined
                              })}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="accident_description">Accident Description</Label>
                          <Textarea
                            id="accident_description"
                            placeholder="Please describe the accident(s), damage, and repairs made..."
                            value={watchedValues.accidents?.description || ''}
                            onChange={(e) => setAnswer('accidents', {
                              ...watchedValues.accidents,
                              hadAccident: true,
                              description: e.target.value
                            })}
                          />
                        </div>
                      </div>
                    )}

                    <div className="space-y-3">
                      <Label>Frame Damage</Label>
                      <RadioGroup
                        value={watchedValues.frame_damage?.toString()}
                        onValueChange={(value) => setAnswer('frame_damage', value === 'true')}
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
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Tires & Maintenance Section */}
              <AccordionItem value="tires-maintenance" className="border rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3">
                    <Gauge className="h-5 w-5 text-primary" />
                    <span className="font-semibold">Tires & Maintenance</span>
                    {getSectionStatus('tires-maintenance') && (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Tire Condition</Label>
                      <Select
                        value={watchedValues.tire_condition}
                        onValueChange={(value) => setAnswer('tire_condition', value)}
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
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {DASHBOARD_LIGHTS.map((light) => (
                          <div key={light.value} className="flex items-center space-x-2">
                            <Checkbox
                              id={light.value}
                              checked={watchedValues.dashboard_lights?.includes(light.value)}
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
              <AccordionItem value="modifications" className="border rounded-lg px-4">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3">
                    <Offer className="h-5 w-5 text-primary" />
                    <span className="font-semibold">Modifications</span>
                    {getSectionStatus('modifications') && (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <Label>Has this vehicle been modified?</Label>
                      <RadioGroup
                        value={watchedValues.modifications?.modified?.toString()}
                        onValueChange={(value) => setAnswer('modifications', {
                          ...watchedValues.modifications,
                          modified: value === 'true'
                        })}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="false" id="no-modifications" />
                          <Label htmlFor="no-modifications">No modifications</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="true" id="has-modifications" />
                          <Label htmlFor="has-modifications">Has modifications</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {watchedValues.modifications?.modified && (
                      <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                        <div className="space-y-3">
                          <Label>Modification Types</Label>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {MODIFICATION_TYPES.map((type) => (
                              <div key={type} className="flex items-center space-x-2">
                                <Checkbox
                                  id={type}
                                  checked={watchedValues.modifications?.types?.includes(type)}
                                  onCheckedChange={(checked) => {
                                    const currentTypes = watchedValues.modifications?.types || [];
                                    if (checked) {
                                      setAnswer('modifications', {
                                        ...watchedValues.modifications,
                                        modified: true,
                                        types: [...currentTypes, type]
                                      });
                                    } else {
                                      setAnswer('modifications', {
                                        ...watchedValues.modifications,
                                        modified: true,
                                        types: currentTypes.filter(t => t !== type)
                                      });
                                    }
                                  }}
                                />
                                <Label htmlFor={type} className="text-sm">{type}</Label>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-3">
                          <Label>Are modifications reversible?</Label>
                          <RadioGroup
                            value={watchedValues.modifications?.reversible?.toString()}
                            onValueChange={(value) => setAnswer('modifications', {
                              ...watchedValues.modifications,
                              modified: true,
                              reversible: value === 'true'
                            })}
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="true" id="reversible-yes" />
                              <Label htmlFor="reversible-yes">Yes, reversible</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="false" id="reversible-no" />
                              <Label htmlFor="reversible-no">No, permanent</Label>
                            </div>
                          </RadioGroup>
                        </div>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>

            </Accordion>

            <Separator className="my-6" />

            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
              <div className="text-sm text-muted-foreground">
                {progress >= 80 ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle2 className="h-4 w-4" />
                    Ready for accurate valuation
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-amber-600">
                    <AlertTriangle className="h-4 w-4" />
                    Complete more sections for better accuracy
                  </div>
                )}
              </div>

              <Button 
                type="submit" 
                disabled={isSubmitting || progress < 30}
                className="min-w-[200px]"
              >
                {isSubmitting ? 'Processing...' : 'Complete Valuation'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
