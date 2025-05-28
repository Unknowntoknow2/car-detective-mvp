import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  ChevronDown, 
  ChevronUp, 
  Car, 
  Calendar, 
  MapPin, 
  Star,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

// Import our enhanced components
import { ConditionSelector } from '@/components/valuation/enhanced-followup/ConditionSelector';
import { AccidentSection } from '@/components/valuation/enhanced-followup/AccidentSection';
import { DashboardLightsSection } from '@/components/valuation/enhanced-followup/DashboardLightsSection';
import { ModificationsSection } from '@/components/valuation/enhanced-followup/ModificationsSection';
import { useFollowUpAnswers } from '@/components/valuation/enhanced-followup/hooks/useFollowUpAnswers';

// Import types and constants
import { 
  FollowUpAnswers,
  SERVICE_HISTORY_OPTIONS,
  TITLE_STATUS_OPTIONS,
  TIRE_CONDITION_OPTIONS,
  PREVIOUS_USE_OPTIONS
} from '@/types/follow-up-answers';

interface UnifiedFollowUpFormProps {
  vin?: string;
  plateNumber?: string;
  entryMethod?: 'vin' | 'plate' | 'manual';
  onComplete?: () => void;
}

interface SectionState {
  vehicleInfo: boolean;
  condition: boolean;
  history: boolean;
  maintenance: boolean;
  modifications: boolean;
}

