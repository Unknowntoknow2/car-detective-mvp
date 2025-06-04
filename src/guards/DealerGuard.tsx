<<<<<<< HEAD

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { DEBUG_MODE } from '@/lib/constants';
=======
import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

interface DealerGuardProps {
  children: React.ReactNode;
}

const DealerGuard: React.FC<DealerGuardProps> = ({ children }) => {
<<<<<<< HEAD
  const { user, userDetails, isLoading } = useAuth();

  // In debug mode, bypass dealer check
  if (DEBUG_MODE) {
    return <>{children}</>;
  }

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
=======
  const { user, userRole, isLoading } = useAuth();
  const [isCheckingRole, setIsCheckingRole] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkDealerRole = async () => {
      if (!user) {
        setIsCheckingRole(false);
        return;
      }

      // Use the userRole directly from context
      setIsCheckingRole(false);
    };

    if (!isLoading) {
      checkDealerRole();
    }
  }, [user, userRole, isLoading]);

  if (isLoading || isCheckingRole) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg text-muted-foreground">
            Verifying dealer access...
          </p>
        </div>
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
      </div>
    );
  }

<<<<<<< HEAD
  // If user is not authenticated, redirect to unified auth page
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // If user is not a dealer, redirect to access denied or their appropriate dashboard
  if (userDetails?.role !== 'dealer') {
    if (userDetails?.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  // If user is a dealer, render the protected route
=======
  if (!user) {
    // Redirect to login if not authenticated
    return (
      <Navigate
        to="/login-dealer"
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  if (userRole !== "dealer") {
    // Redirect to access denied page with explanatory message
    toast.error("You need dealer access for this page");
    return (
      <Navigate
        to="/access-denied"
        state={{ message: "You need dealer access for this page" }}
        replace
      />
    );
  }

>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
  return <>{children}</>;
};

export default DealerGuard;
