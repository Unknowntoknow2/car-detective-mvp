
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, MapPin, Loader2 } from 'lucide-react';
import { FollowUpAnswers } from '@/types/follow-up-answers';
import { useZipValidation } from '@/hooks/useZipValidation';

interface BasicInfoTabProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
}

export function BasicInfoTab({ formData, updateFormData }: BasicInfoTabProps) {
  const [zipError, setZipError] = useState('');
  const [mileageError, setMileageError] = useState('');
  const { useZipQuery } = useZipValidation();
  
  const zipQuery = useZipQuery(formData.zip_code || '');

  // Handle ZIP code validation
  useEffect(() => {
    if (formData.zip_code && formData.zip_code.length === 5) {
      if (zipQuery.data?.isValid === false) {
        setZipError(zipQuery.data.error || 'Invalid ZIP code');
      } else if (zipQuery.data?.isValid === true) {
        setZipError('');
      }
    } else if (formData.zip_code && formData.zip_code.length > 0) {
      setZipError('ZIP code must be 5 digits');
    } else {
      setZipError('');
    }
  }, [zipQuery.data, formData.zip_code]);

  const handleMileageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, '');
    const numValue = parseInt(value) || 0;
    
    if (numValue < 0) {
      setMileageError('Mileage cannot be negative');
      return;
    }
    
    if (numValue > 999999) {
      setMileageError('Mileage seems too high (max: 999,999)');
      return;
    }
    
    setMileageError('');
    updateFormData({ mileage: numValue });
  };

  const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, '').slice(0, 5);
    updateFormData({ zip_code: value });
  };

  const handleLoanBalanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d.]/g, '');
    const numValue = parseFloat(value) || 0;
    updateFormData({ loan_balance: numValue });
  };

  const handlePayoffAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d.]/g, '');
    const numValue = parseFloat(value) || 0;
    updateFormData({ payoffAmount: numValue });
  };

  const conditionOptions = [
    {
      value: 'excellent',
      label: 'Excellent',
      description: 'Like new, no visible wear',
      details: 'Perfect condition, showroom quality',
      impact: 'Best Value',
      color: 'bg-green-50 border-green-200 text-green-800'
    },
    {
      value: 'good',
      label: 'Good',
      description: 'Normal wear, good condition',
      details: 'Well-maintained with minor wear',
      impact: 'Standard Value',
      color: 'bg-blue-50 border-blue-200 text-blue-800'
    },
    {
      value: 'fair',
      label: 'Fair',
      description: 'Noticeable wear, some issues',
      details: 'Functional but shows age and use',
      impact: 'Reduced Value',
      color: 'bg-yellow-50 border-yellow-200 text-yellow-800'
    },
    {
      value: 'poor',
      label: 'Poor',
      description: 'Significant issues present',
      details: 'Major repairs needed',
      impact: 'Lower Value',
      color: 'bg-red-50 border-red-200 text-red-800'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Vehicle Location */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Vehicle Location
          </CardTitle>
          <p className="text-sm text-gray-600">Location affects market value and demand</p>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="zip_code" className="text-sm font-medium">
              ZIP Code <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="zip_code"
                type="text"
                value={formData.zip_code || ''}
                onChange={handleZipCodeChange}
                placeholder="Enter ZIP code"
                className={`mt-1 ${
                  zipError ? 'border-red-500 focus:border-red-500' : 
                  zipQuery.data?.isValid ? 'border-green-500 focus:border-green-500' : 
                  'border-gray-300'
                }`}
                required
                maxLength={5}
              />
              {zipQuery.isLoading && formData.zip_code?.length === 5 && (
                <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 animate-spin text-blue-600" />
              )}
              {zipQuery.data?.isValid && !zipQuery.isLoading && (
                <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-500" />
              )}
              {zipError && !zipQuery.isLoading && (
                <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-red-500" />
              )}
            </div>
            {zipError && (
              <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {zipError}
              </p>
            )}
            {zipQuery.data?.isValid && zipQuery.data.location && (
              <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                {zipQuery.data.location['place name']}, {zipQuery.data.location['state abbreviation']}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Current Mileage */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Current Mileage</CardTitle>
          <p className="text-sm text-gray-600">Actual odometer reading</p>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="mileage" className="text-sm font-medium">
              Mileage <span className="text-red-500">*</span>
            </Label>
            <Input
              id="mileage"
              type="text"
              value={formData.mileage ? formData.mileage.toString() : ''}
              onChange={handleMileageChange}
              placeholder="Enter current mileage"
              className={`mt-1 ${mileageError ? 'border-red-500 focus:border-red-500' : 'border-gray-300'}`}
              required
            />
            {mileageError && (
              <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {mileageError}
              </p>
            )}
            {formData.mileage && !mileageError && (
              <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                {formData.mileage.toLocaleString()} miles
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Overall Vehicle Condition */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Overall Vehicle Condition</CardTitle>
          <p className="text-sm text-gray-600">General assessment of the vehicle's condition</p>
        </CardHeader>
        <CardContent>
          <div>
            <Label className="text-sm font-medium">
              Condition Rating <span className="text-red-500">*</span>
            </Label>
            <div className="grid grid-cols-2 gap-3 mt-2">
              {conditionOptions.map((option) => {
                const isSelected = formData.condition === option.value;
                
                return (
                  <div
                    key={option.value}
                    onClick={() => updateFormData({ condition: option.value })}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                      isSelected
                        ? `${option.color} ring-2 ring-opacity-50 ring-current`
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          isSelected 
                            ? 'bg-current border-current' 
                            : 'border-gray-400'
                        }`}>
                          {isSelected && <CheckCircle className="w-3 h-3 text-white" />}
                        </div>
                        <span className="font-medium text-sm">{option.label}</span>
                      </div>
                      <Badge variant={
                        option.value === 'excellent' ? 'default' :
                        option.value === 'good' ? 'secondary' :
                        option.value === 'fair' ? 'outline' : 'destructive'
                      } className="text-xs">
                        {option.impact}
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-600 mb-2 font-medium">{option.description}</div>
                    <div className="text-xs text-gray-500 leading-relaxed">{option.details}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ownership History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Ownership History</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="previous_owners" className="text-sm font-medium">
              Number of Previous Owners
            </Label>
            <Input
              id="previous_owners"
              type="number"
              min="1"
              max="10"
              value={formData.previous_owners || ''}
              onChange={(e) => updateFormData({ previous_owners: parseInt(e.target.value) || 1 })}
              placeholder="1"
              className="mt-1"
            />
            <p className="text-sm text-gray-500 mt-1">
              Fewer owners typically means better value
            </p>
          </div>

          <div>
            <Label className="text-sm font-medium">Previous Use Type</Label>
            <p className="text-xs text-gray-500 mb-2">Primary vehicle usage</p>
            <Select 
              value={formData.previous_use || 'personal'} 
              onValueChange={(value) => updateFormData({ previous_use: value })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select previous use" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="personal">Personal/Family Use</SelectItem>
                <SelectItem value="fleet">Fleet Vehicle</SelectItem>
                <SelectItem value="rental">Rental Car</SelectItem>
                <SelectItem value="taxi">Taxi/Rideshare</SelectItem>
                <SelectItem value="government">Government</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-500 mt-1">
              Personal use typically maintains higher value
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Financial Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Financial Information</CardTitle>
          <p className="text-sm text-gray-600">Outstanding loan information (optional)</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="loan_balance" className="text-sm font-medium">
              Current Loan Balance
            </Label>
            <Input
              id="loan_balance"
              type="text"
              value={formData.loan_balance ? formData.loan_balance.toString() : ''}
              onChange={handleLoanBalanceChange}
              placeholder="0.00"
              className="mt-1"
            />
            {formData.loan_balance && formData.loan_balance > 0 && (
              <p className="text-sm text-gray-500 mt-1">
                ${formData.loan_balance.toLocaleString()}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="payoff_amount" className="text-sm font-medium">
              Payoff Amount
            </Label>
            <Input
              id="payoff_amount"
              type="text"
              value={formData.payoffAmount ? formData.payoffAmount.toString() : ''}
              onChange={handlePayoffAmountChange}
              placeholder="0.00"
              className="mt-1"
            />
            <p className="text-sm text-gray-500 mt-1">
              Total amount needed to pay off loan
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
