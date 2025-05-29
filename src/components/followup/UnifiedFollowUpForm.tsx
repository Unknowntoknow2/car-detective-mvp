
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Car, Shield, Wrench, AlertTriangle, 
  Settings, HandCoins, CheckCircle2, 
  Clock, Star, TrendingUp, Award,
  Gauge, PaintBucket, Engine, Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { FollowUpAnswers } from '@/types/follow-up-answers';
import { toast } from 'sonner';

interface UnifiedFollowUpFormProps {
  vin: string;
  onComplete: (answers: FollowUpAnswers) => void;
  initialData?: Partial<FollowUpAnswers>;
}

const followUpSchema = z.object({
  mileage: z.number().min(0).max(999999),
  zipCode: z.string().min(5).max(10),
  condition: z.enum(['excellent', 'good', 'fair', 'poor']),
  titleStatus: z.enum(['clean', 'salvage', 'rebuilt', 'branded', 'lemon']),
  previousOwners: z.number().min(1).max(10),
  previousUse: z.enum(['personal', 'commercial', 'rental', 'emergency']),
  serviceHistory: z.enum(['dealer', 'independent', 'owner', 'unknown']),
  hasRegularMaintenance: z.boolean().nullable(),
  hasAccident: z.boolean().nullable(),
  accidentSeverity: z.enum(['minor', 'moderate', 'severe']).optional(),
  tireCondition: z.enum(['excellent', 'good', 'worn', 'replacement']),
  dashboardLights: z.array(z.string()),
  hasModifications: z.boolean(),
});

type FormData = z.infer<typeof followUpSchema>;

const CONDITION_OPTIONS = [
  { 
    value: 'excellent', 
    label: 'Excellent', 
    description: 'Like new condition, no visible wear',
    color: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    icon: Award,
    impact: '+15% to +20%'
  },
  { 
    value: 'good', 
    label: 'Good', 
    description: 'Minor wear, well maintained',
    color: 'bg-blue-50 border-blue-200 text-blue-800',
    icon: CheckCircle2,
    impact: 'Baseline'
  },
  { 
    value: 'fair', 
    label: 'Fair', 
    description: 'Noticeable wear, some issues',
    color: 'bg-amber-50 border-amber-200 text-amber-800',
    icon: Clock,
    impact: '-10% to -20%'
  },
  { 
    value: 'poor', 
    label: 'Poor', 
    description: 'Significant wear, needs repairs',
    color: 'bg-red-50 border-red-200 text-red-800',
    icon: AlertTriangle,
    impact: '-25% to -40%'
  }
];

const TITLE_STATUS_OPTIONS = [
  { 
    value: 'clean', 
    label: 'Clean Title', 
    description: 'No damage history',
    color: 'bg-green-50 border-green-200 text-green-800',
    impact: 'Full Value'
  },
  { 
    value: 'branded', 
    label: 'Branded Title', 
    description: 'Minor damage reported',
    color: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    impact: '-15% to -30%'
  },
  { 
    value: 'rebuilt', 
    label: 'Rebuilt Title', 
    description: 'Previously totaled, rebuilt',
    color: 'bg-orange-50 border-orange-200 text-orange-800',
    impact: '-20% to -40%'
  },
  { 
    value: 'salvage', 
    label: 'Salvage Title', 
    description: 'Declared total loss',
    color: 'bg-red-50 border-red-200 text-red-800',
    impact: '-40% to -60%'
  }
];

const SERVICE_HISTORY_OPTIONS = [
  { 
    value: 'dealer', 
    label: 'Dealer Serviced', 
    description: 'Full dealer maintenance records',
    color: 'bg-purple-50 border-purple-200 text-purple-800',
    icon: Award,
    impact: '+5% to +10%'
  },
  { 
    value: 'independent', 
    label: 'Independent Shop', 
    description: 'Professional mechanic serviced',
    color: 'bg-blue-50 border-blue-200 text-blue-800',
    icon: Wrench,
    impact: '+2% to +5%'
  },
  { 
    value: 'owner', 
    label: 'Owner Maintained', 
    description: 'Self-serviced with records',
    color: 'bg-green-50 border-green-200 text-green-800',
    icon: Settings,
    impact: 'Neutral'
  },
  { 
    value: 'unknown', 
    label: 'Unknown History', 
    description: 'No maintenance records',
    color: 'bg-gray-50 border-gray-200 text-gray-800',
    icon: AlertTriangle,
    impact: '-5% to -10%'
  }
];

