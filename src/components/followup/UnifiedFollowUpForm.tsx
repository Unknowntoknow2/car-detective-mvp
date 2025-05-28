
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { useFollowUpAnswers } from '../valuation/enhanced-followup/hooks/useFollowUpAnswers';
import { ConditionSelector } from '../valuation/enhanced-followup/ConditionSelector';
import { AccidentSection } from '../valuation/enhanced-followup/AccidentSection';
import { DashboardLightsSection } from '../valuation/enhanced-followup/DashboardLightsSection';
import { ManualEntryFormData } from '../lookup/types/manualEntry';
import { AccidentDetails, CONDITION_OPTIONS } from '@/types/follow-up-answers';

export interface UnifiedFollowUpFormProps {
  vin?: string;
  plateNumber?: string;
  initialData?: ManualEntryFormData;
  entryMethod: 'vin' | 'plate' | 'manual';
  onComplete?: () => void;
}

export const UnifiedFollowUpForm: React.FC<UnifiedFollowUpFormProps> = ({
  vin,
  plateNumber,
  initialData,
  entryMethod,
  onComplete,
}) => {
  const { answers, loading, saving, updateAnswers, saveAnswers } = useFollowUpAnswers(
    vin || plateNumber || '',
    undefined
  );

  const [formData, setFormData] = useState({
    mileage: '',
    zipCode: '',
    condition: '',
    accidents: { hadAccident: false } as AccidentDetails,
    serviceHistory: '',
    maintenanceStatus: '',
    titleStatus: '',
    previousOwners: '',
    previousUse: '',
    tireCondition: '',
    dashboardLights: [] as string[],
    frameDamage: false,
    modifications: { modified: false }
  });

  useEffect(() => {
    if (answers) {
      setFormData({
        mileage: answers.mileage || '',
        zipCode: answers.zip_code || '',
        condition: answers.condition || '',
        accidents: answers.accidents || { hadAccident: false },
        serviceHistory: answers.service_history || '',
        maintenanceStatus: answers.maintenance_status || '',
        titleStatus: answers.title_status || '',
        previousOwners: answers.previous_owners || '',
        previousUse: answers.previous_use || '',
        tireCondition: answers.tire_condition || '',
        dashboardLights: answers.dashboard_lights || [],
        frameDamage: answers.frame_damage || false,
        modifications: answers.modifications || { modified: false }
      });
    }
  }, [answers]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    const updateData: any = { [field]: value };
    if (field === 'mileage') updateData.mileage = value;
    if (field === 'zipCode') updateData.zip_code = value;
    if (field === 'condition') updateData.condition = value;
    if (field === 'accidents') updateData.accidents = value;
    if (field === 'serviceHistory') updateData.service_history = value;
    if (field === 'maintenanceStatus') updateData.maintenance_status = value;
    if (field === 'titleStatus') updateData.title_status = value;
    if (field === 'previousOwners') updateData.previous_owners = value;
    if (field === 'previousUse') updateData.previous_use = value;
    if (field === 'tireCondition') updateData.tire_condition = value;
    if (field === 'dashboardLights') updateData.dashboard_lights = value;
    if (field === 'frameDamage') updateData.frame_damage = value;
    if (field === 'modifications') updateData.modifications = value;

    updateAnswers(updateData);
  };

  const handleSubmit = async () => {
    const success = await saveAnswers();
    if (success) {
      toast.success('Follow-up completed successfully!');
      onComplete?.();
    }
  };

  const calculateProgress = () => {
    const fields = Object.values(formData);
    const completed = fields.filter(field => {
      if (typeof field === 'string') return field.trim() !== '';
      if (typeof field === 'boolean') return true;
      if (Array.isArray(field)) return field.length > 0;
      if (typeof field === 'object') return Object.keys(field).length > 0;
      return false;
    }).length;
    return Math.round((completed / fields.length) * 100);
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Vehicle Assessment Follow-Up</CardTitle>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Progress: {calculateProgress()}% complete</span>
              <span>{saving ? 'Saving...' : 'Auto-saved'}</span>
            </div>
            <Progress value={calculateProgress()} className="w-full" />
          </div>
        </CardHeader>
      </Card>

      <Accordion type="multiple" className="space-y-4">
        <AccordionItem value="basic-info">
          <AccordionTrigger>Basic Vehicle Information</AccordionTrigger>
          <AccordionContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="mileage">Current Mileage</Label>
                <Input
                  id="mileage"
                  type="number"
                  placeholder="Enter mileage"
                  value={formData.mileage}
                  onChange={(e) => handleInputChange('mileage', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="zipCode">Zip Code</Label>
                <Input
                  id="zipCode"
                  placeholder="Enter zip code"
                  value={formData.zipCode}
                  onChange={(e) => handleInputChange('zipCode', e.target.value)}
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="condition">
          <AccordionTrigger>Vehicle Condition</AccordionTrigger>
          <AccordionContent>
            <ConditionSelector
              value={formData.condition}
              onChange={(value) => handleInputChange('condition', value)}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="accidents">
          <AccordionTrigger>Accident History</AccordionTrigger>
          <AccordionContent>
            <AccidentSection
              value={formData.accidents}
              onChange={(value) => handleInputChange('accidents', value)}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="maintenance">
          <AccordionTrigger>Service & Maintenance</AccordionTrigger>
          <AccordionContent className="space-y-4">
            <div>
              <Label htmlFor="serviceHistory">Service History</Label>
              <Select
                value={formData.serviceHistory}
                onValueChange={(value) => handleInputChange('serviceHistory', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select service history" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excellent">Excellent - Full records</SelectItem>
                  <SelectItem value="good">Good - Most records available</SelectItem>
                  <SelectItem value="fair">Fair - Some records missing</SelectItem>
                  <SelectItem value="poor">Poor - No records</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="maintenanceStatus">Current Maintenance Status</Label>
              <Select
                value={formData.maintenanceStatus}
                onValueChange={(value) => handleInputChange('maintenanceStatus', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select maintenance status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="up-to-date">Up to date</SelectItem>
                  <SelectItem value="minor-needed">Minor service needed</SelectItem>
                  <SelectItem value="major-needed">Major service needed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="dashboard-lights">
          <AccordionTrigger>Dashboard Warning Lights</AccordionTrigger>
          <AccordionContent>
            <DashboardLightsSection
              value={formData.dashboardLights}
              onChange={(value) => handleInputChange('dashboardLights', value)}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="ownership">
          <AccordionTrigger>Ownership & Usage</AccordionTrigger>
          <AccordionContent className="space-y-4">
            <div>
              <Label htmlFor="titleStatus">Title Status</Label>
              <Select
                value={formData.titleStatus}
                onValueChange={(value) => handleInputChange('titleStatus', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select title status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="clean">Clean</SelectItem>
                  <SelectItem value="salvage">Salvage</SelectItem>
                  <SelectItem value="flood">Flood</SelectItem>
                  <SelectItem value="lemon">Lemon</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="previousOwners">Number of Previous Owners</Label>
              <Input
                id="previousOwners"
                type="number"
                min="0"
                max="10"
                placeholder="Enter number"
                value={formData.previousOwners}
                onChange={(e) => handleInputChange('previousOwners', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="previousUse">Previous Use</Label>
              <Select
                value={formData.previousUse}
                onValueChange={(value) => handleInputChange('previousUse', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select previous use" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="personal">Personal use</SelectItem>
                  <SelectItem value="fleet">Fleet vehicle</SelectItem>
                  <SelectItem value="rental">Rental car</SelectItem>
                  <SelectItem value="commercial">Commercial use</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="flex justify-end space-x-4">
        <Button variant="outline" onClick={() => saveAnswers()}>
          Save Progress
        </Button>
        <Button onClick={handleSubmit} disabled={saving}>
          {saving ? 'Submitting...' : 'Complete Assessment'}
        </Button>
      </div>
    </div>
  );
};
