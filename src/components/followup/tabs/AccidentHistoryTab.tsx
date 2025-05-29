
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Shield, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { FollowUpAnswers } from '@/types/follow-up-answers';

interface AccidentHistoryTabProps {
  formData: FollowUpAnswers;
  onAccidentsChange: (hadAccident: boolean, details?: any) => void;
}

export function AccidentHistoryTab({ formData, onAccidentsChange }: AccidentHistoryTabProps) {
  const hasAccident = formData.accidents?.hadAccident;

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center">
          <Shield className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Accident History</h2>
          <p className="text-gray-600">Document any damage or accidents</p>
        </div>
      </div>

      {/* Primary Question */}
      <Card className="border-red-200 bg-red-50/50">
        <CardHeader>
          <CardTitle className="flex items-center text-red-700">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Has this vehicle been in any accidents?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={hasAccident ? 'yes' : 'no'}
            onValueChange={(value) => onAccidentsChange(value === 'yes')}
            className="flex space-x-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="no-accident" />
              <Label htmlFor="no-accident" className="flex items-center cursor-pointer">
                <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                No accidents
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="yes-accident" />
              <Label htmlFor="yes-accident" className="flex items-center cursor-pointer">
                <AlertTriangle className="h-4 w-4 mr-1 text-red-500" />
                Yes, there have been accidents
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Accident Details */}
      {hasAccident && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-red-200 bg-red-50/50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-red-700">
                <Info className="h-5 w-5 mr-2" />
                Number of Accidents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select 
                value={formData.accidents?.count?.toString() || ''} 
                onValueChange={(value) => onAccidentsChange(true, { 
                  ...formData.accidents, 
                  count: parseInt(value) 
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select number" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 accident</SelectItem>
                  <SelectItem value="2">2 accidents</SelectItem>
                  <SelectItem value="3">3 accidents</SelectItem>
                  <SelectItem value="4">4+ accidents</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card className="border-red-200 bg-red-50/50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-red-700">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Severity Level
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select 
                value={formData.accidents?.severity || ''} 
                onValueChange={(value) => onAccidentsChange(true, { 
                  ...formData.accidents, 
                  severity: value 
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="minor">
                    <div className="flex flex-col">
                      <span>Minor</span>
                      <span className="text-xs text-gray-500">Cosmetic damage only</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="moderate">
                    <div className="flex flex-col">
                      <span>Moderate</span>
                      <span className="text-xs text-gray-500">Some structural damage</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="major">
                    <div className="flex flex-col">
                      <span>Major</span>
                      <span className="text-xs text-gray-500">Significant damage or totaled</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card className="border-red-200 bg-red-50/50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-red-700">
                <Shield className="h-5 w-5 mr-2" />
                Impact Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Select 
                value={formData.accidents?.location || ''} 
                onValueChange={(value) => onAccidentsChange(true, { 
                  ...formData.accidents, 
                  location: value 
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="front">Front</SelectItem>
                  <SelectItem value="rear">Rear</SelectItem>
                  <SelectItem value="side">Side</SelectItem>
                  <SelectItem value="multiple">Multiple areas</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card className="border-red-200 bg-red-50/50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-red-700">
                <CheckCircle className="h-5 w-5 mr-2" />
                Repair Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={formData.accidents?.repaired ? 'yes' : 'no'}
                onValueChange={(value) => onAccidentsChange(true, { 
                  ...formData.accidents, 
                  repaired: value === 'yes' 
                })}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="repaired-yes" />
                  <Label htmlFor="repaired-yes">Professionally repaired</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="repaired-no" />
                  <Label htmlFor="repaired-no">Not repaired</Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          <Card className="border-red-200 bg-red-50/50 md:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-red-700">
                <Info className="h-5 w-5 mr-2" />
                Additional Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Describe the accident(s), damage, and any other relevant details..."
                value={formData.accidents?.description || ''}
                onChange={(e) => onAccidentsChange(true, { 
                  ...formData.accidents, 
                  description: e.target.value 
                })}
                rows={4}
                className="resize-none"
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
