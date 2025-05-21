/**
 * Authentication Service for Cardano Kids Platform
 * 
 * This service handles all authentication-related operations, including:
 * - Adult user authentication (parents/teachers)
 * - Child user authentication with picture passwords
 * - Wallet association for adult accounts
 * - Child account management
 * - Consent management
 * - Session handling
 */

import { 
  AdultUser, 
  ChildUser, 
  AccountType, 
  AuthSession, 
  AdultLoginCredentials, 
  ChildLoginCredentials,
  ConsentStatus,
  CardanoWalletConnection,
  PicturePassword,
  ConsentRecord
} from './types';
import { api } from '../api/apiClient';
import { secureStorage } from '../utils/secureStorage';

// Constants
const SESSION_KEY = 'cardano_kids_session';
const TOKEN_EXPIRY_BUFFER = 5 * 60 * 1000; // 5 minutes in milliseconds

class AuthService {
  private currentSession: AuthSession | null = null;
  
  /**
   * Initialize the auth service and restore session if available
   */
  constructor() {
    this.restoreSession();
  }
  
  /**
   * Restore session from secure storage
   */
  private restoreSession(): void {
    try {
      const sessionData = secureStorage.getItem(SESSION_KEY);
      if (sessionData) {
        const session = JSON.parse(sessionData) as AuthSession;
        
        // Check if session is expired
        if (new Date(session.expiresAt) > new Date()) {
          this.currentSession = session;
          
          // Set authorization header for API calls
          api.setAuthToken(session.token);
        } else {
          // Session expired, clear it
          this.clearSession();
        }
      }
    } catch (error) {
      console.error('Failed to restore session:', error);
      this.clearSession();
    }
  }
  
  /**
   * Save session to secure storage
   */
  private saveSession(session: AuthSession): void {
    this.currentSession = session;
    secureStorage.setItem(SESSION_KEY, JSON.stringify(session));
    api.setAuthToken(session.token);
  }
  
  /**
   * Clear session from secure storage
   */
  private clearSession(): void {
    this.currentSession = null;
    secureStorage.removeItem(SESSION_KEY);
    api.clearAuthToken();
  }
  
  /**
   * Get current session
   */
  async getSession(): Promise<AuthSession | null> {
    // If session is about to expire, refresh it
    if (this.currentSession) {
      const now = new Date();
      const expiresAt = new Date(this.currentSession.expiresAt);
      const timeUntilExpiry = expiresAt.getTime() - now.getTime();
      
      if (timeUntilExpiry < TOKEN_EXPIRY_BUFFER) {
        await this.refreshSession();
      }
    }
    
    return this.currentSession;
  }
  
  /**
   * Refresh the current session
   */
  async refreshSession(): Promise<void> {
    if (!this.currentSession) {
      throw new Error('No active session to refresh');
    }
    
    try {
      const response = await api.post('/auth/refresh-token', {
        userId: this.currentSession.userId,
        token: this.currentSession.token
      });
      
      this.saveSession(response.data);
    } catch (error) {
      console.error('Failed to refresh session:', error);
      this.clearSession();
      throw error;
    }
  }
  
