
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Car, FileText, History, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function UserDashboardPage() {
  // In a real app, we would load user data and valuations from API
  const isPremium = localStorage.getItem('premium_purchased') === 'true';
  
  return (
    <MainLayout>
      <Container className="py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            View your recent valuations and account information.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Valuations</CardTitle>
              </CardHeader>
              <CardContent>
                {/* This would show actual valuations from the user's history */}
                <div className="text-center py-8 text-muted-foreground">
                  <p>No recent valuations found.</p>
                  <Button variant="link" asChild>
                    <Link to="/vin-lookup">Get a new valuation</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Car className="mr-2 h-5 w-5" /> Vehicle Lookup
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Look up a vehicle by VIN number to get detailed information.
                  </p>
                  <Button variant="outline" asChild className="w-full">
                    <Link to="/vin-lookup">VIN Lookup</Link>
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FileText className="mr-2 h-5 w-5" /> Valuation Reports
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Access and download your saved valuation reports.
                  </p>
                  <Button variant="outline" className="w-full">
                    View Reports
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Account Type</p>
                    <p className="font-medium">{isPremium ? 'Premium' : 'Basic'}</p>
                  </div>
                  
                  {!isPremium && (
                    <Button asChild className="w-full">
                      <Link to="/premium">Upgrade to Premium</Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <History className="mr-2 h-5 w-5" /> Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  <p>Recent activity will appear here.</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="mr-2 h-5 w-5" /> Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    Account Settings
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    Notification Preferences
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    Privacy Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </MainLayout>
  );
}
