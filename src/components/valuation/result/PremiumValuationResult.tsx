// ✅ FILE: src/components/valuation/result/PremiumValuationResult.tsx

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import EnhancedValuationResult from "./EnhancedValuationResult";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useUser } from "@/hooks/useUser"; // Assumes you have auth context

import AINSummary from "@/components/valuation/premium/AINSummary";
import AuctionSummary from "@/components/valuation/premium/AuctionSummary";
import DealerOffers from "@/components/valuation/premium/DealerOffers";
import PDFDownloadSection from "@/components/valuation/premium/PDFDownloadSection";
import EmailReportSection from "@/components/valuation/premium/EmailReportSection";

interface PremiumValuationData {
  id: string;
  user_id: string;
  make: string;
  model: string;
  year: number;
  trim?: string;
  mileage?: number;
  condition: string;
  confidence_score: number;
  estimated_value: number;
  price_range?: [number, number];
  adjustments?: { factor: string; impact: number; description?: string }[];
  ai_summary?: string;
  auction_data?: any[];
  dealer_offers?: any[];
}

export default function PremiumValuationResult() {
  const { id } = useParams<{ id: string }>();
  const { user } = useUser(); // Current logged-in user
  const [data, setData] = useState<PremiumValuationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchValuation = async () => {
      if (!id) return;
      setLoading(true);

      const { data, error } = await supabase
        .from("premium_valuations") // or 'valuations' if joined view
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        console.error("Premium valuation fetch failed", error);
        setError("Unable to load premium valuation.");
        return;
      }

      if (data.user_id !== user?.id) {
        setError("You are not authorized to view this report.");
        return;
      }

      setData(data);
      setLoading(false);
    };

    fetchValuation();
  }, [id, user?.id]);

  if (loading) return <div className="p-4">Loading premium report...</div>;

  if (error) {
    return (
      <Alert variant="destructive" className="mt-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!data) return null;

  const vehicleInfo = {
    year: data.year,
    make: data.make,
    model: data.model,
    trim: data.trim,
    mileage: data.mileage,
    condition: data.condition,
  };

  return (
    <div className="space-y-8 mt-6">
      <h2 className="text-2xl font-bold">Your Premium Valuation</h2>

      <EnhancedValuationResult
        valuationId={data.id}
        vehicleInfo={vehicleInfo}
        estimatedValue={data.estimated_value}
        confidenceScore={data.confidence_score}
        priceRange={data.price_range}
        adjustments={data.adjustments || []}
      />

      {/* Premium Add-Ons */}
      <AINSummary summary={data.ai_summary} />
      <AuctionSummary data={data.auction_data} />
      <DealerOffers offers={data.dealer_offers} />
      <div className="flex gap-4">
        <PDFDownloadSection valuationId={data.id} />
        <EmailReportSection valuationId={data.id} />
      </div>
    </div>
  );
}
