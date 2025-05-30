
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { AlertTriangle, FileText, Shield } from 'lucide-react';
import { FollowUpAnswers } from '@/types/follow-up-answers';

interface AccidentHistoryTabProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
}

export function AccidentHistoryTab({ formData, updateFormData }: AccidentHistoryTabProps) {
  const handleAccidentChange = (field: string, value: any) => {
    const currentAccidents = formData.accident_history || {
      hadAccident: false,
      count: 0,
      location: '',
      severity: 'minor',
      repaired: false,
      frameDamage: false,
      description: ''
    };

    updateFormData({
      accident_history: {
        ...currentAccidents,
        [field]: value
      }
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-3 mb-8">
        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center">
          <AlertTriangle className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Accident History</h2>
          <p className="text-gray-600 text-lg">Any accidents or damage history</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Has Accident Toggle */}
        <Card className="border-red-200 bg-red-50/50">
          <CardHeader>
            <CardTitle className="flex items-center text-red-700 text-xl">
              <AlertTriangle className="h-6 w-6 mr-3" />
              Accident History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="hadAccident" className="text-lg font-medium">
                  Has this vehicle been in any accidents?
                </Label>
                <p className="text-sm text-gray-600 mt-1">
                  Include any collisions, regardless of severity
                </p>
              </div>
              <Switch
                id="hadAccident"
                checked={formData.accident_history?.hadAccident || false}
                onCheckedChange={(checked) => handleAccidentChange('hadAccident', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Accident Details */}
        {formData.accident_history?.hadAccident && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Number of Accidents */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Number of Accidents</CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  type="number"
                  min="1"
                  max="10"
                  placeholder="Number of accidents"
                  value={formData.accident_history?.count || ''}
                  onChange={(e) => handleAccidentChange('count', parseInt(e.target.value) || 1)}
                />
              </CardContent>
            </Card>

            {/* Severity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Severity</CardTitle>
              </CardHeader>
              <CardContent>
                <Select 
                  value={formData.accident_history?.severity || ''} 
                  onValueChange={(value: 'minor' | 'moderate' | 'severe') => handleAccidentChange('severity', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="minor">Minor (cosmetic damage)</SelectItem>
                    <SelectItem value="moderate">Moderate (functional damage)</SelectItem>
                    <SelectItem value="severe">Severe (major structural damage)</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Location */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Damage Location</CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  placeholder="e.g., front bumper, rear quarter panel"
                  value={formData.accident_history?.location || ''}
                  onChange={(e) => handleAccidentChange('location', e.target.value)}
                />
              </CardContent>
            </Card>

            {/* Repair Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Repair Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Label htmlFor="repaired">Has the damage been repaired?</Label>
                  <Switch
                    id="repaired"
                    checked={formData.accident_history?.repaired || false}
                    onCheckedChange={(checked) => handleAccidentChange('repaired', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Frame Damage */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Shield className="h-5 w-5 mr-2" />
                  Frame Damage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="frameDamage" className="font-medium">
                      Was there any frame or structural damage?
                    </Label>
                    <p className="text-sm text-gray-600 mt-1">
                      Frame damage significantly affects vehicle value and safety
                    </p>
                  </div>
                  <Switch
                    id="frameDamage"
                    checked={formData.accident_history?.frameDamage || false}
                    onCheckedChange={(checked) => handleAccidentChange('frameDamage', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <FileText className="h-5 w-5 mr-2" />
                  Accident Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Please describe the accident(s) and any repairs made..."
                  value={formData.accident_history?.description || ''}
                  onChange={(e) => handleAccidentChange('description', e.target.value)}
                  rows={4}
                />
              </CardContent>
            </Card>
          </div>
        )}

        {/* No Accidents Message */}
        {!formData.accident_history?.hadAccident && (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <Shield className="h-8 w-8 text-green-600" />
                <div>
                  <h3 className="text-lg font-semibold text-green-800">Clean Accident History</h3>
                  <p className="text-green-700">
                    No reported accidents can positively impact your vehicle's value.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
