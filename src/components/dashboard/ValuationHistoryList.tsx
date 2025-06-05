
import { Loader2 } from "lucide-react";
import { useValuationHistory } from "@/hooks/useValuationHistory";
import { EmptyState } from "./valuation-history/EmptyState";
import { ValuationTable } from "./valuation-history/ValuationTable";

export default function ValuationHistoryList() {
  const { data: valuations, isLoading, error } = useValuationHistory();

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Failed to load valuation history</p>
      </div>
    );
  }

  if (!valuations || valuations.length === 0) {
    return <EmptyState />;
  }

  return <ValuationTable valuations={valuations} />;
}
