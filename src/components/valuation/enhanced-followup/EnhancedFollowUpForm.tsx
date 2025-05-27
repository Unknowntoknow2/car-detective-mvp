
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { CheckCircle, AlertCircle, Car, Wrench, Shield, Users, History, Gauge } from 'lucide-react';
import { ConditionSelector } from './ConditionSelector';
import { DashboardLightsSection } from './DashboardLightsSection';
import { ModificationsSection } from './ModificationsSection';
import { AccidentHistorySection } from './AccidentHistorySection';
import { FollowUpAnswers } from '@/types/follow-up-answers';
import {
  SERVICE_HISTORY_OPTIONS,
  TITLE_STATUS_OPTIONS,
  TIRE_CONDITION_OPTIONS,
  PREVIOUS_USE_OPTIONS
} from '@/types/follow-up-answers';

interface EnhancedFollowUpFormProps {
  answers: FollowUpAnswers;
  onUpdate: (updates: Partial<FollowUpAnswers>) => void;
  onSubmit: () => void;
  isLoading?: boolean;
  vin: string;
}

export function EnhancedFollowUpForm({
  answers,
  onUpdate,
  onSubmit,
  isLoading = false,
  vin
}: EnhancedFollowUpFormProps) {
  const completionPercentage = answers.completionPercentage || 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Vehicle Assessment Progress</CardTitle>
              <p className="text-sm text-muted-foreground">
                Complete the assessment to get your accurate valuation
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">{completionPercentage}%</div>
              <div className="text-xs text-muted-foreground">Complete</div>
            </div>
          </div>
          <Progress value={completionPercentage} className="w-full" />
        </CardHeader>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Car className="h-5 w-5 text-blue-500" />
              <CardTitle className="text-lg">Basic Information</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Mileage Input */}
            <div className="space-y-2">
              <Label htmlFor="mileage" className="text-base font-medium">
                Current Mileage
              </Label>
              <Input
                id="mileage"
                type="number"
                placeholder="Enter mileage"
                value={answers.mileage || ''}
                onChange={(e) => onUpdate({ mileage: parseInt(e.target.value) || undefined })}
                className="text-lg"
              />
              <p className="text-xs text-muted-foreground">
                Enter the current odometer reading
              </p>
            </div>

            {/* Zip Code Input */}
            <div className="space-y-2">
              <Label htmlFor="zipCode" className="text-base font-medium">
                Zip Code
              </Label>
              <Input
                id="zipCode"
                type="text"
                placeholder="Enter zip code"
                value={answers.zipCode || ''}
                onChange={(e) => onUpdate({ zipCode: e.target.value })}
                className="text-lg"
                maxLength={5}
              />
              <p className="text-xs text-muted-foreground">
                Location affects market value
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Condition Assessment */}
        <ConditionSelector
          value={answers.condition}
          onChange={(condition) => onUpdate({ condition })}
        />

        {/* Accident History */}
        <AccidentHistorySection
          value={answers.accidents}
          onChange={(accidents) => onUpdate({ accidents })}
        />

        {/* Tire Condition */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Gauge className="h-5 w-5 text-orange-500" />
              <CardTitle className="text-lg">Tire Condition</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Label className="text-base font-medium mb-4 block">Current tire condition</Label>
            <RadioGroup
              value={answers.tireCondition || ''}
              onValueChange={(value) => onUpdate({ tireCondition: value })}
              className="grid grid-cols-1 md:grid-cols-2 gap-3"
            >
              {TIRE_CONDITION_OPTIONS.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`tire-${option.value}`} />
                  <div className="flex-1">
                    <Label htmlFor={`tire-${option.value}`} className="font-medium cursor-pointer">
                      {option.label}
                    </Label>
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                    <Badge variant="outline" className="text-xs mt-1">
                      {option.impact}
                    </Badge>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Dashboard Warning Lights */}
        <DashboardLightsSection
          value={answers.dashboardLights}
          onChange={(dashboardLights) => onUpdate({ dashboardLights })}
        />

        {/* Title Status */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-500" />
              <CardTitle className="text-lg">Title Status</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Label className="text-base font-medium mb-4 block">Vehicle title status</Label>
            <RadioGroup
              value={answers.titleStatus || ''}
              onValueChange={(value) => onUpdate({ titleStatus: value })}
              className="grid grid-cols-1 md:grid-cols-2 gap-3"
            >
              {TITLE_STATUS_OPTIONS.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`title-${option.value}`} />
                  <div className="flex-1">
                    <Label htmlFor={`title-${option.value}`} className="font-medium cursor-pointer">
                      {option.label}
                    </Label>
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                    <Badge variant="outline" className="text-xs mt-1">
                      {option.impact}
                    </Badge>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Previous Use */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-500" />
              <CardTitle className="text-lg">Previous Use</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Label className="text-base font-medium mb-4 block">How was this vehicle primarily used?</Label>
            <RadioGroup
              value={answers.previousUse || ''}
              onValueChange={(value) => onUpdate({ previousUse: value })}
              className="grid grid-cols-1 md:grid-cols-2 gap-3"
            >
              {PREVIOUS_USE_OPTIONS.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`use-${option.value}`} />
                  <div className="flex-1">
                    <Label htmlFor={`use-${option.value}`} className="font-medium cursor-pointer">
                      {option.label}
                    </Label>
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                    <Badge variant="outline" className="text-xs mt-1">
                      {option.impact}
                    </Badge>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Previous Owners */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-indigo-500" />
              <CardTitle className="text-lg">Ownership History</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Label htmlFor="previousOwners" className="text-base font-medium">
              Number of Previous Owners
            </Label>
            <Select
              value={answers.previousOwners?.toString() || ''}
              onValueChange={(value) => onUpdate({ previousOwners: parseInt(value) })}
            >
              <SelectTrigger className="w-full mt-2">
                <SelectValue placeholder="Select number of owners" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Owner</SelectItem>
                <SelectItem value="2">2 Owners</SelectItem>
                <SelectItem value="3">3 Owners</SelectItem>
                <SelectItem value="4">4 Owners</SelectItem>
                <SelectItem value="5">5+ Owners</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-2">
              Fewer owners typically means better value
            </p>
          </CardContent>
        </Card>

        {/* Service History */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <History className="h-5 w-5 text-teal-500" />
              <CardTitle className="text-lg">Service History</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Label className="text-base font-medium mb-4 block">Service record availability</Label>
            <RadioGroup
              value={answers.serviceHistory || ''}
              onValueChange={(value) => onUpdate({ serviceHistory: value })}
              className="grid grid-cols-1 gap-3"
            >
              {SERVICE_HISTORY_OPTIONS.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`service-${option.value}`} />
                  <div className="flex-1">
                    <Label htmlFor={`service-${option.value}`} className="font-medium cursor-pointer">
                      {option.label}
                    </Label>
                    <p className="text-sm text-muted-foreground">{option.description}</p>
                    <Badge variant="outline" className="text-xs mt-1">
                      {option.impact}
                    </Badge>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Maintenance Status */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Wrench className="h-5 w-5 text-amber-500" />
              <CardTitle className="text-lg">Maintenance Status</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Label className="text-base font-medium mb-4 block">
              Is the vehicle up to date on maintenance?
            </Label>
            <RadioGroup
              value={answers.maintenanceStatus || ''}
              onValueChange={(value) => onUpdate({ maintenanceStatus: value })}
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="up-to-date" id="maintenance-current" />
                <Label htmlFor="maintenance-current">Up to date</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="behind" id="maintenance-behind" />
                <Label htmlFor="maintenance-behind">Behind on maintenance</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="unknown" id="maintenance-unknown" />
                <Label htmlFor="maintenance-unknown">Unknown</Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Modifications */}
        <ModificationsSection
          value={answers.modifications}
          onChange={(modifications) => onUpdate({ modifications })}
        />

        {/* Frame Damage */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <CardTitle className="text-lg">Frame Damage</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Label className="text-base font-medium mb-4 block">
              Has this vehicle ever had frame damage?
            </Label>
            <RadioGroup
              value={answers.frameDamage === true ? 'yes' : answers.frameDamage === false ? 'no' : ''}
              onValueChange={(value) => onUpdate({ frameDamage: value === 'yes' })}
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="frame-no" />
                <Label htmlFor="frame-no">No frame damage</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="frame-yes" />
                <Label htmlFor="frame-yes">Has frame damage</Label>
              </div>
            </RadioGroup>
            <p className="text-xs text-muted-foreground mt-2">
              Frame damage significantly affects vehicle value
            </p>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-center pt-6">
          <Button
            type="submit"
            size="lg"
            className="px-8"
            disabled={isLoading || completionPercentage < 70}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </div>
            ) : (
              <>
                <CheckCircle className="h-5 w-5 mr-2" />
                Complete Assessment
              </>
            )}
          </Button>
        </div>

        {completionPercentage < 70 && (
          <p className="text-center text-sm text-muted-foreground">
            Complete at least 70% of the assessment to proceed
          </p>
        )}
      </form>
    </div>
  );
}
