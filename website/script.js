/**
 * Portfolio Website JavaScript - FIXED VERSION
 * Kalp Soni - Cloud & DevOps Engineer
 * 
 * This file contains all the interactive functionality for the portfolio website
 * Includes comprehensive bot protection and security measures
 */

// Immediate Font Awesome check and fallback
(function checkFontAwesome() {
    const testIcon = document.createElement('i');
    testIcon.className = 'fas fa-heart';
    testIcon.style.display = 'none';
    document.body.appendChild(testIcon);
    
    setTimeout(() => {
        const computedStyle = window.getComputedStyle(testIcon, ':before');
        if (computedStyle.fontFamily.indexOf('Font Awesome') === -1) {
            console.warn('Font Awesome not loading properly, loading backup');
            // Load backup Font Awesome
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://use.fontawesome.com/releases/v6.5.1/css/all.css';
            document.head.appendChild(link);
        }
        document.body.removeChild(testIcon);
    }, 1000);
})();

// API Configuration with fallback
const API_URL = 'https://r7kjg1upkg.execute-api.us-east-2.amazonaws.com/prod/contact';

// Bot Protection Variables
const startTime = Date.now();
let formInteractions = 0;
let mouseMovements = 0;
let touchEvents = 0;
let scrollEvents = 0;

document.addEventListener('mousemove', () => {
    mouseMovements++;
});

document.addEventListener('keyup', () => {
    keyboardEvents++;
});

document.addEventListener('touchstart', () => {   // ADD THIS HERE
    touchEvents++;
});

document.addEventListener('scroll', () => {       // ADD THIS HERE
    scrollEvents++;
});


let keyboardEvents = 0;

// Safe DOM element getters
function getElement(id) {
    try {
        return document.getElementById(id);
    } catch (error) {
        console.error('Error getting element:', id, error);
        return null;
    }
}

function getElements(selector) {
    try {
        return document.querySelectorAll(selector);
    } catch (error) {
        console.error('Error getting elements:', selector, error);
        return [];
    }
}

// DOM Elements with safety checks
let hamburger, navLinks, navLinksItems, contactForm;

function initializeElements() {
    hamburger = getElement('hamburger');
    navLinks = getElement('navLinks');
    navLinksItems = getElements('.nav-links ul li a');
    contactForm = getElement('contactForm');
    
    console.log('Elements initialized:', {
        hamburger: !!hamburger,
        navLinks: !!navLinks,
        navLinksItems: navLinksItems.length,
        contactForm: !!contactForm
    });
}

// Enhanced Human Behavior Tracking with throttling
let mouseThrottle = false;
let keyboardThrottle = false;

document.addEventListener('mousemove', () => {
    if (!mouseThrottle) {
        mouseMovements++;
        mouseThrottle = true;
        setTimeout(() => { mouseThrottle = false; }, 100); // Throttle to every 100ms
    }
});

document.addEventListener('keyup', () => {
    if (!keyboardThrottle) {
        keyboardEvents++;
        keyboardThrottle = true;
        setTimeout(() => { keyboardThrottle = false; }, 200); // Throttle to every 200ms
    }
});

// Safe event listener attachment
function safeAddEventListener(element, event, handler) {
    if (element && typeof element.addEventListener === 'function') {
        try {
            element.addEventListener(event, handler);
            return true;
        } catch (error) {
            console.error('Error adding event listener:', error);
            return false;
        }
    }
    return false;
}

// Track form interactions safely
function initializeFormTracking() {
    if (contactForm) {
        safeAddEventListener(contactForm, 'input', () => {
            formInteractions++;
        });
        
        safeAddEventListener(contactForm, 'focus', () => {
            formInteractions++;
        }, true);
        
        console.log('Form tracking initialized');
    }
}

// Navbar functionality with error handling
function initializeNavbar() {
    if (hamburger && navLinks) {
        safeAddEventListener(hamburger, 'click', () => {
            try {
                navLinks.classList.toggle('active');
                hamburger.classList.toggle('active');
            } catch (error) {
                console.error('Error toggling navbar:', error);
            }
        });
    }

    // Close navbar when clicking on a nav item (mobile)
    navLinksItems.forEach(item => {
        safeAddEventListener(item, 'click', () => {
            try {
                if (navLinks) navLinks.classList.remove('active');
                if (hamburger) hamburger.classList.remove('active');
            } catch (error) {
                console.error('Error closing navbar:', error);
            }
        });
    });
}

// Scroll event for navbar styling changes with performance optimization
let scrollTimeout;
function initializeScrollEffects() {
    safeAddEventListener(window, 'scroll', () => {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        
        scrollTimeout = setTimeout(() => {
            try {
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
            } catch (error) {
                console.error('Error in scroll handler:', error);
            }
        }, 16); // ~60fps throttling
    });
}

