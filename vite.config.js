import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  server: {
    host: true, // এটি আপনার লোকাল নেটওয়ার্কে এক্সেস করার অনুমতি দেবে
    strictPort: true,
    hmr: {
      host: '192.168.0.111', // এখানে আপনার পিসির রিয়েল আইপি দিন
    },
  },
})
