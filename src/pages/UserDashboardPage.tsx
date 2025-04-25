
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { toast } from "sonner";
import { Loader2, FileBarChart, Download, ExternalLink } from 'lucide-react';
import { downloadPdf } from '@/utils/pdf';
import PremiumReportsList from '@/components/dashboard/PremiumReportsList';
import ValuationHistoryList from '@/components/dashboard/ValuationHistoryList';

export default function UserDashboardPage() {
  const [isPremiumUser, setIsPremiumUser] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

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
      } finally {
        setIsLoading(false);
      }
    };

    checkPremiumStatus();
  }, [user, navigate]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 container py-10 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container py-10">
        <div className="mx-auto max-w-6xl">
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">
                  View and manage your vehicle valuations
                </p>
              </div>
              {isPremiumUser ? (
                <Badge className="bg-primary text-white px-3 py-1 text-sm">
                  Premium User
                </Badge>
              ) : (
                <Button onClick={() => navigate('/premium')}>
                  Upgrade to Premium
                </Button>
              )}
            </div>

            <Tabs defaultValue="reports" className="space-y-4">
              <TabsList>
                <TabsTrigger value="reports">Premium Reports</TabsTrigger>
                <TabsTrigger value="history">Valuation History</TabsTrigger>
              </TabsList>
              <TabsContent value="reports" className="space-y-4">
                <PremiumReportsList />
              </TabsContent>
              <TabsContent value="history" className="space-y-4">
                <ValuationHistoryList />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
