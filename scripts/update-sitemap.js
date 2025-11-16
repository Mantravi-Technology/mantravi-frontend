#!/usr/bin/env node
/**
 * Sitemap Generator - Production Ready
 * 
 * This script automatically generates sitemap.xml by fetching all blog posts
 * from the API and combining them with static pages.
 * 
 * Features:
 * - Efficient pagination to fetch all blogs
 * - Error handling and retry logic
 * - XML escaping for special characters
 * - Proper date formatting
 * - No impact on website performance (runs separately)
 * 
 * Usage:
 *   npm run update-sitemap
 *   node scripts/update-sitemap.js
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const { URL } = require('url');

// Configuration
const CONFIG = {
    API_BASE_URL: 'https://api.mantravi.com',
    SITEMAP_PATH: path.join(__dirname, '..', 'sitemap.xml'),
    SITE_URL: 'https://mantravi.com',
    PAGE_SIZE: 100, // Fetch 100 blogs per request
    MAX_RETRIES: 3,
    REQUEST_TIMEOUT: 30000, // 30 seconds
};

// Static pages configuration
const STATIC_PAGES = [
    {
        url: '/',
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'daily',
        priority: '1.0',
        images: [
            {
                loc: `${CONFIG.SITE_URL}/assets/icons/ui/mantravi.png`,
                title: 'Mantravi - AI-Native Digital Solutions | Web Development, Mobile Apps & IT Services',
                caption: 'Mantravi delivers cutting-edge AI-powered digital solutions including web development, mobile apps, digital marketing, QA services, and IT consulting.'
            },
            {
                loc: `${CONFIG.SITE_URL}/assets/icons/ui/favicon/favicon-96x96.png`,
                title: 'Mantravi Favicon',
                caption: 'Mantravi company favicon and brand icon'
            },
            {
                loc: `${CONFIG.SITE_URL}/assets/icons/ui/favicon/favicon.svg`,
                title: 'Mantravi Logo SVG',
                caption: 'Mantravi scalable vector logo'
            }
        ]
    },
    {
        url: '/services',
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'weekly',
        priority: '0.9'
    },
    {
        url: '/about',
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'monthly',
        priority: '0.8'
    },
    {
        url: '/contact',
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'monthly',
        priority: '0.8'
    },
    {
        url: '/blog',
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'daily',
        priority: '0.9'
    },
    {
        url: '/work-with-us',
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'monthly',
        priority: '0.7'
    }
];

// Known blog posts (fallback if API doesn't return them)
// These will always be included in the sitemap
const KNOWN_BLOG_POSTS = [
    {
        slug: '5382b205-6c0f-4c3f-a095-29d3e0d8be98',
        lastmod: '2025-11-08',
        changefreq: 'weekly',
        priority: '0.9'
    }
];

/**
 * Escape XML special characters
 */
function escapeXml(unsafe) {
    if (!unsafe) return '';
    return unsafe
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

/**
 * Format date to YYYY-MM-DD
 */
function formatDate(dateString) {
    if (!dateString) return new Date().toISOString().split('T')[0];
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return new Date().toISOString().split('T')[0];
        }
        return date.toISOString().split('T')[0];
    } catch (error) {
        return new Date().toISOString().split('T')[0];
    }
}

/**
 * Make HTTP request with retry logic
 * Uses Node.js built-in fetch (Node 18+) or falls back to https module
 */
