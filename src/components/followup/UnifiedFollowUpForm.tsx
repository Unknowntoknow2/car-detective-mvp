
import React, { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { FollowUpAnswers } from '@/types/follow-up-answers';
import { FeaturesTab } from './tabs/FeaturesTab';
import { ModificationsTab } from './tabs/ModificationsTab';
import { PhysicalFeaturesTab } from './tabs/PhysicalFeaturesTab';
import { ServiceMaintenanceTab } from './tabs/ServiceMaintenanceTab';
import { TitleOwnershipTab } from './tabs/TitleOwnershipTab';
import { AccidentHistoryTab } from './tabs/AccidentHistoryTab';
import { BasicInfoTab } from './tabs/BasicInfoTab';

interface UnifiedFollowUpFormProps {
  vin: string;
  initialData?: FollowUpAnswers;
  onSubmit: (data: FollowUpAnswers) => void;
  onSave?: (data: FollowUpAnswers) => void;
}

type TabId = 'basic' | 'accidents' | 'features' | 'service' | 'title' | 'physical' | 'modifications';

export function UnifiedFollowUpForm({ vin, initialData, onSubmit, onSave }: UnifiedFollowUpFormProps) {
  const [formData, setFormData] = useState<FollowUpAnswers>(initialData || { vin });
  const [activeTab, setActiveTab] = useState<TabId>('basic');
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateFormData = useCallback(
    (updates: Partial<FollowUpAnswers>) => {
      setFormData(prev => ({ ...prev, ...updates }));
    },
    []
  );

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      onSubmit(formData);
      toast.success('Follow-up submitted successfully!');
    } catch (error) {
      toast.error('Failed to submit follow-up.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      onSave?.(formData);
      toast.success('Follow-up saved successfully!');
    } catch (error) {
      toast.error('Failed to save follow-up.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleModificationsChange = useCallback(
    (modified: boolean, types?: string[]) => {
      updateFormData({
        modifications: {
          modified,
          types: types || []
        }
      });
    },
    [updateFormData]
  );

  const tabs = [
    { id: 'basic', label: 'Basic Info', color: 'blue' },
    { id: 'accidents', label: 'Accident History', color: 'red' },
    { id: 'features', label: 'Features', color: 'purple' },
    { id: 'service', label: 'Service & Maintenance', color: 'orange' },
    { id: 'title', label: 'Title & Ownership', color: 'green' },
    { id: 'physical', label: 'Physical Features', color: 'indigo' },
    { id: 'modifications', label: 'Modifications', color: 'purple' }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'basic':
        return <BasicInfoTab formData={formData} onUpdate={updateFormData} />;
      case 'accidents':
        return <AccidentHistoryTab formData={formData} onUpdate={updateFormData} />;
      case 'features':
        return <FeaturesTab formData={formData} onUpdate={updateFormData} />;
      case 'service':
        return <ServiceMaintenanceTab formData={formData} updateFormData={updateFormData} />;
      case 'title':
        return <TitleOwnershipTab formData={formData} updateFormData={updateFormData} />;
      case 'physical':
        return <PhysicalFeaturesTab formData={formData} updateFormData={updateFormData} />;
      case 'modifications':
        return <ModificationsTab formData={formData} onModificationsChange={handleModificationsChange} />;
      default:
        return <BasicInfoTab formData={formData} onUpdate={updateFormData} />;
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value as TabId);
  };

  return (
    <Card className="w-full">
      <CardContent className="space-y-6">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
          <TabsList>
            {tabs.map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id} className="capitalize">
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {tabs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id} className="focus:outline-none">
              {renderTabContent()}
            </TabsContent>
          ))}
        </Tabs>

        <div className="flex justify-between">
          <Button type="button" variant="secondary" onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Progress'}
          </Button>
          <Button type="button" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Follow-Up'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
