
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FollowUpAnswers } from '@/types/follow-up-answers';
import { FileText, Users, DollarSign } from 'lucide-react';

interface TitleOwnershipTabProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
}

export function TitleOwnershipTab({ formData, updateFormData }: TitleOwnershipTabProps) {
  return (
    <div className="space-y-4">
      {/* Title Status */}
      <div className="p-3 rounded-lg border bg-blue-50 border-blue-200">
        <div className="flex items-center gap-2 mb-3">
          <FileText className="h-4 w-4 text-blue-600" />
          <h3 className="font-medium text-sm">Title Status</h3>
        </div>
        <div>
          <Label htmlFor="title-status" className="text-xs font-medium text-gray-700">Title Status</Label>
          <Select
            value={formData.title_status || 'clean'}
            onValueChange={(value) => updateFormData({ title_status: value as any })}
          >
            <SelectTrigger className="mt-1 bg-white h-8 text-xs">
              <SelectValue placeholder="Select title status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="clean">Clean Title</SelectItem>
              <SelectItem value="salvage">Salvage Title</SelectItem>
              <SelectItem value="rebuilt">Rebuilt Title</SelectItem>
              <SelectItem value="lien">Lien Title</SelectItem>
              <SelectItem value="unknown">Unknown</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Ownership History */}
      <div className="p-3 rounded-lg border bg-green-50 border-green-200">
        <div className="flex items-center gap-2 mb-3">
          <Users className="h-4 w-4 text-green-600" />
          <h3 className="font-medium text-sm">Ownership History</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="previous-owners" className="text-xs font-medium text-gray-700">Previous Owners</Label>
            <Input
              id="previous-owners"
              type="number"
              min="0"
              max="10"
              value={formData.previous_owners || ''}
              onChange={(e) => updateFormData({ previous_owners: parseInt(e.target.value) || 0 })}
              placeholder="e.g., 1"
              className="mt-1 bg-white h-8 text-xs"
            />
          </div>

          <div>
            <Label htmlFor="previous-use" className="text-xs font-medium text-gray-700">Previous Use</Label>
            <Select
              value={formData.previous_use || 'personal'}
              onValueChange={(value) => updateFormData({ previous_use: value as any })}
            >
              <SelectTrigger className="mt-1 bg-white h-8 text-xs">
                <SelectValue placeholder="Select previous use" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="personal">Personal Use</SelectItem>
                <SelectItem value="commercial">Commercial Use</SelectItem>
                <SelectItem value="rental">Rental Vehicle</SelectItem>
                <SelectItem value="emergency">Emergency Services</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Loan Information */}
      <div className="p-3 rounded-lg border bg-amber-50 border-amber-200">
        <div className="flex items-center gap-2 mb-3">
          <DollarSign className="h-4 w-4 text-amber-600" />
          <h3 className="font-medium text-sm">Loan Information</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="loan-balance" className="text-xs font-medium text-gray-700">Outstanding Loan Balance</Label>
            <Input
              id="loan-balance"
              type="number"
              min="0"
              value={formData.loan_balance || ''}
              onChange={(e) => updateFormData({ loan_balance: parseFloat(e.target.value) || 0 })}
              placeholder="e.g., 15000"
              className="mt-1 bg-white h-8 text-xs"
            />
          </div>

          <div>
            <Label htmlFor="payoff-amount" className="text-xs font-medium text-gray-700">Payoff Amount</Label>
            <Input
              id="payoff-amount"
              type="number"
              min="0"
              value={formData.payoffAmount || ''}
              onChange={(e) => updateFormData({ payoffAmount: parseFloat(e.target.value) || 0 })}
              placeholder="e.g., 14500"
              className="mt-1 bg-white h-8 text-xs"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
