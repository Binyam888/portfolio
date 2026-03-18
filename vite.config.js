import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react()
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Isolate the largest dependencies into their own chunks
          // so the main bundle stays small and they can be cached separately
          'three-vendor': ['three', '@react-three/fiber', '@react-three/drei'],
          'motion-vendor': ['framer-motion'],
          'gsap-vendor': ['gsap', '@gsap/react'],
        }
      }
    },
    // Default chunk size warning threshold
    chunkSizeWarningLimit: 1000,
  }
})
