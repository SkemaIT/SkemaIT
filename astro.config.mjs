// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';
import vue from '@astrojs/vue';

// https://astro.build/config
export default defineConfig({
  integrations: [react(), vue()],
  output: 'server', // Vercel on-demand: habilita /api/contact (prerender=false); páginas estáticas siguen con prerender por defecto
  adapter: vercel(),
  vite: {
    plugins: [tailwindcss()]
  }
});