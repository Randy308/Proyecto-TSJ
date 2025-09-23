import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { nodePolyfills } from "vite-plugin-node-polyfills";
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), nodePolyfills({
    protocolImports: true,
  }),],
  build: {
    outDir: 'C://Users//randy//www//Proyecto-TSJ//backend//public',
  }
})
