import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import UnifiedValuationResult from "@/components/valuation/UnifiedValuationResult";
import FollowUpForm from "@/components/followup/FollowUpForm";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { ValuationResult as ValuationData } from "@/types/valuation";
import { AuctionHistorySection } from "@/components/valuation/AuctionHistorySection";

export default function ValuationResultPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const id = searchParams.get("id");
  const vin = searchParams.get("vin");

  const [valuationData, setValuationData] = useState<ValuationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFollowUpSubmitted, setShowFollowUpSubmitted] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id && !vin) throw new Error("No valuation ID or VIN provided");

        const key = id ? `valuation_${id}` : `vin_lookup_${vin}`;
        const cached = localStorage.getItem(key);
        if (cached) {
          setValuationData(JSON.parse(cached));
        } else {
          throw new Error("Valuation data not found");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch valuation data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id, vin]);

  if (isLoading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (error || !valuationData) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md mx-auto text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-4">Vehicle Not Found</h1>
            <p className="text-gray-600 mb-6">
              {error || "Could not find the requested vehicle data."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => navigate("/")}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Return Home
              </Button>
              <Button variant="outline" onClick={() => navigate("/valuation")}>
                Start New Valuation
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Vehicle Valuation Result</CardTitle>
            </CardHeader>
            <CardContent>
              <UnifiedValuationResult
                valuationId={id || vin || ""}
                data={valuationData}
                isPremium={valuationData?.isPremium || false}
              />

              {valuationData.vin && (
                <AuctionHistorySection vin={valuationData.vin} />
              )}
            </CardContent>
          </Card>

          {!showFollowUpSubmitted ? (
            <Card>
              <CardHeader>
                <CardTitle>Refine Your Valuation Details</CardTitle>
              </CardHeader>
              <CardContent>
                <FollowUpForm
                  onSubmit={(data) => {
                    console.log("Follow-up answers:", data);
                    setShowFollowUpSubmitted(true);
                  }}
                />
              </CardContent>
            </Card>
          ) : (
            <div className="text-center text-green-600 text-lg font-medium mt-6">
              ✅ Thank you! Your additional details have been saved.
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
