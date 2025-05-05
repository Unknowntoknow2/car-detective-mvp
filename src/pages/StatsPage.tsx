
import React, { useEffect, useState } from 'react';
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Car, ChartBar, Share2, Award, TrendingUp, MapPin } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { StatsCard } from '@/components/stats/StatsCard';
import { LeaderboardRow } from '@/components/stats/LeaderboardRow';
import { SectionHeader } from '@/components/ui/design-system';
import { Helmet } from 'react-helmet-async';

interface ValuationStats {
  id: string;
  make: string;
  model: string;
  zip_code: string;
  total_valuations: number;
  average_price: number;
}

interface TopReferrer {
  id: string;
  username: string;
  referral_count: number;
  reward_count: number;
}

export default function StatsPage() {
  const [loading, setLoading] = useState(true);
  const [valuationStats, setValuationStats] = useState<ValuationStats[]>([]);
  const [topReferrers, setTopReferrers] = useState<TopReferrer[]>([]);
  const [platformStats, setPlatformStats] = useState({
    totalValuations: 0,
    totalPremiumReports: 0,
    avgValuation: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        // Fetch valuation stats
        const { data: statsData, error: statsError } = await supabase
          .from('valuation_stats')
          .select('*')
          .order('total_valuations', { ascending: false })
          .limit(20);
          
        if (statsError) throw statsError;
        setValuationStats(statsData || []);
        
        // Fetch top referrers
        const { data: referrersData, error: referrersError } = await supabase
          .from('top_referrers')
          .select('*')
          .order('referral_count', { ascending: false })
          .limit(10);
          
        if (referrersError) throw referrersError;
        setTopReferrers(referrersData || []);
        
        // Calculate platform-wide stats
        if (statsData && statsData.length > 0) {
          const totalVals = statsData.reduce((sum, stat) => sum + stat.total_valuations, 0);
          const totalValue = statsData.reduce((sum, stat) => sum + (stat.average_price * stat.total_valuations), 0);
          const avgVal = totalVals > 0 ? totalValue / totalVals : 0;
          
          setPlatformStats({
            totalValuations: totalVals,
            totalPremiumReports: Math.floor(totalVals * 0.15), // Estimated from total
            avgValuation: avgVal
          });
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);
  
  const handleShareClick = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Car Detective - Live Car Pricing Trends',
        text: 'Check out these real-time car value trends and pricing insights!',
        url: window.location.href,
      });
    } else {
      // Copy to clipboard as fallback
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Helmet>
        <title>Live Car Pricing Trends – Car Detective</title>
        <meta name="description" content="See real-time car value trends, most valued models, and top ZIP codes for automotive valuations." />
        <meta property="og:title" content="Live Car Pricing Trends – Car Detective" />
        <meta property="og:description" content="Access real-time car value trends, most valued models, pricing data, and top markets." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://car-detective.app/stats" />
      </Helmet>
      
      <Navbar />
      
      <main className="flex-1">
        <div className="container px-4 py-8 md:py-12">
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <SectionHeader
              title="Live Car Valuation Trends"
              description="Real-time insights from our vehicle valuation platform"
              badge="Live Data"
              size="lg"
            />
            
            <Button
              onClick={handleShareClick}
              variant="outline"
              className="self-start"
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share Insights
            </Button>
          </div>
          
          {/* Platform Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <StatsCard
              title="Vehicles Valued"
              value={platformStats.totalValuations}
              icon={<Car className="h-5 w-5" />}
              trend={{ value: 12, isPositive: true, label: "vs. last month" }}
            />
            <StatsCard
              title="Average Valuation"
              value={platformStats.avgValuation}
              formatter={formatCurrency}
              icon={<ChartBar className="h-5 w-5" />}
              trend={{ value: 3.5, isPositive: true, label: "vs. last month" }}
            />
            <StatsCard
              title="Premium Reports"
              value={platformStats.totalPremiumReports}
              icon={<Award className="h-5 w-5" />}
              trend={{ value: 18, isPositive: true, label: "vs. last month" }}
            />
          </div>
          
          {/* Tabs for Different Metrics */}
          <Tabs defaultValue="models" className="space-y-6">
            <TabsList className="w-full md:w-auto">
              <TabsTrigger value="models">Top Models</TabsTrigger>
              <TabsTrigger value="locations">Top Locations</TabsTrigger>
              <TabsTrigger value="referrers">Top Referrers</TabsTrigger>
            </TabsList>
            
            <TabsContent value="models" className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center">
                    Most Valued Vehicle Models
                    <Badge variant="outline" className="ml-2">Market Trends</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-10">Loading valuation data...</div>
                  ) : (
                    <div className="space-y-2">
                      {valuationStats
                        .filter(stat => stat.make && stat.model)
                        .slice(0, 10)
                        .map((stat, index) => (
                          <LeaderboardRow
                            key={stat.id}
                            rank={index + 1}
                            title={`${stat.make} ${stat.model}`}
                            subtitle={`${stat.total_valuations} valuations`}
                            value={formatCurrency(stat.average_price)}
                            highlight={index === 0}
                          />
                        ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="mt-6">
                <Card className="bg-muted/50">
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row items-center gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium">Get Your Own Car Valuation</h3>
                        <p className="text-muted-foreground mt-1">Find out exactly what your car is worth with our precise valuation tool.</p>
                      </div>
                      <Button className="w-full md:w-auto" size="lg">
                        <Car className="mr-2 h-4 w-4" />
                        Value My Car
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="locations" className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center">
                    Top Locations by Value
                    <Badge variant="outline" className="ml-2">Geographic Insights</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-10">Loading location data...</div>
                  ) : (
                    <div className="space-y-2">
                      {valuationStats
                        .filter(stat => stat.zip_code)
                        .reduce((acc, stat) => {
                          // Group by zip code and calculate average
                          const existing = acc.find(s => s.zip_code === stat.zip_code);
                          if (existing) {
                            existing.total_valuations += stat.total_valuations;
                            existing.total_price += stat.average_price * stat.total_valuations;
                          } else {
                            acc.push({
                              ...stat,
                              total_price: stat.average_price * stat.total_valuations
                            });
                          }
                          return acc;
                        }, [] as any[])
                        .map(stat => ({
                          ...stat,
                          average_price: stat.total_price / stat.total_valuations
                        }))
                        .sort((a, b) => b.average_price - a.average_price)
                        .slice(0, 10)
                        .map((stat, index) => (
                          <LeaderboardRow
                            key={stat.id}
                            rank={index + 1}
                            title={stat.zip_code}
                            subtitle={`${stat.total_valuations} valuations`}
                            value={formatCurrency(stat.average_price)}
                            highlight={index === 0}
                          />
                        ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="referrers" className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center">
                    Top Community Contributors
                    <Badge variant="outline" className="ml-2">Hall of Fame</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-10">Loading referrer data...</div>
                  ) : topReferrers.length > 0 ? (
                    <div className="space-y-2">
                      {topReferrers.map((referrer, index) => (
                        <LeaderboardRow
                          key={referrer.id}
                          rank={index + 1}
                          title={referrer.username}
                          subtitle={`${referrer.reward_count} rewards claimed`}
                          value={referrer.referral_count}
                          highlight={index === 0}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <MapPin className="h-12 w-12 mx-auto text-muted-foreground/60" />
                      <h3 className="mt-4 text-lg font-medium">No referrers yet</h3>
                      <p className="text-muted-foreground mt-2">
                        Be the first to invite friends and appear on our leaderboard
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="mt-12">
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold">Upgrade to Premium Valuation</h3>
                    <p className="mt-2">
                      Get detailed market analysis, forecasting, and dealer pricing not available in the free version.
                    </p>
                    <div className="flex flex-wrap gap-2 mt-4">
                      <Badge variant="outline" className="bg-background">CARFAX® Integration</Badge>
                      <Badge variant="outline" className="bg-background">Price Forecasting</Badge>
                      <Badge variant="outline" className="bg-background">Dealer Network</Badge>
                    </div>
                  </div>
                  <Button className="w-full md:w-auto" size="lg">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Try Premium
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
