// ✅ File: src/components/lookup/followup/FollowUpForm.tsx

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';

interface FollowUpFormProps {
  onSubmit: (data: any) => void;
  apiData?: {
    make: string;
    model: string;
    year: number;
    trim?: string;
    engine?: string;
    drivetrain?: string;
    fuelType?: string;
    zipCode?: string;
  };
}

const featureList = [
  { label: 'Sunroof', valueImpact: 400 },
  { label: 'Leather Seats', valueImpact: 600 },
  { label: 'Navigation System', valueImpact: 300 },
  { label: 'Bluetooth', valueImpact: 150 },
  { label: 'Backup Camera', valueImpact: 250 },
  { label: 'Heated Seats', valueImpact: 200 },
  { label: 'Premium Sound', valueImpact: 350 },
];

const FollowUpForm: React.FC<FollowUpFormProps> = ({ onSubmit, apiData }) => {
  const [mileage, setMileage] = useState('');
  const [tireCondition, setTireCondition] = useState(75);
  const [vehicleCondition, setVehicleCondition] = useState(80);
  const [usageType, setUsageType] = useState('personal');
  const [ownership, setOwnership] = useState('first-owner');
  const [loanStatus, setLoanStatus] = useState('paid');
  const [hadAccident, setHadAccident] = useState('no');
  const [accidentCount, setAccidentCount] = useState('');
  const [accidentSeverity, setAccidentSeverity] = useState('minor');
  const [accidentArea, setAccidentArea] = useState('');
  const [features, setFeatures] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      mileage,
      tireCondition,
      vehicleCondition,
      usageType,
      ownership,
      loanStatus,
      hadAccident,
      accidentDetails: hadAccident === 'yes' ? { accidentCount, accidentSeverity, accidentArea } : null,
      features,
    });
  };

  const handleFeatureChange = (feature: string) => {
    setFeatures((prev) =>
      prev.includes(feature) ? prev.filter((f) => f !== feature) : [...prev, feature]
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Refine Your Valuation Details</CardTitle>
        {apiData && (
          <p className="text-sm text-muted-foreground">
            {apiData.year} {apiData.make} {apiData.model} {apiData.trim ? `- ${apiData.trim}` : ''}
            {apiData.engine ? ` • ${apiData.engine}` : ''}
            {apiData.drivetrain ? ` • ${apiData.drivetrain}` : ''}
            {apiData.fuelType ? ` • ${apiData.fuelType}` : ''}
            {apiData.zipCode ? ` • ZIP ${apiData.zipCode}` : ''}
          </p>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">

          <div>
            <Label htmlFor="mileage">Mileage</Label>
            <Input
              id="mileage"
              type="number"
              value={mileage}
              onChange={(e) => setMileage(e.target.value)}
              placeholder="e.g., 42000"
              required
            />
          </div>

          <div>
            <Label>Vehicle Condition</Label>
            <Slider
              min={25}
              max={90}
              step={5}
              value={[vehicleCondition]}
              onValueChange={([v]) => setVehicleCondition(v)}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Visual + mechanical condition — replacing damaged body panels or fixing engine issues can raise value.
            </p>
          </div>

          <div>
            <Label>Tire Condition</Label>
            <Slider
              min={25}
              max={90}
              step={5}
              value={[tireCondition]}
              onValueChange={([v]) => setTireCondition(v)}
            />
            <p className="text-xs text-muted-foreground mt-1">Tire replacement can add up to $400 in value.</p>
          </div>

          <div>
            <Label>Vehicle Usage Type</Label>
            <RadioGroup value={usageType} onValueChange={setUsageType} className="mt-2 space-y-2">
              <RadioGroupItem value="personal" id="personal" /> <Label htmlFor="personal">Personal</Label>
              <RadioGroupItem value="fleet" id="fleet" /> <Label htmlFor="fleet">Fleet / Company</Label>
              <RadioGroupItem value="rideshare" id="rideshare" /> <Label htmlFor="rideshare">Rideshare / Delivery</Label>
            </RadioGroup>
          </div>

          <div>
            <Label>Ownership History</Label>
            <RadioGroup value={ownership} onValueChange={setOwnership} className="mt-2 space-y-2">
              <RadioGroupItem value="first-owner" id="first-owner" /> <Label htmlFor="first-owner">First Owner</Label>
              <RadioGroupItem value="multiple-owners" id="multiple-owners" /> <Label htmlFor="multiple-owners">Multiple Owners</Label>
            </RadioGroup>
          </div>

          <div>
            <Label>Loan / Lease Status</Label>
            <RadioGroup value={loanStatus} onValueChange={setLoanStatus} className="mt-2 space-y-2">
              <RadioGroupItem value="paid" id="paid" /> <Label htmlFor="paid">Paid Off</Label>
              <RadioGroupItem value="financed" id="financed" /> <Label htmlFor="financed">Financed / Leased</Label>
            </RadioGroup>
          </div>

          <div>
            <Label>Has the vehicle been in any accidents?</Label>
            <RadioGroup value={hadAccident} onValueChange={setHadAccident} className="mt-2 space-y-2">
              <RadioGroupItem value="no" id="acc-no" /> <Label htmlFor="acc-no">No</Label>
              <RadioGroupItem value="yes" id="acc-yes" /> <Label htmlFor="acc-yes">Yes</Label>
            </RadioGroup>
          </div>

          {hadAccident === 'yes' && (
            <div className="pl-4 mt-2 border-l-2 border-yellow-400 bg-yellow-50 p-4 rounded-md space-y-4">
              <div>
                <Label htmlFor="accidentCount">How many accidents?</Label>
                <Input
                  id="accidentCount"
                  type="number"
                  placeholder="e.g., 2"
                  value={accidentCount}
                  onChange={(e) => setAccidentCount(e.target.value)}
                />
              </div>
              <div>
                <Label>Most Severe Accident</Label>
                <RadioGroup value={accidentSeverity} onValueChange={setAccidentSeverity} className="mt-2 space-y-2">
                  <RadioGroupItem value="minor" id="minor" /> <Label htmlFor="minor">Minor</Label>
                  <RadioGroupItem value="moderate" id="moderate" /> <Label htmlFor="moderate">Moderate</Label>
                  <RadioGroupItem value="major" id="major" /> <Label htmlFor="major">Major</Label>
                </RadioGroup>
              </div>
              <div>
                <Label htmlFor="accidentArea">Where was it hit?</Label>
                <Textarea
                  id="accidentArea"
                  placeholder="e.g., Rear bumper, driver-side door"
                  value={accidentArea}
                  onChange={(e) => setAccidentArea(e.target.value)}
                />
              </div>
            </div>
          )}

          <div>
            <Label>Select Optional Features</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {featureList.map(({ label, valueImpact }) => (
                <div key={label} className="flex items-center space-x-2">
                  <Checkbox
                    id={label}
                    checked={features.includes(label)}
                    onCheckedChange={() => handleFeatureChange(label)}
                  />
                  <Label htmlFor={label}>{label} <span className="text-xs text-muted-foreground">(+${valueImpact})</span></Label>
                </div>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full mt-4">
            Submit Refinements
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default FollowUpForm;
