
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { User, Building, Home, BarChart3, Settings, LogOut, FileText, PlusCircle } from 'lucide-react';

interface MobileMenuProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, setIsOpen }) => {
  const { user, userRole, signOut } = useAuth();

  const closeMenu = () => setIsOpen(false);

  const handleSignOut = async () => {
    await signOut();
    closeMenu();
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="md:hidden bg-white border-b border-gray-200 overflow-hidden"
    >
      <div className="flex flex-col p-4 space-y-4">
        {/* Common Navigation Links */}
        <Link to="/" className="flex items-center p-2 hover:bg-gray-100 rounded-md" onClick={closeMenu}>
          <Home className="h-4 w-4 mr-3" />
          <span>Home</span>
        </Link>
        
        <Link to="/valuation" className="flex items-center p-2 hover:bg-gray-100 rounded-md" onClick={closeMenu}>
          <FileText className="h-4 w-4 mr-3" />
          <span>Valuations</span>
        </Link>
        
        <Link to="/decoder" className="flex items-center p-2 hover:bg-gray-100 rounded-md" onClick={closeMenu}>
          <PlusCircle className="h-4 w-4 mr-3" />
          <span>VIN Decoder</span>
        </Link>
        
        <Link to="/premium" className="flex items-center p-2 hover:bg-gray-100 rounded-md" onClick={closeMenu}>
          <FileText className="h-4 w-4 mr-3" />
          <span>Premium</span>
        </Link>
        
        <Separator />
        
        {/* Authenticated User Navigation */}
        {user ? (
          <>
            {/* Individual user links */}
            {userRole === 'individual' && (
              <>
                <Link to="/dashboard" className="flex items-center p-2 hover:bg-gray-100 rounded-md" onClick={closeMenu}>
                  <BarChart3 className="h-4 w-4 mr-3" />
                  <span>Dashboard</span>
                </Link>
                <Link to="/my-valuations" className="flex items-center p-2 hover:bg-gray-100 rounded-md" onClick={closeMenu}>
                  <FileText className="h-4 w-4 mr-3" />
                  <span>My Valuations</span>
                </Link>
              </>
            )}
            
            {/* Dealer links */}
            {userRole === 'dealer' && (
              <>
                <Link to="/dealer-dashboard" className="flex items-center p-2 hover:bg-gray-100 rounded-md" onClick={closeMenu}>
                  <Building className="h-4 w-4 mr-3" />
                  <span>Dealer Dashboard</span>
                </Link>
              </>
            )}
            
            {/* Common authenticated user links */}
            <Link to="/settings" className="flex items-center p-2 hover:bg-gray-100 rounded-md" onClick={closeMenu}>
              <Settings className="h-4 w-4 mr-3" />
              <span>Settings</span>
            </Link>
            
            <Button variant="destructive" className="w-full justify-start" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-3" />
              <span>Sign Out</span>
            </Button>
          </>
        ) : (
          <>
            <Link to="/auth" className="flex items-center p-2 hover:bg-gray-100 rounded-md" onClick={closeMenu}>
              <User className="h-4 w-4 mr-3" />
              <span>Sign In</span>
            </Link>
            <Button className="w-full" asChild>
              <Link to="/register" onClick={closeMenu}>Sign Up</Link>
            </Button>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default MobileMenu;
