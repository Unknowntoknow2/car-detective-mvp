
import { Loader2 } from 'lucide-react';
import { useValuationHistory } from "@/hooks/useValuationHistory";
import { EmptyState } from "./valuation-history/EmptyState";
import { ValuationTable } from "./valuation-history/ValuationTable";

export default function ValuationHistoryList() {
  const { valuations, isLoading } = useValuationHistory();

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (valuations.length === 0) {
    return <EmptyState />;
  }

  return <ValuationTable valuations={valuations} />;
}
