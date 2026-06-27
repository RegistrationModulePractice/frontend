import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const apiBaseUrl = env.API_URL ?? '';
  const apiProxyTarget = env.API_PROXY_TARGET || env.API_URL || 'http://127.0.0.1:3000';

  return {
    plugins: [react()],
    define: {
      'import.meta.env.API_URL': JSON.stringify(apiBaseUrl),
      'import.meta.env.TILDA_PARENT_ORIGIN': JSON.stringify(env.TILDA_PARENT_ORIGIN ?? ''),
    },
    server: {
      proxy: {
        '/api': {
          target: apiProxyTarget,
          changeOrigin: true,
        },
      },
    },
  };
});
