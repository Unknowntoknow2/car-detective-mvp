
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export function Navbar() {
  const { user, signOut } = useAuth();

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
          {user ? (
            <>
              <Link to="/valuations">
                <Button variant="ghost">My Valuations</Button>
              </Link>
              <Button variant="outline" onClick={() => signOut()}>
                Sign Out
              </Button>
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
