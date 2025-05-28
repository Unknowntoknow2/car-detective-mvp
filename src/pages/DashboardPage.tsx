
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FileBarChart, Car, CreditCard, Loader2 } from 'lucide-react';
import ValuationHistoryList from '@/components/dashboard/ValuationHistoryList';
import PremiumReportsList from '@/components/dashboard/PremiumReportsList';
import { usePremiumCredits } from '@/hooks/usePremiumCredits';

export default function DashboardPage() {
  const { user, userDetails, isLoading: isAuthLoading } = useAuth();
  const { credits, isLoading: isCreditsLoading } = usePremiumCredits();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isAuthLoading && !user) {
      navigate('/auth');
    }
  }, [isAuthLoading, user, navigate]);

  if (isAuthLoading) {
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

  // Extract initials for avatar
  const getInitials = () => {
    if (!user) return '?';
    
    const name = userDetails?.full_name || user.email || '';
    return name.split(' ')
      .map((part: string) => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container py-10">
        <div className="mx-auto max-w-6xl">
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14 border-2 border-muted">
                  <AvatarImage src={userDetails?.avatar_url || ''} />
                  <AvatarFallback>{getInitials()}</AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">
                    Welcome, {userDetails?.full_name || 'User'}
                  </h1>
                  <p className="text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {!isCreditsLoading && credits > 0 && (
                  <Badge className="bg-primary text-white px-3 py-1 text-sm">
                    {credits} Premium Credit{credits !== 1 ? 's' : ''}
                  </Badge>
                )}
                {userDetails?.role === 'dealer' && (
                  <Badge variant="outline" className="px-3 py-1 text-sm">
                    Dealer Account
                  </Badge>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">New Valuation</CardTitle>
                  <CardDescription>Get a value for your vehicle</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    className="w-full"
                    onClick={() => navigate('/valuation')}
                  >
                    <Car className="mr-2 h-4 w-4" />
                    Start Valuation
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Premium Reports</CardTitle>
                  <CardDescription>
                    {credits > 0
                      ? `You have ${credits} premium credit${credits !== 1 ? 's' : ''}`
                      : 'Get detailed market analysis'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    className="w-full"
                    variant={credits > 0 ? "default" : "outline"}
                    onClick={() => navigate('/pricing')}
                  >
                    <FileBarChart className="mr-2 h-4 w-4" />
                    {credits > 0 ? 'Use Credits' : 'Buy Credits'}
                  </Button>
                </CardContent>
              </Card>

              {userDetails?.role === 'dealer' ? (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Dealer Dashboard</CardTitle>
                    <CardDescription>Access dealer tools</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      className="w-full"
                      variant="outline"
                      onClick={() => navigate('/dealer/dashboard')}
                    >
                      <CreditCard className="mr-2 h-4 w-4" />
                      Go to Dealer Tools
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Buy Credits</CardTitle>
                    <CardDescription>Save with credit bundles</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      className="w-full"
                      variant="outline"
                      onClick={() => navigate('/pricing')}
                    >
                      <CreditCard className="mr-2 h-4 w-4" />
                      View Pricing
                    </Button>
                  </CardContent>
                </Card>
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
