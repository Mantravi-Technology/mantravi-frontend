// Component Loader for Header and Footer
(function() {
    // Run immediately if DOM is ready, otherwise wait
    function init() {
        // Load head component
        const headContainer = document.getElementById('head-container');
        if (headContainer) {
            fetch('/components/head/head.html')
                .then(response => response.text())
                .then(html => {
                    headContainer.innerHTML = html;
                })
                .catch(error => {
                    console.error('Error loading head component:', error);
                });
        }

        // Load common styles component
        const stylesContainer = document.getElementById('styles-container');
        if (stylesContainer) {
            fetch('/components/styles/common-styles.html?v=' + Date.now() + '&cb=' + Math.random())
                .then(response => response.text())
                .then(css => {
                    // Wrap CSS in style tags
                    stylesContainer.innerHTML = '<style>' + css + '</style>';
                })
                .catch(error => {
                    console.error('Error loading styles component:', error);
                });
        }

        // Load header component
        const headerContainer = document.getElementById('header-container');
        if (headerContainer) {
            fetch('/components/header/header.html?v=' + Date.now())
            .then(response => response.text())
            .then(html => {
                headerContainer.innerHTML = html;
                
                // Initialize blog dropdown after header loads
                setTimeout(() => {
                    if (typeof initializeBlogDropdown === 'function') {
                        initializeBlogDropdown();
                    }
                    
                    // Force grid layout AND styling for blog dropdown - ABSOLUTE ENFORCEMENT
                    function enforceGridLayout() {
                        const blogMenu = document.getElementById('blog-dropdown-menu');
                        const blogContainer = document.querySelector('.blog-dropdown-container');
                        const blogGrid = document.querySelector('.blog-dropdown-grid');
                        
                        // Update container size - wider, less vertical padding
                        if (blogMenu && window.innerWidth > 768) {
                            blogMenu.style.width = '580px';
                            blogMenu.style.minWidth = '580px';
                        }
                        if (blogContainer && window.innerWidth > 768) {
                            blogContainer.style.minWidth = '580px';
                            blogContainer.style.padding = '12px 24px';
                        }
                        
                        if (blogGrid) {
                            const isDesktop = window.innerWidth > 768;
                            
                            if (isDesktop) {
                                // DESKTOP: 3x2 Grid - Reduced spacing, centered items
                                blogGrid.style.cssText = `
                                    display: grid !important;
                                    grid-template-columns: repeat(3, 1fr) !important;
                                    grid-template-rows: repeat(2, auto) !important;
                                    gap: 8px !important;
                                    width: 100% !important;
                                    align-items: center !important;
                                    justify-items: center !important;
                                `;
                                
                                const cards = blogGrid.querySelectorAll('a');
                                const empty = blogGrid.querySelector('.blog-dropdown-card-empty');
                                
                                // Row 1
                                if (cards[0]) cards[0].style.cssText = 'grid-column: 1; grid-row: 1; width: 100%;';
                                if (cards[1]) cards[1].style.cssText = 'grid-column: 2; grid-row: 1; width: 100%;';
                                if (cards[2]) cards[2].style.cssText = 'grid-column: 3; grid-row: 1; width: 100%;';
                                
                                // Row 2 - Empty cell
                                if (empty) {
                                    empty.style.cssText = 'grid-column: 1; grid-row: 2; display: none !important; visibility: hidden !important; height: 0 !important; width: 0 !important; padding: 0 !important; margin: 0 !important;';
                                }
                                
                                // Row 2 - Dev and Case Study
                                if (cards[3]) cards[3].style.cssText = 'grid-column: 2; grid-row: 2; width: 100%;';
                                if (cards[4]) cards[4].style.cssText = 'grid-column: 3; grid-row: 2; width: 100%;';
                                
                                // Apply NEW MINIMAL styles to cards - NO BLOCK STYLE - REDUCED SIZE
                                cards.forEach(card => {
                                    card.style.padding = '10px 12px';
                                    card.style.minHeight = '75px';
                                    card.style.borderRadius = '16px';
                                    card.style.gap = '6px';
                                    card.style.background = 'transparent';
                                    card.style.border = 'none';
                                    card.style.boxShadow = 'none';
                                    card.style.display = 'flex';
                                    card.style.flexDirection = 'column';
                                    card.style.alignItems = 'center';
                                    card.style.justifyContent = 'center';
                                    
                                    const icon = card.querySelector('.blog-dropdown-card-icon');
                                    if (icon) {
                                        icon.style.width = '38px';
                                        icon.style.height = '38px';
                                        icon.style.borderRadius = '50%';
                                        icon.style.background = 'transparent';
                                        icon.style.boxShadow = 'none';
                                        
                                        const iconElement = icon.querySelector('i');
                                        if (iconElement) {
                                            iconElement.style.width = '18px';
                                            iconElement.style.height = '18px';
                                        }
                                    }
                                    
                                    const label = card.querySelector('.blog-dropdown-card-label');
                                    if (label) {
                                        label.style.fontSize = '11px';
                                        label.style.fontWeight = '500';
                                        label.style.padding = '0 2px';
                                    }
                                    
                                    // Add click handler to close dropdown
                                    card.addEventListener('click', () => {
                                        const menu = document.getElementById('blog-dropdown-menu');
                                        if (menu) {
                                            menu.classList.remove('visible');
                                            menu.classList.add('hidden');
                                            const blogDropdown = document.getElementById('blog-dropdown');
                                            if (blogDropdown) {
                                                blogDropdown.classList.remove('active');
                                            }
                                        }
                                    });
                                });
                                
                                // Prevent text truncation
                                const labels = blogGrid.querySelectorAll('.blog-dropdown-card-label');
                                labels.forEach(label => {
                                    label.style.whiteSpace = 'normal';
                                    label.style.wordWrap = 'break-word';
                                    label.style.overflowWrap = 'break-word';
                                    label.style.overflow = 'visible';
                                    label.style.textOverflow = 'clip';
                                    label.style.maxWidth = '100%';
                                });
                                
                            }
                        }
                    }
                    
                    // Run immediately and multiple times to ensure it applies
                    enforceGridLayout();
                    setTimeout(enforceGridLayout, 50);
                    setTimeout(enforceGridLayout, 200);
                    setTimeout(enforceGridLayout, 500);
                    setTimeout(enforceGridLayout, 1000);
                    
                    // Re-run on window resize
                    window.addEventListener('resize', enforceGridLayout);
                }, 100);
                
                // Initialize Lucide icons after loading
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
                // Initialize mobile menu
                initializeMobileMenu();
            })
            .catch(error => {
                console.error('Error loading header component:', error);
            });
        }

        // Load footer component
        const footerContainer = document.getElementById('footer-container');
        if (footerContainer) {
            fetch('/components/footer/footer.html?v=' + Date.now())
                .then(response => response.text())
                .then(html => {
                    footerContainer.innerHTML = html;
                    // Initialize Lucide icons after loading
                    if (typeof lucide !== 'undefined') {
                        lucide.createIcons();
                    }
                })
                .catch(error => {
                    console.error('Error loading footer component:', error);
                });
        }

        // Load contact form component
        const contactFormContainer = document.getElementById('contact-form-container');
        if (contactFormContainer) {
            fetch('/components/contact-form.html')
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.text();
                })
                .then(html => {
                           contactFormContainer.innerHTML = html;
                           // Initialize Lucide icons after loading
                           if (typeof lucide !== 'undefined') {
                               lucide.createIcons();
                           }
                           // Initialize consult form
                           if (typeof initializeConsultForm === 'function') {
                               initializeConsultForm();
                           }
                           
                           // Dispatch custom event to notify that contact form is loaded
                           document.dispatchEvent(new CustomEvent('contactFormLoaded'));
                })
                .catch(error => {
                    console.error('Error loading contact form component:', error);
                    // Show a fallback message or retry
                    contactFormContainer.innerHTML = '<div class="text-red-500 text-center p-4">Failed to load contact form. Please refresh the page.</div>';
                });
        }

        // Load stats section component
        const statsContainer = document.getElementById('stats-container');
        if (statsContainer) {
            fetch('/components/stats-section/stats-section.html?v=' + Date.now())
                .then(response => response.text())
                .then(html => {
                    statsContainer.innerHTML = html;
                })
                .catch(error => {
                    console.error('Error loading stats section component:', error);
                });
        }

        // Load CTA section component
        const ctaContainer = document.getElementById('cta-container');
        if (ctaContainer) {
            fetch('/components/cta-section/cta-section.html')
                .then(response => response.text())
                .then(html => {
                    // Determine CTA content based on current page
                    let ctaTitle = 'Ready to Work With Us?';
                    let ctaDescription = 'Join the growing number of businesses that trust Mantravi for their digital transformation needs.';
                    let ctaButtonText = 'Get Started Today';
                    
                    if (window.location.pathname.includes('/contact/')) {
                        ctaTitle = 'Ready to Start Your Project?';
                        ctaDescription = 'Schedule a free consultation to discuss your needs and discover how we can help you achieve your goals.';
                        ctaButtonText = 'Schedule Consultation';
                    } else if (window.location.pathname.includes('/services/')) {
                        ctaTitle = 'Ready to Transform Your Business? Let\'s Get Started';
                        ctaDescription = 'Schedule a free consultation to discuss your project and discover how we can help you achieve your goals.';
                        ctaButtonText = 'Schedule Consultation';
                    }
                    
                    // Replace placeholders with actual content
                    let processedHtml = html.replace('{{CTA_TITLE}}', ctaTitle);
                    processedHtml = processedHtml.replace('{{CTA_DESCRIPTION}}', ctaDescription);
                    processedHtml = processedHtml.replace('{{CTA_BUTTON_TEXT}}', ctaButtonText);
                    ctaContainer.innerHTML = processedHtml;
                })
                .catch(error => {
                    console.error('Error loading CTA section component:', error);
                });
        }
    }
    
    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        // DOM already ready, run immediately
        init();
    }
})();

function initializeMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            
            // Update aria-expanded attribute
            const isExpanded = !mobileMenu.classList.contains('hidden');
            mobileMenuBtn.setAttribute('aria-expanded', isExpanded);
            
            // Remove focus from button after click to prevent focus border
            mobileMenuBtn.blur();
        });
        
        // Close mobile menu when clicking on links
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                // Remove focus from button when menu closes
                mobileMenuBtn.blur();
            });
        });
        
        // Initialize blog dropdown after header loads
        setTimeout(() => {
            if (typeof initializeBlogDropdown === 'function') {
                initializeBlogDropdown();
            }
        }, 200);
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
                mobileMenu.classList.add('hidden');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                mobileMenuBtn.blur();
            }
        });
    }
}