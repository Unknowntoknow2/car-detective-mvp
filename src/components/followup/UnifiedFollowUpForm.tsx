import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  ChevronDown, 
  ChevronUp, 
  Car, 
  Wrench, 
  FileText, 
  Shield, 
  Zap, 
  Star,
  CheckCircle2,
  Circle
} from 'lucide-react';
import { FollowUpAnswers, AccidentDetails, ModificationDetails } from '@/types/follow-up-answers';
import { VEHICLE_FEATURES } from '@/data/vehicle-features';
import { cn } from '@/lib/utils';

// Modern CGI Radio Button Component
interface ModernRadioProps {
  value: string;
  selectedValue: string;
  onChange: (value: string) => void;
  label: string;
  description?: string;
  impact?: string;
  disabled?: boolean;
  variant?: 'default' | 'premium' | 'critical';
}

const ModernRadio: React.FC<ModernRadioProps> = ({
  value,
  selectedValue,
  onChange,
  label,
  description,
  impact,
  disabled = false,
  variant = 'default'
}) => {
  const isSelected = selectedValue === value;
  
  const variantStyles = {
    default: {
      bg: 'bg-gradient-to-br from-slate-50 to-slate-100',
      selectedBg: 'bg-gradient-to-br from-blue-50 to-indigo-100',
      border: 'border-slate-200',
      selectedBorder: 'border-blue-400',
      text: 'text-slate-900',
      selectedText: 'text-blue-900'
    },
    premium: {
      bg: 'bg-gradient-to-br from-amber-50 to-orange-100',
      selectedBg: 'bg-gradient-to-br from-amber-100 to-orange-200',
      border: 'border-amber-200',
      selectedBorder: 'border-amber-400',
      text: 'text-amber-900',
      selectedText: 'text-orange-900'
    },
    critical: {
      bg: 'bg-gradient-to-br from-red-50 to-pink-100',
      selectedBg: 'bg-gradient-to-br from-red-100 to-pink-200',
      border: 'border-red-200',
      selectedBorder: 'border-red-400',
      text: 'text-red-900',
      selectedText: 'text-red-900'
    }
  };

  const styles = variantStyles[variant];

  return (
    <div
      className={cn(
        "relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ease-out",
        "shadow-lg hover:shadow-xl transform hover:scale-[1.02]",
        "backdrop-blur-sm",
        isSelected ? styles.selectedBg : styles.bg,
        isSelected ? styles.selectedBorder : styles.border,
        disabled && "opacity-50 cursor-not-allowed",
        "group"
      )}
      onClick={() => !disabled && onChange(value)}
    >
      {/* Animated Background Glow */}
      <div 
        className={cn(
          "absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300",
          "bg-gradient-to-r from-transparent via-white/20 to-transparent",
          "group-hover:opacity-100"
        )}
      />
      
      {/* Custom Radio Circle */}
      <div className="flex items-start space-x-4 relative z-10">
        <div className="flex-shrink-0 pt-1">
          <div 
            className={cn(
              "w-6 h-6 rounded-full border-2 transition-all duration-300 ease-out",
              "shadow-inner backdrop-blur-sm",
              isSelected 
                ? "border-blue-500 bg-gradient-to-br from-blue-400 to-indigo-500" 
                : "border-slate-300 bg-gradient-to-br from-white to-slate-100",
              "hover:shadow-lg hover:scale-110"
            )}
          >
            {isSelected && (
              <div className="w-full h-full rounded-full flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-white shadow-sm animate-pulse" />
              </div>
            )}
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div 
            className={cn(
              "font-semibold text-sm transition-colors duration-300",
              isSelected ? styles.selectedText : styles.text
            )}
          >
            {label}
          </div>
          
          {description && (
            <div className="text-xs text-slate-600 mt-1 leading-relaxed">
              {description}
            </div>
          )}
          
          {impact && (
            <div className={cn(
              "text-xs mt-2 px-2 py-1 rounded-full inline-block font-medium",
              "bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800",
              "shadow-sm"
            )}>
              {impact}
            </div>
          )}
        </div>
      </div>
      
      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute top-2 right-2">
          <CheckCircle2 className="w-5 h-5 text-blue-500 animate-bounce" />
        </div>
      )}
    </div>
  );
};

// Form Data Interface
interface FormData extends FollowUpAnswers {
  accidentDetails?: AccidentDetails;
  modificationDetails?: ModificationDetails;
}

interface UnifiedFollowUpFormProps {
  vin: string;
  onComplete: (data: FollowUpAnswers) => void;
}

