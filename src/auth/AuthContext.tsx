import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  AdultUser, 
  ChildUser, 
  AccountType, 
  AuthSession, 
  AdultLoginCredentials, 
  ChildLoginCredentials,
  ConsentStatus,
  CardanoWalletConnection
} from './types';
// Import services with explicit file extensions to help TypeScript find them
import { authService } from './authService.js';
import { walletConnector } from './walletConnector.js';

// Define the shape of the auth context
interface AuthContextType {
  // Current user state
  currentUser: AdultUser | ChildUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isParent: boolean;
  isTeacher: boolean;
  isChild: boolean;
  
  // Authentication methods
  loginAdult: (credentials: AdultLoginCredentials) => Promise<AdultUser>;
  loginChild: (credentials: ChildLoginCredentials) => Promise<ChildUser>;
  logout: () => Promise<void>;
  
  // Wallet connection methods
  connectWallet: (walletType: string) => Promise<CardanoWalletConnection>;
  disconnectWallet: () => Promise<void>;
  walletConnection: CardanoWalletConnection | null;
  
  // Child account management
  createChildAccount: (childData: Partial<ChildUser>) => Promise<ChildUser>;
  getChildAccounts: () => Promise<ChildUser[]>;
  updateChildAccount: (childId: string, updates: Partial<ChildUser>) => Promise<ChildUser>;
  
  // Consent management
  updateConsentStatus: (childId: string, status: ConsentStatus) => Promise<void>;
  
  // Session management
  refreshSession: () => Promise<void>;
  
  // Error handling
  error: Error | null;
  clearError: () => void;
}

// Create the context with default values
const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  isAuthenticated: false,
  isLoading: true,
  isParent: false,
  isTeacher: false,
  isChild: false,
  
  loginAdult: async () => { throw new Error('Not implemented'); },
  loginChild: async () => { throw new Error('Not implemented'); },
  logout: async () => { throw new Error('Not implemented'); },
  
  connectWallet: async () => { throw new Error('Not implemented'); },
  disconnectWallet: async () => { throw new Error('Not implemented'); },
  walletConnection: null,
  
  createChildAccount: async () => { throw new Error('Not implemented'); },
  getChildAccounts: async () => { throw new Error('Not implemented'); },
  updateChildAccount: async () => { throw new Error('Not implemented'); },
  
  updateConsentStatus: async () => { throw new Error('Not implemented'); },
  
  refreshSession: async () => { throw new Error('Not implemented'); },
  
  error: null,
  clearError: () => {},
});

