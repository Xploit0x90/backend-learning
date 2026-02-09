import { defineConfig } from "vitest/config";
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: "jsdom",
    setupFiles: "./tests/setup.ts",
    globals: true,
  },
  server: {
    host: '0.0.0.0', // Allow connections from outside container
    port: 3000, // Default port, can be overridden with --port flag
    watch: {
      usePolling: true, // Needed for Docker volume mounts
    },
    proxy: {
      '/api': {
        // In Docker, use service name; locally use localhost
        target: process.env.DOCKER_ENV === 'true' 
          ? 'http://backend:5000' 
          : (process.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'),
        changeOrigin: true,
      },
    },
  },
});

