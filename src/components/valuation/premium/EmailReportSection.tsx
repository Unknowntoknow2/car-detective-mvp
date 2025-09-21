
import React from 'react';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';

interface EmailReportSectionProps {
  valuationId: string;
}

const EmailReportSection: React.FC<EmailReportSectionProps> = ({ valuationId }) => {
  const handleEmail = () => {
  };

  return (
    <Button variant="outline" onClick={handleEmail} className="gap-2">
      <Mail className="h-4 w-4" />
      Email Report
    </Button>
  );
};

export default EmailReportSection;
