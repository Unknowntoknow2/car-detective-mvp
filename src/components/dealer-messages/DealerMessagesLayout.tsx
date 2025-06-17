
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const DealerMessagesLayout: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Dealer Messages</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Your dealer messages will appear here. This feature is currently under development.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
