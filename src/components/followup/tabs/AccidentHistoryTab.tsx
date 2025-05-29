
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Car, AlertTriangle, FileX, Shield } from 'lucide-react';
import { FollowUpAnswers } from '@/types/follow-up-answers';

interface AccidentHistoryTabProps {
  formData: FollowUpAnswers;
  onUpdate: (updates: Partial<FollowUpAnswers>) => void;
}

export function AccidentHistoryTab({ formData, onUpdate }: AccidentHistoryTabProps) {
  const currentAccidents = formData.accidents || {
    hadAccident: false,
    count: undefined,
    location: undefined,
    severity: undefined,
    repaired: undefined,
    frameDamage: undefined,
    description: undefined
  };

  const updateAccidents = (updates: Partial<typeof currentAccidents>) => {
    onUpdate({
      accidents: {
        ...currentAccidents,
        ...updates
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
          <p className="text-gray-600 text-lg">Document any previous accidents or damage</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Has Accident */}
        <Card className="border-red-200 bg-red-50/50 md:col-span-2">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center text-red-700 text-xl">
              <Car className="h-6 w-6 mr-3" />
              Has this vehicle been in any accidents?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => updateAccidents({ hadAccident: false })}
                className={`px-6 py-3 rounded-lg border-2 transition-all ${
                  currentAccidents.hadAccident === false
                    ? 'bg-green-100 border-green-300 text-green-800 font-semibold' 
                    : 'bg-white border-gray-300 hover:border-green-300'
                }`}
              >
                No Accidents
              </button>
              <button
                type="button"
                onClick={() => updateAccidents({ hadAccident: true })}
                className={`px-6 py-3 rounded-lg border-2 transition-all ${
                  currentAccidents.hadAccident === true
                    ? 'bg-red-100 border-red-300 text-red-800 font-semibold' 
                    : 'bg-white border-gray-300 hover:border-red-300'
                }`}
              >
                Yes, Has Accidents
              </button>
            </div>
          </CardContent>
        </Card>

        {currentAccidents.hadAccident && (
          <>
            {/* Accident Count */}
            <Card className="border-red-200 bg-red-50/50 h-fit">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-red-700 text-xl">
                  <AlertTriangle className="h-6 w-6 mr-3" />
                  Number of Accidents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select 
                  value={currentAccidents.count?.toString() || ''} 
                  onValueChange={(value) => updateAccidents({ count: parseInt(value) })}
                >
                  <SelectTrigger className="h-14 text-lg bg-white border-2 border-red-200 hover:border-red-300 focus:border-red-500">
                    <SelectValue placeholder="Select number" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Accident</SelectItem>
                    <SelectItem value="2">2 Accidents</SelectItem>
                    <SelectItem value="3">3 Accidents</SelectItem>
                    <SelectItem value="4">4+ Accidents</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Accident Location */}
            <Card className="border-red-200 bg-red-50/50 h-fit">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-red-700 text-xl">
                  <Car className="h-6 w-6 mr-3" />
                  Primary Damage Area
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select 
                  value={currentAccidents.location || ''} 
                  onValueChange={(value) => updateAccidents({ location: value })}
                >
                  <SelectTrigger className="h-14 text-lg bg-white border-2 border-red-200 hover:border-red-300 focus:border-red-500">
                    <SelectValue placeholder="Select damage area" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="front">Front End</SelectItem>
                    <SelectItem value="rear">Rear End</SelectItem>
                    <SelectItem value="side">Side Impact</SelectItem>
                    <SelectItem value="multiple">Multiple Areas</SelectItem>
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
                  value={currentAccidents.severity || ''} 
                  onValueChange={(value: 'minor' | 'moderate' | 'severe') => updateAccidents({ severity: value })}
                >
                  <SelectTrigger className="h-14 text-lg bg-white border-2 border-red-200 hover:border-red-300 focus:border-red-500">
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minor">Minor (Cosmetic damage only)</SelectItem>
                    <SelectItem value="moderate">Moderate (Some structural damage)</SelectItem>
                    <SelectItem value="severe">Severe (Major structural damage)</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Properly Repaired */}
            <Card className="border-red-200 bg-red-50/50 h-fit">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-red-700 text-xl">
                  <Shield className="h-6 w-6 mr-3" />
                  Properly Repaired
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4 p-4 bg-white rounded-lg border-2 border-red-200">
                  <Checkbox
                    id="properly-repaired"
                    checked={currentAccidents.repaired || false}
                    onCheckedChange={(checked) => updateAccidents({ repaired: !!checked })}
                    className="h-5 w-5"
                  />
                  <Label htmlFor="properly-repaired" className="text-lg font-semibold cursor-pointer">
                    Damage was professionally repaired
                  </Label>
                </div>
              </CardContent>
            </Card>

            {/* Frame Damage */}
            <Card className="border-red-200 bg-red-50/50 h-fit">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-red-700 text-xl">
                  <FileX className="h-6 w-6 mr-3" />
                  Frame Damage
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4 p-4 bg-white rounded-lg border-2 border-red-200">
                  <Checkbox
                    id="frame-damage"
                    checked={currentAccidents.frameDamage || false}
                    onCheckedChange={(checked) => updateAccidents({ frameDamage: !!checked })}
                    className="h-5 w-5"
                  />
                  <Label htmlFor="frame-damage" className="text-lg font-semibold cursor-pointer">
                    Vehicle has frame damage
                  </Label>
                </div>
                <p className="text-sm text-red-600 font-medium">Frame damage significantly affects value</p>
              </CardContent>
            </Card>

            {/* Accident Description */}
            <Card className="border-red-200 bg-red-50/50 md:col-span-2">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-red-700 text-xl">
                  <FileX className="h-6 w-6 mr-3" />
                  Additional Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Describe the accident(s) and any repairs performed..."
                  value={currentAccidents.description || ''}
                  onChange={(e) => updateAccidents({ description: e.target.value })}
                  rows={6}
                  className="resize-none text-base bg-white border-2 border-red-200 hover:border-red-300 focus:border-red-500 p-4"
                />
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
