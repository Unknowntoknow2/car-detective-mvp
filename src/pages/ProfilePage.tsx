
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AvatarUpload } from '@/components/profile/AvatarUpload';
import { ProfileForm } from '@/components/profile/ProfileForm';
import { Profile } from '@/types/profile';

export default function ProfilePage() {
  const { user } = useAuth();
  const { profile, fetchProfile, updateProfile, uploadAvatar, isLoading } = useProfile();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (user) {
      fetchProfile(user);
    }
  }, [user, navigate]);

  const handleAvatarChange = async (file: File) => {
    await uploadAvatar(file);
  };

  const handleProfileUpdate = async (data: Partial<Profile>) => {
    await updateProfile(data);
  };

  if (!user || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container py-10">
        <Card className="max-w-xl mx-auto">
          <CardHeader>
            <CardTitle>Edit Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <AvatarUpload 
              profile={profile}
              onAvatarChange={handleAvatarChange}
              isLoading={isLoading}
            />
            <ProfileForm 
              profile={profile}
              onSubmit={handleProfileUpdate}
              isLoading={isLoading}
            />
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
