/**
 * Production-Ready Development Server for Mantravi Website
 * Handles clean URLs: /, /services, /about, /contact, /blog, /work-with-us
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// Use PORT from environment variable, or default to 5503
// You can set PORT=5504 (or any port) before running: PORT=5504 npm start
const PORT = process.env.PORT || 5503;
const BASE_DIR = __dirname;

// MIME types for proper content-type headers
const mimeTypes = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
    '.ico': 'image/x-icon',
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'font/otf'
};

// Clean URL routing - maps URL paths to actual files
const routes = {
    '/': 'pages/home/index.html',
    '/about': 'pages/about/index.html',
    '/services': 'pages/services/index.html',
    '/contact': 'pages/contact/index.html',
    '/blog': 'pages/blog/index.html',
    '/work-with-us': 'pages/work-with-us/index.html'
};

// Create HTTP server
const server = http.createServer((req, res) => {
    // Parse the request URL
    const parsedUrl = url.parse(req.url, true);
    // Decode URL-encoded pathname (handles spaces and special characters)
    const pathname = decodeURIComponent(parsedUrl.pathname);
    const method = req.method;

    // Only handle GET and HEAD requests
    if (method !== 'GET' && method !== 'HEAD') {
        res.writeHead(405, { 'Content-Type': 'text/plain' });
        res.end('Method Not Allowed');
        return;
    }

    // Remove trailing slash (except for root)
    let cleanPath = pathname.replace(/\/$/, '') || '/';

    // Determine the file path to serve
    let filePath = null;

    // 1. Check if it's a static asset (assets, components, config)
    if (cleanPath.startsWith('/assets/') || 
        cleanPath.startsWith('/components/') || 
        cleanPath.startsWith('/config/')) {
        // Serve static files directly from root
        filePath = cleanPath.substring(1); // Remove leading slash
    }
    // 2. Check if it's a defined route
    else if (routes[cleanPath]) {
        // Map clean URL to actual file
        filePath = routes[cleanPath];
    }
    // 3. Handle blog post routes (with query parameters)
    else if (cleanPath === '/blog/post' || cleanPath.startsWith('/blog/post?')) {
        filePath = 'pages/blog/post.html';
    }
    // 4. Default to homepage for unknown routes
    else {
        filePath = 'pages/home/index.html';
    }

    // Security: Normalize and prevent directory traversal
    filePath = path.normalize(filePath);
    if (filePath.includes('..') || !filePath.startsWith('pages/') && 
        !filePath.startsWith('assets/') && 
        !filePath.startsWith('components/') && 
        !filePath.startsWith('config/')) {
        filePath = 'pages/home/index.html';
    }

    // Build full file system path
    const fullPath = path.join(BASE_DIR, filePath);

    // Get file extension for content-type
    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'application/octet-stream';

    // Check if file exists and serve it
    fs.access(fullPath, fs.constants.F_OK, (err) => {
        if (err) {
            // File not found - serve homepage as fallback
            console.log(`❌ File not found: ${filePath} -> Serving homepage`);
            serveHomepage(res);
        } else {
            // File exists - serve it
            serveFile(fullPath, res, contentType, method === 'HEAD');
        }
    });
});

// Serve a file
function serveFile(filePath, res, contentType, headOnly = false) {
    fs.readFile(filePath, (err, data) => {
        if (err) {
            console.error(`Error reading file ${filePath}:`, err);
            serveHomepage(res);
            return;
        }

        // Set headers
        const headers = {
            'Content-Type': contentType,
            'Content-Length': data.length
        };

        // Add CORS headers for development
        headers['Access-Control-Allow-Origin'] = '*';
        headers['Access-Control-Allow-Methods'] = 'GET, HEAD, OPTIONS';
        headers['Access-Control-Allow-Headers'] = 'Content-Type';
        
        // For JSON files, ensure proper caching and no responseType issues
        if (filePath.endsWith('.json')) {
            headers['Cache-Control'] = 'public, max-age=3600';
            // Don't set responseType - let the client handle it
        }

        res.writeHead(200, headers);
        
        if (headOnly) {
            res.end();
        } else {
            res.end(data);
        }
    });
}

// Serve homepage as fallback
function serveHomepage(res) {
    const homePath = path.join(BASE_DIR, 'pages/home/index.html');
    fs.readFile(homePath, (err, data) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error');
            return;
        }
        res.writeHead(200, { 
            'Content-Type': 'text/html; charset=utf-8',
            'Content-Length': data.length
        });
        res.end(data);
    });
}

// Start server - will use any available port if specified port is in use
server.listen(PORT, '0.0.0.0', () => {
    const actualPort = server.address().port;
    console.log('\n' + '='.repeat(60));
    console.log('🚀 MANTRAVI DEVELOPMENT SERVER');
    console.log('='.repeat(60));
    console.log(`📍 Server running at: http://127.0.0.1:${actualPort}`);
    if (actualPort !== PORT) {
        console.log(`   (Requested port ${PORT} was in use, using ${actualPort} instead)`);
    }
    console.log(`📁 Serving from: ${BASE_DIR}`);
    console.log('\n✨ Available Routes:');
    console.log('   /              → Homepage');
    Object.keys(routes).forEach(route => {
        if (route !== '/') {
            console.log(`   ${route.padEnd(15)} → ${routes[route]}`);
        }
    });
    console.log('\n📦 Static Assets:');
    console.log('   /assets/*      → Static files');
    console.log('   /components/*  → Component files');
    console.log('   /config/*      → Configuration files');
    console.log('\n💡 To use a different port: PORT=5504 npm start');
    console.log('💡 Press Ctrl+C to stop the server\n');
});

// Handle server errors
server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        // Try to find an available port
        const net = require('net');
        const testServer = net.createServer();
        testServer.listen(0, () => {
            const availablePort = testServer.address().port;
            testServer.close(() => {
                console.error(`\n⚠️  Port ${PORT} is already in use!`);
                console.error(`   Starting server on available port ${availablePort} instead...\n`);
                // Restart on available port
                setTimeout(() => {
                    const newServer = http.createServer(server.listeners('request')[0]);
                    newServer.listen(availablePort, '0.0.0.0', () => {
                        console.log(`✅ Server started on port ${availablePort}`);
                        console.log(`📍 Access at: http://127.0.0.1:${availablePort}\n`);
                    });
                }, 100);
            });
        });
    } else {
        console.error('Server error:', err);
        process.exit(1);
    }
});

// Handle process termination
process.on('SIGINT', () => {
    console.log('\n\n👋 Shutting down server...');
    server.close(() => {
        console.log('✅ Server stopped\n');
        process.exit(0);
    });
});
