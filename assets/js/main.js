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
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-300 ${
        type === 'success' ? 'bg-green-600' : 
        type === 'error' ? 'bg-red-600' : 
        'bg-blue-600'
    } text-white`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
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

// Create contact form modal if it doesn't exist
function createContactFormModal() {
    // Check if modal already exists
    if (document.getElementById('consultModal')) {
        return;
    }
    
    console.log('🔧 Creating contact form modal...');
    
    const modalHTML = `
    <!-- Reusable Contact Form Component -->
    <div id="consultModal" class="fixed inset-0 bg-black bg-opacity-50 z-50 hidden flex items-center justify-center p-4">
        <div class="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <!-- Modal Header -->
            <div class="flex justify-between items-center p-4 border-b border-slate-600/30">
                <div class="flex items-center space-x-3">
                    <img src="../../assets/icons/ui/mantravilogo.png" alt="Mantravi Logo" class="h-6 w-auto">
                    <div>
                        <h3 class="text-lg font-bold text-white">Start Your Digital Journey</h3>
                        <p class="text-xs text-gray-400">Consult Our Experts</p>
                    </div>
                </div>
                <button onclick="closeConsultModal()" class="text-gray-400 hover:text-white transition-colors">
                    <i data-lucide="x" class="w-5 h-5"></i>
                </button>
            </div>
            
            <!-- Modal Body -->
            <div class="p-4">
                <p class="text-gray-300 mb-4 text-sm">Ready to transform your business with cutting-edge technology? Share your vision with us and let's build something extraordinary together.</p>
                
                <form id="consultForm" class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                        <label for="name" class="block text-sm font-medium text-slate-200 mb-1">Full Name *</label>
                        <input type="text" id="name" name="name" required 
                               class="w-full px-3 py-2 bg-slate-700/50 border border-slate-500/50 rounded-lg text-white placeholder-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 transition-colors text-sm">
                    </div>
                    
                    <div>
                        <label for="email" class="block text-sm font-medium text-slate-200 mb-1">Email Address *</label>
                        <input type="email" id="email" name="email" required 
                               class="w-full px-3 py-2 bg-slate-700/50 border border-slate-500/50 rounded-lg text-white placeholder-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 transition-colors text-sm">
                    </div>
                    
                    <div>
                        <label for="phone" class="block text-sm font-medium text-slate-200 mb-1">Phone Number</label>
                        <input type="tel" id="phone" name="phone" 
                               class="w-full px-3 py-2 bg-slate-700/50 border border-slate-500/50 rounded-lg text-white placeholder-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 transition-colors text-sm">
                    </div>
                    
                    <div>
                        <label for="company" class="block text-sm font-medium text-slate-200 mb-1">Company Name</label>
                        <input type="text" id="company" name="company" 
                               class="w-full px-3 py-2 bg-slate-700/50 border border-slate-500/50 rounded-lg text-white placeholder-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 transition-colors text-sm">
                    </div>
                    
                    <div>
                        <label for="service" class="block text-sm font-medium text-slate-200 mb-1">Service Interested In *</label>
                        <select id="service" name="service" required 
                                class="w-full px-3 py-2 bg-slate-700/50 border border-slate-500/50 rounded-lg text-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 transition-colors text-sm">
                            <option value="">Select a service</option>
                            <option value="web-development">Web & App Development</option>
                            <option value="digital-marketing">Digital Marketing & Branding</option>
                            <option value="qa-services">QA & Maintenance Services</option>
                            <option value="ai-transformation">AI-Driven Digital Transformation</option>
                            <option value="consulting">IT Consulting</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    
                    <div class="lg:col-span-2">
                        <label for="message" class="block text-sm font-medium text-slate-200 mb-1">Project Details *</label>
                        <textarea id="message" name="message" rows="3" required 
                                  class="w-full px-3 py-2 bg-slate-700/50 border border-slate-500/50 rounded-lg text-white placeholder-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 resize-none transition-colors text-sm"
                                  placeholder="Describe your project requirements, timeline, and any specific needs..."></textarea>
                    </div>
                    
                    <div class="lg:col-span-2 flex space-x-3 pt-2">
                        <button type="button" onclick="closeConsultModal()" 
                                class="flex-1 px-4 py-2 border border-slate-500/50 text-slate-200 rounded-lg hover:bg-slate-600/50 transition-colors text-sm">
                            Cancel
                        </button>
                        <button type="submit" 
                                class="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors text-sm">
                            Send Request
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    `;
    
    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Initialize Lucide icons for the modal
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    
    // Initialize form handler
    initializeConsultForm();
    
    console.log('✅ Contact form modal created');
}

// Open consult modal
function openConsultModal() {
    console.log('🔍 openConsultModal called');
    
    // Create modal if it doesn't exist
    createContactFormModal();
    
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
    
    // Simulate form submission (replace with actual API call)
    showNotification('Thank you! We\'ll get back to you within 24 hours.', 'success');
    closeConsultModal();
    
    // Reset form
    event.target.reset();
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
