
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Info } from 'lucide-react';
import { toast } from 'sonner';

// Import the locked/verified specialized components
import { ConditionSelector } from '@/components/valuation/enhanced-followup/ConditionSelector';
import { AccidentSection } from '@/components/valuation/enhanced-followup/AccidentSection';
import { DashboardLightsSection } from '@/components/valuation/enhanced-followup/DashboardLightsSection';
import { useFollowUpAnswers } from '@/components/valuation/enhanced-followup/hooks/useFollowUpAnswers';

import { ManualEntryFormData } from '@/components/lookup/types/manualEntry';
import { MAINTENANCE_STATUS_OPTIONS, TITLE_STATUS_OPTIONS, PREVIOUS_USE_OPTIONS, TIRE_CONDITION_OPTIONS } from '@/types/follow-up-answers';

interface UnifiedFollowUpFormProps {
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
    vin || plateNumber || 'manual',
    undefined
  );

  // Initialize form data based on entry method
  const [formData, setFormData] = useState({
    mileage: initialData?.mileage ? String(initialData.mileage) : answers.mileage || '',
    zipCode: initialData?.zipCode || answers.zip_code || '',
    serviceHistory: answers.service_history || '',
    maintenanceStatus: answers.maintenance_status || '',
    titleStatus: answers.title_status || '',
    previousOwners: answers.previous_owners || '',
    previousUse: answers.previous_use || '',
    tireCondition: answers.tire_condition || '',
    frameDamage: answers.frame_damage || false,
  });

  const handleFormDataChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    updateAnswers({ [field]: value });
  };

  const calculateCompletionPercentage = () => {
    const totalFields = 13;
    let completedFields = 0;
    
    if (formData.mileage) completedFields++;
    if (formData.zipCode) completedFields++;
    if (answers.condition) completedFields++;
    if (answers.accidents?.hadAccident !== undefined) completedFields++;
    if (formData.serviceHistory) completedFields++;
    if (formData.maintenanceStatus) completedFields++;
    if (formData.titleStatus) completedFields++;
    if (formData.previousOwners) completedFields++;
    if (formData.previousUse) completedFields++;
    if (formData.tireCondition) completedFields++;
    if (answers.dashboard_lights?.length) completedFields++;
    if (formData.frameDamage !== undefined) completedFields++;
    if (answers.modifications?.modified !== undefined) completedFields++;

    return Math.round((completedFields / totalFields) * 100);
  };

  const handleSubmit = async () => {
    const finalAnswers = {
      ...answers,
      ...formData,
      completion_percentage: calculateCompletionPercentage(),
      is_complete: calculateCompletionPercentage() >= 80
    };

    const success = await saveAnswers(finalAnswers);
    if (success && onComplete) {
      onComplete();
    }
  };

  const completionPercentage = calculateCompletionPercentage();

  if (loading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="h-5 w-5 text-primary" />
          Vehicle Assessment Details
        </CardTitle>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Assessment Progress</span>
            <span>{completionPercentage}% Complete</span>
          </div>
          <Progress value={completionPercentage} className="h-2" />
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <Accordion type="multiple" className="w-full space-y-4">
          {/* Basic Vehicle Information */}
          <AccordionItem value="basic-info" className="border rounded-lg">
            <AccordionTrigger className="px-4 py-3 hover:no-underline">
              <div className="flex items-center gap-2">
                {formData.mileage && formData.zipCode ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <div className="h-4 w-4 border-2 border-gray-300 rounded-full" />
                )}
                <span>Basic Information</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="mileage">Current Mileage</Label>
                  <Input
                    id="mileage"
                    type="number"
                    placeholder="Enter current mileage"
                    value={formData.mileage}
                    onChange={(e) => handleFormDataChange('mileage', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="zipCode">ZIP Code</Label>
                  <Input
                    id="zipCode"
                    placeholder="Enter ZIP code"
                    value={formData.zipCode}
                    onChange={(e) => handleFormDataChange('zipCode', e.target.value)}
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Vehicle Condition - LOCKED COMPONENT */}
          <AccordionItem value="condition" className="border rounded-lg">
            <AccordionTrigger className="px-4 py-3 hover:no-underline">
              <div className="flex items-center gap-2">
                {answers.condition ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <div className="h-4 w-4 border-2 border-gray-300 rounded-full" />
                )}
                <span>Vehicle Condition</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <ConditionSelector
                value={answers.condition}
                onChange={(value) => updateAnswers({ condition: value })}
              />
            </AccordionContent>
          </AccordionItem>

          {/* Accident History - LOCKED COMPONENT */}
          <AccordionItem value="accidents" className="border rounded-lg">
            <AccordionTrigger className="px-4 py-3 hover:no-underline">
              <div className="flex items-center gap-2">
                {answers.accidents?.hadAccident !== undefined ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <div className="h-4 w-4 border-2 border-gray-300 rounded-full" />
                )}
                <span>Accident History</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <AccidentSection
                value={answers.accidents}
                onChange={(value) => updateAnswers({ accidents: value })}
              />
            </AccordionContent>
          </AccordionItem>

          {/* Service History & Title Status */}
          <AccordionItem value="service-title" className="border rounded-lg">
            <AccordionTrigger className="px-4 py-3 hover:no-underline">
              <div className="flex items-center gap-2">
                {formData.serviceHistory && formData.titleStatus ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <div className="h-4 w-4 border-2 border-gray-300 rounded-full" />
                )}
                <span>Service History & Title</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 space-y-4">
              <div>
                <Label htmlFor="serviceHistory">Service History Quality</Label>
                <Select
                  value={formData.serviceHistory}
                  onValueChange={(value) => handleFormDataChange('serviceHistory', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select service history quality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="excellent">Excellent - Complete records</SelectItem>
                    <SelectItem value="good">Good - Most records available</SelectItem>
                    <SelectItem value="fair">Fair - Some records missing</SelectItem>
                    <SelectItem value="poor">Poor - Limited records</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="maintenanceStatus">Current Maintenance Status</Label>
                <Select
                  value={formData.maintenanceStatus}
                  onValueChange={(value) => handleFormDataChange('maintenanceStatus', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select maintenance status" />
                  </SelectTrigger>
                  <SelectContent>
                    {MAINTENANCE_STATUS_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="titleStatus">Title Status</Label>
                <Select
                  value={formData.titleStatus}
                  onValueChange={(value) => handleFormDataChange('titleStatus', value)}
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
            </AccordionContent>
          </AccordionItem>

          {/* Dashboard Warnings - LOCKED COMPONENT */}
          <AccordionItem value="dashboard" className="border rounded-lg">
            <AccordionTrigger className="px-4 py-3 hover:no-underline">
              <div className="flex items-center gap-2">
                {answers.dashboard_lights?.length ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <div className="h-4 w-4 border-2 border-gray-300 rounded-full" />
                )}
                <span>Dashboard Warnings</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <DashboardLightsSection
                value={answers.dashboard_lights}
                onChange={(value) => updateAnswers({ dashboard_lights: value })}
              />
            </AccordionContent>
          </AccordionItem>

          {/* Vehicle Usage & Condition Details */}
          <AccordionItem value="usage-details" className="border rounded-lg">
            <AccordionTrigger className="px-4 py-3 hover:no-underline">
              <div className="flex items-center gap-2">
                {formData.previousUse && formData.tireCondition ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <div className="h-4 w-4 border-2 border-gray-300 rounded-full" />
                )}
                <span>Usage & Condition Details</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="previousOwners">Number of Previous Owners</Label>
                  <Input
                    id="previousOwners"
                    type="number"
                    min="0"
                    max="20"
                    placeholder="Enter number of owners"
                    value={formData.previousOwners}
                    onChange={(e) => handleFormDataChange('previousOwners', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="previousUse">Primary Previous Use</Label>
                  <Select
                    value={formData.previousUse}
                    onValueChange={(value) => handleFormDataChange('previousUse', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select previous use" />
                    </SelectTrigger>
                    <SelectContent>
                      {PREVIOUS_USE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="tireCondition">Tire Condition</Label>
                <Select
                  value={formData.tireCondition}
                  onValueChange={(value) => handleFormDataChange('tireCondition', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select tire condition" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIRE_CONDITION_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Separator />

        <div className="flex items-center justify-between pt-4">
          <div className="text-sm text-muted-foreground">
            {saving ? 'Saving...' : 'Progress automatically saved'}
          </div>
          <Button 
            onClick={handleSubmit}
            disabled={saving || completionPercentage < 60}
            className="min-w-32"
          >
            {saving ? 'Processing...' : 'Complete Assessment'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
