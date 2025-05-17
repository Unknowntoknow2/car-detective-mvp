
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, LogOut, Car, History, Settings } from 'lucide-react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function Dashboard() {
  const { user, userDetails, signOut, isLoading } = useAuth();
  const [profileLoading, setProfileLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/sign-in');
    }
  }, [user, isLoading, navigate]);

  const handleSignOut = async () => {
    setProfileLoading(true);
    try {
      await signOut();
      toast.success('Successfully signed out');
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    } finally {
      setProfileLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>User Profile</CardTitle>
              <CardDescription>Your account information</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
              <Avatar className="h-24 w-24">
                {userDetails?.avatar_url ? (
                  <AvatarImage src={userDetails.avatar_url} />
                ) : (
                  <AvatarFallback className="bg-primary/10">
                    <User className="h-12 w-12 text-primary/80" />
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="text-center">
                <h3 className="text-xl font-semibold">{userDetails?.name || 'User'}</h3>
                <p className="text-muted-foreground">{user?.email}</p>
                <p className="text-sm text-muted-foreground">Role: {userDetails?.role || 'individual'}</p>
              </div>
              <Button 
                variant="outline" 
                className="w-full mt-4 flex items-center gap-2"
                onClick={handleSignOut}
                disabled={profileLoading}
              >
                {profileLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <LogOut className="h-4 w-4" />
                )}
                Sign Out
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Dashboard</CardTitle>
              <CardDescription>Manage your car valuations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  variant="outline" 
                  className="h-24 flex flex-col items-center justify-center gap-2"
                  onClick={() => navigate('/valuations/new')}
                >
                  <Car className="h-8 w-8 text-primary" />
                  <span>New Valuation</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-24 flex flex-col items-center justify-center gap-2"
                  onClick={() => navigate('/valuations/history')}
                >
                  <History className="h-8 w-8 text-primary" />
                  <span>Valuation History</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-24 flex flex-col items-center justify-center gap-2"
                  onClick={() => navigate('/profile')}
                >
                  <User className="h-8 w-8 text-primary" />
                  <span>Edit Profile</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-24 flex flex-col items-center justify-center gap-2"
                  onClick={() => navigate('/settings')}
                >
                  <Settings className="h-8 w-8 text-primary" />
                  <span>Account Settings</span>
                </Button>
              </div>
              
              <Card className="bg-muted/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Welcome, {userDetails?.name || 'User'}!</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Your account is ready to use. Start by creating a new car valuation or explore your past valuations.</p>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
