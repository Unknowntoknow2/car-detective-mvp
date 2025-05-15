
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { toast } from "sonner";
import { Loader2, Car, CarFront, FileBarChart } from 'lucide-react';
import { ValuationCard } from "@/components/dashboard/ValuationCard";
import { useSavedValuations } from "@/hooks/useSavedValuations";
import { useValuationHistory } from "@/hooks/useValuationHistory";
import { AnimatedCard } from "@/components/ui/animated-card";
import { DownloadPDFButton } from "@/components/ui/DownloadPDFButton";

interface ValuationData {
  id: string;
  make: string;
  model: string;
  year: number;
  estimated_value?: number;
  confidence_score?: number;
  condition_score?: number;
  premium_unlocked?: boolean;
  created_at: string;
  [key: string]: any;
}

export default function UserDashboard() {
  const [isPremiumUser, setIsPremiumUser] = useState<boolean>(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { valuations: savedValuations, isLoading: isSavedLoading, error: savedError, refreshValuations } = useSavedValuations();
  const { valuations: historyValuations, isLoading: isHistoryLoading, isEmpty } = useValuationHistory();

  // Check if user is premium
  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    const checkPremiumStatus = async () => {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'completed')
          .limit(1);

        if (error) throw error;
        setIsPremiumUser(data && data.length > 0);
      } catch (error: any) {
        console.error('Error checking premium status:', error.message);
      }
    };

    checkPremiumStatus();
  }, [user, navigate]);

  if (isSavedLoading || isHistoryLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 container py-10 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
            <h2 className="text-xl font-semibold">Loading your dashboard</h2>
            <p className="text-muted-foreground">Please wait while we fetch your valuations...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Handle the case where we have no valuations to display
  const hasNoValuations = (!savedValuations || savedValuations.length === 0) && 
                          (!historyValuations || historyValuations.length === 0);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container py-10">
        <div className="mx-auto max-w-6xl">
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">My Dashboard</h1>
                <p className="text-muted-foreground">
                  Manage your vehicle valuations and reports
                </p>
              </div>
              {isPremiumUser ? (
                <Badge className="bg-amber-100 text-amber-800 px-3 py-1 text-sm border-amber-300">
                  Premium User
                </Badge>
              ) : (
                <Button onClick={() => navigate('/premium')}>
                  Upgrade to Premium
                </Button>
              )}
            </div>

            {hasNoValuations ? (
              <EmptyDashboardState />
            ) : (
              <Tabs defaultValue="history" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="history">Recent Valuations</TabsTrigger>
                  <TabsTrigger value="saved">Saved Valuations</TabsTrigger>
                  <TabsTrigger value="premium">Premium Reports</TabsTrigger>
                </TabsList>
                
                <TabsContent value="history" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {historyValuations && historyValuations.length > 0 ? (
                      historyValuations.map((valuation, index) => (
                        <ValuationCard
                          key={valuation.id}
                          id={valuation.id}
                          make={valuation.make || "Unknown"}
                          model={valuation.model || "Vehicle"}
                          year={valuation.year || new Date().getFullYear()}
                          estimatedValue={valuation.estimated_value || 0}
                          confidenceScore={valuation.confidence_score}
                          condition={getConditionLabel(valuation.condition_score)}
                          isPremium={!!valuation.premium_unlocked}
                          created_at={valuation.created_at}
                          index={index}
                        />
                      ))
                    ) : (
                      <div className="col-span-full py-12 text-center">
                        <p className="text-muted-foreground">No valuation history found.</p>
                        <Button 
                          variant="outline" 
                          className="mt-4"
                          onClick={() => navigate('/valuation')}
                        >
                          Get Your First Valuation
                        </Button>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="saved" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {savedValuations && savedValuations.length > 0 ? (
                      savedValuations.map((valuation, index) => (
                        <ValuationCard
                          key={valuation.id}
                          id={valuation.id}
                          make={valuation.make || "Unknown"}
                          model={valuation.model || "Vehicle"}
                          year={valuation.year || new Date().getFullYear()}
                          estimatedValue={valuation.valuationDetails.estimatedValue || 0}
                          confidenceScore={valuation.confidence_score}
                          isPremium={false}
                          created_at={valuation.created_at}
                          index={index}
                        />
                      ))
                    ) : (
                      <div className="col-span-full py-12 text-center">
                        <p className="text-muted-foreground">No saved valuations yet.</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          When you save valuations, they'll appear here.
                        </p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="premium" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {historyValuations && historyValuations.filter(v => v.premium_unlocked).length > 0 ? (
                      historyValuations
                        .filter(v => v.premium_unlocked)
                        .map((valuation, index) => (
                          <PremiumReportCard
                            key={valuation.id}
                            valuation={valuation}
                            index={index}
                          />
                        ))
                    ) : (
                      <div className="col-span-full">
                        <PremiumEmptyState />
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

// Helper components
function EmptyDashboardState() {
  const navigate = useNavigate();
  
  return (
    <Card className="border-dashed">
      <CardContent className="py-12">
        <div className="text-center space-y-5">
          <div className="flex justify-center">
            <div className="rounded-full bg-primary/10 p-4">
              <CarFront className="h-12 w-12 text-primary" />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-semibold">No Valuations Yet</h3>
            <p className="text-muted-foreground mx-auto max-w-md">
              Start by getting a valuation for your vehicle. You'll be able to track its value and get insights over time.
            </p>
          </div>
          <Button size="lg" onClick={() => navigate('/valuation')}>
            Get Your First Valuation
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function PremiumEmptyState() {
  const navigate = useNavigate();
  
  return (
    <AnimatedCard
      animate={true}
      delay={0.2}
      className="border-dashed bg-gradient-to-b from-amber-50 to-white"
    >
      <CardContent className="py-12">
        <div className="text-center space-y-5">
          <div className="flex justify-center">
            <div className="rounded-full bg-amber-100 p-4">
              <FileBarChart className="h-12 w-12 text-amber-600" />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-semibold">No Premium Reports</h3>
            <p className="text-muted-foreground mx-auto max-w-md">
              Unlock premium reports for comprehensive details, market analysis, and downloadable PDF reports.
            </p>
          </div>
          <Button 
            size="lg" 
            onClick={() => navigate('/premium')}
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
          >
            Upgrade to Premium
          </Button>
        </div>
      </CardContent>
    </AnimatedCard>
  );
}

interface PremiumReportCardProps {
  valuation: ValuationData;
  index: number;
}

function PremiumReportCard({ valuation, index }: PremiumReportCardProps) {
  return (
    <AnimatedCard
      animate={true}
      hoverEffect="lift"
      delay={index * 0.1}
      className="border-amber-200 bg-gradient-to-b from-amber-50 to-white"
    >
      <CardHeader className="p-4 space-y-0">
        <div className="flex justify-between items-start">
          <div>
            <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
              Premium Report
            </Badge>
            <CardTitle className="text-xl mt-2">
              {valuation.year} {valuation.make} {valuation.model}
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 pt-0 space-y-4">
        <div>
          <p className="text-3xl font-bold text-primary">
            ${valuation.estimated_value?.toLocaleString() || "N/A"}
          </p>
          <p className="text-sm text-muted-foreground">Valuation Price</p>
        </div>
        
        <div className="flex gap-2">
          <DownloadPDFButton
            valuationId={valuation.id}
            className="w-full"
          />
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => window.location.href = `/valuation/${valuation.id}`}
          >
            View Details
          </Button>
        </div>
      </CardContent>
    </AnimatedCard>
  );
}

// Helper function to get condition label from score
function getConditionLabel(score?: number): string {
  if (!score) return "Unknown";
  
  if (score >= 90) return "Excellent";
  if (score >= 80) return "Very Good";
  if (score >= 70) return "Good";
  if (score >= 60) return "Fair";
  if (score >= 50) return "Poor";
  return "Unknown";
}
