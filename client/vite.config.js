import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      src: path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: '0.0.0.0', // 让外网可访问
    allowedHosts: [
      'd0d1-171-43-247-174.ngrok-free.app', // 必须写 ngrok 当前分配的域名
    ],
    proxy: {
      '/api': {
        target: 'http://localhost:4399', // ✅ 后端地址
        changeOrigin: true,
      },
    },
  },
})
