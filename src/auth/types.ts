/**
 * Authentication Types for Cardano Kids Platform
 * 
 * This file defines the core types and interfaces for the age-appropriate
 * authentication system of the Cardano Kids platform.
 */

// Import types from AgeGroupContext
import { ageRangeToGroup } from '../context/AgeGroupContext';

// Define AgeGroup type for use in authentication
export type AgeGroup = 'young' | 'middle' | 'older';

/**
 * Account types in the Cardano Kids platform
 */
export enum AccountType {
  PARENT = 'parent',
  TEACHER = 'teacher',
  CHILD = 'child',
}

/**
 * Consent status for child accounts
 */
export enum ConsentStatus {
  PENDING = 'pending',
  GRANTED = 'granted',
  EXPIRED = 'expired',
  REVOKED = 'revoked',
}

/**
 * Interface for Cardano wallet connection
 */
export interface CardanoWalletConnection {
  walletId: string;
  walletName: string;
  walletType: 'nami' | 'eternl' | 'flint' | 'yoroi' | 'other';
  stakeAddress: string;
  isConnected: boolean;
  balance?: {
    lovelace: number;
    tokens: Array<{
      policyId: string;
      assetName: string;
      quantity: number;
    }>;
  };
}

/**
 * Base user interface for all account types
 */
export interface BaseUser {
  id: string;
  username: string;
  email?: string;
  displayName: string;
  accountType: AccountType;
  createdAt: Date;
  lastLogin?: Date;
  profileImageUrl?: string;
  isActive: boolean;
}

/**
 * Adult user interface (parent or teacher)
 */
export interface AdultUser extends BaseUser {
  accountType: AccountType.PARENT | AccountType.TEACHER;
  email: string;
  walletConnection?: CardanoWalletConnection;
  phoneNumber?: string;
  childAccounts: string[]; // Array of child account IDs
  consentHistory: ConsentRecord[];
}

/**
 * Child user interface
 */
export interface ChildUser extends BaseUser {
  accountType: AccountType.CHILD;
  ageGroup: AgeGroup;
  parentId: string; // ID of the parent/guardian account
  picturePassword?: PicturePassword;
  dateOfBirth?: Date; // Optional, with appropriate privacy controls
  consentStatus: ConsentStatus;
  rewards: RewardToken[];
  restrictedFeatures?: string[]; // Features restricted by parent
  lastParentalReview?: Date;
}

/**
 * Picture-based password for younger users
 */
export interface PicturePassword {
  sequence: Array<{
    categoryId: string;
    imageId: string;
  }>;
  hint?: string;
}

/**
 * Reward token for internal platform achievements
 */
export interface RewardToken {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  dateEarned: Date;
  tokenId?: string; // Optional Cardano native token ID if minted on-chain
  category: 'learning' | 'participation' | 'creation' | 'achievement';
  associatedModule?: string;
}

/**
 * Parental consent record
 */
export interface ConsentRecord {
  id: string;
  childId: string;
  parentId: string;
  status: ConsentStatus;
  grantedAt?: Date;
  expiresAt?: Date;
  revokedAt?: Date;
  consentVersion: string;
  dataCollectionPurposes: string[];
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Authentication session
 */
export interface AuthSession {
  userId: string;
  accountType: AccountType;
  token: string;
  expiresAt: Date;
  deviceInfo: {
    deviceId: string;
    browser: string;
    os: string;
    lastIp: string;
  };
  isParentApproved: boolean;
}

/**
 * Login credentials for adult users
 */
export interface AdultLoginCredentials {
  email: string;
  password: string;
}

/**
 * Login credentials for child users
 */
export interface ChildLoginCredentials {
  username: string;
  picturePassword?: {
    sequence: string[];
  };
  parentApprovalToken?: string;
}

/**
 * Wallet authentication request
 */
export interface WalletAuthRequest {
  walletId: string;
  walletType: string;
  message: string; // Message to sign
  publicKey: string;
}

/**
 * Wallet authentication response
 */
export interface WalletAuthResponse {
  walletId: string;
  signedMessage: string;
  signature: string;
}
