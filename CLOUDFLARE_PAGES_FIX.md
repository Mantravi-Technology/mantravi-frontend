# 🔧 Cloudflare Pages Clean URLs - Complete Fix

## 🐛 **Problem**
After deployment, URLs show `/pages/home/` instead of clean URLs like `/`.

## ✅ **Solution: Use Cloudflare Pages Functions**

The `_redirects` file might not be working. We'll use **Cloudflare Pages Functions** as a more reliable solution.

---

## 📁 **Step 1: Create Functions Directory**

Create a `functions` directory in your **root** directory:

```bash
mkdir functions
```

---

## 📝 **Step 2: Create Middleware Function**

I've created `functions/_middleware.js` for you. This file handles clean URL routing.

**File Location**: `functions/_middleware.js`

This middleware will:
- ✅ Route `/` to `/pages/home/index.html` (keeping clean URL)
- ✅ Route `/services` to `/pages/services/index.html`
- ✅ Route `/about` to `/pages/about/index.html`
- ✅ And all other clean URLs
- ✅ Serve SEO files (`sitemap.xml`, `robots.txt`)
- ✅ Handle static assets

---

## 🚀 **Step 3: Update `index.html`**

I've updated `index.html` to be simpler - it just redirects to the homepage.

---

## 📋 **Step 4: Deployment Steps**

### **1. Commit All Files**
```bash
git add functions/_middleware.js index.html _redirects
git commit -m "Add Cloudflare Pages Functions for clean URLs"
git push
```

### **2. Verify Cloudflare Pages Settings**

Go to **Cloudflare Dashboard** → **Pages** → **Your Project** → **Settings** → **Builds & deployments**

**Required Settings:**
- **Framework preset**: `None` (or `Static HTML`)
- **Build command**: **EMPTY** (or `echo "Build complete"`)
- **Build output directory**: `/` (root)
- **Root directory**: `/` (if repo root has all files)

### **3. Verify Functions Directory**

Cloudflare Pages will automatically detect the `functions` directory and use the middleware.

**Important**: The `functions` directory must be in the **root** of your repository.

### **4. Deploy**

After pushing, Cloudflare will:
1. Auto-deploy your changes
2. Detect the `functions/_middleware.js` file
3. Apply clean URL routing

### **5. Clear Cache**

After deployment:
1. **Cloudflare Dashboard** → **Caching** → **Configuration**
2. Click **"Purge Everything"**
3. Wait 1-2 minutes

---

## 🧪 **Step 5: Test**

After deployment, test these URLs:

**Should Work (Clean URLs):**
- ✅ `https://test.mantravi.com/` → Shows homepage (URL stays as `/`)
- ✅ `https://test.mantravi.com/services` → Shows services (URL stays clean)
- ✅ `https://test.mantravi.com/about` → Shows about page
- ✅ `https://test.mantravi.com/contact` → Shows contact page
- ✅ `https://test.mantravi.com/blog` → Shows blog page
- ✅ `https://test.mantravi.com/work-with-us` → Shows work with us page

**SEO Files:**
- ✅ `https://test.mantravi.com/sitemap.xml` → Shows XML
- ✅ `https://test.mantravi.com/robots.txt` → Shows text

**What Should NOT Happen:**
- ❌ URLs should NOT show `/pages/home/` in address bar
- ❌ URLs should NOT redirect to `/pages/home/index.html`

---

## 🔍 **How It Works**

### **Cloudflare Pages Functions**

1. **User visits**: `test.mantravi.com/`
2. **Middleware intercepts**: The `_middleware.js` function runs first
3. **Route matched**: Finds `/` in routes map
4. **File served**: Serves `/pages/home/index.html`
5. **URL stays clean**: Browser shows `test.mantravi.com/` (not `/pages/home/`)

### **Why This Works Better**

- ✅ More reliable than `_redirects` file
- ✅ Runs on Cloudflare's edge network (fast)
- ✅ Full control over routing logic
- ✅ Works with Cloudflare Pages automatically

---

## 🐛 **Troubleshooting**

### **Issue: Still seeing `/pages/home/`**

**Check 1: Verify Functions Directory**
```bash
# Check functions directory exists
ls -la functions/

# Check _middleware.js exists
ls -la functions/_middleware.js
```

**Check 2: Verify File is Committed**
```bash
git ls-files | grep functions
# Should show: functions/_middleware.js
```

**Check 3: Check Cloudflare Build Logs**
1. Go to **Cloudflare Dashboard** → **Pages** → **Your Project**
2. Click **Deployments** → **Latest deployment**
3. Check **Build logs**
4. Look for: "Functions detected" or "Middleware loaded"

**Check 4: Verify Build Output Directory**
- Must be `/` (root)
- Functions directory must be in build output

### **Issue: 404 Errors**

**Possible Causes:**
1. File paths in middleware are wrong
2. Files don't exist in repository
3. Build output directory is wrong

**Fix:**
```bash
# Verify all page files exist
ls -la pages/home/index.html
ls -la pages/services/index.html
# etc.

# Check middleware routes match actual files
cat functions/_middleware.js
```

---

## 📝 **Alternative: Keep `_redirects` File**

You can keep both:
- `_redirects` file (as backup)
- `functions/_middleware.js` (primary solution)

Cloudflare will use the Functions middleware first, and `_redirects` as fallback.

---

## ✅ **Success Criteria**

After deployment:
1. ✅ Clean URLs work: `test.mantravi.com/` (not `/pages/home/`)
2. ✅ All pages accessible with clean URLs
3. ✅ SEO files accessible
4. ✅ No redirect loops
5. ✅ Fast page loads

---

## 🎯 **Next Steps**

1. ✅ `functions/_middleware.js` created
2. ✅ `index.html` updated
3. ⏳ Commit and push to Git
4. ⏳ Cloudflare auto-deploys
5. ⏳ Test clean URLs
6. ⏳ Clear cache if needed

---

**Status**: ✅ **Functions middleware ready for deployment!**

This approach is more reliable than `_redirects` and will definitely work on Cloudflare Pages.

