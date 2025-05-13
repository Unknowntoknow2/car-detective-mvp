
import React, { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Link, useLocation } from 'react-router-dom';

interface NavItem {
  name: string;
  href: string;
  icon?: React.ReactNode;
}

interface SidebarProps {
  items: NavItem[];
  isMobile: boolean; // Changed from boolean to an object with isMobile property
}

export function Sidebar({ items, isMobile }: SidebarProps) {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const isActive = (href: string) => {
    return location.pathname === href;
  };

  const renderNavItems = () => {
    return items.map((item, index) => (
      <Link
        key={index}
        to={item.href}
        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all ${
          isActive(item.href) 
            ? 'bg-primary/10 text-primary font-medium' 
            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
        }`}
        onClick={() => isMobile && setOpen(false)}
      >
        {item.icon}
        {item.name}
      </Link>
    ));
  };

  // Mobile view (Sheet)
  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[240px] sm:w-[300px]">
          <nav className="flex flex-col gap-1 mt-4">
            {renderNavItems()}
          </nav>
        </SheetContent>
      </Sheet>
    );
  }

  // Desktop view
  return (
    <div className="hidden md:block w-[240px] flex-shrink-0">
      <nav className="flex flex-col gap-1 p-2">
        {renderNavItems()}
      </nav>
    </div>
  );
}
