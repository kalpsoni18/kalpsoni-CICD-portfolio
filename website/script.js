/**
 * Portfolio Website JavaScript
 * Kalp Soni - Cloud & DevOps Engineer
 * 
 * This file contains all the interactive functionality for the portfolio website
 */

// DOM Elements
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const navLinksItems = document.querySelectorAll('.nav-links ul li a');
const contactForm = document.getElementById('contactForm');

// API Configurations
const API_URL = 'https://r7kjg1upkg.execute-api.us-east-2.amazonaws.com/prod/contact'; 

// Navbar functionality
hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close navbar when clicking on a nav item (mobile)
navLinksItems.forEach(item => {
    item.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Scroll event for navbar styling changes
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    
    if (window.scrollY > 50) {
        navbar.style.padding = '0.5rem 0';
        navbar.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.padding = '1rem 0';
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
});

// Enhanced form submission handler with AWS API integration
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Show loading state
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton?.textContent || 'Send Message';
        if (submitButton) {
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
        }
        
        // Get form data using FormData (safer method)
        const formDataObj = new FormData(contactForm);
        const formData = {
            name: formDataObj.get('name')?.trim() || '',
            email: formDataObj.get('email')?.trim() || '',
            message: formDataObj.get('message')?.trim() || ''
        };
        
        console.log('Form data collected:', formData);
        
        // Basic client-side validation
        if (!formData.name || !formData.email || !formData.message) {
            alert('Please fill in all fields.');
            if (submitButton) {
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            alert('Please enter a valid email address.');
            if (submitButton) {
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }
            return;
        }
        
        try {
            console.log('Sending to API:', API_URL);
            
            // Submit to AWS API Gateway
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            
            console.log('API Response status:', response.status);
            const result = await response.json();
            console.log('API Response data:', result);
            
            if (response.ok && result.success) {
                // Show success message
                showSuccessMessage(result.message);
                
                // Log successful submission
                console.log('Form submitted successfully:', { 
                    name: formData.name, 
                    email: formData.email,
                    timestamp: new Date().toISOString()
                });
            } else {
                throw new Error(result.error || `Server error: ${response.status}`);
            }
            
        } catch (error) {
            console.error('Error sending message:', error);
            
            // Show user-friendly error message
            showErrorMessage(error.message);
            
            // Reset button state
            if (submitButton) {
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }
        }
    });
}

// Show success message
function showSuccessMessage(message) {
    const formElement = document.querySelector('.contact-form');
    formElement.innerHTML = `
        <div class="form-success">
            <div style="text-align: center; margin-bottom: 1rem;">
                <span style="font-size: 3rem; color: #28a745;">✅</span>
            </div>
            <h3>Message Sent Successfully!</h3>
            <p>${message || "Thank you for your message! I'll get back to you as soon as possible."}</p>
            <button class="btn btn-primary" onclick="resetContactForm()">Send Another Message</button>
        </div>
    `;
}

// Show error message
function showErrorMessage(errorMessage) {
    const formElement = document.querySelector('.contact-form');
    
    // Create error banner
    const errorBanner = document.createElement('div');
    errorBanner.className = 'error-banner';
    errorBanner.style.cssText = `
        background-color: #f8d7da;
        color: #721c24;
        padding: 0.75rem;
        margin-bottom: 1rem;
        border: 1px solid #f5c6cb;
        border-radius: 4px;
        font-size: 0.9rem;
    `;
    errorBanner.innerHTML = `
        <strong>Error:</strong> ${errorMessage || 'Failed to send message. Please try again or contact me directly.'}
    `;
    
    // Add error banner to top of form
    formElement.insertBefore(errorBanner, formElement.firstChild);
    
    // Remove error banner after 5 seconds
    setTimeout(() => {
        if (errorBanner.parentNode) {
            errorBanner.remove();
        }
    }, 5000);
}

// Reset contact form after submission
function resetContactForm() {
    const formElement = document.querySelector('.contact-form');
    formElement.innerHTML = `
        <div class="form-group">
            <label for="name">Name</label>
            <input type="text" id="name" name="name" required>
        </div>
        <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" required>
        </div>
        <div class="form-group">
            <label for="message">Message</label>
            <textarea id="message" name="message" rows="5" required></textarea>
        </div>
        <button type="submit" class="btn btn-primary">Send Message</button>
    `;
    
    // Re-attach the event listener using the same safe FormData method
    const newContactForm = document.getElementById('contactForm');
    if (newContactForm) {
        newContactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Show loading state
            const submitButton = newContactForm.querySelector('button[type="submit"]');
            const originalText = submitButton?.textContent || 'Send Message';
            if (submitButton) {
                submitButton.textContent = 'Sending...';
                submitButton.disabled = true;
            }
            
            // Get form data using FormData (consistent with main handler)
            const formDataObj = new FormData(newContactForm);
            const formData = {
                name: formDataObj.get('name')?.trim() || '',
                email: formDataObj.get('email')?.trim() || '',
                message: formDataObj.get('message')?.trim() || ''
            };
            
            console.log('Reset form data collected:', formData);
            
            // Basic validation
            if (!formData.name || !formData.email || !formData.message) {
                alert('Please fill in all fields.');
                if (submitButton) {
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                }
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                alert('Please enter a valid email address.');
                if (submitButton) {
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                }
                return;
            }
            
            try {
                console.log('Reset form sending to API:', API_URL);
                
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });
                
                console.log('Reset form API Response status:', response.status);
                const result = await response.json();
                console.log('Reset form API Response data:', result);
                
                if (response.ok && result.success) {
                    showSuccessMessage(result.message);
                    console.log('Reset form submitted successfully:', { 
                        name: formData.name, 
                        email: formData.email,
                        timestamp: new Date().toISOString()
                    });
                } else {
                    throw new Error(result.error || `Server error: ${response.status}`);
                }
                
            } catch (error) {
                console.error('Reset form error:', error);
                showErrorMessage(error.message);
                if (submitButton) {
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                }
            }
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70, // Offset for navbar
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Highlight active section in navigation
    function highlightActiveSection() {
        const sections = document.querySelectorAll('section');
        const navItems = document.querySelectorAll('.nav-links ul li a');
        
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${current}`) {
                item.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', highlightActiveSection);
    
    // Console log for debugging
    console.log('Portfolio website loaded successfully');
    console.log('API URL configured:', API_URL);
    console.log('Contact form found:', !!document.getElementById('contactForm'));
});
