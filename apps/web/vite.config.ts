import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  server: {
    fs: {
      // packages/tokens is the single source of brand truth and lives outside apps/web.
      allow: ['../../packages'],
    },
  },
});
