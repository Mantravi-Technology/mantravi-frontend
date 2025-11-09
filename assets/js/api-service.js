/**
 * Reusable API Service for Mantravi Website
 * Easy to extend for new features without breaking existing functionality
 */

class ApiService {
    constructor() {
        this.baseURL = 'https://api.mantravi.com';
        this.defaultHeaders = {
            'Content-Type': 'application/json'
        };
    }

    /**
     * Generic POST request method
     * @param {string} endpoint - API endpoint (e.g., '/api/consultation')
     * @param {Object} data - Data to send
     * @returns {Promise<Object>} API response
     */
    async post(endpoint, data) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'POST',
                headers: this.defaultHeaders,
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            // Try to parse as JSON, but if it fails, return raw text
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return await response.json();
            } else {
                const textResponse = await response.text();
                return { success: true, message: textResponse };
            }
        } catch (error) {
            console.error(`API POST ${endpoint} failed:`, error);
            throw error;
        }
    }

    /**
     * Generic GET request method
     * @param {string} endpoint - API endpoint
     * @returns {Promise<Object>} API response
     */
    async get(endpoint) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'GET',
                headers: this.defaultHeaders
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`API GET ${endpoint} failed:`, error);
            throw error;
        }
    }

    /**
     * POST request with FormData for file uploads
     * @param {string} endpoint - API endpoint
     * @param {FormData} formData - FormData object
     * @returns {Promise<Object>} API response
     */
    async postFormData(endpoint, formData) {
        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, {
                method: 'POST',
                body: formData
                // Don't set Content-Type header - let browser set it with boundary
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            // Try to parse as JSON, but if it fails, return raw text
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return await response.json();
            } else {
                const textResponse = await response.text();
                return { success: true, message: textResponse };
            }
        } catch (error) {
            console.error(`API POST FormData ${endpoint} failed:`, error);
            throw error;
        }
    }

    /**
     * Submit consultation form data
     * @param {Object} formData - Form data object
     * @returns {Promise<Object>} API response
     */
    async submitConsultation(formData) {
        const apiData = {
            fullName: formData.name || '',
            email: formData.email || '',
            phoneNumber: formData.phone || '',
            companyName: formData.company || '',
            serviceInterestedIn: formData.service || '',
            projectDetails: formData.message || ''
        };

        return await this.post('/api/consultation', apiData);
    }

    /**
     * Submit contact form data (for future use)
     * @param {Object} formData - Contact form data
     * @returns {Promise<Object>} API response
     */
    async submitContact(formData) {
        const apiData = {
            name: formData.name || '',
            email: formData.email || '',
            subject: formData.subject || '',
            message: formData.message || ''
        };

        return await this.post('/api/contact', apiData);
    }

    /**
     * Subscribe to newsletter (for future use)
     * @param {string} email - Email address
     * @returns {Promise<Object>} API response
     */
    async subscribeNewsletter(email) {
        return await this.post('/api/newsletter', { email });
    }

    /**
     * Get user data (for future use)
     * @param {string} userId - User ID
     * @returns {Promise<Object>} API response
     */
    async getUserData(userId) {
        return await this.get(`/api/users/${userId}`);
    }

    /**
     * Submit job application form data
     * @param {Object} formData - Application form data
     * @returns {Promise<Object>} API response
     */
    async submitJobApplication(formData) {
        // Create FormData for file upload
        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name || '');
        formDataToSend.append('email', formData.email || '');
        formDataToSend.append('phone', formData.phone || '');
        formDataToSend.append('role', formData.role || '');
        formDataToSend.append('description', formData.message || '');
        
        // Handle resume file if present
        if (formData.resume && formData.resume instanceof File) {
            formDataToSend.append('resume', formData.resume);
        }
        
        // Use FormData instead of JSON for file upload
        return await this.postFormData('/api/work-with-us', formDataToSend);
    }

    /**
     * Submit feedback (for future use)
     * @param {Object} feedbackData - Feedback data
     * @returns {Promise<Object>} API response
     */
    async submitFeedback(feedbackData) {
        return await this.post('/api/feedback', feedbackData);
    }

    /**
     * Get published blog posts with pagination and optional category filter
     * @param {number} page - Page number (0-indexed)
     * @param {number} limit - Number of items per page
     * @param {string} category - Optional category filter (AI, Dev, Digital Marketing, Case Study)
     * @param {string} sortBy - Sort field (default: publishedAt)
     * @returns {Promise<Object>} API response with data, pagination info
     */
    async getPublishedBlogs(page = 0, limit = 6, category = null, sortBy = 'publishedAt') {
        let endpoint = `/api/blog/published?pageNumber=${page}&pageSize=${limit}&sortBy=${sortBy}`;
        if (category && category !== 'all') {
            endpoint += `&category=${encodeURIComponent(category)}`;
        }
        return await this.get(endpoint);
    }

    /**
     * Get a single blog post by ID
     * @param {string} id - Blog post ID (UUID)
     * @returns {Promise<Object>} Blog post data
     */
    async getBlogById(id) {
        const endpoint = `/api/blog/${encodeURIComponent(id)}`;
        return await this.get(endpoint);
    }

    /**
     * Get a single blog post by slug
     * @param {string} slug - Blog post slug
     * @returns {Promise<Object>} Blog post data
     */
    async getBlogBySlug(slug) {
        const endpoint = `/api/blog/slug/${encodeURIComponent(slug)}`;
        return await this.get(endpoint);
    }

    /**
     * Get related blog posts for a given slug
     * @param {string} slug - Blog post slug
     * @returns {Promise<Array>} Array of related blog posts
     */
    async getRelatedBlogs(slug) {
        const endpoint = `/api/blog/${encodeURIComponent(slug)}/related`;
        return await this.get(endpoint);
    }
}

// Make it globally available
window.ApiService = ApiService;

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ApiService;
}

