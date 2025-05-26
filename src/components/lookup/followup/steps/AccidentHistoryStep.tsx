
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { AlertTriangle, Shield, FileText } from 'lucide-react';

interface AccidentRecord {
  id: string;
  severity: string;
  date: string;
  description: string;
  repairCost?: number;
  wasReported: boolean;
}

interface AccidentHistoryData {
  hasAccidents: boolean;
  accidentCount: number;
  accidents: AccidentRecord[];
  hasInsuranceClaims: boolean;
  claimsDescription?: string;
}

interface AccidentHistoryStepProps {
  onComplete: (data: AccidentHistoryData) => void;
  onSkip: () => void;
  initialData?: Partial<AccidentHistoryData>;
}

export const AccidentHistoryStep: React.FC<AccidentHistoryStepProps> = ({
  onComplete,
  onSkip,
  initialData = {}
}) => {
  const [data, setData] = useState<AccidentHistoryData>({
    hasAccidents: initialData.hasAccidents ?? false,
    accidentCount: initialData.accidentCount || 0,
    accidents: initialData.accidents || [],
    hasInsuranceClaims: initialData.hasInsuranceClaims ?? false,
    claimsDescription: initialData.claimsDescription || ''
  });

  const severityOptions = [
    { value: 'minor', label: 'Minor', description: 'Cosmetic damage, no structural impact' },
    { value: 'moderate', label: 'Moderate', description: 'Some structural damage, professional repair needed' },
    { value: 'major', label: 'Major', description: 'Significant structural damage, extensive repair' },
    { value: 'total', label: 'Total Loss', description: 'Vehicle was declared a total loss' }
  ];

  const addAccident = () => {
    const newAccident: AccidentRecord = {
      id: Date.now().toString(),
      severity: '',
      date: '',
      description: '',
      wasReported: false
    };
    setData(prev => ({
      ...prev,
      accidents: [...prev.accidents, newAccident],
      accidentCount: prev.accidents.length + 1
    }));
  };

  const updateAccident = (id: string, field: keyof AccidentRecord, value: any) => {
    setData(prev => ({
      ...prev,
      accidents: prev.accidents.map(accident =>
        accident.id === id ? { ...accident, [field]: value } : accident
      )
    }));
  };

  const removeAccident = (id: string) => {
    setData(prev => ({
      ...prev,
      accidents: prev.accidents.filter(accident => accident.id !== id),
      accidentCount: Math.max(0, prev.accidentCount - 1)
    }));
  };

  const handleHasAccidentsChange = (hasAccidents: boolean) => {
    setData(prev => ({
      ...prev,
      hasAccidents,
      accidentCount: hasAccidents ? prev.accidentCount : 0,
      accidents: hasAccidents ? prev.accidents : []
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Accident History</h2>
        <p className="text-gray-600">
          Accident history significantly impacts vehicle value. Please provide accurate information for the most precise valuation.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Has this vehicle been in any accidents?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup 
            value={data.hasAccidents ? 'yes' : 'no'} 
            onValueChange={(value) => handleHasAccidentsChange(value === 'yes')}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="no-accidents" />
              <Label htmlFor="no-accidents" className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-600" />
                No accidents or damage
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="has-accidents" />
              <Label htmlFor="has-accidents" className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                Yes, this vehicle has been in accident(s)
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {data.hasAccidents && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Accident Details</span>
              <Button variant="outline" size="sm" onClick={addAccident}>
                Add Accident
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.accidents.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                Click "Add Accident" to provide details about each incident.
              </p>
            ) : (
              <div className="space-y-6">
                {data.accidents.map((accident, index) => (
                  <div key={accident.id} className="border rounded-lg p-4 space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Accident #{index + 1}</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAccident(accident.id)}
                      >
                        Remove
                      </Button>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium">Severity Level</Label>
                      <RadioGroup 
                        value={accident.severity} 
                        onValueChange={(value) => updateAccident(accident.id, 'severity', value)}
                        className="mt-2"
                      >
                        {severityOptions.map((option) => (
                          <div key={option.value} className="flex items-center space-x-2">
                            <RadioGroupItem value={option.value} id={`severity-${accident.id}-${option.value}`} />
                            <Label htmlFor={`severity-${accident.id}-${option.value}`} className="flex-1">
                              <div>
                                <p className="font-medium">{option.label}</p>
                                <p className="text-sm text-gray-500">{option.description}</p>
                              </div>
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`date-${accident.id}`}>Accident Date</Label>
                        <Input
                          id={`date-${accident.id}`}
                          type="date"
                          value={accident.date}
                          onChange={(e) => updateAccident(accident.id, 'date', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor={`cost-${accident.id}`}>Repair Cost (Optional)</Label>
                        <Input
                          id={`cost-${accident.id}`}
                          type="number"
                          placeholder="$0"
                          value={accident.repairCost || ''}
                          onChange={(e) => updateAccident(accident.id, 'repairCost', parseInt(e.target.value) || undefined)}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor={`description-${accident.id}`}>Description</Label>
                      <Textarea
                        id={`description-${accident.id}`}
                        placeholder="Describe the accident and any repairs made..."
                        value={accident.description}
                        onChange={(e) => updateAccident(accident.id, 'description', e.target.value)}
                        rows={3}
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`reported-${accident.id}`}
                        checked={accident.wasReported}
                        onChange={(e) => updateAccident(accident.id, 'wasReported', e.target.checked)}
                        className="rounded"
                      />
                      <Label htmlFor={`reported-${accident.id}`}>
                        This accident was reported to insurance/police
                      </Label>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Insurance Claims
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <RadioGroup 
            value={data.hasInsuranceClaims ? 'yes' : 'no'} 
            onValueChange={(value) => setData(prev => ({ ...prev, hasInsuranceClaims: value === 'yes' }))}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="no-claims" />
              <Label htmlFor="no-claims">No insurance claims filed</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="has-claims" />
              <Label htmlFor="has-claims">Insurance claims have been filed</Label>
            </div>
          </RadioGroup>

          {data.hasInsuranceClaims && (
            <div>
              <Label htmlFor="claims-description">Claims Description</Label>
              <Textarea
                id="claims-description"
                placeholder="Describe any insurance claims filed for this vehicle..."
                value={data.claimsDescription}
                onChange={(e) => setData(prev => ({ ...prev, claimsDescription: e.target.value }))}
                rows={3}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button
          onClick={() => onComplete(data)}
          className="flex-1"
        >
          Continue
        </Button>
        <Button
          variant="outline"
          onClick={onSkip}
          className="px-8"
        >
          Skip for Now
        </Button>
      </div>
    </div>
  );
};
