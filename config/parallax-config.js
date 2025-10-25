// ========== GLOBAL PARALLAX CONFIGURATION ==========
// This file contains all parallax settings for the entire website
// Modify these values to change parallax behavior globally

const PARALLAX_CONFIG = {
    // Performance settings
    throttleDelay: 5, // 60fps - Lower = smoother but more CPU intensive
    useRequestAnimationFrame: true,
    enableMobileOptimization: true,
    
    // Parallax speeds for different elements
    // Only where it improves UX - not just for effects
    speeds: {
        'parallax-bg': 0.1,         // Background elements - creates depth
        'parallax-hero': 0.08,      // Hero section - draws attention
        'parallax-services': 0.05,  // Services section - guides eye flow
        'parallax-text': 0.02       // Text elements - very subtle
    },
    
    // Responsive breakpoints
    breakpoints: {
        mobile: 768,    // Below this width = mobile
        tablet: 1024,   // Tablet range
        desktop: 1200   // Desktop range
    },
    
    // Mobile optimization settings
    mobile: {
        enabled: true,              // Enable mobile optimization
        reducedMotion: true,        // Respect user's motion preferences
        speedMultiplier: 0.2       // Significantly reduce parallax intensity on mobile
    },
    
    // Debug and development
    debug: false,                  // Set to true for debugging info
    
    // Performance optimizations
    performance: {
        skipHiddenElements: true,   // Don't animate hidden elements
        useIntersectionObserver: true, // Use modern intersection observer
        enableHardwareAcceleration: true // Use GPU acceleration
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PARALLAX_CONFIG;
}

// Make globally available
window.PARALLAX_CONFIG = PARALLAX_CONFIG;
