/**
 * Cloudflare Pages Functions Middleware
 * Handles clean URL routing - rewrites URLs without changing the address bar
 * File location: functions/_middleware.js
 */

export async function onRequest(context) {
  const url = new URL(context.request.url);
  const pathname = url.pathname;

  // Clean URL routing map - maps clean URLs to actual file paths
  const routes = {
    '/': '/pages/home/index.html',
    '/about': '/pages/about/index.html',
    '/services': '/pages/services/index.html',
    '/contact': '/pages/contact/index.html',
    '/blog': '/pages/blog/index.html',
    '/blog/post': '/pages/blog/post.html',
    '/work-with-us': '/pages/work-with-us/index.html',
  };

  // Check if it's a clean URL route that needs rewriting
  if (routes[pathname]) {
    // Rewrite the request to the actual file path
    // This keeps the URL clean in the browser
    const newUrl = new URL(routes[pathname], url.origin);
    
    // Use the rewrite method to serve the file without changing URL
    return context.rewrite(newUrl);
  }

  // For /index.html, redirect to root (301 permanent redirect)
  if (pathname === '/index.html' || pathname === '/index.html/') {
    return Response.redirect(new URL('/', url.origin), 301);
  }

  // For SEO files and static assets, let them pass through
  // (sitemap.xml, robots.txt, /assets/*, /components/*, /config/*)
  // These should be served directly without modification
  
  // Continue to next handler (or serve file as-is)
  return context.next();
}

