
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface PremiumCheckoutButtonProps {
  onClick: () => void;
  isLoading?: boolean;
}

export function PremiumCheckoutButton({ onClick, isLoading = false }: PremiumCheckoutButtonProps) {
  return (
    <Button 
      className="w-full bg-amber-600 hover:bg-amber-700 text-white"
      onClick={onClick}
      disabled={isLoading}
    >
      {isLoading ? 'Processing...' : (
        <>
          Get Premium Valuation <ArrowRight className="ml-2 h-4 w-4" />
        </>
      )}
    </Button>
  );
}
