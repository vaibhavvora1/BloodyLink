import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    // Use React Aria's ESM-compatible export files. Its modern `import`
    // export currently points to files missing from the installed package.
    conditions: ['legacy-module']
  },
  server: {
    port: 5173
  }
});
