// Mantravi Website Configuration
const SITE_CONFIG = {
    // Site Information
    site: {
        name: "Mantravi",
        tagline: "Engineering Global Disruption with AI-Native Excellence",
        description: "Your partner in harnessing the power of next-gen Prompt Engineering, Digital Transformation, and Intelligent Cloud Solutions.",
        url: "https://mantravi.com",
        logo: "assets/images/logo.png",
        favicon: "assets/icons/ui/mantravilogo.png"
    },

    // Design System
    design: {
        colors: {
            primary: "#050a30",      // Deep Space Blue
            accent: "#4EE4FF",       // Electric Cyan
            white: "#FFFFFF",       // Pure White
            gray: {
                100: "#F3F4F6",
                200: "#E5E7EB", 
                300: "#D1D5DB",
                400: "#9CA3AF",
                500: "#6B7280",
                600: "#4B5563",
                700: "#374151",
                800: "#1F2937",
                900: "#111827"
            }
        },
        typography: {
            fontFamily: "Inter, sans-serif",
            fontWeights: {
                light: 300,
                normal: 400,
                medium: 500,
                semibold: 600,
                bold: 700,
                extrabold: 800,
                black: 900
            }
        },
        breakpoints: {
            sm: "640px",
            md: "768px", 
            lg: "1024px",
            xl: "1280px",
            "2xl": "1536px"
        }
    },

    // Navigation
    navigation: {
        main: [
            { name: "Home", href: "/", current: false },
            { name: "Services", href: "/services", current: false },
            { name: "Blog", href: "/blog", current: false },
            { name: "About", href: "/about", current: false },
            { name: "Contact", href: "/contact", current: false },
            { name: "Work With Us", href: "/work-with-us", current: false }
        ],
        footer: {
            company: [
                { name: "About Us", href: "/about" },
                { name: "Our Team", href: "/about#team" },
                { name: "Careers", href: "/work-with-us" },
                { name: "Contact", href: "/contact" }
            ],
            services: [
                { name: "Web Development", href: "/services#web-development" },
                { name: "Digital Marketing", href: "/services#digital-marketing" },
                { name: "QA Services", href: "/services#qa-services" },
                { name: "Consulting", href: "/services#consulting" }
            ],
            resources: [
                { name: "Blog", href: "/blog" },
                { name: "Case Studies", href: "/case-studies" },
                { name: "White Papers", href: "/resources" },
                { name: "Support", href: "/support" }
            ]
        }
    },

    // Social Media
    social: {
        linkedin: "https://www.linkedin.com/company/mantravi",
        instagram: "https://www.instagram.com/mantravi.tech/"
    },

    // Contact Information
    contact: {
        email: "hello@mantravi.com",
        phone: "+1 (555) 123-4567",
        address: {
            street: "123 Innovation Drive",
            city: "San Francisco",
            state: "CA",
            zip: "94105",
            country: "USA"
        }
    },

    // Services
    services: [
        {
            id: "web-development",
            title: "Web & App Development",
            description: "Build modern, scalable websites and applications tailored to your needs.",
            icon: "smartphone",
            features: [
                "Custom Web Applications",
                "Mobile App Development", 
                "E-commerce Solutions",
                "Progressive Web Apps"
            ]
        },
        {
            id: "digital-marketing",
            title: "Digital Marketing & Branding",
            description: "Grow your reach with targeted marketing, SEO, and compelling brand identity creation.",
            icon: "trending-up",
            features: [
                "SEO Optimization",
                "Social Media Marketing",
                "Brand Identity Design",
                "Content Strategy"
            ]
        },
        {
            id: "qa-services",
            title: "QA & Maintenance Services",
            description: "Ensure flawless performance with test automation, performance QA, and expert IT consulting.",
            icon: "settings",
            features: [
                "Test Automation",
                "Performance Testing",
                "IT Consulting",
                "Maintenance & Support"
            ]
        }
    ],

    // Company Information
    company: {
        founded: "2020",
        employees: "50+",
        clients: "100+",
        projects: "200+",
        mission: "To empower businesses with cutting-edge technology solutions that drive innovation and growth.",
        vision: "To be the leading partner in digital transformation, helping organizations thrive in the AI-driven future."
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SITE_CONFIG;
}
