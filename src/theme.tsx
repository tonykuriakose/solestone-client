import { createTheme, PaletteMode } from '@mui/material';

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

// Optional: For dark mode support
export const getTheme = (mode: PaletteMode = 'light') => createTheme({
  ...theme,
  palette: {
    mode,
    ...(mode === 'light' ? {
      // Light mode palette
      primary: {
        main: '#1976d2',
      },
      secondary: {
        main: '#dc004e',
      },
    } : {
      // Dark mode palette
      primary: {
        main: '#90caf9',
      },
      secondary: {
        main: '#f48fb1',
      },
      background: {
        default: '#121212',
        paper: '#1e1e1e',
      },
    }),
  },
});

export default theme;