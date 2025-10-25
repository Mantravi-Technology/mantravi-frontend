// Component Loader for Header and Footer
document.addEventListener('DOMContentLoaded', function() {
    // Load head component
    const headContainer = document.getElementById('head-container');
    if (headContainer) {
        fetch('../../components/head/head.html')
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
        fetch('../../components/styles/common-styles.html')
            .then(response => response.text())
            .then(html => {
                stylesContainer.innerHTML = html;
            })
            .catch(error => {
                console.error('Error loading styles component:', error);
            });
    }

    // Load header component
    const headerContainer = document.getElementById('header-container');
    if (headerContainer) {
        fetch('../../components/header/header.html')
            .then(response => response.text())
            .then(html => {
                headerContainer.innerHTML = html;
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
               fetch('../../components/footer/footer.html?v=' + Date.now())
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
               fetch('../../components/contact-form.html')
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
                       console.log('Contact form loaded successfully');
                       
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
               console.log('Loading stats component...');
               fetch('../../components/stats-section/stats-section.html?v=' + Date.now())
                   .then(response => response.text())
                   .then(html => {
                       console.log('Stats component loaded successfully');
                       statsContainer.innerHTML = html;
                   })
                   .catch(error => {
                       console.error('Error loading stats section component:', error);
                   });
           } else {
               console.log('Stats container not found');
           }


           // Load CTA section component
           const ctaContainer = document.getElementById('cta-container');
           if (ctaContainer) {
               fetch('../../components/cta-section/cta-section.html')
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
});

function initializeMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }
}