
import React from 'react';
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AINAssistantTrigger } from "@/components/chat/AINAssistantTrigger";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      <AINAssistantTrigger />
    </div>
  );
};

export default MainLayout;
