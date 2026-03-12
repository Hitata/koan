import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Change '/koan/' to match your GitHub repository name if different
export default defineConfig({
  plugins: [react()],
  base: '/koan/',
})
