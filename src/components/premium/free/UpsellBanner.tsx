
import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

interface UpsellBannerProps {
  onUpgrade: () => void;
  title?: string;
  description?: string;
  buttonText?: string;
}

const UpsellBanner: React.FC<UpsellBannerProps> = ({
  onUpgrade,
  title = "Unlock Premium Features",
  description = "Get access to advanced insights and detailed reports with our premium plan.",
  buttonText = "Upgrade Now"
}) => {
  return (
    <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-200 dark:border-blue-900 rounded-lg p-6 my-4">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-500" />
            {title}
          </h3>
          <p className="text-muted-foreground mt-2">
            {description}
          </p>
        </div>
        <Button 
          onClick={onUpgrade}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );
};

export default UpsellBanner;
