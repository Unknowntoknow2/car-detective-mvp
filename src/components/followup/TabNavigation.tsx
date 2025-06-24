
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Save, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface TabNavigationProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  onSave: () => void;
  onSubmit: () => Promise<void>;
  isLastTab: boolean;
  isValid: boolean;
  isLoading: boolean;
  isSaving: boolean;
  tabs: string[];
}

export function TabNavigation({
  currentTab,
  onTabChange,
  onSave,
  onSubmit,
  isLastTab,
  isValid,
  isLoading,
  isSaving,
  tabs
}: TabNavigationProps) {
  const currentIndex = tabs.indexOf(currentTab);
  const canGoBack = currentIndex > 0;
  const canGoNext = currentIndex < tabs.length - 1 && isValid;

  const handleNext = () => {
    if (!isValid) {
      toast.error('Please complete all required fields before continuing.');
      return;
    }
    
    if (canGoNext) {
      onTabChange(tabs[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    if (canGoBack) {
      onTabChange(tabs[currentIndex - 1]);
    }
  };

  const handleSave = () => {
    onSave();
    toast.success('Progress saved successfully!');
  };

  const handleSubmit = async () => {
    if (!isValid) {
      toast.error('Please complete all required fields before submitting.');
      return;
    }
    
    try {
      await onSubmit();
    } catch (error) {
      toast.error('Failed to submit valuation. Please try again.');
    }
  };

  return (
    <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={!canGoBack || isLoading}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Previous
        </Button>
        
        <Button
          variant="outline"
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          {isSaving ? 'Saving...' : 'Save Progress'}
        </Button>
      </div>

      <div className="flex gap-3">
        {!isLastTab ? (
          <Button
            onClick={handleNext}
            disabled={!canGoNext || isLoading}
            className="flex items-center gap-2"
          >
            Next
            <ArrowRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={!isValid || isLoading}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="w-4 h-4" />
            {isLoading ? 'Submitting...' : 'Submit Valuation'}
          </Button>
        )}
      </div>
    </div>
  );
}
