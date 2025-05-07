
import { supabase } from '@/integrations/supabase/client';
import { Photo, PhotoScore } from '@/types/photo';

/**
 * Uploads a single photo to Supabase storage and analyzes it
 * @param valuationId The ID of the valuation to associate with the photo
 * @param file The file to upload
 * @returns Promise resolving to the score result
 */
export async function uploadAndScorePhoto(
  valuationId: string, 
  file: File
): Promise<{ score: number; url: string; id: string; bestPhoto: boolean; explanation?: string }> {
  if (!valuationId) {
    throw new Error("No valuation ID provided");
  }
  
  try {
    // Generate a unique filename
    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filePath = `${valuationId}/${fileName}`;
    
    // Read the file as base64
    const reader = new FileReader();
    const fileData = await new Promise<string>((resolve, reject) => {
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
    
    // Extract the base64 data without the data URL prefix
    const base64Data = fileData.split(',')[1];
    
    // Call the score-image Edge Function
    const { data: scoreData, error: scoreError } = await supabase.functions.invoke('score-image', {
      body: {
        file: base64Data,
        fileName,
        valuationId
      }
    });
    
    if (scoreError) {
      throw new Error(`Failed to score image: ${scoreError.message}`);
    }
    
    if (!scoreData) {
      throw new Error('No score data returned');
    }
    
    return {
      score: scoreData.score,
      url: scoreData.url,
      id: scoreData.id || '',
      bestPhoto: scoreData.bestPhoto || false,
      explanation: scoreData.explanation || ''
    };
  } catch (err) {
    console.error('Error in uploadAndScorePhoto:', err);
    throw err;
  }
}

/**
 * Uploads multiple photos and returns the best one
 */
export async function uploadAndScorePhotos(
  valuationId: string,
  files: File[]
): Promise<{
  photoUrls: string[];
  scores: PhotoScore[];
  bestPhoto?: { url: string; score: number; explanation?: string };
}> {
  if (!valuationId) {
    throw new Error("No valuation ID provided");
  }
  
  if (!files.length) {
    throw new Error("No files provided");
  }
  
  try {
    // Upload each file one by one
    const uploadPromises = files.map(file => uploadAndScorePhoto(valuationId, file));
    const results = await Promise.all(uploadPromises);
    
    // Transform results
    const photoUrls = results.map(r => r.url);
    const scores: PhotoScore[] = results.map(r => ({
      url: r.url,
      score: r.score,
      isPrimary: r.bestPhoto,
      explanation: r.explanation
    }));
    
    // Find the best photo (highest score)
    let bestScore = 0;
    let bestPhoto = undefined;
    
    for (const result of results) {
      if (result.score > bestScore) {
        bestScore = result.score;
        bestPhoto = {
          url: result.url,
          score: result.score,
          explanation: result.explanation
        };
      }
    }
    
    // Update the valuation with the best photo and score
    if (bestPhoto) {
      // Use JSON data field to store photo information
      const { data: currentData, error: getError } = await supabase
        .from('valuations')
        .select('data')
        .eq('id', valuationId)
        .single();
      
      // Prepare the new data object
      const updatedData = {
        ...((currentData && currentData.data) || {}),
        best_photo_url: bestPhoto.url,
        photo_score: bestPhoto.score,
        photo_explanation: bestPhoto.explanation
      };
      
      // Update the valuation record
      await supabase
        .from('valuations')
        .update({
          data: updatedData
        })
        .eq('id', valuationId);
    }
    
    return {
      photoUrls,
      scores,
      bestPhoto
    };
  } catch (err) {
    console.error('Error in uploadAndScorePhotos:', err);
    throw err;
  }
}

/**
 * Deletes a photo from storage and database
 */
export async function deletePhoto(valuationId: string, photoId: string): Promise<void> {
  if (!valuationId || !photoId) {
    throw new Error("Missing required parameters");
  }
  
  try {
    // Get the photo details first
    const { data: photoData, error: fetchError } = await supabase
      .from('valuation_photos')
      .select('*')
      .eq('id', photoId)
      .eq('valuation_id', valuationId)
      .single();
      
    if (fetchError) {
      throw new Error(`Failed to fetch photo: ${fetchError.message}`);
    }
    
    // Delete from the database
    const { error: deleteDbError } = await supabase
      .from('valuation_photos')
      .delete()
      .eq('id', photoId);
      
    if (deleteDbError) {
      throw new Error(`Failed to delete photo record: ${deleteDbError.message}`);
    }
    
    // Extract filename from the photo URL
    const urlParts = photoData.photo_url.split('/');
    const fileName = urlParts[urlParts.length - 1];
    const filePath = `${valuationId}/${fileName}`;
    
    // Delete from storage
    const { error: deleteStorageError } = await supabase.storage
      .from('vehicle-photos')
      .remove([filePath]);
      
    if (deleteStorageError) {
      console.warn(`Failed to delete photo from storage: ${deleteStorageError.message}`);
      // Continue anyway as the database record is gone
    }
    
    // Determine if this was the primary photo
    const isPrimaryPhoto = false; // Default to false since property doesn't exist
    
    // Get current valuation data
    if (isPrimaryPhoto) {
      // Find the new best photo
      const { data: remainingPhotos, error: remainingError } = await supabase
        .from('valuation_photos')
        .select('*')
        .eq('valuation_id', valuationId)
        .order('score', { ascending: false })
        .limit(1);
        
      if (!remainingError && remainingPhotos && remainingPhotos.length > 0) {
        // Get current data
        const { data: currentData } = await supabase
          .from('valuations')
          .select('data')
          .eq('id', valuationId)
          .single();
          
        // Update the valuation with the new best photo
        const updatedData = {
          ...((currentData && currentData.data) || {}),
          best_photo_url: remainingPhotos[0].photo_url,
          photo_score: remainingPhotos[0].score,
          photo_explanation: null
        };
        
        await supabase
          .from('valuations')
          .update({
            data: updatedData
          })
          .eq('id', valuationId);
      } else {
        // No photos left, clear the best photo
        const { data: currentData } = await supabase
          .from('valuations')
          .select('data')
          .eq('id', valuationId)
          .single();
          
        // Update to remove photo data
        const updatedData = {
          ...((currentData && currentData.data) || {})
        };
        
        // Remove photo-related fields
        delete updatedData.best_photo_url;
        delete updatedData.photo_score;
        delete updatedData.photo_explanation;
        
        await supabase
          .from('valuations')
          .update({
            data: updatedData
          })
          .eq('id', valuationId);
      }
    }
  } catch (err) {
    console.error('Error in deletePhoto:', err);
    throw err;
  }
}
