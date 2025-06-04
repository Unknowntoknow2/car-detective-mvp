
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Search, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { validateStatePlate } from '@/utils/validation/plate-validation-helpers';
import { usePlateLookup } from '@/hooks/usePlateLookup';
import { toast } from 'sonner';

const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

export interface UnifiedPlateLookupProps {
  tier: 'free' | 'premium';
  onVehicleFound?: (data: any) => void;
  onSuccess?: (data: any) => void;
  showPremiumFeatures?: boolean;
  includePremiumBadging?: boolean;
  className?: string;
}

export function UnifiedPlateLookup({
  tier = 'free',
  onVehicleFound,
  onSuccess,
  showPremiumFeatures = false,
  includePremiumBadging = true,
  className = ''
}: UnifiedPlateLookupProps) {
  const [formData, setFormData] = useState({
    plate: '',
    state: ''
  });
  const [errors, setErrors] = useState<{
    plate?: string;
    state?: string;
  }>({});

  const { plateInfo, isLoading, error, lookupPlate } = usePlateLookup();

  const validateForm = () => {
    const newErrors: typeof errors = {};

    const plateValidation = validateStatePlate(formData.plate, formData.state);
    if (!plateValidation.valid) {
      newErrors.plate = plateValidation.error;
    }

    if (!formData.state) {
      newErrors.state = 'State is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const result = await lookupPlate(formData.plate, formData.state);
      
      if (result) {
        toast.success('Vehicle found by license plate!');
        
        if (onVehicleFound) {
          onVehicleFound(result);
        }
        
        if (onSuccess) {
          onSuccess(result);
        }
      }
    } catch (error) {
      console.error('Plate lookup error:', error);
      toast.error('Failed to find vehicle by license plate');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ 
      ...prev, 
      [field]: field === 'plate' ? value.toUpperCase() : value 
    }));
    
    // Clear errors when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Card className={`w-full max-w-md mx-auto ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>License Plate Lookup</span>
          {includePremiumBadging && tier === 'premium' && (
            <Badge variant="default" className="bg-gradient-to-r from-blue-600 to-purple-600">
              <Star className="w-3 h-3 mr-1" />
              Premium
            </Badge>
          )}
        </CardTitle>
        {showPremiumFeatures && tier === 'premium' && (
          <p className="text-sm text-muted-foreground">
            Get enhanced vehicle data, market insights, and detailed history reports.
          </p>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="plate">License Plate Number</Label>
            <Input
              id="plate"
              value={formData.plate}
              onChange={(e) => handleInputChange('plate', e.target.value)}
              placeholder="ABC123"
              className={errors.plate ? 'border-red-500' : ''}
              disabled={isLoading}
              aria-invalid={!!errors.plate}
            />
            {errors.plate && (
              <p className="text-sm text-red-500">{errors.plate}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Select 
              value={formData.state} 
              onValueChange={(value) => handleInputChange('state', value)}
              disabled={isLoading}
            >
              <SelectTrigger 
                className={errors.state ? 'border-red-500' : ''}
                aria-invalid={!!errors.state}
              >
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                {US_STATES.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.state && (
              <p className="text-sm text-red-500">{errors.state}</p>
            )}
          </div>

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          <Button 
            type="submit" 
            disabled={isLoading || !formData.plate || !formData.state} 
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Looking up...
              </>
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                {tier === 'premium' ? 'Premium Lookup' : 'Find Vehicle'}
              </>
            )}
          </Button>

          {showPremiumFeatures && tier === 'free' && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-700">
                <strong>Upgrade to Premium</strong> for enhanced plate lookup with:
              </p>
              <ul className="text-xs text-blue-600 mt-1 space-y-1">
                <li>• Detailed vehicle history</li>
                <li>• Market value estimates</li>
                <li>• Accident reports</li>
                <li>• Service records</li>
              </ul>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}

export default UnifiedPlateLookup;
