import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define user roles
export type UserRole = 'child' | 'parent' | 'guest';

// Define user interface
export interface User {
  id: string;
  name: string;
  role: UserRole;
  age?: number;
  parentId?: string;
}

// Define auth context type
interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  switchToParentMode: () => void;
  switchToChildMode: () => void;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  login: () => {},
  logout: () => {},
  switchToParentMode: () => {},
  switchToChildMode: () => {},
});

// Custom hook for using auth context
export const useAuth = () => useContext(AuthContext);

// Provider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [previousUser, setPreviousUser] = useState<User | null>(null);

  // Login function
  const login = (userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setPreviousUser(null);
    setIsAuthenticated(false);
  };

  // Switch to parent mode
  const switchToParentMode = () => {
    if (user && user.role === 'child' && user.parentId) {
      setPreviousUser(user);
      // In a real app, you would fetch the parent user data
      // For now, we'll create a mock parent user
      setUser({
        id: user.parentId,
        name: 'Parent',
        role: 'parent',
      });
    }
  };

  // Switch to child mode
  const switchToChildMode = () => {
    if (user && user.role === 'parent' && previousUser) {
      setUser(previousUser);
      setPreviousUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        switchToParentMode,
        switchToChildMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
