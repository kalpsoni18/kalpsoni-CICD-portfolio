/**
 * Portfolio Website JavaScript - Optimized Version
 * Kalp Soni - Cloud & DevOps Engineer
 * 
 * Optimized for performance, maintainability, and security
 */

// Configuration
const CONFIG = {
    API_URL: 'https://r7kjg1upkg.execute-api.us-east-2.amazonaws.com/prod/contact',
    THROTTLE_DELAYS: {
        MOUSE: 100,
        KEYBOARD: 200,
        SCROLL: 16,
        HIGHLIGHT: 100
    },
    BOT_DETECTION: {
        MIN_TIME: 5000,
        MIN_MOUSE_MOVEMENTS: 5,
        MIN_TOUCH_EVENTS: 3,
        MIN_SCROLL_EVENTS: 2,
        MIN_FORM_INTERACTIONS: 6,
        MIN_KEYBOARD_EVENTS: 2
    },
    VALIDATION: {
        MAX_NAME_LENGTH: 100,
        MAX_EMAIL_LENGTH: 100,
        MAX_MESSAGE_LENGTH: 2000,
        MIN_MESSAGE_LENGTH: 10
    }
};

// Bot Protection State
const botState = {
    startTime: Date.now(),
    formInteractions: 0,
    mouseMovements: 0,
    touchEvents: 0,
    scrollEvents: 0,
    keyboardEvents: 0
};

// Utility Functions
const Utils = {
    // Throttling utility
    throttle: (func, delay) => {
        let timeoutId;
        let lastExecTime = 0;
        return function (...args) {
            const currentTime = Date.now();
            if (currentTime - lastExecTime > delay) {
                func.apply(this, args);
                lastExecTime = currentTime;
            } else {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    func.apply(this, args);
                    lastExecTime = Date.now();
                }, delay - (currentTime - lastExecTime));
            }
        };
    },

    // Debouncing utility
    debounce: (func, delay) => {
        let timeoutId;
        return function (...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    },

    // Safe DOM element getters
    getElement: (id) => {
        try {
            return document.getElementById(id);
        } catch (error) {
            console.error('Error getting element:', id, error);
            return null;
        }
    },

    getElements: (selector) => {
        try {
            return document.querySelectorAll(selector);
        } catch (error) {
            console.error('Error getting elements:', selector, error);
            return [];
        }
    },

    // Safe event listener attachment
    safeAddEventListener: (element, event, handler, options = false) => {
        if (element && typeof element.addEventListener === 'function') {
            try {
                element.addEventListener(event, handler, options);
                return true;
            } catch (error) {
                console.error('Error adding event listener:', error);
                return false;
            }
        }
        return false;
    },

    // Input sanitization
    sanitizeInput: (input) => {
        if (typeof input !== 'string') return '';
        
        try {
            return input
                .trim()
                .replace(/[<>]/g, '')
                .replace(/javascript:/gi, '')
                .replace(/on\w+=/gi, '')
                .replace(/data:/gi, '')
                .slice(0, CONFIG.VALIDATION.MAX_MESSAGE_LENGTH);
        } catch (error) {
            console.error('Error sanitizing input:', error);
            return '';
        }
    },

    // Email validation
    validateEmail: (email) => {
        try {
            const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
            return emailRegex.test(email) && email.length <= CONFIG.VALIDATION.MAX_EMAIL_LENGTH && email.length >= 5;
        } catch (error) {
            console.error('Error validating email:', error);
            return false;
        }
    }
};

// Event Tracking System
const EventTracker = {
    init: () => {
        // Mouse movement tracking
        Utils.safeAddEventListener(document, 'mousemove', Utils.throttle(() => {
            botState.mouseMovements++;
        }, CONFIG.THROTTLE_DELAYS.MOUSE));
        
        // Keyboard tracking
        Utils.safeAddEventListener(document, 'keyup', Utils.throttle(() => {
            botState.keyboardEvents++;
        }, CONFIG.THROTTLE_DELAYS.KEYBOARD));
        
        // Touch tracking
        Utils.safeAddEventListener(document, 'touchstart', () => {
            botState.touchEvents++;
        });
        
        // Scroll tracking
        Utils.safeAddEventListener(document, 'scroll', Utils.throttle(() => {
            botState.scrollEvents++;
        }, CONFIG.THROTTLE_DELAYS.SCROLL));
    }
};

