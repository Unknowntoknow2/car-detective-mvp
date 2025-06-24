
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FollowUpAnswers } from '@/types/follow-up-answers';
import { MapPin, Gauge, Star, Users, DollarSign } from 'lucide-react';

interface BasicInfoTabProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
}

const conditionOptions = [
  { value: 'excellent', label: 'Excellent', description: 'Like new, no visible wear' },
  { value: 'very-good', label: 'Very Good', description: 'Minor wear, well maintained' },
  { value: 'good', label: 'Good', description: 'Normal wear, good condition' },
  { value: 'fair', label: 'Fair', description: 'Noticeable wear, some issues' },
  { value: 'poor', label: 'Poor', description: 'Significant wear, multiple issues' }
];

const previousUseOptions = [
  { value: 'personal', label: 'Personal/Family Use', description: 'Daily commuting, family trips' },
  { value: 'business', label: 'Business Use', description: 'Company vehicle, business travel' },
  { value: 'commercial', label: 'Commercial Use', description: 'Delivery, rideshare, taxi' },
  { value: 'fleet', label: 'Fleet Vehicle', description: 'Rental car, government fleet' },
  { value: 'lease', label: 'Lease Return', description: 'Previously leased vehicle' }
];

export function BasicInfoTab({ formData, updateFormData }: BasicInfoTabProps) {
  const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 5);
    updateFormData({ zip_code: value });
  };

  const handleMileageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    updateFormData({ mileage: Math.max(0, value) });
  };

  const handlePreviousOwnersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 1;
    updateFormData({ previous_owners: Math.max(1, Math.min(10, value)) });
  };

  const handleLoanBalanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    updateFormData({ loan_balance: Math.max(0, value) });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Location and Mileage */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-500" />
              Vehicle Location
            </CardTitle>
            <p className="text-sm text-gray-600">
              Location affects market value and demand
            </p>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="zip_code">ZIP Code *</Label>
              <Input
                id="zip_code"
                type="text"
                placeholder="Enter 5-digit ZIP code"
                value={formData.zip_code || ''}
                onChange={handleZipCodeChange}
                maxLength={5}
                className="mt-1"
                required
              />
              {formData.zip_code && formData.zip_code.length === 5 && (
                <p className="text-sm text-green-600 mt-1">
                  ✓ Valid ZIP code
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gauge className="w-5 h-5 text-orange-500" />
              Current Mileage
            </CardTitle>
            <p className="text-sm text-gray-600">
              Actual odometer reading
            </p>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="mileage">Mileage *</Label>
              <Input
                id="mileage"
                type="number"
                placeholder="Enter current mileage"
                value={formData.mileage || ''}
                onChange={handleMileageChange}
                min="0"
                max="999999"
                className="mt-1"
                required
              />
              {formData.mileage && (
                <p className="text-sm text-gray-600 mt-1">
                  {formData.mileage.toLocaleString()} miles
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Overall Condition */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            Overall Vehicle Condition
          </CardTitle>
          <p className="text-sm text-gray-600">
            General assessment of the vehicle's condition
          </p>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="condition">Condition Rating *</Label>
            <Select
              value={formData.condition || ''}
              onValueChange={(value) => updateFormData({ condition: value })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select overall condition" />
              </SelectTrigger>
              <SelectContent>
                {conditionOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div>
                      <div className="font-medium">{option.label}</div>
                      <div className="text-sm text-gray-500">{option.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Ownership and Usage History */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-500" />
              Ownership History
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="previous_owners">Number of Previous Owners</Label>
              <Input
                id="previous_owners"
                type="number"
                placeholder="Including current owner"
                value={formData.previous_owners || ''}
                onChange={handlePreviousOwnersChange}
                min="1"
                max="10"
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Fewer owners typically means better value
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Previous Use Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="previous_use">Primary Use</Label>
              <Select
                value={formData.previous_use || ''}
                onValueChange={(value) => updateFormData({ previous_use: value })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select previous use" />
                </SelectTrigger>
                <SelectContent>
                  {previousUseOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div>
                        <div className="font-medium">{option.label}</div>
                        <div className="text-sm text-gray-500">{option.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Financial Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-500" />
            Financial Information
          </CardTitle>
          <p className="text-sm text-gray-600">
            Outstanding loan information (optional)
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="loan_balance">Current Loan Balance</Label>
              <Input
                id="loan_balance"
                type="number"
                placeholder="0.00"
                value={formData.loan_balance || ''}
                onChange={handleLoanBalanceChange}
                min="0"
                step="0.01"
                className="mt-1"
              />
              {formData.loan_balance && formData.loan_balance > 0 && (
                <p className="text-sm text-gray-600 mt-1">
                  {formatCurrency(formData.loan_balance)} remaining
                </p>
              )}
            </div>
            
            <div>
              <Label htmlFor="payoffAmount">Payoff Amount</Label>
              <Input
                id="payoffAmount"
                type="number"
                placeholder="0.00"
                value={formData.payoffAmount || ''}
                onChange={(e) => {
                  const value = parseFloat(e.target.value) || 0;
                  updateFormData({ payoffAmount: Math.max(0, value) });
                }}
                min="0"
                step="0.01"
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Total amount needed to pay off loan
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
