// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';
import vue from '@astrojs/vue';

// https://astro.build/config
export default defineConfig({
  integrations: [react(), vue()],
  output: 'static', // Vercel: páginas estáticas (index) + API on-demand (prerender=false en contact.ts)
  adapter: vercel(),
  vite: {
    plugins: [tailwindcss()]
  }
});