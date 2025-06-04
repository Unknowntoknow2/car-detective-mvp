<<<<<<< HEAD

import React from 'react';
import { Container } from '@/components/ui/container';
=======
import React from "react";
import { Navigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/components/auth/AuthContext";
import { Loader2 } from "lucide-react";
import { useAdminRole } from "@/hooks/useAdminRole";
import { AdminAnalyticsDashboard } from "@/components/admin/dashboard/AdminAnalyticsDashboard";
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

export default function AdminDashboardPage() {
  return (
    <Container className="max-w-6xl py-10">
      <div className="text-center space-y-6">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
          Admin Dashboard
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Administrative tools and analytics will be displayed here.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-2">User Management</h3>
            <p className="text-gray-600">Manage users and permissions</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-2">Analytics</h3>
            <p className="text-gray-600">View platform analytics and reports</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-2">Settings</h3>
            <p className="text-gray-600">Configure platform settings</p>
          </div>
        </div>
      </div>
    </Container>
  );
}
