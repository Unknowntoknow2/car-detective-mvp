
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { FollowUpAnswers } from '@/types/follow-up-answers';
import { FeaturesTab } from './tabs/FeaturesTab';
import { TitleOwnershipTab } from './tabs/TitleOwnershipTab';
import { ServiceMaintenanceTab } from './tabs/ServiceMaintenanceTab';
import { PhysicalFeaturesTab } from './tabs/PhysicalFeaturesTab';
import { ModificationsTab } from './tabs/ModificationsTab';
import { AccidentHistoryTab } from './tabs/AccidentHistoryTab';

interface UnifiedFollowUpFormProps {
  vin: string;
  initialData?: Partial<FollowUpAnswers>;
  onSubmit: (data: FollowUpAnswers) => void;
  onSave?: (data: FollowUpAnswers) => void;
}

type TabId = 'basic' | 'accidents' | 'service' | 'modifications';

export function UnifiedFollowUpForm({ 
  vin, 
  initialData = {}, 
  onSubmit, 
  onSave 
}: UnifiedFollowUpFormProps) {
  const [activeTab, setActiveTab] = useState<TabId>('basic');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Initialize form data with proper defaults
  const [formData, setFormData] = useState<FollowUpAnswers>({
    vin,
    user_id: undefined,
    valuation_id: undefined,
    // Basic Info
    mileage: initialData.mileage || undefined,
    zip_code: initialData.zip_code || '',
    condition: initialData.condition || 'good',
    title_status: initialData.title_status || 'clean',
    previous_owners: initialData.previous_owners || 1,
    previous_use: initialData.previous_use || 'personal',
    
    // Service & Maintenance
    service_history: initialData.service_history || 'unknown',
    maintenance_status: initialData.maintenance_status || 'fair',
    last_service_date: initialData.last_service_date || undefined,
    
    // Physical Features
    tire_condition: initialData.tire_condition || 'good',
    frame_damage: initialData.frame_damage || false,
    dashboard_lights: initialData.dashboard_lights || [],
    
    // Accidents
    accidents: initialData.accidents || {
      hadAccident: false,
      count: undefined,
      location: undefined,
      severity: undefined,
      repaired: undefined,
      frameDamage: undefined,
      description: undefined
    },
    
    // Modifications
    modifications: initialData.modifications || {
      modified: false,
      types: [],
      reversible: undefined
    },
    
    // Progress tracking
    completion_percentage: initialData.completion_percentage || 0,
    is_complete: initialData.is_complete || false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });

  // Tab configuration
  const tabs = [
    { id: 'basic', label: 'Basic Info', color: 'blue' },
    { id: 'accidents', label: 'Accident History', color: 'red' },
    { id: 'service', label: 'Service & Maintenance', color: 'green' },
    { id: 'modifications', label: 'Modifications', color: 'purple' }
  ];

  const currentTabIndex = tabs.findIndex(tab => tab.id === activeTab);
  const isFirstTab = currentTabIndex === 0;
  const isLastTab = currentTabIndex === tabs.length - 1;

  const goToNextTab = () => {
    if (!isLastTab) {
      const nextTab = tabs[currentTabIndex + 1];
      setActiveTab(nextTab.id as TabId);
    }
  };

  const goToPreviousTab = () => {
    if (!isFirstTab) {
      const prevTab = tabs[currentTabIndex - 1];
      setActiveTab(prevTab.id as TabId);
    }
  };

  // Update form data helper
  const updateFormData = (updates: Partial<FollowUpAnswers>) => {
    setFormData(prev => {
      const updated = { 
        ...prev, 
        ...updates,
        updated_at: new Date().toISOString()
      };
      
      // Calculate completion percentage
      const totalFields = 15; // Approximate number of important fields
      let completedFields = 0;
      
      if (updated.mileage) completedFields++;
      if (updated.zip_code) completedFields++;
      if (updated.condition) completedFields++;
      if (updated.title_status) completedFields++;
      if (updated.previous_owners) completedFields++;
      if (updated.previous_use) completedFields++;
      if (updated.service_history) completedFields++;
      if (updated.maintenance_status) completedFields++;
      if (updated.tire_condition) completedFields++;
      if (updated.accidents?.hadAccident !== undefined) completedFields++;
      if (updated.modifications?.modified !== undefined) completedFields++;
      if (updated.dashboard_lights && updated.dashboard_lights.length >= 0) completedFields++;
      
      updated.completion_percentage = Math.round((completedFields / totalFields) * 100);
      updated.is_complete = updated.completion_percentage >= 80;
      
      return updated;
    });
  };

  const handleSave = async () => {
    if (!onSave) return;
    
    setIsSaving(true);
    try {
      await onSave(formData);
      toast.success('Progress saved successfully!');
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save progress');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Mark as complete
      const completedData = {
        ...formData,
        is_complete: true,
        completion_percentage: 100,
        updated_at: new Date().toISOString()
      };
      
      await onSubmit(completedData);
      toast.success('Follow-up submitted successfully!');
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('Failed to submit follow-up');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'basic':
        return (
          <div className="space-y-6">
            <TitleOwnershipTab 
              formData={formData} 
              updateFormData={updateFormData}
            />
            <PhysicalFeaturesTab 
              formData={formData} 
              updateFormData={updateFormData}
            />
          </div>
        );
      case 'accidents':
        return (
          <AccidentHistoryTab 
            formData={formData} 
            updateFormData={updateFormData}
          />
        );
      case 'service':
        return (
          <ServiceMaintenanceTab 
            formData={formData} 
            updateFormData={updateFormData}
          />
        );
      case 'modifications':
        return (
          <div className="space-y-6">
            <ModificationsTab 
              formData={formData} 
              onModificationsChange={(modified, types) => {
                updateFormData({
                  modifications: {
                    modified,
                    types: types || [],
                    reversible: modified ? false : undefined
                  }
                });
              }}
            />
            <FeaturesTab 
              formData={formData} 
              updateFormData={updateFormData}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardContent className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Vehicle Follow-Up Assessment
          </h1>
          <p className="text-gray-600">
            VIN: {vin} • Progress: {formData.completion_percentage}%
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as TabId)}>
          <TabsList className="grid w-full grid-cols-4 mb-8">
            {tabs.map((tab) => (
              <TabsTrigger 
                key={tab.id} 
                value={tab.id}
                className="text-sm font-medium"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            {renderTabContent()}
          </TabsContent>
        </Tabs>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center pt-6 border-t border-gray-200">
          <div className="flex space-x-4">
            {!isFirstTab && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={goToPreviousTab}
                className="flex items-center space-x-2"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Previous</span>
              </Button>
            )}
          </div>

          <div className="flex space-x-4">
            <Button type="button" variant="secondary" onClick={handleSave} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Progress'}
            </Button>
            
            {!isLastTab ? (
              <Button 
                type="button" 
                onClick={goToNextTab}
                className="flex items-center space-x-2"
              >
                <span>Next</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button type="button" onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit Follow-Up'}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
