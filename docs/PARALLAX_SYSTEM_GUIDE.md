# 🎯 Global Parallax System Guide

## Overview
The Mantravi website now uses a **global parallax configuration system** that provides centralized control over all parallax effects across the entire website.

## 🚀 Key Benefits

- ✅ **Single Configuration** - Change parallax speeds globally
- ✅ **Performance Optimized** - Hardware acceleration, throttling, mobile optimization
- ✅ **Accessibility Compliant** - Respects user's motion preferences
- ✅ **Easy Maintenance** - One place to manage all parallax effects
- ✅ **Debug Mode** - Built-in debugging capabilities
- ✅ **Memory Efficient** - Proper cleanup and optimization

## 📁 File Structure

```
mantravi-frontend-1/
├── config/
│   └── parallax-config.js          # Global parallax configuration
├── assets/
│   ├── css/
│   │   └── main.css               # Global parallax styles
│   └── js/
│       └── main.js                # Global parallax manager
└── docs/
    └── PARALLAX_SYSTEM_GUIDE.md   # This guide
```

## ⚙️ Configuration

### Global Configuration (`config/parallax-config.js`)

```javascript
const PARALLAX_CONFIG = {
    // Performance settings
    throttleDelay: 16, // 60fps
    useRequestAnimationFrame: true,
    enableMobileOptimization: true,
    
    // Parallax speeds for different elements
    speeds: {
        'parallax-bg': 0.5,        // Background elements
        'parallax-services': 0.75, // Services section
        'parallax-hero': 0.3,      // Hero section
        'parallax-cards': 0.4,     // Card elements
        'parallax-text': 0.2,      // Text elements
        'parallax-images': 0.6    // Image elements
    },
    
    // Mobile optimization
    mobile: {
        enabled: true,
        reducedMotion: true,
        speedMultiplier: 0.5
    },
    
    // Debug mode
    debug: false
};
```

## 🎨 How to Use

### 1. Adding Parallax to Elements

Simply add the appropriate CSS class to any element:

```html
<!-- Background parallax -->
<div class="parallax-bg">Background content</div>

<!-- Services section parallax -->
<div class="parallax-services">Services content</div>

<!-- Hero section parallax -->
<div class="parallax-hero">Hero content</div>

<!-- Card parallax -->
<div class="parallax-cards">Card content</div>

<!-- Text parallax -->
<div class="parallax-text">Text content</div>

<!-- Image parallax -->
<div class="parallax-images">Image content</div>
```

### 2. Changing Parallax Speeds Globally

Edit `config/parallax-config.js`:

```javascript
speeds: {
    'parallax-bg': 0.3,        // Slower background
    'parallax-services': 1.0,  // Faster services
    'parallax-hero': 0.1,      // Very slow hero
    // ... other speeds
}
```

### 3. Adding New Parallax Types

1. **Add to config:**
```javascript
speeds: {
    'parallax-custom': 0.8,  // New parallax type
    // ... existing speeds
}
```

2. **Add CSS class:**
```css
.parallax-custom {
    transform: translate3d(0, 0, 0);
    will-change: transform;
}
```

3. **Use in HTML:**
```html
<div class="parallax-custom">Custom content</div>
```

## 🔧 Advanced Usage

### JavaScript API

The global parallax manager is accessible via `window.ParallaxManager`:

```javascript
// Add new elements dynamically
ParallaxManager.addElement('.my-parallax', 0.5);

// Remove elements
ParallaxManager.removeElement('.my-parallax');

// Update speed for specific elements
ParallaxManager.updateSpeed('parallax-bg', 0.3);

// Pause/resume parallax
ParallaxManager.pause();
ParallaxManager.resume();
```

### Debug Mode

Enable debug mode in `config/parallax-config.js`:

```javascript
debug: true
```

This will log:
- Number of parallax elements found
- Performance metrics
- Element visibility status

## 📱 Mobile Optimization

The system automatically:

- ✅ **Reduces parallax intensity** on mobile devices
- ✅ **Respects user preferences** for reduced motion
- ✅ **Disables parallax** on very small screens
- ✅ **Optimizes performance** for touch devices

## ♿ Accessibility

The system automatically:

- ✅ **Respects `prefers-reduced-motion`** user setting
- ✅ **Reduces motion** for users who prefer it
- ✅ **Maintains performance** on slower devices

## 🎯 Performance Features

- ✅ **Hardware Acceleration** - Uses GPU for smooth animations
- ✅ **Throttled Updates** - 60fps maximum to prevent jank
- ✅ **Visibility Detection** - Only animates visible elements
- ✅ **Memory Management** - Proper cleanup and optimization
- ✅ **Mobile Optimization** - Reduced intensity on mobile

## 🐛 Troubleshooting

### Parallax Not Working?

1. **Check CSS classes** - Ensure elements have correct `parallax-*` classes
2. **Check console** - Look for JavaScript errors
3. **Enable debug mode** - Set `debug: true` in config
4. **Check mobile** - Parallax is disabled on mobile by default

### Performance Issues?

1. **Reduce speeds** - Lower values in config
2. **Disable on mobile** - Set `mobile.enabled: false`
3. **Check element count** - Too many parallax elements can cause issues

### Custom Parallax Not Working?

1. **Add to config** - Add new speed to `speeds` object
2. **Add CSS class** - Create corresponding CSS class
3. **Check spelling** - Ensure class names match exactly

## 📊 Current Implementation

### Pages Using Parallax:

- ✅ **Home Page** - Hero background, services section
- ✅ **Services Page** - Background patterns
- ✅ **About Page** - Background elements
- ✅ **Contact Page** - Background elements
- ✅ **Blog Page** - Background elements
- ✅ **Work With Us Page** - Background elements

### Parallax Elements:

- ✅ **Background Elements** (`.parallax-bg`) - Speed: 0.5
- ✅ **Services Section** (`.parallax-services`) - Speed: 0.75
- ✅ **Hero Section** (`.parallax-hero`) - Speed: 0.3
- ✅ **Card Elements** (`.parallax-cards`) - Speed: 0.4
- ✅ **Text Elements** (`.parallax-text`) - Speed: 0.2
- ✅ **Image Elements** (`.parallax-images`) - Speed: 0.6

## 🚀 Future Enhancements

- **Scroll Direction Detection** - Different speeds for up/down scroll
- **Element Intersection** - Parallax only when elements are visible
- **Custom Easing** - Different animation curves
- **Performance Monitoring** - Real-time performance metrics

## 📞 Support

For issues or questions about the parallax system:

1. Check this documentation
2. Enable debug mode for troubleshooting
3. Check browser console for errors
4. Verify CSS classes are correct

---

**🎯 The global parallax system is now active and ready to use!**
