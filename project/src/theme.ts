import { createTheme } from '@mui/material/styles';

// Create a custom theme with our color palette
export const theme = createTheme({
  palette: {
    primary: {
      main: '#2563EB', // Blue
      light: '#60A5FA',
      dark: '#1E40AF',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#0D9488', // Teal
      light: '#5EEAD4',
      dark: '#0F766E',
      contrastText: '#FFFFFF',
    },
    error: {
      main: '#EF4444', // Red
      light: '#FCA5A5',
      dark: '#B91C1C',
    },
    warning: {
      main: '#F59E0B', // Amber
      light: '#FCD34D',
      dark: '#B45309',
    },
    success: {
      main: '#22C55E', // Green
      light: '#86EFAC',
      dark: '#15803D',
    },
    info: {
      main: '#F97316', // Orange (accent)
      light: '#FDBA74',
      dark: '#C2410C',
    },
    background: {
      default: '#F9FAFB',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#111827',
      secondary: '#4B5563',
      disabled: '#9CA3AF',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
      lineHeight: 1.2,
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.2,
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.2,
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.125rem',
      lineHeight: 1.2,
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
      lineHeight: 1.2,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    button: {
      fontWeight: 500,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          padding: '8px 16px',
          fontWeight: 500,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
          },
        },
        containedPrimary: {
          '&:hover': {
            backgroundColor: '#1D4ED8',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.05)',
          overflow: 'visible',
        },
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          padding: '16px 24px 8px',
        },
        title: {
          fontSize: '1.125rem',
          fontWeight: 600,
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: '8px 24px 24px',
          '&:last-child': {
            paddingBottom: 24,
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: '16px 24px',
          borderBottom: '1px solid #F3F4F6',
        },
        head: {
          fontWeight: 600,
          backgroundColor: '#F9FAFB',
          color: '#4B5563',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          fontSize: '0.875rem',
        },
      },
    },
  },
});