// Component Loader for Header and Footer
document.addEventListener('DOMContentLoaded', function() {
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
           console.log('🔍 Contact form container:', contactFormContainer);
           if (contactFormContainer) {
               console.log('📥 Loading contact form component...');
               fetch('../../components/contact-form.html')
                   .then(response => response.text())
                   .then(html => {
                       console.log('✅ Contact form HTML loaded');
                       contactFormContainer.innerHTML = html;
                       // Initialize Lucide icons after loading
                       if (typeof lucide !== 'undefined') {
                           lucide.createIcons();
                       }
                       // Initialize consult form
                       if (typeof initializeConsultForm === 'function') {
                           initializeConsultForm();
                           console.log('✅ Contact form initialized');
                       } else {
                           console.log('❌ initializeConsultForm function not found');
                       }
                   })
                   .catch(error => {
                       console.error('Error loading contact form component:', error);
                   });
           } else {
               console.log('❌ Contact form container not found');
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