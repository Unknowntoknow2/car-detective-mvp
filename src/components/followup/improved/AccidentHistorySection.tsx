
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, AlertTriangle, Car, DollarSign } from 'lucide-react';

interface AccidentDetails {
  hadAccident: boolean;
  count?: number;
  severity?: 'minor' | 'moderate' | 'major';
  repaired?: boolean;
  frameDamage?: boolean;
  description?: string;
  location?: string;
  repairCost?: number;
  accidents?: Array<{
    severity: 'minor' | 'moderate' | 'major';
    location: string;
    repaired: boolean;
    cost?: number;
    description?: string;
  }>;
}

interface AccidentHistorySectionProps {
  value: AccidentDetails;
  onChange: (value: AccidentDetails) => void;
}

const severityOptions = [
  {
    id: 'minor',
    title: 'Minor',
    description: 'Cosmetic damage only, no structural impact',
    icon: '🟢',
    valueImpact: '-2% to -5%',
    color: 'text-green-600 bg-green-50 border-green-200'
  },
  {
    id: 'moderate',
    title: 'Moderate',
    description: 'Visible damage requiring repairs',
    icon: '🟡',
    valueImpact: '-8% to -15%',
    color: 'text-yellow-600 bg-yellow-50 border-yellow-200'
  },
  {
    id: 'major',
    title: 'Major',
    description: 'Significant structural damage',
    icon: '🔴',
    valueImpact: '-20% to -40%',
    color: 'text-red-600 bg-red-50 border-red-200'
  }
];

const locationOptions = [
  { value: 'front', label: 'Front End' },
  { value: 'rear', label: 'Rear End' },
  { value: 'side', label: 'Side Impact' },
  { value: 'roof', label: 'Roof/Rollover' },
  { value: 'multiple', label: 'Multiple Areas' }
];

export function AccidentHistorySection({ value, onChange }: AccidentHistorySectionProps) {
  const handleAccidentToggle = (hadAccident: boolean) => {
    onChange({
      ...value,
      hadAccident,
      count: hadAccident ? (value.count || 1) : undefined,
      accidents: hadAccident ? (value.accidents || []) : [],
      severity: hadAccident ? value.severity : undefined,
      location: hadAccident ? value.location : undefined,
      repaired: hadAccident ? value.repaired : undefined,
      repairCost: hadAccident ? value.repairCost : undefined,
      description: hadAccident ? value.description : undefined
    });
  };

  const handleAccidentCountChange = (count: number) => {
    const accidents = Array.from({ length: count }, (_, index) => 
      value.accidents?.[index] || {
        severity: 'minor' as const,
        location: 'front',
        repaired: false,
        cost: undefined,
        description: ''
      }
    );
    
    onChange({
      ...value,
      count,
      accidents
    });
  };

  const updateAccident = (index: number, accidentData: Partial<typeof value.accidents[0]>) => {
    const updatedAccidents = [...(value.accidents || [])];
    updatedAccidents[index] = { ...updatedAccidents[index], ...accidentData };
    onChange({
      ...value,
      accidents: updatedAccidents
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Accident History
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Accident history significantly impacts vehicle value
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Has Accident Toggle */}
        <div>
          <Label className="text-base font-medium">Has this vehicle been in any accidents?</Label>
          <RadioGroup 
            value={value.hadAccident ? 'yes' : 'no'}
            onValueChange={(val) => handleAccidentToggle(val === 'yes')}
            className="flex gap-6 mt-3"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="no-accident" />
              <Label htmlFor="no-accident" className="cursor-pointer">No accidents</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="yes-accident" />
              <Label htmlFor="yes-accident" className="cursor-pointer">Yes, there were accidents</Label>
            </div>
          </RadioGroup>
        </div>

        {value.hadAccident && (
          <div className="space-y-6 pt-4 border-t">
            {/* Accident Count */}
            <div>
              <Label className="text-base font-medium">Number of accidents</Label>
              <Select 
                value={value.count?.toString() || '1'} 
                onValueChange={(val) => handleAccidentCountChange(parseInt(val))}
              >
                <SelectTrigger className="w-full mt-2">
                  <SelectValue placeholder="Select number of accidents" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map(num => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} {num === 1 ? 'accident' : 'accidents'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Individual Accident Details */}
            {value.accidents?.map((accident, index) => (
              <div key={index} className="space-y-4 p-4 border rounded-lg bg-gray-50">
                <h4 className="font-medium flex items-center gap-2">
                  <Car className="h-4 w-4" />
                  Accident #{index + 1}
                </h4>

                {/* Severity Selection */}
                <div>
                  <Label className="text-sm font-medium">Severity Level</Label>
                  <div className="grid grid-cols-1 gap-3 mt-2">
                    {severityOptions.map((option) => (
                      <div
                        key={option.id}
                        onClick={() => updateAccident(index, { severity: option.id as 'minor' | 'moderate' | 'major' })}
                        className={`
                          cursor-pointer rounded-lg border-2 p-3 transition-all hover:shadow-md
                          ${accident.severity === option.id 
                            ? `${option.color} ring-2 ring-blue-500 ring-offset-2` 
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                          }
                        `}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-lg">{option.icon}</span>
                            <div>
                              <h4 className="font-medium">{option.title}</h4>
                              <p className="text-sm text-gray-600">{option.description}</p>
                            </div>
                          </div>
                          <Badge variant={accident.severity === option.id ? 'default' : 'secondary'} className="text-xs">
                            {option.valueImpact}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Location */}
                <div>
                  <Label className="text-sm font-medium">Accident Location</Label>
                  <Select 
                    value={accident.location || 'front'} 
                    onValueChange={(val) => updateAccident(index, { location: val })}
                  >
                    <SelectTrigger className="w-full mt-2">
                      <SelectValue placeholder="Select accident location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locationOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Professional Repair */}
                <div>
                  <Label className="text-sm font-medium">Was it professionally repaired?</Label>
                  <RadioGroup 
                    value={accident.repaired ? 'yes' : 'no'}
                    onValueChange={(val) => updateAccident(index, { repaired: val === 'yes' })}
                    className="flex gap-4 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id={`repaired-yes-${index}`} />
                      <Label htmlFor={`repaired-yes-${index}`}>Yes, professionally repaired</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id={`repaired-no-${index}`} />
                      <Label htmlFor={`repaired-no-${index}`}>No / DIY repair</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Repair Cost */}
                {accident.repaired && (
                  <div>
                    <Label className="text-sm font-medium flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Repair Cost (optional)
                    </Label>
                    <Input
                      type="number"
                      placeholder="Enter repair cost"
                      value={accident.cost || ''}
                      onChange={(e) => updateAccident(index, { cost: e.target.value ? parseInt(e.target.value) : undefined })}
                      className="mt-2"
                    />
                  </div>
                )}

                {/* Description */}
                <div>
                  <Label className="text-sm font-medium">Description (optional)</Label>
                  <Textarea
                    placeholder="Describe the accident and any additional details..."
                    value={accident.description || ''}
                    onChange={(e) => updateAccident(index, { description: e.target.value })}
                    rows={3}
                    className="mt-2"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
