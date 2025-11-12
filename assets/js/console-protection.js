/**
 * Console Protection Script
 * Prevents console access and spam in production
 * Can be enabled/disabled via config
 */

(function() {
    'use strict';
    
    // Load configuration from config file or use defaults
    const config = window.CONSOLE_PROTECTION_CONFIG || {
        ENABLED: true,
        SHOW_WARNING: true,
        ALLOW_ERROR_LOGGING: false,
        BLOCK_KEYBOARD_SHORTCUTS: true,
        BLOCK_RIGHT_CLICK: false,
        DETECT_DEVTOOLS: true
    };
    
    // Configuration
    const CONSOLE_PROTECTION_ENABLED = config.ENABLED;
    const SHOW_WARNING = config.SHOW_WARNING;
    const ALLOW_ERROR_LOGGING = config.ALLOW_ERROR_LOGGING;
    const BLOCK_KEYBOARD_SHORTCUTS = config.BLOCK_KEYBOARD_SHORTCUTS;
    const BLOCK_RIGHT_CLICK = config.BLOCK_RIGHT_CLICK;
    const DETECT_DEVTOOLS = config.DETECT_DEVTOOLS;
    
    // Don't run if protection is disabled
    if (!CONSOLE_PROTECTION_ENABLED) {
        return;
    }
    
    // Store original console methods (for potential restoration)
    const originalConsole = {
        log: console.log,
        warn: console.warn,
        error: console.error,
        info: console.info,
        debug: console.debug,
        trace: console.trace,
        dir: console.dir,
        dirxml: console.dirxml,
        group: console.group,
        groupEnd: console.groupEnd,
        time: console.time,
        timeEnd: console.timeEnd,
        count: console.count,
        clear: console.clear,
        table: console.table,
        assert: console.assert
    };
    
    // Warning message
    const warningMessage = '%c⚠️ Console access is restricted on this website.';
    const warningStyle = 'color: #ff6b6b; font-size: 14px; font-weight: bold;';
    
    // Create optimized no-op function (zero performance cost)
    const noop = function() {};
    
    // Create warning function (only if warnings enabled)
    const warnFunction = SHOW_WARNING ? function() {
        originalConsole.warn(warningMessage, warningStyle);
    } : noop;
    
    // Override console methods - use noop for best performance
    if (ALLOW_ERROR_LOGGING) {
        // Keep console.error for critical errors
        console.error = SHOW_WARNING ? function() {
            if (arguments.length > 0) {
                originalConsole.warn(warningMessage, warningStyle);
            }
        } : noop;
    } else {
        // Block all console methods including error - use noop for zero cost
        console.error = warnFunction;
    }
    
    // Block all other console methods - use noop when warnings disabled
    console.log = warnFunction;
    console.warn = warnFunction;
    console.info = warnFunction;
    console.debug = warnFunction;
    console.trace = warnFunction;
    console.dir = warnFunction;
    console.dirxml = warnFunction;
    console.group = warnFunction;
    console.groupEnd = warnFunction;
    console.time = warnFunction;
    console.timeEnd = warnFunction;
    console.count = warnFunction;
    console.clear = warnFunction;
    console.table = warnFunction;
    console.assert = warnFunction;
    
    // Prevent console object from being redefined
    try {
        Object.defineProperty(window, 'console', {
            value: console,
            writable: false,
            configurable: false
        });
    } catch (e) {
        // Some browsers may not allow this
    }
    
    // Additional protection: Detect DevTools opening
    // DISABLED by default - has performance impact (runs setInterval)
    // Only enable if you really need DevTools detection
    if (DETECT_DEVTOOLS) {
        let devtools = {
            open: false,
            orientation: null
        };
        
        const threshold = 160;
        
        // Use requestAnimationFrame for better performance (runs at ~60fps when tab is active)
        let lastCheck = 0;
        const checkInterval = 1000; // Check every 1 second instead of 500ms
        
        function checkDevTools() {
            const now = Date.now();
            if (now - lastCheck < checkInterval) {
                requestAnimationFrame(checkDevTools);
                return;
            }
            lastCheck = now;
            
            if (window.outerHeight - window.innerHeight > threshold || 
                window.outerWidth - window.innerWidth > threshold) {
                if (!devtools.open) {
                    devtools.open = true;
                }
            } else {
                if (devtools.open) {
                    devtools.open = false;
                }
            }
            
            requestAnimationFrame(checkDevTools);
        }
        
        // Only start checking if tab is visible (saves CPU when tab is hidden)
        if (document.visibilityState === 'visible') {
            requestAnimationFrame(checkDevTools);
        }
        
        document.addEventListener('visibilitychange', function() {
            if (document.visibilityState === 'visible' && !devtools.open) {
                requestAnimationFrame(checkDevTools);
            }
        });
    }
    
    // Prevent right-click context menu (optional - can be annoying for users)
    if (BLOCK_RIGHT_CLICK) {
        document.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            return false;
        });
    }
    
    // Prevent F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
    // Optimized: Only checks specific key codes for minimal overhead
    if (BLOCK_KEYBOARD_SHORTCUTS) {
        document.addEventListener('keydown', function(e) {
            // Early exit for non-relevant keys (performance optimization)
            const keyCode = e.keyCode;
            if (keyCode !== 123 && keyCode !== 73 && keyCode !== 74 && keyCode !== 67) {
                return; // Not a blocked key, exit early
            }
            
            // F12
            if (keyCode === 123) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
            
            // Only check modifier keys if needed
            if (!e.ctrlKey || !e.shiftKey) {
                return;
            }
            
            // Ctrl+Shift+I (DevTools)
            if (keyCode === 73) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
            // Ctrl+Shift+J (Console)
            if (keyCode === 74) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
            // Ctrl+Shift+C (Inspect Element)
            if (keyCode === 67) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        }, { passive: false }); // passive: false allows preventDefault
    }
    
    // Clear console on page load (only once, minimal cost)
    if (originalConsole.clear && typeof originalConsole.clear === 'function') {
        try {
            originalConsole.clear();
        } catch (e) {
            // Ignore errors
        }
    }
})();

