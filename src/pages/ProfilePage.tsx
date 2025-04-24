
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Upload, User as UserIcon } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuth();
  const { profile, fetchProfile, updateProfile, uploadAvatar, isLoading } = useProfile();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    full_name: '',
    bio: '',
    website: ''
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (user) {
      fetchProfile(user);
    }
  }, [user, navigate]);

  useEffect(() => {
    if (profile) {
      setFormData({
        username: profile.username || '',
        full_name: profile.full_name || '',
        bio: profile.bio || '',
        website: profile.website || ''
      });
    }
  }, [profile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error('File too large', {
          description: 'Avatar must be less than 2MB'
        });
        return;
      }

      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        toast.error('Invalid file type', {
          description: 'Please upload a JPEG, PNG, GIF, or WebP image'
        });
        return;
      }

      setAvatarFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Upload avatar if selected
    if (avatarFile) {
      await uploadAvatar(avatarFile);
    }

    // Update profile details
    await updateProfile(formData);
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
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col items-center space-y-4">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleAvatarChange}
                  className="hidden" 
                  id="avatar-upload"
                />
                <label htmlFor="avatar-upload" className="cursor-pointer">
                  {profile.avatar_url ? (
                    <img 
                      src={profile.avatar_url} 
                      alt="Avatar" 
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                      <UserIcon className="w-12 h-12 text-gray-500" />
                    </div>
                  )}
                </label>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => document.getElementById('avatar-upload')?.click()}
                >
                  <Upload className="mr-2 h-4 w-4" /> Upload Avatar
                </Button>
              </div>

              <div className="space-y-2">
                <Input 
                  name="username" 
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Username"
                />
              </div>

              <div className="space-y-2">
                <Input 
                  name="full_name" 
                  value={formData.full_name}
                  onChange={handleInputChange}
                  placeholder="Full Name"
                />
              </div>

              <div className="space-y-2">
                <Textarea 
                  name="bio" 
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Bio"
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Input 
                  name="website" 
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder="Website URL"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? 'Updating...' : 'Save Changes'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
