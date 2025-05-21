/**
 * Content Management API
 * 
 * This module provides API endpoints for the content management system,
 * allowing for CRUD operations on educational content and related features.
 */

import express, { Request, Response, Router } from 'express';
import { contentService } from '../services/contentService';
import { cardanoService } from '../services/cardanoService';
import { ipfsService } from '../services/ipfsService';
import { 
  VerificationStatus, 
  ContentType, 
  ContentLevel,
  AccessRequirement
} from '../models';
import { AgeGroup } from '../../auth/types';
import { authMiddleware } from '../../api/middleware/authMiddleware';
import { roleMiddleware } from '../../api/middleware/roleMiddleware';

// Create router
const router: Router = express.Router();

/**
 * Get all content
 * GET /api/content
 */
router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    // Parse query parameters for filtering
    const filters: any = {};
    
    if (req.query.type) {
      filters.type = req.query.type as ContentType;
    }
    
    if (req.query.level) {
      filters.level = req.query.level as ContentLevel;
    }
    
    if (req.query.ageGroup) {
      filters.ageGroup = req.query.ageGroup as AgeGroup;
    }
    
    if (req.query.moduleId) {
      filters.moduleId = req.query.moduleId as string;
    }
    
    if (req.query.verificationStatus) {
      filters.verificationStatus = req.query.verificationStatus as VerificationStatus;
    }
    
    // Get content with filters
    const content = await contentService.getAllContent(filters);
    
    res.status(200).json({
      success: true,
      data: content
    });
  } catch (error) {
    console.error('Error getting content:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get content',
      error: (error as Error).message
    });
  }
});

/**
 * Get content by ID
 * GET /api/content/:id
 */
router.get('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const contentId = req.params.id;
    const content = await contentService.getContent(contentId);
    
    if (!content) {
      return res.status(404).json({
        success: false,
        message: `Content with ID ${contentId} not found`
      });
    }
    
    res.status(200).json({
      success: true,
      data: content
    });
  } catch (error) {
    console.error('Error getting content:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get content',
      error: (error as Error).message
    });
  }
});

/**
 * Create new content
 * POST /api/content
 * Requires educator role
 */
router.post('/', [authMiddleware, roleMiddleware(['educator', 'admin'])], async (req: Request, res: Response) => {
  try {
    const {
      metadata,
      contentUrl,
      thumbnailUrl,
      accessRequirements,
      moduleId,
      contentOrder
    } = req.body;
    
    // Validate required fields
    if (!metadata || !contentUrl || !thumbnailUrl || !moduleId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }
    
    // Create content
    const content = await contentService.createContent(
      metadata,
      contentUrl,
      thumbnailUrl,
      accessRequirements || [],
      moduleId,
      contentOrder || 0,
      req.user.id // Creator ID from authenticated user
    );
    
    res.status(201).json({
      success: true,
      data: content
    });
  } catch (error) {
    console.error('Error creating content:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create content',
      error: (error as Error).message
    });
  }
});

/**
 * Update content
 * PUT /api/content/:id
 * Requires educator role
 */
router.put('/:id', [authMiddleware, roleMiddleware(['educator', 'admin'])], async (req: Request, res: Response) => {
  try {
    const contentId = req.params.id;
    const updates = req.body;
    
    // Get existing content
    const existingContent = await contentService.getContent(contentId);
    
    if (!existingContent) {
      return res.status(404).json({
        success: false,
        message: `Content with ID ${contentId} not found`
      });
    }
    
    // Check if user is the creator or an admin
    if (existingContent.creatorId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this content'
      });
    }
    
    // Update content
    const updatedContent = await contentService.updateContent(contentId, updates);
    
    res.status(200).json({
      success: true,
      data: updatedContent
    });
  } catch (error) {
    console.error('Error updating content:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update content',
      error: (error as Error).message
    });
  }
});

/**
 * Submit content for verification
 * POST /api/content/:id/submit
 * Requires educator role
 */
router.post('/:id/submit', [authMiddleware, roleMiddleware(['educator', 'admin'])], async (req: Request, res: Response) => {
  try {
    const contentId = req.params.id;
    
    // Get existing content
    const existingContent = await contentService.getContent(contentId);
    
    if (!existingContent) {
      return res.status(404).json({
        success: false,
        message: `Content with ID ${contentId} not found`
      });
    }
    
    // Check if user is the creator or an admin
    if (existingContent.creatorId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to submit this content for verification'
      });
    }
    
    // Submit for verification
    const updatedContent = await contentService.submitForVerification(contentId);
    
    res.status(200).json({
      success: true,
      data: updatedContent
    });
  } catch (error) {
    console.error('Error submitting content for verification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit content for verification',
      error: (error as Error).message
    });
  }
});

/**
 * Verify content
 * POST /api/content/:id/verify
 * Requires verifier role
 */
