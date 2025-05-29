
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Car, 
  Shield, 
  Wrench, 
  FileText, 
  Gauge, 
  Palette,
  Star,
  AlertTriangle,
  CheckCircle,
  Clock,
  Settings,
  Zap
} from 'lucide-react';
import { FollowUpAnswers } from '@/types/follow-up-answers';
import { VehicleConditionTab } from './tabs/VehicleConditionTab';
import { AccidentHistoryTab } from './tabs/AccidentHistoryTab';
import { ServiceMaintenanceTab } from './tabs/ServiceMaintenanceTab';
import { TitleOwnershipTab } from './tabs/TitleOwnershipTab';
import { PhysicalFeaturesTab } from './tabs/PhysicalFeaturesTab';
import { ModificationsTab } from './tabs/ModificationsTab';

export interface UnifiedFollowUpFormProps {
  vin: string;
  onComplete: (formData: FollowUpAnswers) => void;
}

const categories = [
  {
    id: 'condition',
    label: 'Vehicle Condition',
    icon: Star,
    color: 'from-emerald-500 to-teal-600',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    textColor: 'text-emerald-700',
    description: 'Overall condition assessment'
  },
  {
    id: 'accidents',
    label: 'Accident History',
    icon: Shield,
    color: 'from-red-500 to-pink-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    textColor: 'text-red-700',
    description: 'Damage and accident details'
  },
  {
    id: 'service',
    label: 'Service & Maintenance',
    icon: Wrench,
    color: 'from-blue-500 to-indigo-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-700',
    description: 'Maintenance history and status'
  },
  {
    id: 'title',
    label: 'Title & Ownership',
    icon: FileText,
    color: 'from-purple-500 to-violet-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    textColor: 'text-purple-700',
    description: 'Legal and ownership information'
  },
  {
    id: 'physical',
    label: 'Physical Features',
    icon: Car,
    color: 'from-orange-500 to-amber-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    textColor: 'text-orange-700',
    description: 'Tires, lights, and physical state'
  },
  {
    id: 'modifications',
    label: 'Modifications',
    icon: Settings,
    color: 'from-gray-500 to-slate-600',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    textColor: 'text-gray-700',
    description: 'Aftermarket changes and upgrades'
  }
];

