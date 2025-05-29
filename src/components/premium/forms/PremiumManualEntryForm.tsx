
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Car } from 'lucide-react';

interface FormData {
  makeId: string;
  modelId: string;
  year: string;
  mileage: string;
  condition: string;
  zipCode: string;
  fuelType: string;
  transmission: string;
}

export default function PremiumManualEntryForm() {
  const [formData, setFormData] = useState<FormData>({
    makeId: '',
    modelId: '',
    year: '',
    mileage: '',
    condition: '',
    zipCode: '',
    fuelType: '',
    transmission: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.makeId || !formData.modelId || !formData.year || !formData.mileage) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Mock premium manual entry processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Premium Manual Entry Successful",
        description: `Processing premium valuation for ${formData.year} vehicle`,
      });
      
      // Navigate to premium valuation results or next step
      console.log('Premium manual entry:', formData);
    } catch (error) {
      console.error('Premium manual entry error:', error);
      toast({
        title: "Entry Error",
        description: "An error occurred while processing your manual entry",
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
          Enter your vehicle details manually for comprehensive premium analysis with AI insights and market data.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="makeId">Make</Label>
              <Input
                id="makeId"
                type="text"
                placeholder="Enter vehicle make"
                value={formData.makeId}
                onChange={(e) => handleInputChange('makeId', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="modelId">Model</Label>
              <Input
                id="modelId"
                type="text"
                placeholder="Enter vehicle model"
                value={formData.modelId}
                onChange={(e) => handleInputChange('modelId', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                type="number"
                placeholder="2020"
                value={formData.year}
                onChange={(e) => handleInputChange('year', e.target.value)}
                min="1900"
                max="2025"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mileage">Mileage</Label>
              <Input
                id="mileage"
                type="number"
                placeholder="50000"
                value={formData.mileage}
                onChange={(e) => handleInputChange('mileage', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="condition">Condition</Label>
              <Select value={formData.condition} onValueChange={(value) => handleInputChange('condition', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excellent">Excellent</SelectItem>
                  <SelectItem value="very_good">Very Good</SelectItem>
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
                placeholder="12345"
                value={formData.zipCode}
                onChange={(e) => handleInputChange('zipCode', e.target.value)}
                maxLength={5}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fuelType">Fuel Type</Label>
              <Select value={formData.fuelType} onValueChange={(value) => handleInputChange('fuelType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select fuel type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gasoline">Gasoline</SelectItem>
                  <SelectItem value="diesel">Diesel</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                  <SelectItem value="electric">Electric</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="transmission">Transmission</Label>
              <Select value={formData.transmission} onValueChange={(value) => handleInputChange('transmission', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select transmission" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="automatic">Automatic</SelectItem>
                  <SelectItem value="manual">Manual</SelectItem>
                  <SelectItem value="cvt">CVT</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-semibold text-purple-900 mb-2">Premium Manual Entry Includes:</h4>
            <ul className="text-sm text-purple-800 space-y-1">
              <li>• AI-powered vehicle verification</li>
              <li>• Advanced condition assessment</li>
              <li>• Real-time market data integration</li>
              <li>• Comprehensive feature analysis</li>
              <li>• Professional-grade valuation report</li>
            </ul>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading || !formData.makeId || !formData.modelId || !formData.year || !formData.mileage}
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