// Bot Detection System
const BotDetection = {
    detect: () => {
        try {
            const timeSpent = Date.now() - botState.startTime;
            
            const checks = {
                timeCheck: timeSpent >= CONFIG.BOT_DETECTION.MIN_TIME,
                mouseCheck: (botState.mouseMovements >= CONFIG.BOT_DETECTION.MIN_MOUSE_MOVEMENTS) || 
                           (botState.touchEvents >= CONFIG.BOT_DETECTION.MIN_TOUCH_EVENTS) || 
                           (botState.scrollEvents >= CONFIG.BOT_DETECTION.MIN_SCROLL_EVENTS) || 
                           (botState.formInteractions >= CONFIG.BOT_DETECTION.MIN_FORM_INTERACTIONS),
                interactionCheck: botState.formInteractions >= 3,
                keyboardCheck: botState.keyboardEvents >= 2
            };

            // Honeypot check
            let honeypotCheck = true;
            try {
                const honeypot = Utils.getElement('website');
                honeypotCheck = !honeypot || !honeypot.value;
            } catch (error) {
                console.error('Error checking honeypot:', error);
            }
            
            return {
                isHuman: checks.timeCheck && checks.mouseCheck && checks.interactionCheck && honeypotCheck,
                checks: { ...checks, honeypotCheck },
                metrics: {
                    timeSpent,
                    mouseMovements: botState.mouseMovements,
                    formInteractions: botState.formInteractions,
                    keyboardEvents: botState.keyboardEvents
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
};

// DOM Elements Manager
const DOMElements = {
    hamburger: null,
    navLinks: null,
    navLinksItems: [],
    contactForm: null,

    init: () => {
        DOMElements.hamburger = Utils.getElement('hamburger');
        DOMElements.navLinks = Utils.getElement('navLinks');
        DOMElements.navLinksItems = Utils.getElements('.nav-links ul li a');
        DOMElements.contactForm = Utils.getElement('contactForm');
        
        console.log('Elements initialized:', {
            hamburger: !!DOMElements.hamburger,
            navLinks: !!DOMElements.navLinks,
            navLinksItems: DOMElements.navLinksItems.length,
            contactForm: !!DOMElements.contactForm
        });
    }
};

// Navigation System
const Navigation = {
    init: () => {
        // Hamburger menu functionality
        if (DOMElements.hamburger && DOMElements.navLinks) {
            Utils.safeAddEventListener(DOMElements.hamburger, 'click', () => {
                try {
                    DOMElements.navLinks.classList.toggle('active');
                    DOMElements.hamburger.classList.toggle('active');
                } catch (error) {
                    console.error('Error toggling navbar:', error);
                }
            });
        }

        // Close navbar when clicking on nav items (mobile)
        DOMElements.navLinksItems.forEach(item => {
            Utils.safeAddEventListener(item, 'click', () => {
                try {
                    if (DOMElements.navLinks) DOMElements.navLinks.classList.remove('active');
                    if (DOMElements.hamburger) DOMElements.hamburger.classList.remove('active');
                } catch (error) {
                    console.error('Error closing navbar:', error);
                }
            });
        });
    },

    // Scroll effects for navbar
    initScrollEffects: () => {
        Utils.safeAddEventListener(window, 'scroll', Utils.debounce(() => {
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
        }, 16));
    },

    // Smooth scrolling
    initSmoothScrolling: () => {
        try {
            // Add smooth scrolling for anchor links
            Utils.getElements('a[href^="#"]').forEach(anchor => {
                Utils.safeAddEventListener(anchor, 'click', function(e) {
                    e.preventDefault();
                    
                    const targetId = this.getAttribute('href');
                    if (targetId === '#') return;
                    
                    const targetElement = document.querySelector(targetId);
                    
                    if (targetElement) {
                        window.scrollTo({
                            top: targetElement.offsetTop - 70,
                            behavior: 'smooth'
                        });
                    }
                });
            });
            
            // Active section highlighting
            const highlightActiveSection = Utils.debounce(() => {
                try {
                    const sections = Utils.getElements('section[id]');
                    const navItems = Utils.getElements('.nav-links ul li a');
                    
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
            }, CONFIG.THROTTLE_DELAYS.HIGHLIGHT);
            
            Utils.safeAddEventListener(window, 'scroll', highlightActiveSection);
        } catch (error) {
            console.error('Error initializing smooth scrolling:', error);
        }
    }
};

// Form Management System
const FormManager = {
    initFormTracking: () => {
        if (DOMElements.contactForm) {
            Utils.safeAddEventListener(DOMElements.contactForm, 'input', () => {
                botState.formInteractions++;
            });
            
            Utils.safeAddEventListener(DOMElements.contactForm, 'focus', () => {
                botState.formInteractions++;
            }, true);
            
            console.log('Form tracking initialized');
        }
    },

    initFormSubmission: () => {
        if (!DOMElements.contactForm) {
            console.warn('Contact form not found');
            return;
        }

        Utils.safeAddEventListener(DOMElements.contactForm, 'submit', async (e) => {
            e.preventDefault();
            
            const submitButton = DOMElements.contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton?.textContent || 'Send Message';
            
            try {
                // Bot Detection
                const botDetection = BotDetection.detect();
                
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
                if (submitButton) {
                    submitButton.textContent = 'Sending...';
                    submitButton.disabled = true;
                    submitButton.style.opacity = '0.7';
                }
                
                // Get and sanitize form data
                const formDataObj = new FormData(DOMElements.contactForm);
                const formData = {
                    name: Utils.sanitizeInput(formDataObj.get('name') || ''),
                    email: Utils.sanitizeInput(formDataObj.get('email') || '').toLowerCase(),
                    message: Utils.sanitizeInput(formDataObj.get('message') || ''),
                    formTime: botDetection.metrics.timeSpent,
                    interactions: botDetection.metrics.formInteractions,
                    mouseMovements: botDetection.metrics.mouseMovements,
                    keyboardEvents: botDetection.metrics.keyboardEvents,
                    timestamp: new Date().toISOString(),
                    userAgent: navigator.userAgent
                };
                
                // Validation
                if (!formData.name || formData.name.length < 2) {
                    throw new Error('Please enter a valid name (at least 2 characters).');
                }
                
                if (!formData.email || !Utils.validateEmail(formData.email)) {
                    throw new Error('Please enter a valid email address.');
                }
                
                if (!formData.message || formData.message.length < CONFIG.VALIDATION.MIN_MESSAGE_LENGTH) {
                    throw new Error(`Please enter a message (at least ${CONFIG.VALIDATION.MIN_MESSAGE_LENGTH} characters).`);
                }
                
                if (formData.name.length > CONFIG.VALIDATION.MAX_NAME_LENGTH) {
                    throw new Error(`Name is too long (maximum ${CONFIG.VALIDATION.MAX_NAME_LENGTH} characters).`);
                }
                
                if (formData.message.length > CONFIG.VALIDATION.MAX_MESSAGE_LENGTH) {
                    throw new Error(`Message is too long (maximum ${CONFIG.VALIDATION.MAX_MESSAGE_LENGTH} characters).`);
                }
                
                // Spam detection
                const spamWords = ['viagra', 'casino', 'lottery', 'winner', 'congratulations', 'click here', 'free money', 'make money fast'];
                const messageWords = formData.message.toLowerCase().split(/\s+/);
                const spamCount = spamWords.filter(spam => 
                    messageWords.some(word => word.includes(spam))
                ).length;
                
                if (spamCount >= 2) {
                    console.log('Potential spam detected');
                    throw new Error('Message content appears to be spam.');
                }
                
                // Submit to API
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 15000);
                
                const response = await fetch(CONFIG.API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'User-Agent': 'Portfolio-Contact-Form/2.0'
                    },
                    body: JSON.stringify(formData),
                    signal: controller.signal
                });
                
                clearTimeout(timeoutId);
                
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
                
                const result = await response.json();
                
                if (result.success) {
                    FormManager.showSuccessMessage(result.message);
                    
                    // Reset bot protection counters
                    botState.formInteractions = 0;
                    botState.mouseMovements = 0;
                    botState.keyboardEvents = 0;
                    
                } else {
                    throw new Error(result.error || result.message || 'Unknown server error');
                }
                
            } catch (error) {
                console.error('Error sending message:', error);
                FormManager.showErrorMessage(error.message || 'Failed to send message. Please try again.');
                
            } finally {
                // Reset button state
                if (submitButton) {
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                    submitButton.style.opacity = '1';
                }
            }
        });
    },

    showSuccessMessage: (message) => {
        const formElement = document.querySelector('.contact-form');
        if (!formElement) return;
        
        try {
            formElement.innerHTML = `
                <div class="form-success">
                    <div style="text-align: center; margin-bottom: 1rem;">
                        <span style="font-size: 3rem; color: #28a745;">✅</span>
                    </div>
                    <h3>Message Sent Successfully!</h3>
                    <p>${Utils.sanitizeInput(message) || "Thank you for your message! I'll get back to you as soon as possible."}</p>
                    <div style="font-size: 0.9rem; color: #6c757d; margin-top: 1rem;">
                        <p>✓ Message verified and delivered securely</p>
                    </div>
                    <button class="btn btn-primary" onclick="FormManager.resetContactForm()">Send Another Message</button>
                </div>
            `;
        } catch (error) {
            console.error('Error showing success message:', error);
        }
    },

    showErrorMessage: (errorMessage) => {
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
                <strong>Error:</strong> ${Utils.sanitizeInput(errorMessage) || 'Failed to send message. Please try again or contact me directly.'}
            `;
            
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
    },

    resetContactForm: () => {
        const formElement = document.querySelector('.contact-form');
        if (!formElement) return;
        
        try {
            formElement.innerHTML = `
                <div class="form-group">
                    <label for="name">Name *</label>
                    <input type="text" id="name" name="name" required maxlength="${CONFIG.VALIDATION.MAX_NAME_LENGTH}" 
                           pattern="[A-Za-z\\s]{2,${CONFIG.VALIDATION.MAX_NAME_LENGTH}}" title="Name should contain only letters and spaces, 2-${CONFIG.VALIDATION.MAX_NAME_LENGTH} characters">
                </div>
                <div class="form-group">
                    <label for="email">Email *</label>
                    <input type="email" id="email" name="email" required maxlength="${CONFIG.VALIDATION.MAX_EMAIL_LENGTH}"
                           title="Please enter a valid email address">
                </div>
                <div class="form-group">
                    <label for="message">Message *</label>
                    <textarea id="message" name="message" rows="5" required 
                              minlength="${CONFIG.VALIDATION.MIN_MESSAGE_LENGTH}" maxlength="${CONFIG.VALIDATION.MAX_MESSAGE_LENGTH}" 
                              placeholder="Please enter your message (${CONFIG.VALIDATION.MIN_MESSAGE_LENGTH}-${CONFIG.VALIDATION.MAX_MESSAGE_LENGTH} characters)"
                              title="Message should be between ${CONFIG.VALIDATION.MIN_MESSAGE_LENGTH} and ${CONFIG.VALIDATION.MAX_MESSAGE_LENGTH} characters"></textarea>
                </div>
                <!-- Honeypot field - hidden from humans, visible to bots -->
                <div style="position: absolute; left: -9999px; opacity: 0; pointer-events: none;">
                    <label for="website">Website (leave blank):</label>
                    <input type="text" id="website" name="website" tabindex="-1" autocomplete="off">
                </div>
                <button type="submit" class="btn btn-primary">Send Message</button>
            `;
            
            // Reset bot protection counters
            botState.formInteractions = 0;
            botState.mouseMovements = 0;
            botState.keyboardEvents = 0;
            
            // Re-initialize form
            DOMElements.contactForm = Utils.getElement('contactForm');
            FormManager.initFormTracking();
            FormManager.initFormSubmission();
            
        } catch (error) {
            console.error('Error resetting form:', error);
        }
    }
};

// CSS Animations
const CSSAnimations = {
    add: () => {
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
};

// Font Awesome Check
const FontAwesomeCheck = {
    init: () => {
        const testIcon = document.createElement('i');
        testIcon.className = 'fas fa-heart';
        testIcon.style.display = 'none';
        document.body.appendChild(testIcon);
        
        setTimeout(() => {
            const computedStyle = window.getComputedStyle(testIcon, ':before');
            if (computedStyle.fontFamily.indexOf('Font Awesome') === -1) {
                console.warn('Font Awesome not loading properly, loading backup');
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = 'https://use.fontawesome.com/releases/v6.5.1/css/all.css';
                document.head.appendChild(link);
            }
            document.body.removeChild(testIcon);
        }, 1000);
    }
};

// Main Application
const App = {
    init: () => {
        try {
            console.log('🚀 Initializing portfolio website...');
            
            // Initialize all systems
            FontAwesomeCheck.init();
            EventTracker.init();
            DOMElements.init();
            Navigation.init();
            Navigation.initScrollEffects();
            Navigation.initSmoothScrolling();
            FormManager.initFormTracking();
            FormManager.initFormSubmission();
            CSSAnimations.add();
            
            // Security check
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                console.log('🔧 Development mode detected');
            }
            
            console.log('✅ Portfolio website loaded successfully');
            console.log('🔒 Security features enabled');
            console.log('🌐 API URL configured:', CONFIG.API_URL);
            console.log('📝 Contact form found:', !!DOMElements.contactForm);
            console.log('🤖 Bot protection active');
            
        } catch (error) {
            console.error('❌ Error during initialization:', error);
            // Fallback initialization
            try {
                DOMElements.init();
                if (DOMElements.contactForm) {
                    FormManager.initFormSubmission();
                }
            } catch (fallbackError) {
                console.error('❌ Fallback initialization failed:', fallbackError);
            }
        }
    }
};

// Global error handlers
window.addEventListener('error', (event) => {
    console.error('Global error caught:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
});

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', App.init);

// Make FormManager.resetContactForm available globally
window.resetContactForm = FormManager.resetContactForm;
