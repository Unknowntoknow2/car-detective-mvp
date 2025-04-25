
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText } from 'lucide-react';

export function ManualLookup({ 
  make, setMake, model, setModel, year, setYear,
  mileage, setMileage, fuel, setFuel, zip, setZip,
  condition, setCondition, accident, setAccident 
}: any) {
  
  // Handle accident change with proper type checking
  const handleAccidentChange = (value: string) => {
    if (value === 'no' || value === 'yes') {
      setAccident(value);
    }
  };

  return (
    <Card className="p-6 border border-border/50">
      <div className="flex items-center gap-2 mb-4">
        <Badge variant="outline" className="bg-primary/5 text-primary border-primary/30">
          <FileText className="h-3.5 w-3.5 mr-1" />
          Manual Entry
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <Label>Make</Label>
            <Select onValueChange={setMake} value={make}>
              <SelectTrigger className="border-border/60">
                <SelectValue placeholder="Select Make" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Toyota">Toyota</SelectItem>
                <SelectItem value="Honda">Honda</SelectItem>
                <SelectItem value="Ford">Ford</SelectItem>
                <SelectItem value="Chevrolet">Chevrolet</SelectItem>
                <SelectItem value="Nissan">Nissan</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Model</Label>
            <Select onValueChange={setModel} value={model} disabled={!make}>
              <SelectTrigger className="border-border/60">
                <SelectValue placeholder={make ? 'Select Model' : 'Select make first'} />
              </SelectTrigger>
              <SelectContent>
                {make === 'Toyota' && (
                  <>
                    <SelectItem value="Camry">Camry</SelectItem>
                    <SelectItem value="Corolla">Corolla</SelectItem>
                    <SelectItem value="RAV4">RAV4</SelectItem>
                  </>
                )}
                {make === 'Honda' && (
                  <>
                    <SelectItem value="Accord">Accord</SelectItem>
                    <SelectItem value="Civic">Civic</SelectItem>
                    <SelectItem value="CR-V">CR-V</SelectItem>
                  </>
                )}
                {make === 'Ford' && (
                  <>
                    <SelectItem value="F-150">F-150</SelectItem>
                    <SelectItem value="Escape">Escape</SelectItem>
                    <SelectItem value="Mustang">Mustang</SelectItem>
                  </>
                )}
                {make === 'Chevrolet' && (
                  <>
                    <SelectItem value="Silverado">Silverado</SelectItem>
                    <SelectItem value="Equinox">Equinox</SelectItem>
                    <SelectItem value="Malibu">Malibu</SelectItem>
                  </>
                )}
                {make === 'Nissan' && (
                  <>
                    <SelectItem value="Altima">Altima</SelectItem>
                    <SelectItem value="Rogue">Rogue</SelectItem>
                    <SelectItem value="Sentra">Sentra</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Year</Label>
            <Select onValueChange={setYear} value={year}>
              <SelectTrigger className="border-border/60">
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
              className="border-border/60"
            />
          </div>
        </div>
        <div className="space-y-6">
          <div>
            <Label>Fuel Type</Label>
            <Select onValueChange={setFuel} value={fuel}>
              <SelectTrigger className="border-border/60">
                <SelectValue placeholder="Select Fuel Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gas">Gasoline</SelectItem>
                <SelectItem value="diesel">Diesel</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
                <SelectItem value="electric">Electric</SelectItem>
                <SelectItem value="plugin_hybrid">Plug-in Hybrid</SelectItem>
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
              className="border-border/60"
            />
            <p className="text-xs text-muted-foreground mt-1">For regional market comparison</p>
          </div>
          <div>
            <Label>Condition</Label>
            <Slider
              value={[condition]} 
              max={100}
              step={1}
              onValueChange={(values) => setCondition(values[0])}
              className="my-4"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Poor</span><span>Fair</span><span>Good</span><span>Excellent</span>
            </div>
            <div className="mt-2 p-3 bg-muted/30 rounded-md text-sm">
              <p className="font-medium">Current: {condition < 25 ? 'poor' : condition < 50 ? 'fair' : condition < 75 ? 'good' : 'excellent'}</p>
              <p className="text-xs mt-1">
                {condition < 25 ? 'Vehicle has significant issues that affect functionality and appearance.' : 
                 condition < 50 ? 'Vehicle has some wear and tear but runs reliably with minor issues.' :
                 condition < 75 ? 'Vehicle is well-maintained with only minor cosmetic defects and regular service history.' :
                 'Vehicle is in exceptional condition with minimal wear and complete service records.'}
              </p>
            </div>
          </div>
          <div>
            <Label>Accident History</Label>
            <RadioGroup onValueChange={handleAccidentChange} value={accident} className="flex space-x-4 mt-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="acc-no" />
                <Label htmlFor="acc-no" className="font-normal">No</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="acc-yes" />
                <Label htmlFor="acc-yes" className="font-normal">Yes</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </div>
    </Card>
  );
}
