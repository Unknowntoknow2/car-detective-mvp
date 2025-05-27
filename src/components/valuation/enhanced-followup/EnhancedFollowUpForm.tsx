
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp, Save, CheckCircle } from 'lucide-react';
import { ZipCodeInput } from '@/components/common/ZipCodeInput';
import { ConditionSelector } from './ConditionSelector';
import { AccidentSection } from './AccidentSection';
import { DashboardLightsSection } from './DashboardLightsSection';
import { ModificationsSection } from './ModificationsSection';
import { useFollowUpAnswers } from './hooks/useFollowUpAnswers';
import { 
  SERVICE_HISTORY_OPTIONS, 
  TITLE_STATUS_OPTIONS, 
  TIRE_CONDITION_OPTIONS, 
  PREVIOUS_USE_OPTIONS 
} from '@/types/follow-up-answers';

interface EnhancedFollowUpFormProps {
  vin: string;
  valuationId?: string;
  onComplete?: () => void;
}

export function EnhancedFollowUpForm({ vin, valuationId, onComplete }: EnhancedFollowUpFormProps) {
  const { answers, loading, saving, updateAnswers, saveAnswers } = useFollowUpAnswers(vin, valuationId);
  const [openSections, setOpenSections] = React.useState<string[]>(['basic']);

  const toggleSection = (section: string) => {
    setOpenSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const handleMileageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    updateAnswers({ mileage: parseInt(value) || undefined });
  };

  const formatMileage = (value: number | undefined) => {
    if (!value) return '';
    return value.toLocaleString();
  };

  const handleSubmit = async () => {
    const saved = await saveAnswers();
    if (saved && onComplete) {
      onComplete();
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-4 bg-muted rounded w-2/3"></div>
          </div>
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
            <CardTitle className="text-xl">Vehicle Assessment</CardTitle>
            <div className="flex items-center gap-2">
              {saving && <div className="text-sm text-muted-foreground">Saving...</div>}
              {answers.completion_percentage >= 80 && (
                <CheckCircle className="h-5 w-5 text-green-500" />
              )}
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Completion Progress</span>
              <span>{answers.completion_percentage || 0}%</span>
            </div>
            <Progress value={answers.completion_percentage || 0} className="h-2" />
          </div>
        </CardHeader>
      </Card>

      {/* Basic Information */}
      <Collapsible 
        open={openSections.includes('basic')}
        onOpenChange={() => toggleSection('basic')}
      >
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Basic Vehicle Information</CardTitle>
                {openSections.includes('basic') ? 
                  <ChevronUp className="h-5 w-5" /> : 
                  <ChevronDown className="h-5 w-5" />
                }
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="mileage" className="text-base font-medium">
                    Current Mileage
                  </Label>
                  <Input
                    id="mileage"
                    type="text"
                    placeholder="e.g. 35,000"
                    value={formatMileage(answers.mileage)}
                    onChange={handleMileageChange}
                    className="mt-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Mileage significantly impacts value. Lower mileage increases resale value.
                  </p>
                </div>

                <div>
                  <Label htmlFor="zip" className="text-base font-medium">
                    ZIP Code
                  </Label>
                  <ZipCodeInput
                    value={answers.zip_code || ''}
                    onChange={(value) => updateAnswers({ zip_code: value })}
                    placeholder="Enter ZIP code"
                    className="mt-2"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    We use ZIP code to adjust for local market demand and pricing.
                  </p>
                </div>
              </div>

              <ConditionSelector
                value={answers.condition}
                onChange={(condition) => updateAnswers({ condition })}
              />
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Vehicle History */}
      <Collapsible 
        open={openSections.includes('history')}
        onOpenChange={() => toggleSection('history')}
      >
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Vehicle History & Ownership</CardTitle>
                {openSections.includes('history') ? 
                  <ChevronUp className="h-5 w-5" /> : 
                  <ChevronDown className="h-5 w-5" />
                }
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-6">
              <AccidentSection
                value={answers.accidents}
                onChange={(accidents) => updateAnswers({ accidents })}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-base font-medium">Service History</Label>
                  <Select
                    value={answers.service_history || ''}
                    onValueChange={(service_history) => updateAnswers({ service_history })}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select service history" />
                    </SelectTrigger>
                    <SelectContent>
                      {SERVICE_HISTORY_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div>
                            <div>{option.label}</div>
                            <div className="text-xs text-muted-foreground">{option.impact}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-base font-medium">Title Status</Label>
                  <Select
                    value={answers.title_status || ''}
                    onValueChange={(title_status) => updateAnswers({ title_status })}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select title status" />
                    </SelectTrigger>
                    <SelectContent>
                      {TITLE_STATUS_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div>
                            <div>{option.label}</div>
                            <div className="text-xs text-muted-foreground">{option.impact}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-base font-medium">Previous Owners</Label>
                  <Select
                    value={answers.previous_owners?.toString() || ''}
                    onValueChange={(value) => updateAnswers({ previous_owners: parseInt(value) })}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select number of owners" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Owner</SelectItem>
                      <SelectItem value="2">2 Owners</SelectItem>
                      <SelectItem value="3">3-4 Owners</SelectItem>
                      <SelectItem value="5">5+ Owners</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-base font-medium">Previous Use</Label>
                  <Select
                    value={answers.previous_use || ''}
                    onValueChange={(previous_use) => updateAnswers({ previous_use })}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select previous use" />
                    </SelectTrigger>
                    <SelectContent>
                      {PREVIOUS_USE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div>
                            <div>{option.label}</div>
                            <div className="text-xs text-muted-foreground">{option.impact}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Current Condition */}
      <Collapsible 
        open={openSections.includes('condition')}
        onOpenChange={() => toggleSection('condition')}
      >
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Current Condition & Issues</CardTitle>
                {openSections.includes('condition') ? 
                  <ChevronUp className="h-5 w-5" /> : 
                  <ChevronDown className="h-5 w-5" />
                }
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-base font-medium">Tire Condition</Label>
                <Select
                  value={answers.tire_condition || ''}
                  onValueChange={(tire_condition) => updateAnswers({ tire_condition })}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select tire condition" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIRE_CONDITION_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div>
                          <div>{option.label}</div>
                          <div className="text-xs text-muted-foreground">{option.impact}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <DashboardLightsSection
                value={answers.dashboard_lights}
                onChange={(dashboard_lights) => updateAnswers({ dashboard_lights })}
              />
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Modifications */}
      <Collapsible 
        open={openSections.includes('modifications')}
        onOpenChange={() => toggleSection('modifications')}
      >
        <ModificationsSection
          value={answers.modifications}
          onChange={(modifications) => updateAnswers({ modifications })}
        />
      </Collapsible>

      {/* Submit Button */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">
                Assessment {answers.completion_percentage >= 80 ? 'Complete' : 'In Progress'}
              </p>
              <p className="text-sm text-muted-foreground">
                {answers.completion_percentage >= 80 
                  ? 'All sections completed. Ready for valuation.'
                  : `Complete ${Math.round((13 - (answers.completion_percentage || 0) / 100 * 13))} more fields for full assessment.`
                }
              </p>
            </div>
            <Button 
              onClick={handleSubmit}
              disabled={saving}
              className="min-w-[120px]"
            >
              {saving ? (
                <>
                  <Save className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Assessment
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
