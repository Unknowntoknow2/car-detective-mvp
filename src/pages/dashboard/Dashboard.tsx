<<<<<<< HEAD

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
=======
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Car, History, LogOut, Settings, User } from "lucide-react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

interface UserProfile {
  id: string;
  full_name?: string;
  username?: string;
  avatar_url?: string;
}

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
<<<<<<< HEAD
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        // Check if the user is authenticated
        const { data: { user: currentUser }, error: authError } = await supabase.auth.getUser();

        if (authError || !currentUser) {
          console.error('Authentication error:', authError);
          navigate('/auth');
          return;
        }

        setUser(currentUser);

        // Fetch the user's profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentUser.id)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
        } else {
          setProfile(profileData);
        }
      } catch (error) {
        console.error('Unexpected error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  useEffect(() => {
    if (!user && !isLoading) {
      navigate('/auth');
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-10 w-10 animate-spin" />
=======
    if (!isLoading && !user) {
      navigate("/sign-in");
    }
  }, [user, isLoading, navigate]);

  const handleSignOut = async () => {
    setProfileLoading(true);
    try {
      await signOut();
      toast.success("Successfully signed out");
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to sign out");
    } finally {
      setProfileLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg text-muted-foreground">
            Loading your profile...
          </p>
        </div>
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-1">
<<<<<<< HEAD
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">User Profile</h2>
            {profile ? (
              <>
                <h3 className="text-xl font-semibold">{profile?.full_name || profile?.username || 'User'}</h3>
                <p className="text-gray-600 dark:text-gray-300">{user.email}</p>
              </>
            ) : (
              <p>Loading profile...</p>
            )}
          </div>
        </div>

        <div className="md:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Authentication</h2>
            <div className="space-y-4">
              <p>You are currently logged in as:</p>
              <p className="font-medium">{user.email}</p>
              <button 
                onClick={() => supabase.auth.signOut().then(() => navigate('/auth'))}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Account Management</h2>
            {/* Profile management would go here */}
            <p>Profile management features will be added soon.</p>
          </div>
=======
          <Card className="h-full">
            <CardHeader>
              <CardTitle>User Profile</CardTitle>
              <CardDescription>Your account information</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
              <Avatar className="h-24 w-24">
                {userDetails?.avatar_url
                  ? <AvatarImage src={userDetails.avatar_url} />
                  : (
                    <AvatarFallback className="bg-primary/10">
                      <User className="h-12 w-12 text-primary/80" />
                    </AvatarFallback>
                  )}
              </Avatar>
              <div className="text-center">
                <h3 className="text-xl font-semibold">
                  {userDetails?.name || "User"}
                </h3>
                <p className="text-muted-foreground">{user?.email}</p>
                <p className="text-sm text-muted-foreground">
                  Role: {userDetails?.role || "individual"}
                </p>
              </div>
              <Button
                variant="outline"
                className="w-full mt-4 flex items-center gap-2"
                onClick={handleSignOut}
                disabled={profileLoading}
              >
                {profileLoading
                  ? <Loader2 className="h-4 w-4 animate-spin" />
                  : <LogOut className="h-4 w-4" />}
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
                  onClick={() => navigate("/valuations/new")}
                >
                  <Car className="h-8 w-8 text-primary" />
                  <span>New Valuation</span>
                </Button>

                <Button
                  variant="outline"
                  className="h-24 flex flex-col items-center justify-center gap-2"
                  onClick={() => navigate("/valuations/history")}
                >
                  <History className="h-8 w-8 text-primary" />
                  <span>Valuation History</span>
                </Button>

                <Button
                  variant="outline"
                  className="h-24 flex flex-col items-center justify-center gap-2"
                  onClick={() => navigate("/profile")}
                >
                  <User className="h-8 w-8 text-primary" />
                  <span>Edit Profile</span>
                </Button>

                <Button
                  variant="outline"
                  className="h-24 flex flex-col items-center justify-center gap-2"
                  onClick={() => navigate("/settings")}
                >
                  <Settings className="h-8 w-8 text-primary" />
                  <span>Account Settings</span>
                </Button>
              </div>

              <Card className="bg-muted/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">
                    Welcome, {userDetails?.name || "User"}!
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Your account is ready to use. Start by creating a new car
                    valuation or explore your past valuations.
                  </p>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
