// Google Analytics Configuration
// Replace 'G-XXXXXXXXXX' with your actual Google Analytics Measurement ID
// You can find this in your Google Analytics account under Admin > Data Streams

const ANALYTICS_CONFIG = {
    // Google Analytics 4 (GA4) Measurement ID
    // Format: G-XXXXXXXXXX
    GA_MEASUREMENT_ID: 'G-5F8EJP5WXD',
    
    // Enable/Disable Google Analytics
    // Set to false to disable tracking (useful for development)
    ENABLED: true
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ANALYTICS_CONFIG;
}

