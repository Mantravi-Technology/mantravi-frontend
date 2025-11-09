# Mantravi Website - Development Server Setup

## 🚀 Quick Start

### 1. Stop Any Running Servers
- **STOP VS Code Live Server** (click "Go Live" button to stop)
- Close any other servers running on port 5503

### 2. Start the Node.js Server
```bash
npm start
```

### 3. Access Your Website
Open your browser and go to:
- **Homepage**: `http://127.0.0.1:5503/`
- **Services**: `http://127.0.0.1:5503/services`
- **About**: `http://127.0.0.1:5503/about`
- **Contact**: `http://127.0.0.1:5503/contact`
- **Blog**: `http://127.0.0.1:5503/blog`
- **Work With Us**: `http://127.0.0.1:5503/work-with-us`

## ✅ Clean URLs

All URLs are clean and simple:
- ✅ `http://127.0.0.1:5503/` - Homepage (no `/pages/home/index.html`)
- ✅ `http://127.0.0.1:5503/services` - Services page
- ✅ `http://127.0.0.1:5503/about` - About page
- ✅ `http://127.0.0.1:5503/contact` - Contact page
- ✅ `http://127.0.0.1:5503/blog` - Blog page
- ✅ `http://127.0.0.1:5503/work-with-us` - Work With Us page

## 🔧 Troubleshooting

### Issue: "Cannot GET /services"
**Solution**: Make sure you're using the Node.js server (`npm start`), NOT Live Server

### Issue: Blank page
**Solution**: 
1. Check browser console (F12) for errors
2. Verify server is running: `ps aux | grep "node server.js"`
3. Restart server: `npm start`

### Issue: Assets not loading
**Solution**: All paths are now absolute (`/assets/...`). If issues persist, clear browser cache (Ctrl+Shift+R)

## 📝 Important Notes

- **DO NOT use Live Server** - it doesn't support clean URLs
- **Use Node.js server** (`npm start`) for development
- All paths are absolute - they work from any URL
- Server runs on port 5503 by default

## 🎯 Production

For production deployment:
- Use Apache with `.htaccess` (already configured)
- The `.htaccess` file handles clean URLs on Apache servers
- All paths are production-ready with absolute URLs

