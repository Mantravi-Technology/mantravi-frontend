#!/bin/bash

# Update all pages with header, footer, and styles
PAGES=("blog" "contact" "work-with-us")

for page in "${PAGES[@]}"; do
    echo "Updating pages/$page/index.html"
    
    # Add Tailwind CSS CDN and styles
    sed -i '' 's|<!-- Favicon -->|<!-- Tailwind CSS CDN -->\
    <script src="https://cdn.tailwindcss.com"></script>\
    \
    <!-- Favicon -->|' "pages/$page/index.html"
    
    # Add styles
    sed -i '' '/<link href="https:\/\/fonts.googleapis.com\/css2?family=Inter/a\
    \
    <style>\
        * {\
            font-family: '\''Inter'\'', sans-serif;\
        }\
        \
        .smooth-scroll {\
            scroll-behavior: smooth;\
        }\
        \
        .glow-effect {\
            box-shadow: 0 0 20px rgba(78, 228, 255, 0.3);\
        }\
        \
        .text-glow {\
            text-shadow: 0 0 10px rgba(78, 228, 255, 0.5);\
        }\
        \
        .card-hover {\
            transition: all 0.3s ease;\
        }\
        \
        .card-hover:hover {\
            transform: translateY(-5px);\
            box-shadow: 0 20px 40px rgba(78, 228, 255, 0.2);\
        }\
        \
        /* Custom logo styling to match the actual Mantravi logo */\
        .mantravi-logo {\
            font-family: '\''Inter'\'', sans-serif;\
            font-weight: 500;\
            font-size: 1.5rem;\
            color: white;\
            letter-spacing: -0.02em;\
            text-decoration: none;\
        }\
        \
        .mandala-icon {\
            display: inline-block;\
            width: 12px;\
            height: 12px;\
            background: linear-gradient(45deg, #8B5CF6, #EC4899, #3B82F6, #10B981);\
            border-radius: 50%;\
            position: relative;\
            margin-left: 2px;\
        }\
        \
        .mandala-icon::before {\
            content: '\'''\'';\
            position: absolute;\
            top: 50%;\
            left: 50%;\
            transform: translate(-50%, -50%);\
            width: 8px;\
            height: 8px;\
            background: linear-gradient(45deg, #A855F7, #F472B6, #60A5FA, #34D399);\
            border-radius: 50%;\
            border: 1px solid #D97706;\
        }\
        \
        .mandala-icon::after {\
            content: '\'''\'';\
            position: absolute;\
            top: 50%;\
            left: 50%;\
            transform: translate(-50%, -50%);\
            width: 4px;\
            height: 4px;\
            background: #D97706;\
            border-radius: 50%;\
        }\
    </style>' "pages/$page/index.html"
    
    # Update body class
    sed -i '' 's|class="bg-\[#050a30\] text-white"|class="bg-\[#050a30\] text-white smooth-scroll"|' "pages/$page/index.html"
    
    # Replace header placeholder with actual header
    sed -i '' 's|<!-- Header -->\
    <div id="header-placeholder"></div>|<!-- Header Navigation -->\
    <header class="fixed top-0 left-0 right-0 z-50 bg-\[#050a30\]/95 backdrop-blur-md border-b border-white/10">\
        <nav class="container mx-auto px-6 py-4">\
            <div class="flex items-center justify-between">\
                <!-- Logo -->\
                <a href="/pages/home/" class="mantravi-logo">\
                    mantravi<span class="mandala-icon"></span>\
                </a>\
                \
                <!-- Desktop Navigation -->\
                <div class="hidden md:flex items-center space-x-8">\
                    <a href="/pages/home/" class="hover:text-\[#4EE4FF\] transition-colors">Home</a>\
                    <a href="/pages/services/" class="hover:text-\[#4EE4FF\] transition-colors">Services</a>\
                    <a href="/pages/blog/" class="hover:text-\[#4EE4FF\] transition-colors">Blog</a>\
                    <a href="/pages/about/" class="hover:text-\[#4EE4FF\] transition-colors">About</a>\
                    <a href="/pages/contact/" class="hover:text-\[#4EE4FF\] transition-colors">Contact</a>\
                    <a href="/pages/work-with-us/" class="hover:text-\[#4EE4FF\] transition-colors">Work With Us</a>\
                </div>\
                \
                <!-- Primary CTA -->\
                <div class="hidden md:block">\
                    <button class="bg-\[#4EE4FF\] text-\[#050a30\] px-6 py-2 rounded-lg font-semibold hover:bg-\[#4EE4FF\]/90 transition-colors glow-effect">\
                        Start Your Digital Journey\
                    </button>\
                </div>\
                \
                <!-- Mobile Menu Button -->\
                <button class="md:hidden" id="mobile-menu-btn" aria-label="Toggle mobile menu">\
                    <i data-lucide="menu" class="w-6 h-6"></i>\
                </button>\
            </div>\
            \
            <!-- Mobile Menu -->\
            <div class="md:hidden hidden" id="mobile-menu">\
                <div class="flex flex-col space-y-4 py-4">\
                    <a href="/pages/home/" class="hover:text-\[#4EE4FF\] transition-colors">Home</a>\
                    <a href="/pages/services/" class="hover:text-\[#4EE4FF\] transition-colors">Services</a>\
                    <a href="/pages/blog/" class="hover:text-\[#4EE4FF\] transition-colors">Blog</a>\
                    <a href="/pages/about/" class="hover:text-\[#4EE4FF\] transition-colors">About</a>\
                    <a href="/pages/contact/" class="hover:text-\[#4EE4FF\] transition-colors">Contact</a>\
                    <a href="/pages/work-with-us/" class="hover:text-\[#4EE4FF\] transition-colors">Work With Us</a>\
                    <button class="bg-\[#4EE4FF\] text-\[#050a30\] px-6 py-2 rounded-lg font-semibold hover:bg-\[#4EE4FF\]/90 transition-colors glow-effect w-full mt-4">\
                        Start Your Digital Journey\
                    </button>\
                </div>\
            </div>\
        </nav>\
    </header>|' "pages/$page/index.html"
    
    # Replace footer placeholder with actual footer
    sed -i '' 's|<!-- Footer -->\
    <div id="footer-placeholder"></div>|<!-- Footer -->\
    <footer class="bg-black/50 py-12">\
        <div class="container mx-auto px-6">\
            <div class="flex flex-col md:flex-row justify-between items-center">\
                <div class="mantravi-logo mb-4 md:mb-0">\
                    mantravi<span class="mandala-icon"></span>\
                </div>\
                <div class="flex items-center space-x-6">\
                    <a href="#" class="text-gray-400 hover:text-\[#4EE4FF\] transition-colors">Privacy Policy</a>\
                    <div class="flex space-x-4">\
                        <a href="#" class="text-gray-400 hover:text-\[#4EE4FF\] transition-colors">\
                            <i data-lucide="linkedin" class="w-5 h-5"></i>\
                        </a>\
                        <a href="#" class="text-gray-400 hover:text-\[#4EE4FF\] transition-colors">\
                            <i data-lucide="twitter" class="w-5 h-5"></i>\
                        </a>\
                        <a href="#" class="text-gray-400 hover:text-\[#4EE4FF\] transition-colors">\
                            <i data-lucide="github" class="w-5 h-5"></i>\
                        </a>\
                    </div>\
                </div>\
            </div>\
            <div class="border-t border-white/10 mt-8 pt-8 text-center text-gray-400">\
                <p>&copy; 2024 Mantravi. All rights reserved.</p>\
            </div>\
        </div>\
    </footer>|' "pages/$page/index.html"
    
    # Replace scripts
    sed -i '' 's|<!-- Scripts -->\
    <script src="../../assets/js/main.js"></script>\
    <script>\
        // Load header and footer components\
        fetch('\''../../components/header/header.html'\'') \
            .then(response => response.text()) \
            .then(data => { \
                document.getElementById('\''header-placeholder'\'').innerHTML = data; \
                if (typeof lucide !== '\''undefined'\'') { \
                    lucide.createIcons(); \
                } \
            }); \
            \
        fetch('\''../../components/footer/footer.html'\'') \
            .then(response => response.text()) \
            .then(data => { \
                document.getElementById('\''footer-placeholder'\'').innerHTML = data; \
                if (typeof lucide !== '\''undefined'\'') { \
                    lucide.createIcons(); \
                } \
            }); \
    </script>|<!-- Scripts -->\
    <script>\
        // Initialize Lucide Icons\
        lucide.createIcons();\
        \
        // Mobile Menu Toggle\
        const mobileMenuBtn = document.getElementById('\''mobile-menu-btn'\'');\
        const mobileMenu = document.getElementById('\''mobile-menu'\'');\
        \
        if (mobileMenuBtn && mobileMenu) {\
            mobileMenuBtn.addEventListener('\''click'\'', () => {\
                mobileMenu.classList.toggle('\''hidden'\'');\
            });\
        }\
    </script>|' "pages/$page/index.html"
    
    echo "Updated pages/$page/index.html"
done

echo "All pages updated successfully!"
