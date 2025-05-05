
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { toast } from "sonner";
import { Loader2, Users, Gift, Award, Mail } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useReferrals } from '@/contexts/ReferralContext';
import { ReferralModal } from '@/components/referrals/ReferralModal';
import { ReferralHistoryList } from '@/components/referrals/ReferralHistoryList';
import { ReferralStatusCard } from '@/components/referrals/ReferralStatusCard';
import { supabase } from '@/integrations/supabase/client';

export default function ReferralDashboardPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();
  const { myReferrals, referralStats, loading: referralsLoading, claimReward } = useReferrals();
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  const handleSendReminder = async (referralId: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.functions.invoke('send-referral-email', {
        body: {
          type: 'reminder',
          referralId
        }
      });
      
      if (error) throw error;
      toast.success('Reminder sent successfully');
    } catch (error) {
      console.error('Error sending reminder:', error);
      toast.error('Failed to send reminder');
    } finally {
      setIsLoading(false);
    }
  };

  if (referralsLoading || !user) {
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
                <h1 className="text-3xl font-bold tracking-tight">Referral Program</h1>
                <p className="text-muted-foreground">
                  Invite friends and earn rewards when they use Car Detective
                </p>
              </div>
              <Button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2"
              >
                <Mail className="h-4 w-4" />
                Invite Friends
              </Button>
            </div>

            {/* Referral Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ReferralStatusCard
                title="Total Invites"
                value={referralStats?.total_referrals || 0}
                icon={<Users className="h-6 w-6" />}
              />
              <ReferralStatusCard
                title="Available Rewards"
                value={referralStats?.earned_rewards || 0}
                icon={<Gift className="h-6 w-6" />}
              />
              <ReferralStatusCard
                title="Claimed Rewards"
                value={referralStats?.claimed_rewards || 0}
                icon={<Award className="h-6 w-6" />}
                maxValue={5}
                showProgress
              />
            </div>

            {/* Main Content */}
            <Tabs defaultValue="referrals" className="space-y-4">
              <TabsList>
                <TabsTrigger value="referrals">My Referrals</TabsTrigger>
                <TabsTrigger value="rewards">Available Rewards</TabsTrigger>
              </TabsList>
              
              <TabsContent value="referrals" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>My Referrals</CardTitle>
                    <CardDescription>
                      Track the status of friends you've invited to Car Detective
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ReferralHistoryList
                      referrals={myReferrals}
                      onSendReminder={handleSendReminder}
                      isLoading={isLoading}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="rewards" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Available Rewards</CardTitle>
                    <CardDescription>
                      Rewards earned from your referrals that are ready to claim
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {myReferrals.filter(r => r.reward_status === 'earned').length > 0 ? (
                      <div className="space-y-4">
                        {myReferrals
                          .filter(r => r.reward_status === 'earned')
                          .map(referral => (
                            <div key={referral.id} className="flex items-center justify-between p-4 border rounded-lg">
                              <div>
                                <h3 className="font-medium">Reward: ${referral.reward_amount}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {referral.reward_type === 'valuation'
                                    ? 'Friend completed valuation'
                                    : 'Friend purchased premium'}
                                </p>
                              </div>
                              <Button
                                onClick={() => claimReward(referral.id)}
                                disabled={isLoading}
                              >
                                {isLoading ? (
                                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                ) : (
                                  <Gift className="h-4 w-4 mr-2" />
                                )}
                                Claim Reward
                              </Button>
                            </div>
                          ))
                        }
                      </div>
                    ) : (
                      <div className="text-center py-10">
                        <Gift className="h-16 w-16 mx-auto text-muted-foreground/60" />
                        <h3 className="mt-4 text-lg font-medium">No rewards available yet</h3>
                        <p className="text-muted-foreground mt-2">
                          Invite friends to earn rewards when they use Car Detective
                        </p>
                        <Button
                          onClick={() => setIsModalOpen(true)}
                          className="mt-4"
                        >
                          Invite Friends
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
      
      {/* Referral Modal */}
      <ReferralModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
