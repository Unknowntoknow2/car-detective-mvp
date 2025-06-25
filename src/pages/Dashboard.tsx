
import React from "react";
import { EnhancedErrorBoundary } from "@/components/common/EnhancedErrorBoundary";
import DashboardRouter from "@/components/dashboard/DashboardRouter";

const Dashboard = () => {
  return (
    <EnhancedErrorBoundary
      context="Dashboard"
      fallback={
        <div className="container p-8">
          <div className="p-6 rounded-lg bg-red-50 border border-red-200 text-center">
            <h2 className="text-xl font-semibold text-red-700 mb-4">
              Dashboard Error
            </h2>
            <p className="text-red-600 mb-6">
              We encountered an issue loading your dashboard. Please try again
              or contact support.
            </p>
          </div>
        </div>
      }
    >
      <DashboardRouter />
    </EnhancedErrorBoundary>
  );
};

export default Dashboard;