  /**
   * Get current user data
   */
  async getCurrentUser(): Promise<AdultUser | ChildUser> {
    if (!this.currentSession) {
      throw new Error('No active session');
    }
    
    try {
      const response = await api.get(`/users/${this.currentSession.userId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get current user:', error);
      throw error;
    }
  }
  
  /**
   * Login for adult users (parents/teachers)
   */
  async loginAdult(credentials: AdultLoginCredentials): Promise<AdultUser> {
    try {
      const response = await api.post('/auth/login/adult', credentials);
      
      // Save session
      this.saveSession(response.data.session);
      
      return response.data.user;
    } catch (error) {
      console.error('Adult login failed:', error);
      throw error;
    }
  }
  
  /**
   * Login for child users with picture password
   */
  async loginChild(credentials: ChildLoginCredentials): Promise<ChildUser> {
    try {
      const response = await api.post('/auth/login/child', credentials);
      
      // Check if parent approval is required
      if (response.data.requiresParentApproval) {
        // Return partial user data without creating a session
        return response.data.user;
      }
      
      // Save session
      this.saveSession(response.data.session);
      
      return response.data.user;
    } catch (error) {
      console.error('Child login failed:', error);
      throw error;
    }
  }
  
  /**
   * Logout the current user
   */
  async logout(): Promise<void> {
    if (this.currentSession) {
      try {
        await api.post('/auth/logout', {
          userId: this.currentSession.userId,
          token: this.currentSession.token
        });
      } catch (error) {
        console.error('Logout API call failed:', error);
        // Continue with local logout even if API call fails
      }
      
      this.clearSession();
    }
  }
  
  /**
   * Associate a wallet with an adult user
   */
  async associateWallet(userId: string, wallet: CardanoWalletConnection): Promise<void> {
    try {
      await api.post(`/users/${userId}/wallet`, {
        walletId: wallet.walletId,
        walletName: wallet.walletName,
        walletType: wallet.walletType,
        stakeAddress: wallet.stakeAddress
      });
    } catch (error) {
      console.error('Failed to associate wallet:', error);
      throw error;
    }
  }
  
  /**
   * Disassociate a wallet from an adult user
   */
  async disassociateWallet(userId: string): Promise<void> {
    try {
      await api.delete(`/users/${userId}/wallet`);
    } catch (error) {
      console.error('Failed to disassociate wallet:', error);
      throw error;
    }
  }
  
  /**
   * Create a child account
   */
  async createChildAccount(parentId: string, childData: Partial<ChildUser>): Promise<ChildUser> {
    try {
      const response = await api.post(`/users/${parentId}/children`, childData);
      return response.data;
    } catch (error) {
      console.error('Failed to create child account:', error);
      throw error;
    }
  }
  
  /**
   * Get child accounts for a parent/teacher
   */
  async getChildAccounts(parentId: string): Promise<ChildUser[]> {
    try {
      const response = await api.get(`/users/${parentId}/children`);
      return response.data;
    } catch (error) {
      console.error('Failed to get child accounts:', error);
      throw error;
    }
  }
  
  /**
   * Update a child account
   */
  async updateChildAccount(parentId: string, childId: string, updates: Partial<ChildUser>): Promise<ChildUser> {
    try {
      const response = await api.put(`/users/${parentId}/children/${childId}`, updates);
      return response.data;
    } catch (error) {
      console.error('Failed to update child account:', error);
      throw error;
    }
  }
  
  /**
   * Update consent status for a child
   */
  async updateConsentStatus(parentId: string, childId: string, status: ConsentStatus): Promise<void> {
    try {
      await api.put(`/users/${parentId}/children/${childId}/consent`, { status });
    } catch (error) {
      console.error('Failed to update consent status:', error);
      throw error;
    }
  }
  
  /**
   * Set up picture password for a child
   */
  async setPicturePassword(childId: string, picturePassword: PicturePassword): Promise<void> {
    try {
      await api.put(`/users/${childId}/picture-password`, { picturePassword });
    } catch (error) {
      console.error('Failed to set picture password:', error);
      throw error;
    }
  }
  
  /**
   * Get available picture categories for picture password
   */
  async getPictureCategories(): Promise<Array<{
    id: string;
    name: string;
    images: Array<{
      id: string;
      url: string;
      alt: string;
    }>;
  }>> {
    try {
      const response = await api.get('/auth/picture-categories');
      return response.data;
    } catch (error) {
      console.error('Failed to get picture categories:', error);
      throw error;
    }
  }
  
  /**
   * Record parental consent
   */
  async recordConsent(parentId: string, childId: string, consentData: Partial<ConsentRecord>): Promise<ConsentRecord> {
    try {
      const response = await api.post(`/users/${parentId}/children/${childId}/consent`, consentData);
      return response.data;
    } catch (error) {
      console.error('Failed to record consent:', error);
      throw error;
    }
  }
  
  /**
   * Get consent history for a child
   */
  async getConsentHistory(childId: string): Promise<ConsentRecord[]> {
    try {
      const response = await api.get(`/users/children/${childId}/consent-history`);
      return response.data;
    } catch (error) {
      console.error('Failed to get consent history:', error);
      throw error;
    }
  }
  
  /**
   * Request parent approval for child login
   */
  async requestParentApproval(childId: string): Promise<{ requestId: string }> {
    try {
      const response = await api.post(`/auth/request-parent-approval`, { childId });
      return response.data;
    } catch (error) {
      console.error('Failed to request parent approval:', error);
      throw error;
    }
  }
  
  /**
   * Approve child login as a parent
   */
  async approveChildLogin(requestId: string, parentId: string): Promise<{ approvalToken: string }> {
    try {
      const response = await api.post(`/auth/approve-child-login`, { requestId, parentId });
      return response.data;
    } catch (error) {
      console.error('Failed to approve child login:', error);
      throw error;
    }
  }
}

export const authService = new AuthService();