async function makeRequest(url, retries = CONFIG.MAX_RETRIES) {
    // Try using built-in fetch (Node 18+)
    if (typeof fetch !== 'undefined') {
        for (let attempt = 0; attempt <= retries; attempt++) {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), CONFIG.REQUEST_TIMEOUT);
                
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'User-Agent': 'Mantravi-Sitemap-Generator/1.0',
                        'Accept': 'application/json'
                    },
                    signal: controller.signal
                });
                
                clearTimeout(timeoutId);
                
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                
                const json = await response.json();
                return json;
            } catch (error) {
                if (attempt < retries) {
                    const delay = 1000 * (attempt + 1);
                    console.warn(`Request failed, retrying in ${delay}ms... (${attempt + 1}/${retries})`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                } else {
                    throw error;
                }
            }
        }
    }
    
    // Fallback to https module for older Node versions
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        const options = {
            hostname: urlObj.hostname,
            port: urlObj.port || 443,
            path: urlObj.pathname + urlObj.search,
            method: 'GET',
            headers: {
                'User-Agent': 'Mantravi-Sitemap-Generator/1.0',
                'Accept': 'application/json'
            },
            timeout: CONFIG.REQUEST_TIMEOUT
        };

        const req = https.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    try {
                        const json = JSON.parse(data);
                        resolve(json);
                    } catch (error) {
                        reject(new Error(`Failed to parse JSON: ${error.message}`));
                    }
                } else {
                    reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`));
                }
            });
        });

        req.on('error', (error) => {
            if (retries > 0) {
                console.warn(`Request failed, retrying... (${CONFIG.MAX_RETRIES - retries + 1}/${CONFIG.MAX_RETRIES})`);
                setTimeout(() => {
                    makeRequest(url, retries - 1).then(resolve).catch(reject);
                }, 1000 * (CONFIG.MAX_RETRIES - retries + 1));
            } else {
                reject(error);
            }
        });

        req.on('timeout', () => {
            req.destroy();
            if (retries > 0) {
                console.warn(`Request timeout, retrying... (${CONFIG.MAX_RETRIES - retries + 1}/${CONFIG.MAX_RETRIES})`);
                setTimeout(() => {
                    makeRequest(url, retries - 1).then(resolve).catch(reject);
                }, 1000 * (CONFIG.MAX_RETRIES - retries + 1));
            } else {
                reject(new Error('Request timeout'));
            }
        });

        req.setTimeout(CONFIG.REQUEST_TIMEOUT);
        req.end();
    });
}

/**
 * Fetch all blog posts from API with pagination
 */
async function fetchAllBlogs() {
    const blogs = [];
    let page = 0;
    let hasMore = true;
    let totalFetched = 0;

    console.log('🔄 Fetching blog posts from API...');

    while (hasMore) {
        try {
            const url = `${CONFIG.API_BASE_URL}/api/blog/published?pageNumber=${page}&pageSize=${CONFIG.PAGE_SIZE}&sortBy=publishedAt&sortDir=desc`;
            
            const response = await makeRequest(url);
            
            if (response && response.data && Array.isArray(response.data)) {
                const pageBlogs = response.data;
                blogs.push(...pageBlogs);
                totalFetched += pageBlogs.length;
                
                console.log(`   ✓ Fetched page ${page + 1}: ${pageBlogs.length} blogs (Total: ${totalFetched})`);
                
                // Check if there are more pages
                const totalPages = response.totalPages || Math.ceil((response.total || 0) / CONFIG.PAGE_SIZE);
                hasMore = pageBlogs.length === CONFIG.PAGE_SIZE && (page + 1) < totalPages;
                page++;
            } else {
                hasMore = false;
            }
        } catch (error) {
            console.error(`❌ Error fetching page ${page + 1}:`, error.message);
            // Continue with what we have instead of failing completely
            hasMore = false;
        }
    }

    return blogs;
}

/**
 * Generate sitemap XML
 */
function generateSitemap(blogs) {
    const today = new Date().toISOString().split('T')[0];
    
    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
    
    <!-- Static Pages -->
`;

    // Add static pages
    STATIC_PAGES.forEach(page => {
        xml += `    <url>
        <loc>${CONFIG.SITE_URL}${page.url}</loc>
        <lastmod>${page.lastmod}</lastmod>
        <changefreq>${page.changefreq}</changefreq>
        <priority>${page.priority}</priority>`;
        
        // Support both single image (backward compatibility) and multiple images
        const images = page.images || (page.image ? [page.image] : []);
        
        images.forEach(image => {
            xml += `
        <image:image>
            <image:loc>${image.loc}</image:loc>
            <image:title>${escapeXml(image.title)}</image:title>`;
            if (image.caption) {
                xml += `
            <image:caption>${escapeXml(image.caption)}</image:caption>`;
            }
            xml += `
        </image:image>`;
        });
        
        xml += `
    </url>
`;
    });

    // Merge API blogs with known blog posts (avoid duplicates)
    const blogMap = new Map();
    
    // Add API blogs first
    blogs.forEach(blog => {
        const slug = blog.slug || blog.id;
        if (slug) {
            blogMap.set(slug, {
                slug: slug,
                lastmod: formatDate(blog.updatedAt || blog.publishedAt || blog.createdAt),
                changefreq: 'weekly',
                priority: '0.9',
                title: blog.title || '',
                image: blog.heroImage || blog.image || blog.thumbnail
            });
        }
    });
    
    // Add known blog posts (only if not already in map)
    KNOWN_BLOG_POSTS.forEach(knownBlog => {
        if (!blogMap.has(knownBlog.slug)) {
            blogMap.set(knownBlog.slug, {
                slug: knownBlog.slug,
                lastmod: knownBlog.lastmod || formatDate(new Date()),
                changefreq: knownBlog.changefreq || 'weekly',
                priority: knownBlog.priority || '0.9',
                title: '',
                image: null
            });
        }
    });
    
    // Add blog posts to sitemap
    if (blogMap.size > 0) {
        xml += `    
    <!-- Blog Posts - Dynamically Generated (${blogMap.size} posts) -->
`;
        
        blogMap.forEach(blog => {
            const url = `${CONFIG.SITE_URL}/blog/post?slug=${encodeURIComponent(blog.slug)}`;
            const title = escapeXml(blog.title || '');
            
            xml += `    <url>
        <loc>${url}</loc>
        <lastmod>${blog.lastmod}</lastmod>
        <changefreq>${blog.changefreq}</changefreq>
        <priority>${blog.priority}</priority>`;
            
            // Add image if available
            if (blog.image) {
                let imageUrl = blog.image;
                // Ensure absolute URL
                if (imageUrl && !imageUrl.startsWith('http')) {
                    imageUrl = imageUrl.startsWith('/') ? CONFIG.SITE_URL + imageUrl : CONFIG.SITE_URL + '/' + imageUrl;
                }
                
                if (imageUrl && imageUrl.startsWith('http')) {
                    xml += `
        <image:image>
            <image:loc>${escapeXml(imageUrl)}</image:loc>
            <image:title>${title}</image:title>
        </image:image>`;
                }
            }
            
            xml += `
    </url>
`;
        });
    }

    xml += `</urlset>
`;

    return xml;
}

