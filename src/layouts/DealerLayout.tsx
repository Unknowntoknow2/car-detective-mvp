
import React from 'react';

interface DealerLayoutProps {
  children: React.ReactNode;
}

export function DealerLayout({ children }: DealerLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DealerLayout;
