import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/test-camera/",
  server: {
    allowedHosts: ["a282-161-246-145-168.ngrok-free.app"]
  }
})
