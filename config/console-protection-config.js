/**
 * Console Protection Configuration
 * Configure console blocking behavior here
 */

const CONSOLE_PROTECTION_CONFIG = {
    // Enable/Disable console protection
    // Set to false to allow console access (useful for development)
    ENABLED: true,
    
    // Show warning message when console is accessed
    // Set to false for better performance (uses no-op functions)
    SHOW_WARNING: false,
    
    // Allow console.error for critical error logging
    // Set to true if you want to see errors in console (for debugging)
    ALLOW_ERROR_LOGGING: false,
    
    // Block DevTools keyboard shortcuts
    // Minimal performance impact - only runs on keydown events
    BLOCK_KEYBOARD_SHORTCUTS: true,
    
    // Block right-click context menu (can be annoying for users)
    BLOCK_RIGHT_CLICK: false,
    
    // Detect DevTools opening - DISABLED by default for performance
    // This uses setInterval which can impact performance
    // Set to true only if you really need DevTools detection
    DETECT_DEVTOOLS: false
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONSOLE_PROTECTION_CONFIG;
}

// Make globally available
window.CONSOLE_PROTECTION_CONFIG = CONSOLE_PROTECTION_CONFIG;

