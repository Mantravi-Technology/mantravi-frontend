/**
 * SEO Utilities for Mantravi Website
 * Provides reusable functions for adding structured data and SEO enhancements
 */

/**
 * Generate BreadcrumbList structured data
 * @param {Array} items - Array of {name, url} objects
 * @returns {Object} BreadcrumbList schema
 */
function generateBreadcrumbSchema(items) {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": items.map((item, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.name,
            "item": item.url
        }))
    };
}

/**
 * Add BreadcrumbList schema to page
 * @param {Array} breadcrumbs - Array of {name, url} objects
 */
function addBreadcrumbSchema(breadcrumbs) {
    // Remove existing breadcrumb schema if any
    const existing = document.getElementById('breadcrumb-schema');
    if (existing) {
        existing.remove();
    }

    // Create new schema
    const schema = generateBreadcrumbSchema(breadcrumbs);
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'breadcrumb-schema';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
}

/**
 * Generate Service schema for a service
 * @param {Object} service - Service object with name, description, etc.
 * @returns {Object} Service schema
 */
function generateServiceSchema(service) {
    return {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": service.name,
        "description": service.description,
        "provider": {
            "@type": "Organization",
            "name": "Mantravi",
            "url": "https://mantravi.com"
        },
        "areaServed": {
            "@type": "Country",
            "name": "India"
        },
        "serviceType": service.category || "IT Service"
    };
}

/**
 * Update meta description dynamically
 * @param {string} description - Meta description text
 */
function updateMetaDescription(description) {
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
        meta = document.createElement('meta');
        meta.name = 'description';
        document.head.appendChild(meta);
    }
    meta.content = description;
}

/**
 * Update Open Graph tags dynamically
 * @param {Object} ogData - Object with title, description, image, url
 */
function updateOpenGraphTags(ogData) {
    const tags = {
        'og:title': ogData.title,
        'og:description': ogData.description,
        'og:image': ogData.image || 'https://mantravi.com/assets/icons/ui/mantravi.png',
        'og:url': ogData.url || window.location.href,
        'og:type': ogData.type || 'website'
    };

    Object.entries(tags).forEach(([property, content]) => {
        if (!content) return;
        let tag = document.querySelector(`meta[property="${property}"]`);
        if (!tag) {
            tag = document.createElement('meta');
            tag.setAttribute('property', property);
            document.head.appendChild(tag);
        }
        tag.setAttribute('content', content);
    });
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        generateBreadcrumbSchema,
        addBreadcrumbSchema,
        generateServiceSchema,
        updateMetaDescription,
        updateOpenGraphTags
    };
}

