import { createTheme } from '@mui/material/styles';

// Define the theme for the Cardano Kids application
// This theme is designed to be child-friendly with vibrant colors
export const theme = createTheme({
  palette: {
    primary: {
      main: '#8E44AD', // Playful purple
      light: '#AF7AC5',
      dark: '#6C3483',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#FF9800', // Friendly orange
      light: '#FFB74D',
      dark: '#F57C00',
      contrastText: '#ffffff',
    },
    background: {
      default: '#F5F9FF', // Soft blue background
      paper: '#ffffff',
    },
    error: {
      main: '#FF5252',
      light: '#FF8A80',
      dark: '#C50E29',
    },
    success: {
      main: '#4CAF50',
      light: '#81C784',
      dark: '#388E3C',
    },
    info: {
      main: '#2196F3',
      light: '#64B5F6',
      dark: '#1976D2',
    },
    warning: {
      main: '#FFC107',
      light: '#FFD54F',
      dark: '#FFA000',
    },
    // Custom colors for age groups - more vibrant and fun
    young: {
      main: '#00C853', // Bright green for youngest kids (6-8)
      light: '#69F0AE',
      dark: '#00A043',
      contrastText: '#ffffff',
    },
    middle: {
      main: '#FF4081', // Vibrant pink for middle group (9-11)
      light: '#FF79B0',
      dark: '#C60055',
      contrastText: '#ffffff',
    },
    older: {
      main: '#2979FF', // Bright blue for older kids (12-14)
      light: '#75A7FF',
      dark: '#004ECB',
      contrastText: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Comic Sans MS", "Bubblegum Sans", "Poppins", "Roboto", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      letterSpacing: '0.5px',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
      letterSpacing: '0.5px',
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
      letterSpacing: '0.5px',
    },
  },
  shape: {
    borderRadius: 20, // More rounded corners throughout the app
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 25, // Very rounded buttons
          padding: '12px 28px',
          fontSize: '1.1rem',
          textTransform: 'none',
          fontWeight: 'bold',
          transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)', // Bouncy animation
          '&:hover': {
            transform: 'translateY(-4px) scale(1.05)',
            boxShadow: '0 8px 15px rgba(0, 0, 0, 0.2)',
          },
        },
        containedPrimary: {
          boxShadow: '0 6px 0 rgba(108, 52, 131, 0.5)', // Bottom shadow for 3D effect
          background: 'linear-gradient(135deg, #9B59B6 0%, #8E44AD 100%)',
          '&:active': {
            boxShadow: '0 2px 0 rgba(108, 52, 131, 0.5)',
            transform: 'translateY(4px)',
          },
        },
        containedSecondary: {
          boxShadow: '0 6px 0 rgba(245, 124, 0, 0.5)', // Bottom shadow for 3D effect
          background: 'linear-gradient(135deg, #FFA726 0%, #FF9800 100%)',
          '&:active': {
            boxShadow: '0 2px 0 rgba(245, 124, 0, 0.5)',
            transform: 'translateY(4px)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20, // Very rounded cards
          border: '3px solid #F5F9FF', // Subtle border
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08)',
          transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          overflow: 'hidden',
          '&:hover': {
            transform: 'translateY(-8px) rotate(1deg)', // Slight tilt on hover
            boxShadow: '0 15px 30px rgba(0, 0, 0, 0.12)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 20, // Very rounded papers
          '&.MuiAppBar-root': {
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.07)',
            background: 'linear-gradient(90deg, #F5F9FF 0%, #FFFFFF 100%)', // Subtle gradient
          },
        },
        elevation1: {
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.07)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          fontWeight: 'bold',
          '&.MuiChip-colorPrimary': {
            background: 'linear-gradient(135deg, #9B59B6 0%, #8E44AD 100%)',
          },
          '&.MuiChip-colorSecondary': {
            background: 'linear-gradient(135deg, #FFA726 0%, #FF9800 100%)',
          },
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          border: '3px solid #FFFFFF',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
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
