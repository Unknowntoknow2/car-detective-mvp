<<<<<<< HEAD

import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { AINAssistantTrigger } from '@/components/chat/AINAssistantTrigger';
=======
import React from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { TooltipProvider } from "@/components/ui/tooltip";
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

const AppLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <AINAssistantTrigger />
    </div>
  );
};

export default AppLayout;
