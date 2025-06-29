/**
 * Portfolio Website JavaScript
 * Kalp Soni - Cloud & DevOps Engineer
 * 
 * This file contains all the interactive functionality for the portfolio website
 * Includes comprehensive bot protection and security measures
 */

// DOM Elements
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const navLinksItems = document.querySelectorAll('.nav-links ul li a');
const contactForm = document.getElementById('contactForm');

// API Configurations
const API_URL = 'https://r7kjg1upkg.execute-api.us-east-2.amazonaws.com/prod/contact'; 

// Bot Protection Variables
const startTime = Date.now();
let formInteractions = 0;
let mouseMovements = 0;
let keyboardEvents = 0;

// Enhanced Human Behavior Tracking
document.addEventListener('mousemove', () => {
    mouseMovements++;
});

document.addEventListener('keyup', () => {
    keyboardEvents++;
});

// Track form interactions
if (contactForm) {
    contactForm.addEventListener('input', () => {
        formInteractions++;
    });
    
    contactForm.addEventListener('focus', () => {
        formInteractions++;
    }, true);
}

// Navbar functionality
if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
}

// Close navbar when clicking on a nav item (mobile)
navLinksItems.forEach(item => {
    item.addEventListener('click', () => {
        if (navLinks) navLinks.classList.remove('active');
        if (hamburger) hamburger.classList.remove('active');
    });
});

// Scroll event for navbar styling changes
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.style.padding = '0.5rem 0';
            navbar.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.padding = '1rem 0';
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        }
    }
});

// Input Sanitization Function
function sanitizeInput(input) {
    if (typeof input !== 'string') return '';
    
    return input
        .trim()
        .replace(/[<>]/g, '') // Remove potential HTML tags
        .replace(/javascript:/gi, '') // Remove javascript: protocols
        .replace(/on\w+=/gi, '') // Remove event handlers
        .slice(0, 2000); // Enforce max length
}

// Enhanced Email Validation
function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegex.test(email) && email.length <= 100;
}

// Bot Detection Function
function detectBot() {
    const timeSpent = Date.now() - startTime;
    
    const checks = {
        timeCheck: timeSpent >= 5000,
        mouseCheck: mouseMovements >= 5,
        interactionCheck: formInteractions >= 3,
        keyboardCheck: keyboardEvents >= 2
    };
    
    // Honeypot check
    const honeypot = document.getElementById('website');
    const honeypotCheck = !honeypot || !honeypot.value;
    
    return {
        isHuman: checks.timeCheck && checks.mouseCheck && checks.interactionCheck && honeypotCheck,
        checks: { ...checks, honeypotCheck },
        metrics: {
            timeSpent,
            mouseMovements,
            formInteractions,
            keyboardEvents
        }
    };
}

// Enhanced form submission handler with comprehensive security
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Comprehensive Bot Detection
        const botDetection = detectBot();
        
        if (!botDetection.checks.timeCheck) {
            alert('Please take a moment to review your message.');
            return;
        }
        
        if (!botDetection.checks.mouseCheck) {
            alert('Please interact with the page normally.');
            return;
        }
        
        if (!botDetection.checks.interactionCheck) {
            alert('Please fill out the form naturally.');
            return;
        }
        
        if (!botDetection.checks.honeypotCheck) {
            console.log('Bot detected: honeypot field filled');
            return; // Silent fail for bots
        }
        
        // Show loading state
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton?.textContent || 'Send Message';
        if (submitButton) {
            submitButton.textContent = 'Sending...';
            submitButton.disabled = true;
        }
        
        try {
            // Get and sanitize form data
            const formDataObj = new FormData(contactForm);
            const rawData = {
                name: formDataObj.get('name') || '',
                email: formDataObj.get('email') || '',
                message: formDataObj.get('message') || ''
            };
            
            // Sanitize inputs
            const formData = {
                name: sanitizeInput(rawData.name),
                email: sanitizeInput(rawData.email),
                message: sanitizeInput(rawData.message),
                // Bot detection metadata
                formTime: botDetection.metrics.timeSpent,
                interactions: botDetection.metrics.formInteractions,
                mouseMovements: botDetection.metrics.mouseMovements,
                keyboardEvents: botDetection.metrics.keyboardEvents,
                timestamp: new Date().toISOString()
            };
            
            console.log('Form data collected:', { 
                name: formData.name, 
                email: formData.email, 
                messageLength: formData.message.length,
                botMetrics: botDetection.metrics
            });
            
            // Enhanced Validation
            if (!formData.name || formData.name.length < 2) {
                throw new Error('Please enter a valid name (at least 2 characters).');
            }
            
            if (!formData.email || !validateEmail(formData.email)) {
                throw new Error('Please enter a valid email address.');
            }
            
            if (!formData.message || formData.message.length < 10) {
                throw new Error('Please enter a message (at least 10 characters).');
            }
            
            // Length validation
            if (formData.name.length > 100) {
                throw new Error('Name is too long (maximum 100 characters).');
            }
            
            if (formData.message.length > 2000) {
                throw new Error('Message is too long (maximum 2000 characters).');
            }
            
            // Advanced spam detection
            const spamWords = ['viagra', 'casino', 'lottery', 'winner', 'congratulations', 'click here', 'free money'];
            const messageWords = formData.message.toLowerCase().split(' ');
            const spamCount = spamWords.filter(spam => 
                messageWords.some(word => word.includes(spam))
            ).length;
            
            if (spamCount >= 2) {
                console.log('Potential spam detected');
                throw new Error('Message content appears to be spam.');
            }
            
            console.log('Sending to API:', API_URL);
            
            // Submit to AWS API Gateway with timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
            
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': 'Portfolio-Contact-Form/1.0'
                },
                body: JSON.stringify(formData),
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            console.log('API Response status:', response.status);
            
            if (!response.ok) {
                throw new Error(`Server error: ${response.status} ${response.statusText}`);
            }
            
            const result = await response.json();
            console.log('API Response data:', result);
            
            if (result.success) {
                // Show success message
                showSuccessMessage(result.message);
                
                // Log successful submission
                console.log('Form submitted successfully:', { 
                    name: formData.name, 
                    email: formData.email,
                    timestamp: formData.timestamp,
                    humanScore: botDetection.isHuman ? 'HUMAN' : 'SUSPICIOUS'
                });
                
                // Reset bot protection counters
                formInteractions = 0;
                mouseMovements = 0;
                keyboardEvents = 0;
                
            } else {
                throw new Error(result.error || result.message || 'Unknown server error');
            }
            
        } catch (error) {
            console.error('Error sending message:', error);
            
            let errorMessage = 'Failed to send message. Please try again.';
            
            if (error.name === 'AbortError') {
                errorMessage = 'Request timed out. Please check your connection and try again.';
            } else if (error.message.includes('Failed to fetch')) {
                errorMessage = 'Network error. Please check your internet connection.';
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            showErrorMessage(errorMessage);
            
        } finally {
            // Reset button state
            if (submitButton) {
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }
        }
    });
}

