/**
 * Cloudflare Pages Functions Middleware
 * Portable routing solution - works with any hosting provider
 * Handles clean URL routing by rewriting requests
 * 
 * This approach is platform-independent and can be adapted to:
 * - Cloudflare Pages (current)
 * - Netlify (similar Functions)
 * - Vercel (similar approach)
 * - Any static host with serverless functions
 * 
 * Routes are defined in: config/routes-config.js (single source of truth)
 */

// Import routes configuration (if available)
// For Cloudflare Pages, we'll define routes inline but can reference config
const ROUTES_CONFIG = {
  routes: {
    '/': '/pages/home/index.html',
    '/about': '/pages/about/index.html',
    '/services': '/pages/services/index.html',
    '/contact': '/pages/contact/index.html',
    '/blog': '/pages/blog/index.html',
    '/blog/post': '/pages/blog/post.html',
    '/work-with-us': '/pages/work-with-us/index.html',
  },
  staticPaths: ['/assets', '/components', '/config'],
  seoFiles: ['/robots.txt', '/sitemap.xml'],
};

export async function onRequest(context) {
  try {
    const url = new URL(context.request.url);
    const pathname = url.pathname;

    // Use centralized routes configuration
    const routes = ROUTES_CONFIG.routes;

    // Check if it's a route that needs rewriting
    if (routes[pathname]) {
      // Create new URL for the actual file
      const fileUrl = new URL(routes[pathname], url.origin);
      
      // Fetch the actual file
      const response = await context.env.ASSETS.fetch(fileUrl, {
        method: context.request.method,
        headers: context.request.headers,
      });

      // Return response with original URL (keeps clean URL in browser)
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: {
          ...Object.fromEntries(response.headers),
          // Ensure content type is correct
          'Content-Type': response.headers.get('Content-Type') || 'text/html; charset=utf-8',
        },
      });
    }

    // Handle /index.html -> redirect to root (301 permanent)
    if (pathname === '/index.html' || pathname === '/index.html/') {
      return Response.redirect(new URL('/', url.origin), 301);
    }

    // For static assets and SEO files, pass through unchanged
    // These should be served directly
    const isStaticPath = ROUTES_CONFIG.staticPaths.some(staticPath => 
      pathname.startsWith(staticPath + '/')
    );
    const isSeoFile = ROUTES_CONFIG.seoFiles.includes(pathname);
    
    if (isStaticPath || isSeoFile) {
      return context.next();
    }

    // For all other routes, continue to next handler
    // This allows _redirects file to handle fallbacks
    return context.next();
  } catch (error) {
    // Error handling - log but don't break the site
    console.error('Middleware routing error:', error);
    // Fall through to next handler (let _redirects handle it)
    return context.next();
  }
}

