import { defineConfig, loadEnv } from "vite";
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env so proxy target can use VITE_API_URL from .env
  const env = loadEnv(mode, process.cwd(), '');
  const apiUrl = env.VITE_API_URL || 'http://localhost:3001';
  const proxyTarget = env.DOCKER_ENV === 'true'
    ? 'http://backend:5000'
    : apiUrl.replace(/\/api\/?$/, '');

  return {
    plugins: [react(), tsconfigPaths()],
    build: {
      target: 'es2020',
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (id.includes('node_modules')) {
              if (id.includes('react-dom') || (id.includes('react') && !id.includes('react-router') && !id.includes('react-i18next'))) return 'vendor-react';
              if (id.includes('@chakra-ui') || id.includes('@emotion') || id.includes('framer-motion')) return 'vendor-chakra';
              if (id.includes('react-router')) return 'vendor-router';
              if (id.includes('i18next') || id.includes('react-i18next')) return 'vendor-i18n';
              if (id.includes('axios')) return 'vendor-axios';
              if (id.includes('lucide-react')) return 'vendor-lucide';
              return 'vendor-misc';
            }
          },
          chunkFileNames: 'assets/[name]-[hash].js',
          entryFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash][extname]',
        },
      },
      cssCodeSplit: true,
      minify: 'esbuild',
    },
    test: {
      environment: "jsdom",
      setupFiles: "./tests/setup.ts",
      globals: true,
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      watch: {
        usePolling: true,
      },
      proxy: {
        '/api': {
          target: proxyTarget,
          changeOrigin: true,
        },
      },
    },
  };
});

