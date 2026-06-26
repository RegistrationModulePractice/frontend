import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    define: {
      'import.meta.env.API_URL': JSON.stringify(env.API_URL ?? ''),
    },
    server: {
      proxy: {
        '/api': {
          target: env.API_URL || 'http://127.0.0.1:3000',
          changeOrigin: true,
        },
      },
    },
  };
});
