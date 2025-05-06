
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Mail, AlertCircle, CheckCircle } from 'lucide-react';
import { runEmailCampaignScheduler } from '@/utils/emailService';
import { toast } from 'sonner';

export function EmailCampaignRunner() {
  const [isRunning, setIsRunning] = useState(false);
  const [lastRunResults, setLastRunResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  const handleRunCampaigns = async () => {
    setIsRunning(true);
    setError(null);
    
    try {
      const result = await runEmailCampaignScheduler();
      
      if (result.success) {
        setLastRunResults(result.results);
        toast.success('Email campaigns scheduled successfully');
      } else {
        setError(result.error || 'Failed to run email campaigns');
        toast.error('Failed to run email campaigns');
      }
    } catch (err) {
      setError(err.message);
      toast.error('Error running email campaigns');
    } finally {
      setIsRunning(false);
    }
  };
  
  const getTotalEmailsSent = () => {
    if (!lastRunResults) return 0;
    
    return Object.values(lastRunResults).reduce((total: number, campaign: any) => {
      return total + campaign.sent;
    }, 0);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Mail className="mr-2 h-5 w-5" />
          Email Campaign Scheduler
        </CardTitle>
        <CardDescription>
          Trigger automated email campaigns for user re-engagement
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {error && (
          <div className="bg-red-50 p-4 rounded-md mb-4 text-red-800 flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
            <div>{error}</div>
          </div>
        )}
        
        {lastRunResults && (
          <div className="bg-green-50 p-4 rounded-md mb-4">
            <div className="flex items-center text-green-800 font-medium mb-2">
              <CheckCircle className="h-5 w-5 mr-2" />
              <span>Last Run Results</span>
            </div>
            
            <div className="text-sm space-y-2">
              <p>Total emails sent: <span className="font-medium">{getTotalEmailsSent()}</span></p>
              
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(lastRunResults).map(([type, data]: [string, any]) => (
                  <div key={type} className="bg-white p-2 rounded border">
                    <p className="font-medium capitalize">{type.replace('_', ' ')}</p>
                    <p className="text-xs text-gray-500">
                      Sent {data.sent} / {data.candidates} emails
                      {data.errors > 0 && <span className="text-red-500"> ({data.errors} errors)</span>}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        <p className="text-sm text-gray-500 mb-4">
          This will scan for users who match criteria for various email campaigns and
          schedule emails to be sent. Emails include abandoned valuation reminders,
          premium upsells, dealer offer followups, photo upload prompts, and
          reactivation emails for inactive users.
        </p>
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={handleRunCampaigns} 
          disabled={isRunning}
          className="w-full"
        >
          {isRunning ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Running Campaigns...
            </>
          ) : (
            'Run Email Campaigns Now'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
