
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export interface FollowUpFormProps {
  onSubmit: (data: any) => void | Promise<void>;
  apiData?: {
    make: string;
    model: string;
    year: number;
    zipCode: string;
  };
}

const FollowUpForm: React.FC<FollowUpFormProps> = ({ onSubmit, apiData }) => {
  const [formData, setFormData] = useState({
    mileage: '',
    condition: 'good',
    accidents: 0,
    serviceHistory: 'regular',
    ...apiData
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Additional Vehicle Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="mileage">Mileage</Label>
            <Input
              id="mileage"
              type="number"
              value={formData.mileage}
              onChange={(e) => setFormData(prev => ({ ...prev, mileage: e.target.value }))}
              placeholder="Enter current mileage"
            />
          </div>

          <div>
            <Label htmlFor="condition">Condition</Label>
            <Select value={formData.condition} onValueChange={(value) => setFormData(prev => ({ ...prev, condition: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="excellent">Excellent</SelectItem>
                <SelectItem value="very-good">Very Good</SelectItem>
                <SelectItem value="good">Good</SelectItem>
                <SelectItem value="fair">Fair</SelectItem>
                <SelectItem value="poor">Poor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="accidents">Number of Accidents</Label>
            <Input
              id="accidents"
              type="number"
              min="0"
              value={formData.accidents}
              onChange={(e) => setFormData(prev => ({ ...prev, accidents: parseInt(e.target.value) || 0 }))}
            />
          </div>

          <Button type="submit" className="w-full">
            Submit Additional Details
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default FollowUpForm;
