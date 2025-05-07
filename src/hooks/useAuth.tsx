
import React, { createContext, useContext, useState, useEffect } from 'react';

// Define the shape of our auth context
interface AuthContextType {
  isAuthenticated: boolean;
  user: any | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
}

// Create a context with a default value
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: async () => {},
  logout: async () => {},
  register: async () => {},
});

// Create a provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  
  // Check for existing auth on mount
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        // In a real app, we would validate the token
        setIsAuthenticated(true);
        // In a real app, we would fetch user data
        setUser({ id: '123', name: 'Test User' });
      }
    };
    
    checkAuth();
  }, []);
  
  // Login function
  const login = async (email: string, password: string) => {
    try {
      // In a real app, this would call an API
      console.log('Logging in with:', email, password);
      
      // Simulate a successful login
      localStorage.setItem('auth_token', 'fake-token');
      setIsAuthenticated(true);
      setUser({ id: '123', name: 'Test User', email });
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };
  
  // Logout function
  const logout = async () => {
    try {
      // In a real app, this would call an API
      localStorage.removeItem('auth_token');
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };
  
  // Register function
  const register = async (email: string, password: string, name: string) => {
    try {
      // In a real app, this would call an API
      console.log('Registering with:', email, password, name);
      
      // Simulate a successful registration followed by login
      localStorage.setItem('auth_token', 'fake-token');
      setIsAuthenticated(true);
      setUser({ id: '123', name, email });
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };
  
  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

// Create a hook for using the auth context
export function useAuth() {
  return useContext(AuthContext);
}
