# Cloudflare Pages Setup Guide - Clean URLs

## ✅ Configuration Complete!

Your website is now configured for clean URLs on Cloudflare Pages:

- **Homepage**: `mantravi.com` → serves `/pages/home/index.html`
- **Services**: `mantravi.com/services` → serves `/pages/services/index.html`
- **About**: `mantravi.com/about` → serves `/pages/about/index.html`
- **Contact**: `mantravi.com/contact` → serves `/pages/contact/index.html`
- **Blog**: `mantravi.com/blog` → serves `/pages/blog/index.html`
- **Work With Us**: `mantravi.com/work-with-us` → serves `/pages/work-with-us/index.html`

## 🚀 Deployment Steps

### 1. Connect Your Repository
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **Pages** → **Create a project**
3. Connect your Git repository (GitHub, GitLab, or Bitbucket)

### 2. Build Settings
Configure these settings in Cloudflare Pages:

- **Framework preset**: None (or Static HTML)
- **Build command**: Leave **EMPTY** (no build needed for static site)
- **Build output directory**: `/` (root directory)
- **Root directory**: `/` (if your repo root contains all files)

### 3. Environment Variables (Optional)
No environment variables needed for basic setup.

### 4. Deploy
Click **Save and Deploy**. Cloudflare will:
- Deploy your site automatically
- Use the `_redirects` file for clean URLs
- Enable CDN caching for fast loading

## 📁 Files Used

1. **`_redirects`** - Cloudflare Pages redirect rules (replaces .htaccess)
2. **`index.html`** - Root redirect file (fallback)

## ⚡ Performance Optimizations

Cloudflare Pages automatically provides:
- ✅ Global CDN (fast loading worldwide)
- ✅ Automatic HTTPS
- ✅ DDoS protection
- ✅ Image optimization (if enabled)
- ✅ Browser caching
- ✅ Edge caching

## 🔧 How It Works

1. User visits `mantravi.com/services`
2. Cloudflare checks `_redirects` file
3. Finds rule: `/services /pages/services/index.html 200`
4. Serves the file but keeps URL as `mantravi.com/services` (clean URL!)
5. User sees clean URL, not `/pages/services/index.html`

## 📝 URL Structure

### Clean URLs (What Users See):
```
mantravi.com
mantravi.com/services
mantravi.com/about
mantravi.com/contact
mantravi.com/blog
mantravi.com/work-with-us
```

### Actual Files (Internal):
```
/pages/home/index.html
/pages/services/index.html
/pages/about/index.html
/pages/contact/index.html
/pages/blog/index.html
/pages/work-with-us/index.html
```

## 🐛 Troubleshooting

### URLs showing `/pages/home/` instead of `/`
- Check that `_redirects` file is in the root directory
- Verify the file is committed to your repository
- Redeploy on Cloudflare Pages

### 404 Errors
- Ensure all page files exist in `/pages/` directory
- Check `_redirects` file syntax (no extra spaces)
- Clear Cloudflare cache: Dashboard → Caching → Purge Everything

### Build Fails
- Set Build command to: `echo "Build complete"` or leave empty
- Set Build output directory to: `/`
- Check that all required files are in the repository

## 🎯 Testing

After deployment, test these URLs:
- ✅ `https://your-domain.com` → Should show homepage
- ✅ `https://your-domain.com/services` → Should show services page
- ✅ `https://your-domain.com/about` → Should show about page
- ✅ `https://your-domain.com/contact` → Should show contact page
- ✅ `https://your-domain.com/blog` → Should show blog page

All URLs should be clean (no `/pages/` in the URL).

## 📊 Performance Tips

1. **Enable Cloudflare Auto Minify**:
   - Dashboard → Speed → Optimization
   - Enable: JavaScript, CSS, HTML minification

2. **Enable Brotli Compression**:
   - Dashboard → Speed → Optimization
   - Enable: Brotli

3. **Cache Static Assets**:
   - Already handled by Cloudflare Pages
   - Assets in `/assets/` are automatically cached

4. **Image Optimization**:
   - Use WebP format for images
   - Enable Cloudflare Image Resizing (if needed)

## 🔒 Security

Cloudflare automatically provides:
- ✅ SSL/TLS encryption (HTTPS)
- ✅ DDoS protection
- ✅ WAF (Web Application Firewall) - if enabled
- ✅ Bot protection

## 📱 Custom Domain

1. Go to Cloudflare Pages → Your Project → Custom domains
2. Add your domain: `mantravi.com`
3. Cloudflare will automatically configure DNS
4. Wait for DNS propagation (usually 5-15 minutes)

---

**Status**: ✅ Ready for Cloudflare Pages deployment!
**Clean URLs**: ✅ Configured
**Performance**: ✅ Optimized

