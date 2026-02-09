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
    resolve: {
      dedupe: ['react', 'react-dom'],
    },
    build: {
      target: 'es2020',
      sourcemap: false,
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