export const UnifiedFollowUpForm: React.FC<UnifiedFollowUpFormProps> = ({
  vin,
  onComplete
}) => {
  const [formData, setFormData] = useState<FormData>({
    vin,
    completion_percentage: 0,
    is_complete: false
  });

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    basic: true,
    accidents: false,
    service: false,
    title: false,
    condition: false,
    modifications: false,
    features: false
  });

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const calculateProgress = () => {
      const fields = [
        formData.mileage,
        formData.zip_code,
        formData.condition,
        formData.accidents?.hadAccident !== undefined,
        formData.service_history,
        formData.title_status,
        formData.tire_condition,
        formData.modifications?.modified !== undefined
      ];
      
      const completed = fields.filter(Boolean).length;
      const percentage = Math.round((completed / fields.length) * 100);
      setProgress(percentage);
      
      setFormData(prev => ({
        ...prev,
        completion_percentage: percentage,
        is_complete: percentage === 100
      }));
    };

    calculateProgress();
  }, [formData]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleSubmit = () => {
    const finalData: FollowUpAnswers = {
      ...formData,
      accidents: formData.accidentDetails,
      modifications: formData.modificationDetails,
      features: formData.features || []
    };
    
    onComplete(finalData);
  };

  const SectionCard: React.FC<{
    title: string;
    icon: React.ReactNode;
    sectionKey: string;
    children: React.ReactNode;
    completed?: boolean;
    color?: string;
  }> = ({ title, icon, sectionKey, children, completed = false, color = "blue" }) => {
    const isExpanded = expandedSections[sectionKey];
    
    const colorClasses = {
      blue: "border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50",
      green: "border-green-200 bg-gradient-to-br from-green-50 to-emerald-50",
      amber: "border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50",
      red: "border-red-200 bg-gradient-to-br from-red-50 to-pink-50",
      purple: "border-purple-200 bg-gradient-to-br from-purple-50 to-violet-50",
      slate: "border-slate-200 bg-gradient-to-br from-slate-50 to-gray-50"
    };

    return (
      <Card className={cn(
        "border-2 transition-all duration-300 shadow-lg hover:shadow-xl",
        colorClasses[color as keyof typeof colorClasses] || colorClasses.blue,
        completed && "ring-2 ring-green-400 ring-opacity-50"
      )}>
        <CardHeader 
          className="cursor-pointer hover:bg-white/30 transition-colors duration-200 rounded-t-lg"
          onClick={() => toggleSection(sectionKey)}
        >
          <CardTitle className="flex items-center justify-between text-lg">
            <div className="flex items-center space-x-3">
              <div className={cn(
                "p-2 rounded-lg shadow-sm",
                `bg-${color}-100 text-${color}-600`
              )}>
                {icon}
              </div>
              <span>{title}</span>
              {completed && (
                <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Complete
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-slate-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-slate-500" />
              )}
            </div>
          </CardTitle>
        </CardHeader>
        
        {isExpanded && (
          <CardContent className="pt-0 space-y-4">
            {children}
          </CardContent>
        )}
      </Card>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header with Progress */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 rounded-xl shadow-xl">
        <h2 className="text-2xl font-bold mb-4">Complete Your Vehicle Assessment</h2>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{progress}% Complete</span>
          </div>
          <Progress value={progress} className="h-3 bg-blue-800" />
        </div>
      </div>

      {/* Basic Information Section */}
      <SectionCard
        title="Basic Information"
        icon={<Car className="w-5 h-5" />}
        sectionKey="basic"
        completed={!!(formData.mileage && formData.zip_code && formData.condition)}
        color="blue"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="mileage">Current Mileage</Label>
            <Input
              id="mileage"
              type="number"
              placeholder="Enter mileage"
              value={formData.mileage || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, mileage: parseInt(e.target.value) || undefined }))}
              className="shadow-sm"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="zipCode">ZIP Code</Label>
            <Input
              id="zipCode"
              placeholder="Enter ZIP code"
              value={formData.zip_code || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, zip_code: e.target.value }))}
              className="shadow-sm"
            />
          </div>
        </div>

        <div className="space-y-3">
          <Label>Overall Vehicle Condition</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { value: 'excellent', label: 'Excellent', description: 'No cosmetic/mechanical issues. Fully serviced.', impact: '+15% to +20% value' },
              { value: 'good', label: 'Good', description: 'Minor wear, no major damage.', impact: 'Market value baseline' },
              { value: 'fair', label: 'Fair', description: 'Visible damage or mechanical issues.', impact: '-10% to -20% value' },
              { value: 'poor', label: 'Poor', description: 'Needs repair or structural concerns.', impact: '-25% to -40% value' }
            ].map((option) => (
              <ModernRadio
                key={option.value}
                value={option.value}
                selectedValue={formData.condition || ''}
                onChange={(value) => setFormData(prev => ({ ...prev, condition: value as any }))}
                label={option.label}
                description={option.description}
                impact={option.impact}
              />
            ))}
          </div>
        </div>
      </SectionCard>

      {/* Accident History Section */}
      <SectionCard
        title="Accident History"
        icon={<Shield className="w-5 h-5" />}
        sectionKey="accidents"
        completed={formData.accidents?.hadAccident !== undefined}
        color="red"
      >
        <div className="space-y-4">
          <div className="space-y-3">
            <Label>Has this vehicle been in an accident?</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ModernRadio
                value="false"
                selectedValue={formData.accidents?.hadAccident?.toString() || ''}
                onChange={(value) => setFormData(prev => ({
                  ...prev,
                  accidents: { hadAccident: value === 'true' }
                }))}
                label="No Accidents"
                description="Vehicle has no accident history"
                impact="Full market value"
                variant="default"
              />
              <ModernRadio
                value="true"
                selectedValue={formData.accidents?.hadAccident?.toString() || ''}
                onChange={(value) => setFormData(prev => ({
                  ...prev,
                  accidents: { hadAccident: value === 'true' }
                }))}
                label="Has Accidents"
                description="Vehicle has been in one or more accidents"
                impact="Value impact varies"
                variant="critical"
              />
            </div>
          </div>

          {formData.accidents?.hadAccident && (
            <div className="space-y-4 p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Number of Accidents</Label>
                  <Input
                    type="number"
                    min="1"
                    value={formData.accidents?.count || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      accidents: { 
                        ...prev.accidents!, 
                        count: parseInt(e.target.value) || undefined 
                      }
                    }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Severity</Label>
                  <Select
                    value={formData.accidents?.severity || ''}
                    onValueChange={(value) => setFormData(prev => ({
                      ...prev,
                      accidents: { 
                        ...prev.accidents!, 
                        severity: value as 'minor' | 'moderate' | 'major' 
                      }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="minor">Minor</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="major">Major</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3">
                <Label>Additional Details</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ModernRadio
                    value="true"
                    selectedValue={formData.accidents?.repaired?.toString() || ''}
                    onChange={(value) => setFormData(prev => ({
                      ...prev,
                      accidents: { 
                        ...prev.accidents!, 
                        repaired: value === 'true' 
                      }
                    }))}
                    label="Professionally Repaired"
                    description="All damage was professionally repaired"
                    impact="Better resale value"
                  />
                  <ModernRadio
                    value="false"
                    selectedValue={formData.accidents?.repaired?.toString() || ''}
                    onChange={(value) => setFormData(prev => ({
                      ...prev,
                      accidents: { 
                        ...prev.accidents!, 
                        repaired: value === 'true' 
                      }
                    }))}
                    label="Not Repaired"
                    description="Damage still visible or unrepaired"
                    impact="Reduced value"
                    variant="critical"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </SectionCard>

      {/* Service History Section */}
      <SectionCard
        title="Service & Maintenance"
        icon={<Wrench className="w-5 h-5" />}
        sectionKey="service"
        completed={!!formData.service_history}
        color="green"
      >
        <div className="space-y-4">
          <div className="space-y-3">
            <Label>Service History</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { value: 'dealer', label: 'Dealer-maintained', description: 'Serviced at authorized dealerships', impact: '+5% to +10% value' },
                { value: 'independent', label: 'Independent mechanic', description: 'Serviced at independent shops', impact: '+2% to +5% value' },
                { value: 'owner', label: 'Owner-maintained', description: 'Self-maintained by owner', impact: 'Neutral impact' },
                { value: 'unknown', label: 'No known history', description: 'Service history unavailable', impact: '-5% to -10% value' }
              ].map((option) => (
                <ModernRadio
                  key={option.value}
                  value={option.value}
                  selectedValue={formData.service_history || ''}
                  onChange={(value) => setFormData(prev => ({ ...prev, service_history: value }))}
                  label={option.label}
                  description={option.description}
                  impact={option.impact}
                />
              ))}
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Title & Ownership Section */}
      <SectionCard
        title="Title & Ownership"
        icon={<FileText className="w-5 h-5" />}
        sectionKey="title"
        completed={!!formData.title_status}
        color="amber"
      >
        <div className="space-y-4">
          <div className="space-y-3">
            <Label>Title Status</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { value: 'clean', label: 'Clean', description: 'No issues with title', impact: 'Full market value' },
                { value: 'salvage', label: 'Salvage', description: 'Previously declared total loss', impact: '-40% to -60% value', variant: 'critical' },
                { value: 'rebuilt', label: 'Rebuilt', description: 'Rebuilt from salvage', impact: '-20% to -40% value', variant: 'critical' },
                { value: 'branded', label: 'Branded', description: 'Other title brand', impact: '-15% to -30% value', variant: 'critical' }
              ].map((option) => (
                <ModernRadio
                  key={option.value}
                  value={option.value}
                  selectedValue={formData.title_status || ''}
                  onChange={(value) => setFormData(prev => ({ ...prev, title_status: value }))}
                  label={option.label}
                  description={option.description}
                  impact={option.impact}
                  variant={option.variant as any}
                />
              ))}
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Physical Condition Section */}
      <SectionCard
        title="Physical Condition"
        icon={<Zap className="w-5 h-5" />}
        sectionKey="condition"
        completed={!!formData.tire_condition}
        color="purple"
      >
        <div className="space-y-4">
          <div className="space-y-3">
            <Label>Tire Condition</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { value: 'excellent', label: 'Excellent (8/32"+ tread)', description: 'Nearly new tires', impact: '+2% to +3% value' },
                { value: 'good', label: 'Good (6–7/32")', description: 'Good tread remaining', impact: 'Neutral impact' },
                { value: 'worn', label: 'Worn (3–5/32")', description: 'Noticeable wear', impact: '-1% to -2% value' },
                { value: 'replacement', label: 'Needs Replacement (<3/32")', description: 'Immediate replacement needed', impact: '-3% to -5% value', variant: 'critical' }
              ].map((option) => (
                <ModernRadio
                  key={option.value}
                  value={option.value}
                  selectedValue={formData.tire_condition || ''}
                  onChange={(value) => setFormData(prev => ({ ...prev, tire_condition: value }))}
                  label={option.label}
                  description={option.description}
                  impact={option.impact}
                  variant={option.variant as any}
                />
              ))}
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Modifications Section */}
      <SectionCard
        title="Modifications"
        icon={<Wrench className="w-5 h-5" />}
        sectionKey="modifications"
        completed={formData.modifications?.modified !== undefined}
        color="slate"
      >
        <div className="space-y-4">
          <div className="space-y-3">
            <Label>Vehicle Modifications</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ModernRadio
                value="false"
                selectedValue={formData.modifications?.modified?.toString() || ''}
                onChange={(value) => setFormData(prev => ({
                  ...prev,
                  modifications: { modified: value === 'true' }
                }))}
                label="Stock/Unmodified"
                description="Vehicle is in original condition"
                impact="Standard market value"
              />
              <ModernRadio
                value="true"
                selectedValue={formData.modifications?.modified?.toString() || ''}
                onChange={(value) => setFormData(prev => ({
                  ...prev,
                  modifications: { modified: value === 'true' }
                }))}
                label="Modified"
                description="Vehicle has been modified"
                impact="Impact varies by modification"
              />
            </div>
          </div>
        </div>
      </SectionCard>

      {/* High-Impact Features Section */}
      <SectionCard
        title="High-Impact Features"
        icon={<Star className="w-5 h-5" />}
        sectionKey="features"
        completed={!!(formData.features && formData.features.length > 0)}
        color="amber"
      >
        <div className="space-y-4">
          <Label>Select features your vehicle has (each adds value)</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {VEHICLE_FEATURES.map((feature) => (
              <div key={feature} className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-amber-200 hover:bg-amber-50 transition-colors">
                <Checkbox
                  id={feature}
                  checked={formData.features?.includes(feature) || false}
                  onCheckedChange={(checked) => {
                    setFormData(prev => ({
                      ...prev,
                      features: checked
                        ? [...(prev.features || []), feature]
                        : (prev.features || []).filter(f => f !== feature)
                    }));
                  }}
                  className="data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
                />
                <Label htmlFor={feature} className="text-sm font-medium cursor-pointer flex-1">
                  {feature}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </SectionCard>

      {/* Submit Button */}
      <div className="flex justify-end pt-6">
        <Button
          onClick={handleSubmit}
          disabled={progress < 50}
          className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
        >
          Complete Assessment
        </Button>
      </div>
    </div>
  );
};
