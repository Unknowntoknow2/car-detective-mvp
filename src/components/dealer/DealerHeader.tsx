
import React from 'react';
import { Bell, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

export const DealerHeader: React.FC = () => {
  const { userDetails } = useAuth();
  
  return (
    <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center md:hidden">
          <Button variant="ghost" size="icon" className="mr-2">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
          <h1 className="text-lg font-medium">Dealer Portal</h1>
        </div>
        
        <div className="flex items-center ml-auto">
          <Button variant="ghost" size="icon" className="mr-2">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>
          
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
              {userDetails?.full_name?.charAt(0) || 'D'}
            </div>
            <span className="ml-2 font-medium hidden sm:block">
              {userDetails?.full_name || 'Dealer User'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
