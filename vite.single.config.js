// Builds the whole game into ONE self-contained HTML file for the Expo (React Native) app.
import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig({
  plugins: [viteSingleFile()],
  build: { outDir: 'dist-single', emptyOutDir: true },
});