// Provider component to wrap the app
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AdultUser | ChildUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [walletConnection, setWalletConnection] = useState<CardanoWalletConnection | null>(null);
  const [error, setError] = useState<Error | null>(null);
  
  // Computed properties
  const isAuthenticated = !!currentUser;
  const isParent = currentUser?.accountType === AccountType.PARENT;
  const isTeacher = currentUser?.accountType === AccountType.TEACHER;
  const isChild = currentUser?.accountType === AccountType.CHILD;
  
  // Initialize auth state on component mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        setIsLoading(true);
        
        // Check for existing session
        const session = await authService.getSession();
        if (session) {
          // Fetch user data based on session
          const userData = await authService.getCurrentUser();
          setCurrentUser(userData);
          
          // Check for wallet connection if adult user
          if (userData.accountType !== AccountType.CHILD) {
            const savedWallet = await walletConnector.getSavedWallet();
            if (savedWallet) {
              setWalletConnection(savedWallet);
            }
          }
        }
      } catch (err) {
        console.error('Failed to initialize auth:', err);
        setError(err instanceof Error ? err : new Error('Failed to initialize auth'));
      } finally {
        setIsLoading(false);
      }
    };
    
    initAuth();
  }, []);
  
  // Adult login handler
  const loginAdult = async (credentials: AdultLoginCredentials): Promise<AdultUser> => {
    try {
      setIsLoading(true);
      const user = await authService.loginAdult(credentials);
      setCurrentUser(user);
      return user;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Login failed'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Child login handler with picture password
  const loginChild = async (credentials: ChildLoginCredentials): Promise<ChildUser> => {
    try {
      setIsLoading(true);
      const user = await authService.loginChild(credentials);
      setCurrentUser(user);
      return user;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Login failed'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Logout handler
  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      await authService.logout();
      setCurrentUser(null);
      setWalletConnection(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Logout failed'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Wallet connection handler
  const connectWallet = async (walletType: string): Promise<CardanoWalletConnection> => {
    try {
      setIsLoading(true);
      const connection = await walletConnector.connect(walletType);
      setWalletConnection(connection);
      
      // If user is logged in, associate wallet with user
      if (currentUser && currentUser.accountType !== AccountType.CHILD) {
        await authService.associateWallet(currentUser.id, connection);
        
        // Update current user with wallet info
        const updatedUser = await authService.getCurrentUser();
        setCurrentUser(updatedUser);
      }
      
      return connection;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Wallet connection failed'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Wallet disconnection handler
  const disconnectWallet = async (): Promise<void> => {
    try {
      setIsLoading(true);
      if (walletConnection) {
        await walletConnector.disconnect(walletConnection.walletId);
        
        // If user is logged in, disassociate wallet from user
        if (currentUser && currentUser.accountType !== AccountType.CHILD) {
          await authService.disassociateWallet(currentUser.id);
          
          // Update current user without wallet info
          const updatedUser = await authService.getCurrentUser();
          setCurrentUser(updatedUser);
        }
        
        setWalletConnection(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Wallet disconnection failed'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Child account creation
  const createChildAccount = async (childData: Partial<ChildUser>): Promise<ChildUser> => {
    try {
      setIsLoading(true);
      
      // Ensure the current user is a parent or teacher
      if (!currentUser || (currentUser.accountType !== AccountType.PARENT && currentUser.accountType !== AccountType.TEACHER)) {
        throw new Error('Only parents or teachers can create child accounts');
      }
      
      const newChild = await authService.createChildAccount(currentUser.id, childData);
      
      // Update current user to include the new child account
      const updatedUser = await authService.getCurrentUser();
      setCurrentUser(updatedUser);
      
      return newChild;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create child account'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Get child accounts
  const getChildAccounts = async (): Promise<ChildUser[]> => {
    try {
      setIsLoading(true);
      
      // Ensure the current user is a parent or teacher
      if (!currentUser || (currentUser.accountType !== AccountType.PARENT && currentUser.accountType !== AccountType.TEACHER)) {
        throw new Error('Only parents or teachers can access child accounts');
      }
      
      return await authService.getChildAccounts(currentUser.id);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to get child accounts'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Update child account
  const updateChildAccount = async (childId: string, updates: Partial<ChildUser>): Promise<ChildUser> => {
    try {
      setIsLoading(true);
      
      // Ensure the current user is a parent or teacher
      if (!currentUser || (currentUser.accountType !== AccountType.PARENT && currentUser.accountType !== AccountType.TEACHER)) {
        throw new Error('Only parents or teachers can update child accounts');
      }
      
      const updatedChild = await authService.updateChildAccount(currentUser.id, childId, updates);
      
      // Note: This code is unreachable because we already checked that currentUser is a parent or teacher
      // We've removed the child check as it creates a TypeScript error due to type narrowing
      
      return updatedChild;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update child account'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Update consent status
  const updateConsentStatus = async (childId: string, status: ConsentStatus): Promise<void> => {
    try {
      setIsLoading(true);
      
      // Ensure the current user is a parent or teacher
      if (!currentUser || (currentUser.accountType !== AccountType.PARENT && currentUser.accountType !== AccountType.TEACHER)) {
        throw new Error('Only parents or teachers can update consent status');
      }
      
      await authService.updateConsentStatus(currentUser.id, childId, status);
      
      // Update current user to reflect consent changes
      const updatedUser = await authService.getCurrentUser();
      setCurrentUser(updatedUser);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update consent status'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Refresh session
  const refreshSession = async (): Promise<void> => {
    try {
      setIsLoading(true);
      await authService.refreshSession();
      
      // Update current user
      const userData = await authService.getCurrentUser();
      setCurrentUser(userData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to refresh session'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Clear error
  const clearError = (): void => {
    setError(null);
  };
  
  // Context value
  const contextValue: AuthContextType = {
    currentUser,
    isAuthenticated,
    isLoading,
    isParent,
    isTeacher,
    isChild,
    
    loginAdult,
    loginChild,
    logout,
    
    connectWallet,
    disconnectWallet,
    walletConnection,
    
    createChildAccount,
    getChildAccounts,
    updateChildAccount,
    
    updateConsentStatus,
    
    refreshSession,
    
    error,
    clearError,
  };
  
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using the auth context
export const useAuth = () => useContext(AuthContext);
