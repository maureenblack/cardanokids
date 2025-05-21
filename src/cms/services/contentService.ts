/**
 * Content Management Service
 * 
 * This service handles operations related to educational content management,
 * including creation, retrieval, updating, and verification of content.
 */

import { v4 as uuidv4 } from 'uuid';
import { 
  EducationalContent, 
  ContentMetadata, 
  VerificationStatus,
  ContentType,
  ContentLevel,
  AccessRequirement,
  VerificationRecord,
  UserContentAccess,
  ContentFeedback
} from '../models';
import { cardanoService } from './cardanoService';
import { ipfsService } from './ipfsService';
import { AgeGroup } from '../../auth/types';

/**
 * Content Management Service
 */
export class ContentService {
  // In-memory storage for demo purposes
  // In a real implementation, this would use a database
  private contents: Map<string, EducationalContent> = new Map();
  private userAccess: Map<string, UserContentAccess[]> = new Map();
  private feedback: Map<string, ContentFeedback[]> = new Map();
  
  /**
   * Create new educational content
   * 
   * @param metadata Content metadata
   * @param contentUrl URL to the content
   * @param thumbnailUrl URL to the content thumbnail
   * @param accessRequirements Access requirements for the content
   * @param moduleId Module ID the content belongs to
   * @param contentOrder Order within the module
   * @param creatorId ID of the content creator
   * @returns The created content
   */
  async createContent(
    metadata: ContentMetadata,
    contentUrl: string,
    thumbnailUrl: string,
    accessRequirements: AccessRequirement[],
    moduleId: string,
    contentOrder: number,
    creatorId: string
  ): Promise<EducationalContent> {
    try {
      const contentId = uuidv4();
      
      // Create content object
      const content: EducationalContent = {
        id: contentId,
        metadata: {
          ...metadata,
          id: contentId,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        contentUrl,
        thumbnailUrl,
        accessRequirements,
        moduleId,
        contentOrder,
        verificationStatus: VerificationStatus.DRAFT,
        verificationRecords: [],
        creatorId,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Store content
      this.contents.set(contentId, content);
      
      return content;
    } catch (error) {
      console.error('Failed to create content:', error);
      throw new Error('Failed to create content');
    }
  }
  
  /**
   * Get content by ID
   * 
   * @param contentId Content ID
   * @returns The content or null if not found
   */
  async getContent(contentId: string): Promise<EducationalContent | null> {
    return this.contents.get(contentId) || null;
  }
  
  /**
   * Get all content
   * 
   * @param filters Optional filters
   * @returns Array of content
   */
  async getAllContent(filters?: {
    type?: ContentType,
    level?: ContentLevel,
    ageGroup?: AgeGroup,
    moduleId?: string,
    verificationStatus?: VerificationStatus
  }): Promise<EducationalContent[]> {
    let contents = Array.from(this.contents.values());
    
    // Apply filters if provided
    if (filters) {
      if (filters.type) {
        contents = contents.filter(content => content.metadata.type === filters.type);
      }
      
      if (filters.level) {
        contents = contents.filter(content => content.metadata.level === filters.level);
      }
      
      if (filters.ageGroup) {
        contents = contents.filter(content => 
          content.metadata.targetAgeGroups.includes(filters.ageGroup as AgeGroup)
        );
      }
      
      if (filters.moduleId) {
        contents = contents.filter(content => content.moduleId === filters.moduleId);
      }
      
      if (filters.verificationStatus) {
        contents = contents.filter(content => 
          content.verificationStatus === filters.verificationStatus
        );
      }
    }
    
    return contents;
  }
  
  /**
   * Update existing content
   * 
   * @param contentId Content ID
   * @param updates Updates to apply
   * @returns The updated content
   */
  async updateContent(
    contentId: string,
    updates: Partial<{
      metadata: Partial<ContentMetadata>,
      contentUrl: string,
      thumbnailUrl: string,
      accessRequirements: AccessRequirement[],
      moduleId: string,
      contentOrder: number
    }>
  ): Promise<EducationalContent> {
    const content = this.contents.get(contentId);
    
    if (!content) {
      throw new Error(`Content with ID ${contentId} not found`);
    }
    
    // Apply updates
    if (updates.metadata) {
      content.metadata = {
        ...content.metadata,
        ...updates.metadata,
        updatedAt: new Date()
      };
    }
    
    if (updates.contentUrl) {
      content.contentUrl = updates.contentUrl;
    }
    
    if (updates.thumbnailUrl) {
      content.thumbnailUrl = updates.thumbnailUrl;
    }
    
    if (updates.accessRequirements) {
      content.accessRequirements = updates.accessRequirements;
    }
    
    if (updates.moduleId) {
      content.moduleId = updates.moduleId;
    }
    
    if (updates.contentOrder) {
      content.contentOrder = updates.contentOrder;
    }
    
    // Update timestamps
    content.updatedAt = new Date();
    
    // If content was published, reset verification status
    if (content.verificationStatus === VerificationStatus.PUBLISHED) {
      content.verificationStatus = VerificationStatus.PENDING;
    }
    
    // Store updated content
    this.contents.set(contentId, content);
    
    return content;
  }
  
  /**
   * Submit content for verification
   * 
   * @param contentId Content ID
   * @returns The updated content
   */
  async submitForVerification(contentId: string): Promise<EducationalContent> {
    const content = this.contents.get(contentId);
    
    if (!content) {
      throw new Error(`Content with ID ${contentId} not found`);
    }
    
    // Update verification status
    content.verificationStatus = VerificationStatus.PENDING;
    content.updatedAt = new Date();
    
    // Store updated content
    this.contents.set(contentId, content);
    
    return content;
  }
  
  /**
   * Verify content
   * 
   * @param contentId Content ID
   * @param verifierId ID of the verifier
   * @param approved Whether the content is approved
   * @param comments Optional comments from the verifier
   * @returns The updated content
   */
  async verifyContent(
    contentId: string,
    verifierId: string,
    approved: boolean,
    comments?: string
  ): Promise<EducationalContent> {
    const content = this.contents.get(contentId);
    
    if (!content) {
      throw new Error(`Content with ID ${contentId} not found`);
    }
    
    // Create verification record
    const verificationRecord: VerificationRecord = {
      id: uuidv4(),
      contentId,
      verifierId,
      status: approved ? VerificationStatus.VERIFIED : VerificationStatus.CHANGES_REQUESTED,
      comments,
      verifiedAt: new Date(),
      // In a real implementation, this would be a cryptographic signature
      signatureHash: `${verifierId}-${contentId}-${Date.now()}`
    };
    
    // Update content verification status and records
    content.verificationStatus = approved ? VerificationStatus.VERIFIED : VerificationStatus.CHANGES_REQUESTED;
    content.verificationRecords.push(verificationRecord);
    content.updatedAt = new Date();
    
    // Store updated content
    this.contents.set(contentId, content);
    
    return content;
  }
  
  /**
   * Publish content to the blockchain
   * 
   * @param contentId Content ID
   * @returns The updated content with blockchain record
   */
  async publishContent(contentId: string): Promise<EducationalContent> {
    const content = this.contents.get(contentId);
    
    if (!content) {
      throw new Error(`Content with ID ${contentId} not found`);
    }
    
    // Ensure content is verified
    if (content.verificationStatus !== VerificationStatus.VERIFIED) {
      throw new Error('Content must be verified before publishing');
    }
    
    try {
      // Upload content to IPFS if not already there
      if (!content.contentUrl.startsWith('ipfs://')) {
        const ipfsHash = await ipfsService.uploadContent(content);
        content.contentUrl = `ipfs://${ipfsHash}`;
      }
      
      // Store metadata on the blockchain
      const blockchainRecord = await cardanoService.storeContentMetadata(content);
      
      // Update content with blockchain record and status
      content.blockchainRecord = blockchainRecord;
      content.verificationStatus = VerificationStatus.PUBLISHED;
      content.publishedAt = new Date();
      content.updatedAt = new Date();
      
      // Store updated content
      this.contents.set(contentId, content);
      
      return content;
    } catch (error) {
      console.error('Failed to publish content:', error);
      throw new Error('Failed to publish content to the blockchain');
    }
  }
  
  /**
   * Check if a user has access to content
   * 
   * @param userId User ID
   * @param contentId Content ID
   * @returns Whether the user has access
   */
  async checkContentAccess(userId: string, contentId: string): Promise<boolean> {
    try {
      // Check if user has explicit access in our records
      const userAccessRecords = this.userAccess.get(userId) || [];
      const accessRecord = userAccessRecords.find(record => record.contentId === contentId);
      
      if (accessRecord && accessRecord.accessGranted) {
        return true;
      }
      
      // If not found in our records, check with the blockchain
      return await cardanoService.verifyContentAccess(userId, contentId);
    } catch (error) {
      console.error('Failed to check content access:', error);
      throw new Error('Failed to check content access');
    }
  }
  
  /**
   * Grant content access to a user
   * 
   * @param userId User ID
   * @param contentId Content ID
   * @returns The created or updated access record
   */
  async grantContentAccess(userId: string, contentId: string): Promise<UserContentAccess> {
    try {
      // Grant access on the blockchain
      await cardanoService.grantContentAccess(userId, contentId);
      
      // Create or update access record
      let userAccessRecords = this.userAccess.get(userId) || [];
      let accessRecord = userAccessRecords.find(record => record.contentId === contentId);
      
      if (accessRecord) {
        // Update existing record
        accessRecord.accessGranted = true;
        accessRecord.accessGrantedAt = new Date();
      } else {
        // Create new record
        accessRecord = {
          id: uuidv4(),
          userId,
          contentId,
          accessGranted: true,
          accessGrantedAt: new Date(),
          completionStatus: 'not_started',
          progress: 0
        };
        userAccessRecords.push(accessRecord);
      }
      
      // Store updated records
      this.userAccess.set(userId, userAccessRecords);
      
      return accessRecord;
    } catch (error) {
      console.error('Failed to grant content access:', error);
      throw new Error('Failed to grant content access');
    }
  }
  
  /**
   * Update user's progress on content
   * 
   * @param userId User ID
   * @param contentId Content ID
   * @param progress Progress percentage (0-100)
   * @param completed Whether the content is completed
   * @returns The updated access record
   */
  async updateContentProgress(
    userId: string,
    contentId: string,
    progress: number,
    completed: boolean = false
  ): Promise<UserContentAccess> {
    try {
      // Get user access records
      let userAccessRecords = this.userAccess.get(userId) || [];
      let accessRecord = userAccessRecords.find(record => record.contentId === contentId);
      
      if (!accessRecord) {
        // Create new record if not exists
        accessRecord = {
          id: uuidv4(),
          userId,
          contentId,
          accessGranted: true, // Assume access is granted
          accessGrantedAt: new Date(),
          completionStatus: 'not_started',
          progress: 0
        };
        userAccessRecords.push(accessRecord);
      }
      
      // Update progress
      accessRecord.progress = Math.min(100, Math.max(0, progress));
      accessRecord.lastAccessedAt = new Date();
      
      // Update completion status
      if (completed || accessRecord.progress >= 100) {
        accessRecord.completionStatus = 'completed';
        accessRecord.completedAt = new Date();
        
        // Record completion on the blockchain
        await cardanoService.recordContentCompletion(userId, contentId);
      } else if (accessRecord.progress > 0) {
        accessRecord.completionStatus = 'in_progress';
      }
      
      // Store updated records
      this.userAccess.set(userId, userAccessRecords);
      
      return accessRecord;
    } catch (error) {
      console.error('Failed to update content progress:', error);
      throw new Error('Failed to update content progress');
    }
  }
  
  /**
   * Get user's content access records
   * 
   * @param userId User ID
   * @returns Array of user's content access records
   */
  async getUserContentAccess(userId: string): Promise<UserContentAccess[]> {
    return this.userAccess.get(userId) || [];
  }
  
  /**
   * Add feedback for content
   * 
   * @param userId User ID
   * @param contentId Content ID
   * @param rating Rating (1-5)
   * @param feedback Optional feedback text
   * @returns The created feedback
   */
  async addContentFeedback(
    userId: string,
    contentId: string,
    rating: number,
    feedback?: string
  ): Promise<ContentFeedback> {
    try {
      // Create feedback object
      const feedbackObj: ContentFeedback = {
        id: uuidv4(),
        contentId,
        userId,
        rating: Math.min(5, Math.max(1, rating)),
        feedback,
        createdAt: new Date()
      };
      
      // Get existing feedback for the content
      let contentFeedback = this.feedback.get(contentId) || [];
      
      // Add new feedback
      contentFeedback.push(feedbackObj);
      
      // Store updated feedback
      this.feedback.set(contentId, contentFeedback);
      
      return feedbackObj;
    } catch (error) {
      console.error('Failed to add content feedback:', error);
      throw new Error('Failed to add content feedback');
    }
  }
  
  /**
   * Get feedback for content
   * 
   * @param contentId Content ID
   * @returns Array of feedback for the content
   */
  async getContentFeedback(contentId: string): Promise<ContentFeedback[]> {
    return this.feedback.get(contentId) || [];
  }
}

export const contentService = new ContentService();
