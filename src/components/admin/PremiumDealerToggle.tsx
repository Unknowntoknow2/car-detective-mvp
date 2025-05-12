
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface PremiumDealerToggleProps {
  dealerId: string;
  isCurrentlyPremium: boolean;
  dealerName: string;
  expiresAt?: string | null;
  onStatusChange?: () => void;
}

export function PremiumDealerToggle({
  dealerId,
  isCurrentlyPremium,
  dealerName,
  expiresAt,
  onStatusChange
}: PremiumDealerToggleProps) {
  const [isPremium, setIsPremium] = useState(isCurrentlyPremium);
  const [loading, setLoading] = useState(false);
  const [expirationDate, setExpirationDate] = useState<string>(
    expiresAt 
      ? new Date(expiresAt).toISOString().split('T')[0] 
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );

  const handleToggle = async (enabled: boolean) => {
    setLoading(true);
    try {
      // Format the expiration date if provided
      let premiumExpiresAt = null;
      if (enabled && expirationDate) {
        premiumExpiresAt = new Date(expirationDate).toISOString();
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          is_premium_dealer: enabled,
          premium_expires_at: enabled ? premiumExpiresAt : null
        })
        .eq('id', dealerId);

      if (error) throw error;

      setIsPremium(enabled);
      toast.success(
        enabled 
          ? `${dealerName} upgraded to premium dealer status` 
          : `${dealerName} downgraded to standard dealer status`
      );
      
      if (onStatusChange) {
        onStatusChange();
      }
    } catch (error) {
      console.error('Error updating premium status:', error);
      toast.error('Failed to update premium dealer status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Premium Dealer Status</CardTitle>
        <CardDescription>
          Toggle premium access for {dealerName}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="premium-toggle" className="font-medium">
            Premium Dealer Status
          </Label>
          <Switch
            id="premium-toggle"
            checked={isPremium}
            onCheckedChange={handleToggle}
            disabled={loading}
          />
        </div>
        
        {isPremium && (
          <div className="space-y-2">
            <Label htmlFor="expiration-date">Premium Access Expires</Label>
            <Input
              id="expiration-date"
              type="date"
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground">
              Set to future date or leave empty for unlimited access
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => handleToggle(!isPremium)}
          disabled={loading}
        >
          {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {isPremium ? 'Revoke Premium Access' : 'Grant Premium Access'}
        </Button>
      </CardFooter>
    </Card>
  );
}
