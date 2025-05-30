
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Star, Gauge, Palette } from 'lucide-react';
import { FollowUpAnswers } from '@/types/follow-up-answers';

interface ConditionTabProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
}

export function ConditionTab({ formData, updateFormData }: ConditionTabProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
          <Star className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Vehicle Condition</h2>
          <p className="text-gray-600">Detailed condition assessment affects valuation accuracy</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Palette className="h-5 w-5 mr-2" />
              Exterior Condition
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="exterior">Overall Exterior</Label>
              <Select 
                value={formData.exterior_condition || 'good'} 
                onValueChange={(value: 'excellent' | 'good' | 'fair' | 'poor') => 
                  updateFormData({ exterior_condition: value })
                }
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excellent">Excellent - Like new</SelectItem>
                  <SelectItem value="good">Good - Minor wear</SelectItem>
                  <SelectItem value="fair">Fair - Some scratches/dents</SelectItem>
                  <SelectItem value="poor">Poor - Significant damage</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Paint condition</Label>
              <RadioGroup
                value={formData.rust ? 'rust' : 'good'}
                onValueChange={(value) => updateFormData({ rust: value === 'rust' })}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="good" id="paint-good" />
                  <Label htmlFor="paint-good">Good condition</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="rust" id="paint-rust" />
                  <Label htmlFor="paint-rust">Has rust or corrosion</Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Star className="h-5 w-5 mr-2" />
              Interior Condition
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="interior">Overall Interior</Label>
              <Select 
                value={formData.interior_condition || 'good'} 
                onValueChange={(value: 'excellent' | 'good' | 'fair' | 'poor') => 
                  updateFormData({ interior_condition: value })
                }
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excellent">Excellent - Like new</SelectItem>
                  <SelectItem value="good">Good - Minor wear</SelectItem>
                  <SelectItem value="fair">Fair - Some wear/stains</SelectItem>
                  <SelectItem value="poor">Poor - Significant wear</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Interior issues</Label>
              <div className="space-y-2 mt-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="smoking"
                    checked={formData.smoking || false}
                    onChange={(e) => updateFormData({ smoking: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor="smoking">Smoking odor</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="pet-damage"
                    checked={formData.petDamage || false}
                    onChange={(e) => updateFormData({ petDamage: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor="pet-damage">Pet damage/odor</Label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Gauge className="h-5 w-5 mr-2" />
              Tires
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Label htmlFor="tires">Tire Condition</Label>
            <Select 
              value={formData.tire_condition || 'good'} 
              onValueChange={(value: 'new' | 'good' | 'worn' | 'bald') => 
                updateFormData({ tire_condition: value })
              }
            >
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select tire condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New or like-new</SelectItem>
                <SelectItem value="good">Good tread remaining</SelectItem>
                <SelectItem value="worn">Worn but safe</SelectItem>
                <SelectItem value="bald">Need replacement</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Other Damage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="hail-damage"
                  checked={formData.hailDamage || false}
                  onChange={(e) => updateFormData({ hailDamage: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="hail-damage">Hail damage</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="frame-damage"
                  checked={formData.frame_damage || false}
                  onChange={(e) => updateFormData({ frame_damage: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="frame-damage">Frame damage</Label>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
