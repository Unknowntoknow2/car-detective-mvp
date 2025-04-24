
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Mail, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const { user, signOut, isLoading } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link to="/" className="flex items-center space-x-2">
          <span className="font-bold text-xl">CarDetective</span>
        </Link>
        <nav className="ml-auto flex gap-4 items-center">
          <Link to="/">
            <Button variant="ghost">Home</Button>
          </Link>
          <Link to="/lookup/vin">
            <Button variant="ghost">VIN Lookup</Button>
          </Link>
          <Link to="/lookup/plate">
            <Button variant="ghost">Plate Lookup</Button>
          </Link>
          
          {isLoading ? (
            <div className="h-9 w-24 bg-muted animate-pulse rounded-md"></div>
          ) : user ? (
            <>
              <Link to="/valuations">
                <Button variant="ghost">My Valuations</Button>
              </Link>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Mail className="h-4 w-4" />
                    {user.email ? user.email.split('@')[0] : 'Account'}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    {user.email || user.phone || 'User'}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/valuations">My Valuations</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => signOut()} className="text-destructive flex items-center gap-2">
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Link to="/auth">
              <Button>Sign In</Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
