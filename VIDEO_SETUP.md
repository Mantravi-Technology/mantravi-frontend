# Video Background Setup Guide

## 🎥 How to Add Your Own Video Background

### **Step 1: Prepare Your Video**
- **Format**: MP4 (H.264 codec recommended)
- **Resolution**: 1920x1080 (Full HD) or higher
- **Duration**: 10-30 seconds (will loop automatically)
- **File Size**: Keep under 10MB for fast loading
- **Content**: Abstract, tech-related, or subtle animations work best

### **Step 2: Add Your Video File**
1. Create a `videos` folder in your project:
   ```bash
   mkdir mantravii-website/assets/videos
   ```

2. Place your video file in the folder:
   ```
   mantravii-website/
   └── assets/
       └── videos/
           └── hero-background.mp4
   ```

### **Step 3: Update the Video Source**
In `/pages/home/index.html`, replace the current video source:

```html
<video 
    class="w-full h-full object-cover" 
    autoplay 
    muted 
    loop 
    playsinline
    poster="path/to/your/poster-image.jpg"
>
    <source src="../../assets/videos/hero-background.mp4" type="video/mp4">
    <!-- Fallback for browsers that don't support video -->
    Your browser does not support the video tag.
</video>
```

### **Step 4: Video Content Suggestions**

**Best Video Types for Tech Companies:**
- Abstract geometric animations
- Subtle particle effects
- Technology/network visualizations
- Minimalist motion graphics
- Data visualization animations

**Avoid:**
- Fast-moving content (distracts from text)
- Bright colors (conflicts with text readability)
- People or faces (can be distracting)
- Text or logos in the video

### **Step 5: Performance Optimization**

**Video Optimization:**
```bash
# Compress video using FFmpeg
ffmpeg -i input.mp4 -vcodec h264 -acodec aac -crf 23 -preset fast output.mp4
```

**Alternative: Use Online Video Services**
- Upload to YouTube/Vimeo (unlisted)
- Use their embed URLs
- Better for large files

### **Step 6: Fallback Options**

If video doesn't load, the site will show:
1. **Poster Image**: Static image while video loads
2. **Gradient Background**: CSS fallback
3. **Pattern Background**: Original hero pattern

### **Step 7: Mobile Considerations**

- Videos are muted by default (required for autoplay)
- `playsinline` attribute ensures mobile compatibility
- Consider using a shorter, lighter video for mobile

## 🎨 **Current Implementation Features**

✅ **Autoplay**: Starts automatically  
✅ **Muted**: Required for autoplay in browsers  
✅ **Loop**: Repeats continuously  
✅ **Responsive**: Scales to all screen sizes  
✅ **Overlay**: Dark overlay for text readability  
✅ **Fallback**: Graceful degradation if video fails  
✅ **Performance**: Optimized loading and playback  

## 📱 **Testing Your Video**

1. **Desktop**: Should autoplay immediately
2. **Mobile**: May require user interaction on some devices
3. **Slow Connection**: Should show poster image while loading
4. **No Video Support**: Falls back to gradient background

## 🔧 **Troubleshooting**

**Video Not Playing?**
- Check file path is correct
- Ensure video is MP4 format
- Check file size (keep under 10MB)
- Verify video is not corrupted

**Performance Issues?**
- Compress video further
- Use lower resolution
- Consider using a background image instead

**Mobile Issues?**
- Some browsers block autoplay
- Video will show poster image as fallback
- This is normal behavior
