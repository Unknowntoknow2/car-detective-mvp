
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAdminRole } from '@/hooks/useAdminRole';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PremiumDealerToggle } from '@/components/admin/PremiumDealerToggle';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default function DealerManagement() {
  const { isAdmin, isCheckingRole } = useAdminRole();
  const [dealers, setDealers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDealer, setSelectedDealer] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!isAdmin && !isCheckingRole) {
      // Redirect or show access denied
      return;
    }

    async function fetchDealers() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_role', 'dealer')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setDealers(data || []);
      } catch (err) {
        console.error('Error fetching dealers:', err);
      } finally {
        setLoading(false);
      }
    }

    if (isAdmin) {
      fetchDealers();
    }
  }, [isAdmin, isCheckingRole]);

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_role', 'dealer')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDealers(data || []);
    } catch (err) {
      console.error('Error refreshing dealers:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredDealers = searchTerm
    ? dealers.filter(dealer => 
        dealer.dealership_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dealer.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : dealers;

  if (isCheckingRole || (loading && dealers.length === 0)) {
    return (
      <div className="container py-8">
        <h1 className="text-2xl font-bold mb-6">Dealer Management</h1>
        <div className="grid gap-6">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container py-8">
        <Card>
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You don't have permission to access this page.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">Dealer Management</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Registered Dealers</CardTitle>
              <CardDescription>Manage dealer accounts and premium status</CardDescription>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search dealers..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full" />
                  ))}
                </div>
              ) : (
                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Dealership</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDealers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                            {searchTerm ? 'No dealers match your search' : 'No dealers found'}
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredDealers.map((dealer) => (
                          <TableRow 
                            key={dealer.id}
                            className={selectedDealer === dealer.id ? 'bg-muted' : undefined}
                          >
                            <TableCell className="font-medium">{dealer.dealership_name || 'Unnamed Dealership'}</TableCell>
                            <TableCell>{dealer.full_name || 'Unknown'}</TableCell>
                            <TableCell>
                              {dealer.is_premium_dealer ? (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                  Premium
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                                  Standard
                                </span>
                              )}
                            </TableCell>
                            <TableCell>
                              <button
                                onClick={() => setSelectedDealer(dealer.id === selectedDealer ? null : dealer.id)}
                                className="text-sm text-blue-600 hover:underline"
                              >
                                {dealer.id === selectedDealer ? 'Hide Details' : 'Manage'}
                              </button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div>
          {selectedDealer && (
            <PremiumDealerToggle
              dealerId={selectedDealer}
              isCurrentlyPremium={dealers.find(d => d.id === selectedDealer)?.is_premium_dealer || false}
              dealerName={dealers.find(d => d.id === selectedDealer)?.dealership_name || 'Unnamed Dealership'}
              expiresAt={dealers.find(d => d.id === selectedDealer)?.premium_expires_at}
              onStatusChange={handleRefresh}
            />
          )}
        </div>
      </div>
    </div>
  );
}
