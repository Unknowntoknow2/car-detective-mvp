
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { FileText, Users, Car, AlertTriangle } from 'lucide-react';
import { FollowUpAnswers, TITLE_STATUS_OPTIONS, PREVIOUS_USE_OPTIONS } from '@/types/follow-up-answers';

interface TitleOwnershipTabProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
}

export function TitleOwnershipTab({ formData, updateFormData }: TitleOwnershipTabProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
          <FileText className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Title & Ownership</h2>
          <p className="text-gray-600">Legal documentation and ownership history</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title Status */}
        <Card className="border-purple-200 bg-purple-50/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-purple-700">
              <FileText className="h-5 w-5 mr-2" />
              Title Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select 
              value={formData.title_status || ''} 
              onValueChange={(value) => updateFormData({ title_status: value })}
            >
              <SelectTrigger className="text-lg">
                <SelectValue placeholder="Select title status" />
              </SelectTrigger>
              <SelectContent>
                {TITLE_STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex flex-col">
                      <span className="font-medium">{option.label}</span>
                      <span className="text-xs text-gray-500">{option.impact}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Previous Owners */}
        <Card className="border-purple-200 bg-purple-50/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-purple-700">
              <Users className="h-5 w-5 mr-2" />
              Number of Previous Owners
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              type="number"
              min="0"
              max="10"
              placeholder="Enter number"
              value={formData.previous_owners || ''}
              onChange={(e) => updateFormData({ previous_owners: parseInt(e.target.value) || 0 })}
              className="text-lg font-medium"
            />
            <p className="text-xs text-purple-600 mt-1">Fewer owners typically means better care</p>
          </CardContent>
        </Card>

        {/* Previous Use */}
        <Card className="border-purple-200 bg-purple-50/50 md:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-purple-700">
              <Car className="h-5 w-5 mr-2" />
              Previous Use Type
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select 
              value={formData.previous_use || ''} 
              onValueChange={(value) => updateFormData({ previous_use: value })}
            >
              <SelectTrigger className="text-lg">
                <SelectValue placeholder="Select previous use" />
              </SelectTrigger>
              <SelectContent>
                {PREVIOUS_USE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex flex-col">
                      <span className="font-medium">{option.label}</span>
                      <span className="text-xs text-gray-500">{option.impact}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
