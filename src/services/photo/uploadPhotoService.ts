
import { Photo } from '@/types/photo';
import { generateUniqueId } from '@/utils/helpers';

/**
 * Uploads photos to the server
 */
export async function uploadPhotos(files: File[]): Promise<Photo[]> {
  // This is a mock implementation for now
  // In a real app, this would upload to a storage service
  
  // Validate files
  if (!files || files.length === 0) {
    throw new Error('No files provided for upload');
  }
  
  const photos: Photo[] = [];
  
  // Process each file
  for (const file of files) {
    // Create a mock photo object
    const photo: Photo = {
      id: generateUniqueId(),
      url: URL.createObjectURL(file),
      metadata: {
        filename: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified
      },
      uploaded: false,
      uploading: true
    };
    
    photos.push(photo);
    
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mark as uploaded
    photo.uploaded = true;
    photo.uploading = false;
  }
  
  return photos;
}
