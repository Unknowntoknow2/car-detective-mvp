
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Container } from '@/components/ui/container';

export default function DealerLayoutPage() {
  return (
    <Container className="max-w-6xl py-10">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Dealer Portal
          </h1>
          <p className="text-gray-600">
            Manage your dealership and inventory.
          </p>
        </div>
        <Outlet />
      </div>
    </Container>
  );
}
