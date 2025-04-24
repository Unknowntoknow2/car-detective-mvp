
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/profile';
import { toast } from 'sonner';
import { User } from '@supabase/supabase-js';

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchProfile = async (user: User) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error: any) {
      toast.error('Failed to fetch profile', {
        description: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updatedProfile: Partial<Profile>) => {
    const user = supabase.auth.getUser();
    if (!user) {
      toast.error('Not authenticated');
      return null;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updatedProfile)
        .eq('id', (await user).data.user?.id)
        .select()
        .single();

      if (error) throw error;
      
      setProfile(data);
      toast.success('Profile updated successfully');
      return data;
    } catch (error: any) {
      toast.error('Failed to update profile', {
        description: error.message
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const uploadAvatar = async (file: File) => {
    const user = supabase.auth.getUser();
    if (!user) {
      toast.error('Not authenticated');
      return null;
    }

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${(await user).data.user?.id}/avatar.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { 
          upsert: true,
          cacheControl: '3600' 
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update profile with new avatar URL
      const updatedProfile = await updateProfile({ 
        avatar_url: publicUrl.toString() 
      });

      toast.success('Avatar uploaded successfully');
      return updatedProfile;
    } catch (error: any) {
      toast.error('Avatar upload failed', {
        description: error.message
      });
      return null;
    }
  };

  return { 
    profile, 
    fetchProfile, 
    updateProfile, 
    uploadAvatar, 
    isLoading 
  };
}
