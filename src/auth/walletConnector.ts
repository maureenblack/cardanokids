/**
 * Wallet Connector for Cardano Kids Platform
 * 
 * This service handles the connection to Cardano wallets for adult accounts
 * (parents/teachers). It provides a secure way to connect to various Cardano
 * wallet providers while maintaining appropriate separation for child accounts.
 */

import { CardanoWalletConnection } from './types';
import { secureStorage } from '../utils/secureStorage';

// Constants
const WALLET_KEY = 'cardano_kids_wallet';

// Define the window interface with Cardano wallet providers
declare global {
  interface Window {
    cardano?: {
      nami?: any;
      eternl?: any;
      flint?: any;
      yoroi?: any;
      [key: string]: any;
    };
  }
}

class WalletConnector {
  /**
   * Check if a specific wallet is available in the browser
   */
  isWalletAvailable(walletType: string): boolean {
    if (typeof window === 'undefined') return false;
    
    const cardano = window.cardano;
    if (!cardano) return false;
    
    return !!cardano[walletType.toLowerCase()];
  }
  
  /**
   * Get a list of available wallets
   */
  getAvailableWallets(): string[] {
    if (typeof window === 'undefined') return [];
    
    const cardano = window.cardano;
    if (!cardano) return [];
    
    return Object.keys(cardano).filter(key => 
      typeof cardano[key] === 'object' && 
      cardano[key] !== null && 
      typeof cardano[key].enable === 'function'
    );
  }
  
  /**
   * Connect to a Cardano wallet
   */
  async connect(walletType: string): Promise<CardanoWalletConnection> {
    if (typeof window === 'undefined') {
      throw new Error('Wallet connection is only available in browser environments');
    }
    
    const cardano = window.cardano;
    if (!cardano) {
      throw new Error('No Cardano wallet providers found');
    }
    
    const wallet = cardano[walletType.toLowerCase()];
    if (!wallet) {
      throw new Error(`Wallet ${walletType} not found`);
    }
    
    try {
      // Enable the wallet (request permission)
      const walletApi = await wallet.enable();
      
      // Get wallet information
      const networkId = await walletApi.getNetworkId();
      const usedAddresses = await walletApi.getUsedAddresses();
      const changeAddress = await walletApi.getChangeAddress();
      const stakeAddress = await walletApi.getRewardAddresses();
      
      // Get balance (if available)
      let balance;
      try {
        const rawBalance = await walletApi.getBalance();
        balance = {
          lovelace: parseInt(rawBalance, 16),
          tokens: [] // We'll simplify token handling for now
        };
      } catch (error) {
        console.warn('Could not get wallet balance:', error);
      }
      
      // Create wallet connection object
      const connection: CardanoWalletConnection = {
        walletId: changeAddress, // Use change address as wallet ID
        walletName: walletType,
        walletType: walletType.toLowerCase() as 'nami' | 'eternl' | 'flint' | 'yoroi' | 'other',
        stakeAddress: stakeAddress[0],
        isConnected: true,
        balance
      };
      
      // Save wallet connection to secure storage
      this.saveWallet(connection);
      
      return connection;
    } catch (error) {
      console.error(`Failed to connect to ${walletType} wallet:`, error);
      throw new Error(`Failed to connect to ${walletType} wallet: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  /**
   * Disconnect from a Cardano wallet
   */
  async disconnect(walletId: string): Promise<void> {
    // Remove wallet from secure storage
    secureStorage.removeItem(WALLET_KEY);
  }
  
  /**
   * Save wallet connection to secure storage
   */
  private saveWallet(connection: CardanoWalletConnection): void {
    secureStorage.setItem(WALLET_KEY, JSON.stringify(connection));
  }
  
  /**
   * Get saved wallet connection from secure storage
   */
  async getSavedWallet(): Promise<CardanoWalletConnection | null> {
    try {
      const walletData = secureStorage.getItem(WALLET_KEY);
      if (walletData) {
        const wallet = JSON.parse(walletData) as CardanoWalletConnection;
        
        // Verify the wallet is still available
        if (this.isWalletAvailable(wallet.walletType)) {
          return wallet;
        } else {
          // Wallet is no longer available, remove it
          secureStorage.removeItem(WALLET_KEY);
        }
      }
    } catch (error) {
      console.error('Failed to get saved wallet:', error);
    }
    
    return null;
  }
  
  /**
   * Sign a message with the connected wallet
   */
  async signMessage(walletType: string, message: string): Promise<{ signature: string; key: string }> {
    if (typeof window === 'undefined') {
      throw new Error('Wallet signing is only available in browser environments');
    }
    
    const cardano = window.cardano;
    if (!cardano) {
      throw new Error('No Cardano wallet providers found');
    }
    
    const wallet = cardano[walletType.toLowerCase()];
    if (!wallet) {
      throw new Error(`Wallet ${walletType} not found`);
    }
    
    try {
      // Enable the wallet
      const walletApi = await wallet.enable();
      
      // Get the address to sign with
      const addresses = await walletApi.getUsedAddresses();
      const address = addresses[0];
      
      // Sign the message
      const signature = await walletApi.signData(address, message);
      
      return {
        signature,
        key: address
      };
    } catch (error) {
      console.error(`Failed to sign message with ${walletType} wallet:`, error);
      throw new Error(`Failed to sign message: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
  
  /**
   * Verify a signed message
   */
  async verifySignature(address: string, signature: string, message: string): Promise<boolean> {
    // This would typically be done on the server side
    // For client-side, we'll just return true for now
    return true;
  }
}

export const walletConnector = new WalletConnector();
