
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import DealerSidebar from "@/components/dealer/DealerSidebar";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { AINAssistantTrigger } from "@/components/chat/AINAssistantTrigger";

interface DealerLayoutProps {
  children?: React.ReactNode;
}

const DealerLayout: React.FC<DealerLayoutProps> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleMobileSidebar = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <DealerSidebar
          collapsed={sidebarCollapsed}
          onToggleCollapse={toggleCollapse}
        />
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 z-50 md:hidden ${
          mobileOpen ? "block" : "hidden"
        }`}
      >
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm"
          onClick={toggleMobileSidebar}
        >
        </div>
        <div className="fixed inset-y-0 left-0">
          <DealerSidebar />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center border-b px-4 h-14">
          <Button
            variant="ghost"
            size="icon"
            className="mr-2"
            onClick={toggleMobileSidebar}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-md bg-primary/80 flex items-center justify-center text-white font-bold">
              CD
            </div>
            <h1 className="ml-3 font-semibold">CarDetective Dealer</h1>
          </div>
        </div>

        {/* Main Content Area */}
        <div
          className={`flex-1 overflow-auto p-6 transition-all duration-300 ${
            sidebarCollapsed ? "md:ml-20" : "md:ml-64"
          }`}
        >
          {children || <Outlet />}
        </div>
      </div>

      {/* AI Assistant Trigger */}
      <AINAssistantTrigger />
    </div>
  );
};

export default DealerLayout;
