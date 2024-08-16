import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { logger } from 'hono/logger';
export function initServer(args) {
    const app = new Hono();
    if (args.log) {
        app.use(logger());
    }
    if (args.onInvokeForceCompile) {
        console.log('Adding force-crx-update endpoint: /force-compile');
        app.get('/force-compile', c => {
            args.onInvokeForceCompile?.();
            return c.text('Forcing compile');
        });
    }
    app.get('/', c => {
        const html = `
        <html>
          <body>
            <h1>CRX Server</h1>
            <p>Routes:</p>
            <ul>
              <li><a href="/update.xml">/update.xml</a></li>
              <li><a href="/extension.crx">/extension.crx</a></li>
              <li><a href="/force-compile">/force-compile</a></li>
            </ul>
          </body>
        </html>
      `;
        return c.html(html);
    });
    app.get('/*', serveStatic({
        root: args.staticDir,
        onNotFound: (path, c) => {
            console.log(`${path} is not found, path: ${c.req.path}`);
        },
    }));
    return app;
}
export function serveServer({ app, hostname, port }) {
    serve({ fetch: app.fetch, hostname, port });
}
//# sourceMappingURL=index.js.map