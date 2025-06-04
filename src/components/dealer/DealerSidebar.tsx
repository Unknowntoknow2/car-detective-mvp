<<<<<<< HEAD

import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Car, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';

interface DealerSidebarProps {
=======
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Package,
  Plus,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/utils/supabaseClient";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  {
    title: "Dashboard",
    href: "/dealer/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    title: "Inventory",
    href: "/dealer/inventory",
    icon: <Package className="h-5 w-5" />,
  },
  {
    title: "Add Vehicle",
    href: "/dealer/inventory/add",
    icon: <Plus className="h-5 w-5" />,
  },
  {
    title: "Subscription",
    href: "/dealer-subscription",
    icon: <CreditCard className="h-5 w-5" />,
  },
];

type DealerSidebarProps = {
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

<<<<<<< HEAD
export const DealerSidebar: React.FC<DealerSidebarProps> = ({ 
  collapsed = false, 
  onToggleCollapse 
}) => {
  const { signOut, userDetails } = useAuth();
  
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dealer/dashboard' },
    { icon: Car, label: 'Inventory', path: '/dealer/inventory' },
    { icon: Users, label: 'Leads', path: '/dealer/leads' },
    { icon: BarChart3, label: 'Analytics', path: '/dealer/analytics' },
    { icon: Settings, label: 'Settings', path: '/dealer/settings' },
  ];
  
  return (
    <div 
      className={`${collapsed ? 'w-20' : 'w-64'} transition-all duration-300 flex flex-col h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700`}
    >
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        {!collapsed && (
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            Dealer Portal
          </h2>
=======
const DealerSidebar: React.FC<DealerSidebarProps> = ({
  collapsed = false,
  onToggleCollapse,
}) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div
      className={cn(
        "flex flex-col h-screen bg-white border-r transition-all duration-300",
        collapsed ? "w-20" : "w-64",
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
            {collapsed
              ? <ChevronRight className="h-4 w-4" />
              : <ChevronLeft className="h-4 w-4" />}
          </Button>
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
        )}
        {userDetails?.dealership_name && !collapsed && (
          <p className="text-sm text-muted-foreground">
            {userDetails.dealership_name}
          </p>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onToggleCollapse}
          className="ml-auto"
        >
          {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          <span className="sr-only">Toggle sidebar</span>
        </Button>
      </div>
<<<<<<< HEAD
      
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
=======

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
                    isActive
                      ? "bg-muted font-medium text-primary"
                      : "text-muted-foreground",
                    collapsed ? "justify-center" : "justify-start",
                  )}
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
                collapsed ? "justify-center" : "justify-start",
              )}
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
            >
              <Icon className="mr-3 h-5 w-5" />
              {!collapsed && item.label}
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
          {!collapsed && "Sign Out"}
        </button>
      </div>
    </div>
  );
};
