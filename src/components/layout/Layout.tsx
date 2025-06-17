
import React from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import Footer from "./Footer";

interface LayoutProps {
  children?: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-6">
        {children || <Outlet />}
      </main>
      <Footer />
    </div>
  );
}
