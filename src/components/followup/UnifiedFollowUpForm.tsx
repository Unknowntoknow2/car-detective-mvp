import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Car, 
  FileText, 
  Wrench, 
  AlertTriangle, 
  Gauge, 
  DollarSign,
  Info,
  CheckCircle
} from 'lucide-react';
import { FollowUpAnswers, CONDITION_OPTIONS, SERVICE_HISTORY_OPTIONS, TITLE_STATUS_OPTIONS, TIRE_CONDITION_OPTIONS, PREVIOUS_USE_OPTIONS, DASHBOARD_LIGHTS, MODIFICATION_TYPES } from '@/types/follow-up-answers';
import { saveFollowUpAnswers, loadFollowUpAnswers } from '@/services/followUpService';
import { toast } from 'sonner';

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

type FollowUpFormData = z.infer<typeof followUpSchema>;

interface UnifiedFollowUpFormProps {
  vin: string;
  onComplete: (answers: FollowUpAnswers) => void;
}

export function UnifiedFollowUpForm({ vin, onComplete }: UnifiedFollowUpFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FollowUpFormData>({
    resolver: zodResolver(followUpSchema),
    defaultValues: {
      accidents: {
        hadAccident: false,
      },
      modifications: {
        modified: false,
      },
      dashboard_lights: [],
    },
  });

  useEffect(() => {
    loadExistingAnswers();
  }, [vin]);

  const loadExistingAnswers = async () => {
    try {
      setIsLoading(true);
      const existingAnswers = await loadFollowUpAnswers(vin);
      
      if (existingAnswers) {
        console.log('📥 Loading existing answers:', existingAnswers);
        
        const formData: FollowUpFormData = {
          mileage: existingAnswers.mileage || undefined,
          zip_code: existingAnswers.zip_code || undefined,
          condition: existingAnswers.condition || undefined,
          accidents: existingAnswers.accidents || { hadAccident: false },
          service_history: existingAnswers.service_history || undefined,
          maintenance_status: existingAnswers.maintenance_status || undefined,
          last_service_date: existingAnswers.last_service_date || undefined,
          title_status: existingAnswers.title_status || undefined,
          previous_owners: existingAnswers.previous_owners || undefined,
          previous_use: existingAnswers.previous_use || undefined,
          tire_condition: existingAnswers.tire_condition || undefined,
          dashboard_lights: existingAnswers.dashboard_lights || [],
          frame_damage: existingAnswers.frame_damage || false,
          modifications: existingAnswers.modifications || { modified: false },
        };

        form.reset(formData);
      }
    } catch (error) {
      console.error('❌ Error loading existing answers:', error);
      toast.error('Failed to load existing answers');
    } finally {
      setIsLoading(false);
    }
  };

  const setAnswer = (path: string, value: any) => {
    const pathParts = path.split('.');
    
    if (pathParts.length === 1) {
      form.setValue(path as any, value);
    } else {
      const [parent, child] = pathParts;
      const currentParent = form.getValues(parent as any) || {};
      form.setValue(parent as any, {
        ...currentParent,
        [child]: value,
      });
    }
  };

  const calculateProgress = () => {
    const values = form.watch();
    const totalFields = 13;
    let filledFields = 0;

    if (values.mileage) filledFields++;
    if (values.zip_code) filledFields++;
    if (values.condition) filledFields++;
    if (values.accidents?.hadAccident !== undefined) filledFields++;
    if (values.service_history) filledFields++;
    if (values.maintenance_status) filledFields++;
    if (values.title_status) filledFields++;
    if (values.previous_owners) filledFields++;
    if (values.previous_use) filledFields++;
    if (values.tire_condition) filledFields++;
    if (values.dashboard_lights && values.dashboard_lights.length > 0) filledFields++;
    if (values.modifications?.modified !== undefined) filledFields++;
    if (values.frame_damage !== undefined) filledFields++;

    return Math.round((filledFields / totalFields) * 100);
  };

  const onSubmit = async (data: FollowUpFormData) => {
    try {
      setIsSubmitting(true);
      console.log('📤 Submitting follow-up answers:', data);

      const answers: FollowUpAnswers = {
        vin,
        ...data,
        completion_percentage: calculateProgress(),
        is_complete: calculateProgress() >= 80,
      };

      await saveFollowUpAnswers(answers);
      onComplete(answers);
      toast.success('Follow-up answers saved successfully!');
    } catch (error) {
      console.error('❌ Error submitting follow-up answers:', error);
      toast.error('Failed to save answers');
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = calculateProgress();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="h-5 w-5" />
            Vehicle Details & Follow-up Questions
          </CardTitle>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Progress: {progress}% complete</span>
              <Badge variant={progress >= 80 ? "default" : "secondary"}>
                {progress >= 80 ? "Ready for valuation" : "In progress"}
              </Badge>
            </div>
            <Progress value={progress} className="w-full" />
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Accordion type="multiple" defaultValue={["vehicle-details"]} className="w-full">
                
                {/* Vehicle Details Section */}
                <AccordionItem value="vehicle-details">
                  <AccordionTrigger className="flex items-center gap-2">
                    <Car className="h-4 w-4" />
                    Vehicle Details
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="mileage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-1">
                              Current Mileage
                              <Tooltip>
                                <TooltipTrigger>
                                  <Info className="h-3 w-3" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Enter the current odometer reading</p>
                                </TooltipContent>
                              </Tooltip>
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="e.g., 75000"
                                {...field}
                                onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="zip_code"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>ZIP Code</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., 90210" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="condition"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Overall Condition</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select vehicle condition" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {CONDITION_OPTIONS.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  <div className="flex flex-col">
                                    <span>{option.label}</span>
                                    <span className="text-xs text-muted-foreground">
                                      {option.description} • {option.impact}
                                    </span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </AccordionContent>
                </AccordionItem>

                {/* Ownership & Title Section */}
                <AccordionItem value="ownership-title">
                  <AccordionTrigger className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Ownership & Title
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="title_status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Title Status</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select title status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {TITLE_STATUS_OPTIONS.map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    <div className="flex flex-col">
                                      <span>{option.label}</span>
                                      <span className="text-xs text-muted-foreground">
                                        {option.impact}
                                      </span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="previous_owners"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Number of Previous Owners</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="e.g., 2"
                                {...field}
                                onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="previous_use"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Previous Use</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select previous use" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {PREVIOUS_USE_OPTIONS.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  <div className="flex flex-col">
                                    <span>{option.label}</span>
                                    <span className="text-xs text-muted-foreground">
                                      {option.impact}
                                    </span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </AccordionContent>
                </AccordionItem>

                {/* Service History Section */}
                <AccordionItem value="service-history">
                  <AccordionTrigger className="flex items-center gap-2">
                    <Wrench className="h-4 w-4" />
                    Service History
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="service_history"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Service History</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select service history" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {SERVICE_HISTORY_OPTIONS.map((option) => (
                                  <SelectItem key={option.value} value={option.value}>
                                    <div className="flex flex-col">
                                      <span>{option.label}</span>
                                      <span className="text-xs text-muted-foreground">
                                        {option.impact}
                                      </span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="maintenance_status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Maintenance Status</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select maintenance status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Up to date">Up to date</SelectItem>
                                <SelectItem value="Overdue">Overdue</SelectItem>
                                <SelectItem value="Unknown">Unknown</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="last_service_date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Service Date</FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </AccordionContent>
                </AccordionItem>

                {/* Damage / Accidents Section */}
                <AccordionItem value="damage-accidents">
                  <AccordionTrigger className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Damage / Accidents
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    <FormField
                      control={form.control}
                      name="accidents.hadAccident"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={(checked) => {
                                field.onChange(checked);
                                setAnswer('accidents', {
                                  ...form.getValues('accidents'),
                                  hadAccident: checked === true,
                                });
                              }}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              Has this vehicle been in any accidents?
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    {form.watch('accidents.hadAccident') && (
                      <div className="space-y-4 pl-6 border-l-2 border-muted">
                        <FormField
                          control={form.control}
                          name="accidents.severity"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Accident Severity</FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={(value) => {
                                    field.onChange(value);
                                    setAnswer('accidents', {
                                      ...form.getValues('accidents'),
                                      hadAccident: true,
                                      severity: value,
                                    });
                                  }}
                                  value={field.value}
                                  className="flex flex-col space-y-1"
                                >
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="minor" id="minor" />
                                    <label htmlFor="minor">Minor (cosmetic damage only)</label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="moderate" id="moderate" />
                                    <label htmlFor="moderate">Moderate (structural but repairable)</label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="major" id="major" />
                                    <label htmlFor="major">Major (significant structural damage)</label>
                                  </div>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="accidents.count"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Number of Accidents</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="e.g., 1"
                                  {...field}
                                  onChange={(e) => {
                                    const count = e.target.value ? parseInt(e.target.value) : undefined;
                                    field.onChange(count);
                                    setAnswer('accidents', {
                                      ...form.getValues('accidents'),
                                      hadAccident: true,
                                      count,
                                    });
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="accidents.description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Accident Description</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Describe the accident(s) and any repairs..."
                                  {...field}
                                  onChange={(e) => {
                                    field.onChange(e.target.value);
                                    setAnswer('accidents', {
                                      ...form.getValues('accidents'),
                                      hadAccident: true,
                                      description: e.target.value,
                                    });
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}

                    <Separator />

                    <FormField
                      control={form.control}
                      name="frame_damage"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              Does this vehicle have any frame damage?
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  </AccordionContent>
                </AccordionItem>

                {/* Tires & Maintenance Section */}
                <AccordionItem value="tires-maintenance">
                  <AccordionTrigger className="flex items-center gap-2">
                    <Gauge className="h-4 w-4" />
                    Tires & Maintenance
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    <FormField
                      control={form.control}
                      name="tire_condition"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tire Condition</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select tire condition" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {TIRE_CONDITION_OPTIONS.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  <div className="flex flex-col">
                                    <span>{option.label}</span>
                                    <span className="text-xs text-muted-foreground">
                                      {option.impact}
                                    </span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="dashboard_lights"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Dashboard Warning Lights</FormLabel>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {DASHBOARD_LIGHTS.map((light) => (
                              <div key={light.value} className="flex items-center space-x-2">
                                <Checkbox
                                  id={light.value}
                                  checked={field.value?.includes(light.value)}
                                  onCheckedChange={(checked) => {
                                    const updatedLights = checked
                                      ? [...(field.value || []), light.value]
                                      : (field.value || []).filter((l) => l !== light.value);
                                    field.onChange(updatedLights);
                                  }}
                                />
                                <label htmlFor={light.value} className="text-sm">
                                  {light.icon} {light.label}
                                </label>
                              </div>
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </AccordionContent>
                </AccordionItem>

                {/* Modifications Section */}
                <AccordionItem value="modifications">
                  <AccordionTrigger className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Modifications
                  </AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-4">
                    <FormField
                      control={form.control}
                      name="modifications.modified"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={(checked) => {
                                field.onChange(checked);
                                setAnswer('modifications', {
                                  ...form.getValues('modifications'),
                                  modified: checked === true,
                                  types: checked ? form.getValues('modifications.types') || [] : [],
                                });
                              }}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              Has this vehicle been modified from factory specifications?
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    {form.watch('modifications.modified') && (
                      <div className="space-y-4 pl-6 border-l-2 border-muted">
                        <FormField
                          control={form.control}
                          name="modifications.types"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Types of Modifications</FormLabel>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                {MODIFICATION_TYPES.map((type) => (
                                  <div key={type} className="flex items-center space-x-2">
                                    <Checkbox
                                      id={type}
                                      checked={field.value?.includes(type)}
                                      onCheckedChange={(checked) => {
                                        const updatedTypes = checked
                                          ? [...(field.value || []), type]
                                          : (field.value || []).filter((t) => t !== type);
                                        field.onChange(updatedTypes);
                                        setAnswer('modifications', {
                                          ...form.getValues('modifications'),
                                          modified: true,
                                          types: updatedTypes,
                                        });
                                      }}
                                    />
                                    <label htmlFor={type} className="text-sm">
                                      {type}
                                    </label>
                                  </div>
                                ))}
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="modifications.reversible"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={(checked) => {
                                    field.onChange(checked);
                                    setAnswer('modifications', {
                                      ...form.getValues('modifications'),
                                      modified: true,
                                      reversible: checked === true,
                                    });
                                  }}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>
                                  Are the modifications easily reversible?
                                </FormLabel>
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>

              </Accordion>

              <div className="flex items-center justify-between pt-6 border-t">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="h-4 w-4" />
                  <span>{progress}% complete</span>
                </div>
                <Button type="submit" disabled={isSubmitting} className="min-w-[120px]">
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Saving...
                    </div>
                  ) : (
                    'Complete Valuation'
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
