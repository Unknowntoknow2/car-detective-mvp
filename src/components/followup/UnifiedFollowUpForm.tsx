import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import { CheckCircle, AlertCircle, Clock, Car, Wrench, FileText, Cog } from 'lucide-react';
import { useFollowUpAnswers } from './hooks/useFollowUpAnswers';
import { AccidentSection } from '../valuation/enhanced-followup/AccidentSection';
import { ConditionSelector } from '../valuation/enhanced-followup/ConditionSelector';
import { DashboardLightsSection } from '../valuation/enhanced-followup/DashboardLightsSection';
import { TitleStatusSelector } from '../title-ownership/TitleStatusSelector';
import { EnhancedVehicleCard } from '../valuation/enhanced-followup/EnhancedVehicleCard';
import { 
  CONDITION_OPTIONS,
  SERVICE_HISTORY_OPTIONS,
  TITLE_STATUS_OPTIONS,
  TIRE_CONDITION_OPTIONS,
  PREVIOUS_USE_OPTIONS 
} from '@/types/follow-up-answers';
import { ManualEntryFormData } from '../lookup/types/manualEntry';

interface UnifiedFollowUpFormProps {
  vin?: string;
  plateNumber?: string;
  initialData?: ManualEntryFormData;
  entryMethod?: 'vin' | 'plate' | 'manual';
  onComplete?: () => void;
}

interface SectionState {
  vehicleInfo: boolean;
  condition: boolean;
  service: boolean;
  title: boolean;
  modifications: boolean;
}

export function UnifiedFollowUpForm({ vin, plateNumber, initialData, entryMethod = 'vin', onComplete }: UnifiedFollowUpFormProps) {
  const identifier = vin || plateNumber || (initialData?.vin) || '';
  const { answers, loading, saving, updateAnswers, saveAnswers } = useFollowUpAnswers(identifier);

  const [expandedSections, setExpandedSections] = useState<SectionState>({
    vehicleInfo: true,
    condition: false,
    service: false,
    title: false,
    modifications: false,
  });

  const toggleSection = (section: keyof SectionState) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleSave = useCallback(async () => {
    if (saving) return;

    const result = await saveAnswers();

    if (result?.success) {
      toast.success('Follow-up data saved successfully!');
      onComplete?.();
    } else {
      toast.error(result?.error || 'Failed to save follow-up data.');
    }
  }, [saving, saveAnswers, onComplete]);

  if (loading) {
    return (
      <Card>
        <CardContent>
          <div className="flex items-center justify-center h-48">
            <Clock className="mr-2 h-4 w-4 animate-spin" />
            Loading follow-up form...
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vehicle Condition & History</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Accordion type="multiple" collapsible>
          {/* Vehicle Information Section */}
          <AccordionItem value="vehicle-info">
            <AccordionTrigger onClick={() => toggleSection('vehicleInfo')}>
              <div className="flex items-center space-x-2">
                <Car className="h-5 w-5 mr-2" />
                <span>Vehicle Information</span>
                {expandedSections.vehicleInfo ? (
                  <CheckCircle className="text-green-500 h-4 w-4 ml-auto" />
                ) : (
                  <AlertCircle className="text-amber-500 h-4 w-4 ml-auto" />
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <EnhancedVehicleCard
                vehicle={{
                  make: initialData?.make || 'N/A',
                  model: initialData?.model || 'N/A',
                  year: initialData?.year || 2000,
                  vin: vin || 'N/A',
                }}
              />
            </AccordionContent>
          </AccordionItem>

          {/* Condition Section */}
          <AccordionItem value="condition">
            <AccordionTrigger onClick={() => toggleSection('condition')}>
              <div className="flex items-center space-x-2">
                <Cog className="h-5 w-5 mr-2" />
                <span>Condition Assessment</span>
                {expandedSections.condition ? (
                  <CheckCircle className="text-green-500 h-4 w-4 ml-auto" />
                ) : (
                  <AlertCircle className="text-amber-500 h-4 w-4 ml-auto" />
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <ConditionSelector
                value={answers?.condition || 'good'}
                onChange={(value) => updateAnswers({ condition: value })}
                options={CONDITION_OPTIONS}
              />
            </AccordionContent>
          </AccordionItem>

          {/* Accident History Section */}
          <AccordionItem value="accident-history">
            <AccordionTrigger onClick={() => toggleSection('service')}>
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
                <span>Accident History</span>
                {expandedSections.service ? (
                  <CheckCircle className="text-green-500 h-4 w-4 ml-auto" />
                ) : (
                  <AlertCircle className="text-amber-500 h-4 w-4 ml-auto" />
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <AccidentSection
                hadAccident={answers?.accidents?.hadAccident}
                onChange={(value) => updateAnswers({ accidents: { ...answers?.accidents, hadAccident: value } })}
              />
            </AccordionContent>
          </AccordionItem>

          {/* Title Status Section */}
          <AccordionItem value="title-status">
            <AccordionTrigger onClick={() => toggleSection('title')}>
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 mr-2" />
                <span>Title & Ownership</span>
                {expandedSections.title ? (
                  <CheckCircle className="text-green-500 h-4 w-4 ml-auto" />
                ) : (
                  <AlertCircle className="text-amber-500 h-4 w-4 ml-auto" />
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <TitleStatusSelector
                value={answers?.title_status || 'clean'}
                onChange={(value) => updateAnswers({ title_status: value })}
              />
            </AccordionContent>
          </AccordionItem>

          {/* Dashboard Lights Section */}
          <AccordionItem value="dashboard-lights">
            <AccordionTrigger onClick={() => toggleSection('modifications')}>
              <div className="flex items-center space-x-2">
                <Wrench className="h-5 w-5 mr-2" />
                <span>Dashboard Lights</span>
                {expandedSections.modifications ? (
                  <CheckCircle className="text-green-500 h-4 w-4 ml-auto" />
                ) : (
                  <AlertCircle className="text-amber-500 h-4 w-4 ml-auto" />
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <DashboardLightsSection
                selectedLights={answers?.dashboard_lights || []}
                onChange={(lights) => updateAnswers({ dashboard_lights: lights })}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Separator />
        <div className="flex justify-between">
          <Badge variant="secondary">
            {identifier}
          </Badge>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save & Complete'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
