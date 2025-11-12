/**
 * Centralized Routes Configuration
 * Single source of truth for all URL routing
 * 
 * This file can be used by:
 * - Cloudflare Pages Functions
 * - Netlify Functions
 * - Vercel rewrites
 * - Apache .htaccess generation
 * - Nginx config generation
 * - Any other routing system
 * 
 * To add a new route:
 * 1. Add it to this routes object
 * 2. Update platform-specific configs if needed
 */

const ROUTES_CONFIG = {
  // Clean URL -> Actual File Path
  routes: {
    '/': '/pages/home/index.html',
    '/about': '/pages/about/index.html',
    '/services': '/pages/services/index.html',
    '/contact': '/pages/contact/index.html',
    '/blog': '/pages/blog/index.html',
    '/blog/post': '/pages/blog/post.html',
    '/work-with-us': '/pages/work-with-us/index.html',
  },

  // Static asset paths (should pass through without routing)
  staticPaths: [
    '/assets',
    '/components',
    '/config',
  ],

  // SEO files (should be served directly)
  seoFiles: [
    '/robots.txt',
    '/sitemap.xml',
  ],

  // Redirects (from -> to, status code)
  redirects: {
    '/index.html': { to: '/', status: 301 },
  },
};

// Export for use in different environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ROUTES_CONFIG;
}

// Make available globally for browser/Cloudflare Workers
if (typeof window !== 'undefined') {
  window.ROUTES_CONFIG = ROUTES_CONFIG;
}

// For Cloudflare Workers/Pages Functions
if (typeof globalThis !== 'undefined') {
  globalThis.ROUTES_CONFIG = ROUTES_CONFIG;
}

