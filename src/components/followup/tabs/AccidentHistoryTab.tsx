
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { FollowUpAnswers } from '@/types/follow-up-answers';

interface AccidentHistoryTabProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
}

export function AccidentHistoryTab({ formData, updateFormData }: AccidentHistoryTabProps) {
  const accidents = formData.accidents || {
    hadAccident: false,
    count: 0,
    severity: 'minor' as const,
    repaired: false,
    frameDamage: false,
    description: ''
  };

  const handleAccidentChange = (field: string, value: any) => {
    updateFormData({
      accidents: {
        ...accidents,
        [field]: value
      }
    });
  };

  const handleHadAccidentChange = (hadAccident: boolean) => {
    updateFormData({
      accidents: {
        ...accidents,
        hadAccident,
        count: hadAccident ? (accidents.count || 1) : 0
      }
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Accident History
          </CardTitle>
          <p className="text-sm text-gray-600">
            Information about any accidents or collision damage
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Has Had Accident */}
          <div className="space-y-4">
            <div>
              <Label className="text-base font-medium">Has this vehicle been in an accident?</Label>
              <p className="text-sm text-gray-600 mb-3">
                Include any collision damage, even if repaired
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md min-h-[80px] ${
                  accidents.hadAccident === false
                    ? 'bg-green-50 border-green-200 ring-2 ring-green-200'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleHadAccidentChange(false)}
              >
                <div className="flex items-center space-x-3">
                  <Checkbox
                    checked={accidents.hadAccident === false}
                    onCheckedChange={() => handleHadAccidentChange(false)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div>
                    <Label className="cursor-pointer font-medium text-green-700">
                      No Accidents
                    </Label>
                    <p className="text-xs text-gray-600 mt-1">
                      Clean accident history
                    </p>
                  </div>
                </div>
              </div>

              <div
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md min-h-[80px] ${
                  accidents.hadAccident === true
                    ? 'bg-red-50 border-red-200 ring-2 ring-red-200'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleHadAccidentChange(true)}
              >
                <div className="flex items-center space-x-3">
                  <Checkbox
                    checked={accidents.hadAccident === true}
                    onCheckedChange={() => handleHadAccidentChange(true)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div>
                    <Label className="cursor-pointer font-medium text-red-700">
                      Yes, had accident(s)
                    </Label>
                    <p className="text-xs text-gray-600 mt-1">
                      Vehicle has accident history
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Accident Details - Only show if had accident */}
          {accidents.hadAccident && (
            <>
              {/* Accident Severity */}
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-medium">Accident Severity</Label>
                  <p className="text-sm text-gray-600">What was the severity of the most significant accident?</p>
                </div>
                
                <RadioGroup 
                  value={accidents.severity} 
                  onValueChange={(value) => handleAccidentChange('severity', value)}
                  className="grid grid-cols-1 gap-4"
                >
                  {[
                    { 
                      value: 'minor', 
                      label: 'Minor', 
                      desc: 'Cosmetic damage, no structural impact',
                      color: 'text-yellow-600',
                      bgColor: 'bg-yellow-50 border-yellow-200'
                    },
                    { 
                      value: 'moderate', 
                      label: 'Moderate', 
                      desc: 'Significant damage but vehicle driveable',
                      color: 'text-orange-600',
                      bgColor: 'bg-orange-50 border-orange-200'
                    },
                    { 
                      value: 'major', 
                      label: 'Major', 
                      desc: 'Extensive damage, possible total loss consideration',
                      color: 'text-red-600',
                      bgColor: 'bg-red-50 border-red-200'
                    }
                  ].map((option) => (
                    <div
                      key={option.value}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                        accidents.severity === option.value
                          ? `${option.bgColor} ring-2 ring-current ring-opacity-50`
                          : 'bg-white border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleAccidentChange('severity', option.value)}
                    >
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem 
                          value={option.value} 
                          id={option.value}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <div>
                          <Label htmlFor={option.value} className={`cursor-pointer font-medium ${option.color}`}>
                            {option.label}
                          </Label>
                          <p className="text-xs text-gray-600 mt-1">{option.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Repair Status */}
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-medium">Repair Status</Label>
                  <p className="text-sm text-gray-600">Was all accident damage properly repaired?</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md min-h-[80px] ${
                      accidents.repaired === true
                        ? 'bg-green-50 border-green-200 ring-2 ring-green-200'
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleAccidentChange('repaired', true)}
                  >
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        checked={accidents.repaired === true}
                        onCheckedChange={() => handleAccidentChange('repaired', true)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div>
                        <Label className="cursor-pointer font-medium text-green-700">
                          Fully Repaired
                        </Label>
                        <p className="text-xs text-gray-600 mt-1">
                          Professional repair completed
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md min-h-[80px] ${
                      accidents.repaired === false
                        ? 'bg-red-50 border-red-200 ring-2 ring-red-200'
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleAccidentChange('repaired', false)}
                  >
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        checked={accidents.repaired === false}
                        onCheckedChange={() => handleAccidentChange('repaired', false)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div>
                        <Label className="cursor-pointer font-medium text-red-700">
                          Not Fully Repaired
                        </Label>
                        <p className="text-xs text-gray-600 mt-1">
                          Damage remains or poor repair
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Frame Damage */}
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-medium">Frame Damage</Label>
                  <p className="text-sm text-gray-600">Was there any structural or frame damage?</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md min-h-[80px] ${
                      accidents.frameDamage === false
                        ? 'bg-green-50 border-green-200 ring-2 ring-green-200'
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleAccidentChange('frameDamage', false)}
                  >
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        checked={accidents.frameDamage === false}
                        onCheckedChange={() => handleAccidentChange('frameDamage', false)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div>
                        <Label className="cursor-pointer font-medium text-green-700">
                          No Frame Damage
                        </Label>
                        <p className="text-xs text-gray-600 mt-1">
                          Body panels only
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md min-h-[80px] ${
                      accidents.frameDamage === true
                        ? 'bg-red-50 border-red-200 ring-2 ring-red-200'
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleAccidentChange('frameDamage', true)}
                  >
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        checked={accidents.frameDamage === true}
                        onCheckedChange={() => handleAccidentChange('frameDamage', true)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <div>
                        <Label className="cursor-pointer font-medium text-red-700">
                          Frame Damage
                        </Label>
                        <p className="text-xs text-gray-600 mt-1">
                          Structural damage present
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Accident Description */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="accident-description" className="text-base font-medium">
                    Accident Details
                  </Label>
                  <p className="text-sm text-gray-600">
                    Describe the accident(s) and any repairs performed
                  </p>
                </div>
                
                <Textarea
                  id="accident-description"
                  value={accidents.description || ''}
                  onChange={(e) => handleAccidentChange('description', e.target.value)}
                  placeholder="Describe the accident, damage, and repairs..."
                  className="min-h-[100px]"
                />
              </div>
            </>
          )}

          {/* Accident Summary */}
          <Card className={`${accidents.hadAccident ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}`}>
            <CardHeader>
              <CardTitle className={`${accidents.hadAccident ? 'text-red-800' : 'text-green-800'} flex items-center gap-2`}>
                {accidents.hadAccident ? (
                  <AlertTriangle className="w-5 h-5" />
                ) : (
                  <CheckCircle className="w-5 h-5" />
                )}
                Accident History Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              {accidents.hadAccident ? (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-sm font-medium text-red-700 mb-1">Severity</div>
                      <Badge variant="destructive" className="text-xs">
                        {accidents.severity?.charAt(0).toUpperCase() + accidents.severity?.slice(1)}
                      </Badge>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium text-red-700 mb-1">Repaired</div>
                      <Badge variant={accidents.repaired ? 'default' : 'destructive'} className="text-xs">
                        {accidents.repaired ? 'Yes' : 'No'}
                      </Badge>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-medium text-red-700 mb-1">Frame</div>
                      <Badge variant={accidents.frameDamage ? 'destructive' : 'default'} className="text-xs">
                        {accidents.frameDamage ? 'Damaged' : 'Intact'}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-3 bg-red-100 rounded-lg">
                    <p className="text-sm text-red-700">
                      <strong>Impact:</strong> Accident history affects resale value. Severity and repair quality are key factors.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-green-100 rounded-lg">
                  <p className="text-sm text-green-700">
                    <strong>Clean History:</strong> No reported accidents help maintain optimal resale value.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
