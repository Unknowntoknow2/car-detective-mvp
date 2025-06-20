
import React from "react";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";

interface PremiumFeatureLockProps {
  onUpgrade: () => void;
  feature?: string;
  ctaText?: string;
}

export const PremiumFeatureLock: React.FC<PremiumFeatureLockProps> = ({
  onUpgrade,
  feature = "market trends and forecasting",
  ctaText = "Unlock Premium Report",
}) => {
  return (
    <div className="p-6 border rounded-lg bg-muted/20 text-center">
      <div className="flex justify-center mb-4">
        <div className="bg-amber-100 p-3 rounded-full">
          <Lock className="h-8 w-8 text-amber-500" />
        </div>
      </div>

      <h3 className="text-lg font-semibold mb-2">Premium Feature</h3>

      <p className="text-muted-foreground mb-6">
        Access to {feature} requires a premium subscription. Unlock now for full access.
      </p>

      <Button
        onClick={onUpgrade}
        className="w-full sm:w-auto"
      >
        {ctaText}
      </Button>
    </div>
  );
};

export const PremiumLockSection = PremiumFeatureLock;
