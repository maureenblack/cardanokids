/**
 * Role-based Authorization Middleware
 * 
 * This middleware checks if the authenticated user has the required role(s) to access a resource.
 */

import { Request, Response, NextFunction } from 'express';

/**
 * Role middleware factory
 * Creates middleware that checks if user has one of the allowed roles
 * 
 * @param allowedRoles Array of roles that are allowed to access the resource
 * @returns Middleware function
 */
export const roleMiddleware = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Check if user exists (should be added by authMiddleware)
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized - Authentication required' });
    }
    
    // Check if user has one of the allowed roles
    const userRole = req.user.role;
    
    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).json({ 
        error: 'Forbidden - Insufficient permissions',
        message: `This action requires one of the following roles: ${allowedRoles.join(', ')}`
      });
    }
    
    // User has required role, proceed
    next();
  };
};
