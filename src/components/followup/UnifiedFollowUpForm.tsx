
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  FollowUpAnswers, 
  CONDITION_OPTIONS, 
  SERVICE_HISTORY_OPTIONS, 
  TITLE_STATUS_OPTIONS,
  TIRE_CONDITION_OPTIONS,
  PREVIOUS_USE_OPTIONS,
  DASHBOARD_LIGHTS,
  MODIFICATION_TYPES
} from '@/types/follow-up-answers';
import { DecodedVehicleInfo } from '@/types/vehicle';
import { 
  Car, 
  AlertTriangle, 
  Wrench, 
  FileText, 
  Settings, 
  Shield, 
  Star,
  CheckCircle,
  ExternalLink,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface UnifiedFollowUpFormProps {
  vin: string;
  vehicle?: DecodedVehicleInfo;
  onComplete: (data: FollowUpAnswers) => void;
}

export function UnifiedFollowUpForm({ vin, vehicle, onComplete }: UnifiedFollowUpFormProps) {
  const [formData, setFormData] = useState<FollowUpAnswers>({
    vin,
    mileage: vehicle?.year ? (new Date().getFullYear() - vehicle.year) * 12000 : undefined,
    accidents: {
      hadAccident: false
    },
    modifications: {
      modified: false,
      types: []
    },
    dashboard_lights: [],
    features: [],
    completion_percentage: 0
  });

  const [openSections, setOpenSections] = useState<string[]>(['vehicle-condition']);

  // Calculate completion percentage
  useEffect(() => {
    const requiredFields = [
      'mileage',
      'zip_code', 
      'exterior_condition',
      'interior_condition'
    ];
    
    const optionalSections = [
      formData.accidents?.hadAccident ? 'accidents' : null,
      formData.modifications?.modified ? 'modifications' : null,
      'service_history',
      'title_status'
    ].filter(Boolean);

    const completed = requiredFields.filter(field => formData[field as keyof FollowUpAnswers]).length;
    const total = requiredFields.length + optionalSections.length;
    const percentage = Math.round((completed / total) * 100);
    
    setFormData(prev => ({
      ...prev,
      completion_percentage: percentage,
      is_complete: percentage >= 80
    }));
  }, [formData.mileage, formData.zip_code, formData.exterior_condition, formData.interior_condition, formData.accidents?.hadAccident, formData.modifications?.modified]);

  const handleMileageChange = (value: string) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue >= 0) {
      setFormData(prev => ({ ...prev, mileage: numValue }));
    }
  };

  const handleZipChange = (value: string) => {
    if (value.length <= 5 && /^\d*$/.test(value)) {
      setFormData(prev => ({ ...prev, zip_code: value }));
    }
  };

  const handleConditionChange = (field: 'exterior_condition' | 'interior_condition', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value as 'excellent' | 'good' | 'fair' | 'poor'
    }));
  };

  const handleAccidentChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      accidents: {
        ...prev.accidents,
        hadAccident: prev.accidents?.hadAccident || false,
        [field]: value
      }
    }));
  };

  const handleModificationChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      modifications: {
        ...prev.modifications,
        modified: prev.modifications?.modified || false,
        [field]: value
      }
    }));
  };

  const handleFeatureToggle = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features?.includes(feature) 
        ? prev.features.filter(f => f !== feature)
        : [...(prev.features || []), feature]
    }));
  };

  const handleDashboardLightToggle = (light: string) => {
    setFormData(prev => ({
      ...prev,
      dashboard_lights: prev.dashboard_lights?.includes(light)
        ? prev.dashboard_lights.filter(l => l !== light)
        : [...(prev.dashboard_lights || []), light]
    }));
  };

  const handleSubmit = () => {
    if (!formData.mileage || !formData.zip_code || !formData.exterior_condition || !formData.interior_condition) {
      toast.error('Please complete all required fields');
      return;
    }

    setFormData(prev => ({
      ...prev,
      updated_at: new Date().toISOString()
    }));

    onComplete(formData);
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'excellent': return 'text-green-600 bg-green-50 border-green-200';
      case 'good': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'fair': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'poor': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl text-blue-900">Complete Your Vehicle Assessment</CardTitle>
              <p className="text-blue-700 mt-1">
                {vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model}` : 'Vehicle Information'}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-900">{formData.completion_percentage || 0}%</div>
              <div className="text-sm text-blue-700">Complete</div>
            </div>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2 mt-4">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${formData.completion_percentage || 0}%` }}
            />
          </div>
        </CardHeader>
      </Card>

      {/* Form Sections */}
      <Accordion type="multiple" value={openSections} onValueChange={setOpenSections}>
        
        {/* Basic Vehicle Information */}
        <AccordionItem value="basic-info">
          <AccordionTrigger className="text-lg font-semibold">
            <div className="flex items-center gap-2">
              <Car className="h-5 w-5" />
              Basic Information
              {formData.mileage && formData.zip_code && (
                <CheckCircle className="h-4 w-4 text-green-600" />
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardContent className="pt-6 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="mileage" className="text-sm font-medium text-gray-700">
                      Current Mileage <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="mileage"
                      type="number"
                      placeholder="e.g., 45000"
                      value={formData.mileage || ''}
                      onChange={(e) => handleMileageChange(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="zip-code" className="text-sm font-medium text-gray-700">
                      ZIP Code <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="zip-code"
                      placeholder="e.g., 90210"
                      value={formData.zip_code || ''}
                      onChange={(e) => handleZipChange(e.target.value)}
                      className="mt-1"
                      maxLength={5}
                    />
                    <p className="text-xs text-gray-500 mt-1">Used for local market analysis</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* Vehicle Condition */}
        <AccordionItem value="vehicle-condition">
          <AccordionTrigger className="text-lg font-semibold">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Vehicle Condition
              {formData.exterior_condition && formData.interior_condition && (
                <CheckCircle className="h-4 w-4 text-green-600" />
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-6">
              {/* Exterior Condition */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Exterior Condition</CardTitle>
                  <p className="text-sm text-gray-600">Assess the overall exterior condition including paint, body panels, and visible damage</p>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={formData.exterior_condition || ''}
                    onValueChange={(value) => handleConditionChange('exterior_condition', value)}
                  >
                    {CONDITION_OPTIONS.map((option) => (
                      <div key={option.value} className={`flex items-start space-x-3 p-3 rounded-lg border-2 transition-colors ${
                        formData.exterior_condition === option.value 
                          ? getConditionColor(option.value)
                          : 'border-gray-200 hover:border-gray-300'
                      }`}>
                        <RadioGroupItem value={option.value} id={`exterior-${option.value}`} className="mt-1" />
                        <div className="flex-1">
                          <Label htmlFor={`exterior-${option.value}`} className="font-medium cursor-pointer">
                            {option.label}
                          </Label>
                          <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                          <Badge variant="outline" className="mt-2 text-xs">
                            {option.impact}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Interior Condition */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Interior Condition</CardTitle>
                  <p className="text-sm text-gray-600">Evaluate seats, dashboard, electronics, and overall interior wear</p>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={formData.interior_condition || ''}
                    onValueChange={(value) => handleConditionChange('interior_condition', value)}
                  >
                    {CONDITION_OPTIONS.map((option) => (
                      <div key={option.value} className={`flex items-start space-x-3 p-3 rounded-lg border-2 transition-colors ${
                        formData.interior_condition === option.value 
                          ? getConditionColor(option.value)
                          : 'border-gray-200 hover:border-gray-300'
                      }`}>
                        <RadioGroupItem value={option.value} id={`interior-${option.value}`} className="mt-1" />
                        <div className="flex-1">
                          <Label htmlFor={`interior-${option.value}`} className="font-medium cursor-pointer">
                            {option.label}
                          </Label>
                          <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                          <Badge variant="outline" className="mt-2 text-xs">
                            {option.impact}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                </CardContent>
              </Card>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Accident History */}
        <AccordionItem value="accident-history">
          <AccordionTrigger className="text-lg font-semibold">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Accident History
              {formData.accidents?.hadAccident !== undefined && (
                <CheckCircle className="h-4 w-4 text-green-600" />
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardContent className="pt-6 space-y-6">
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-3 block">
                    Has this vehicle been in any accidents?
                  </Label>
                  <RadioGroup
                    value={formData.accidents?.hadAccident ? 'yes' : 'no'}
                    onValueChange={(value) => handleAccidentChange('hadAccident', value === 'yes')}
                    className="flex space-x-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="accident-no" />
                      <Label htmlFor="accident-no">No accidents</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="accident-yes" />
                      <Label htmlFor="accident-yes">Yes, has accident history</Label>
                    </div>
                  </RadioGroup>
                </div>

                {formData.accidents?.hadAccident && (
                  <div className="space-y-4 p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="accident-count" className="text-sm font-medium text-gray-700">
                          Number of accidents
                        </Label>
                        <Input
                          id="accident-count"
                          type="number"
                          min="1"
                          placeholder="e.g., 1"
                          value={formData.accidents?.count || ''}
                          onChange={(e) => handleAccidentChange('count', parseInt(e.target.value) || undefined)}
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-gray-700">
                          Location of damage
                        </Label>
                        <Select 
                          value={formData.accidents?.location || ''} 
                          onValueChange={(value) => handleAccidentChange('location', value)}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select location" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="front">Front</SelectItem>
                            <SelectItem value="rear">Rear</SelectItem>
                            <SelectItem value="side">Side</SelectItem>
                            <SelectItem value="multiple">Multiple areas</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-gray-700">
                          Severity
                        </Label>
                        <Select 
                          value={formData.accidents?.severity || ''} 
                          onValueChange={(value) => handleAccidentChange('severity', value)}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select severity" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="minor">Minor (cosmetic damage)</SelectItem>
                            <SelectItem value="moderate">Moderate (structural damage)</SelectItem>
                            <SelectItem value="major">Major (extensive damage)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-gray-700 mb-3 block">
                          Professionally repaired?
                        </Label>
                        <RadioGroup
                          value={formData.accidents?.repaired ? 'yes' : 'no'}
                          onValueChange={(value) => handleAccidentChange('repaired', value === 'yes')}
                          className="flex space-x-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="repaired-yes" />
                            <Label htmlFor="repaired-yes">Yes</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="repaired-no" />
                            <Label htmlFor="repaired-no">No</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="frame-damage"
                        checked={formData.accidents?.frameDamage || false}
                        onCheckedChange={(checked) => handleAccidentChange('frameDamage', checked)}
                      />
                      <Label htmlFor="frame-damage" className="text-sm font-medium text-gray-700">
                        Frame damage involved
                      </Label>
                    </div>

                    <div>
                      <Label htmlFor="accident-description" className="text-sm font-medium text-gray-700">
                        Additional details
                      </Label>
                      <Textarea
                        id="accident-description"
                        placeholder="Describe the accident, repairs made, and any ongoing issues..."
                        value={formData.accidents?.description || ''}
                        onChange={(e) => handleAccidentChange('description', e.target.value)}
                        className="mt-1"
                        rows={3}
                      />
                    </div>
                  </div>
                )}

                {!formData.accidents?.hadAccident && formData.accidents?.hadAccident !== undefined && (
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <p className="text-green-800 font-medium">Clean accident history</p>
                    </div>
                    <p className="text-green-700 text-sm mt-1">
                      No accident history helps maintain higher resale value (+15-20%)
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* Service & Maintenance */}
        <AccordionItem value="service-maintenance">
          <AccordionTrigger className="text-lg font-semibold">
            <div className="flex items-center gap-2">
              <Wrench className="h-5 w-5" />
              Service & Maintenance
              {formData.service_history && (
                <CheckCircle className="h-4 w-4 text-green-600" />
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardContent className="pt-6 space-y-6">
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Service History
                  </Label>
                  <Select 
                    value={formData.service_history || ''} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, service_history: value }))}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select service history" />
                    </SelectTrigger>
                    <SelectContent>
                      {SERVICE_HISTORY_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label} - {option.impact}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Maintenance Status
                  </Label>
                  <Select 
                    value={formData.maintenance_status || ''} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, maintenance_status: value }))}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select maintenance status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="up-to-date">Up to date</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                      <SelectItem value="unknown">Unknown</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="last-service" className="text-sm font-medium text-gray-700">
                    Last Service Date (Optional)
                  </Label>
                  <Input
                    id="last-service"
                    type="date"
                    value={formData.last_service_date || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, last_service_date: e.target.value }))}
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* Title & Ownership */}
        <AccordionItem value="title-ownership">
          <AccordionTrigger className="text-lg font-semibold">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Title & Ownership
              {formData.title_status && (
                <CheckCircle className="h-4 w-4 text-green-600" />
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardContent className="pt-6 space-y-6">
                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Title Status
                  </Label>
                  <Select 
                    value={formData.title_status || ''} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, title_status: value }))}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select title status" />
                    </SelectTrigger>
                    <SelectContent>
                      {TITLE_STATUS_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label} - {option.impact}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="previous-owners" className="text-sm font-medium text-gray-700">
                      Number of Previous Owners
                    </Label>
                    <Input
                      id="previous-owners"
                      type="number"
                      min="0"
                      placeholder="e.g., 1"
                      value={formData.previous_owners || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, previous_owners: parseInt(e.target.value) || undefined }))}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700">
                      Previous Use
                    </Label>
                    <Select 
                      value={formData.previous_use || ''} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, previous_use: value }))}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select previous use" />
                      </SelectTrigger>
                      <SelectContent>
                        {PREVIOUS_USE_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label} - {option.impact}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* Vehicle Details */}
        <AccordionItem value="vehicle-details">
          <AccordionTrigger className="text-lg font-semibold">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Vehicle Details
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-6">
              {/* Tire Condition */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Tire Condition</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select 
                    value={formData.tire_condition || ''} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, tire_condition: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select tire condition" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIRE_CONDITION_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label} - {option.impact}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              {/* Dashboard Warning Lights */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Dashboard Warning Lights</CardTitle>
                  <p className="text-sm text-gray-600">Select any warning lights currently active</p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {DASHBOARD_LIGHTS.map((light) => (
                      <div key={light.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={light.value}
                          checked={formData.dashboard_lights?.includes(light.value) || false}
                          onCheckedChange={() => handleDashboardLightToggle(light.value)}
                        />
                        <Label htmlFor={light.value} className="text-sm cursor-pointer">
                          {light.icon} {light.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Modifications */}
        <AccordionItem value="modifications">
          <AccordionTrigger className="text-lg font-semibold">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Modifications
              {formData.modifications?.modified !== undefined && (
                <CheckCircle className="h-4 w-4 text-green-600" />
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardContent className="pt-6 space-y-6">
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-3 block">
                    Has this vehicle been modified?
                  </Label>
                  <RadioGroup
                    value={formData.modifications?.modified ? 'yes' : 'no'}
                    onValueChange={(value) => handleModificationChange('modified', value === 'yes')}
                    className="flex space-x-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="modified-no" />
                      <Label htmlFor="modified-no">No modifications</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="modified-yes" />
                      <Label htmlFor="modified-yes">Yes, has modifications</Label>
                    </div>
                  </RadioGroup>
                </div>

                {formData.modifications?.modified && (
                  <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-3 block">
                        Types of modifications
                      </Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {MODIFICATION_TYPES.map((type) => (
                          <div key={type} className="flex items-center space-x-2">
                            <Checkbox
                              id={type}
                              checked={formData.modifications?.types?.includes(type) || false}
                              onCheckedChange={() => {
                                const currentTypes = formData.modifications?.types || [];
                                const newTypes = currentTypes.includes(type)
                                  ? currentTypes.filter(t => t !== type)
                                  : [...currentTypes, type];
                                handleModificationChange('types', newTypes);
                              }}
                            />
                            <Label htmlFor={type} className="text-sm cursor-pointer">
                              {type}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-3 block">
                        Are modifications reversible?
                      </Label>
                      <RadioGroup
                        value={formData.modifications?.reversible ? 'yes' : 'no'}
                        onValueChange={(value) => setFormData(prev => ({
                          ...prev,
                          modifications: {
                            ...prev.modifications,
                            modified: prev.modifications?.modified || false,
                            reversible: value === 'yes'
                          }
                        }))}
                        className="flex space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="reversible-yes" />
                          <Label htmlFor="reversible-yes">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="reversible-no" />
                          <Label htmlFor="reversible-no">No</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* Enhanced Features */}
        <AccordionItem value="features">
          <AccordionTrigger className="text-lg font-semibold">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Premium Features
              <Badge variant="secondary" className="ml-2">Optional</Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Select Your Vehicle's Premium Features</CardTitle>
                <p className="text-sm text-gray-600">
                  Each feature adds value to your vehicle. Select all that apply.
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { name: 'Leather Seats', value: '+$2,000' },
                    { name: 'Sunroof/Moonroof', value: '+$1,500' },
                    { name: 'Navigation System', value: '+$1,200' },
                    { name: 'Backup Camera', value: '+$800' },
                    { name: 'Heated Seats', value: '+$1,000' },
                    { name: 'Premium Sound System', value: '+$1,500' },
                    { name: 'Bluetooth Connectivity', value: '+$500' },
                    { name: 'Cruise Control', value: '+$600' },
                    { name: 'Alloy Wheels', value: '+$800' },
                    { name: 'Remote Start', value: '+$700' },
                    { name: 'Keyless Entry', value: '+$500' },
                    { name: 'Third Row Seating', value: '+$2,500' }
                  ].map((feature) => (
                    <div 
                      key={feature.name} 
                      className={`flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                        formData.features?.includes(feature.name) 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleFeatureToggle(feature.name)}
                    >
                      <div className="flex items-center space-x-3">
                        <Checkbox 
                          checked={formData.features?.includes(feature.name) || false}
                          readOnly
                        />
                        <Label className="cursor-pointer font-medium">{feature.name}</Label>
                      </div>
                      <Badge variant="outline" className="text-green-600">
                        {feature.value}
                      </Badge>
                    </div>
                  ))}
                </div>
                
                {formData.features && formData.features.length > 0 && (
                  <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm font-medium text-green-800">
                      Selected features may add significant value to your vehicle
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Submit Button */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div>
              <h3 className="font-semibold text-green-900">Ready to get your valuation?</h3>
              <p className="text-sm text-green-700">
                Complete the required fields to get your vehicle's estimated value
              </p>
            </div>
            <Button 
              onClick={handleSubmit}
              disabled={!formData.mileage || !formData.zip_code || !formData.exterior_condition || !formData.interior_condition}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-2 min-w-[200px]"
              size="lg"
            >
              <TrendingUp className="mr-2 h-4 w-4" />
              Get My Valuation
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
