
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Loader2, Copy, Share2, Check, Twitter, Linkedin } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface ShareableLinkProps {
  valuationId: string;
}

export function ShareableLink({ valuationId }: ShareableLinkProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  
  const generateShareUrl = async () => {
    setIsGenerating(true);
    try {
      const baseUrl = window.location.origin;
      const url = `${baseUrl}/valuation/${valuationId}`;
      setShareUrl(url);
    } catch (error) {
      toast.error('Failed to generate share link');
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleCopy = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      setIsCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setIsCopied(false), 2000);
    }
  };
  
  const handleSocialShare = (platform: 'twitter' | 'linkedin') => {
    if (!shareUrl) return;
    
    const text = 'Check out my vehicle valuation from Car Detective!';
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
    };
    
    window.open(urls[platform], '_blank');
  };
  
  const handleOpen = () => {
    setIsOpen(true);
    if (!shareUrl) {
      generateShareUrl();
    }
  };

  return (
    <>
      <Button variant="outline" onClick={handleOpen} className="flex items-center gap-2">
        <Share2 className="h-4 w-4" />
        Share Report
      </Button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Your Valuation</DialogTitle>
            <DialogDescription>
              Share your vehicle valuation report with others
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {isGenerating ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                Generating share link...
              </div>
            ) : shareUrl ? (
              <>
                <div className="flex items-center space-x-2">
                  <Input
                    value={shareUrl}
                    readOnly
                    className="flex-1"
                  />
                  <Button
                    size="sm"
                    onClick={handleCopy}
                    className="shrink-0"
                  >
                    {isCopied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSocialShare('twitter')}
                    className="flex items-center gap-2"
                  >
                    <Twitter className="h-4 w-4" />
                    Twitter
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSocialShare('linkedin')}
                    className="flex items-center gap-2"
                  >
                    <Linkedin className="h-4 w-4" />
                    LinkedIn
                  </Button>
                </div>
              </>
            ) : null}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
