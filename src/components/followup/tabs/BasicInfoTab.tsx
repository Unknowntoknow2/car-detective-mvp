
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin } from 'lucide-react';
import { FollowUpAnswers } from '@/types/follow-up-answers';
import { MileageInput } from '../inputs/MileageInput';
import { ZipCodeInput } from '../inputs/ZipCodeInput';

interface BasicInfoTabProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
}

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

export function BasicInfoTab({ formData, updateFormData }: BasicInfoTabProps) {
  const handleZipCodeChange = (value: string) => {
    updateFormData({ zip_code: value });
  };

  const handleMileageChange = (value: number) => {
    updateFormData({ mileage: value });
  };

  const handleConditionChange = (value: string) => {
    updateFormData({ condition: value });
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

  const handlePreviousOwnersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 1;
    updateFormData({ previous_owners: value });
  };

  const handlePreviousUseChange = (value: string) => {
    updateFormData({ previous_use: value });
  };

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
          <ZipCodeInput
            value={formData.zip_code || ''}
            onChange={handleZipCodeChange}
            required
          />
        </CardContent>
      </Card>

      {/* Current Mileage */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Current Mileage</CardTitle>
          <p className="text-sm text-gray-600">Actual odometer reading</p>
        </CardHeader>
        <CardContent>
          <MileageInput
            value={formData.mileage || 0}
            onChange={handleMileageChange}
            required
          />
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
            <Select value={formData.condition || ''} onValueChange={handleConditionChange}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select condition" />
              </SelectTrigger>
              <SelectContent>
                {conditionOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex flex-col">
                      <span className="font-medium">{option.label}</span>
                      <span className="text-sm text-gray-500">{option.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
              value={formData.previous_owners || 1}
              onChange={handlePreviousOwnersChange}
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
              onValueChange={handlePreviousUseChange}
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
