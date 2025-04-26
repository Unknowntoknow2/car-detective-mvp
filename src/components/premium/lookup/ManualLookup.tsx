
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { ConditionLevel } from '@/components/lookup/types/manualEntry';
import { Badge } from '@/components/ui/badge';
import { FileText, Loader2 } from 'lucide-react';

// Mock data for the form
const CONDITION_OPTIONS = [
  { value: 'poor', label: 'Poor', conditionValue: 25, description: 'Significant repairs needed, not fully operational' },
  { value: 'fair', label: 'Fair', conditionValue: 50, description: 'Functional but has noticeable wear and issues' },
  { value: 'good', label: 'Good', conditionValue: 75, description: 'Minor wear, fully functional with minimal issues' },
  { value: 'excellent', label: 'Excellent', conditionValue: 100, description: 'Like new condition with minimal wear' }
];

const YEARS = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i);

const FUEL_TYPES = [
  { value: 'gasoline', label: 'Gasoline' },
  { value: 'diesel', label: 'Diesel' },
  { value: 'electric', label: 'Electric' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'plugin_hybrid', label: 'Plug-in Hybrid' },
  { value: 'cng', label: 'Compressed Natural Gas (CNG)' }
];

const COMMON_FEATURES = [
  { id: 'leather', label: 'Leather Seats' },
  { id: 'sunroof', label: 'Sunroof/Moonroof' },
  { id: 'navigation', label: 'Navigation System' },
  { id: 'camera', label: 'Backup Camera' },
  { id: 'bluetooth', label: 'Bluetooth' },
  { id: 'heated_seats', label: 'Heated Seats' },
  { id: 'third_row', label: 'Third Row Seating' },
  { id: 'premium_audio', label: 'Premium Audio System' }
];

interface ManualLookupProps {
  isLoading?: boolean;
  onSubmit?: (data: any) => void;
}

export function ManualLookup({ isLoading = false, onSubmit }: ManualLookupProps) {
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState<number | ''>('');
  const [mileage, setMileage] = useState('');
  const [condition, setCondition] = useState<ConditionLevel>('good');
  const [conditionValue, setConditionValue] = useState<number>(75);
  const [fuelType, setFuelType] = useState('');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [zipCode, setZipCode] = useState('');

  // Update condition when slider value changes
  useEffect(() => {
    if (conditionValue <= 25) setCondition('poor');
    else if (conditionValue <= 50) setCondition('fair');
    else if (conditionValue <= 75) setCondition('good');
    else setCondition('excellent');
  }, [conditionValue]);

  // Update slider value when condition dropdown changes
  useEffect(() => {
    const option = CONDITION_OPTIONS.find(opt => opt.value === condition);
    if (option) setConditionValue(option.conditionValue);
  }, [condition]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (onSubmit) {
      const data = {
        make,
        model,
        year,
        mileage: parseInt(mileage),
        condition,
        fuelType,
        selectedFeatures,
        zipCode
      };
      onSubmit(data);
    }
  };

  const toggleFeature = (featureId: string) => {
    setSelectedFeatures(prev => 
      prev.includes(featureId)
        ? prev.filter(id => id !== featureId)
        : [...prev, featureId]
    );
  };

  const selectedCondition = CONDITION_OPTIONS.find(option => option.value === condition);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <Badge variant="outline" className="bg-slate-100 text-slate-700 border-slate-200">
          <FileText className="h-4 w-4 mr-1" />
          Manual Entry
        </Badge>
        <p className="text-sm text-slate-500">Full Control & Customization</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="make">Make</Label>
              <Input
                id="make"
                value={make}
                onChange={(e) => setMake(e.target.value)}
                placeholder="e.g., Toyota"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Input
                id="model"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="e.g., Camry"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Select value={year.toString()} onValueChange={(value) => setYear(parseInt(value))}>
                <SelectTrigger id="year">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {YEARS.map(year => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="mileage">Mileage</Label>
              <Input
                id="mileage"
                type="number"
                value={mileage}
                onChange={(e) => setMileage(e.target.value)}
                placeholder="e.g., 45000"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="fuelType">Fuel Type</Label>
              <Select value={fuelType} onValueChange={setFuelType}>
                <SelectTrigger id="fuelType">
                  <SelectValue placeholder="Select fuel type" />
                </SelectTrigger>
                <SelectContent>
                  {FUEL_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="zipCode">ZIP Code</Label>
              <Input
                id="zipCode"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value.replace(/[^0-9]/g, '').substring(0, 5))}
                placeholder="Enter ZIP code"
                maxLength={5}
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label className="mb-2 block">Vehicle Condition</Label>
              <Select value={condition} onValueChange={(value: ConditionLevel) => setCondition(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  {CONDITION_OPTIONS.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <div className="mt-3">
                <Slider 
                  defaultValue={[75]} 
                  max={100} 
                  step={1} 
                  value={[conditionValue]}
                  onValueChange={(value) => setConditionValue(value[0])}
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>Poor</span>
                  <span>Fair</span>
                  <span>Good</span>
                  <span>Excellent</span>
                </div>
              </div>
              
              {selectedCondition && (
                <p className="text-sm text-slate-600 mt-3">
                  {selectedCondition.description}
                </p>
              )}
            </div>
          </div>
          
          <div className="space-y-4">
            <Label className="mb-2 block">Features</Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {COMMON_FEATURES.map(feature => (
                <Button
                  key={feature.id}
                  type="button"
                  variant={selectedFeatures.includes(feature.id) ? "default" : "outline"}
                  className={`text-xs h-auto py-2 justify-start`}
                  onClick={() => toggleFeature(feature.id)}
                >
                  {feature.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button 
            type="submit" 
            disabled={isLoading || !make || !model || !year || !mileage}
            className="px-6"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Get Vehicle Valuation"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
