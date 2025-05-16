
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export type User = {
  id: string;
  email: string;
  displayName?: string;
} | null;

export interface AuthContextType {
  user: User;
  userRole: 'user' | 'dealer' | 'admin' | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
  isLoading: boolean; // Alias for loading
}

// Create a mock implementation for development
const AuthContext = createContext<AuthContextType>({
  user: null,
  userRole: null,
  signIn: async () => {},
  signOut: async () => {},
  loading: false,
  isLoading: false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(null);
  const [userRole, setUserRole] = useState<'user' | 'dealer' | 'admin' | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for stored user in localStorage (mock auth)
    const storedUser = localStorage.getItem('authUser');
    const storedRole = localStorage.getItem('userRole');
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setUserRole((storedRole as 'user' | 'dealer' | 'admin') || 'user');
    }
    
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // Mock authentication - in a real app, this would call an auth API
      const mockUser = { id: '123', email };
      setUser(mockUser);
      
      // For demo purposes, set dealer role if email contains 'dealer'
      const role = email.includes('dealer') ? 'dealer' : 'user';
      setUserRole(role);
      
      // Store in localStorage for persistence
      localStorage.setItem('authUser', JSON.stringify(mockUser));
      localStorage.setItem('userRole', role);
      
      console.log('User signed in:', email, 'with role:', role);
      
      // In a real app we'd return the user here
      return;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      
      // Clear state and localStorage
      setUser(null);
      setUserRole(null);
      localStorage.removeItem('authUser');
      localStorage.removeItem('userRole');
      
      console.log('User signed out');
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      userRole, 
      signIn, 
      signOut, 
      loading,
      isLoading: loading // Add alias for compatibility
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