const TIRE_CONDITIONS = [
  { 
    value: 'excellent', 
    label: 'Excellent', 
    description: '8/32" or more tread depth',
    color: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    impact: '+2% to +3%'
  },
  { 
    value: 'good', 
    label: 'Good', 
    description: '6-7/32" tread depth',
    color: 'bg-blue-50 border-blue-200 text-blue-800',
    impact: 'Neutral'
  },
  { 
    value: 'worn', 
    label: 'Worn', 
    description: '3-5/32" tread depth',
    color: 'bg-amber-50 border-amber-200 text-amber-800',
    impact: '-1% to -2%'
  },
  { 
    value: 'replacement', 
    label: 'Needs Replacement', 
    description: 'Less than 3/32" tread',
    color: 'bg-red-50 border-red-200 text-red-800',
    impact: '-3% to -5%'
  }
];

export function UnifiedFollowUpForm({ vin, onComplete, initialData }: UnifiedFollowUpFormProps) {
  const [selectedCondition, setSelectedCondition] = useState(initialData?.condition || 'good');
  const [selectedTitleStatus, setSelectedTitleStatus] = useState(initialData?.titleStatus || 'clean');
  const [selectedServiceHistory, setSelectedServiceHistory] = useState(initialData?.serviceHistory || 'unknown');
  const [selectedTireCondition, setSelectedTireCondition] = useState(initialData?.tireCondition || 'good');
  const [hasAccident, setHasAccident] = useState<boolean | null>(initialData?.accidents?.hadAccident || null);
  const [hasRegularMaintenance, setHasRegularMaintenance] = useState<boolean | null>(initialData?.hasRegularMaintenance || null);
  const [hasModifications, setHasModifications] = useState(initialData?.hasModifications || false);
  const [mileage, setMileage] = useState(initialData?.mileage || 0);
  const [zipCode, setZipCode] = useState(initialData?.zip_code || '');
  const [previousOwners, setPreviousOwners] = useState(initialData?.previous_owners || 1);
  const [dashboardLights, setDashboardLights] = useState<string[]>(initialData?.dashboard_lights || []);

  const form = useForm<FormData>({
    resolver: zodResolver(followUpSchema),
    defaultValues: {
      condition: selectedCondition as any,
      titleStatus: selectedTitleStatus as any,
      serviceHistory: selectedServiceHistory as any,
      tireCondition: selectedTireCondition as any,
      hasAccident,
      hasRegularMaintenance,
      hasModifications,
      mileage,
      zipCode,
      previousOwners,
      dashboardLights,
    }
  });

  // Calculate progress based on completed fields
  const calculateProgress = () => {
    let completed = 0;
    const total = 11; // Total number of required fields

    if (mileage > 0) completed++;
    if (zipCode.length >= 5) completed++;
    if (selectedCondition) completed++;
    if (selectedTitleStatus) completed++;
    if (previousOwners >= 1) completed++;
    if (selectedServiceHistory) completed++;
    if (hasRegularMaintenance !== null) completed++;
    if (hasAccident !== null) completed++;
    if (selectedTireCondition) completed++;
    if (dashboardLights.length >= 0) completed++; // Always counted as completed
    if (typeof hasModifications === 'boolean') completed++;

    return Math.round((completed / total) * 100);
  };

  const progress = calculateProgress();

  const handleSubmit = (data: FormData) => {
    const answers: FollowUpAnswers = {
      vin,
      mileage: data.mileage,
      zip_code: data.zipCode,
      condition: data.condition,
      title_status: data.titleStatus,
      previous_owners: data.previousOwners,
      previous_use: 'personal', // Default value
      service_history: data.serviceHistory,
      maintenance_status: hasRegularMaintenance ? 'Up to date' : 'Overdue',
      tire_condition: data.tireCondition,
      dashboard_lights: data.dashboardLights,
      accidents: {
        hadAccident: data.hasAccident || false,
        severity: data.accidentSeverity,
      },
      modifications: {
        modified: data.hasModifications,
      },
      completion_percentage: progress,
      is_complete: progress >= 80,
    };

    onComplete(answers);
    toast.success('Vehicle details submitted successfully!');
  };

  const SelectionCard = ({ 
    options, 
    selectedValue, 
    onSelect, 
    title, 
    icon: Icon 
  }: {
    options: any[];
    selectedValue: string;
    onSelect: (value: string) => void;
    title: string;
    icon: any;
  }) => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {options.map((option) => {
          const OptionIcon = option.icon || CheckCircle2;
          return (
            <div
              key={option.value}
              onClick={() => onSelect(option.value)}
              className={cn(
                "relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-lg",
                selectedValue === option.value 
                  ? `${option.color} border-current shadow-md scale-[1.02]` 
                  : "bg-white border-gray-200 hover:border-gray-300"
              )}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <OptionIcon className="h-4 w-4" />
                    <span className="font-semibold">{option.label}</span>
                  </div>
                  <p className="text-sm opacity-80 mb-2">{option.description}</p>
                  {option.impact && (
                    <Badge variant="secondary" className="text-xs">
                      {option.impact}
                    </Badge>
                  )}
                </div>
                {selectedValue === option.value && (
                  <CheckCircle2 className="h-5 w-5 text-current flex-shrink-0" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const YesNoSelector = ({ 
    value, 
    onChange, 
    title, 
    description,
    icon: Icon 
  }: {
    value: boolean | null;
    onChange: (value: boolean | null) => void;
    title: string;
    description?: string;
    icon: any;
  }) => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="h-5 w-5 text-primary" />
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          {description && <p className="text-sm text-gray-600">{description}</p>}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[
          { value: true, label: 'Yes', color: 'bg-green-50 border-green-200 text-green-800' },
          { value: false, label: 'No', color: 'bg-red-50 border-red-200 text-red-800' },
          { value: null, label: 'Unknown', color: 'bg-gray-50 border-gray-200 text-gray-800' }
        ].map((option) => (
          <div
            key={String(option.value)}
            onClick={() => onChange(option.value)}
            className={cn(
              "p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-lg text-center",
              value === option.value 
                ? `${option.color} border-current shadow-md scale-[1.02]` 
                : "bg-white border-gray-200 hover:border-gray-300"
            )}
          >
            <div className="flex items-center justify-center gap-2">
              <span className="font-semibold">{option.label}</span>
              {value === option.value && (
                <CheckCircle2 className="h-4 w-4 text-current" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Progress Header */}
      <Card className="border-none shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Vehicle Assessment
              </CardTitle>
              <p className="text-gray-600 mt-1">
                Complete your vehicle details for accurate valuation
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">{progress}%</div>
              <div className="text-sm text-gray-600">Complete</div>
            </div>
          </div>
          <Progress value={progress} className="mt-4 h-3" />
        </CardHeader>
      </Card>

      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        {/* Vehicle Condition Section */}
        <Card className="shadow-lg border-l-4 border-l-blue-500">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <Car className="h-6 w-6" />
              Vehicle Condition
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <SelectionCard
              options={CONDITION_OPTIONS}
              selectedValue={selectedCondition}
              onSelect={(value) => {
                setSelectedCondition(value);
                form.setValue('condition', value as any);
              }}
              title="Overall Condition"
              icon={Gauge}
            />
          </CardContent>
        </Card>

        {/* Title & Ownership Section */}
        <Card className="shadow-lg border-l-4 border-l-green-500">
          <CardHeader className="bg-gradient-to-r from-green-50 to-green-100">
            <CardTitle className="flex items-center gap-2 text-green-900">
              <Shield className="h-6 w-6" />
              Title & Ownership
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-8">
            <SelectionCard
              options={TITLE_STATUS_OPTIONS}
              selectedValue={selectedTitleStatus}
              onSelect={(value) => {
                setSelectedTitleStatus(value);
                form.setValue('titleStatus', value as any);
              }}
              title="Title Status"
              icon={Shield}
            />
            
            <Separator />
            
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Previous Owners</h3>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map((num) => (
                  <div
                    key={num}
                    onClick={() => {
                      setPreviousOwners(num);
                      form.setValue('previousOwners', num);
                    }}
                    className={cn(
                      "p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-lg text-center",
                      previousOwners === num 
                        ? "bg-blue-50 border-blue-500 text-blue-800 shadow-md scale-[1.02]" 
                        : "bg-white border-gray-200 hover:border-gray-300"
                    )}
                  >
                    <span className="font-semibold">{num}</span>
                    {num === 5 && <span className="text-xs block">+</span>}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Service History Section */}
        <Card className="shadow-lg border-l-4 border-l-purple-500">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100">
            <CardTitle className="flex items-center gap-2 text-purple-900">
              <Wrench className="h-6 w-6" />
              Service & Maintenance
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-8">
            <SelectionCard
              options={SERVICE_HISTORY_OPTIONS}
              selectedValue={selectedServiceHistory}
              onSelect={(value) => {
                setSelectedServiceHistory(value);
                form.setValue('serviceHistory', value as any);
              }}
              title="Service History"
              icon={Wrench}
            />
            
            <Separator />
            
            <YesNoSelector
              value={hasRegularMaintenance}
              onChange={(value) => {
                setHasRegularMaintenance(value);
                form.setValue('hasRegularMaintenance', value);
              }}
              title="Regular Maintenance"
              description="Has the vehicle been regularly maintained?"
              icon={Settings}
            />
          </CardContent>
        </Card>

        {/* Damage & Accidents Section */}
        <Card className="shadow-lg border-l-4 border-l-red-500">
          <CardHeader className="bg-gradient-to-r from-red-50 to-red-100">
            <CardTitle className="flex items-center gap-2 text-red-900">
              <AlertTriangle className="h-6 w-6" />
              Damage & Accidents
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <YesNoSelector
              value={hasAccident}
              onChange={(value) => {
                setHasAccident(value);
                form.setValue('hasAccident', value);
              }}
              title="Accident History"
              description="Has this vehicle been in any accidents?"
              icon={AlertTriangle}
            />
          </CardContent>
        </Card>

        {/* Tires & Physical Condition */}
        <Card className="shadow-lg border-l-4 border-l-orange-500">
          <CardHeader className="bg-gradient-to-r from-orange-50 to-orange-100">
            <CardTitle className="flex items-center gap-2 text-orange-900">
              <TrendingUp className="h-6 w-6" />
              Physical Condition
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <SelectionCard
              options={TIRE_CONDITIONS}
              selectedValue={selectedTireCondition}
              onSelect={(value) => {
                setSelectedTireCondition(value);
                form.setValue('tireCondition', value as any);
              }}
              title="Tire Condition"
              icon={TrendingUp}
            />
          </CardContent>
        </Card>

        {/* Vehicle Details */}
        <Card className="shadow-lg border-l-4 border-l-indigo-500">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-indigo-100">
            <CardTitle className="flex items-center gap-2 text-indigo-900">
              <Engine className="h-6 w-6" />
              Vehicle Details
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Mileage</label>
                <input
                  type="number"
                  value={mileage}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 0;
                    setMileage(value);
                    form.setValue('mileage', value);
                  }}
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors"
                  placeholder="Enter mileage"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">ZIP Code</label>
                <input
                  type="text"
                  value={zipCode}
                  onChange={(e) => {
                    setZipCode(e.target.value);
                    form.setValue('zipCode', e.target.value);
                  }}
                  className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors"
                  placeholder="Enter ZIP code"
                  maxLength={10}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <Card className="shadow-lg bg-gradient-to-r from-primary/5 to-primary/10">
          <CardContent className="pt-6">
            <Button 
              type="submit" 
              size="lg" 
              className="w-full py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              disabled={progress < 80}
            >
              <CheckCircle2 className="h-5 w-5 mr-2" />
              Complete Assessment ({progress}% Complete)
            </Button>
            {progress < 80 && (
              <p className="text-center text-sm text-gray-600 mt-2">
                Please complete at least 80% of the assessment to continue
              </p>
            )}
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
