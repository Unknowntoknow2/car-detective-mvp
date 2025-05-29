import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { FollowUpAnswers, CONDITION_OPTIONS, SERVICE_HISTORY_OPTIONS, TITLE_STATUS_OPTIONS, TIRE_CONDITION_OPTIONS, PREVIOUS_USE_OPTIONS, DASHBOARD_LIGHTS, MODIFICATION_TYPES } from '@/types/follow-up-answers';
import { 
  Car, 
  FileText, 
  Wrench, 
  AlertTriangle, 
  Gauge, 
  HandCoins,
  Info
} from 'lucide-react';

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

interface UnifiedFollowUpFormProps {
  vin: string;
  onComplete: (data: FollowUpAnswers) => void;
  initialData?: Partial<FollowUpAnswers>;
  className?: string;
}

export function UnifiedFollowUpForm({ vin, onComplete, initialData = {}, className = '' }: UnifiedFollowUpFormProps) {
  const [completionProgress, setCompletionProgress] = useState(0);
  
  const form = useForm<FollowUpAnswers>({
    resolver: zodResolver(followUpSchema),
    defaultValues: {
      vin,
      ...initialData,
      accidents: {
        hadAccident: false,
        ...initialData.accidents,
      },
      modifications: {
        modified: false,
        ...initialData.modifications,
      },
      dashboard_lights: initialData.dashboard_lights || [],
    },
  });

  const watchedValues = form.watch();

  // Calculate completion progress
  useEffect(() => {
    const totalFields = 15; // Approximate number of important fields
    let completedFields = 0;

    if (watchedValues.mileage) completedFields++;
    if (watchedValues.zip_code) completedFields++;
    if (watchedValues.condition) completedFields++;
    if (watchedValues.service_history) completedFields++;
    if (watchedValues.maintenance_status) completedFields++;
    if (watchedValues.title_status) completedFields++;
    if (watchedValues.previous_owners) completedFields++;
    if (watchedValues.previous_use) completedFields++;
    if (watchedValues.tire_condition) completedFields++;
    if (watchedValues.dashboard_lights?.length) completedFields++;
    if (watchedValues.accidents?.hadAccident !== undefined) completedFields++;
    if (watchedValues.modifications?.modified !== undefined) completedFields++;
    if (watchedValues.frame_damage !== undefined) completedFields++;
    if (watchedValues.last_service_date) completedFields++;

    const progress = Math.round((completedFields / totalFields) * 100);
    setCompletionProgress(progress);
  }, [watchedValues]);

  const setAnswer = (field: keyof FollowUpAnswers, value: any) => {
    form.setValue(field, value);
  };

  const onSubmit = (data: FollowUpAnswers) => {
    const completionPercentage = completionProgress;
    const isComplete = completionPercentage >= 80;

    const finalData = {
      ...data,
      vin,
      completion_percentage: completionPercentage,
      is_complete: isComplete,
    };

    onComplete(finalData);
  };

  return (
    <TooltipProvider>
      <div className={`max-w-4xl mx-auto space-y-6 ${className}`}>
        {/* Progress Bar */}
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold">Vehicle Assessment Progress</h3>
            <span className="text-sm text-gray-600">{completionProgress}% Complete</span>
          </div>
          <Progress value={completionProgress} className="h-3" />
          <p className="text-sm text-gray-500 mt-2">
            Complete more sections to improve valuation accuracy
          </p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Accordion type="multiple" className="space-y-4">
            
            {/* Vehicle Details Section */}
            <AccordionItem value="vehicle-details" className="bg-white rounded-lg border">
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                <div className="flex items-center gap-3">
                  <Car className="w-5 h-5 text-blue-600" />
                  <span className="text-lg font-semibold">Vehicle Details</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="mileage">Current Mileage</Label>
                    <Input
                      id="mileage"
                      type="number"
                      placeholder="e.g., 50000"
                      {...form.register('mileage', { valueAsNumber: true })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="zip_code">Zip Code</Label>
                    <Input
                      id="zip_code"
                      placeholder="e.g., 90210"
                      {...form.register('zip_code')}
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label>Overall Condition</Label>
                    <RadioGroup
                      value={watchedValues.condition || ''}
                      onValueChange={(value) => setAnswer('condition', value)}
                    >
                      {CONDITION_OPTIONS.map((option) => (
                        <div key={option.value} className="flex items-center space-x-2">
                          <RadioGroupItem value={option.value} id={option.value} />
                          <Label htmlFor={option.value} className="flex-1">
                            <div className="font-medium">{option.label}</div>
                            <div className="text-sm text-gray-500">{option.description}</div>
                            <div className="text-xs text-blue-600">{option.impact}</div>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Ownership & Title Section */}
            <AccordionItem value="ownership-title" className="bg-white rounded-lg border">
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-green-600" />
                  <span className="text-lg font-semibold">Ownership & Title</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
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
                            {option.label} - {option.impact}
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
                      placeholder="e.g., 2"
                      {...form.register('previous_owners', { valueAsNumber: true })}
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label>Previous Use</Label>
                    <RadioGroup
                      value={watchedValues.previous_use || ''}
                      onValueChange={(value) => setAnswer('previous_use', value)}
                    >
                      {PREVIOUS_USE_OPTIONS.map((option) => (
                        <div key={option.value} className="flex items-center space-x-2">
                          <RadioGroupItem value={option.value} id={`use-${option.value}`} />
                          <Label htmlFor={`use-${option.value}`}>
                            {option.label} - <span className="text-sm text-blue-600">{option.impact}</span>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Service History Section */}
            <AccordionItem value="service-history" className="bg-white rounded-lg border">
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                <div className="flex items-center gap-3">
                  <Wrench className="w-5 h-5 text-purple-600" />
                  <span className="text-lg font-semibold">Service History</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Service History Type</Label>
                    <Select value={watchedValues.service_history || ''} onValueChange={(value) => setAnswer('service_history', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select service history" />
                      </SelectTrigger>
                      <SelectContent>
                        {SERVICE_HISTORY_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label} - {option.impact}
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
                        <SelectItem value="up-to-date">Up to date</SelectItem>
                        <SelectItem value="overdue">Overdue</SelectItem>
                        <SelectItem value="unknown">Unknown</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 md:col-span-2">
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

            {/* Damage & Accidents Section */}
            <AccordionItem value="damage-accidents" className="bg-white rounded-lg border">
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <span className="text-lg font-semibold">Damage & Accidents</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <div className="space-y-6">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="had-accident"
                      checked={watchedValues.accidents?.hadAccident || false}
                      onCheckedChange={(checked) => 
                        setAnswer('accidents', { 
                          ...watchedValues.accidents, 
                          hadAccident: checked === true 
                        })
                      }
                    />
                    <Label htmlFor="had-accident">Vehicle has been in an accident</Label>
                  </div>

                  {watchedValues.accidents?.hadAccident && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label>Accident Severity</Label>
                        <Select 
                          value={watchedValues.accidents?.severity || ''} 
                          onValueChange={(value) => 
                            setAnswer('accidents', { 
                              ...watchedValues.accidents, 
                              severity: value as 'minor' | 'moderate' | 'major'
                            })
                          }
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
                        <Label htmlFor="accident-count">Number of Accidents</Label>
                        <Input
                          id="accident-count"
                          type="number"
                          min="0"
                          value={watchedValues.accidents?.count || ''}
                          onChange={(e) => 
                            setAnswer('accidents', { 
                              ...watchedValues.accidents, 
                              count: parseInt(e.target.value) || 0
                            })
                          }
                        />
                      </div>

                      <div className="md:col-span-2 space-y-2">
                        <Label htmlFor="accident-description">Accident Description</Label>
                        <Textarea
                          id="accident-description"
                          placeholder="Describe the accident and any damage..."
                          value={watchedValues.accidents?.description || ''}
                          onChange={(e) => 
                            setAnswer('accidents', { 
                              ...watchedValues.accidents, 
                              description: e.target.value
                            })
                          }
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="frame-damage"
                      checked={watchedValues.frame_damage || false}
                      onCheckedChange={(checked) => setAnswer('frame_damage', checked === true)}
                    />
                    <Label htmlFor="frame-damage">Vehicle has frame damage</Label>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Tires & Maintenance Section */}
            <AccordionItem value="tires-maintenance" className="bg-white rounded-lg border">
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                <div className="flex items-center gap-3">
                  <Gauge className="w-5 h-5 text-orange-600" />
                  <span className="text-lg font-semibold">Tires & Maintenance</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label>Tire Condition</Label>
                    <RadioGroup
                      value={watchedValues.tire_condition || ''}
                      onValueChange={(value) => setAnswer('tire_condition', value)}
                    >
                      {TIRE_CONDITION_OPTIONS.map((option) => (
                        <div key={option.value} className="flex items-center space-x-2">
                          <RadioGroupItem value={option.value} id={`tire-${option.value}`} />
                          <Label htmlFor={`tire-${option.value}`}>
                            {option.label} - <span className="text-sm text-blue-600">{option.impact}</span>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label>Dashboard Warning Lights</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {DASHBOARD_LIGHTS.map((light) => (
                        <div key={light.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={`light-${light.value}`}
                            checked={watchedValues.dashboard_lights?.includes(light.value) || false}
                            onCheckedChange={(checked) => {
                              const currentLights = watchedValues.dashboard_lights || [];
                              if (checked) {
                                setAnswer('dashboard_lights', [...currentLights, light.value]);
                              } else {
                                setAnswer('dashboard_lights', currentLights.filter(l => l !== light.value));
                              }
                            }}
                          />
                          <Label htmlFor={`light-${light.value}`} className="text-sm">
                            {light.icon} {light.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Offers & Listings Section */}
            <AccordionItem value="offers-listings" className="bg-white rounded-lg border">
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                <div className="flex items-center gap-3">
                  <HandCoins className="w-5 h-5 text-yellow-600" />
                  <span className="text-lg font-semibold">Modifications & Extras</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <div className="space-y-6">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="modified"
                      checked={watchedValues.modifications?.modified || false}
                      onCheckedChange={(checked) => 
                        setAnswer('modifications', { 
                          ...watchedValues.modifications, 
                          modified: checked === true 
                        })
                      }
                    />
                    <Label htmlFor="modified">Vehicle has been modified</Label>
                  </div>

                  {watchedValues.modifications?.modified && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Modification Types</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {MODIFICATION_TYPES.map((type) => (
                            <div key={type} className="flex items-center space-x-2">
                              <Checkbox
                                id={`mod-${type}`}
                                checked={watchedValues.modifications?.types?.includes(type) || false}
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
                          onCheckedChange={(checked) => 
                            setAnswer('modifications', { 
                              ...watchedValues.modifications, 
                              reversible: checked === true 
                            })
                          }
                        />
                        <Label htmlFor="reversible">Modifications are reversible</Label>
                      </div>
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>

          </Accordion>

          <div className="flex justify-end pt-6">
            <Button type="submit" size="lg" className="px-8">
              Complete Assessment
            </Button>
          </div>
        </form>
      </div>
    </TooltipProvider>
  );
}
