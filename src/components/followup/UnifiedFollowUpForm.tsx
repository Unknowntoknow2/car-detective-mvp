import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, Info, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { ConditionSelector } from '@/components/valuation/enhanced-followup/ConditionSelector';
import { AccidentSection } from '@/components/valuation/enhanced-followup/AccidentSection';
import { DashboardLightsSection } from '@/components/valuation/enhanced-followup/DashboardLightsSection';

import { 
  FollowUpAnswers, 
  AccidentDetails, 
  ModificationDetails,
  CONDITION_OPTIONS,
  SERVICE_HISTORY_OPTIONS,
  MAINTENANCE_STATUS_OPTIONS,
  TITLE_STATUS_OPTIONS,
  TIRE_CONDITION_OPTIONS,
  PREVIOUS_USE_OPTIONS,
  MODIFICATION_TYPES
} from '@/types/follow-up-answers';
import { ManualEntryFormData } from '@/components/lookup/types/manualEntry';

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
  onComplete
}) => {
  const [answers, setAnswers] = useState<FollowUpAnswers>({
    vin: vin || '',
    mileage: initialData?.mileage || undefined,
    zip_code: initialData?.zipCode || '',
    condition: initialData?.condition || 'good',
    completion_percentage: 0,
    is_complete: false
  });

  const [currentSection, setCurrentSection] = useState(0);
  const [completedSections, setCompletedSections] = useState<Set<number>>(new Set());

  const sections = [
    { id: 'basic', title: 'Basic Information', required: true },
    { id: 'condition', title: 'Vehicle Condition', required: true },
    { id: 'accidents', title: 'Accident History', required: true },
    { id: 'dashboard', title: 'Dashboard Warnings', required: true },
    { id: 'maintenance', title: 'Service History & Title', required: true },
    { id: 'modifications', title: 'Modifications & Custom Work', required: false }
  ];

  const updateAnswers = (updates: Partial<FollowUpAnswers>) => {
    setAnswers(prev => ({ ...prev, ...updates }));
  };

  const calculateProgress = () => {
    const totalSections = sections.length;
    const completed = completedSections.size;
    return Math.round((completed / totalSections) * 100);
  };

  const markSectionComplete = (sectionIndex: number) => {
    setCompletedSections(prev => new Set([...prev, sectionIndex]));
  };

  const handleSubmit = async () => {
    try {
      const finalAnswers: FollowUpAnswers = {
        ...answers,
        mileage: typeof answers.mileage === 'string' ? parseInt(answers.mileage) : answers.mileage,
        completion_percentage: 100,
        is_complete: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log('Submitting follow-up answers:', finalAnswers);
      toast.success('Assessment completed successfully!');
      
      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error('Error submitting follow-up:', error);
      toast.error('Failed to complete assessment. Please try again.');
    }
  };

  const renderBasicSection = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="mileage">Current Mileage</Label>
          <Input
            id="mileage"
            type="number"
            placeholder="Enter mileage"
            value={answers.mileage || ''}
            onChange={(e) => updateAnswers({ mileage: parseInt(e.target.value) || 0 })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="zip_code">ZIP Code</Label>
          <Input
            id="zip_code"
            placeholder="Enter ZIP code"
            value={answers.zip_code || ''}
            onChange={(e) => updateAnswers({ zip_code: e.target.value })}
          />
        </div>
      </div>
    </div>
  );

  const renderMaintenanceSection = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label>Service History</Label>
          <Select 
            value={answers.service_history || ''} 
            onValueChange={(value) => updateAnswers({ service_history: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select service history type" />
            </SelectTrigger>
            <SelectContent>
              {SERVICE_HISTORY_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex justify-between items-center w-full">
                    <span>{option.label}</span>
                    <Badge variant="outline" className="ml-2 text-xs">
                      {option.impact}
                    </Badge>
                  </div>
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
              <SelectValue placeholder="Select maintenance status" />
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
                  <div className="flex justify-between items-center w-full">
                    <span>{option.label}</span>
                    <Badge variant="outline" className="ml-2 text-xs">
                      {option.impact}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  const renderModificationsSection = () => (
    <div className="space-y-4">
      <div className="space-y-4">
        <div>
          <Label>Are there any modifications to this vehicle?</Label>
          <Select 
            value={answers.modifications?.modified ? 'yes' : 'no'} 
            onValueChange={(value) => {
              const hasModifications = value === 'yes';
              updateAnswers({ 
                modifications: { 
                  modified: hasModifications,
                  reversible: answers.modifications?.reversible || false,
                  types: hasModifications ? (answers.modifications?.types || []) : undefined
                } 
              });
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select modification status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="no">No modifications</SelectItem>
              <SelectItem value="yes">Yes, has modifications</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {answers.modifications?.modified && (
          <>
            <div>
              <Label>Are the modifications reversible?</Label>
              <Select 
                value={answers.modifications.reversible ? 'yes' : 'no'} 
                onValueChange={(value) => {
                  updateAnswers({ 
                    modifications: { 
                      ...answers.modifications!,
                      reversible: value === 'yes'
                    } 
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select reversibility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes, reversible</SelectItem>
                  <SelectItem value="no">No, permanent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Types of modifications (select all that apply)</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {MODIFICATION_TYPES.map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={type}
                      checked={answers.modifications?.types?.includes(type) || false}
                      onChange={(e) => {
                        const currentTypes = answers.modifications?.types || [];
                        const newTypes = e.target.checked
                          ? [...currentTypes, type]
                          : currentTypes.filter(t => t !== type);
                        
                        updateAnswers({ 
                          modifications: { 
                            ...answers.modifications!,
                            types: newTypes
                          } 
                        });
                      }}
                    />
                    <Label htmlFor={type} className="text-sm">{type}</Label>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );

  const renderSectionContent = (sectionIndex: number) => {
    switch (sectionIndex) {
      case 0:
        return renderBasicSection();
      case 1:
        return (
          <ConditionSelector
            value={answers.condition || 'good'}
            onChange={(condition) => updateAnswers({ condition })}
          />
        );
      case 2:
        return (
          <AccidentSection
            accidents={answers.accidents}
            onUpdate={(accidents) => updateAnswers({ accidents })}
          />
        );
      case 3:
        return (
          <DashboardLightsSection
            dashboardLights={answers.dashboard_lights || []}
            onUpdate={(dashboard_lights) => updateAnswers({ dashboard_lights })}
          />
        );
      case 4:
        return renderMaintenanceSection();
      case 5:
        return renderModificationsSection();
      default:
        return null;
    }
  };

  const progress = calculateProgress();

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Vehicle Assessment</span>
            <Badge variant="outline">{entryMethod.toUpperCase()} Entry</Badge>
          </CardTitle>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Progress</span>
              <span>{progress}% complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardHeader>
        <CardContent>
          <Accordion 
            type="single" 
            value={`section-${currentSection}`} 
            onValueChange={(value) => {
              const index = value ? parseInt(value.split('-')[1]) : 0;
              setCurrentSection(index);
            }}
            className="space-y-4"
          >
            {sections.map((section, index) => (
              <AccordionItem key={section.id} value={`section-${index}`}>
                <AccordionTrigger className="text-left">
                  <div className="flex items-center justify-between w-full mr-4">
                    <span>{section.title}</span>
                    <div className="flex items-center space-x-2">
                      {section.required && (
                        <Badge variant="secondary" className="text-xs">Required</Badge>
                      )}
                      {completedSections.has(index) && (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      )}
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4">
                  {renderSectionContent(index)}
                  <div className="flex justify-end mt-6">
                    <Button
                      onClick={() => {
                        markSectionComplete(index);
                        toast.success(`${section.title} completed!`);
                      }}
                      variant={completedSections.has(index) ? "secondary" : "default"}
                    >
                      {completedSections.has(index) ? "Completed" : "Mark Complete"}
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <Separator className="my-6" />

          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              {completedSections.size} of {sections.length} sections completed
            </div>
            <Button
              onClick={handleSubmit}
              disabled={completedSections.size < sections.filter(s => s.required).length}
              className="min-w-[140px]"
            >
              {completedSections.size < sections.filter(s => s.required).length ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2" />
                  Complete Required Sections
                </>
              ) : (
                'Submit Assessment'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
