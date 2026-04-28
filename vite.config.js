import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Vendor splitting for optimal caching
          if (id.includes('node_modules/react-dom')) return 'vendor-react'
          if (id.includes('node_modules/react-router')) return 'vendor-react'
          if (id.includes('node_modules/recharts') || id.includes('node_modules/d3')) return 'vendor-charts'
          if (id.includes('node_modules/lucide-react')) return 'vendor-icons'
          if (id.includes('node_modules/zustand')) return 'vendor-state'
        },
      },
    },
  },
})
