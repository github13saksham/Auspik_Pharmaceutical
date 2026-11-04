import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import handler from './api/send-email.js';

// Custom Vite plugin to handle /api/send-email locally during development
function localApiPlugin() {
  return {
    name: 'local-api-handler',
    configureServer(server) {
      server.middlewares.use('/api/send-email', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.setHeader('Content-Type', 'application/json');
          return res.end(JSON.stringify({ error: 'Method not allowed' }));
        }

        let body = '';
        req.on('data', chunk => {
          body += chunk;
        });

        req.on('end', async () => {
          try {
            req.body = body ? JSON.parse(body) : {};
          } catch {
            req.body = {};
          }

          // Minimal mock response object compatible with Vercel serverless function
          const resMock = {
            status(code) {
              res.statusCode = code;
              return this;
            },
            json(data) {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(data));
              return this;
            }
          };

          try {
            await handler(req, resMock);
          } catch (err) {
            console.error('Local API Error:', err);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: err.message || 'Internal error' }));
          }
        });
      });
    }
  };
}

export default defineConfig(({ mode }) => {
  // Load environment variables so process.env has RESEND_API_KEY for the local API handler
  const env = loadEnv(mode, process.cwd(), '');
  process.env.RESEND_API_KEY = env.RESEND_API_KEY;
  if (env.RESEND_FROM_EMAIL) process.env.RESEND_FROM_EMAIL = env.RESEND_FROM_EMAIL;
  if (env.ADMIN_NOTIFICATION_EMAIL) process.env.ADMIN_NOTIFICATION_EMAIL = env.ADMIN_NOTIFICATION_EMAIL;

  return {
    plugins: [react(), localApiPlugin()],
    server: {
      watch: {
        usePolling: true,
        interval: 100,
      },
    },
  };
});
