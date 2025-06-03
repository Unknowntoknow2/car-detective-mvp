
import React from 'react';
import { z } from 'zod';
import { FollowUpAnswers } from '@/types/follow-up-answers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

interface LoanDetailsFormProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
}

// Create a base schema without refinement for validation
const baseLoanDetailsSchema = z.object({
  has_active_loan: z.boolean().optional(),
  loan_balance: z.number().min(0, 'Loan balance must be positive').optional(),
  payoffAmount: z.number().min(0, 'Payoff amount must be positive').optional(),
});

// Use the base schema for field validation
export const loanDetailsSchema = baseLoanDetailsSchema.refine((data) => {
  // If has_active_loan is true, either loan_balance or payoffAmount should be provided
  if (data.has_active_loan && !data.loan_balance && !data.payoffAmount) {
    return false;
  }
  return true;
}, {
  message: 'If you have an active loan, please provide loan balance or payoff amount',
  path: ['loan_balance'],
});

export const LoanDetailsForm: React.FC<LoanDetailsFormProps> = ({ formData, updateFormData }) => {
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const validateField = (field: string, value: any) => {
    try {
      // Use the base schema for individual field validation
      const fieldSchema = z.object({ [field]: baseLoanDetailsSchema.shape[field as keyof typeof baseLoanDetailsSchema.shape] });
      fieldSchema.parse({ [field]: value });
      setErrors(prev => ({ ...prev, [field]: '' }));
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(prev => ({ 
          ...prev, 
          [field]: error.errors[0]?.message || 'Invalid value' 
        }));
      }
      return false;
    }
  };

  const handleInputChange = (field: keyof FollowUpAnswers, value: any) => {
    updateFormData({ [field]: value });
    validateField(field, value);
  };

  const validateAllFields = () => {
    try {
      loanDetailsSchema.parse({
        has_active_loan: formData.has_active_loan,
        loan_balance: formData.loan_balance,
        payoffAmount: formData.payoffAmount,
      });
      setErrors({});
      toast.success('Loan details validated successfully');
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
        toast.error('Please fix the validation errors');
      }
      return false;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Loan Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Active Loan Checkbox */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="has_active_loan"
              checked={formData.has_active_loan || false}
              onCheckedChange={(checked) => handleInputChange('has_active_loan', checked)}
            />
            <Label htmlFor="has_active_loan">I have an active loan on this vehicle</Label>
          </div>

          {/* Loan Balance */}
          {formData.has_active_loan && (
            <>
              <div className="space-y-2">
                <Label htmlFor="loan_balance">Current Loan Balance</Label>
                <Input
                  id="loan_balance"
                  type="number"
                  placeholder="Enter loan balance"
                  value={formData.loan_balance || ''}
                  onChange={(e) => handleInputChange('loan_balance', parseFloat(e.target.value) || undefined)}
                  className={errors.loan_balance ? 'border-red-500' : ''}
                />
                {errors.loan_balance && (
                  <p className="text-sm text-red-500">{errors.loan_balance}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="payoffAmount">Payoff Amount (if different from balance)</Label>
                <Input
                  id="payoffAmount"
                  type="number"
                  placeholder="Enter payoff amount"
                  value={formData.payoffAmount || ''}
                  onChange={(e) => handleInputChange('payoffAmount', parseFloat(e.target.value) || undefined)}
                  className={errors.payoffAmount ? 'border-red-500' : ''}
                />
                {errors.payoffAmount && (
                  <p className="text-sm text-red-500">{errors.payoffAmount}</p>
                )}
                <p className="text-sm text-gray-500">
                  The payoff amount may include additional fees and interest
                </p>
              </div>
            </>
          )}

          {!formData.has_active_loan && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800">Great! No active loan means you own the vehicle outright.</p>
            </div>
          )}

          <Button onClick={validateAllFields} variant="outline" className="w-full mt-4">
            Validate This Section
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
