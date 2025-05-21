/**
 * Secure Storage Utility for Cardano Kids Platform
 * 
 * This utility provides a secure way to store sensitive data in the browser.
 * It uses the browser's localStorage with encryption for sensitive data.
 */

import CryptoJS from 'crypto-js';

// Secret key for encryption (in a real app, this would be more securely managed)
const SECRET_KEY = 'cardano_kids_secure_storage_key';

class SecureStorage {
  /**
   * Set an item in secure storage
   * @param key The key to store the value under
   * @param value The value to store
   */
  setItem(key: string, value: string): void {
    try {
      // Encrypt sensitive data
      const encryptedValue = CryptoJS.AES.encrypt(value, SECRET_KEY).toString();
      
      // Store in localStorage
      localStorage.setItem(key, encryptedValue);
    } catch (error) {
      console.error('Failed to set item in secure storage:', error);
      throw error;
    }
  }
  
  /**
   * Get an item from secure storage
   * @param key The key to retrieve
   * @returns The decrypted value, or null if not found
   */
  getItem(key: string): string | null {
    try {
      // Get from localStorage
      const encryptedValue = localStorage.getItem(key);
      
      if (!encryptedValue) {
        return null;
      }
      
      // Decrypt the value
      const bytes = CryptoJS.AES.decrypt(encryptedValue, SECRET_KEY);
      // Use string conversion without specifying encoding (TypeScript fix)
      const decryptedValue = bytes.toString();
      
      return decryptedValue;
    } catch (error) {
      console.error('Failed to get item from secure storage:', error);
      // If decryption fails, remove the corrupted item
      this.removeItem(key);
      return null;
    }
  }
  
  /**
   * Remove an item from secure storage
   * @param key The key to remove
   */
  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to remove item from secure storage:', error);
      throw error;
    }
  }
  
  /**
   * Clear all items from secure storage
   */
  clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Failed to clear secure storage:', error);
      throw error;
    }
  }
  
  /**
   * Check if secure storage is available
   * @returns True if secure storage is available
   */
  isAvailable(): boolean {
    try {
      const testKey = 'cardano_kids_test_key';
      const testValue = 'test';
      
      // Test setting and getting an item
      this.setItem(testKey, testValue);
      const retrievedValue = this.getItem(testKey);
      this.removeItem(testKey);
      
      return retrievedValue === testValue;
    } catch (error) {
      console.error('Secure storage is not available:', error);
      return false;
    }
  }
  
  /**
   * Store an object in secure storage
   * @param key The key to store the object under
   * @param object The object to store
   */
  setObject<T>(key: string, object: T): void {
    try {
      const jsonValue = JSON.stringify(object);
      this.setItem(key, jsonValue);
    } catch (error) {
      console.error('Failed to set object in secure storage:', error);
      throw error;
    }
  }
  
  /**
   * Get an object from secure storage
   * @param key The key to retrieve
   * @returns The object, or null if not found
   */
  getObject<T>(key: string): T | null {
    try {
      const jsonValue = this.getItem(key);
      
      if (!jsonValue) {
        return null;
      }
      
      return JSON.parse(jsonValue) as T;
    } catch (error) {
      console.error('Failed to get object from secure storage:', error);
      return null;
    }
  }
}

export const secureStorage = new SecureStorage();
