/**
 * Material-UI type declarations
 * 
 * This file provides type declarations to fix TypeScript errors with Material-UI components.
 */

import { GridProps } from '@mui/material/Grid';

declare module '@mui/material/Grid' {
  interface GridProps {
    item?: boolean;
    container?: boolean;
    xs?: number | boolean;
    sm?: number | boolean;
    md?: number | boolean;
    lg?: number | boolean;
    xl?: number | boolean;
  }
}
