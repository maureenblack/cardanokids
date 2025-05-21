import { createTheme } from '@mui/material/styles';

// Define the theme for the Cardano Kids application
// This theme is designed to be child-friendly with vibrant colors
export const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
      light: '#757de8',
      dark: '#002984',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#f50057',
      light: '#ff5983',
      dark: '#bb002f',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    // Custom colors for age groups
    young: {
      main: '#4caf50', // Green for youngest kids (6-8)
      light: '#80e27e',
      dark: '#087f23',
      contrastText: '#ffffff',
    },
    middle: {
      main: '#ff9800', // Orange for middle group (9-11)
      light: '#ffc947',
      dark: '#c66900',
      contrastText: '#000000',
    },
    older: {
      main: '#2196f3', // Blue for older kids (12-14)
      light: '#6ec6ff',
      dark: '#0069c0',
      contrastText: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h5: {
      fontWeight: 500,
      fontSize: '1.25rem',
    },
    h6: {
      fontWeight: 500,
      fontSize: '1rem',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 30,
          padding: '8px 24px',
          fontSize: '1rem',
        },
        containedPrimary: {
          boxShadow: '0 4px 10px rgba(63, 81, 181, 0.25)',
        },
        containedSecondary: {
          boxShadow: '0 4px 10px rgba(245, 0, 87, 0.25)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 6px 16px rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 16,
        },
        elevation1: {
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        },
      },
    },
  },
});

// Augment the theme to include custom palette colors
declare module '@mui/material/styles' {
  interface Palette {
    young: Palette['primary'];
    middle: Palette['primary'];
    older: Palette['primary'];
  }
  interface PaletteOptions {
    young?: PaletteOptions['primary'];
    middle?: PaletteOptions['primary'];
    older?: PaletteOptions['primary'];
  }
}

export default theme;
