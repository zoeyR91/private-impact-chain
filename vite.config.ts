import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "valtio/vanilla": "valtio",
    },
  },
  define: { 
    global: 'globalThis'  // Required for FHE SDK
  },
  optimizeDeps: { 
    include: [
      '@zama-fhe/relayer-sdk/bundle',  // Pre-build FHE SDK
      'valtio',
      'derive-valtio'
    ]
  },
  build: {
    rollupOptions: {
      external: []
    }
  }
}));
