
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Plus, Trash2, Wrench, Calendar } from 'lucide-react';

interface MaintenanceRecord {
  id: string;
  type: string;
  date: string;
  mileage: number;
  description: string;
  cost?: number;
}

interface MaintenanceHistoryData {
  maintenanceFrequency: string;
  lastServiceDate: string;
  lastServiceMileage: number;
  records: MaintenanceRecord[];
  upcomingNeeds?: string;
}

interface MaintenanceHistoryStepProps {
  onComplete: (data: MaintenanceHistoryData) => void;
  onSkip: () => void;
  initialData?: Partial<MaintenanceHistoryData>;
}

export const MaintenanceHistoryStep: React.FC<MaintenanceHistoryStepProps> = ({
  onComplete,
  onSkip,
  initialData = {}
}) => {
  const [data, setData] = useState<MaintenanceHistoryData>({
    maintenanceFrequency: initialData.maintenanceFrequency || '',
    lastServiceDate: initialData.lastServiceDate || '',
    lastServiceMileage: initialData.lastServiceMileage || 0,
    records: initialData.records || [],
    upcomingNeeds: initialData.upcomingNeeds || ''
  });

  const maintenanceFrequencyOptions = [
    { value: 'excellent', label: 'Excellent', description: 'Always on schedule, full service records' },
    { value: 'good', label: 'Good', description: 'Regular maintenance, most records available' },
    { value: 'fair', label: 'Fair', description: 'Some maintenance, limited records' },
    { value: 'poor', label: 'Poor', description: 'Minimal maintenance, no records' }
  ];

  const addMaintenanceRecord = () => {
    const newRecord: MaintenanceRecord = {
      id: Date.now().toString(),
      type: '',
      date: '',
      mileage: 0,
      description: ''
    };
    setData(prev => ({
      ...prev,
      records: [...prev.records, newRecord]
    }));
  };

  const updateRecord = (id: string, field: keyof MaintenanceRecord, value: any) => {
    setData(prev => ({
      ...prev,
      records: prev.records.map(record =>
        record.id === id ? { ...record, [field]: value } : record
      )
    }));
  };

  const removeRecord = (id: string) => {
    setData(prev => ({
      ...prev,
      records: prev.records.filter(record => record.id !== id)
    }));
  };

  const isBasicComplete = data.maintenanceFrequency && data.lastServiceDate;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Maintenance History</h2>
        <p className="text-gray-600">
          Well-maintained vehicles typically have higher values. Share your maintenance history to improve accuracy.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Maintenance Frequency
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup 
            value={data.maintenanceFrequency} 
            onValueChange={(value) => setData(prev => ({ ...prev, maintenanceFrequency: value }))}
          >
            {maintenanceFrequencyOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={`frequency-${option.value}`} />
                <Label htmlFor={`frequency-${option.value}`} className="flex-1 cursor-pointer">
                  <div>
                    <p className="font-medium">{option.label}</p>
                    <p className="text-sm text-gray-500">{option.description}</p>
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Last Service</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="lastServiceDate">Service Date</Label>
              <Input
                id="lastServiceDate"
                type="date"
                value={data.lastServiceDate}
                onChange={(e) => setData(prev => ({ ...prev, lastServiceDate: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="lastServiceMileage">Mileage at Service</Label>
              <Input
                id="lastServiceMileage"
                type="number"
                placeholder="e.g., 45000"
                value={data.lastServiceMileage || ''}
                onChange={(e) => setData(prev => ({ ...prev, lastServiceMileage: parseInt(e.target.value) || 0 }))}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Maintenance</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Any upcoming maintenance needs or overdue services..."
              value={data.upcomingNeeds}
              onChange={(e) => setData(prev => ({ ...prev, upcomingNeeds: e.target.value }))}
              rows={4}
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wrench className="h-5 w-5" />
              Recent Maintenance Records (Optional)
            </div>
            <Button variant="outline" size="sm" onClick={addMaintenanceRecord}>
              <Plus className="h-4 w-4 mr-1" />
              Add Record
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {data.records.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              No maintenance records added. Click "Add Record" to improve valuation accuracy.
            </p>
          ) : (
            <div className="space-y-4">
              {data.records.map((record) => (
                <div key={record.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium">Maintenance Record</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeRecord(record.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Service Type</Label>
                      <Input
                        placeholder="e.g., Oil Change"
                        value={record.type}
                        onChange={(e) => updateRecord(record.id, 'type', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Date</Label>
                      <Input
                        type="date"
                        value={record.date}
                        onChange={(e) => updateRecord(record.id, 'date', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Mileage</Label>
                      <Input
                        type="number"
                        placeholder="Mileage"
                        value={record.mileage || ''}
                        onChange={(e) => updateRecord(record.id, 'mileage', parseInt(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      placeholder="Details about the service performed..."
                      value={record.description}
                      onChange={(e) => updateRecord(record.id, 'description', e.target.value)}
                      rows={2}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button
          onClick={() => onComplete(data)}
          disabled={!isBasicComplete}
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
