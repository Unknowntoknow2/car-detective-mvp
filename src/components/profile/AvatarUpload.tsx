
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Upload, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Profile } from '@/types/profile';
import { toast } from "@/hooks/use-toast";

interface AvatarUploadProps {
  profile: Profile | null;
  onAvatarChange: (file: File) => Promise<void>;
  isLoading: boolean;
}

export const AvatarUpload = ({ profile, onAvatarChange, isLoading }: AvatarUploadProps) => {
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: 'Avatar must be less than 2MB',
          variant: 'destructive'
        });
        return;
      }

      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        toast({
          title: "Invalid File Type",
          description: 'Please upload a JPEG, PNG, GIF, or WebP image',
          variant: 'destructive'
        });
        return;
      }

      setAvatarFile(file);
      await onAvatarChange(file);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <input 
        type="file" 
        accept="image/*" 
        onChange={handleAvatarChange}
        className="hidden" 
        id="avatar-upload"
      />
      <label htmlFor="avatar-upload" className="cursor-pointer">
        <Avatar className="w-24 h-24">
          {profile?.avatar_url ? (
            <AvatarImage src={profile.avatar_url} alt="Profile" />
          ) : (
            <AvatarFallback>
              <User className="w-12 h-12 text-gray-500" />
            </AvatarFallback>
          )}
        </Avatar>
      </label>
      <Button 
        type="button" 
        variant="outline" 
        size="sm" 
        disabled={isLoading}
        onClick={() => document.getElementById('avatar-upload')?.click()}
      >
        <Upload className="mr-2 h-4 w-4" /> 
        {isLoading ? 'Uploading...' : 'Upload Avatar'}
      </Button>
    </div>
  );
};
