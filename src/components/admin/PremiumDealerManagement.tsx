
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';

export default function PremiumDealerManagement() {
  const [dealers, setDealers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchDealers();
  }, []);

  const fetchDealers = async () => {
    try {
      setLoading(true);
      
      // Get all dealer users from profiles
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email:id, dealership_name, is_premium_dealer, premium_expires_at, created_at')
        .eq('user_role', 'dealer')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Fetch the email for each dealer from auth.users
      if (data) {
        // For simplicity - in a real app you might need to find another way
        // to get the email as direct access to auth.users may be restricted
        setDealers(data);
      }
    } catch (error) {
      console.error('Error fetching dealers:', error);
      toast.error('Failed to load dealers');
    } finally {
      setLoading(false);
    }
  };

  const togglePremiumStatus = async (dealerId: string, isPremium: boolean, currentExpiryDate: string | null) => {
    try {
      let expiryDate = null;
      
      if (isPremium) {
        // Set expiry date to 30 days from now if becoming premium
        const date = new Date();
        date.setDate(date.getDate() + 30);
        expiryDate = date.toISOString();
      }
      
      const { error } = await supabase
        .from('profiles')
        .update({ 
          is_premium_dealer: isPremium,
          premium_expires_at: isPremium ? expiryDate : null
        })
        .eq('id', dealerId);
      
      if (error) throw error;
      
      // Refresh the dealers list
      fetchDealers();
      
      toast.success(`Dealer premium status ${isPremium ? 'activated' : 'deactivated'}`);
    } catch (error) {
      console.error('Error toggling premium status:', error);
      toast.error('Failed to update premium status');
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Premium Dealer Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-40">
              <p>Loading dealers...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Premium Dealer Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>Dealer accounts in the system</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Dealership</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Premium Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dealers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">No dealers found</TableCell>
                </TableRow>
              ) : (
                dealers.map((dealer) => (
                  <TableRow key={dealer.id}>
                    <TableCell className="font-medium">{dealer.dealership_name || 'Unnamed Dealership'}</TableCell>
                    <TableCell>{dealer.full_name || 'Unknown'}</TableCell>
                    <TableCell>{new Date(dealer.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {dealer.is_premium_dealer ? (
                        <div className="flex flex-col gap-1">
                          <Badge className="w-fit bg-green-500 hover:bg-green-600">Premium</Badge>
                          {dealer.premium_expires_at && (
                            <span className="text-xs text-muted-foreground">
                              Expires: {new Date(dealer.premium_expires_at).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      ) : (
                        <Badge variant="outline" className="w-fit">Standard</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-sm">Premium</span>
                        <Switch
                          checked={dealer.is_premium_dealer}
                          onCheckedChange={(checked) => 
                            togglePremiumStatus(dealer.id, checked, dealer.premium_expires_at)
                          }
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
