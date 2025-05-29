import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Car, 
  FileText, 
  Wrench, 
  AlertTriangle, 
  Gauge, 
  HandCoins,
  Info,
  CheckCircle,
  Clock,
  Shield,
  Tool
} from 'lucide-react';
import { FollowUpAnswers, CONDITION_OPTIONS, SERVICE_HISTORY_OPTIONS, TITLE_STATUS_OPTIONS, TIRE_CONDITION_OPTIONS, PREVIOUS_USE_OPTIONS, DASHBOARD_LIGHTS, MODIFICATION_TYPES } from '@/types/follow-up-answers';
import { toast } from 'sonner';

// Define Zod schema for form validation
// Define Zod schema for form validation
// Define Zod schema for form validation
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

interface UnifiedFollowUpFormProps {
  vin: string;
  onComplete: (formData: FollowUpAnswers) => void;
  initialData?: Partial<FollowUpAnswers>;
}

export function UnifiedFollowUpForm({ vin, onComplete, initialData }: UnifiedFollowUpFormProps) {
  const [completionPercentage, setCompletionPercentage] = useState(0);
  
  const form = useForm<FollowUpAnswers>({
    resolver: zodResolver(followUpSchema),
    defaultValues: {
      vin,
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
      frame_damage: initialData?.frame_damage || false,
      modifications: initialData?.modifications || { modified: false },
    },
  });

  const watchedValues = form.watch();

  // Calculate completion percentage
  useEffect(() => {
    const totalFields = 13; // Total number of main fields
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
    if (watchedValues.dashboard_lights && watchedValues.dashboard_lights.length > 0) completedFields++;
    if (watchedValues.frame_damage !== undefined) completedFields++;
    if (watchedValues.modifications?.modified !== undefined) completedFields++;

    const percentage = Math.round((completedFields / totalFields) * 100);
    setCompletionPercentage(percentage);
  }, [watchedValues]);

  const setAnswer = (field: keyof FollowUpAnswers, value: any) => {
    form.setValue(field, value);
  };

  const handleSubmit = async (data: FollowUpAnswers) => {
    try {
      const formattedData = {
        ...data,
        vin,
        completion_percentage: completionPercentage,
        is_complete: completionPercentage >= 80,
      };

      onComplete(formattedData);
      toast.success('Follow-up questions completed!');
    } catch (error) {
      console.error('Error submitting follow-up answers:', error);
      toast.error('Failed to save answers. Please try again.');
    }
  };

  return (
    <TooltipProvider>
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Vehicle Valuation Details
            </CardTitle>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Completion Progress</span>
                <span>{completionPercentage}%</span>
              </div>
              <Progress value={completionPercentage} className="w-full" />
            </div>
          </CardHeader>
        </Card>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <Accordion type="multiple" className="space-y-4">
            
            {/* Vehicle Details Section */}
            <AccordionItem value="vehicle-details">
              <AccordionTrigger className="flex items-center gap-2 text-lg font-semibold">
                <Car className="h-5 w-5 text-blue-600" />
                Vehicle Details
              </AccordionTrigger>
              <AccordionContent>
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="mileage" className="flex items-center gap-1">
                          Mileage
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-4 w-4 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Current odometer reading affects value significantly</p>
                            </TooltipContent>
                          </Tooltip>
                        </Label>
                        <Input
                          id="mileage"
                          type="number"
                          placeholder="e.g., 50000"
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

                      <div className="space-y-2">
                        <Label htmlFor="condition">Overall Condition</Label>
                        <Select 
                          value={watchedValues.condition || ''} 
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
                                  <span className="text-xs text-gray-500">{option.description}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* Ownership & Title Section */}
            <AccordionItem value="ownership-title">
              <AccordionTrigger className="flex items-center gap-2 text-lg font-semibold">
                <FileText className="h-5 w-5 text-green-600" />
                Ownership & Title
              </AccordionTrigger>
              <AccordionContent>
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="title_status">Title Status</Label>
                        <Select 
                          value={watchedValues.title_status || ''} 
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
                          placeholder="e.g., 2"
                          {...form.register('previous_owners', { valueAsNumber: true })}
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="previous_use">Previous Use</Label>
                        <Select 
                          value={watchedValues.previous_use || ''} 
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
                                  <span className="text-xs text-gray-500">{option.impact}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* Service History Section */}
            <AccordionItem value="service-history">
              <AccordionTrigger className="flex items-center gap-2 text-lg font-semibold">
                <Wrench className="h-5 w-5 text-purple-600" />
                Service History
              </AccordionTrigger>
              <AccordionContent>
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="service_history">Service History</Label>
                        <Select 
                          value={watchedValues.service_history || ''} 
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
                                  <span className="text-xs text-gray-500">{option.impact}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="maintenance_status">Maintenance Status</Label>
                        <Select 
                          value={watchedValues.maintenance_status || ''} 
                          onValueChange={(value) => setAnswer('maintenance_status', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="up-to-date">Up to date</SelectItem>
                            <SelectItem value="overdue">Overdue</SelectItem>
                            <SelectItem value="unknown">Unknown</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="last_service_date">Last Service Date (Optional)</Label>
                        <Input
                          id="last_service_date"
                          type="date"
                          {...form.register('last_service_date')}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* Damage / Accidents Section */}
            <AccordionItem value="damage-accidents">
              <AccordionTrigger className="flex items-center gap-2 text-lg font-semibold">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                Damage / Accidents
              </AccordionTrigger>
              <AccordionContent>
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="had_accident"
                          checked={watchedValues.accidents?.hadAccident || false}
                          onCheckedChange={(checked) => 
                            setAnswer('accidents', { 
                              ...watchedValues.accidents,
                              hadAccident: checked === true 
                            })
                          }
                        />
                        <Label htmlFor="had_accident">Vehicle has been in an accident</Label>
                      </div>

                      {watchedValues.accidents?.hadAccident && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-6">
                          <div className="space-y-2">
                            <Label>Accident Severity</Label>
                            <Select 
                              value={watchedValues.accidents?.severity || ''} 
                              onValueChange={(value) => 
                                setAnswer('accidents', { 
                                  ...watchedValues.accidents,
                                  severity: value as any,
                                  hadAccident: true 
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
                            <Label>Number of Accidents</Label>
                            <Input
                              type="number"
                              min="1"
                              max="10"
                              value={watchedValues.accidents?.count || ''}
                              onChange={(e) => 
                                setAnswer('accidents', { 
                                  ...watchedValues.accidents,
                                  count: parseInt(e.target.value) || undefined,
                                  hadAccident: true 
                                })
                              }
                            />
                          </div>

                          <div className="space-y-2 md:col-span-2">
                            <Label>Accident Description (Optional)</Label>
                            <Textarea
                              placeholder="Brief description of the accident(s)"
                              value={watchedValues.accidents?.description || ''}
                              onChange={(e) => 
                                setAnswer('accidents', { 
                                  ...watchedValues.accidents,
                                  description: e.target.value,
                                  hadAccident: true 
                                })
                              }
                            />
                          </div>
                        </div>
                      )}

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="frame_damage"
                          checked={watchedValues.frame_damage || false}
                          onCheckedChange={(checked) => setAnswer('frame_damage', checked === true)}
                        />
                        <Label htmlFor="frame_damage">Vehicle has frame damage</Label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* Tires & Maintenance Section */}
            <AccordionItem value="tires-maintenance">
              <AccordionTrigger className="flex items-center gap-2 text-lg font-semibold">
                <Gauge className="h-5 w-5 text-orange-600" />
                Tires & Maintenance
              </AccordionTrigger>
              <AccordionContent>
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Tire Condition</Label>
                        <Select 
                          value={watchedValues.tire_condition || ''} 
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
                              <Label htmlFor={light.value} className="text-sm">
                                {light.icon} {light.label}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="has_modifications"
                            checked={watchedValues.modifications?.modified || false}
                            onCheckedChange={(checked) => 
                              setAnswer('modifications', { 
                                ...watchedValues.modifications,
                                modified: checked === true 
                              })
                            }
                          />
                          <Label htmlFor="has_modifications">Vehicle has modifications</Label>
                        </div>

                        {watchedValues.modifications?.modified && (
                          <div className="ml-6 space-y-4">
                            <div className="space-y-2">
                              <Label>Modification Types</Label>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
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
                                            types: [...currentTypes, type],
                                            modified: true 
                                          });
                                        } else {
                                          setAnswer('modifications', { 
                                            ...watchedValues.modifications,
                                            types: currentTypes.filter(t => t !== type),
                                            modified: true 
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
                                id="reversible_mods"
                                checked={watchedValues.modifications?.reversible || false}
                                onCheckedChange={(checked) => 
                                  setAnswer('modifications', { 
                                    ...watchedValues.modifications,
                                    reversible: checked === true,
                                    modified: true 
                                  })
                                }
                              />
                              <Label htmlFor="reversible_mods">Modifications are reversible</Label>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            {/* Offers & Listings Section */}
            <AccordionItem value="offers-listings">
              <AccordionTrigger className="flex items-center gap-2 text-lg font-semibold">
                <HandCoins className="h-5 w-5 text-emerald-600" />
                Offers & Listings
              </AccordionTrigger>
              <AccordionContent>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center py-8 text-gray-500">
                      <HandCoins className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p>Dealer offers and market listings will appear here</p>
                      <p className="text-sm">Complete the form above to receive competitive offers</p>
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

          </Accordion>

          <div className="flex justify-end pt-6">
            <Button 
              type="submit" 
              className="px-8"
              disabled={completionPercentage < 40}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Complete Valuation
            </Button>
          </div>
        </form>
      </div>
    </TooltipProvider>
  );
}
