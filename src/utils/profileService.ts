
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types/profile';
import { errorHandler } from '@/utils/error-handling';

export async function getProfile(userId: string): Promise<Profile | null> {
  try {
    // Get profile data from the profiles table
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching profile:', error.message);
      throw error;
    }

    // If no profile exists, create one
    if (!data) {
      console.log('No profile found, creating one...');
      // Ensure id is included and not optional
      const newProfile = {
        id: userId,
        created_at: new Date().toISOString()
      };

      const { data: createdProfile, error: createError } = await supabase
        .from('profiles')
        .insert(newProfile)
        .select('*')
        .single();

      if (createError) {
        console.error('Error creating profile:', createError.message);
        throw createError;
      }

      return createdProfile;
    }

    return data;
  } catch (error) {
    errorHandler.handle(error, 'profile-fetch');
    return null;
  }
}

export async function updateProfile(profileData: Partial<Profile>): Promise<Profile | null> {
  try {
    if (!profileData.id) {
      throw new Error('Profile ID is required for update');
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(profileData)
      .eq('id', profileData.id)
      .select('*')
      .single();

    if (error) {
      console.error('Error updating profile:', error.message);
      throw error;
    }

    return data;
  } catch (error) {
    errorHandler.handle(error, 'profile-update');
    return null;
  }
}
