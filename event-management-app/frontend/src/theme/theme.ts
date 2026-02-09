import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

interface ThemeStyleProps {
  colorMode?: 'light' | 'dark';
  theme?: Record<string, unknown>;
}

// Custom theme matching the current design
const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  colors: {
    brand: {
      50: '#FFFCF2',
      100: '#CCC5B9',
      200: '#EB5E28',
      300: '#403D39',
      400: '#252422',
    },
    orange: {
      500: '#EB5E28',
      600: '#d94d1a',
    },
    gray: {
      50: '#FFFCF2',
      100: '#CCC5B9',
      200: '#CCC5B9',
      300: '#403D39',
      400: '#252422',
      800: '#1f1f1d',
      900: '#2a2a28',
    },
  },
  styles: {
    global: (props: ThemeStyleProps) => ({
      body: {
        bg: props.colorMode === 'dark' 
          ? 'linear-gradient(145deg, #1f1f1d, #2a2a28)' 
          : '#FFFCF2',
        color: props.colorMode === 'dark' ? '#f4f1ec' : '#252422',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        transition: 'background 0.3s ease, color 0.3s ease',
      },
    }),
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 600,
        borderRadius: '12px',
      },
      variants: {
        primary: {
          bg: '#EB5E28',
          color: 'white',
          _hover: {
            bg: '#d94d1a',
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 15px rgba(235, 94, 40, 0.3)',
          },
        },
        secondary: {
          bg: 'rgba(235, 94, 40, 0.1)',
          color: '#403D39',
          _hover: {
            bg: 'rgba(235, 94, 40, 0.2)',
          },
        },
      },
      defaultProps: {
        variant: 'primary',
      },
    },
    Card: {
      baseStyle: (props: ThemeStyleProps) => ({
        container: {
          bg: props.colorMode === 'dark' 
            ? 'rgba(50, 48, 46, 0.7)' 
            : 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(20px)',
          border: props.colorMode === 'dark'
            ? '1px solid rgba(255, 255, 255, 0.08)'
            : '1px solid rgba(204, 197, 185, 0.3)',
          borderRadius: '20px',
          boxShadow: props.colorMode === 'dark'
            ? '0 8px 32px rgba(0, 0, 0, 0.4)'
            : '0 8px 32px rgba(0, 0, 0, 0.08)',
        },
      }),
    },
  },
});

export default theme;

