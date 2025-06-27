
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FollowUpAnswers } from '@/types/follow-up-answers';

interface BasicInfoTabProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
}

export function BasicInfoTab({ formData, updateFormData }: BasicInfoTabProps) {
  const handleMileageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Only allow digits
    updateFormData({ mileage: value ? parseInt(value) : 0 });
  };

  const handleZipCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 5); // Only digits, max 5
    updateFormData({ zip_code: value });
  };

  const handleLoanBalanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d.]/g, ''); // Only digits and decimal
    updateFormData({ loan_balance: value ? parseFloat(value) : 0 });
  };

  const handlePayoffAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d.]/g, ''); // Only digits and decimal
    updateFormData({ payoffAmount: value ? parseFloat(value) : 0 });
  };

  const conditionOptions = [
    {
      value: 'excellent',
      label: 'Excellent',
      description: 'Like new, no visible wear',
      impact: 'Best Value'
    },
    {
      value: 'good',
      label: 'Good',
      description: 'Normal wear, good condition',
      impact: 'Standard Value'
    },
    {
      value: 'fair',
      label: 'Fair',
      description: 'Noticeable wear, some issues',
      impact: 'Reduced Value'
    },
    {
      value: 'poor',
      label: 'Poor',
      description: 'Significant issues present',
      impact: 'Lower Value'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Vehicle Location */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Vehicle Location</CardTitle>
          <p className="text-sm text-gray-600">Location affects market value and demand</p>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="zip_code" className="text-sm font-medium">
              ZIP Code <span className="text-red-500">*</span>
            </Label>
            <Input
              id="zip_code"
              type="text"
              value={formData.zip_code || ''}
              onChange={handleZipCodeChange}
              placeholder="Enter ZIP code"
              className="mt-1"
              required
              maxLength={5}
            />
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
              className="mt-1"
              required
            />
            {formData.mileage && (
              <p className="text-sm text-gray-500 mt-1">
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
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-200'
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full border-2 ${
                          isSelected 
                            ? 'bg-blue-500 border-blue-500' 
                            : 'border-gray-300'
                        }`} />
                        <span className="font-medium text-sm">{option.label}</span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded ${
                        option.value === 'excellent' ? 'bg-green-100 text-green-700' :
                        option.value === 'good' ? 'bg-blue-100 text-blue-700' :
                        option.value === 'fair' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {option.impact}
                      </span>
                    </div>
                    <div className="text-xs text-gray-600">{option.description}</div>
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
            <p className="text-xs text-gray-500 mb-2">Primary Use</p>
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
              Daily commuting, family trips
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
