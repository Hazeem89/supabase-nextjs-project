'use client';

import { createTheme } from '@mui/material/styles';
import { svSE } from '@mui/material/locale';

export function createAppTheme(mode: 'light' | 'dark') {
  return createTheme(
    {
      palette: {
        mode,
        primary: {
          main: '#1976d2',
          light: '#42a5f5',
          dark: '#1565c0',
          contrastText: '#ffffff',
        },
        secondary: {
          main: '#9c27b0',
          light: '#ba68c8',
          dark: '#7b1fa2',
          contrastText: '#ffffff',
        },
        background: mode === 'light'
          ? { default: '#fafafa', paper: '#ffffff' }
          : { default: '#121212', paper: '#1e1e1e' },
      },
      typography: {
        fontFamily: 'var(--font-geist-sans), Arial, sans-serif',
      },
      shape: {
        borderRadius: 12,
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              textTransform: 'none',
              borderRadius: 20,
            },
          },
        },
        MuiCard: {
          styleOverrides: {
            root: {
              borderRadius: 16,
            },
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              borderRadius: 16,
            },
          },
        },
        MuiTextField: {
          styleOverrides: {
            root: {
              '& .MuiOutlinedInput-root': {
                borderRadius: 12,
              },
            },
          },
        },
      },
    },
    svSE
  );
}
