
import React, { useState } from 'react';
import { X, Upload, Image } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { AspectRatio } from '@/components/ui/aspect-ratio';

interface ImageUploadSectionProps {
  images: File[];
  onImagesChange: (images: File[]) => void;
}

export const ImageUploadSection = ({ images, onImagesChange }: ImageUploadSectionProps) => {
  const [dragActive, setDragActive] = useState(false);
  
  // Preview URLs for the uploaded images
  const previewUrls = images.map(file => URL.createObjectURL(file));
  
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files).filter(
        file => file.type.startsWith('image/')
      );
      onImagesChange([...images, ...newFiles]);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).filter(
        file => file.type.startsWith('image/')
      );
      onImagesChange([...images, ...newFiles]);
    }
  };
  
  const handleRemove = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    onImagesChange(newImages);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Vehicle Photos</h3>
        <span className="text-sm text-muted-foreground">
          {images.length} {images.length === 1 ? 'image' : 'images'} uploaded
        </span>
      </div>
      
      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          <AnimatePresence>
            {previewUrls.map((url, index) => (
              <motion.div 
                key={url}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="relative group"
              >
                <AspectRatio ratio={4/3}>
                  <img 
                    src={url} 
                    alt={`Vehicle preview ${index + 1}`}
                    className="object-cover w-full h-full rounded-md" 
                  />
                </AspectRatio>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="absolute top-1 right-1 bg-black/70 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label={`Remove image ${index + 1}`}
                >
                  <X size={14} />
                </motion.button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
      
      {/* Dropzone */}
      <div
        className={`relative border-2 border-dashed rounded-lg transition-colors ${
          dragActive ? 'border-primary bg-primary/5' : 'border-gray-300 bg-gray-50'
        } hover:bg-gray-100`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input 
          type="file" 
          accept="image/*" 
          multiple 
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
          aria-label="Upload vehicle images"
        />
        <div className="flex flex-col items-center justify-center p-6 text-center">
          <motion.div
            animate={dragActive ? { y: [0, -10, 0] } : {}}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            {dragActive ? (
              <Image className="w-10 h-10 mb-3 text-primary" />
            ) : (
              <Upload className="w-10 h-10 mb-3 text-gray-400" />
            )}
          </motion.div>
          <p className="mb-2 text-sm font-semibold text-gray-700">
            {dragActive ? 'Drop images here' : 'Drag & drop vehicle images here'}
          </p>
          <p className="text-xs text-gray-500">
            or <span className="text-primary font-medium">browse files</span>
          </p>
          <p className="mt-1 text-xs text-gray-500">
            JPEG, PNG or WebP (max 10MB each)
          </p>
        </div>
      </div>
    </div>
  );
};
