
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface UseEmailPdfParams {
  valuationId?: string;
}

export function useEmailPdf({ valuationId }: UseEmailPdfParams) {
  const [isEmailing, setIsEmailing] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const emailValuationPdf = async (email?: string) => {
    if (!valuationId) {
      toast.error("No valuation ID provided");
      return;
    }

    try {
      setIsEmailing(true);
      
      let userName = null;
      
      // If email is not provided, check if user is authenticated
      if (!email) {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user?.email) {
          setUserEmail(user.email);
          email = user.email;
          userName = user.user_metadata?.full_name || null;
        } else {
          // No email available - need to prompt user
          toast.error("Please provide an email address to receive the PDF");
          setIsEmailing(false);
          return;
        }
      }
      
      // Call the edge function to email the PDF
      const { data, error } = await supabase.functions.invoke('email-valuation-pdf', {
        body: {
          valuationId,
          email,
          userName,
        },
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      toast.success("Valuation report sent to your email");
      return data;
    } catch (error) {
      console.error("Error emailing PDF:", error);
      toast.error("Failed to send valuation report via email");
      return null;
    } finally {
      setIsEmailing(false);
    }
  };

  return {
    isEmailing,
    emailValuationPdf,
    userEmail
  };
}
