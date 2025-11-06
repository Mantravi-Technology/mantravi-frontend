# Blog Main Image Guidelines

## Recommended Image Resolution

For optimal display across all devices, use the following specifications:

### Primary Recommendation (Best Balance)
- **Resolution**: `1200px × 630px` (1.9:1 aspect ratio)
- **Format**: WebP (preferred) or JPG/JPEG
- **File Size**: < 300KB (optimized)
- **Aspect Ratio**: 1.9:1 (19:10)

### Why This Resolution?
- ✅ Perfect for **social media sharing** (Open Graph, Twitter Cards)
- ✅ Works great on **desktop** (1200px width is standard for blog content)
- ✅ Responsive on **tablets** (scales down smoothly)
- ✅ Looks good on **mobile** (maintains quality when scaled)
- ✅ Matches industry standards (Medium, WordPress, LinkedIn)

### Alternative Sizes (If Needed)

#### For Hero/Banner Style Images:
- **Resolution**: `1920px × 1080px` (16:9 aspect ratio)
- **Use Case**: Full-width hero images
- **Note**: Will be scaled down, but maintains quality on large screens

#### For Square/Square-ish Images:
- **Resolution**: `1200px × 1200px` (1:1 aspect ratio)
- **Use Case**: Product images, infographics
- **Note**: Less ideal for blog hero images

#### For Tall Images (Portrait):
- **Resolution**: `800px × 1200px` (2:3 aspect ratio)
- **Use Case**: Avoid for main blog images (not optimal)

### Technical Requirements

#### File Formats (Priority Order):
1. **WebP** - Best compression, modern browsers
2. **JPG/JPEG** - Universal support, good compression
3. **PNG** - Only if transparency needed (larger file size)

#### Optimization:
- **Compress images** before uploading (use tools like TinyPNG, Squoosh, or ImageOptim)
- **Target file size**: 150-300KB for blog hero images
- **Quality**: 80-85% for JPG, 80-90% for WebP

#### Backend Implementation:
```javascript
// Example: When saving blog post with image
{
  "mainImagePath": "/uploads/blog/2025/01/image-name-1200x630.webp",
  // OR absolute URL
  "mainImagePath": "https://cdn.yoursite.com/blog/image-name-1200x630.webp"
}
```

### Responsive Behavior

The frontend will automatically:
- Scale images down on smaller screens
- Maintain aspect ratio (using `object-fit: contain`)
- Use `max-height: 600px` on desktop for hero images
- Apply lazy loading for better performance

### Social Media Optimization

The recommended **1200×630** size is perfect for:
- **Open Graph** images (Facebook, LinkedIn)
- **Twitter Cards** (large image cards)
- **WhatsApp link previews**
- **Slack/Discord link previews**

### Checklist for Backend Team

- [ ] Images should be at least **1200px wide**
- [ ] Aspect ratio: **1.9:1** (preferred) or **16:9** (acceptable)
- [ ] Format: **WebP** or **JPG**
- [ ] File size: **< 300KB** (optimized)
- [ ] Images should be **optimized/compressed** before upload
- [ ] Path can be **relative** (`/uploads/blog/...`) or **absolute** (`https://...`)
- [ ] Images should be **accessible** (no authentication required for public blogs)

### Example Image Dimensions

```
Desktop (1200px+):  1200×630  ✅ Perfect
Tablet (768-1024px): Scales down smoothly ✅
Mobile (320-767px):  Scales down smoothly ✅

Social Sharing:      1200×630  ✅ Perfect for OG tags
```

---

**Summary**: Use **1200px × 630px** (WebP or JPG, < 300KB) for the best cross-device and social media experience.




