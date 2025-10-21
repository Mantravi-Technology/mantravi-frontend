/**
 * Reusable API Service for Mantravi Website
 * Easy to extend for new features without breaking existing functionality
 */

class ApiService {
    constructor() {
        this.baseURL = 'http://localhost:8082';
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
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            return await response.json();
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
     * Submit feedback (for future use)
     * @param {Object} feedbackData - Feedback data
     * @returns {Promise<Object>} API response
     */
    async submitFeedback(feedbackData) {
        return await this.post('/api/feedback', feedbackData);
    }
}

// Make it globally available
window.ApiService = ApiService;

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ApiService;
}
