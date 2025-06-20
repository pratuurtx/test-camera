import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/test-camera/",
  server: {
    allowedHosts: ["f3b5-103-106-8-146.ngrok-free.app"]
  }
})
