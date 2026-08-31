// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';
import vue from '@astrojs/vue';

// https://astro.build/config
export default defineConfig({
  integrations: [react(), vue()],
  output: 'static', // por defecto — prerenderiza todo excepto lo que marques prerender = false
  adapter: vercel(),
  vite: {
    plugins: [tailwindcss()]
  }
});