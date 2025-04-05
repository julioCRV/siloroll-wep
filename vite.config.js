import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Redirige todas las peticiones que empiecen con /api al backend
      '/api': {
        target: 'http://silo-roll-backend.onrender.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        secure: false, // Opcional: desactiva verificación SSL si es necesario
      }
    }
  }
})