/**
 * Main function
 */
async function updateSitemap() {
    const startTime = Date.now();
    
    try {
        // Fetch blogs
        const blogs = await fetchAllBlogs();
        console.log(`✅ Successfully fetched ${blogs.length} blog posts`);
        
        // Generate sitemap
        console.log('📝 Generating sitemap XML...');
        const sitemapXml = generateSitemap(blogs);
        
        // Write to file
        console.log('💾 Writing sitemap.xml...');
        fs.writeFileSync(CONFIG.SITEMAP_PATH, sitemapXml, 'utf8');
        
        // Verify file was written
        const stats = fs.statSync(CONFIG.SITEMAP_PATH);
        const fileSizeKB = (stats.size / 1024).toFixed(2);
        
        const duration = ((Date.now() - startTime) / 1000).toFixed(2);
        
        // Count total blog posts (including known ones)
        const blogMap = new Map();
        blogs.forEach(blog => {
            const slug = blog.slug || blog.id;
            if (slug) blogMap.set(slug, blog);
        });
        KNOWN_BLOG_POSTS.forEach(knownBlog => {
            if (!blogMap.has(knownBlog.slug)) {
                blogMap.set(knownBlog.slug, knownBlog);
            }
        });
        const totalBlogPosts = blogMap.size;
        
        console.log(`\n✅ Sitemap updated successfully!`);
        console.log(`   📄 Location: ${CONFIG.SITEMAP_PATH}`);
        console.log(`   📊 Total URLs: ${STATIC_PAGES.length + totalBlogPosts}`);
        console.log(`   📝 Blog Posts: ${totalBlogPosts} (${blogs.length} from API, ${KNOWN_BLOG_POSTS.length} known)`);
        console.log(`   📦 File size: ${fileSizeKB} KB`);
        console.log(`   ⏱️  Duration: ${duration}s`);
        
        return {
            success: true,
            totalUrls: STATIC_PAGES.length + totalBlogPosts,
            blogPosts: totalBlogPosts,
            blogPostsFromApi: blogs.length,
            blogPostsKnown: KNOWN_BLOG_POSTS.length,
            fileSize: stats.size,
            duration: duration
        };
    } catch (error) {
        console.error('\n❌ Error updating sitemap:', error.message);
        console.error('   Stack:', error.stack);
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    updateSitemap()
        .then(() => {
            process.exit(0);
        })
        .catch((error) => {
            console.error('Fatal error:', error);
            process.exit(1);
        });
}

// Export for use in other scripts
module.exports = { updateSitemap, fetchAllBlogs, CONFIG };

