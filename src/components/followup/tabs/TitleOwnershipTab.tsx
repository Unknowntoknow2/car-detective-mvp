
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
    <div className="space-y-8">
      <div className="flex items-center space-x-3 mb-8">
        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
          <FileText className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Title & Ownership</h2>
          <p className="text-gray-600 text-lg">Legal documentation and ownership history</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Title Status */}
        <Card className="border-purple-200 bg-purple-50/50 h-fit">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center text-purple-700 text-xl">
              <FileText className="h-6 w-6 mr-3" />
              Title Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select 
              value={formData.title_status || ''} 
              onValueChange={(value: 'clean' | 'salvage' | 'flood' | 'lemon') => updateFormData({ title_status: value })}
            >
              <SelectTrigger className="h-14 text-lg bg-white border-2 border-purple-200 hover:border-purple-300 focus:border-purple-500">
                <SelectValue placeholder="Select title status" className="text-lg" />
              </SelectTrigger>
              <SelectContent className="bg-white border-2 border-purple-200">
                {TITLE_STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="p-4 cursor-pointer hover:bg-purple-50">
                    <div className="flex flex-col space-y-1">
                      <span className="font-semibold text-base">{option.label}</span>
                      <span className="text-sm text-gray-600">{option.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Previous Owners */}
        <Card className="border-purple-200 bg-purple-50/50 h-fit">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center text-purple-700 text-xl">
              <Users className="h-6 w-6 mr-3" />
              Number of Previous Owners
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-6">
            <Input
              type="number"
              min="0"
              max="10"
              placeholder="Enter number"
              value={formData.previous_owners || ''}
              onChange={(e) => updateFormData({ previous_owners: parseInt(e.target.value) || 0 })}
              className="h-14 text-lg font-semibold bg-white border-2 border-purple-200 hover:border-purple-300 focus:border-purple-500"
            />
            <p className="text-sm text-purple-600 mt-4 font-medium">Fewer owners typically means better care</p>
          </CardContent>
        </Card>

        {/* Previous Use */}
        <Card className="border-purple-200 bg-purple-50/50 md:col-span-2">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center text-purple-700 text-xl">
              <Car className="h-6 w-6 mr-3" />
              Previous Use Type
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select 
              value={formData.previous_use || ''} 
              onValueChange={(value: 'personal' | 'rental' | 'fleet' | 'commercial' | 'taxi') => updateFormData({ previous_use: value })}
            >
              <SelectTrigger className="h-14 text-lg bg-white border-2 border-purple-200 hover:border-purple-300 focus:border-purple-500">
                <SelectValue placeholder="Select previous use" className="text-lg" />
              </SelectTrigger>
              <SelectContent className="bg-white border-2 border-purple-200">
                {PREVIOUS_USE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="p-4 cursor-pointer hover:bg-purple-50">
                    <div className="flex flex-col space-y-1">
                      <span className="font-semibold text-base">{option.label}</span>
                      <span className="text-sm text-gray-600">{option.description}</span>
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
