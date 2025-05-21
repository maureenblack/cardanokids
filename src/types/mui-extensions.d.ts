/**
 * Material-UI type extensions
 * 
 * This file extends the Material-UI component types to fix TypeScript errors
 * with Grid components and other MUI elements.
 */

// Extend Material-UI component types
import { ElementType } from 'react';

// Fix Grid component TypeScript errors
declare module '@mui/material' {
  // Override the Grid component to accept both 'item' and 'component' props
  interface GridBaseProps {
    children?: React.ReactNode;
    container?: boolean;
    item?: boolean;
    xs?: number | boolean;
    sm?: number | boolean;
    md?: number | boolean;
    lg?: number | boolean;
    xl?: number | boolean;
    spacing?: number;
  }

  interface GridTypeMap<P = {}, D extends React.ElementType = 'div'> {
    props: P & GridBaseProps;
    defaultComponent: D;
  }

  interface GridProps extends GridBaseProps {
  }
}

// Extend the AuthContext type
declare module '../../auth/AuthContext' {
  export interface AuthContextType {
    user: {
      id: string;
      username: string;
      accountType: any;
      [key: string]: any;
    };
    isAuthenticated: boolean;
    login: (credentials: any) => Promise<any>;
    logout: () => void;
  }
}

// Extend the ContentMetadata type
declare module '../models' {
  interface ContentMetadata {
    id: string;
    title: string;
    description: string;
    type: ContentType;
    level: ContentLevel;
    targetAgeGroups: AgeGroup[];
    createdAt: Date;
    updatedAt: Date;
    keywords?: string[];
    learningObjectives?: string[];
    estimatedDuration?: number;
    cardanoTopics?: string[];
  }
}

// Define AgeGroup enum values for use in components
declare namespace AgeGroup {
  export const YOUNG: 'young';
  export const MIDDLE: 'middle';
  export const OLDER: 'older';
}
