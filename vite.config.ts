import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  envDir: "src/_environment",
  plugins: [react()],
})