export function UnifiedFollowUpForm({ vin, onComplete }: UnifiedFollowUpFormProps) {
  const [activeTab, setActiveTab] = useState('condition');
  const [formData, setFormData] = useState<FollowUpAnswers>({
    vin,
    accidents: { hadAccident: false },
    modifications: { modified: false },
    completion_percentage: 0,
    is_complete: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });

  // Calculate completion percentage
  const calculateCompletion = () => {
    const requiredFields = [
      'mileage', 'zip_code', 'condition', 'exterior_condition', 'interior_condition',
      'service_history', 'title_status', 'tire_condition'
    ];
    
    const completedFields = requiredFields.filter(field => {
      const value = formData[field as keyof FollowUpAnswers];
      return value !== undefined && value !== null && value !== '';
    }).length;
    
    return Math.round((completedFields / requiredFields.length) * 100);
  };

  const completion = calculateCompletion();

  const updateFormData = (updates: Partial<FollowUpAnswers>) => {
    setFormData(prev => ({
      ...prev,
      ...updates,
      updated_at: new Date().toISOString()
    }));
  };

  const handleAccidentsChange = (hadAccident: boolean, details?: any) => {
    setFormData(prev => ({
      ...prev,
      accidents: {
        hadAccident,
        ...details
      },
      updated_at: new Date().toISOString()
    }));
  };

  const handleModificationsChange = (modified: boolean, types?: string[]) => {
    setFormData(prev => ({
      ...prev,
      modifications: {
        modified,
        types: types || []
      },
      updated_at: new Date().toISOString()
    }));
  };

  const handleSubmit = () => {
    const finalData = {
      ...formData,
      completion_percentage: completion,
      is_complete: completion >= 80,
      updated_at: new Date().toISOString()
    };
    
    onComplete(finalData);
  };

  const getTabStatus = (tabId: string) => {
    switch (tabId) {
      case 'condition':
        return formData.condition && formData.exterior_condition && formData.interior_condition ? 'complete' : 'incomplete';
      case 'accidents':
        return formData.accidents?.hadAccident !== undefined ? 'complete' : 'incomplete';
      case 'service':
        return formData.service_history ? 'complete' : 'incomplete';
      case 'title':
        return formData.title_status ? 'complete' : 'incomplete';
      case 'physical':
        return formData.tire_condition ? 'complete' : 'incomplete';
      case 'modifications':
        return formData.modifications?.modified !== undefined ? 'complete' : 'incomplete';
      default:
        return 'incomplete';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header with Progress */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
            <Car className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Vehicle Assessment
            </h1>
            <p className="text-gray-600">VIN: {vin}</p>
          </div>
        </div>
        
        <div className="max-w-md mx-auto space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-600">Progress</span>
            <span className="text-sm font-bold text-gray-900">{completion}%</span>
          </div>
          <Progress value={completion} className="h-3" />
        </div>
      </div>

      {/* Tabbed Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-3 lg:grid-cols-6 gap-2 h-auto p-2 bg-gray-100/50 rounded-xl">
          {categories.map((category) => {
            const Icon = category.icon;
            const status = getTabStatus(category.id);
            
            return (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className={`
                  relative flex flex-col items-center p-4 space-y-2 rounded-lg border-2 transition-all duration-300
                  data-[state=active]:shadow-lg data-[state=active]:scale-105
                  ${activeTab === category.id 
                    ? `bg-gradient-to-br ${category.color} text-white border-transparent` 
                    : `${category.bgColor} ${category.borderColor} ${category.textColor} hover:shadow-md`
                  }
                `}
              >
                <div className="relative">
                  <Icon className="h-6 w-6" />
                  {status === 'complete' && (
                    <CheckCircle className="absolute -top-1 -right-1 h-4 w-4 text-green-500 bg-white rounded-full" />
                  )}
                </div>
                <div className="text-center">
                  <div className="font-medium text-xs">{category.label}</div>
                  <div className={`text-xs opacity-75 ${activeTab === category.id ? 'text-white' : 'text-gray-500'}`}>
                    {category.description}
                  </div>
                </div>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {/* Tab Content */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200">
          <TabsContent value="condition" className="p-6 m-0">
            <VehicleConditionTab 
              formData={formData} 
              updateFormData={updateFormData}
            />
          </TabsContent>

          <TabsContent value="accidents" className="p-6 m-0">
            <AccidentHistoryTab 
              formData={formData} 
              onAccidentsChange={handleAccidentsChange}
            />
          </TabsContent>

          <TabsContent value="service" className="p-6 m-0">
            <ServiceMaintenanceTab 
              formData={formData} 
              updateFormData={updateFormData}
            />
          </TabsContent>

          <TabsContent value="title" className="p-6 m-0">
            <TitleOwnershipTab 
              formData={formData} 
              updateFormData={updateFormData}
            />
          </TabsContent>

          <TabsContent value="physical" className="p-6 m-0">
            <PhysicalFeaturesTab 
              formData={formData} 
              updateFormData={updateFormData}
            />
          </TabsContent>

          <TabsContent value="modifications" className="p-6 m-0">
            <ModificationsTab 
              formData={formData} 
              onModificationsChange={handleModificationsChange}
            />
          </TabsContent>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-6">
          <Badge variant="outline" className="text-sm">
            {completion >= 80 ? (
              <><CheckCircle className="h-4 w-4 mr-1 text-green-500" /> Ready to Submit</>
            ) : (
              <><Clock className="h-4 w-4 mr-1 text-amber-500" /> {Math.max(0, 80 - completion)}% more needed</>
            )}
          </Badge>
          
          <Button 
            onClick={handleSubmit}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8"
            disabled={completion < 80}
          >
            <Zap className="h-4 w-4 mr-2" />
            Complete Assessment
          </Button>
        </div>
      </Tabs>
    </div>
  );
}
