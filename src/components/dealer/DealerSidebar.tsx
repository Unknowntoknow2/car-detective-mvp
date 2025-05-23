
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Car, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export const DealerSidebar: React.FC = () => {
  const { signOut, userDetails } = useAuth();
  
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dealer/dashboard' },
    { icon: Car, label: 'Inventory', path: '/dealer/inventory' },
    { icon: Users, label: 'Leads', path: '/dealer/leads' },
    { icon: BarChart3, label: 'Analytics', path: '/dealer/analytics' },
    { icon: Settings, label: 'Settings', path: '/dealer/settings' },
  ];
  
  return (
    <div className="hidden md:flex w-64 flex-col h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
          Dealer Portal
        </h2>
        {userDetails?.dealership_name && (
          <p className="text-sm text-muted-foreground">
            {userDetails.dealership_name}
          </p>
        )}
      </div>
      
      <nav className="flex-1 py-4 px-2 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`
              }
            >
              <Icon className="mr-3 h-5 w-5" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={() => signOut()}
          className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Sign Out
        </button>
      </div>
    </div>
  );
};
