
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Car, Settings, FileText, Wrench, AlertTriangle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { 
  FollowUpAnswers, 
  CONDITION_OPTIONS, 
  SERVICE_HISTORY_OPTIONS, 
  TITLE_STATUS_OPTIONS, 
  TIRE_CONDITION_OPTIONS, 
  PREVIOUS_USE_OPTIONS, 
  DASHBOARD_LIGHTS, 
  MODIFICATION_TYPES,
  AccidentDetails,
  ModificationDetails
} from '@/types/follow-up-answers';
import { saveFollowUpAnswers, loadFollowUpAnswers } from '@/services/followUpService';

interface UnifiedFollowUpFormProps {
  vin: string;
  onComplete?: (answers: FollowUpAnswers) => void;
}

export function UnifiedFollowUpForm({ vin, onComplete }: UnifiedFollowUpFormProps) {
  const [answers, setAnswers] = useState<FollowUpAnswers>({
    vin,
    mileage: undefined,
    zip_code: '',
    condition: 'good',
    accidents: { hadAccident: false },
    service_history: 'unknown',
    maintenance_status: 'Unknown',
    title_status: 'clean',
    previous_owners: 1,
    previous_use: 'personal',
    tire_condition: 'good',
    dashboard_lights: [],
    frame_damage: false,
    modifications: { modified: false, types: [] },
    completion_percentage: 0,
    is_complete: false
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load existing answers on mount
  useEffect(() => {
    loadExistingAnswers();
  }, [vin]);

  const loadExistingAnswers = async () => {
    try {
      setIsLoading(true);
      const existingAnswers = await loadFollowUpAnswers(vin);
      if (existingAnswers) {
        setAnswers(existingAnswers);
        console.log('📥 Loaded existing answers:', existingAnswers);
      }
    } catch (error) {
      console.error('❌ Error loading existing answers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateAnswers = (updates: Partial<FollowUpAnswers>) => {
    setAnswers(prev => {
      const updated = { ...prev, ...updates };
      // Calculate completion percentage
      const totalFields = 10;
      let filledFields = 0;
      if (updated.mileage) filledFields++;
      if (updated.zip_code) filledFields++;
      if (updated.condition) filledFields++;
      if (updated.service_history) filledFields++;
      if (updated.title_status) filledFields++;
      if (updated.tire_condition) filledFields++;
      if (updated.previous_owners) filledFields++;
      if (updated.previous_use) filledFields++;
      if (updated.accidents?.hadAccident !== undefined) filledFields++;
      if (updated.modifications?.modified !== undefined) filledFields++;
      
      updated.completion_percentage = Math.round((filledFields / totalFields) * 100);
      updated.is_complete = updated.completion_percentage >= 80;
      
      return updated;
    });
  };

  const handleAccidentChange = (field: keyof AccidentDetails, value: any) => {
    updateAnswers({
      accidents: {
        ...answers.accidents,
        [field]: value
      }
    });
  };

  const handleModificationChange = (field: keyof ModificationDetails, value: any) => {
    updateAnswers({
      modifications: {
        ...answers.modifications,
        [field]: value
      }
    });
  };

  const handleDashboardLightsChange = (lightValue: string, checked: boolean) => {
    const currentLights = answers.dashboard_lights || [];
    let updatedLights;
    
    if (lightValue === 'none') {
      updatedLights = checked ? ['none'] : [];
    } else {
      updatedLights = checked 
        ? [...currentLights.filter(l => l !== 'none'), lightValue]
        : currentLights.filter(l => l !== lightValue);
    }
    
    updateAnswers({ dashboard_lights: updatedLights });
  };

  const handleModificationTypesChange = (type: string, checked: boolean) => {
    const currentTypes = answers.modifications?.types || [];
    const updatedTypes = checked 
      ? [...currentTypes, type]
      : currentTypes.filter(t => t !== type);
    
    handleModificationChange('types', updatedTypes);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await saveFollowUpAnswers(answers);
      toast.success('Follow-up answers saved successfully!');
      
      if (onComplete) {
        onComplete(answers);
      }
    } catch (error) {
      console.error('❌ Error saving answers:', error);
      toast.error('Failed to save follow-up answers');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading vehicle information...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="h-5 w-5" />
            Vehicle Details & History
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300" 
                style={{ width: `${answers.completion_percentage}%` }}
              />
            </div>
            <span className="text-sm text-muted-foreground">
              {answers.completion_percentage}% complete
            </span>
          </div>
        </CardHeader>
      </Card>

      <Accordion type="multiple" defaultValue={["basics", "condition", "ownership", "maintenance"]} className="space-y-4">
        {/* Basic Information */}
        <AccordionItem value="basics">
          <AccordionTrigger className="text-lg font-semibold">
            <div className="flex items-center gap-2">
              <Car className="h-5 w-5" />
              Basic Information
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="mileage">Current Mileage</Label>
                    <Input
                      id="mileage"
                      type="number"
                      placeholder="e.g., 45000"
                      value={answers.mileage || ''}
                      onChange={(e) => updateAnswers({ mileage: parseInt(e.target.value) || undefined })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="zip_code">ZIP Code</Label>
                    <Input
                      id="zip_code"
                      placeholder="e.g., 90210"
                      value={answers.zip_code || ''}
                      onChange={(e) => updateAnswers({ zip_code: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* Condition & History */}
        <AccordionItem value="condition">
          <AccordionTrigger className="text-lg font-semibold">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Condition & History
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardContent className="p-6 space-y-6">
                {/* Overall Condition */}
                <div>
                  <Label className="text-base font-medium">Overall Condition</Label>
                  <RadioGroup 
                    value={answers.condition} 
                    onValueChange={(value) => updateAnswers({ condition: value as any })}
                    className="mt-2"
                  >
                    {CONDITION_OPTIONS.map((option) => (
                      <div key={option.value} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                        <RadioGroupItem value={option.value} id={option.value} />
                        <div className="flex-1">
                          <Label htmlFor={option.value} className="font-medium cursor-pointer">
                            {option.label}
                          </Label>
                          <p className="text-sm text-muted-foreground">{option.description}</p>
                          <p className="text-xs text-green-600">{option.impact}</p>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {/* Accident History */}
                <div>
                  <Label className="text-base font-medium">Accident History</Label>
                  <RadioGroup 
                    value={answers.accidents?.hadAccident ? 'yes' : 'no'} 
                    onValueChange={(value) => handleAccidentChange('hadAccident', value === 'yes')}
                    className="mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="no-accident" />
                      <Label htmlFor="no-accident">No accidents</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="has-accident" />
                      <Label htmlFor="has-accident">Has been in accident(s)</Label>
                    </div>
                  </RadioGroup>

                  {answers.accidents?.hadAccident && (
                    <div className="mt-4 space-y-4 p-4 border rounded-lg bg-orange-50">
                      <div>
                        <Label htmlFor="accident-severity">Accident Severity</Label>
                        <Select 
                          value={answers.accidents.severity} 
                          onValueChange={(value) => handleAccidentChange('severity', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select severity" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="minor">Minor (cosmetic damage)</SelectItem>
                            <SelectItem value="moderate">Moderate (body damage)</SelectItem>
                            <SelectItem value="major">Major (structural damage)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="repaired"
                          checked={answers.accidents.repaired || false}
                          onCheckedChange={(checked) => handleAccidentChange('repaired', checked)}
                        />
                        <Label htmlFor="repaired">Professionally repaired</Label>
                      </div>

                      <div>
                        <Label htmlFor="accident-description">Accident Description</Label>
                        <Textarea
                          id="accident-description"
                          placeholder="Describe the accident and repairs..."
                          value={answers.accidents.description || ''}
                          onChange={(e) => handleAccidentChange('description', e.target.value)}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Dashboard Warning Lights */}
                <div>
                  <Label className="text-base font-medium">Dashboard Warning Lights</Label>
                  <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2">
                    {DASHBOARD_LIGHTS.map((light) => (
                      <div key={light.value} className="flex items-center space-x-2 p-2 border rounded">
                        <Checkbox
                          id={light.value}
                          checked={(answers.dashboard_lights || []).includes(light.value)}
                          onCheckedChange={(checked) => handleDashboardLightsChange(light.value, !!checked)}
                        />
                        <Label htmlFor={light.value} className="text-sm">
                          {light.icon} {light.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tire Condition */}
                <div>
                  <Label className="text-base font-medium">Tire Condition</Label>
                  <Select 
                    value={answers.tire_condition} 
                    onValueChange={(value) => updateAnswers({ tire_condition: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select tire condition" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIRE_CONDITION_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label} - {option.impact}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* Ownership & Title */}
        <AccordionItem value="ownership">
          <AccordionTrigger className="text-lg font-semibold">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Ownership & Title
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title-status">Title Status</Label>
                    <Select 
                      value={answers.title_status} 
                      onValueChange={(value) => updateAnswers({ title_status: value })}
                    >
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

                  <div>
                    <Label htmlFor="previous-owners">Number of Previous Owners</Label>
                    <Input
                      id="previous-owners"
                      type="number"
                      min="1"
                      max="10"
                      value={answers.previous_owners || 1}
                      onChange={(e) => updateAnswers({ previous_owners: parseInt(e.target.value) || 1 })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="previous-use">Previous Use</Label>
                  <Select 
                    value={answers.previous_use} 
                    onValueChange={(value) => updateAnswers({ previous_use: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select previous use" />
                    </SelectTrigger>
                    <SelectContent>
                      {PREVIOUS_USE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label} - {option.impact}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* Maintenance & Service */}
        <AccordionItem value="maintenance">
          <AccordionTrigger className="text-lg font-semibold">
            <div className="flex items-center gap-2">
              <Wrench className="h-5 w-5" />
              Maintenance & Service
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardContent className="p-6 space-y-4">
                <div>
                  <Label htmlFor="service-history">Service History</Label>
                  <Select 
                    value={answers.service_history} 
                    onValueChange={(value) => updateAnswers({ service_history: value })}
                  >
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

                <div>
                  <Label htmlFor="maintenance-status">Current Maintenance Status</Label>
                  <Select 
                    value={answers.maintenance_status} 
                    onValueChange={(value) => updateAnswers({ maintenance_status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select maintenance status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Up to date">Up to date</SelectItem>
                      <SelectItem value="Overdue">Overdue</SelectItem>
                      <SelectItem value="Unknown">Unknown</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="last-service">Last Service Date (Optional)</Label>
                  <Input
                    id="last-service"
                    type="date"
                    value={answers.last_service_date || ''}
                    onChange={(e) => updateAnswers({ last_service_date: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* Modifications */}
        <AccordionItem value="modifications">
          <AccordionTrigger className="text-lg font-semibold">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Modifications
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardContent className="p-6 space-y-4">
                <div>
                  <Label className="text-base font-medium">Has Modifications</Label>
                  <RadioGroup 
                    value={answers.modifications?.modified ? 'yes' : 'no'} 
                    onValueChange={(value) => handleModificationChange('modified', value === 'yes')}
                    className="mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="no-mods" />
                      <Label htmlFor="no-mods">No modifications</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="has-mods" />
                      <Label htmlFor="has-mods">Has modifications</Label>
                    </div>
                  </RadioGroup>

                  {answers.modifications?.modified && (
                    <div className="mt-4 space-y-4 p-4 border rounded-lg bg-blue-50">
                      <div>
                        <Label className="text-base font-medium">Modification Types</Label>
                        <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2">
                          {MODIFICATION_TYPES.map((type) => (
                            <div key={type} className="flex items-center space-x-2">
                              <Checkbox
                                id={type}
                                checked={(answers.modifications?.types || []).includes(type)}
                                onCheckedChange={(checked) => handleModificationTypesChange(type, !!checked)}
                              />
                              <Label htmlFor={type} className="text-sm">{type}</Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="reversible"
                          checked={answers.modifications.reversible || false}
                          onCheckedChange={(checked) => handleModificationChange('reversible', checked)}
                        />
                        <Label htmlFor="reversible">Modifications are reversible</Label>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Submit Button */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {answers.is_complete && <CheckCircle className="h-5 w-5 text-green-600" />}
              <span className="text-sm text-muted-foreground">
                {answers.is_complete ? 'Ready for valuation' : 'Please complete more fields for accurate valuation'}
              </span>
            </div>
            <Button 
              onClick={handleSave} 
              disabled={isSaving}
              className="min-w-[120px]"
            >
              {isSaving ? 'Saving...' : 'Save & Continue'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
