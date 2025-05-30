
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Loader2, Copy, Share2, Check, Twitter, Linkedin } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { QRCodeSVG } from 'qrcode.react';

interface ShareableLinkProps {
  valuationId: string;
}

export function ShareableLink({ valuationId }: ShareableLinkProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  
  const handleOpenShare = async () => {
    setIsOpen(true);
    if (!shareUrl) {
      await generateShareableLink();
    }
  };

  const generateShareableLink = async () => {
    if (!valuationId) return;
    
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-public-token', {
        body: { valuationId }
      });
      
      if (error) throw error;
      
      // Construct full URL with domain
      const baseUrl = window.location.origin;
      const fullShareUrl = `${baseUrl}${data.shareUrl}`;
      setShareUrl(fullShareUrl);
    } catch (err) {
      console.error('Error generating shareable link:', err);
      toast.error('Failed to generate shareable link');
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleCopyLink = () => {
    if (!shareUrl) return;
    
    navigator.clipboard.writeText(shareUrl);
    setIsCopied(true);
    toast.success('Link copied to clipboard');
    
    // Reset copied state after 2 seconds
    setTimeout(() => setIsCopied(false), 2000);
  };
  
  const handleShare = (platform: 'twitter' | 'linkedin') => {
    if (!shareUrl) return;
    
    const text = 'Check out my car valuation report from Car Detective!';
    
    let platformUrl;
    if (platform === 'twitter') {
      platformUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`;
    } else if (platform === 'linkedin') {
      platformUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    }
    
    if (platformUrl) {
      window.open(platformUrl, '_blank', 'width=600,height=400');
    }
  };
  
  return (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        className="flex items-center gap-1" 
        onClick={handleOpenShare}
      >
        <Share2 className="h-4 w-4 mr-1" />
        Share Report
      </Button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Your Report</DialogTitle>
            <DialogDescription>
              Share this public link with others to let them view your valuation report.
            </DialogDescription>
          </DialogHeader>
          
          {isGenerating ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : shareUrl ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Input 
                  value={shareUrl} 
                  readOnly 
                  className="flex-1"
                />
                <Button 
                  size="icon" 
                  onClick={handleCopyLink}
                  variant="outline"
                >
                  {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              
              <div className="flex justify-center pt-2">
                <QRCodeSVG value={shareUrl} size={150} />
              </div>
              
              <div className="flex justify-center gap-2 pt-2">
                <Button 
                  onClick={() => handleShare('twitter')} 
                  variant="outline" 
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Twitter className="h-4 w-4" />
                  Share on X
                </Button>
                <Button 
                  onClick={() => handleShare('linkedin')} 
                  variant="outline" 
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Linkedin className="h-4 w-4" />
                  Share on LinkedIn
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              Failed to generate link. Please try again.
            </div>
          )}
          
          <DialogFooter className="sm:justify-end">
            <Button 
              variant="secondary" 
              onClick={() => setIsOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
