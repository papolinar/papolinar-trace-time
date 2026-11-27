import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

// `npm run build` writes one self-contained file, dist/index.html, with all
// JS, CSS and fonts inlined so it works offline on the iPad.
export default defineConfig({
  plugins: [viteSingleFile()],
  build: { target: 'safari15', outDir: 'dist', emptyOutDir: true },
});
