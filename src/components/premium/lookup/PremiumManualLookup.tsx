
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useVehicleData } from '@/hooks/useVehicleData';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function PremiumManualLookup() {
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState<number | string>('');
  const [mileage, setMileage] = useState<number | string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const { getYearOptions } = useVehicleData();
  const yearOptions = getYearOptions(1990);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!make || !model || !year) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success(`Added: ${year} ${make} ${model}`);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting vehicle data:', error);
      toast.error('Failed to add vehicle');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Manual Entry</h2>
        <p className="text-muted-foreground">
          Enter your vehicle details manually to get a premium valuation.
        </p>
      </div>
      
      {!isSubmitted ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label htmlFor="make" className="block text-sm font-medium">
                Make *
              </label>
              <Select value={make} onValueChange={setMake} required>
                <SelectTrigger id="make">
                  <SelectValue placeholder="Select make" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="honda">Honda</SelectItem>
                  <SelectItem value="toyota">Toyota</SelectItem>
                  <SelectItem value="ford">Ford</SelectItem>
                  <SelectItem value="bmw">BMW</SelectItem>
                  <SelectItem value="audi">Audi</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="model" className="block text-sm font-medium">
                Model *
              </label>
              <Select value={model} onValueChange={setModel} disabled={!make} required>
                <SelectTrigger id="model">
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  {make === "honda" && (
                    <>
                      <SelectItem value="civic">Civic</SelectItem>
                      <SelectItem value="accord">Accord</SelectItem>
                      <SelectItem value="cr-v">CR-V</SelectItem>
                    </>
                  )}
                  {make === "toyota" && (
                    <>
                      <SelectItem value="camry">Camry</SelectItem>
                      <SelectItem value="corolla">Corolla</SelectItem>
                      <SelectItem value="rav4">RAV4</SelectItem>
                    </>
                  )}
                  {make === "ford" && (
                    <>
                      <SelectItem value="f-150">F-150</SelectItem>
                      <SelectItem value="escape">Escape</SelectItem>
                      <SelectItem value="mustang">Mustang</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="year" className="block text-sm font-medium">
                Year *
              </label>
              <Select 
                value={year.toString()} 
                onValueChange={(value) => setYear(parseInt(value))}
                required
              >
                <SelectTrigger id="year">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {yearOptions.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="mileage" className="block text-sm font-medium">
              Mileage *
            </label>
            <Input
              id="mileage"
              type="number"
              placeholder="Enter vehicle mileage"
              value={mileage || ''}
              onChange={(e) => setMileage(parseInt(e.target.value) || '')}
              required
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full md:w-auto"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Continue with this vehicle"
            )}
          </Button>
        </form>
      ) : (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-4">Vehicle Added</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6">
              <div>
                <p className="text-sm text-gray-500">Year</p>
                <p className="font-medium">{year}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Make</p>
                <p className="font-medium">{make}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Model</p>
                <p className="font-medium">{model}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Mileage</p>
                <p className="font-medium">{mileage}</p>
              </div>
            </div>
            
            <div className="mt-6">
              <Button variant="default" className="w-full" onClick={() => window.location.href = "/premium/form"}>
                Continue to full valuation form
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
