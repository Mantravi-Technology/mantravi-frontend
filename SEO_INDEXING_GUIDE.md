# SEO & Google Indexing Enhancement Guide

## 🚀 Quick Actions for Faster Google Indexing

### 1. **Submit to Google Search Console**
1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add property: `https://mantravi.com` (and `https://www.mantravi.com` if you use www)
3. Verify ownership via:
   - HTML file upload
   - HTML tag in `<head>`
   - DNS record
   - Google Analytics

### 2. **Submit Sitemap**
After verification:
1. Go to **Sitemaps** in Search Console
2. Submit: `https://mantravi.com/sitemap.xml`
3. Check for errors and fix them

### 3. **Request Indexing**
For each important page:
1. Use **URL Inspection** tool
2. Enter URL: `https://mantravi.com/`
3. Click **Request Indexing**
4. Repeat for: `/services`, `/about`, `/contact`, `/blog`, `/work-with-us`

### 4. **Monitor Indexing Status**
- Go to **Coverage** report in Search Console
- Check for:
  - **Indexed** pages
  - **Errors** (404s, redirects, etc.)
  - **Warnings** (mobile usability, etc.)

---

## ✅ SEO Enhancements Completed

### **Sitemap Improvements**
- ✅ Updated `sitemap.xml` with current date (2025-11-15)
- ✅ Added image captions to sitemap
- ✅ Sitemap includes all static pages
- ✅ Blog posts are dynamically added via `scripts/update-sitemap.js`
- ✅ Sitemap link added to all HTML pages

### **Robots.txt Enhancements**
- ✅ Multiple sitemap declarations (with and without www)
- ✅ Explicit Allow rules for all important pages
- ✅ Proper disallow rules for admin/private areas
- ✅ Special rules for Googlebot (crawl-delay: 0)
- ✅ Image bot allowances

### **Meta Tags & Canonical URLs - ENHANCED**
- ✅ All pages have `robots` meta tag: `index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1`
- ✅ All pages have canonical URLs
- ✅ All pages have Open Graph tags (complete set)
- ✅ All pages have Twitter Card tags (complete set)
- ✅ Sitemap link in HTML head on all pages
- ✅ **Google Search Console verification meta tag placeholder** added (ready for verification code)
- ✅ **Additional SEO meta tags**: rating, distribution, coverage, target, audience, apple-mobile-web-app
- ✅ **Geo-location tags**: geo.region, geo.placename for India
- ✅ **Language tags**: language meta tag on all pages

### **Structured Data (JSON-LD) - COMPREHENSIVE**
- ✅ **Organization schema** on homepage with complete business info
- ✅ **WebSite schema** with SearchAction for site search
- ✅ **Service schema** with detailed offerings catalog
- ✅ **ItemList schema** for site navigation
- ✅ **FAQPage schema** with all 12 FAQ questions and answers (homepage)
- ✅ **BreadcrumbList schema** on ALL pages (Home, Services, About, Blog, Contact, Work-With-Us)
- ✅ **Blog schema** on blog listing page
- ✅ **ContactPage schema** on contact page
- ✅ **AboutPage schema** on about page
- ✅ **JobPosting schema** on work-with-us page
- ✅ **WebPage schema** on services page
- ✅ Dynamic structured data for blog posts (Article schema)

---

## 🔧 Additional Recommendations

### **Immediate Actions:**

1. **Run Sitemap Update Script**
   ```bash
   npm run update-sitemap
   ```
   This fetches all blog posts and adds them to sitemap.

2. **Check Sitemap Accessibility**
   - Visit: `https://mantravi.com/sitemap.xml`
   - Verify it loads and is valid XML
   - Check robots.txt: `https://mantravi.com/robots.txt`

3. **Verify Page Accessibility**
   - Ensure all pages return **200 OK** status
   - Check for broken links
   - Verify mobile responsiveness

4. **Content Quality**
   - Ensure each page has **unique, valuable content**
   - Minimum 300 words per page
   - Use proper heading hierarchy (H1, H2, H3)
   - Add internal links between pages

### **Advanced SEO:**

1. **Create XML Sitemap Index** (if >50k URLs)
   - Split sitemap into multiple files
   - Create sitemap index file

2. **Add Breadcrumb Schema**
   ```json
   {
     "@type": "BreadcrumbList",
     "itemListElement": [...]
   }
   ```

3. **Add FAQ Schema** (for FAQ pages)
   ```json
   {
     "@type": "FAQPage",
     "mainEntity": [...]
   }
   ```

4. **Add Review/Rating Schema** (if applicable)

5. **Implement hreflang** (if multilingual)

---

## 📊 Monitoring & Maintenance

### **Weekly Checks:**
- [ ] Google Search Console for indexing status
- [ ] Sitemap submission status
- [ ] Coverage report for errors

### **Monthly Checks:**
- [ ] Run sitemap update script
- [ ] Review and fix any indexing errors
- [ ] Check page rankings and impressions

### **Automated:**
- [ ] Set up GitHub Actions to auto-update sitemap daily
- [ ] Monitor sitemap via Google Search Console API

---

## 🐛 Common Indexing Issues & Fixes

### **Issue: "Discovered - currently not indexed"**
**Cause:** Low priority or content quality issues
**Fix:**
- Request indexing manually
- Improve page content quality
- Add more internal links

### **Issue: "Crawl Error"**
**Cause:** Server errors or blocked by robots.txt
**Fix:**
- Check server logs
- Verify robots.txt allows the page
- Check for 404s or redirects

### **Issue: "Duplicate content"**
**Cause:** Multiple URLs for same content
**Fix:**
- Use canonical URLs (✅ Already done)
- Redirect duplicates to canonical
- Consolidate similar pages

### **Issue: "Mobile usability"**
**Cause:** Not mobile-friendly
**Fix:**
- Use responsive design (✅ Already done)
- Test with Mobile-Friendly Test tool
- Fix viewport meta tags (✅ Already done)

---

## 📝 Next Steps

1. **Submit sitemap to Google Search Console** ← **DO THIS FIRST**
2. **Request indexing for homepage** ← **DO THIS SECOND**
3. **Run sitemap update script** to include blog posts
4. **Monitor indexing progress** in Search Console
5. **Fix any errors** reported by Google

---

## 🔗 Useful Resources

- [Google Search Console](https://search.google.com/search-console)
- [Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)
- [Rich Results Test](https://search.google.com/test/rich-results)
- [PageSpeed Insights](https://pagespeed.web.dev/)
- [Sitemap Validator](https://www.xml-sitemaps.com/validate-xml-sitemap.html)

---

## 📧 Support

If pages still aren't indexing after following this guide:
1. Check Google Search Console for specific errors
2. Verify server is responding correctly
3. Ensure no password protection on pages
4. Check for any security headers blocking crawlers
5. Verify DNS and SSL certificate are valid

**Expected Timeline:** 
- Initial indexing: 1-7 days after submission
- Full site indexing: 2-4 weeks
- Regular updates: As you publish new content