// Enhanced Input Sanitization
function sanitizeInput(input) {
    if (typeof input !== 'string') return '';
    
    try {
        return input
            .trim()
            .replace(/[<>]/g, '') // Remove potential HTML tags
            .replace(/javascript:/gi, '') // Remove javascript: protocols
            .replace(/on\w+=/gi, '') // Remove event handlers
            .replace(/data:/gi, '') // Remove data: URLs
            .slice(0, 2000); // Enforce max length
    } catch (error) {
        console.error('Error sanitizing input:', error);
        return '';
    }
}

// Enhanced Email Validation with better regex
function validateEmail(email) {
    try {
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        return emailRegex.test(email) && email.length <= 100 && email.length >= 5;
    } catch (error) {
        console.error('Error validating email:', error);
        return false;
    }
}

// Bot Detection Function with enhanced checks
function detectBot() {
    try {
        const timeSpent = Date.now() - startTime;
        
        const checks = {
            timeCheck: timeSpent >= 5000,
            mouseCheck: (mouseMovements >= 5) || (touchEvents >= 3) || (scrollEvents >= 2) || (formInteractions >= 6),
            interactionCheck: formInteractions >= 3,
            keyboardCheck: keyboardEvents >= 2
        };

        // Honeypot check with safety
        let honeypotCheck = true;
        try {
            const honeypot = getElement('website');
            honeypotCheck = !honeypot || !honeypot.value;
        } catch (error) {
            console.error('Error checking honeypot:', error);
        }
        
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
    } catch (error) {
        console.error('Error in bot detection:', error);
        return {
            isHuman: false,
            checks: {},
            metrics: { timeSpent: 0, mouseMovements: 0, formInteractions: 0, keyboardEvents: 0 }
        };
    }
}

// Enhanced form submission handler with better error handling
function initializeFormSubmission() {
    if (!contactForm) {
        console.warn('Contact form not found');
        return;
    }

    safeAddEventListener(contactForm, 'submit', async (e) => {
        e.preventDefault();
        
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton?.textContent || 'Send Message';
        
        try {
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
            if (submitButton) {
                submitButton.textContent = 'Sending...';
                submitButton.disabled = true;
                submitButton.style.opacity = '0.7';
            }
            
            // Get and sanitize form data with better error handling
            let formData;
            try {
                const formDataObj = new FormData(contactForm);
                const rawData = {
                    name: formDataObj.get('name') || '',
                    email: formDataObj.get('email') || '',
                    message: formDataObj.get('message') || ''
                };
                
                // Sanitize inputs
                formData = {
                    name: sanitizeInput(rawData.name),
                    email: sanitizeInput(rawData.email).toLowerCase(),
                    message: sanitizeInput(rawData.message),
                    // Bot detection metadata
                    formTime: botDetection.metrics.timeSpent,
                    interactions: botDetection.metrics.formInteractions,
                    mouseMovements: botDetection.metrics.mouseMovements,
                    keyboardEvents: botDetection.metrics.keyboardEvents,
                    timestamp: new Date().toISOString(),
                    userAgent: navigator.userAgent
                };
            } catch (error) {
                console.error('Error processing form data:', error);
                throw new Error('Failed to process form data');
            }
            
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
            const spamWords = ['viagra', 'casino', 'lottery', 'winner', 'congratulations', 'click here', 'free money', 'make money fast'];
            const messageWords = formData.message.toLowerCase().split(/\s+/);
            const spamCount = spamWords.filter(spam => 
                messageWords.some(word => word.includes(spam))
            ).length;
            
            if (spamCount >= 2) {
                console.log('Potential spam detected');
                throw new Error('Message content appears to be spam.');
            }
            
            console.log('Sending to API:', API_URL);
            
            // Submit to AWS API Gateway with enhanced error handling
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
            
            let response;
            try {
                response = await fetch(API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'User-Agent': 'Portfolio-Contact-Form/2.0'
                    },
                    body: JSON.stringify(formData),
                    signal: controller.signal
                });
            } catch (fetchError) {
                clearTimeout(timeoutId);
                if (fetchError.name === 'AbortError') {
                    throw new Error('Request timed out. Please check your connection and try again.');
                } else if (fetchError.message.includes('Failed to fetch')) {
                    throw new Error('Network error. Please check your internet connection.');
                } else {
                    throw new Error('Connection failed. Please try again.');
                }
            }
            
            clearTimeout(timeoutId);
            
            console.log('API Response status:', response.status);
            
            if (!response.ok) {
                const errorText = await response.text().catch(() => 'Unknown error');
                console.error('API Error Response:', errorText);
                
                if (response.status === 429) {
                    throw new Error('Too many requests. Please wait a moment and try again.');
                } else if (response.status === 403) {
                    throw new Error('Request blocked. Please try again later.');
                } else if (response.status >= 500) {
                    throw new Error('Server error. Please try again in a few minutes.');
                } else {
                    throw new Error(`Server error: ${response.status}`);
                }
            }
            
            let result;
            try {
                result = await response.json();
            } catch (jsonError) {
                console.error('Error parsing response:', jsonError);
                throw new Error('Invalid response from server.');
            }
            
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
            
            if (error.message) {
                errorMessage = error.message;
            }
            
            showErrorMessage(errorMessage);
            
        } finally {
            // Reset button state
            if (submitButton) {
                submitButton.textContent = originalText;
                submitButton.disabled = false;
                submitButton.style.opacity = '1';
            }
        }
    });
}

