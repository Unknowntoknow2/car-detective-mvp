
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Mail } from 'lucide-react';
import { Referral } from '@/contexts/ReferralContext';

interface ReferralHistoryListProps {
  referrals: Referral[];
  onSendReminder: (referralId: string) => void;
  isLoading: boolean;
}

export function ReferralHistoryList({ referrals, onSendReminder, isLoading }: ReferralHistoryListProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusBadge = (status: 'pending' | 'earned' | 'claimed') => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline">Pending</Badge>;
      case 'earned':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Reward Earned</Badge>;
      case 'claimed':
        return <Badge variant="secondary">Claimed</Badge>;
      default:
        return null;
    }
  };

  if (referrals.length === 0) {
    return (
      <div className="text-center py-10">
        <h3 className="text-lg font-medium">No referrals yet</h3>
        <p className="text-muted-foreground mt-2">
          When you invite friends, they'll appear here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left font-medium py-2">Invited</th>
              <th className="text-left font-medium py-2">Date</th>
              <th className="text-left font-medium py-2">Status</th>
              <th className="text-left font-medium py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {referrals.map(referral => (
              <tr key={referral.id} className="border-b">
                <td className="py-3">
                  {referral.referred_email || "Email not provided"}
                </td>
                <td className="py-3">
                  {formatDate(referral.created_at)}
                </td>
                <td className="py-3">
                  {getStatusBadge(referral.reward_status)}
                </td>
                <td className="py-3">
                  {referral.reward_status === 'pending' && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() => onSendReminder(referral.id)}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Mail className="h-3 w-3" />
                      )}
                      Remind
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
