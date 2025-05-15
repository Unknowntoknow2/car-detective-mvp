
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PremiumCheckoutButton } from "./PremiumCheckoutButton";
import { Check } from "lucide-react";

interface CheckoutSummaryProps {
  onCheckout: () => void;
  isLoading?: boolean;
}

export function CheckoutSummary({ onCheckout, isLoading = false }: CheckoutSummaryProps) {
  return (
    <Card className="border-amber-200 bg-amber-50">
      <CardHeader>
        <CardTitle className="text-amber-800">Premium Valuation</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 mb-4">
          <li className="flex items-start gap-2">
            <span className="bg-amber-200 text-amber-800 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Check className="h-3 w-3" />
            </span>
            <span>Full CARFAX® Vehicle History Report</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="bg-amber-200 text-amber-800 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Check className="h-3 w-3" />
            </span>
            <span>Detailed market analysis with similar vehicles</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="bg-amber-200 text-amber-800 rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Check className="h-3 w-3" />
            </span>
            <span>Connect with dealers for competitive offers</span>
          </li>
        </ul>
      </CardContent>
      <CardFooter>
        <PremiumCheckoutButton onClick={onCheckout} isLoading={isLoading} />
      </CardFooter>
    </Card>
  );
}
