
import { corsHeaders } from "../_shared/cors.ts";

// Constants for validation
export const MAX_SIZE = 10 * 1024 * 1024; // 10MB
export const VALID_TYPES = ["image/jpeg", "image/jpg", "image/png"];
export const MAX_PHOTOS = 5;

// Validate uploaded photos
export function validatePhotos(photos: File[]): { isValid: boolean; errorResponse?: Response } {
  // Check if any photos were uploaded
  if (photos.length === 0) {
    return {
      isValid: false,
      errorResponse: new Response(
        JSON.stringify({ error: "No photos uploaded" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      )
    };
  }

  // Check if too many photos were uploaded
  if (photos.length > MAX_PHOTOS) {
    return {
      isValid: false,
      errorResponse: new Response(
        JSON.stringify({ error: `Maximum ${MAX_PHOTOS} photos allowed` }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      )
    };
  }

  // Validate file types and sizes
  for (const photo of photos) {
    // Check file type
    if (!VALID_TYPES.includes(photo.type)) {
      return {
        isValid: false,
        errorResponse: new Response(
          JSON.stringify({ 
            error: `Invalid file type: ${photo.type}. Only JPEG and PNG are accepted.`
          }),
          {
            status: 415, // Unsupported Media Type
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          }
        )
      };
    }

    // Check file size
    if (photo.size > MAX_SIZE) {
      return {
        isValid: false,
        errorResponse: new Response(
          JSON.stringify({ 
            error: `File too large: ${photo.name}. Maximum size is 10MB.`
          }),
          {
            status: 413, // Payload Too Large
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          }
        )
      };
    }
  }

  // All validations passed
  return { isValid: true };
}
