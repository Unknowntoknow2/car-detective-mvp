
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/profile';
import { toast } from 'sonner';
import { User } from '@supabase/supabase-js';
import { getProfile, updateProfile as updateProfileService } from '@/utils/profileService';

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchProfile = async (user: User) => {
    if (!user?.id) {
      toast.error('User not authenticated');
      return;
    }
    
    setIsLoading(true);
    try {
      const profileData = await getProfile(user.id);
      if (profileData) {
        setProfile(profileData);
      } else {
        toast.error('Failed to fetch profile');
      }
    } catch (error: any) {
      console.error('Error in fetchProfile:', error);
      toast.error('Failed to fetch profile', {
        description: error.message || 'Unknown error occurred'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updatedProfile: Partial<Profile>) => {
    const user = await supabase.auth.getUser();
    if (!user.data.user) {
      toast.error('Not authenticated');
      return null;
    }

    setIsLoading(true);
    try {
      // Ensure the profile has the user ID
      const profileToUpdate = {
        ...updatedProfile,
        id: user.data.user.id
      };
      
      const data = await updateProfileService(profileToUpdate);
      
      if (data) {
        setProfile(data);
        toast.success('Profile updated successfully');
        return data;
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error: any) {
      console.error('Error in updateProfile:', error);
      toast.error('Failed to update profile', {
        description: error.message || 'Unknown error occurred'
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const uploadAvatar = async (file: File) => {
    const user = await supabase.auth.getUser();
    if (!user.data.user) {
      toast.error('Not authenticated');
      return null;
    }

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.data.user.id}/avatar.${fileExt}`;
      const filePath = fileName;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { 
          upsert: true,
          cacheControl: '3600' 
        });

      if (uploadError) {
        console.error('Avatar upload error:', uploadError);
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update profile with new avatar URL
      const updatedProfile = await updateProfile({ 
        avatar_url: publicUrl
      });

      toast.success('Avatar uploaded successfully');
      return updatedProfile;
    } catch (error: any) {
      console.error('Error in uploadAvatar:', error);
      toast.error('Avatar upload failed', {
        description: error.message || 'Unknown error occurred'
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
