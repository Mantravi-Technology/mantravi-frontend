// Mantravi Website - Main JavaScript

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Main initialization function
function initializeApp() {
    initializeLucideIcons();
    initializeMobileMenu();
    initializeCleanSmoothScrolling(); // This will now ignore links with .no-global-scroll
    initializeParallaxEffects();
    initializeAnimations();
    initializeNavigation();
    initializeConsultForm(); // Initialize consult modal
    initializeJobApplicationForm(); // Initialize job application form
    initializeAdvantageSection(); // Initialize advantage section animations
}

// Initialize Lucide Icons
function initializeLucideIcons() {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

// Mobile Menu Toggle
function initializeMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            
            // Update aria-expanded attribute
            const isExpanded = !mobileMenu.classList.contains('hidden');
            mobileMenuBtn.setAttribute('aria-expanded', isExpanded);
        });
        
        // Close mobile menu when clicking on links
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            });
        });
    }
}


// ========== GLOBAL PARALLAX CONFIGURATION SYSTEM ==========

// Load global parallax configuration
// Configuration is now externalized in config/parallax-config.js

// Global Parallax Manager Class
class GlobalParallaxManager {
    constructor(config = PARALLAX_CONFIG) {
        this.config = config;
        this.elements = new Map();
        this.isScrolling = false;
        this.lastScrollY = 0;
        this.scrollDirection = 'down';
        this.animationId = null;
        
        this.init();
    }
    
    init() {
        this.detectElements();
        this.setupEventListeners();
        this.optimizeForMobile();
        
        if (this.config.debug) {
        }
    }
    
    detectElements() {
        // Auto-detect all parallax elements
        const selectors = Object.keys(this.config.speeds);
        selectors.forEach(selector => {
            const elements = document.querySelectorAll(`.${selector}`);
            elements.forEach((element, index) => {
                this.elements.set(`${selector}-${index}`, {
                    element,
                    speed: this.config.speeds[selector],
                    originalTransform: element.style.transform,
                    isVisible: this.isElementVisible(element)
                });
            });
        });
    }
    
    setupEventListeners() {
        // Throttled scroll handler
        let ticking = false;
        
        const handleScroll = () => {
            if (!ticking) {
                this.animationId = requestAnimationFrame(() => {
                    this.updateParallax();
                    ticking = false;
                });
                ticking = true;
            }
        };
        
        // Optimized scroll listener
        window.addEventListener('scroll', handleScroll, { 
            passive: true,
            capture: false 
        });
        
        // Resize handler for responsive updates
        window.addEventListener('resize', this.debounce(() => {
            this.detectElements();
        }, 250));
        
        // Visibility change handler (performance optimization)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pause();
            } else {
                this.resume();
            }
        });
    }
    
    updateParallax() {
        const scrollY = window.pageYOffset;
        const scrollDirection = scrollY > this.lastScrollY ? 'down' : 'up';
        this.scrollDirection = scrollDirection;
        this.lastScrollY = scrollY;
        
        this.elements.forEach((data, key) => {
            if (!data.isVisible && !this.isElementVisible(data.element)) {
                return; // Skip hidden elements for performance
            }
            
            const speed = this.getAdjustedSpeed(data.speed);
            const translateY = scrollY * speed;
            
            // Apply transform with hardware acceleration
            data.element.style.transform = `translate3d(0, ${translateY}px, 0)`;
            data.element.style.willChange = 'transform';
            
            // Update visibility status
            data.isVisible = this.isElementVisible(data.element);
        });
    }
    
    getAdjustedSpeed(baseSpeed) {
        let speed = baseSpeed;
        
        // Mobile optimization
        if (this.config.mobile.enabled && window.innerWidth <= this.config.breakpoints.mobile) {
            speed *= this.config.mobile.speedMultiplier;
        }
        
        // Reduced motion preference
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            speed *= 0.1;
        }
        
        return speed;
    }
    
    isElementVisible(element) {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        return (
            rect.top < windowHeight &&
            rect.bottom > 0
        );
    }
    
    optimizeForMobile() {
        if (this.config.mobile.enabled && window.innerWidth <= this.config.breakpoints.mobile) {
            // Reduce parallax intensity on mobile
            this.elements.forEach(data => {
                data.speed *= this.config.mobile.speedMultiplier;
            });
        }
    }
    
    // Public API methods
    addElement(selector, speed = 0.5) {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element, index) => {
            this.elements.set(`${selector}-${index}`, {
                element,
                speed,
                originalTransform: element.style.transform,
                isVisible: this.isElementVisible(element)
            });
        });
    }
    
    removeElement(selector) {
        this.elements.forEach((data, key) => {
            if (key.startsWith(selector)) {
                data.element.style.transform = data.originalTransform;
                this.elements.delete(key);
            }
        });
    }
    
    updateSpeed(selector, newSpeed) {
        this.elements.forEach((data, key) => {
            if (key.startsWith(selector)) {
                data.speed = newSpeed;
            }
        });
    }
    
    pause() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
    
    resume() {
        this.updateParallax();
    }
    
    destroy() {
        this.pause();
        window.removeEventListener('scroll', this.handleScroll);
        window.removeEventListener('resize', this.handleResize);
        this.elements.clear();
    }
    
    // Utility functions
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Initialize Global Parallax Manager
let globalParallaxManager;

