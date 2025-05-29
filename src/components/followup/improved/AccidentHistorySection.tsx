
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, AlertTriangle, CheckCircle2 } from 'lucide-react';

export interface AccidentDetails {
  severity: 'minor' | 'moderate' | 'major';
  location: string;
  repaired: boolean;
  cost?: number;
  description?: string;
}

interface AccidentHistorySectionProps {
  value: AccidentDetails;
  onChange: (value: AccidentDetails) => void;
}

const severityOptions = [
  {
    id: 'minor',
    title: 'Minor',
    description: 'Cosmetic damage, no structural impact',
    icon: CheckCircle2,
    valueImpact: '-2% to -5%',
    color: 'text-yellow-600 bg-yellow-50 border-yellow-200'
  },
  {
    id: 'moderate',
    title: 'Moderate',
    description: 'Some structural damage, properly repaired',
    icon: AlertTriangle,
    valueImpact: '-8% to -15%',
    color: 'text-orange-600 bg-orange-50 border-orange-200'
  },
  {
    id: 'major',
    title: 'Major',
    description: 'Significant structural damage',
    icon: AlertTriangle,
    valueImpact: '-20% to -35%',
    color: 'text-red-600 bg-red-50 border-red-200'
  }
];

const locationOptions = [
  'Front',
  'Rear', 
  'Driver Side',
  'Passenger Side',
  'Roof',
  'Multiple Areas'
];

export function AccidentHistorySection({ value, onChange }: AccidentHistorySectionProps) {
  const updateField = (field: keyof AccidentDetails, fieldValue: any) => {
    onChange({
      ...value,
      [field]: fieldValue
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-orange-500" />
          Accident Details
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Provide details about the accident to ensure accurate valuation
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Severity Selection */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Accident Severity</Label>
          <div className="grid gap-3">
            {severityOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = value.severity === option.id;
              
              return (
                <div
                  key={option.id}
                  onClick={() => updateField('severity', option.id)}
                  className={`
                    relative cursor-pointer rounded-lg border-2 p-4 transition-all hover:shadow-md
                    ${isSelected 
                      ? `${option.color} ring-2 ring-blue-500 ring-offset-2` 
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                    }
                  `}
                >
                  <div className="flex items-start space-x-3">
                    <Icon className={`h-5 w-5 mt-0.5 ${isSelected ? option.color.split(' ')[0] : 'text-gray-400'}`} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className={`font-medium ${isSelected ? 'text-gray-900' : 'text-gray-700'}`}>
                          {option.title}
                        </h3>
                        <Badge variant={isSelected ? 'default' : 'secondary'} className="text-xs">
                          {option.valueImpact}
                        </Badge>
                      </div>
                      <p className={`text-sm mt-1 ${isSelected ? 'text-gray-700' : 'text-gray-500'}`}>
                        {option.description}
                      </p>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="h-5 w-5 text-blue-600" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Location */}
        <div className="space-y-2">
          <Label htmlFor="accident-location">Accident Location on Vehicle</Label>
          <Select value={value.location} onValueChange={(val) => updateField('location', val)}>
            <SelectTrigger>
              <SelectValue placeholder="Select accident location" />
            </SelectTrigger>
            <SelectContent>
              {locationOptions.map((location) => (
                <SelectItem key={location} value={location.toLowerCase().replace(' ', '-')}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Repair Status */}
        <div className="space-y-3">
          <Label>Was the damage professionally repaired?</Label>
          <div className="flex gap-3">
            <Button
              type="button"
              variant={value.repaired ? "default" : "outline"}
              onClick={() => updateField('repaired', true)}
              className="flex-1"
            >
              Yes, professionally repaired
            </Button>
            <Button
              type="button"
              variant={!value.repaired ? "default" : "outline"}
              onClick={() => updateField('repaired', false)}
              className="flex-1"
            >
              No / DIY repair
            </Button>
          </div>
        </div>

        {/* Repair Cost */}
        {value.repaired && (
          <div className="space-y-2">
            <Label htmlFor="repair-cost">Repair Cost (Optional)</Label>
            <Input
              id="repair-cost"
              type="number"
              placeholder="Enter repair cost"
              value={value.cost || ''}
              onChange={(e) => updateField('cost', e.target.value ? parseFloat(e.target.value) : undefined)}
            />
          </div>
        )}

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="accident-description">Additional Details (Optional)</Label>
          <Textarea
            id="accident-description"
            placeholder="Describe the accident circumstances, parts affected, repair quality, etc."
            value={value.description || ''}
            onChange={(e) => updateField('description', e.target.value)}
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );
}
