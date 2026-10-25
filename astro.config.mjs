import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import brisk from '@briskcms/astro/integration.js';
import { site } from './schema.ts';
// Its content, the release's assets prefix and the static build come from
// the Brisk integration (@briskcms/astro).
export default defineConfig({
  integrations: [brisk({ site })],
  trailingSlash: 'always',
  build: { inlineStylesheets: 'never' },
  vite: {
    plugins: [tailwindcss()],
    build: {
      // Stylesheets and other assets.
      rollupOptions: {
        output: {
          assetFileNames: '_astro/[hash][extname]',
          chunkFileNames: '_astro/[hash].js',
          entryFileNames: '_astro/[hash].js',
        },
      },
    },
    // Files named by hash alone: Astro names scripts and styles after the
    // page or component they came from, and a page like [...slug] gives a
    // name holding "..", which the edge refuses as traversal. Astro applies
    // the client environment's names to scripts last, after the build's own
    // above.
    environments: {
      client: {
        build: {
          rolldownOptions: {
            output: {
              entryFileNames: '_astro/[hash].js',
              chunkFileNames: '_astro/[hash].js',
              assetFileNames: '_astro/[hash][extname]',
            },
          },
        },
      },
    },
  },
});
