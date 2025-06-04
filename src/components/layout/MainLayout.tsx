<<<<<<< HEAD

import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
=======
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

interface MainLayoutProps {
  children: React.ReactNode;
}

<<<<<<< HEAD
export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
=======
const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  // Add diagnostic logging
  console.log("🔄 MainLayout rendering...");

  useEffect(() => {
    console.log("✅ MainLayout mounted");
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white shadow-sm dark:bg-gray-800">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-xl font-bold text-primary">
            CarDetective
          </Link>

          <nav className="space-x-4">
            <Link
              to="/sign-in"
              className="text-sm font-medium text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-white"
            >
              Sign In
            </Link>
            <Link
              to="/sign-up"
              className="text-sm font-medium bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90"
            >
              Sign Up
            </Link>
          </nav>
        </div>
      </header>

      <main className="w-full">
        {/* Fallback to ensure children are rendered */}
        {!children && (
          <div className="p-4 bg-red-100 text-red-800">
            Warning: No children passed to MainLayout!
          </div>
        )}
        {children}
      </main>

      <footer className="bg-white border-t mt-12 py-6 dark:bg-gray-800 dark:border-gray-700">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>© {new Date().getFullYear()} CarDetective. All rights reserved.</p>
        </div>
      </footer>
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
    </div>
  );
}

export default MainLayout;
