/**
 * Content Management System Models
 * 
 * This file defines the database schema for the Cardano Kids CMS,
 * which stores educational content with blockchain integration.
 */

import { AgeGroup } from '../../auth/types';

/**
 * Content difficulty level
 */
export enum ContentLevel {
  BEGINNER = 'beginner',     // Ages 6-8
  INTERMEDIATE = 'intermediate', // Ages 9-11
  ADVANCED = 'advanced',     // Ages 12-14
}

/**
 * Content type
 */
export enum ContentType {
  LESSON = 'lesson',         // Educational text-based lesson
  VIDEO = 'video',           // Video content
  ACTIVITY = 'activity',     // Interactive activity
  QUIZ = 'quiz',             // Knowledge assessment
  GAME = 'game',             // Educational game
  SIMULATION = 'simulation', // Interactive simulation
  CERTIFICATE = 'certificate', // Achievement certificate
}

/**
 * Content access requirement type
 */
export enum RequirementType {
  BADGE_REQUIRED = 'badge_required',           // Specific achievement badge required
  MODULE_COMPLETED = 'module_completed',       // Previous module must be completed
  PROGRESS_REQUIRED = 'progress_required',     // Minimum progress in a module required
  AGE_GROUP_REQUIRED = 'age_group_required',   // Specific age group required
  NO_REQUIREMENT = 'no_requirement',           // No prerequisites
}

/**
 * Content verification status
 */
export enum VerificationStatus {
  DRAFT = 'draft',               // Initial draft, not yet submitted
  PENDING = 'pending',           // Submitted for verification
  CHANGES_REQUESTED = 'changes_requested', // Changes requested by verifiers
  VERIFIED = 'verified',         // Verified and approved
  REJECTED = 'rejected',         // Rejected due to quality or accuracy issues
  PUBLISHED = 'published',       // Verified and published to the blockchain
}

/**
 * Content access requirement
 */
export interface AccessRequirement {
  id: string;
  type: RequirementType;
  // For badge requirements
  badgeId?: string;
  // For module completion requirements
  moduleId?: string;
  // For progress requirements
  requiredModuleId?: string;
  requiredProgress?: number; // Percentage (0-100)
  // For age group requirements
  requiredAgeGroup?: AgeGroup;
}

/**
 * Educational content metadata
 */
export interface ContentMetadata {
  id: string;
  title: string;
  description: string;
  type: ContentType;
  level: ContentLevel;
  targetAgeGroups: AgeGroup[];
  keywords: string[];
  learningObjectives: string[];
  estimatedDuration: number; // In minutes
  cardanoTopics: string[]; // Specific Cardano topics covered
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Content verification record
 */
export interface VerificationRecord {
  id: string;
  contentId: string;
  verifierId: string;
  status: VerificationStatus;
  comments?: string;
  verifiedAt?: Date;
  signatureHash?: string; // Cryptographic signature of the verifier
}

/**
 * Content blockchain record
 */
export interface BlockchainRecord {
  id: string;
  contentId: string;
  transactionId: string; // Cardano transaction ID
  metadataLabel: number; // Cardano metadata label
  metadataJson: string;  // JSON content stored on-chain
  ipfsHash: string;      // IPFS hash for full content
  timestamp: Date;
  blockHeight?: number;
  policyId?: string;     // For NFT-based content
  assetName?: string;    // For NFT-based content
}

/**
 * Educational content
 */
export interface EducationalContent {
  id: string;
  metadata: ContentMetadata;
  contentUrl: string;     // URL to the content (IPFS or traditional storage)
  thumbnailUrl: string;   // URL to the content thumbnail
  accessRequirements: AccessRequirement[];
  moduleId: string;       // Which learning module this content belongs to
  contentOrder: number;   // Order within the module (for sequential learning)
  verificationStatus: VerificationStatus;
  verificationRecords: VerificationRecord[];
  blockchainRecord?: BlockchainRecord; // Only present if published on-chain
  creatorId: string;      // ID of the educator who created the content
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

/**
 * User content access record
 */
export interface UserContentAccess {
  id: string;
  userId: string;
  contentId: string;
  accessGranted: boolean;
  accessGrantedAt?: Date;
  completionStatus: 'not_started' | 'in_progress' | 'completed';
  progress: number; // Percentage (0-100)
  lastAccessedAt?: Date;
  completedAt?: Date;
  // For quiz/assessment content
  score?: number;
  attempts?: number;
}

/**
 * Content contribution record
 */
export interface ContentContribution {
  id: string;
  contentId: string;
  contributorId: string;
  contributionType: 'creator' | 'editor' | 'verifier';
  contributedAt: Date;
  contribution: string; // Description of the contribution
}

/**
 * Content feedback
 */
export interface ContentFeedback {
  id: string;
  contentId: string;
  userId: string;
  rating: number; // 1-5 stars
  feedback?: string;
  createdAt: Date;
}
