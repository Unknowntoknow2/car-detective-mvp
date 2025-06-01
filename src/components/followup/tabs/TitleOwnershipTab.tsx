
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FollowUpAnswers } from '@/types/follow-up-answers';

interface TitleOwnershipTabProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
}

export function TitleOwnershipTab({ formData, updateFormData }: TitleOwnershipTabProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Title Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title-status">Title Status</Label>
            <Select
              value={formData.title_status || 'clean'}
              onValueChange={(value) => updateFormData({ title_status: value as any })}
            >
              <SelectTrigger>
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

      <Card>
        <CardHeader>
          <CardTitle>Ownership History</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="previous-owners">Number of Previous Owners</Label>
            <Input
              id="previous-owners"
              type="number"
              min="0"
              max="10"
              value={formData.previous_owners || ''}
              onChange={(e) => updateFormData({ previous_owners: parseInt(e.target.value) || 0 })}
              placeholder="e.g., 1"
            />
          </div>

          <div>
            <Label htmlFor="previous-use">Previous Use</Label>
            <Select
              value={formData.previous_use || 'personal'}
              onValueChange={(value) => updateFormData({ previous_use: value as any })}
            >
              <SelectTrigger>
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

      <Card>
        <CardHeader>
          <CardTitle>Loan Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="loan-balance">Outstanding Loan Balance (Optional)</Label>
            <Input
              id="loan-balance"
              type="number"
              min="0"
              value={formData.loan_balance || ''}
              onChange={(e) => updateFormData({ loan_balance: parseFloat(e.target.value) || 0 })}
              placeholder="e.g., 15000"
            />
          </div>

          <div>
            <Label htmlFor="payoff-amount">Payoff Amount (Optional)</Label>
            <Input
              id="payoff-amount"
              type="number"
              min="0"
              value={formData.payoffAmount || ''}
              onChange={(e) => updateFormData({ payoffAmount: parseFloat(e.target.value) || 0 })}
              placeholder="e.g., 14500"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
