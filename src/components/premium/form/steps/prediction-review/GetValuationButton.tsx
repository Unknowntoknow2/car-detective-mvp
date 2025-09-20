
import React from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface GetValuationButtonProps {
  onGetValuation: () => void;
  disabled?: boolean;
  isLoading?: boolean;
}

export function GetValuationButton({
  onGetValuation,
  disabled = false,
  isLoading = false
}: GetValuationButtonProps) {
  return (
    <Button
      onClick={onGetValuation}
      disabled={disabled || isLoading}
      className="w-full"
      size="lg"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Getting Valuation...
        </>
      ) : (
        "Get My Valuation"
      )}
    </Button>
  );
}
