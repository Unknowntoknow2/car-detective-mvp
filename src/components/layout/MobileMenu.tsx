<<<<<<< HEAD

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useAuth } from '@/hooks/useAuth';
import { Home, Car, Search, User, Sparkles, Building, Settings, LogOut } from 'lucide-react';
=======
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useAuth } from "@/components/auth/AuthContext";
import {
  Building,
  Car,
  Home,
  LogOut,
  Search,
  Settings,
  Sparkles,
  User,
} from "lucide-react";
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

interface MobileMenuProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, setIsOpen }) => {
  const { user, userDetails, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsOpen(false);
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent side="left" className="w-[80%] sm:w-[350px]">
        <SheetHeader className="pb-6">
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 text-base"
            onClick={() => setIsOpen(false)}
          >
            <Home className="h-5 w-5" />
            Home
          </Link>
          <Link
            to="/valuation"
            className="flex items-center gap-2 text-base"
            onClick={() => setIsOpen(false)}
          >
            <Car className="h-5 w-5" />
            Valuations
          </Link>
          <Link
            to="/decoder"
            className="flex items-center gap-2 text-base"
            onClick={() => setIsOpen(false)}
          >
            <Search className="h-5 w-5" />
            VIN Decoder
          </Link>
          <Link
            to="/premium"
            className="flex items-center gap-2 text-base"
            onClick={() => setIsOpen(false)}
          >
            <Sparkles className="h-5 w-5" />
            Premium
          </Link>
<<<<<<< HEAD
          
          {user ? (
            <>
              <div className="h-px bg-border my-2" />
              <Link to="/dashboard" className="flex items-center gap-2 text-base" onClick={() => setIsOpen(false)}>
                <User className="h-5 w-5" />
                Dashboard
              </Link>
              
              {userDetails?.role === 'dealer' && (
                <Link to="/dealer-dashboard" className="flex items-center gap-2 text-base" onClick={() => setIsOpen(false)}>
                  <Building className="h-5 w-5" />
                  Dealer Dashboard
                </Link>
              )}
              
              <Link to="/settings" className="flex items-center gap-2 text-base" onClick={() => setIsOpen(false)}>
                <Settings className="h-5 w-5" />
                Settings
              </Link>
              
              <button 
                onClick={handleSignOut} 
                className="flex items-center gap-2 text-base text-red-600 hover:text-red-700 mt-2"
              >
                <LogOut className="h-5 w-5" />
                Sign out
              </button>
            </>
          ) : (
            <>
              <div className="h-px bg-border my-2" />
              <Link to="/auth" className="flex items-center gap-2 text-base" onClick={() => setIsOpen(false)}>
                <User className="h-5 w-5" />
                Sign In
              </Link>
              <Link to="/auth" className="flex items-center gap-2 text-base font-medium" onClick={() => setIsOpen(false)}>
                <User className="h-5 w-5" />
                Sign Up
              </Link>
            </>
          )}
=======

          {user
            ? (
              <>
                <div className="h-px bg-border my-2" />
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 text-base"
                  onClick={() => setIsOpen(false)}
                >
                  <User className="h-5 w-5" />
                  Dashboard
                </Link>

                {userRole === "dealer" && (
                  <Link
                    to="/dealer-dashboard"
                    className="flex items-center gap-2 text-base"
                    onClick={() => setIsOpen(false)}
                  >
                    <Building className="h-5 w-5" />
                    Dealer Dashboard
                  </Link>
                )}

                <Link
                  to="/settings"
                  className="flex items-center gap-2 text-base"
                  onClick={() => setIsOpen(false)}
                >
                  <Settings className="h-5 w-5" />
                  Settings
                </Link>

                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 text-base text-red-600 hover:text-red-700 mt-2"
                >
                  <LogOut className="h-5 w-5" />
                  Sign out
                </button>
              </>
            )
            : (
              <>
                <div className="h-px bg-border my-2" />
                <Link
                  to="/auth"
                  className="flex items-center gap-2 text-base"
                  onClick={() => setIsOpen(false)}
                >
                  <User className="h-5 w-5" />
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-2 text-base font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  <User className="h-5 w-5" />
                  Sign Up
                </Link>
              </>
            )}
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
