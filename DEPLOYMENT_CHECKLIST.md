# ✅ Cloudflare Pages Deployment Checklist

## 🚨 **Critical Issue Found & Fixed**

The root `index.html` file was redirecting to `/pages/home/index.html`, which was interfering with Cloudflare Pages' `_redirects` file.

## ✅ **What Was Fixed**

1. ✅ Updated `index.html` to work with Cloudflare `_redirects`
2. ✅ Verified `_redirects` file is correct
3. ✅ Created deployment checklist

---

## 📋 **Pre-Deployment Checklist**

Before deploying to Cloudflare Pages, verify:

### **1. Files in Root Directory**
- [x] `_redirects` file exists in root
- [x] `index.html` file exists in root (updated)
- [x] `sitemap.xml` exists in root
- [x] `robots.txt` exists in root

### **2. Git Repository**
```bash
# Verify all files are committed
git status

# Should show no uncommitted changes for:
# - _redirects
# - index.html
# - sitemap.xml
# - robots.txt
```

### **3. Cloudflare Pages Settings**

Go to **Cloudflare Dashboard** → **Pages** → **Your Project** → **Settings** → **Builds & deployments**

Verify:
- [ ] **Framework preset**: `None` (or `Static HTML`)
- [ ] **Build command**: **EMPTY** (or `echo "Build complete"`)
- [ ] **Build output directory**: `/` (root)
- [ ] **Root directory**: `/` (if repo root has all files)

---

## 🚀 **Deployment Steps**

### **Step 1: Commit Changes**
```bash
git add _redirects index.html sitemap.xml robots.txt
git commit -m "Fix Cloudflare Pages clean URLs and SEO files"
git push
```

### **Step 2: Verify Deployment**
1. Go to **Cloudflare Dashboard** → **Pages** → **Your Project**
2. Check **Deployments** tab
3. Wait for deployment to complete (usually 1-2 minutes)
4. Verify deployment status is **Success**

### **Step 3: Clear Cache**
1. Go to **Cloudflare Dashboard** → **Caching** → **Configuration**
2. Click **Purge Everything**
3. This clears old cached redirects

### **Step 4: Test URLs**

After deployment, test these URLs:

**Clean URLs (Should Work):**
- ✅ `https://test.mantravi.com/` → Should show homepage (URL stays as `/`)
- ✅ `https://test.mantravi.com/services` → Should show services (URL stays clean)
- ✅ `https://test.mantravi.com/about` → Should show about page
- ✅ `https://test.mantravi.com/contact` → Should show contact page
- ✅ `https://test.mantravi.com/blog` → Should show blog page
- ✅ `https://test.mantravi.com/work-with-us` → Should show work with us page

**SEO Files:**
- ✅ `https://test.mantravi.com/sitemap.xml` → Should show XML
- ✅ `https://test.mantravi.com/robots.txt` → Should show text

**What Should NOT Happen:**
- ❌ URLs should NOT show `/pages/home/` in the address bar
- ❌ URLs should NOT redirect to `/pages/home/index.html`

---

## 🐛 **If Still Not Working**

### **Issue: Still seeing `/pages/home/` in URL**

**Check 1: Verify `_redirects` File**
```bash
# Check file exists
ls -la _redirects

# Check it's in Git
git ls-files | grep _redirects

# Check file content (first line should be: / /pages/home/index.html 200)
head -1 _redirects
```

**Check 2: Verify Build Output**
- Go to Cloudflare Pages → Deployments → Latest deployment
- Check build logs
- Verify `_redirects` file is in the build output

**Check 3: Verify Cloudflare Settings**
- Build output directory must be `/`
- Build command should be empty
- Framework preset should be `None`

**Check 4: Clear Cache Again**
- Dashboard → Caching → Purge Everything
- Wait 1-2 minutes
- Test again

### **Issue: 404 Errors**

**Possible Causes:**
1. Files don't exist in repository
2. File paths in `_redirects` are wrong
3. Build output directory is wrong

**Fix:**
```bash
# Verify all page files exist
ls -la pages/home/index.html
ls -la pages/services/index.html
ls -la pages/about/index.html
# etc.

# Verify _redirects paths match actual files
cat _redirects
```

---

## 📝 **Current `_redirects` File**

Your `_redirects` file should contain:

```
# Root URL - serve homepage
/ /pages/home/index.html 200

# Clean URLs
/about /pages/about/index.html 200
/services /pages/services/index.html 200
/contact /pages/contact/index.html 200
/blog /pages/blog/index.html 200
/blog/post /pages/blog/post.html 200
/work-with-us /pages/work-with-us/index.html 200

# Redirect /index.html to root
/index.html / 301

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

---

## ✅ **Success Criteria**

After deployment, you should see:

1. ✅ Clean URLs work: `test.mantravi.com/` (not `/pages/home/`)
2. ✅ All pages accessible with clean URLs
3. ✅ `sitemap.xml` accessible at `/sitemap.xml`
4. ✅ `robots.txt` accessible at `/robots.txt`
5. ✅ No redirect loops
6. ✅ Fast page loads

---

## 🎯 **Next Steps After Deployment**

1. ✅ Test all URLs
2. ✅ Submit sitemap to Google Search Console
3. ✅ Verify robots.txt is accessible
4. ✅ Monitor Cloudflare Pages analytics
5. ✅ Check for any console errors

---

**Status**: ✅ Ready for deployment!
**Files Updated**: `index.html`, `_redirects` verified
**Next Action**: Commit and push to trigger deployment

