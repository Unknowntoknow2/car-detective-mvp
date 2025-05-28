
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, MapPin, Wrench, FileText } from 'lucide-react';
import { toast } from 'sonner';

import { useFollowUpAnswers } from '../valuation/enhanced-followup/hooks/useFollowUpAnswers';
import { ConditionSelector } from '../valuation/enhanced-followup/ConditionSelector';
import { AccidentSection } from '../valuation/enhanced-followup/AccidentSection';
import { DashboardLightsSection } from '../valuation/enhanced-followup/DashboardLightsSection';
import { ModificationsSection } from '../valuation/enhanced-followup/ModificationsSection';

import { CONDITION_OPTIONS, SERVICE_HISTORY_OPTIONS, TITLE_STATUS_OPTIONS, 
         TIRE_CONDITION_OPTIONS, PREVIOUS_USE_OPTIONS } from '@/types/follow-up-answers';
import type { ManualEntryFormData } from '../lookup/types/manualEntry';

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
  onComplete
}) => {
  const vinToUse = vin || (initialData?.vin ? String(initialData.vin) : '');
  
  const { answers, loading, saving, updateAnswers, saveAnswers } = useFollowUpAnswers(
    vinToUse,
    undefined // valuation_id can be passed here if available
  );

  // Initialize form with data from different entry methods
  useEffect(() => {
    if (initialData && entryMethod === 'manual') {
      const updates: any = {};
      
      if (initialData.mileage) {
        updates.mileage = typeof initialData.mileage === 'number' ? initialData.mileage : parseInt(String(initialData.mileage));
      }
      if (initialData.zip_code) {
        updates.zip_code = String(initialData.zip_code);
      }
      if (initialData.condition) {
        updates.condition = String(initialData.condition);
      }
      
      updateAnswers(updates);
    }
  }, [initialData, entryMethod, updateAnswers]);

  const handleInputChange = (field: string, value: any) => {
    updateAnswers({ [field]: value });
  };

  const handleComplete = async () => {
    const success = await saveAnswers();
    if (success && onComplete) {
      onComplete();
    }
  };

  const getProgressPercentage = () => {
    const requiredFields = [
      'mileage', 'zip_code', 'condition', 'accidents', 'service_history',
      'title_status', 'tire_condition', 'dashboard_lights'
    ];
    
    const completedFields = requiredFields.filter(field => {
      const value = answers[field as keyof typeof answers];
      return value !== null && value !== undefined && value !== '';
    });
    
    return Math.round((completedFields.length / requiredFields.length) * 100);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading follow-up questions...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-primary" />
              Vehicle Assessment
            </CardTitle>
            <Badge variant="outline">{getProgressPercentage()}% Complete</Badge>
          </div>
          <Progress value={getProgressPercentage()} className="mt-2" />
        </CardHeader>
      </Card>

      {/* Follow-up Questions */}
      <Accordion type="multiple">
        {/* Basic Information */}
        <AccordionItem value="basic-info">
          <AccordionTrigger className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Basic Information
          </AccordionTrigger>
          <AccordionContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="mileage">Current Mileage</Label>
                <Input
                  id="mileage"
                  type="number"
                  value={answers.mileage || ''}
                  onChange={(e) => handleInputChange('mileage', parseInt(e.target.value) || null)}
                  placeholder="e.g., 45000"
                />
              </div>
              <div>
                <Label htmlFor="zip_code">Zip Code</Label>
                <Input
                  id="zip_code"
                  value={answers.zip_code || ''}
                  onChange={(e) => handleInputChange('zip_code', e.target.value)}
                  placeholder="e.g., 90210"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Vehicle Condition */}
        <AccordionItem value="condition">
          <AccordionTrigger className="flex items-center gap-2">
            <Wrench className="h-4 w-4" />
            Vehicle Condition
          </AccordionTrigger>
          <AccordionContent className="space-y-4">
            <div>
              <Label>Overall Condition</Label>
              <ConditionSelector
                value={answers.condition}
                onChange={(value) => handleInputChange('condition', value)}
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Accident History */}
        <AccordionItem value="accidents">
          <AccordionTrigger>Accident History</AccordionTrigger>
          <AccordionContent>
            <AccidentSection
              accidents={answers.accidents}
              onChange={(value) => handleInputChange('accidents', value)}
            />
          </AccordionContent>
        </AccordionItem>

        {/* Service & Maintenance */}
        <AccordionItem value="service">
          <AccordionTrigger className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Service & Maintenance
          </AccordionTrigger>
          <AccordionContent className="space-y-4">
            <div>
              <Label>Service History</Label>
              <select
                className="w-full p-2 border rounded-md"
                value={answers.service_history || ''}
                onChange={(e) => handleInputChange('service_history', e.target.value)}
              >
                <option value="">Select service history</option>
                {SERVICE_HISTORY_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Title & Ownership */}
        <AccordionItem value="title">
          <AccordionTrigger>Title & Ownership</AccordionTrigger>
          <AccordionContent className="space-y-4">
            <div>
              <Label>Title Status</Label>
              <select
                className="w-full p-2 border rounded-md"
                value={answers.title_status || ''}
                onChange={(e) => handleInputChange('title_status', e.target.value)}
              >
                <option value="">Select title status</option>
                {TITLE_STATUS_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Dashboard Lights */}
        <AccordionItem value="dashboard">
          <AccordionTrigger>Dashboard Warning Lights</AccordionTrigger>
          <AccordionContent>
            <DashboardLightsSection
              dashboardLights={answers.dashboard_lights || []}
              onChange={(lights) => handleInputChange('dashboard_lights', lights)}
            />
          </AccordionContent>
        </AccordionItem>

        {/* Modifications */}
        <AccordionItem value="modifications">
          <AccordionTrigger>Vehicle Modifications</AccordionTrigger>
          <AccordionContent>
            <ModificationsSection
              modifications={answers.modifications}
              onChange={(value) => handleInputChange('modifications', value)}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={() => saveAnswers()}>
          {saving ? 'Saving...' : 'Save Progress'}
        </Button>
        <Button 
          onClick={handleComplete}
          disabled={getProgressPercentage() < 50}
        >
          Complete Assessment
        </Button>
      </div>
    </div>
  );
};