export function UnifiedFollowUpForm({ vin, plateNumber, entryMethod = 'vin', onComplete }: UnifiedFollowUpFormProps) {
  const identifier = vin || plateNumber || '';
  const { answers, loading, saving, updateAnswers, saveAnswers } = useFollowUpAnswers(identifier);
  
  const [openSections, setOpenSections] = useState<SectionState>({
    vehicleInfo: true,
    condition: false,
    history: false,
    maintenance: false,
    modifications: false
  });

  const toggleSection = (section: keyof SectionState) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleComplete = async () => {
    const success = await saveAnswers();
    if (success && onComplete) {
      onComplete();
    }
  };

  // Safe access to completion_percentage with default value
  const completionPercentage = answers.completion_percentage ?? 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Progress */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Vehicle Assessment</CardTitle>
              <p className="text-muted-foreground">
                Complete these questions for the most accurate valuation
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">{completionPercentage}%</div>
              <div className="text-sm text-muted-foreground">Complete</div>
            </div>
          </div>
          <Progress value={completionPercentage} className="mt-4" />
        </CardHeader>
      </Card>

      {/* Vehicle Information Section */}
      <Card>
        <Collapsible 
          open={openSections.vehicleInfo} 
          onOpenChange={() => toggleSection('vehicleInfo')}
        >
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Car className="h-5 w-5 text-blue-500" />
                  <CardTitle className="text-lg">Vehicle Information</CardTitle>
                  <Badge variant="outline">Required</Badge>
                </div>
                {openSections.vehicleInfo ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-6">
              {/* Mileage */}
              <div className="space-y-2">
                <Label htmlFor="mileage" className="text-base font-medium">
                  Current Mileage <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="mileage"
                  type="number"
                  placeholder="e.g., 45,000"
                  value={answers.mileage || ''}
                  onChange={(e) => updateAnswers({ mileage: parseInt(e.target.value) || undefined })}
                  className="text-lg"
                />
                <p className="text-sm text-muted-foreground">
                  💡 Lower mileage typically increases resale value
                </p>
              </div>

              <Separator />

              {/* ZIP Code */}
              <div className="space-y-2">
                <Label htmlFor="zipCode" className="text-base font-medium">
                  ZIP Code <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="zipCode"
                  type="text"
                  placeholder="e.g., 95814"
                  maxLength={5}
                  value={answers.zip_code || ''}
                  onChange={(e) => updateAnswers({ zip_code: e.target.value })}
                  className="text-lg"
                />
                <p className="text-sm text-muted-foreground">
                  🌍 We use ZIP code to adjust for local market demand
                </p>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Vehicle Condition Section */}
      <Card>
        <Collapsible 
          open={openSections.condition} 
          onOpenChange={() => toggleSection('condition')}
        >
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-amber-500" />
                  <CardTitle className="text-lg">Vehicle Condition</CardTitle>
                  <Badge variant="outline">High Impact</Badge>
                </div>
                {openSections.condition ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-6">
              <ConditionSelector
                value={answers.condition}
                onChange={(condition) => updateAnswers({ condition })}
              />

              <Separator />

              {/* Tire Condition */}
              <div className="space-y-3">
                <Label className="text-base font-medium">Tire Condition</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {TIRE_CONDITION_OPTIONS.map((option) => (
                    <Card
                      key={option.value}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        answers.tire_condition === option.value
                          ? 'ring-2 ring-primary bg-primary/5'
                          : 'hover:bg-muted/50'
                      }`}
                      onClick={() => updateAnswers({ tire_condition: option.value })}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium">{option.label}</h4>
                          <div className={`w-4 h-4 rounded-full border-2 ${
                            answers.tire_condition === option.value
                              ? 'bg-primary border-primary'
                              : 'border-muted-foreground'
                          }`}>
                            {answers.tire_condition === option.value && (
                              <div className="w-2 h-2 bg-white rounded-full m-0.5" />
                            )}
                          </div>
                        </div>
                        <div className="text-xs font-medium text-primary">{option.impact}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <Separator />

              <DashboardLightsSection
                value={answers.dashboard_lights}
                onChange={(lights) => updateAnswers({ dashboard_lights: lights })}
              />
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Vehicle History Section */}
      <Card>
        <Collapsible 
          open={openSections.history} 
          onOpenChange={() => toggleSection('history')}
        >
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-green-500" />
                  <CardTitle className="text-lg">Vehicle History</CardTitle>
                  <Badge variant="outline">Important</Badge>
                </div>
                {openSections.history ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-6">
              <AccidentSection
                value={answers.accidents}
                onChange={(accidents) => updateAnswers({ accidents })}
              />

              <Separator />

              {/* Title Status */}
              <div className="space-y-3">
                <Label className="text-base font-medium">Title Status</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {TITLE_STATUS_OPTIONS.map((option) => (
                    <Card
                      key={option.value}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        answers.title_status === option.value
                          ? 'ring-2 ring-primary bg-primary/5'
                          : 'hover:bg-muted/50'
                      }`}
                      onClick={() => updateAnswers({ title_status: option.value })}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium">{option.label}</h4>
                          <div className={`w-4 h-4 rounded-full border-2 ${
                            answers.title_status === option.value
                              ? 'bg-primary border-primary'
                              : 'border-muted-foreground'
                          }`}>
                            {answers.title_status === option.value && (
                              <div className="w-2 h-2 bg-white rounded-full m-0.5" />
                            )}
                          </div>
                        </div>
                        <div className="text-xs font-medium text-primary">{option.impact}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Previous Use */}
              <div className="space-y-3">
                <Label className="text-base font-medium">Previous Use</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {PREVIOUS_USE_OPTIONS.map((option) => (
                    <Card
                      key={option.value}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        answers.previous_use === option.value
                          ? 'ring-2 ring-primary bg-primary/5'
                          : 'hover:bg-muted/50'
                      }`}
                      onClick={() => updateAnswers({ previous_use: option.value })}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium">{option.label}</h4>
                          <div className={`w-4 h-4 rounded-full border-2 ${
                            answers.previous_use === option.value
                              ? 'bg-primary border-primary'
                              : 'border-muted-foreground'
                          }`}>
                            {answers.previous_use === option.value && (
                              <div className="w-2 h-2 bg-white rounded-full m-0.5" />
                            )}
                          </div>
                        </div>
                        <div className="text-xs font-medium text-primary">{option.impact}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Previous Owners */}
              <div className="space-y-2">
                <Label htmlFor="previousOwners" className="text-base font-medium">
                  Number of Previous Owners
                </Label>
                <Input
                  id="previousOwners"
                  type="number"
                  min="0"
                  max="10"
                  placeholder="e.g., 1"
                  value={answers.previous_owners || ''}
                  onChange={(e) => updateAnswers({ previous_owners: parseInt(e.target.value) || undefined })}
                  className="text-lg"
                />
                <p className="text-sm text-muted-foreground">
                  👥 Fewer owners generally means higher resale value
                </p>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Maintenance Section */}
      <Card>
        <Collapsible 
          open={openSections.maintenance} 
          onOpenChange={() => toggleSection('maintenance')}
        >
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-purple-500" />
                  <CardTitle className="text-lg">Service & Maintenance</CardTitle>
                  <Badge variant="outline">Value Builder</Badge>
                </div>
                {openSections.maintenance ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-6">
              {/* Service History */}
              <div className="space-y-3">
                <Label className="text-base font-medium">Service History</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {SERVICE_HISTORY_OPTIONS.map((option) => (
                    <Card
                      key={option.value}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        answers.service_history === option.value
                          ? 'ring-2 ring-primary bg-primary/5'
                          : 'hover:bg-muted/50'
                      }`}
                      onClick={() => updateAnswers({ service_history: option.value })}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium">{option.label}</h4>
                          <div className={`w-4 h-4 rounded-full border-2 ${
                            answers.service_history === option.value
                              ? 'bg-primary border-primary'
                              : 'border-muted-foreground'
                          }`}>
                            {answers.service_history === option.value && (
                              <div className="w-2 h-2 bg-white rounded-full m-0.5" />
                            )}
                          </div>
                        </div>
                        <div className="text-xs font-medium text-primary">{option.impact}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Maintenance Status */}
              <div className="space-y-2">
                <Label htmlFor="maintenanceStatus" className="text-base font-medium">
                  Current Maintenance Status
                </Label>
                <Input
                  id="maintenanceStatus"
                  type="text"
                  placeholder="e.g., All maintenance current, oil changed 2 months ago"
                  value={answers.maintenance_status || ''}
                  onChange={(e) => updateAnswers({ maintenance_status: e.target.value })}
                  className="text-lg"
                />
                <p className="text-sm text-muted-foreground">
                  🔧 Current maintenance builds buyer confidence
                </p>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Modifications Section */}
      <Card>
        <Collapsible 
          open={openSections.modifications} 
          onOpenChange={() => toggleSection('modifications')}
        >
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-orange-500" />
                  <CardTitle className="text-lg">Modifications & Damage</CardTitle>
                  <Badge variant="outline">Impact Variable</Badge>
                </div>
                {openSections.modifications ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-6">
              <ModificationsSection
                value={answers.modifications}
                onChange={(modifications) => updateAnswers({ modifications })}
              />

              <Separator />

              {/* Frame Damage */}
              <div className="space-y-3">
                <Label className="text-base font-medium">Frame Damage</Label>
                <div className="flex gap-4">
                  <Card
                    className={`cursor-pointer transition-all hover:shadow-md flex-1 ${
                      answers.frame_damage === false
                        ? 'ring-2 ring-primary bg-primary/5'
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => updateAnswers({ frame_damage: false })}
                  >
                    <CardContent className="p-4 text-center">
                      <div className="text-green-600 text-lg mb-1">✅</div>
                      <div className="font-medium">No Frame Damage</div>
                    </CardContent>
                  </Card>
                  <Card
                    className={`cursor-pointer transition-all hover:shadow-md flex-1 ${
                      answers.frame_damage === true
                        ? 'ring-2 ring-primary bg-primary/5'
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => updateAnswers({ frame_damage: true })}
                  >
                    <CardContent className="p-4 text-center">
                      <div className="text-red-600 text-lg mb-1">⚠️</div>
                      <div className="font-medium">Has Frame Damage</div>
                    </CardContent>
                  </Card>
                </div>
                <p className="text-sm text-muted-foreground">
                  🏗️ Frame damage significantly reduces resale value
                </p>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Action Buttons */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {saving && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>}
              <span className="text-sm text-muted-foreground">
                {saving ? 'Saving...' : 'Auto-saved'}
              </span>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => saveAnswers()}>
                Save Progress
              </Button>
              <Button 
                onClick={handleComplete}
                disabled={completionPercentage < 80}
                className="relative"
              >
                {completionPercentage >= 80 ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Complete Assessment
                  </>
                ) : (
                  <>
                    Complete Assessment ({completionPercentage}%)
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default UnifiedFollowUpForm;
