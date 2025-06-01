
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { FileText, Users, Car, AlertTriangle, DollarSign, Gauge } from 'lucide-react';
import { FollowUpAnswers, TITLE_STATUS_OPTIONS, PREVIOUS_USE_OPTIONS, DASHBOARD_LIGHTS, TIRE_CONDITION_OPTIONS } from '@/types/follow-up-answers';

interface TitleOwnershipTabProps {
  formData: FollowUpAnswers;
  updateFormData: (updates: Partial<FollowUpAnswers>) => void;
}

export function TitleOwnershipTab({ formData, updateFormData }: TitleOwnershipTabProps) {
  const handleDashboardLightToggle = (light: string, checked: boolean) => {
    const currentLights = formData.dashboard_lights || [];
    if (checked) {
      updateFormData({ dashboard_lights: [...currentLights, light] });
    } else {
      updateFormData({ dashboard_lights: currentLights.filter(l => l !== light) });
    }
  };

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
              onValueChange={(value: 'clean' | 'salvage' | 'rebuilt' | 'lien' | 'unknown') => updateFormData({ title_status: value })}
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
              onValueChange={(value: 'personal' | 'commercial' | 'rental' | 'emergency') => updateFormData({ previous_use: value })}
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

        {/* Dashboard Lights */}
        <Card className="border-purple-200 bg-purple-50/50 md:col-span-2">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center text-purple-700 text-xl">
              <AlertTriangle className="h-6 w-6 mr-3" />
              Dashboard Warning Lights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {DASHBOARD_LIGHTS.map((light) => (
                <div key={light} className="flex items-center space-x-2">
                  <Checkbox
                    id={light}
                    checked={(formData.dashboard_lights || []).includes(light)}
                    onCheckedChange={(checked) => handleDashboardLightToggle(light, !!checked)}
                  />
                  <Label htmlFor={light} className="text-sm cursor-pointer">
                    {light}
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tire Condition */}
        <Card className="border-purple-200 bg-purple-50/50">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center text-purple-700 text-xl">
              <Gauge className="h-6 w-6 mr-3" />
              Tire Condition
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select 
              value={formData.tire_condition || ''} 
              onValueChange={(value: 'new' | 'good' | 'worn' | 'bald') => updateFormData({ tire_condition: value })}
            >
              <SelectTrigger className="h-14 text-lg bg-white border-2 border-purple-200 hover:border-purple-300 focus:border-purple-500">
                <SelectValue placeholder="Select tire condition" />
              </SelectTrigger>
              <SelectContent className="bg-white border-2 border-purple-200">
                {TIRE_CONDITION_OPTIONS.map((option) => (
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

        {/* Loan Information */}
        <Card className="border-purple-200 bg-purple-50/50">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center text-purple-700 text-xl">
              <DollarSign className="h-6 w-6 mr-3" />
              Loan Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="active-loan-toggle"
                checked={formData.has_active_loan || false}
                onCheckedChange={(checked) => updateFormData({ has_active_loan: checked })}
              />
              <Label htmlFor="active-loan-toggle">
                Has active loan
              </Label>
            </div>
            
            {formData.has_active_loan && (
              <div>
                <Label htmlFor="loan-balance">Remaining Loan Balance</Label>
                <Input
                  id="loan-balance"
                  type="number"
                  placeholder="Enter amount"
                  value={formData.loan_balance || ''}
                  onChange={(e) => updateFormData({ loan_balance: parseFloat(e.target.value) || 0 })}
                  className="mt-2"
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
