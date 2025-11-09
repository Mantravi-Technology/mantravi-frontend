# Cloudflare Pages Configuration

## Build Settings in Cloudflare Dashboard:

1. **Build command:** Leave empty OR use: `npm run pages:build`
2. **Build output directory:** `/` (root directory)
3. **Root directory:** `/` (if your repo root contains all files)

## Important Notes:

- Cloudflare Pages serves static files only - it does NOT run Node.js servers
- The `server.js` file is for LOCAL DEVELOPMENT ONLY
- Cloudflare Pages uses `_redirects` file instead of `.htaccess`
- Make sure `_redirects` file is in the root directory

## If Build is Stuck:

1. Go to Cloudflare Dashboard → Pages → Your Project → Settings
2. Change Build command to: `echo "Build complete"`
3. Or leave Build command empty
4. Set Build output directory to: `/`
5. Save and redeploy

