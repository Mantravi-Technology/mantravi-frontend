# Reusable API Service Guide

## 🎯 Overview
The `ApiService` class provides a clean, reusable way to integrate with APIs across wesbite. It's designed to be easily extensible for new features without breaking existing functionality.

## 📁 File Location
- **API Service**: `assets/js/api-service.js`
- **Usage**: Included in all pages before `main.js`

## 🚀 Current Features

### 1. Consultation Form (Already Working)
```javascript
// Automatically used by the consultation form
const apiService = new ApiService();
const result = await apiService.submitConsultation(formData);
```

### 2. Available Methods for Future Use

#### Contact Form
```javascript
const apiService = new ApiService();
const result = await apiService.submitContact({
    name: 'John Doe',
    email: 'john@example.com',
    subject: 'Inquiry',
    message: 'Hello, I have a question...'
});
```

#### Newsletter Subscription
```javascript
const apiService = new ApiService();
const result = await apiService.subscribeNewsletter('user@example.com');
```

#### User Data
```javascript
const apiService = new ApiService();
const userData = await apiService.getUserData('user123');
```

#### Feedback Submission
```javascript
const apiService = new ApiService();
const result = await apiService.submitFeedback({
    rating: 5,
    comment: 'Great service!',
    userId: 'user123'
});
```

## 🔧 Adding New API Endpoints

### Step 1: Add Method to ApiService Class
```javascript
// In assets/js/api-service.js
async submitNewFeature(formData) {
    const apiData = {
        // Map your form data to API format
        field1: formData.input1 || '',
        field2: formData.input2 || '',
        // ... other fields
    };

    return await this.post('/api/new-feature', apiData);
}
```

### Step 2: Use in Your Form Handler
```javascript
// In your form submission handler
async function handleNewForm(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    
    try {
        const apiService = new ApiService();
        const result = await apiService.submitNewFeature(data);
        console.log('Success:', result);
        // Handle success
    } catch (error) {
        console.error('Error:', error);
        // Handle error
    }
}
```

## 🛠️ Generic Methods

### POST Request
```javascript
const apiService = new ApiService();
const result = await apiService.post('/api/endpoint', { data: 'value' });
```

### GET Request
```javascript
const apiService = new ApiService();
const result = await apiService.get('/api/endpoint');
```

## 🔧 Configuration

### Change Base URL
```javascript
// In assets/js/api-service.js, modify the constructor:
constructor() {
    this.baseURL = 'https://your-api-domain.com'; // Change this
    this.defaultHeaders = {
        'Content-Type': 'application/json'
    };
}
```

### Add Custom Headers
```javascript
// In assets/js/api-service.js, modify the constructor:
constructor() {
    this.baseURL = 'http://localhost:8082';
    this.defaultHeaders = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer your-token', // Add custom headers
        'X-Custom-Header': 'value'
    };
}





