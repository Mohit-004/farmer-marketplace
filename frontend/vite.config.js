import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  
  // ✅ Base path configuration for DevTunnels
  base: '/',

  server: {
    host: true,                   // ✅ Ensures server runs on all IPs
    port: 5173,                   // ✅ Set the server port
    proxy: {
      "/v1": {
        target: "https://cloud.appwrite.io",  // Appwrite Cloud URL
        changeOrigin: true,                   // ✅ Changes the origin to match the target
        secure: true                          // ✅ Ensure SSL verification
      }
    },
    watch: {
      usePolling: true,            // ✅ Prevent HMR invalidation issues
      interval: 1000               // ✅ Set polling interval for stability
    },
    hmr: {
      overlay: true                // ✅ Display error overlay for HMR issues
    }
  },

  resolve: {
    alias: {
      "@": "/src"                   // ✅ Set alias for easy imports
    },
    extensions: ['.js', '.jsx']      // ✅ Ensure Vite resolves `.jsx` files
  },

  optimizeDeps: {
    include: ["react", "react-dom", "appwrite"],  // ✅ Pre-bundle essential dependencies
  }
});
