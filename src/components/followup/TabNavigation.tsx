
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Save, CheckCircle, SkipForward } from 'lucide-react';
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
  const canGoNext = currentIndex < tabs.length - 1;

  const handleNext = () => {
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
    toast.success('Your progress has been saved!');
  };

  const handleSubmit = async () => {
    try {
      await onSubmit();
    } catch (error) {
      toast.error('Unable to complete valuation. Please check your internet connection and try again.');
    }
  };

  const handleSkipToEnd = () => {
    onTabChange(tabs[tabs.length - 1]);
    toast.info('Skipped to final section. You can always come back to fill in more details.');
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

        {/* Skip to End Option for faster completion */}
        {!isLastTab && currentIndex < tabs.length - 2 && (
          <Button
            variant="ghost"
            onClick={handleSkipToEnd}
            disabled={isLoading}
            className="flex items-center gap-2 text-gray-600"
          >
            <SkipForward className="w-4 h-4" />
            Skip to Finish
          </Button>
        )}
      </div>

      <div className="flex gap-3 items-center">
        {/* Show helpful completion message */}
        {!isLastTab && (
          <span className="text-sm text-gray-500">
            {Math.round(((currentIndex + 1) / tabs.length) * 100)}% complete
          </span>
        )}
        
        {!isLastTab ? (
          <Button
            onClick={handleNext}
            disabled={!canGoNext || isLoading}
            className="flex items-center gap-2"
          >
            Continue
            <ArrowRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="w-4 h-4" />
            {isLoading ? 'Completing Valuation...' : 'Complete Valuation'}
          </Button>
        )}
      </div>
    </div>
  );
}
