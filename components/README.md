# Reusable Contact Form Component

This is a reusable contact form component that can be used on any page of your website.

## 📁 Files Created:

1. **`components/contact-form.html`** - The HTML component
2. **`assets/js/contact-form.js`** - The JavaScript functionality

## 🚀 How to Use on Any Page:

### Step 1: Add the JavaScript
Include the contact form script in your HTML head:
```html
<script src="../../assets/js/contact-form.js"></script>
```

### Step 2: Add the Container
Add this div where you want the form to appear:
```html
<div id="contact-form-container"></div>
```

### Step 3: Load the Component
Add this JavaScript to load the form:
```javascript
// Load Contact Form Component
async function loadContactForm() {
    try {
        const response = await fetch('../../components/contact-form.html');
        const html = await response.text();
        document.getElementById('contact-form-container').innerHTML = html;
        
        // Re-initialize Lucide icons after loading the component
        lucide.createIcons();
    } catch (error) {
        console.error('Error loading contact form:', error);
    }
}

// Load the contact form when page loads
loadContactForm();
```

### Step 4: Add Trigger Button
Add a button that opens the modal:
```html
<button onclick="openConsultModal()" class="your-button-classes">
    Consult Our Experts
</button>
```

## 🎯 Features:

- ✅ **Reusable** - Use on any page
- ✅ **Responsive** - Works on all devices
- ✅ **Professional** - Matches your brand design
- ✅ **Functional** - Form validation and submission
- ✅ **Accessible** - Screen reader friendly

## 🔧 Customization:

You can modify the form fields in `components/contact-form.html` and the functionality in `assets/js/contact-form.js` to match your specific needs.

## 📝 Example Usage:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Your Page</title>
    <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
    <script src="../../assets/js/contact-form.js"></script>
</head>
<body>
    <!-- Your page content -->
    <button onclick="openConsultModal()">Get in Touch</button>
    
    <!-- Contact Form Container -->
    <div id="contact-form-container"></div>
    
    <script>
        // Load the contact form
        async function loadContactForm() {
            const response = await fetch('../../components/contact-form.html');
            const html = await response.text();
            document.getElementById('contact-form-container').innerHTML = html;
            lucide.createIcons();
        }
        loadContactForm();
    </script>
</body>
</html>
```
