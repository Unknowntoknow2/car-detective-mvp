import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Twitter, 
  Facebook, 
  Linkedin, 
  Share2, 
  Copy, 
  Download,
  Mail,
  MessageSquare
} from 'lucide-react';
import { useToast } from '@/hooks';

interface SocialShareButtonsProps {
  valuationId: string;
  publicToken?: string;
  vehicleInfo: {
    year: number;
    make: string;
    model: string;
    estimatedValue: number;
  };
  onGenerateToken?: () => Promise<string>;
}

export function SocialShareButtons({ 
  valuationId, 
  publicToken, 
  vehicleInfo,
  onGenerateToken 
}: SocialShareButtonsProps) {
  const { toast } = useToast();
  const [token, setToken] = React.useState(publicToken);
  const [isGenerating, setIsGenerating] = React.useState(false);

  const shareUrl = token 
    ? `${window.location.origin}/view-offer/${token}`
    : window.location.href;

  const shareText = `Check out my ${vehicleInfo.year} ${vehicleInfo.make} ${vehicleInfo.model} valuation: $${vehicleInfo.estimatedValue.toLocaleString()}`;

  const handleGenerateToken = async () => {
    if (!onGenerateToken) return;
    
    try {
      setIsGenerating(true);
      const newToken = await onGenerateToken();
      setToken(newToken);
      toast({
        title: "Share link generated",
        description: "Your valuation is now ready to share!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate share link",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link copied!",
        description: "Share link has been copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy link",
        variant: "destructive",
      });
    }
  };

  const handleTwitterShare = () => {
    const tweetText = encodeURIComponent(`${shareText} ${shareUrl}`);
    window.open(`https://twitter.com/intent/tweet?text=${tweetText}`, '_blank');
  };

  const handleFacebookShare = () => {
    const fbUrl = encodeURIComponent(shareUrl);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${fbUrl}`, '_blank');
  };

  const handleLinkedInShare = () => {
    const linkedInUrl = encodeURIComponent(shareUrl);
    const title = encodeURIComponent(`Vehicle Valuation Report`);
    const summary = encodeURIComponent(shareText);
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${linkedInUrl}&title=${title}&summary=${summary}`,
      '_blank'
    );
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent(`Vehicle Valuation Report - ${vehicleInfo.year} ${vehicleInfo.make} ${vehicleInfo.model}`);
    const body = encodeURIComponent(`${shareText}\n\nView the full report: ${shareUrl}`);
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const handleSMSShare = () => {
    const message = encodeURIComponent(`${shareText} ${shareUrl}`);
    window.open(`sms:?body=${message}`);
  };

  const handleJSONExport = async () => {
    if (!token) {
      toast({
        title: "Error", 
        description: "Please generate a share link first",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch('/functions/v1/export-valuation-json', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        throw new Error('Export failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `valuation_${vehicleInfo.year}_${vehicleInfo.make}_${vehicleInfo.model}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Export successful",
        description: "JSON data has been downloaded",
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Unable to export JSON data",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Share2 className="h-5 w-5" />
          Share Valuation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!token && (
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground mb-3">
              Generate a shareable link to access this valuation publicly
            </p>
            <Button 
              onClick={handleGenerateToken}
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating ? 'Generating...' : 'Generate Share Link'}
            </Button>
          </div>
        )}

        {token && (
          <>
            {/* Copy Link */}
            <div className="flex gap-2">
              <div className="flex-1 p-2 bg-muted rounded text-sm font-mono truncate">
                {shareUrl}
              </div>
              <Button variant="outline" size="sm" onClick={handleCopyLink}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>

            {/* Social Media Sharing */}
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={handleTwitterShare} className="gap-2">
                <Twitter className="h-4 w-4" />
                Twitter
              </Button>
              <Button variant="outline" onClick={handleFacebookShare} className="gap-2">
                <Facebook className="h-4 w-4" />
                Facebook
              </Button>
              <Button variant="outline" onClick={handleLinkedInShare} className="gap-2">
                <Linkedin className="h-4 w-4" />
                LinkedIn
              </Button>
              <Button variant="outline" onClick={handleEmailShare} className="gap-2">
                <Mail className="h-4 w-4" />
                Email
              </Button>
            </div>

            {/* Additional Actions */}
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={handleSMSShare} className="gap-2">
                <MessageSquare className="h-4 w-4" />
                SMS
              </Button>
              <Button variant="outline" onClick={handleJSONExport} className="gap-2">
                <Download className="h-4 w-4" />
                Export JSON
              </Button>
            </div>

            <div className="text-xs text-muted-foreground text-center">
              Share link expires in 30 days
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}