import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Car, Menu, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <Car className="h-6 w-6" />
            <span className="font-bold">Car Price Perfector</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              to="/lookup/vin"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              VIN Lookup
            </Link>
            <Link
              to="/lookup/plate"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Plate Lookup
            </Link>
            <Link
              to="/premium"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Premium
            </Link>
            {user && (
              <Link
                to="/dashboard"
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                Dashboard
              </Link>
            )}
          </nav>
        </div>
        
        <div className="ml-auto flex items-center space-x-4">
          {!user ? (
            <>
              <Link to="/auth">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
            </>
          ) : (
            <Button variant="outline" size="sm" onClick={signOut}>
              Sign Out
            </Button>
          )}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="sm" className="px-0">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-sm">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
                <SheetDescription>
                  Explore Car Price Perfector
                </SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                <Link to="/" className="px-4 py-2 hover:bg-secondary/50 rounded-md">
                  Home
                </Link>
                <Link to="/lookup/vin" className="px-4 py-2 hover:bg-secondary/50 rounded-md">
                  VIN Lookup
                </Link>
                <Link to="/lookup/plate" className="px-4 py-2 hover:bg-secondary/50 rounded-md">
                  Plate Lookup
                </Link>
                 <Link to="/premium" className="px-4 py-2 hover:bg-secondary/50 rounded-md">
                  Premium
                </Link>
                {user && (
                  <Link to="/dashboard" className="px-4 py-2 hover:bg-secondary/50 rounded-md">
                    Dashboard
                  </Link>
                )}
                {!user ? (
                  <Link to="/auth" className="px-4 py-2 hover:bg-secondary/50 rounded-md">
                    Sign In
                  </Link>
                ) : (
                  <Button variant="outline" size="sm" onClick={signOut}>
                    Sign Out
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