router.post('/:id/verify', [authMiddleware, roleMiddleware(['verifier', 'admin'])], async (req: Request, res: Response) => {
  try {
    const contentId = req.params.id;
    const { approved, comments } = req.body;
    
    // Get existing content
    const existingContent = await contentService.getContent(contentId);
    
    if (!existingContent) {
      return res.status(404).json({
        success: false,
        message: `Content with ID ${contentId} not found`
      });
    }
    
    // Verify content
    const updatedContent = await contentService.verifyContent(
      contentId,
      req.user.id, // Verifier ID from authenticated user
      approved,
      comments
    );
    
    res.status(200).json({
      success: true,
      data: updatedContent
    });
  } catch (error) {
    console.error('Error verifying content:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify content',
      error: (error as Error).message
    });
  }
});

/**
 * Publish content to blockchain
 * POST /api/content/:id/publish
 * Requires admin role
 */
router.post('/:id/publish', [authMiddleware, roleMiddleware(['admin'])], async (req: Request, res: Response) => {
  try {
    const contentId = req.params.id;
    
    // Get existing content
    const existingContent = await contentService.getContent(contentId);
    
    if (!existingContent) {
      return res.status(404).json({
        success: false,
        message: `Content with ID ${contentId} not found`
      });
    }
    
    // Publish content
    const publishedContent = await contentService.publishContent(contentId);
    
    res.status(200).json({
      success: true,
      data: publishedContent
    });
  } catch (error) {
    console.error('Error publishing content:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to publish content',
      error: (error as Error).message
    });
  }
});

/**
 * Check content access for a user
 * GET /api/content/:id/access
 */
router.get('/:id/access', authMiddleware, async (req: Request, res: Response) => {
  try {
    const contentId = req.params.id;
    const userId = req.user.id;
    
    // Check access
    const hasAccess = await contentService.checkContentAccess(userId, contentId);
    
    res.status(200).json({
      success: true,
      data: {
        hasAccess
      }
    });
  } catch (error) {
    console.error('Error checking content access:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check content access',
      error: (error as Error).message
    });
  }
});

/**
 * Grant content access to a user
 * POST /api/content/:id/access/:userId
 * Requires admin or teacher role
 */
router.post('/:id/access/:userId', [authMiddleware, roleMiddleware(['admin', 'teacher'])], async (req: Request, res: Response) => {
  try {
    const contentId = req.params.id;
    const userId = req.params.userId;
    
    // Grant access
    const accessRecord = await contentService.grantContentAccess(userId, contentId);
    
    res.status(200).json({
      success: true,
      data: accessRecord
    });
  } catch (error) {
    console.error('Error granting content access:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to grant content access',
      error: (error as Error).message
    });
  }
});

/**
 * Update user's progress on content
 * POST /api/content/:id/progress
 */
router.post('/:id/progress', authMiddleware, async (req: Request, res: Response) => {
  try {
    const contentId = req.params.id;
    const userId = req.user.id;
    const { progress, completed } = req.body;
    
    // Update progress
    const accessRecord = await contentService.updateContentProgress(
      userId,
      contentId,
      progress,
      completed
    );
    
    res.status(200).json({
      success: true,
      data: accessRecord
    });
  } catch (error) {
    console.error('Error updating content progress:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update content progress',
      error: (error as Error).message
    });
  }
});

/**
 * Get user's content access records
 * GET /api/content/user/access
 */
router.get('/user/access', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    
    // Get access records
    const accessRecords = await contentService.getUserContentAccess(userId);
    
    res.status(200).json({
      success: true,
      data: accessRecords
    });
  } catch (error) {
    console.error('Error getting user content access:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user content access',
      error: (error as Error).message
    });
  }
});

/**
 * Add feedback for content
 * POST /api/content/:id/feedback
 */
router.post('/:id/feedback', authMiddleware, async (req: Request, res: Response) => {
  try {
    const contentId = req.params.id;
    const userId = req.user.id;
    const { rating, feedback } = req.body;
    
    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }
    
    // Add feedback
    const feedbackRecord = await contentService.addContentFeedback(
      userId,
      contentId,
      rating,
      feedback
    );
    
    res.status(201).json({
      success: true,
      data: feedbackRecord
    });
  } catch (error) {
    console.error('Error adding content feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add content feedback',
      error: (error as Error).message
    });
  }
});

/**
 * Get feedback for content
 * GET /api/content/:id/feedback
 */
router.get('/:id/feedback', authMiddleware, async (req: Request, res: Response) => {
  try {
    const contentId = req.params.id;
    
    // Get feedback
    const feedback = await contentService.getContentFeedback(contentId);
    
    res.status(200).json({
      success: true,
      data: feedback
    });
  } catch (error) {
    console.error('Error getting content feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get content feedback',
      error: (error as Error).message
    });
  }
});

export const contentApiRouter = router;
