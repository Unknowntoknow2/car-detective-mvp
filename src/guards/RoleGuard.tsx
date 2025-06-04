import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

<<<<<<< HEAD
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types/auth';
import { DEBUG_MODE } from '@/lib/constants';
=======
type RoleType = "dealer" | "admin" | "user" | string;
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

<<<<<<< HEAD
const RoleGuard: React.FC<RoleGuardProps> = ({ children, allowedRoles }) => {
  const { user, userDetails, isLoading } = useAuth();

  // In debug mode, bypass role check
  if (DEBUG_MODE) {
    return <>{children}</>;
  }

  // Show loading state while checking authentication
=======
const RoleGuard: React.FC<RoleGuardProps> = ({
  allowedRoles,
  children,
  redirectTo = "/auth",
}) => {
  const { user, userRole, isLoading } = useAuth();
  const location = useLocation();

>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

<<<<<<< HEAD
  // If user is not authenticated, redirect to unified auth page
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // If user doesn't have the required role, redirect to access denied
  if (!userDetails?.role || !allowedRoles.includes(userDetails.role as UserRole)) {
    return <Navigate to="/access-denied" replace />;
  }

  // If user has the required role, render the protected route
=======
  if (!user) {
    // Redirect to login with return URL
    return (
      <Navigate to={redirectTo} state={{ from: location.pathname }} replace />
    );
  }

  if (!allowedRoles.includes(userRole)) {
    // Redirect to access denied
    return (
      <Navigate
        to="/access-denied"
        state={{ requiredRole: allowedRoles.join(", ") }}
        replace
      />
    );
  }

>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
  return <>{children}</>;
};

export default RoleGuard;
