
import React from 'react';
import { Referral } from '@/types/referral';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ReferralHistoryListProps {
  referrals: Referral[];
}

export function ReferralHistoryList({ referrals }: ReferralHistoryListProps) {
  return (
    <div className="space-y-4">
      <CardHeader>
        <CardTitle>Referral History</CardTitle>
      </CardHeader>
      <CardContent>
        {referrals.length === 0 ? (
          <p className="text-muted-foreground">No referrals yet.</p>
        ) : (
          <div className="space-y-3">
            {referrals.map((referral) => (
              <Card key={referral.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">
                      {referral.referred_email || 'Email not provided'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Referred on {new Date(referral.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge 
                    variant={
                      referral.reward_status === 'claimed' 
                        ? 'default' 
                        : referral.reward_status === 'earned'
                        ? 'secondary'
                        : 'outline'
                    }
                  >
                    {referral.reward_status}
                  </Badge>
                </div>
                {referral.reward_amount && (
                  <p className="text-sm text-green-600 mt-2">
                    Reward: ${referral.reward_amount}
                  </p>
                )}
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </div>
  );
}
