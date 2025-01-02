import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler', // or "modern",
        silenceDeprecations: ['mixed-decls','color-function','global-builtin','import'],
      }
    }
  }
},)
