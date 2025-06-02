
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    <div className="space-y-6">
      {/* Title Status */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileText className="h-5 w-5 text-blue-600" />
            Title Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="title-status" className="text-sm font-medium text-gray-700">Title Status</Label>
            <Select
              value={formData.title_status || 'clean'}
              onValueChange={(value) => updateFormData({ title_status: value as any })}
            >
              <SelectTrigger className="mt-1 bg-white">
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
        </CardContent>
      </Card>

      {/* Ownership History */}
      <Card className="bg-green-50 border-green-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="h-5 w-5 text-green-600" />
            Ownership History
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="previous-owners" className="text-sm font-medium text-gray-700">Number of Previous Owners</Label>
            <Input
              id="previous-owners"
              type="number"
              min="0"
              max="10"
              value={formData.previous_owners || ''}
              onChange={(e) => updateFormData({ previous_owners: parseInt(e.target.value) || 0 })}
              placeholder="e.g., 1"
              className="mt-1 bg-white"
            />
          </div>

          <div>
            <Label htmlFor="previous-use" className="text-sm font-medium text-gray-700">Previous Use</Label>
            <Select
              value={formData.previous_use || 'personal'}
              onValueChange={(value) => updateFormData({ previous_use: value as any })}
            >
              <SelectTrigger className="mt-1 bg-white">
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
        </CardContent>
      </Card>

      {/* Loan Information */}
      <Card className="bg-amber-50 border-amber-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <DollarSign className="h-5 w-5 text-amber-600" />
            Loan Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="loan-balance" className="text-sm font-medium text-gray-700">Outstanding Loan Balance (Optional)</Label>
            <Input
              id="loan-balance"
              type="number"
              min="0"
              value={formData.loan_balance || ''}
              onChange={(e) => updateFormData({ loan_balance: parseFloat(e.target.value) || 0 })}
              placeholder="e.g., 15000"
              className="mt-1 bg-white"
            />
          </div>

          <div>
            <Label htmlFor="payoff-amount" className="text-sm font-medium text-gray-700">Payoff Amount (Optional)</Label>
            <Input
              id="payoff-amount"
              type="number"
              min="0"
              value={formData.payoffAmount || ''}
              onChange={(e) => updateFormData({ payoffAmount: parseFloat(e.target.value) || 0 })}
              placeholder="e.g., 14500"
              className="mt-1 bg-white"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
