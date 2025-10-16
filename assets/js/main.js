// Mantravi Website - Main JavaScript

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Main initialization function
function initializeApp() {
    initializeLucideIcons();
    initializeMobileMenu();
    initializeCleanSmoothScrolling(); // Clean, single smooth scrolling system
    initializeParallaxEffects();
    initializeAnimations();
    initializeForms();
    initializeNavigation();
    initializeConsultForm(); // Initialize consult modal
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

// Legacy smooth scrolling - DISABLED to prevent conflicts with unified system
// function initializeSmoothScrolling() {
//     // This function is disabled to prevent conflicts with unified smooth scrolling
// }

// Parallax Scrolling Effects
function initializeParallaxEffects() {
    let ticking = false;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.parallax-bg, .parallax-services');
        
        parallaxElements.forEach(element => {
            const speed = element.classList.contains('parallax-bg') ? 0.5 : 0.75;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }
    
    function handleScroll() {
        requestTick();
        ticking = false;
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('load', updateParallax);
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

// Form Handling
function initializeForms() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', handleFormSubmit);
    });
}

function handleFormSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    
    // Add loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
    }
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        showNotification('Thank you for your message! We\'ll get back to you soon.', 'success');
        form.reset();
        
        if (submitBtn) {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    }, 2000);
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

// Performance Optimization
function optimizeImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Error Handling
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    // You can add error reporting here
});

// Service Worker Registration (for PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// ========== CLEAN SMOOTH SCROLLING SYSTEM ==========

// Simple, clean smooth scrolling - NO CONFLICTS
function initializeCleanSmoothScrolling() {
    console.log('🎯 Clean Smooth Scrolling Initialized');
    
    // Add scroll progress bar
    addScrollProgressBar();
    
    // Handle all anchor links
    handleAnchorLinks();
    
    // Add keyboard navigation
    addKeyboardNavigation();
    
    console.log('✅ Clean smooth scrolling active - no conflicts');
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
    document.querySelectorAll('a[href^="#"]').forEach(link => {
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

// Test scroll speed function - Updated for clean system
function testScrollSpeed() {
    const servicesSection = document.querySelector('#services');
    if (servicesSection) {
        console.log('🐌 Testing clean smooth scroll...');
        smoothScrollToElement(servicesSection);
    } else {
        console.log('❌ Services section not found');
    }
}

// ========== CONSULT MODAL FUNCTIONS ==========

// Open consult modal
function openConsultModal() {
    console.log('🔍 openConsultModal called');
    const modal = document.getElementById('consultModal');
    console.log('🔍 Modal element:', modal);
    if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
        console.log('✅ Modal opened successfully');
    } else {
        console.log('❌ Modal not found - contact form not loaded');
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

// Handle form submission
function handleConsultForm(event) {
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
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
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
            
            // Auto-close after 4 seconds
            setTimeout(() => {
                closeConsultModal();
            }, 4000);
        }
        
        // Reset button
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }, 1500); // Simulate API delay
}

// Initialize consult form
function initializeConsultForm() {
    const form = document.getElementById('consultForm');
    if (form) {
        form.addEventListener('submit', handleConsultForm);
    }
}

// Make functions globally available
window.testScrollSpeed = testScrollSpeed;
window.smoothScrollToElement = smoothScrollToElement;
window.openConsultModal = openConsultModal;
window.closeConsultModal = closeConsultModal;

// Export functions for use in other modules
window.MantraviApp = {
    showNotification,
    debounce,
    throttle,
    optimizeImages,
    smoothScrollToElement, // Clean smooth scroll function
    testScrollSpeed // Test function
};
