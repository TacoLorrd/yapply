import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import process from 'node:process';

export default defineConfig(({ mode }) => {
  // Explicitly import and use process.cwd() to correctly locate the project root for environment loading
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
      'process.env.FIREBASE_API_KEY': JSON.stringify(env.FIREBASE_API_KEY),
      // Add other firebase envs if you decide to move them out of hardcoded strings
    },
    server: {
      host: true,
      port: 3000,
    }
  };
});
