import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Plus, X, CheckCircle } from 'lucide-react';

interface AccidentReport {
  id: string;
  severity: 'minor' | 'moderate' | 'severe';
  location: 'front' | 'rear' | 'side' | 'multiple';
  professionallyRepaired: boolean;
  description: string;
  estimatedCost?: number;
}

interface AccidentHistorySectionProps {
  hasAccident: boolean;
  accidents: AccidentReport[];
  onChange: (hasAccident: boolean, accidents: AccidentReport[]) => void;
}

const severityOptions = [
  { value: 'minor', label: 'Minor', description: 'Cosmetic damage only', impact: '-5% to -10%' },
  { value: 'moderate', label: 'Moderate', description: 'Structural damage, no frame', impact: '-10% to -20%' },
  { value: 'severe', label: 'Severe', description: 'Frame damage, airbag deployment', impact: '-20% to -40%' }
];

const locationOptions = [
  { value: 'front', label: 'Front End' },
  { value: 'rear', label: 'Rear End' },
  { value: 'side', label: 'Side Impact' },
  { value: 'multiple', label: 'Multiple Areas' }
];

export function AccidentHistorySection({ hasAccident, accidents, onChange }: AccidentHistorySectionProps) {
  const [currentReport, setCurrentReport] = useState<Partial<AccidentReport>>({});

  const addAccidentReport = () => {
    if (currentReport.severity && currentReport.location) {
      const newReport: AccidentReport = {
        id: Date.now().toString(),
        severity: currentReport.severity as 'minor' | 'moderate' | 'severe',
        location: currentReport.location as 'front' | 'rear' | 'side' | 'multiple',
        professionallyRepaired: currentReport.professionallyRepaired || false,
        description: currentReport.description || '',
        estimatedCost: currentReport.estimatedCost
      };
      
      onChange(true, [...accidents, newReport]);
      setCurrentReport({});
    }
  };

  const removeAccidentReport = (id: string) => {
    const updatedAccidents = accidents.filter(acc => acc.id !== id);
    onChange(updatedAccidents.length > 0, updatedAccidents);
  };

  const handleAccidentToggle = (value: boolean) => {
    onChange(value, value ? accidents : []);
    if (!value) {
      setCurrentReport({});
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-orange-500" />
          Accident History
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Has this vehicle been in any accidents?
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Yes/No Toggle */}
        <div className="flex gap-3">
          <Button
            type="button"
            variant={!hasAccident ? "default" : "outline"}
            onClick={() => handleAccidentToggle(false)}
            className="flex-1"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            No accidents
          </Button>
          <Button
            type="button"
            variant={hasAccident ? "default" : "outline"}
            onClick={() => handleAccidentToggle(true)}
            className="flex-1"
          >
            <AlertTriangle className="h-4 w-4 mr-2" />
            Yes, there were accidents
          </Button>
        </div>

        {hasAccident && (
          <div className="space-y-4 border-t pt-4">
            {/* Existing Accident Reports */}
            {accidents.map((accident, index) => (
              <div key={accident.id} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">Accident #{index + 1}</h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAccidentReport(accident.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Severity:</span> {accident.severity}
                    <Badge variant="secondary" className="ml-2">
                      {severityOptions.find(s => s.value === accident.severity)?.impact}
                    </Badge>
                  </div>
                  <div>
                    <span className="font-medium">Location:</span> {accident.location}
                  </div>
                  <div>
                    <span className="font-medium">Professionally Repaired:</span> {accident.professionallyRepaired ? 'Yes' : 'No'}
                  </div>
                  {accident.estimatedCost && (
                    <div>
                      <span className="font-medium">Repair Cost:</span> ${accident.estimatedCost.toLocaleString()}
                    </div>
                  )}
                </div>
                {accident.description && (
                  <div className="mt-2">
                    <span className="font-medium text-sm">Description:</span>
                    <p className="text-sm text-gray-600 mt-1">{accident.description}</p>
                  </div>
                )}
              </div>
            ))}

            {/* Add New Accident Form */}
            <div className="border-2 border-dashed border-gray-300 p-4 rounded-lg">
              <h4 className="font-medium mb-3">Add Accident Report</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Severity Level</Label>
                  <Select value={currentReport.severity} onValueChange={(value) => setCurrentReport({...currentReport, severity: value as any})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                    <SelectContent>
                      {severityOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          <div>
                            <div className="font-medium">{option.label}</div>
                            <div className="text-xs text-gray-500">{option.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Accident Location</Label>
                  <Select value={currentReport.location} onValueChange={(value) => setCurrentReport({...currentReport, location: value as any})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
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

                <div>
                  <Label>Estimated Repair Cost (Optional)</Label>
                  <Input
                    type="number"
                    placeholder="$0"
                    value={currentReport.estimatedCost || ''}
                    onChange={(e) => setCurrentReport({...currentReport, estimatedCost: parseInt(e.target.value) || undefined})}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="professionally-repaired"
                    checked={currentReport.professionallyRepaired || false}
                    onChange={(e) => setCurrentReport({...currentReport, professionallyRepaired: e.target.checked})}
                  />
                  <Label htmlFor="professionally-repaired">Professionally repaired</Label>
                </div>
              </div>

              <div className="mt-4">
                <Label>Description (Optional)</Label>
                <Textarea
                  placeholder="Describe the accident and repairs..."
                  value={currentReport.description || ''}
                  onChange={(e) => setCurrentReport({...currentReport, description: e.target.value})}
                  rows={3}
                />
              </div>

              <Button
                type="button"
                onClick={addAccidentReport}
                disabled={!currentReport.severity || !currentReport.location}
                className="mt-4"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Accident Report
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
