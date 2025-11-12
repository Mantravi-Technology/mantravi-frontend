# 🔧 Sitemap.xml Troubleshooting Guide

## ✅ **Updated `_redirects` File**

The `_redirects` file has been updated with:
- ✅ Clear comments explaining rule order
- ✅ SEO files placed before catch-all rule
- ✅ Proper ordering to ensure sitemap.xml is served

---

## 🧪 **How to Test**

### **1. Test Locally (Before Deploying)**

```bash
# Start local server
npm start

# Then visit in browser:
http://localhost:5503/sitemap.xml
```

**Expected Result**: You should see the XML content (not HTML)

---

### **2. Test After Deploying to Cloudflare**

1. **Deploy to Cloudflare Pages**
   - Push your changes to Git
   - Cloudflare will auto-deploy

2. **Test the URL**
   - Visit: `https://mantravi.com/sitemap.xml`
   - Should show XML content

3. **Check Browser DevTools**
   - Open DevTools (F12)
   - Go to Network tab
   - Reload the page
   - Click on `sitemap.xml` request
   - Check Response Headers:
     - Should have: `Content-Type: application/xml` or `text/xml`
     - Status should be: `200 OK`

---

## 🐛 **If Still Not Working**

### **Issue 1: File Not Found (404)**

**Symptoms**: Browser shows 404 or redirects to homepage

**Solutions**:
1. ✅ Verify `sitemap.xml` is in root directory
2. ✅ Check it's committed to Git
3. ✅ Verify Cloudflare Pages deployment includes the file
4. ✅ Check Cloudflare Pages build logs

### **Issue 2: Wrong Content Type**

**Symptoms**: Browser downloads file or shows as text

**Solutions**:
- This is actually OK! XML files can be downloaded
- Search engines will still read it correctly
- You can verify by opening the downloaded file

### **Issue 3: Cached Redirect**

**Symptoms**: Old redirect still active

**Solutions**:
1. Clear Cloudflare cache:
   - Cloudflare Dashboard → Caching → Purge Everything
2. Hard refresh browser:
   - Ctrl+Shift+R (Windows/Linux)
   - Cmd+Shift+R (Mac)

### **Issue 4: Catch-All Rule Interfering**

**Symptoms**: sitemap.xml shows homepage content

**Solutions**:
- ✅ Already fixed! The `_redirects` file now has sitemap.xml rule BEFORE catch-all
- If still not working, check Cloudflare Pages deployment logs

---

## ✅ **Verification Checklist**

After deploying, verify:

- [ ] `sitemap.xml` file exists in root directory
- [ ] File is committed to Git
- [ ] Cloudflare Pages deployment successful
- [ ] `https://mantravi.com/sitemap.xml` shows XML (not HTML)
- [ ] `https://mantravi.com/robots.txt` shows text (not HTML)
- [ ] Google Search Console can fetch the sitemap

---

## 🔍 **Manual Verification**

### **Test in Browser**

1. Visit: `https://mantravi.com/sitemap.xml`
2. **Expected**: XML content like:
   ```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="...">
       <url>
           <loc>https://mantravi.com/</loc>
           ...
       </url>
   </urlset>
   ```

3. **If you see HTML instead**: The redirect isn't working
   - Check `_redirects` file order
   - Verify file is in root directory
   - Clear Cloudflare cache

### **Test with cURL**

```bash
curl -I https://mantravi.com/sitemap.xml
```

**Expected Response**:
```
HTTP/2 200
content-type: application/xml
```

---

## 📝 **Current `_redirects` Configuration**

```text
# SEO Files - MUST come before catch-all rule
/robots.txt /robots.txt 200
/sitemap.xml /sitemap.xml 200

# Catch all - MUST be last
/* /pages/home/index.html 200
```

**Key Point**: The sitemap.xml rule comes **BEFORE** the catch-all rule `/*`, so it will be matched first.

---

## 🚀 **Next Steps**

1. ✅ `_redirects` file updated
2. ⏳ Deploy to Cloudflare Pages
3. ⏳ Test `https://mantravi.com/sitemap.xml`
4. ⏳ Submit to Google Search Console

---

## 💡 **Pro Tip**

If you're still having issues after deployment:

1. **Check Cloudflare Pages Build Logs**
   - Go to Cloudflare Dashboard
   - Pages → Your Project → Deployments
   - Check if `sitemap.xml` is included in build

2. **Verify File in Repository**
   ```bash
   git ls-files | grep sitemap.xml
   ```
   Should show: `sitemap.xml`

3. **Test Direct File Access**
   - Try: `https://your-cloudflare-pages-url.pages.dev/sitemap.xml`
   - If this works, the issue is with custom domain routing

---

**Status**: ✅ `_redirects` file updated and ready for deployment!

