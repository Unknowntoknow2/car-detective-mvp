import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card } from '@/components/ui/card';

export function ManualLookup({ 
  make, setMake, model, setModel, year, setYear,
  mileage, setMileage, fuel, setFuel, zip, setZip,
  condition, setCondition, accident, setAccident 
}: any) {
  return (
    <Card className="p-6 border border-border/50">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <Label>Make</Label>
            <Select onValueChange={setMake} className="z-50">
              <SelectTrigger>
                <SelectValue placeholder="Select Make" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Toyota">Toyota</SelectItem>
                <SelectItem value="Honda">Honda</SelectItem>
                {/* … */}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Model</Label>
            <Select onValueChange={setModel} disabled={!make} className="z-50">
              <SelectTrigger>
                <SelectValue placeholder={make? 'Select Model':'Select make first'} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Camry">Camry</SelectItem>
                <SelectItem value="Accord">Accord</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Year</Label>
            <Select onValueChange={setYear}>
              <SelectTrigger>
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({length:30},(_,i)=>2025 - i).map(y=>(
                  <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Mileage</Label>
            <Input
              type="number"
              min={0} max={1000000}
              value={mileage}
              onChange={e=>setMileage(+e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-6">
          <div>
            <Label>Fuel Type</Label>
            <Select onValueChange={setFuel}>
              <SelectTrigger>
                <SelectValue placeholder="Select Fuel Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gas">Gasoline</SelectItem>
                <SelectItem value="diesel">Diesel</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>ZIP Code</Label>
            <Input
              maxLength={5}
              placeholder="e.g. 90210"
              value={zip}
              onChange={e=>setZip(e.target.value.replace(/\D/g,'').slice(0,5))}
            />
          </div>
          <div>
            <Label>Condition</Label>
            <Slider
              defaultValue={[condition]}
              max={100}
              step={1}
              onValueChange={[v=>setCondition(v)]}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Poor</span><span>Fair</span><span>Good</span><span>Excellent</span>
            </div>
          </div>
          <div>
            <Label>Accident History</Label>
            <RadioGroup onValueChange={setAccident} value={accident} className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="acc-no" />
                <Label htmlFor="acc-no">No</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="acc-yes" />
                <Label htmlFor="acc-yes">Yes</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </div>
    </Card>
  );
}
