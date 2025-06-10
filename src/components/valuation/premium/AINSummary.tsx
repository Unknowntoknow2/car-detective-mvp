
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AINSummaryProps {
  summary?: string;
}

const AINSummary: React.FC<AINSummaryProps> = ({ summary }) => {
  if (!summary) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{summary}</p>
      </CardContent>
    </Card>
  );
};

export default AINSummary;