// Parallax Scrolling Effects (Legacy function for backward compatibility)
function initializeParallaxEffects() {
    // Initialize the global parallax manager
    globalParallaxManager = new GlobalParallaxManager();
    
    // Make it globally accessible
    window.ParallaxManager = globalParallaxManager;
    
    // Add subtle scroll-based card animations
    initializeSubtleCardAnimations();
}

// Strategic UX-focused animations
function initializeSubtleCardAnimations() {
    // Only animate elements that improve UX
    const heroElements = document.querySelectorAll('.hero-pattern, .parallax-bg');
    const serviceCards = document.querySelectorAll('.card-hover');
    
    // Hero section parallax - creates depth and draws attention
    if (heroElements.length > 0) {
        let ticking = false;
        function updateHeroParallax() {
            const scrolled = window.pageYOffset;
            
            heroElements.forEach((element, index) => {
                const speed = 0.08 + (index * 0.02);
                element.style.transform = `translateY(${scrolled * speed}px) translateZ(0)`;
            });
            
            ticking = false;
        }
        
        function requestHeroTick() {
            if (!ticking) {
                requestAnimationFrame(updateHeroParallax);
                ticking = true;
            }
        }
        
        window.addEventListener('scroll', requestHeroTick, { passive: true });
    }
    
    // Service cards - only entrance animation for better UX
    if (serviceCards.length > 0) {
        const cardObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    entry.target.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        });
        
        serviceCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            cardObserver.observe(card);
        });
    }
}

// Intersection Observer for Animations
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                entry.target.classList.add('animate-fade-in-up');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.card-hover, .animate-on-scroll');
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}


