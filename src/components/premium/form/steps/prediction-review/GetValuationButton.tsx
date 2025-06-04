<<<<<<< HEAD

import React from 'react';
import { LoadingButton } from '@/components/ui/loading-button';
import { TrendingUp } from 'lucide-react';
=======
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2, TrendingUp } from "lucide-react";
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

interface GetValuationButtonProps {
  onClick: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  isPremium?: boolean;
}

export function GetValuationButton({
  onClick,
  disabled = false,
  isLoading = false,
  isPremium = true,
}: GetValuationButtonProps) {
  return (
    <LoadingButton
      onClick={onClick}
      disabled={disabled}
      isLoading={isLoading}
      loadingText="Processing..."
      variant={isPremium ? "default" : "default"}
      className="flex items-center gap-2"
    >
<<<<<<< HEAD
      <TrendingUp className="h-4 w-4" />
      {isPremium ? "Get Premium Valuation" : "Get Free Valuation"}
    </LoadingButton>
=======
      {isLoading
        ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Processing...
          </>
        )
        : (
          <>
            <TrendingUp className="h-4 w-4" />
            {isPremium ? "Get Premium Valuation" : "Get Free Valuation"}
          </>
        )}
    </Button>
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
  );
}
