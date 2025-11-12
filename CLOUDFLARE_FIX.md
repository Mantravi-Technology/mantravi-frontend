# 🔧 Cloudflare Pages Clean URLs Fix

## 🐛 **Problem**
After deployment to Cloudflare Pages, URLs are showing `/pages/home/` instead of clean URLs like `/`.

## ✅ **Solution Steps**

### **Step 1: Verify `_redirects` File Location**

The `_redirects` file **MUST** be in the **root directory** of your repository and included in the build output.

**Check:**
```bash
# Verify file exists in root
ls -la _redirects

# Verify it's committed to Git
git ls-files | grep _redirects
```

### **Step 2: Update Cloudflare Pages Build Settings**

1. Go to **Cloudflare Dashboard** → **Pages** → **Your Project**
2. Click **Settings** → **Builds & deployments**
3. Verify these settings:
   - **Framework preset**: `None` (or `Static HTML`)
   - **Build command**: Leave **EMPTY** (or `echo "Build complete"`)
   - **Build output directory**: `/` (root)
   - **Root directory**: `/` (if your repo root has all files)

### **Step 3: Fix `index.html` Redirect**

The root `index.html` file has a redirect that might interfere. Update it:

**Current (WRONG):**
```html
<meta http-equiv="refresh" content="0; url=/pages/home/index.html">
<script>
    window.location.replace('/pages/home/index.html');
</script>
```

**Should be (for Cloudflare Pages):**
- Either remove the redirect entirely (Cloudflare will use `_redirects`)
- Or make it redirect to `/` instead

### **Step 4: Verify `_redirects` File Format**

Your `_redirects` file should look like this:

```
# Root URL - serve homepage
/ /pages/home/index.html 200

# Clean URLs
/about /pages/about/index.html 200
/services /pages/services/index.html 200
/contact /pages/contact/index.html 200
/blog /pages/blog/index.html 200
/work-with-us /pages/work-with-us/index.html 200

# SEO Files
/robots.txt /robots.txt 200
/sitemap.xml /sitemap.xml 200

# Static assets
/assets/* /assets/* 200
/components/* /components/* 200
/config/* /config/* 200

# Catch all
/* /pages/home/index.html 200
```

**Important:**
- No trailing spaces
- One rule per line
- Format: `source destination status-code`

### **Step 5: Redeploy**

1. **Commit all changes:**
   ```bash
   git add _redirects index.html
   git commit -m "Fix Cloudflare Pages clean URLs"
   git push
   ```

2. **Trigger new deployment:**
   - Cloudflare will auto-deploy on push
   - Or manually trigger: Pages → Deployments → Retry deployment

3. **Clear Cloudflare Cache:**
   - Dashboard → Caching → Purge Everything
   - This ensures old cached redirects are cleared

### **Step 6: Test After Deployment**

Visit these URLs (should show clean URLs, not `/pages/`):
- `https://test.mantravi.com/` → Should show homepage
- `https://test.mantravi.com/services` → Should show services
- `https://test.mantravi.com/about` → Should show about
- `https://test.mantravi.com/sitemap.xml` → Should show XML
- `https://test.mantravi.com/robots.txt` → Should show text

---

## 🔍 **Troubleshooting**

### **Issue: Still seeing `/pages/home/` in URL**

**Possible Causes:**
1. `_redirects` file not in root directory
2. File not committed to Git
3. Build output directory is wrong
4. Cloudflare cache not cleared

**Fix:**
```bash
# 1. Verify file location
ls -la _redirects

# 2. Verify it's in Git
git status _redirects

# 3. If not committed:
git add _redirects
git commit -m "Add _redirects for Cloudflare Pages"
git push

# 4. Clear Cloudflare cache
# Dashboard → Caching → Purge Everything
```

### **Issue: 404 Errors**

**Possible Causes:**
1. File paths in `_redirects` are wrong
2. Files don't exist in repository
3. Build output directory incorrect

**Fix:**
- Verify all files exist: `ls -la pages/home/index.html`
- Check `_redirects` file paths match actual file locations
- Verify build output directory is `/`

### **Issue: `_redirects` File Not Working**

**Cloudflare Pages Requirements:**
- File must be named exactly `_redirects` (with underscore)
- Must be in root of build output
- Must be committed to Git
- No special characters or encoding issues

**Verify:**
```bash
# Check file name (must be exactly _redirects)
ls -la | grep redirects

# Check file encoding (should be UTF-8)
file _redirects

# Check file is in Git
git ls-files | grep redirects
```

---

## 📋 **Checklist Before Redeploying**

- [ ] `_redirects` file exists in root directory
- [ ] `_redirects` file is committed to Git
- [ ] `index.html` redirect is fixed (or removed)
- [ ] Cloudflare Pages build settings are correct
- [ ] Build output directory is `/`
- [ ] Build command is empty (or minimal)
- [ ] All page files exist in `/pages/` directory

---

## 🚀 **Quick Fix Command**

```bash
# 1. Verify _redirects is in root and committed
git ls-files | grep _redirects

# 2. If not committed, add it
git add _redirects
git commit -m "Fix Cloudflare Pages clean URLs"
git push

# 3. After push, Cloudflare will auto-deploy
# 4. Clear cache: Dashboard → Caching → Purge Everything
```

---

## 💡 **Alternative: Use `wrangler.toml`**

If `_redirects` still doesn't work, you can also configure redirects in `wrangler.toml`:

```toml
[site]
bucket = "./"

[[redirects]]
from = "/"
to = "/pages/home/index.html"
status = 200

[[redirects]]
from = "/services"
to = "/pages/services/index.html"
status = 200
# ... etc
```

But `_redirects` file is preferred and simpler.

---

**After following these steps, your clean URLs should work on Cloudflare Pages!** ✅

