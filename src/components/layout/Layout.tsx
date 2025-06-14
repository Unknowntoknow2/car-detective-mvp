import React from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { useIsMobile } from "@/hooks/use-mobile";
import { TooltipProvider } from "@/components/ui/tooltip";

const Layout = () => {
  // Get isMobile directly, as the hook returns a boolean
  let isMobile = false;
  try {
    isMobile = useIsMobile();
  } catch (error) {
    console.error("Error in Layout when checking mobile status:", error);
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen flex flex-col bg-surface">
        <Navbar />
        <main
          className={`flex-grow container mx-auto ${
            isMobile ? "px-4 py-6" : "px-6 py-8"
          }`}
        >
          <Outlet />
        </main>
        <Footer />
      </div>
    </TooltipProvider>
  );
};

export default Layout;