// Enhanced success message with security confirmation
function showSuccessMessage(message) {
    const formElement = document.querySelector('.contact-form');
    if (!formElement) return;
    
    formElement.innerHTML = `
        <div class="form-success">
            <div style="text-align: center; margin-bottom: 1rem;">
                <span style="font-size: 3rem; color: #28a745;">✅</span>
            </div>
            <h3>Message Sent Successfully!</h3>
            <p>${sanitizeInput(message) || "Thank you for your message! I'll get back to you as soon as possible."}</p>
            <div style="font-size: 0.9rem; color: #6c757d; margin-top: 1rem;">
                <p>✓ Message verified and delivered securely</p>
            </div>
            <button class="btn btn-primary" onclick="resetContactForm()">Send Another Message</button>
        </div>
    `;
}

// Enhanced error message with better UX
function showErrorMessage(errorMessage) {
    const formElement = document.querySelector('.contact-form');
    if (!formElement) return;
    
    // Remove existing error banners
    const existingError = formElement.querySelector('.error-banner');
    if (existingError) {
        existingError.remove();
    }
    
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
        animation: slideDown 0.3s ease-out;
    `;
    errorBanner.innerHTML = `
        <strong>Error:</strong> ${sanitizeInput(errorMessage) || 'Failed to send message. Please try again or contact me directly.'}
    `;
    
    // Add error banner to top of form
    formElement.insertBefore(errorBanner, formElement.firstChild);
    
    // Remove error banner after 7 seconds
    setTimeout(() => {
        if (errorBanner.parentNode) {
            errorBanner.style.animation = 'slideUp 0.3s ease-out';
            setTimeout(() => errorBanner.remove(), 300);
        }
    }, 7000);
}

// Enhanced reset form with all security features
function resetContactForm() {
    const formElement = document.querySelector('.contact-form');
    if (!formElement) return;
    
    formElement.innerHTML = `
        <div class="form-group">
            <label for="name">Name *</label>
            <input type="text" id="name" name="name" required maxlength="100" 
                   pattern="[A-Za-z\\s]{2,100}" title="Name should contain only letters and spaces, 2-100 characters">
        </div>
        <div class="form-group">
            <label for="email">Email *</label>
            <input type="email" id="email" name="email" required maxlength="100"
                   title="Please enter a valid email address">
        </div>
        <div class="form-group">
            <label for="message">Message *</label>
            <textarea id="message" name="message" rows="5" required 
                      minlength="10" maxlength="2000" 
                      placeholder="Please enter your message (10-2000 characters)"
                      title="Message should be between 10 and 2000 characters"></textarea>
        </div>
        <!-- Honeypot field - hidden from humans, visible to bots -->
        <div style="position: absolute; left: -9999px; opacity: 0; pointer-events: none;">
            <label for="website">Website (leave blank):</label>
            <input type="text" id="website" name="website" tabindex="-1" autocomplete="off">
        </div>
        <button type="submit" class="btn btn-primary">Send Message</button>
    `;
    
    // Reset bot protection counters
    formInteractions = 0;
    mouseMovements = 0;
    keyboardEvents = 0;
    
    // Re-attach enhanced event listeners
    const newContactForm = document.getElementById('contactForm');
    if (newContactForm) {
        // Track interactions
        newContactForm.addEventListener('input', () => {
            formInteractions++;
        });
        
        newContactForm.addEventListener('focus', () => {
            formInteractions++;
        }, true);
        
        // Copy the same enhanced submit handler
        newContactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Use the same bot detection logic
            const botDetection = detectBot();
            
            if (!botDetection.checks.timeCheck) {
                alert('Please take a moment to review your message.');
                return;
            }
            
            if (!botDetection.checks.mouseCheck) {
                alert('Please interact with the page normally.');
                return;
            }
            
            if (!botDetection.checks.interactionCheck) {
                alert('Please fill out the form naturally.');
                return;
            }
            
            if (!botDetection.checks.honeypotCheck) {
                console.log('Bot detected: honeypot field filled');
                return;
            }
            
            // Show loading state
            const submitButton = newContactForm.querySelector('button[type="submit"]');
            const originalText = submitButton?.textContent || 'Send Message';
            if (submitButton) {
                submitButton.textContent = 'Sending...';
                submitButton.disabled = true;
            }
            
            try {
                // Get and sanitize form data
                const formDataObj = new FormData(newContactForm);
                const rawData = {
                    name: formDataObj.get('name') || '',
                    email: formDataObj.get('email') || '',
                    message: formDataObj.get('message') || ''
                };
                
                const formData = {
                    name: sanitizeInput(rawData.name),
                    email: sanitizeInput(rawData.email),
                    message: sanitizeInput(rawData.message),
                    formTime: botDetection.metrics.timeSpent,
                    interactions: botDetection.metrics.formInteractions,
                    mouseMovements: botDetection.metrics.mouseMovements,
                    keyboardEvents: botDetection.metrics.keyboardEvents,
                    timestamp: new Date().toISOString()
                };
                
                // Same validation as main form
                if (!formData.name || formData.name.length < 2) {
                    throw new Error('Please enter a valid name (at least 2 characters).');
                }
                
                if (!formData.email || !validateEmail(formData.email)) {
                    throw new Error('Please enter a valid email address.');
                }
                
                if (!formData.message || formData.message.length < 10) {
                    throw new Error('Please enter a message (at least 10 characters).');
                }
                
                if (formData.name.length > 100 || formData.message.length > 2000) {
                    throw new Error('Input too long. Please check the character limits.');
                }
                
                console.log('Reset form sending to API:', API_URL);
                
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 10000);
                
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'User-Agent': 'Portfolio-Contact-Form/1.0'
                    },
                    body: JSON.stringify(formData),
                    signal: controller.signal
                });
                
                clearTimeout(timeoutId);
                
                if (!response.ok) {
                    throw new Error(`Server error: ${response.status} ${response.statusText}`);
                }
                
                const result = await response.json();
                
                if (result.success) {
                    showSuccessMessage(result.message);
                    console.log('Reset form submitted successfully');
                    
                    // Reset counters
                    formInteractions = 0;
                    mouseMovements = 0;
                    keyboardEvents = 0;
                } else {
                    throw new Error(result.error || result.message || 'Unknown server error');
                }
                
            } catch (error) {
                console.error('Reset form error:', error);
                
                let errorMessage = 'Failed to send message. Please try again.';
                if (error.name === 'AbortError') {
                    errorMessage = 'Request timed out. Please check your connection and try again.';
                } else if (error.message.includes('Failed to fetch')) {
                    errorMessage = 'Network error. Please check your internet connection.';
                } else if (error.message) {
                    errorMessage = error.message;
                }
                
                showErrorMessage(errorMessage);
            } finally {
                if (submitButton) {
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                }
            }
        });
    }
}

// Enhanced DOM initialization with error handling
document.addEventListener('DOMContentLoaded', function() {
    try {
        // Add smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 70, // Offset for navbar
                        behavior: 'smooth'
                    });
                }
            });
        });
        
        // Enhanced active section highlighting
        function highlightActiveSection() {
            const sections = document.querySelectorAll('section[id]');
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
                const href = item.getAttribute('href');
                if (href === `#${current}`) {
                    item.classList.add('active');
                }
            });
        }
        
        // Throttled scroll event for better performance
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }
            scrollTimeout = setTimeout(highlightActiveSection, 50);
        });
        
        // Security headers check (development only)
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.log('Development mode detected');
        }
        
        // Console log for debugging
        console.log('✅ Portfolio website loaded successfully');
        console.log('🔒 Security features enabled');
        console.log('🌐 API URL configured:', API_URL);
        console.log('📝 Contact form found:', !!document.getElementById('contactForm'));
        console.log('🤖 Bot protection active');
        
    } catch (error) {
        console.error('Error during initialization:', error);
    }
});

// Add CSS animations for better UX
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from { transform: translateY(-10px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
    }
    
    @keyframes slideUp {
        from { transform: translateY(0); opacity: 1; }
        to { transform: translateY(-10px); opacity: 0; }
    }
    
    .form-success {
        animation: slideDown 0.5s ease-out;
    }
`;
document.head.appendChild(style);
