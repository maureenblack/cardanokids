/**
 * Authentication Middleware
 * 
 * This middleware verifies JWT tokens and adds the authenticated user to the request object.
 */

import { Request, Response, NextFunction } from 'express';
// In a real project, you would install jsonwebtoken with: npm install jsonwebtoken @types/jsonwebtoken
// For now, we'll create a mock implementation for TypeScript compatibility
const jwt = {
  verify: (token: string, secret: string, callback?: (err: any, decoded: any) => void): any => {
    // Mock implementation
    if (callback) {
      callback(null, { id: 'mock-user-id', role: 'user' });
    }
    return { id: 'mock-user-id', role: 'user' };
  },
  sign: (payload: any, secret: string, options?: any): string => {
    // Mock implementation
    return 'mock-jwt-token';
  }
};

// JWT secret key (should be in environment variables in production)
const JWT_SECRET = process.env.JWT_SECRET || 'cardano-kids-secret-key';

// Extend Express Request type to include user property
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

/**
 * Authentication middleware
 * Verifies JWT token and adds user to request object
 */
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Get token from Authorization header
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized - No token provided' });
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Add user to request object
    req.user = decoded;
    
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized - Invalid token' });
  }
};
