import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(() => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    // Add a plugin to handle valtio/vanilla imports
    {
      name: 'valtio-vanilla-polyfill',
      resolveId(id) {
        if (id === 'valtio/vanilla') {
          return 'valtio';
        }
        return null;
      }
    }
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: { 
    global: 'globalThis'  // Required for FHE SDK
  },
  optimizeDeps: { 
    include: [
      '@zama-fhe/relayer-sdk/bundle'  // Pre-build FHE SDK
    ]
  }
}));
