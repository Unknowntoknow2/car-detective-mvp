<<<<<<< HEAD

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';

const AuditPage = () => {
  const { user, userDetails, isLoading } = useAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect to auth if not logged in
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Check if user has admin role
  if (userDetails?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }
=======
import React from "react";
import { AuditChecklist } from "@/components/audit/AuditChecklist";
import { UserAuth } from "@/components/auth/UserAuth";
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

  return (
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
  );
};

export default AuditPage;
