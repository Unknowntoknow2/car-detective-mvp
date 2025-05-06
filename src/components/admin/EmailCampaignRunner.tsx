
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Trans } from 'react-i18next';
import { createEmailCampaign } from '@/utils/emailService';

// Define types for email campaigns
type EmailCampaign = {
  id: string;
  subject: string;
  body: string;
  audience_type: string;
  recipient_count: number | null;
  status: string | null;
  created_at: string;
};

export const EmailCampaignRunner = () => {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [audienceType, setAudienceType] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [campaignHistory, setCampaignHistory] = useState<EmailCampaign[]>([]);

  useEffect(() => {
    fetchCampaignHistory();
  }, []);

  const fetchCampaignHistory = async () => {
    try {
      // Use type assertion to handle the custom table
      const { data, error } = await supabase
        .from('email_campaigns')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10) as { data: EmailCampaign[] | null; error: any };

      if (error) throw error;
      setCampaignHistory(data || []);
    } catch (err) {
      console.error('Error fetching campaign history:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subject || !body) {
      toast.error('Please fill in both subject and body fields');
      return;
    }
    
    setIsLoading(true);
    setResult(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('trigger-email-campaign', {
        body: {
          subject,
          body,
          audienceType
        }
      });
      
      if (error) throw error;
      
      setResult({
        success: true,
        message: `Campaign sent to ${data.recipientCount} recipients`
      });
      
      toast.success('Email campaign triggered successfully');
      fetchCampaignHistory();
      
      // Reset form
      setSubject('');
      setBody('');
    } catch (err) {
      console.error('Error triggering email campaign:', err);
      setResult({
        success: false,
        message: err instanceof Error ? err.message : 'An unknown error occurred'
      });
      toast.error('Failed to trigger email campaign');
    } finally {
      setIsLoading(false);
    }
  };

  // Fix the Trans component usage - removing the incorrect name property
  const renderMessage = (message: string) => {
    return (
      <Trans>
        {message}
      </Trans>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Send Email Campaign</CardTitle>
          <CardDescription>
            Create and send email campaigns to your users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="audience">Audience</Label>
              <Select 
                value={audienceType} 
                onValueChange={setAudienceType}
              >
                <SelectTrigger id="audience">
                  <SelectValue placeholder="Select audience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="active">Active Users</SelectItem>
                  <SelectItem value="inactive">Inactive Users</SelectItem>
                  <SelectItem value="premium">Premium Users</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="subject">Email Subject</Label>
              <Input 
                id="subject" 
                value={subject} 
                onChange={(e) => setSubject(e.target.value)} 
                placeholder="Enter email subject"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="body">Email Body</Label>
              <Textarea 
                id="body" 
                value={body} 
                onChange={(e) => setBody(e.target.value)} 
                placeholder="Enter email content"
                rows={8}
              />
              <p className="text-sm text-muted-foreground">
                You can use HTML for formatting. Use <code>{`{{name}}`}</code> to personalize with the recipient&apos;s name.
              </p>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleSubmit} 
            disabled={isLoading || !subject || !body}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send Campaign
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
      
      {result && (
        <Card className={result.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              {result.success ? (
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
              )}
              <div>
                <h3 className={`font-medium ${result.success ? "text-green-800" : "text-red-800"}`}>
                  {result.success ? "Campaign Sent Successfully" : "Campaign Failed"}
                </h3>
                <p className={result.success ? "text-green-700" : "text-red-700"}>
                  {renderMessage(result.message)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {campaignHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {campaignHistory.map((campaign) => (
                <div key={campaign.id} className="border-b pb-4 last:border-0">
                  <div className="flex justify-between">
                    <h3 className="font-medium">{campaign.subject}</h3>
                    <span className="text-sm text-muted-foreground">
                      {new Date(campaign.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Sent to {campaign.recipient_count} recipients ({campaign.audience_type})
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EmailCampaignRunner;
