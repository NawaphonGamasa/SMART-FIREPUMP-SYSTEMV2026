import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,  // เปลี่ยนเลข Port ตรงนี้ได้ตามใจชอบเลย
    strictPort: true, // (Option) บังคับใช้เลขนี้เท่านั้น ถ้าชนให้ Error เลย ไม่ต้องรัน
  },
})
