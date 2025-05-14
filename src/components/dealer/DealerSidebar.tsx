
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, Plus, CreditCard, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/utils/supabaseClient';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navItems = [
  {
    title: 'Dashboard',
    href: '/dealer/dashboard',
    icon: <LayoutDashboard className="h-5 w-5" />
  },
  {
    title: 'Inventory',
    href: '/dealer/inventory',
    icon: <Package className="h-5 w-5" />
  },
  {
    title: 'Add Vehicle',
    href: '/dealer/inventory/add',
    icon: <Plus className="h-5 w-5" />
  },
  {
    title: 'Subscription',
    href: '/dealer-subscription',
    icon: <CreditCard className="h-5 w-5" />
  }
];

type DealerSidebarProps = {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
};

const DealerSidebar: React.FC<DealerSidebarProps> = ({ 
  collapsed = false, 
  onToggleCollapse 
}) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div 
      className={cn(
        "flex flex-col h-screen bg-white border-r transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Header with logo/branding */}
      <div className="p-4 flex items-center justify-between border-b">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-md bg-primary/80 flex items-center justify-center text-white font-bold">
            CD
          </div>
          {!collapsed && (
            <h1 className="ml-3 font-semibold truncate">CarDetective Dealer</h1>
          )}
        </div>
        {onToggleCollapse && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onToggleCollapse} 
            className="h-8 w-8"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        )}
      </div>

      {/* Navigation links */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    "flex items-center rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted/50",
                    isActive ? "bg-muted font-medium text-primary" : "text-muted-foreground",
                    collapsed ? "justify-center" : "justify-start"
                  )
                }
              >
                <span className="min-w-5">{item.icon}</span>
                {!collapsed && <span className="ml-3">{item.title}</span>}
              </NavLink>
            </li>
          ))}
          <li>
            <button
              onClick={handleSignOut}
              className={cn(
                "flex items-center rounded-md px-3 py-2 text-sm transition-colors w-full hover:bg-muted/50 text-muted-foreground",
                collapsed ? "justify-center" : "justify-start"
              )}
            >
              <LogOut className="h-5 w-5 min-w-5" />
              {!collapsed && <span className="ml-3">Sign Out</span>}
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default DealerSidebar;
