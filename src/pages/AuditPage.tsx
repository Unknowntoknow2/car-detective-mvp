
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import UserAuth from '@/components/auth/UserAuth';

const AuditPage = () => {
  return (
    <UserAuth requiredRole="admin">
      <div className="container mx-auto py-8 px-4">
        <Card>
          <CardHeader>
            <CardTitle>System Audit</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Review system activities and generate audit reports.
            </p>
            <Button>Generate Audit Report</Button>
          </CardContent>
        </Card>
      </div>
    </UserAuth>
  );
};

export default AuditPage;