// Enhanced success message with XSS protection
function showSuccessMessage(message) {
    const formElement = document.querySelector('.contact-form');
    if (!formElement) return;
    
    try {
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
    } catch (error) {
        console.error('Error showing success message:', error);
    }
}

// Enhanced error message with better UX
function showErrorMessage(errorMessage) {
    const formElement = document.querySelector('.contact-form');
    if (!formElement) return;
    
    try {
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
                setTimeout(() => {
                    try {
                        errorBanner.remove();
                    } catch (e) {
                        // Element already removed
                    }
                }, 300);
            }
        }, 7000);
    } catch (error) {
        console.error('Error showing error message:', error);
    }
}

// Enhanced reset form function
function resetContactForm() {
    const formElement = document.querySelector('.contact-form');
    if (!formElement) return;
    
    try {
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
        
        // Re-initialize form for the new elements
        contactForm = getElement('contactForm');
        initializeFormTracking();
        initializeFormSubmission();
        
    } catch (error) {
        console.error('Error resetting form:', error);
    }
}

// Enhanced smooth scrolling and active section highlighting
function initializeSmoothScrolling() {
    try {
        // Add smooth scrolling for anchor links
        getElements('a[href^="#"]').forEach(anchor => {
            safeAddEventListener(anchor, 'click', function(e) {
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
        
        // Enhanced active section highlighting with throttling
        function highlightActiveSection() {
            try {
                const sections = getElements('section[id]');
                const navItems = getElements('.nav-links ul li a');
                
                let current = '';
                
                sections.forEach(section => {
                    const sectionTop = section.offsetTop;
                    
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
            } catch (error) {
                console.error('Error highlighting active section:', error);
            }
        }
        
        // Throttled scroll event for better performance
        let highlightTimeout;
        safeAddEventListener(window, 'scroll', () => {
            if (highlightTimeout) {
                clearTimeout(highlightTimeout);
            }
            highlightTimeout = setTimeout(highlightActiveSection, 100);
        });
    } catch (error) {
        console.error('Error initializing smooth scrolling:', error);
    }
}

// Add CSS animations
function addCSSAnimations() {
    try {
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
            
            .error-banner {
                animation: slideDown 0.3s ease-out;
            }
        `;
        document.head.appendChild(style);
    } catch (error) {
        console.error('Error adding CSS animations:', error);
    }
}

// Enhanced DOM initialization with comprehensive error handling
document.addEventListener('DOMContentLoaded', function() {
    try {
        console.log('🚀 Initializing portfolio website...');
        
        // Initialize elements first
        initializeElements();
        
        // Initialize all functionality
        initializeFormTracking();
        initializeNavbar();
        initializeScrollEffects();
        initializeFormSubmission();
        initializeSmoothScrolling();
        addCSSAnimations();
        
        // Security check
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.log('🔧 Development mode detected');
        }
        
        // Final status report
        console.log('✅ Portfolio website loaded successfully');
        console.log('🔒 Security features enabled');
        console.log('🌐 API URL configured:', API_URL);
        console.log('📝 Contact form found:', !!contactForm);
        console.log('🤖 Bot protection active');
        console.log('📊 Initial metrics:', {
            mouseMovements,
            formInteractions,
            keyboardEvents,
            timeElapsed: Date.now() - startTime
        });
        
    } catch (error) {
        console.error('❌ Error during initialization:', error);
        // Even if there are errors, try to make basic functionality work
        try {
            initializeElements();
            if (contactForm) {
                initializeFormSubmission();
            }
        } catch (fallbackError) {
            console.error('❌ Fallback initialization failed:', fallbackError);
        }
    }
});

// Global error handler
window.addEventListener('error', function(event) {
    console.error('Global error caught:', event.error);
});

// Unhandled promise rejection handler
window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled promise rejection:', event.reason);
});

// Make resetContactForm available globally
window.resetContactForm = resetContactForm;
