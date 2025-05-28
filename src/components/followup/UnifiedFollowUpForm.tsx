
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Loader2, Save, CheckCircle, AlertCircle } from 'lucide-react';

// Import types and constants
import { 
  FollowUpAnswers, 
  AccidentDetails, 
  ModificationDetails,
  MAINTENANCE_STATUS_OPTIONS,
  TITLE_STATUS_OPTIONS,
  TIRE_CONDITION_OPTIONS,
  PREVIOUS_USE_OPTIONS,
  SERVICE_HISTORY_OPTIONS
} from '@/types/follow-up-answers';

// Import locked specialized components
import { ConditionSelector } from '@/components/valuation/enhanced-followup/ConditionSelector';
import { AccidentSection } from '@/components/valuation/enhanced-followup/AccidentSection';
import { DashboardLightsSection } from '@/components/valuation/enhanced-followup/DashboardLightsSection';

// Import hook for data management
import { useFollowUpAnswers } from '@/components/valuation/enhanced-followup/hooks/useFollowUpAnswers';

interface UnifiedFollowUpFormProps {
  vin?: string;
  vehicleData?: any;
  onComplete?: () => void;
  onSave?: (answers: FollowUpAnswers) => void;
}

export function UnifiedFollowUpForm({ 
  vin = '', 
  vehicleData, 
  onComplete, 
  onSave 
}: UnifiedFollowUpFormProps) {
  const { answers, loading, saving, updateAnswers, saveAnswers } = useFollowUpAnswers(vin);
  const [activeSection, setActiveSection] = useState<string>('basic-info');

  const handleSave = async () => {
    const success = await saveAnswers();
    if (success && onSave) {
      // Fix mileage type conversion
      const answersToSave = {
        ...answers,
        mileage: typeof answers.mileage === 'string' ? parseInt(answers.mileage) : answers.mileage,
      };
      onSave(answersToSave);
    }
  };

  const handleComplete = () => {
    handleSave();
    if (onComplete) {
      onComplete();
    }
    toast.success('Follow-up assessment completed successfully!');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading assessment...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Vehicle Assessment Follow-Up
          </CardTitle>
          <p className="text-muted-foreground">
            Complete this assessment to get the most accurate valuation for your vehicle.
          </p>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible value={activeSection} onValueChange={setActiveSection}>
            
            {/* Basic Information Section */}
            <AccordionItem value="basic-info">
              <AccordionTrigger>Basic Vehicle Information</AccordionTrigger>
              <AccordionContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="mileage">Current Mileage</Label>
                    <Input
                      id="mileage"
                      type="number"
                      placeholder="e.g. 45000"
                      value={answers.mileage || ''}
                      onChange={(e) => updateAnswers({ mileage: parseInt(e.target.value) || undefined })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="zip_code">ZIP Code</Label>
                    <Input
                      id="zip_code"
                      placeholder="e.g. 90210"
                      value={answers.zip_code || ''}
                      onChange={(e) => updateAnswers({ zip_code: e.target.value })}
                      maxLength={5}
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Vehicle Condition Section */}
            <AccordionItem value="condition">
              <AccordionTrigger>Vehicle Condition</AccordionTrigger>
              <AccordionContent>
                <ConditionSelector
                  value={answers.condition}
                  onChange={(condition) => updateAnswers({ condition })}
                  readonly={false}
                />
              </AccordionContent>
            </AccordionItem>

            {/* Accident History Section */}
            <AccordionItem value="accidents">
              <AccordionTrigger>Accident History</AccordionTrigger>
              <AccordionContent>
                <AccidentSection
                  value={answers.accidents}
                  onChange={(accidents) => updateAnswers({ accidents })}
                />
              </AccordionContent>
            </AccordionItem>

            {/* Dashboard Warning Lights Section */}
            <AccordionItem value="dashboard-lights">
              <AccordionTrigger>Dashboard Warning Lights</AccordionTrigger>
              <AccordionContent>
                <DashboardLightsSection
                  value={answers.dashboard_lights}
                  onChange={(dashboard_lights) => updateAnswers({ dashboard_lights })}
                  readonly={false}
                />
              </AccordionContent>
            </AccordionItem>

            {/* Service History & Title Section */}
            <AccordionItem value="maintenance">
              <AccordionTrigger>Service History & Title Status</AccordionTrigger>
              <AccordionContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Service History</Label>
                    <Select
                      value={answers.service_history || ''}
                      onValueChange={(value) => updateAnswers({ service_history: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select service type" />
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

                  <div>
                    <Label>Maintenance Status</Label>
                    <Select
                      value={answers.maintenance_status || ''}
                      onValueChange={(value) => updateAnswers({ maintenance_status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {MAINTENANCE_STATUS_OPTIONS.map((option: string) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Title Status</Label>
                    <Select
                      value={answers.title_status || ''}
                      onValueChange={(value) => updateAnswers({ title_status: value })}
                    >
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

                  <div>
                    <Label>Previous Owners</Label>
                    <Input
                      type="number"
                      min="1"
                      max="10"
                      value={answers.previous_owners || ''}
                      onChange={(e) => updateAnswers({ previous_owners: parseInt(e.target.value) || undefined })}
                      placeholder="Number of previous owners"
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Modifications Section */}
            <AccordionItem value="modifications">
              <AccordionTrigger>Modifications & Custom Work</AccordionTrigger>
              <AccordionContent className="space-y-4">
                <div>
                  <Label className="text-base font-medium">Has this vehicle been modified?</Label>
                  <RadioGroup
                    value={answers.modifications?.modified ? 'yes' : 'no'}
                    onValueChange={(val) => 
                      updateAnswers({ 
                        modifications: { 
                          modified: val === 'yes',
                          types: val === 'yes' ? answers.modifications?.types : [],
                          reversible: val === 'yes' ? answers.modifications?.reversible : undefined
                        } 
                      })
                    }
                    className="flex gap-6 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="no-mods" />
                      <Label htmlFor="no-mods">No modifications</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="yes-mods" />
                      <Label htmlFor="yes-mods">Yes, modified</Label>
                    </div>
                  </RadioGroup>
                </div>

                {answers.modifications?.modified && (
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Are modifications reversible?</Label>
                      <RadioGroup
                        value={answers.modifications.reversible ? 'yes' : 'no'}
                        onValueChange={(val) => 
                          updateAnswers({ 
                            modifications: { 
                              ...answers.modifications,
                              reversible: val === 'yes'
                            } 
                          })
                        }
                        className="flex gap-4 mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="reversible-yes" />
                          <Label htmlFor="reversible-yes">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="reversible-no" />
                          <Label htmlFor="reversible-no">No</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>

          </Accordion>

          <div className="flex justify-between items-center mt-8 pt-6 border-t">
            <div className="text-sm text-muted-foreground">
              Completion: {answers.completion_percentage || 0}%
            </div>
            
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Progress
                  </>
                )}
              </Button>
              
              <Button 
                onClick={handleComplete}
                disabled={saving}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Complete Assessment
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default UnifiedFollowUpForm;