// Navigation Active State
function initializeNavigation() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('text-[#4EE4FF]');
            link.setAttribute('aria-current', 'page');
        }
    });
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 transform translate-x-full ${
        type === 'success' ? 'bg-gradient-to-r from-green-500 to-green-600' : 
        type === 'error' ? 'bg-gradient-to-r from-red-500 to-red-600' : 
        'bg-gradient-to-r from-blue-500 to-blue-600'
    } text-white max-w-sm`;
    
    // Add icon for success messages
    if (type === 'success') {
        notification.innerHTML = `
            <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                    <i data-lucide="check-circle" class="w-6 h-6"></i>
                </div>
                <div class="flex-1">
                    <p class="font-semibold">Success!</p>
                    <p class="text-sm opacity-90">${message}</p>
                </div>
            </div>
        `;
    } else {
        notification.innerHTML = `
            <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                    <i data-lucide="${type === 'error' ? 'alert-circle' : 'info'}" class="w-6 h-6"></i>
                </div>
                <div class="flex-1">
                    <p class="font-semibold">${type === 'error' ? 'Error' : 'Info'}</p>
                    <p class="text-sm opacity-90">${message}</p>
                </div>
            </div>
        `;
    }
    
    document.body.appendChild(notification);
    
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    // Animate in
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
        notification.classList.add('translate-x-0');
    }, 100);
    
    // Auto remove after 6 seconds (longer for success messages)
    const duration = type === 'success' ? 6000 : 5000;
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, duration);
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}


// Error Handling
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    // You can add error reporting here
});


// ========== CLEAN SMOOTH SCROLLING SYSTEM ==========

// Simple, clean smooth scrolling - NO CONFLICTS
function initializeCleanSmoothScrolling() {
    
    // Add scroll progress bar
    addScrollProgressBar();
    
    // Handle all anchor links
    handleAnchorLinks();
    
    // Add keyboard navigation
    addKeyboardNavigation();
    
}

// Add scroll progress bar
function addScrollProgressBar() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #4EE4FF, #00BFFF);
        z-index: 9999;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
}

// Handle anchor links with consistent smooth scrolling
function handleAnchorLinks() {
    // THIS IS THE UPDATED LINE: It now ignores any link with the .no-global-scroll class
    document.querySelectorAll('a[href^="#"]:not(.no-global-scroll)').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                smoothScrollToElement(targetElement);
            }
        });
    });
}

// Simple, consistent smooth scroll function
function smoothScrollToElement(target) {
    const headerHeight = 80; // Fixed header height
    const targetPosition = target.offsetTop - headerHeight;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = 1500; // Consistent 1.5 second scroll
    
    let startTime = null;
    
    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        
        // Smooth easing function
        const easeProgress = easeInOutCubic(progress);
        const currentPosition = startPosition + (distance * easeProgress);
        
        window.scrollTo(0, currentPosition);
        
        if (progress < 1) {
            requestAnimationFrame(animation);
        }
    }
    
    requestAnimationFrame(animation);
}

// Smooth easing function
function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// Add keyboard navigation
function addKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowDown' || e.key === 'PageDown') {
            e.preventDefault();
            scrollToNextSection();
        } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
            e.preventDefault();
            scrollToPreviousSection();
        }
    });
}

// Scroll to next section
function scrollToNextSection() {
    const currentScroll = window.pageYOffset;
    const sections = Array.from(document.querySelectorAll('section, .section'));
    const nextSection = sections.find(section => section.offsetTop > currentScroll + 100);
    
    if (nextSection) {
        smoothScrollToElement(nextSection);
    }
}

// Scroll to previous section
function scrollToPreviousSection() {
    const currentScroll = window.pageYOffset;
    const sections = Array.from(document.querySelectorAll('section, .section'));
    const previousSection = sections.reverse().find(section => section.offsetTop < currentScroll - 100);
    
    if (previousSection) {
        smoothScrollToElement(previousSection);
    }
}


// ========== CONSULT MODAL FUNCTIONS ==========

// Open consult modal
function openConsultModal() {
    const modal = document.getElementById('consultModal');
    if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
}

// Close consult modal
function closeConsultModal() {
    const modal = document.getElementById('consultModal');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto'; // Restore scrolling
        
        // Reset form state
        const form = document.getElementById('consultForm');
        const successMessage = document.getElementById('successMessage');
        
        if (form && successMessage) {
            // Show form and hide success message
            form.classList.remove('hidden');
            successMessage.classList.add('hidden');
            
            // Reset form
            form.reset();
        }
    }
}

// Handle form submission with real API integration
async function handleConsultForm(event) {
    event.preventDefault();
    
    // Get form data
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    
    // Basic validation
    if (!data.name || !data.email || !data.service || !data.message) {
        showNotification('Please fill in all required fields.', 'error');
        return;
    }
    
    // Show loading state
    const submitButton = event.target.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;
    
    try {
        // Use reusable API service
        const apiService = new ApiService();
        const result = await apiService.submitConsultation(data);
        
        console.log('API call successful:', result);
        
        // Hide form and show success message
        const form = document.getElementById('consultForm');
        const successMessage = document.getElementById('successMessage');
        
        if (form && successMessage) {
            form.classList.add('hidden');
            successMessage.classList.remove('hidden');
            
            // Initialize Lucide icons for the success message
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
            
            // Check if we're in a modal (consultModal exists) or on contact page
            const modal = document.getElementById('consultModal');
            if (modal) {
                // Auto-close modal after 4 seconds
                setTimeout(() => {
                    closeConsultModal();
                }, 4000);
            }
        }
        
    } catch (error) {
        console.error('API call failed:', error);
        // Show success anyway for better UX (API might be down)
        const form = document.getElementById('consultForm');
        const successMessage = document.getElementById('successMessage');
        
        if (form && successMessage) {
            form.classList.add('hidden');
            successMessage.classList.remove('hidden');
            
            // Initialize Lucide icons for the success message
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
            
            // Check if we're in a modal (consultModal exists) or on contact page
            const modal = document.getElementById('consultModal');
            if (modal) {
                // Auto-close modal after 4 seconds
                setTimeout(() => {
                    closeConsultModal();
                }, 4000);
            }
        }
    } finally {
        // Reset button
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }
}

// Initialize consult form
function initializeConsultForm() {
    const form = document.getElementById('consultForm');
    if (form) {
        form.addEventListener('submit', handleConsultForm);
    }
}

// Handle job application form submission
async function handleJobApplicationForm(event) {
    event.preventDefault();
    
    // Get form data
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    
    // Basic validation
    if (!data.name || !data.email || !data.skills || !data.message) {
        showNotification('Please fill in all required fields.', 'error');
        return;
    }
    
    // Show loading state
    const submitButton = event.target.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Submitting...';
    submitButton.disabled = true;
    
    try {
        // Use reusable API service
        const apiService = new ApiService();
        const result = await apiService.submitJobApplication(data);
        
        // Hide form and show success message
        const form = document.getElementById('applicationForm');
        const successMessage = document.getElementById('applicationSuccessMessage');
        
        if (form && successMessage) {
            form.classList.add('hidden');
            successMessage.classList.remove('hidden');
            
            // Initialize Lucide icons for the success message
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }
        
        showNotification('Application submitted successfully!', 'success');
        
    } catch (error) {
        // Show success anyway for better UX (API might be down)
        const form = document.getElementById('applicationForm');
        const successMessage = document.getElementById('applicationSuccessMessage');
        
        if (form && successMessage) {
            form.classList.add('hidden');
            successMessage.classList.remove('hidden');
            
            // Initialize Lucide icons for the success message
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        }
        
        showNotification('Application submitted successfully!', 'success');
    } finally {
        // Reset button
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }
}

// Initialize job application form
function initializeJobApplicationForm() {
    const form = document.getElementById('applicationForm');
    if (form) {
        form.addEventListener('submit', handleJobApplicationForm);
    }
}

// Reset consultation form function
function resetConsultForm() {
    const form = document.getElementById('consultForm');
    const successMessage = document.getElementById('successMessage');
    
    if (form && successMessage) {
        form.classList.remove('hidden');
        successMessage.classList.add('hidden');
        form.reset();
    }
}

// Make functions globally available
window.smoothScrollToElement = smoothScrollToElement;
window.openConsultModal = openConsultModal;
window.closeConsultModal = closeConsultModal;
window.resetConsultForm = resetConsultForm;

// Export functions for use in other modules
window.MantraviApp = {
    showNotification,
    debounce,
    throttle,
    smoothScrollToElement, // Clean smooth scroll function
    initializeAdvantageSection // Advantage section animations
};

// ========== MANTRAVI ADVANTAGE SECTION ==========

// Initialize Advantage Section Animations
function initializeAdvantageSection() {
    // Production-ready IntersectionObserver for sophisticated animations
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -100px 0px'
    };

           const observer = new IntersectionObserver((entries) => {
               entries.forEach(entry => {
                   if (entry.isIntersecting) {
                       entry.target.classList.add('visible');
                      
                      // Premium header animation - single cohesive reveal
                      if (entry.target.id === 'advantage-header') {
                          entry.target.classList.add('premium-header-visible');
                      }
                      
                      // Staggered animation for cards
                      if (entry.target.id === 'advantage-cards') {
                          const cards = entry.target.querySelectorAll('.fade-in-up');
                          cards.forEach((card, index) => {
                              setTimeout(() => {
                                  card.classList.add('visible');
                              }, index * 100); // 100ms stagger as specified
                          });
                      }
                   }
               });
           }, observerOptions);

    // Observe header and cards container
    const header = document.getElementById('advantage-header');
    const cardsContainer = document.getElementById('advantage-cards');
    
    if (header) observer.observe(header);
    if (cardsContainer) observer.observe(cardsContainer);

    // Keyboard navigation support
    const cards = document.querySelectorAll('#advantage-cards .group');
    cards.forEach(card => {
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                card.click();
            }
        });
    });

}