<<<<<<< HEAD

import React from 'react';
import { Container } from '@/components/ui/container';
=======
import React from "react";
import { AdminAnalyticsDashboard } from "@/components/admin/AdminAnalyticsDashboard";
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

export default function AdminDashboard() {
  return (
    <Container className="max-w-6xl py-10">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
          Admin Dashboard
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Administrative tools and analytics will be displayed here.
        </p>
      </div>
    </Container>
  );
}
