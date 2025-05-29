
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Car } from 'lucide-react';
import MakeAndModelSelector from '@/components/lookup/form-parts/MakeAndModelSelector';

interface PremiumManualEntryFormProps {
  formData?: any;
  setFormData?: (data: any) => void;
  onSubmit?: (data: any) => void;
}

export default function PremiumManualEntryForm({ 
  formData: externalFormData, 
  setFormData: externalSetFormData,
  onSubmit: externalOnSubmit 
}: PremiumManualEntryFormProps) {
  const [internalFormData, setInternalFormData] = useState({
    year: '',
    makeId: '',
    modelId: '',
    mileage: '',
    condition: '',
    zipCode: '',
    vin: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Use external state if provided, otherwise use internal state
  const formData = externalFormData || internalFormData;
  const setFormData = externalSetFormData || setInternalFormData;

  const updateFormData = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.year || !formData.makeId || !formData.modelId || !formData.mileage) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // If external onSubmit is provided, use it
      if (externalOnSubmit) {
        externalOnSubmit(formData);
        return;
      }

      // Mock manual entry processing for premium service
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Manual Entry Successful",
        description: "Processing your premium valuation...",
      });
      
      console.log('Premium manual entry:', formData);
    } catch (error) {
      console.error('Premium manual entry error:', error);
      toast({
        title: "Entry Error",
        description: "An error occurred while processing your information",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Car className="h-5 w-5" />
          Premium Manual Entry
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Enter your vehicle details manually for comprehensive premium analysis and valuation.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Select value={formData.year} onValueChange={(value) => updateFormData('year', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i).map((year) => (
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
                placeholder="e.g., 50000"
                value={formData.mileage}
                onChange={(e) => updateFormData('mileage', e.target.value)}
              />
            </div>
          </div>

          <MakeAndModelSelector
            makeId={formData.makeId}
            setMakeId={(makeId) => updateFormData('makeId', makeId)}
            modelId={formData.modelId}
            setModelId={(modelId) => updateFormData('modelId', modelId)}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="condition">Condition</Label>
              <Select value={formData.condition} onValueChange={(value) => updateFormData('condition', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select condition" />
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

            <div className="space-y-2">
              <Label htmlFor="zipCode">ZIP Code</Label>
              <Input
                id="zipCode"
                type="text"
                placeholder="e.g., 90210"
                value={formData.zipCode}
                onChange={(e) => updateFormData('zipCode', e.target.value)}
                maxLength={5}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="vin">VIN (Optional)</Label>
            <Input
              id="vin"
              type="text"
              placeholder="17-character VIN (optional)"
              value={formData.vin}
              onChange={(e) => updateFormData('vin', e.target.value.toUpperCase())}
              maxLength={17}
              className="font-mono"
            />
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-semibold text-purple-900 mb-2">Premium Manual Entry Includes:</h4>
            <ul className="text-sm text-purple-800 space-y-1">
              <li>• Advanced algorithmic valuation</li>
              <li>• Detailed market analysis</li>
              <li>• Comprehensive feature assessment</li>
              <li>• Professional valuation report</li>
              <li>• Market trend predictions</li>
            </ul>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading || !formData.year || !formData.makeId || !formData.modelId || !formData.mileage}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing Entry...
              </>
            ) : (
              'Get Premium Valuation'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
