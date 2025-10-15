// Reusable Contact Form JavaScript
// Include this script in any page where you want to use the contact form

// Consult Modal Functions
function openConsultModal() {
    document.getElementById('consultModal').classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closeConsultModal() {
    document.getElementById('consultModal').classList.add('hidden');
    document.body.style.overflow = 'auto'; // Restore scrolling
}

// Initialize contact form when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Close modal when clicking outside
    const modal = document.getElementById('consultModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeConsultModal();
            }
        });
    }
    
    // Handle form submission
    const form = document.getElementById('consultForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Show success message (you can replace this with actual form submission)
            alert('Thank you for your request! We\'ll get back to you within 24 hours.');
            
            // Reset form and close modal
            this.reset();
            closeConsultModal();
        });
    }
});

// Make functions globally available
window.openConsultModal = openConsultModal;
window.closeConsultModal = closeConsultModal;
