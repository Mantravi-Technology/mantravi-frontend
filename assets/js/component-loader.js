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
                   .then(response => response.text())
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
                   })
                   .catch(error => {
                       console.error('Error loading contact form component:', error);
                   });
           }

           // Load stats section component
           const statsContainer = document.getElementById('stats-container');
           if (statsContainer) {
               fetch('../../components/stats-section/stats-section.html')
                   .then(response => response.text())
                   .then(html => {
                       statsContainer.innerHTML = html;
                   })
                   .catch(error => {
                       console.error('Error loading stats section component:', error);
                   });
           }

           // Load page header component
           const pageHeaderContainer = document.getElementById('page-header-container');
           if (pageHeaderContainer) {
               // Use custom page headers for specific pages
               let headerPath = '../../components/page-header/page-header.html';
               if (window.location.pathname.includes('/services/')) {
                   headerPath = '../../components/page-header/services-page-header.html';
               } else if (window.location.pathname.includes('/home/') || window.location.pathname === '/' || window.location.pathname.endsWith('/index.html')) {
                   headerPath = '../../components/page-header/home-page-header.html';
               }
               
               fetch(headerPath)
                   .then(response => response.text())
                   .then(html => {
                       // Only process placeholders for non-services pages
                       if (!window.location.pathname.includes('/services/')) {
                           // Determine page title and description based on current page
                           let pageTitle = 'About Mantravi';
                           let pageDescription = 'We\'re a team of passionate technologists dedicated to engineering global disruption through AI-native excellence.';
                           
                           if (window.location.pathname.includes('/contact/')) {
                               pageTitle = 'Contact Us';
                               pageDescription = 'Ready to start your digital transformation journey? Get in touch with our expert team today.';
                           } else if (window.location.pathname.includes('/blog/')) {
                               pageTitle = 'Blog & Insights';
                               pageDescription = 'Stay ahead with the latest insights on AI, digital transformation, and emerging technologies.';
                           } else if (window.location.pathname.includes('/work-with-us/')) {
                               pageTitle = 'Work With Us';
                               pageDescription = 'Join our team of passionate technologists and help shape the future of digital transformation.';
                           }

                           // Replace placeholders with actual content
                           html = html.replace('{{PAGE_TITLE}}', pageTitle);
                           html = html.replace('{{PAGE_DESCRIPTION}}', pageDescription);
                       }
                       
                       pageHeaderContainer.innerHTML = html;
                   })
                   .catch(error => {
                       console.error('Error loading page header component:', error);
                   });
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