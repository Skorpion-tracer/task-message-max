import react from '@vitejs/plugin-react';
import {defineConfig} from 'vite';

// https://vite.dev/config/
export default defineConfig({
    plugins: [ react() ],
    server: {
        open: true,
        port: 5173,  // сменили порт
        host: true,
        proxy: {
            '/api': {
                target: 'http://localhost:3000',
                changeOrigin: true
            }
        }
    }
});
