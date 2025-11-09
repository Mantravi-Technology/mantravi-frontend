# Development Setup Guide

## Quick Start for Local Development

### Option 1: Direct Access (Recommended for Local Development)
Since Live Server and other local development servers don't process `.htaccess` files, you should access the homepage directly:

```
http://127.0.0.1:5502/pages/home/index.html
```

Or open the file directly:
- Navigate to `pages/home/index.html` in your file explorer
- Right-click and "Open with Live Server" or your preferred server

### Option 2: Using the Root Index
The root `index.html` will automatically redirect to the homepage in local development.

## Troubleshooting Blank Page Issues

### 1. Check Browser Console
Open browser DevTools (F12) and check for errors:
- **Network errors**: Failed to load assets (CSS, JS, components)
- **CORS errors**: Component loader fetch requests blocked
- **JavaScript errors**: Scripts failing to execute

### 2. Verify File Paths
Make sure all relative paths are correct:
- From `pages/home/index.html`: `../../assets/` (correct)
- From root `index.html`: `assets/` (not used directly)

### 3. Component Loader Issues
If components aren't loading:
- Check if `components/header/header.html` exists
- Check if `components/footer/footer.html` exists
- Verify fetch requests in Network tab

### 4. CORS Issues in Local Development
Some browsers block `file://` protocol for fetch requests. Always use a local server:
- VS Code: Live Server extension
- Python: `python -m http.server 8000`
- Node.js: `npx http-server`

## Production Deployment

### Apache Server
1. Ensure `.htaccess` is uploaded to root directory
2. Verify `mod_rewrite` is enabled
3. Test clean URLs: `mantravi.com/`, `mantravi.com/services`, etc.

### API Configuration
- API Base URL: `https://api.mantravi.com`
- Configured in: `assets/js/api-service.js`

## Common Issues

### Blank Page
- **Cause**: Component loader failing or JavaScript errors
- **Solution**: Check browser console, verify file paths, use local server

### Redirect Loop
- **Cause**: `.htaccess` not working or conflicting redirects
- **Solution**: Access `pages/home/index.html` directly in local dev

### Assets Not Loading
- **Cause**: Incorrect relative paths
- **Solution**: Verify paths are correct relative to current file location

## File Structure
```
mantravi-frontend-1/
├── index.html (root redirect)
├── .htaccess (production URL rewriting)
├── pages/
│   ├── home/
│   │   └── index.html (main homepage)
│   ├── about/
│   ├── services/
│   ├── contact/
│   └── blog/
├── assets/
│   ├── css/
│   ├── js/
│   └── icons/
└── components/
    ├── header/
    ├── footer/
    └── ...
```

## Testing Checklist
- [ ] Homepage loads correctly
- [ ] Navigation links work
- [ ] Components load (header, footer)
- [ ] API calls work (check network tab)
- [ ] No console errors
- [ ] Responsive design works
- [ ] Clean URLs work (production only)

