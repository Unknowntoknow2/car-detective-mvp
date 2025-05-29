
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Car, Calendar, MapPin, Plus, X } from 'lucide-react';
import { FollowUpAnswers } from '@/types/follow-up-answers';

interface AccidentHistoryTabProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
}

export function AccidentHistoryTab({ formData, updateFormData }: AccidentHistoryTabProps) {
  const hasAccidents = formData.accidents?.hadAccident ?? false;
  const accidentsList = formData.accidents?.count || 0;

  const handleAccidentToggle = (hasAccident: boolean) => {
    updateFormData({
      accidents: {
        hadAccident: hasAccident,
        count: hasAccident ? Math.max(1, accidentsList) : 0,
        location: hasAccident ? formData.accidents?.location : undefined,
        severity: hasAccident ? (formData.accidents?.severity || 'minor') : undefined,
        repaired: hasAccident ? (formData.accidents?.repaired || false) : undefined,
        frameDamage: hasAccident ? (formData.accidents?.frameDamage || false) : undefined,
        description: hasAccident ? formData.accidents?.description : undefined
      }
    });
  };

  const updateAccidentDetails = (field: string, value: any) => {
    updateFormData({
      accidents: {
        hadAccident: true,
        count: formData.accidents?.count || 1,
        location: formData.accidents?.location,
        severity: formData.accidents?.severity || 'minor',
        repaired: formData.accidents?.repaired || false,
        frameDamage: formData.accidents?.frameDamage || false,
        description: formData.accidents?.description,
        ...{ [field]: value }
      }
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-3 mb-8">
        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center">
          <AlertTriangle className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Accident History</h2>
          <p className="text-gray-600 text-lg">Past accidents and damage assessment</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Primary Question */}
        <Card className="border-red-200 bg-red-50/50">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center text-red-700 text-xl">
              <AlertTriangle className="h-6 w-6 mr-3" />
              Has this vehicle been in any accidents?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={hasAccidents ? 'yes' : 'no'}
              onValueChange={(value) => handleAccidentToggle(value === 'yes')}
              className="flex space-x-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="no-accidents" />
                <Label htmlFor="no-accidents" className="text-lg font-medium cursor-pointer">
                  No accidents
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="yes-accidents" />
                <Label htmlFor="yes-accidents" className="text-lg font-medium cursor-pointer">
                  Yes, there have been accidents
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Accident Details */}
        {hasAccidents && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Number of Accidents */}
            <Card className="border-red-200 bg-red-50/50 h-fit">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-red-700 text-xl">
                  <Car className="h-6 w-6 mr-3" />
                  Number of Accidents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  type="number"
                  min="1"
                  max="10"
                  placeholder="Number of accidents"
                  value={formData.accidents?.count || ''}
                  onChange={(e) => updateAccidentDetails('count', parseInt(e.target.value) || 1)}
                  className="h-14 text-lg font-semibold bg-white border-2 border-red-200 hover:border-red-300 focus:border-red-500"
                />
              </CardContent>
            </Card>

            {/* Accident Location */}
            <Card className="border-red-200 bg-red-50/50 h-fit">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-red-700 text-xl">
                  <MapPin className="h-6 w-6 mr-3" />
                  Primary Accident Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select 
                  value={formData.accidents?.location || ''} 
                  onValueChange={(value) => updateAccidentDetails('location', value)}
                >
                  <SelectTrigger className="h-14 text-lg bg-white border-2 border-red-200 hover:border-red-300 focus:border-red-500">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-2 border-red-200">
                    <SelectItem value="front">Front</SelectItem>
                    <SelectItem value="rear">Rear</SelectItem>
                    <SelectItem value="side">Side</SelectItem>
                    <SelectItem value="multiple">Multiple Areas</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Accident Severity */}
            <Card className="border-red-200 bg-red-50/50 h-fit">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-red-700 text-xl">
                  <AlertTriangle className="h-6 w-6 mr-3" />
                  Severity Level
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select 
                  value={formData.accidents?.severity || ''} 
                  onValueChange={(value: 'minor' | 'moderate' | 'severe') => updateAccidentDetails('severity', value)}
                >
                  <SelectTrigger className="h-14 text-lg bg-white border-2 border-red-200 hover:border-red-300 focus:border-red-500">
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-2 border-red-200">
                    <SelectItem value="minor">Minor (cosmetic damage)</SelectItem>
                    <SelectItem value="moderate">Moderate (structural damage)</SelectItem>
                    <SelectItem value="severe">Severe (major damage)</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Repaired Status */}
            <Card className="border-red-200 bg-red-50/50 h-fit">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-red-700 text-xl">
                  <Car className="h-6 w-6 mr-3" />
                  Repair Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={formData.accidents?.repaired ? 'yes' : 'no'}
                  onValueChange={(value) => updateAccidentDetails('repaired', value === 'yes')}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="repaired-yes" />
                    <Label htmlFor="repaired-yes" className="text-lg cursor-pointer">
                      Fully repaired
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="repaired-no" />
                    <Label htmlFor="repaired-no" className="text-lg cursor-pointer">
                      Not repaired or partially repaired
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Frame Damage */}
            <Card className="border-red-200 bg-red-50/50 md:col-span-2">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-red-700 text-xl">
                  <AlertTriangle className="h-6 w-6 mr-3" />
                  Frame/Structural Damage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={formData.accidents?.frameDamage ? 'yes' : 'no'}
                  onValueChange={(value) => updateAccidentDetails('frameDamage', value === 'yes')}
                  className="flex space-x-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="frame-no" />
                    <Label htmlFor="frame-no" className="text-lg cursor-pointer">
                      No frame damage
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="frame-yes" />
                    <Label htmlFor="frame-yes" className="text-lg cursor-pointer">
                      Frame damage present
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Accident Description */}
            <Card className="border-red-200 bg-red-50/50 md:col-span-2">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-red-700 text-xl">
                  <AlertTriangle className="h-6 w-6 mr-3" />
                  Accident Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Describe the accident(s), repairs made, and any ongoing issues..."
                  value={formData.accidents?.description || ''}
                  onChange={(e) => updateAccidentDetails('description', e.target.value)}
                  rows={4}
                  className="resize-none text-base bg-white border-2 border-red-200 hover:border-red-300 focus:border-red-500 p-4"
                />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
