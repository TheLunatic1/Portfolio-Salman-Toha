import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

function localSeoDevPlugin() {
  const attach = (middlewares) => {
    for (const route of ['/api/seo', '/sitemap.xml', '/robots.txt']) {
      middlewares.use(route, (req, res) => {
        void import('./api/seo.js').then((mod) => mod.default(req, res));
      });
    }
  };
  return {
    name: 'local-seo-dev',
    configureServer(server) {
      attach(server.middlewares);
    },
    configurePreviewServer(server) {
      attach(server.middlewares);
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), localSeoDevPlugin()],
});
