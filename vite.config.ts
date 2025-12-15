import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Carrega variáveis de ambiente (como sua API_KEY do Vercel)
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    plugins: [react()],
    define: {
      // Substitui process.env.API_KEY pelo valor real durante o build
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  };
});