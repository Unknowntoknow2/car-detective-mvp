
import React, { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { UserRole } from "@/types/auth";
import { Loader2 } from "lucide-react";

interface AuthenticatedLayoutProps {
  children: ReactNode;
  requireRole?: UserRole;
}

const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({
  children,
  requireRole,
}) => {
  const { user, userDetails, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/auth", { state: { from: globalThis.location.pathname } });
    }

    if (
      !isLoading && user && requireRole && userDetails?.role !== requireRole
    ) {
      navigate("/access-denied");
    }
  }, [user, userDetails, isLoading, navigate, requireRole]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-subtle">
        <div className="text-center animate-fade-in">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">Loading Dashboard</h2>
          <p className="text-muted-foreground">Please wait while we prepare your experience...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  if (requireRole && userDetails?.role !== requireRole) {
    return null; // Will redirect in useEffect
  }

  return <>{children}</>;
};

export default AuthenticatedLayout;
