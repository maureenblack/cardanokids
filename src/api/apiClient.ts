/**
 * API Client for Cardano Kids Platform
 * 
 * This module provides a centralized client for making API requests to the backend.
 * It handles authentication, error handling, and request formatting.
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { secureStorage } from '../utils/secureStorage';

// API base URL - would be configured based on environment in a real app
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.cardanokids.example.com';

// Create axios instance with default config
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = secureStorage.getItem('auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle specific error cases
    if (error.response) {
      // Server responded with an error status
      if (error.response.status === 401) {
        // Unauthorized - clear auth data
        secureStorage.removeItem('auth_token');
        secureStorage.removeItem('user_data');
        
        // Redirect to login page if needed
        // window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// API client with typed methods
export const api = {
  // Token management methods
  setAuthToken: (token: string): void => {
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  },
  
  clearAuthToken: (): void => {
    delete axiosInstance.defaults.headers.common['Authorization'];
  },
  // Auth endpoints
  auth: {
    loginAdult: (email: string, password: string) => 
      axiosInstance.post('/auth/login/adult', { email, password }),
    
    loginChild: (username: string, picturePassword: string[]) => 
      axiosInstance.post('/auth/login/child', { username, picturePassword }),
    
    logout: () => 
      axiosInstance.post('/auth/logout'),
    
    getCurrentUser: () => 
      axiosInstance.get('/auth/me'),
    
    refreshToken: () => 
      axiosInstance.post('/auth/refresh-token'),
    
    requestPasswordReset: (email: string) => 
      axiosInstance.post('/auth/password-reset-request', { email }),
    
    resetPassword: (token: string, newPassword: string) => 
      axiosInstance.post('/auth/password-reset', { token, newPassword }),
  },
  
  // User management endpoints
  users: {
    createChildAccount: (childData: any) => 
      axiosInstance.post('/users/child', childData),
    
    updateChildAccount: (childId: string, data: any) => 
      axiosInstance.put(`/users/child/${childId}`, data),
    
    getChildAccounts: (parentId: string) => 
      axiosInstance.get(`/users/parent/${parentId}/children`),
    
    updateUserProfile: (userId: string, data: any) => 
      axiosInstance.put(`/users/${userId}`, data),
  },
  
  // Wallet endpoints
  wallet: {
    connectWallet: (walletData: any) => 
      axiosInstance.post('/wallet/connect', walletData),
    
    disconnectWallet: () => 
      axiosInstance.post('/wallet/disconnect'),
    
    getWalletStatus: () => 
      axiosInstance.get('/wallet/status'),
  },
  
  // Learning progress endpoints
  progress: {
    getProgress: (userId: string) => 
      axiosInstance.get(`/progress/${userId}`),
    
    updateProgress: (userId: string, moduleId: string, data: any) => 
      axiosInstance.put(`/progress/${userId}/module/${moduleId}`, data),
    
    getAchievements: (userId: string) => 
      axiosInstance.get(`/progress/${userId}/achievements`),
  },
  
  // Generic request methods
  get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => 
    axiosInstance.get(url, config),
  
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => 
    axiosInstance.post(url, data, config),
  
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => 
    axiosInstance.put(url, data, config),
  
  delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> => 
    axiosInstance.delete(url, config),
};
