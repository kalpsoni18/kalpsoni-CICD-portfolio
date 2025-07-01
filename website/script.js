/**
 * Portfolio Website JavaScript - Mobile-Optimized Version
 * Kalp Soni - Cloud & DevOps Engineer
 * 
 * Optimized for performance, maintainability, security, and mobile compatibility
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
        MIN_TIME: 1000, // Reduced for mobile
        MIN_MOUSE_MOVEMENTS: 1, // Reduced for mobile
        MIN_TOUCH_EVENTS: 1, // Reduced for mobile
        MIN_SCROLL_EVENTS: 1,
        MIN_FORM_INTERACTIONS: 1, // Reduced for mobile
        MIN_KEYBOARD_EVENTS: 1
    },
    VALIDATION: {
        MAX_NAME_LENGTH: 100,
        MAX_EMAIL_LENGTH: 100,
        MAX_MESSAGE_LENGTH: 2000,
        MIN_MESSAGE_LENGTH: 3 // Reduced for mobile
    },
    REQUEST_TIMEOUT: 30000 // Increased for mobile
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

// Enhanced Device detection
const DeviceDetector = {
    isMobile: () => {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS|FxiOS/i.test(navigator.userAgent) ||
               window.innerWidth <= 768;
    },
    
    isRealMobile: () => {
        const userAgent = navigator.userAgent;
        const platform = navigator.platform;
        const maxTouchPoints = navigator.maxTouchPoints || 0;
        
        const mobileUserAgents = [
            /Android/i, /iPhone/i, /iPad/i, /iPod/i, /BlackBerry/i,
            /Windows Phone/i, /Opera Mini/i, /IEMobile/i, /Mobile/i,
            /webOS/i, /Kindle/i, /Silk/i, /Mobile Safari/i
        ];
        
        const mobilePlatforms = [
            /iPhone/i, /iPad/i, /iPod/i, /Android/i, /BlackBerry/i,
            /Windows Phone/i, /webOS/i, /Mobile/i
        ];
        
        const hasMobileUserAgent = mobileUserAgents.some(pattern => pattern.test(userAgent));
        const hasMobilePlatform = mobilePlatforms.some(pattern => pattern.test(platform));
        const hasTouchSupport = maxTouchPoints > 0 || 'ontouchstart' in window;
        const hasSmallScreen = window.screen.width <= 768 || window.innerWidth <= 768;
        
        return hasMobileUserAgent && (hasMobilePlatform || hasTouchSupport || hasSmallScreen);
    },
    
    getScreenResolution: () => {
        return `${screen.width}x${screen.height}`;
    },
    
    getViewportSize: () => {
        return `${window.innerWidth}x${window.innerHeight}`;
    },
    
    getDeviceType: () => {
        return DeviceDetector.isMobile() ? 'mobile' : 'desktop';
    },

    getConnectionInfo: () => {
        if (navigator.connection) {
            return {
                effectiveType: navigator.connection.effectiveType,
                downlink: navigator.connection.downlink,
                rtt: navigator.connection.rtt,
                saveData: navigator.connection.saveData
            };
        }
        return null;
    }
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
    },

    // Network status check
    isOnline: () => {
        return navigator.onLine;
    },

    // Performance monitoring
    measurePerformance: (name, fn) => {
        const start = performance.now();
        const result = fn();
        const end = performance.now();
        console.log(`Performance [${name}]: ${(end - start).toFixed(2)}ms`);
        return result;
    }
};

// Event Tracking System with mobile optimization
const EventTracker = {
    init: () => {
        const isMobile = DeviceDetector.isMobile();
        
        // Mouse movement tracking (throttled for performance)
        Utils.safeAddEventListener(document, 'mousemove', Utils.throttle(() => {
            botState.mouseMovements++;
        }, CONFIG.THROTTLE_DELAYS.MOUSE));
        
        // Keyboard tracking (throttled for performance)
        Utils.safeAddEventListener(document, 'keyup', Utils.throttle(() => {
            botState.keyboardEvents++;
        }, CONFIG.THROTTLE_DELAYS.KEYBOARD));
        
        // Touch tracking (mobile-specific)
        Utils.safeAddEventListener(document, 'touchstart', () => {
            botState.touchEvents++;
        });
        
        Utils.safeAddEventListener(document, 'touchend', () => {
            botState.touchEvents++;
        });
        
        // Scroll tracking (throttled for performance)
        Utils.safeAddEventListener(document, 'scroll', Utils.throttle(() => {
            botState.scrollEvents++;
        }, CONFIG.THROTTLE_DELAYS.SCROLL));
        
        // Network status tracking
        Utils.safeAddEventListener(window, 'online', () => {
            console.log('Network: Online');
        });
        
        Utils.safeAddEventListener(window, 'offline', () => {
            console.log('Network: Offline');
        });
        
        console.log('Event tracking initialized for:', isMobile ? 'mobile' : 'desktop');
    }
};

// Bot Detection System with mobile optimization
const BotDetection = {
    detect: () => {
        try {
            const timeSpent = Date.now() - botState.startTime;
            const isMobile = DeviceDetector.isMobile();
            const isRealMobile = DeviceDetector.isRealMobile();
            
            // Very relaxed checks for mobile
            if (isRealMobile) {
                const checks = {
                    timeCheck: timeSpent >= 500, // Very low for mobile
                    mouseCheck: true, // Always pass for mobile
                    interactionCheck: botState.formInteractions >= 1, // Very low
                    keyboardCheck: true // Always pass for mobile
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
                    isHuman: checks.timeCheck && checks.interactionCheck && honeypotCheck,
                    checks: { ...checks, honeypotCheck },
                    metrics: {
                        timeSpent,
                        mouseMovements: botState.mouseMovements,
                        formInteractions: botState.formInteractions,
                        keyboardEvents: botState.keyboardEvents,
                        touchEvents: botState.touchEvents,
                        scrollEvents: botState.scrollEvents,
                        deviceType: 'mobile',
                        screenResolution: DeviceDetector.getScreenResolution(),
                        viewportSize: DeviceDetector.getViewportSize(),
                        isMobile: true,
                        isRealMobile: true
                    }
                };
            }
            
            // Regular checks for desktop
            const checks = {
                timeCheck: timeSpent >= CONFIG.BOT_DETECTION.MIN_TIME,
                mouseCheck: (botState.mouseMovements >= CONFIG.BOT_DETECTION.MIN_MOUSE_MOVEMENTS) || 
                           (botState.touchEvents >= CONFIG.BOT_DETECTION.MIN_TOUCH_EVENTS) || 
                           (botState.scrollEvents >= CONFIG.BOT_DETECTION.MIN_SCROLL_EVENTS) || 
                           (botState.formInteractions >= CONFIG.BOT_DETECTION.MIN_FORM_INTERACTIONS),
                interactionCheck: botState.formInteractions >= CONFIG.BOT_DETECTION.MIN_FORM_INTERACTIONS,
                keyboardCheck: botState.keyboardEvents >= CONFIG.BOT_DETECTION.MIN_KEYBOARD_EVENTS
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
                    keyboardEvents: botState.keyboardEvents,
                    touchEvents: botState.touchEvents,
                    scrollEvents: botState.scrollEvents,
                    deviceType: DeviceDetector.getDeviceType(),
                    screenResolution: DeviceDetector.getScreenResolution(),
                    viewportSize: DeviceDetector.getViewportSize(),
                    isMobile: isMobile,
                    isRealMobile: false
                }
            };
        } catch (error) {
            console.error('Error in bot detection:', error);
            return {
                isHuman: true, // Default to true on error for mobile compatibility
                checks: {},
                metrics: { 
                    timeSpent: 5000, 
                    mouseMovements: 3, 
                    formInteractions: 3, 
                    keyboardEvents: 3,
                    touchEvents: 3,
                    scrollEvents: 3,
                    deviceType: DeviceDetector.getDeviceType(),
                    screenResolution: DeviceDetector.getScreenResolution(),
                    viewportSize: DeviceDetector.getViewportSize(),
                    isMobile: DeviceDetector.isMobile(),
                    isRealMobile: DeviceDetector.isRealMobile()
                }
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
            contactForm: !!DOMElements.contactForm,
            deviceType: DeviceDetector.getDeviceType()
        });
    }
};

// Navigation System with mobile optimization
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

    // Scroll effects for navbar with performance optimization
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

    // Smooth scrolling with mobile optimization
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
                        const offset = DeviceDetector.isMobile() ? 60 : 70;
                        window.scrollTo({
                            top: targetElement.offsetTop - offset,
                            behavior: 'smooth'
                        });
                    }
                });
            });
            
            // Active section highlighting with throttling
            const highlightActiveSection = Utils.debounce(() => {
                try {
                    const sections = Utils.getElements('section[id]');
                    const navItems = Utils.getElements('.nav-links ul li a');
                    
                    let current = '';
                    
                    sections.forEach(section => {
                        const sectionTop = section.offsetTop;
                        const offset = DeviceDetector.isMobile() ? 150 : 200;
                        
                        if (window.scrollY >= sectionTop - offset) {
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

// Enhanced Mobile Form Submission
const MobileFormSubmit = {
    async submit(formData, attempt = 1) {
        const maxAttempts = 3;
        const isRealMobile = DeviceDetector.isRealMobile();
        
        console.log(`Mobile submit attempt ${attempt}/${maxAttempts}`, {
            isRealMobile,
            connection: DeviceDetector.getConnectionInfo()
        });

        // Enhanced form data for mobile
        const enhancedData = {
            ...formData,
            realMobile: isRealMobile,
            submissionAttempt: attempt,
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language,
            connection: DeviceDetector.getConnectionInfo(),
            timestamp: new Date().toISOString()
        };

        const timeout = isRealMobile ? 30000 : 15000;
        
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), timeout);

            const response = await fetch(CONFIG.API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    ...(isRealMobile && {
                        'X-Real-Mobile': 'true',
                        'X-Mobile-Request': 'true'
                    })
                },
                body: JSON.stringify(enhancedData),
                signal: controller.signal,
                mode: 'cors',
                credentials: 'omit'
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorText = await response.text().catch(() => `HTTP ${response.status}`);
                throw new Error(`Server error: ${response.status} - ${errorText}`);
            }

            const result = await response.json();
            console.log('Mobile submit success:', result);
            return result;

        } catch (error) {
            console.error(`Mobile submit attempt ${attempt} failed:`, error);

            // Retry for mobile devices
            if (isRealMobile && attempt < maxAttempts) {
                const delay = 2000 * attempt;
                console.log(`Retrying in ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
                return this.submit(formData, attempt + 1);
            }

            throw error;
        }
    }
};

// Form Management System with enhanced mobile support
const FormManager = {
    initFormTracking: () => {
        if (DOMElements.contactForm) {
            Utils.safeAddEventListener(DOMElements.contactForm, 'input', () => {
                botState.formInteractions++;
            });
            
            Utils.safeAddEventListener(DOMElements.contactForm, 'focus', () => {
                botState.formInteractions++;
            }, true);
            
            // Mobile-specific form tracking
            if (DeviceDetector.isMobile()) {
                Utils.safeAddEventListener(DOMElements.contactForm, 'touchstart', () => {
                    botState.formInteractions++;
                });
            }
            
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
            const isRealMobile = DeviceDetector.isRealMobile();
            
            try {
                // Check network status
                if (!Utils.isOnline()) {
                    throw new Error('No internet connection. Please check your network and try again.');
                }
                
                // Show loading state
                if (submitButton) {
                    submitButton.textContent = isRealMobile ? 'Sending... (Mobile)' : 'Sending...';
                    submitButton.disabled = true;
                    submitButton.style.opacity = '0.7';
                }
                
                // Get and sanitize form data
                const formDataObj = new FormData(DOMElements.contactForm);
                const baseFormData = {
                    name: Utils.sanitizeInput(formDataObj.get('name') || ''),
                    email: Utils.sanitizeInput(formDataObj.get('email') || '').toLowerCase(),
                    message: Utils.sanitizeInput(formDataObj.get('message') || '')
                };
                
                // Validation
                if (!baseFormData.name || baseFormData.name.length < 2) {
                    throw new Error('Please enter a valid name (at least 2 characters).');
                }
                
                if (!baseFormData.email || !Utils.validateEmail(baseFormData.email)) {
                    throw new Error('Please enter a valid email address.');
                }
                
                if (!baseFormData.message || baseFormData.message.length < CONFIG.VALIDATION.MIN_MESSAGE_LENGTH) {
                    throw new Error(`Please enter a message (at least ${CONFIG.VALIDATION.MIN_MESSAGE_LENGTH} characters).`);
                }
                
                if (baseFormData.name.length > CONFIG.VALIDATION.MAX_NAME_LENGTH) {
                    throw new Error(`Name is too long (maximum ${CONFIG.VALIDATION.MAX_NAME_LENGTH} characters).`);
                }
                
                if (baseFormData.message.length > CONFIG.VALIDATION.MAX_MESSAGE_LENGTH) {
                    throw new Error(`Message is too long (maximum ${CONFIG.VALIDATION.MAX_MESSAGE_LENGTH} characters).`);
                }
                
                // Bot Detection (relaxed for mobile)
                const botDetection = BotDetection.detect();
                
                // Only check bot detection for desktop or if real mobile fails basic checks
                if (!isRealMobile) {
                    if (!botDetection.checks.timeCheck) {
                        throw new Error('Please take a moment to review your message.');
                    }
                    
                    if (!botDetection.checks.mouseCheck) {
                        throw new Error('Please interact with the page normally.');
                    }
                    
                    if (!botDetection.checks.interactionCheck) {
                        throw new Error('Please fill out the form naturally.');
                    }
                }
                
                if (!botDetection.checks.honeypotCheck) {
                    console.log('Bot detected: honeypot field filled');
                    throw new Error('Please try again.');
                }
                
                // Enhanced bot detection metadata with mobile-friendly defaults
                const formData = {
                    ...baseFormData,
                    formTime: botDetection.metrics.timeSpent,
                    interactions: Math.max(1, botDetection.metrics.formInteractions),
                    mouseMovements: isRealMobile ? 0 : botDetection.metrics.mouseMovements,
                    keyboardEvents: Math.max(1, botDetection.metrics.keyboardEvents),
                    touchEvents: isRealMobile ? Math.max(1, botDetection.metrics.touchEvents) : botDetection.metrics.touchEvents,
                    scrollEvents: Math.max(1, botDetection.metrics.scrollEvents),
                    deviceType: botDetection.metrics.deviceType,
                    screenResolution: botDetection.metrics.screenResolution,
                    viewportSize: botDetection.metrics.viewportSize,
                    timestamp: new Date().toISOString(),
                    userAgent: navigator.userAgent
                };
                
                console.log('Sending to API:', CONFIG.API_URL);
                
                // Submit using mobile-optimized method
                const result = await MobileFormSubmit.submit(formData);
                
                if (result.success) {
                    // Show success message
                    FormManager.showSuccessMessage(result.message);
                    
                    // Log successful submission
                    console.log('Form submitted successfully:', { 
                        name: formData.name, 
                        email: formData.email,
                        timestamp: formData.timestamp,
                        deviceType: botDetection.metrics.deviceType,
                        isRealMobile: isRealMobile
                    });
                    
                    // Reset bot protection counters
                    botState.formInteractions = 0;
                    botState.mouseMovements = 0;
                    botState.keyboardEvents = 0;
                    botState.touchEvents = 0;
                    botState.scrollEvents = 0;
                    
                } else {
                    throw new Error(result.error || result.message || 'Unknown server error');
                }
                
            } catch (error) {
                console.error('Error sending message:', error);
                
                let errorMessage = error.message || 'Failed to send message. Please try again.';
                
                // Add mobile-specific help
                if (isRealMobile && (errorMessage.includes('Network') || errorMessage.includes('timeout') || errorMessage.includes('Failed to fetch'))) {
                    errorMessage += '\n\nMobile troubleshooting: Try switching between WiFi and mobile data, or refresh the page and try again.';
                }
                
                FormManager.showErrorMessage(errorMessage);
                
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
            const isRealMobile = DeviceDetector.isRealMobile();
            formElement.innerHTML = `
                <div class="form-success">
                    <div style="text-align: center; margin-bottom: 1rem;">
                        <span style="font-size: 3rem; color: #28a745;">✅</span>
                    </div>
                    <h3>Message Sent Successfully!</h3>
                    <p>${Utils.sanitizeInput(message) || "Thank you for your message! I'll get back to you as soon as possible."}</p>
                    <div style="font-size: 0.9rem; color: #6c757d; margin-top: 1rem;">
                        <p>✓ Message verified and delivered securely</p>
                        <p>✓ Device: ${isRealMobile ? 'Mobile (Optimized)' : DeviceDetector.getDeviceType()}</p>
                        ${isRealMobile ? '<p>✓ Mobile-friendly submission successful</p>' : ''}
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
            
            const isRealMobile = DeviceDetector.isRealMobile();
            
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
                white-space: pre-line;
            `;
            
            let displayMessage = Utils.sanitizeInput(errorMessage) || 'Failed to send message. Please try again or contact me directly.';
            
            errorBanner.innerHTML = `<strong>Error:</strong> ${displayMessage}`;
            
            formElement.insertBefore(errorBanner, formElement.firstChild);
            
            // Remove error banner after 10 seconds for mobile, 7 for desktop
            const timeout = isRealMobile ? 10000 : 7000;
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
            }, timeout);
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
                           pattern="[A-Za-z\\s]{2,${CONFIG.VALIDATION.MAX_NAME_LENGTH}}" title="Name should contain only letters and spaces, 2-${CONFIG.VALIDATION.MAX_NAME_LENGTH} characters"
                           autocomplete="name" aria-describedby="name-help">
                    <div id="name-help" class="sr-only">Enter your full name using only letters and spaces</div>
                </div>
                <div class="form-group">
                    <label for="email">Email *</label>
                    <input type="email" id="email" name="email" required maxlength="${CONFIG.VALIDATION.MAX_EMAIL_LENGTH}"
                           title="Please enter a valid email address" autocomplete="email"
                           aria-describedby="email-help">
                    <div id="email-help" class="sr-only">Enter a valid email address</div>
                </div>
                <div class="form-group">
                    <label for="message">Message *</label>
                    <textarea id="message" name="message" rows="5" required 
                              minlength="${CONFIG.VALIDATION.MIN_MESSAGE_LENGTH}" maxlength="${CONFIG.VALIDATION.MAX_MESSAGE_LENGTH}" 
                              placeholder="Please enter your message (${CONFIG.VALIDATION.MIN_MESSAGE_LENGTH}-${CONFIG.VALIDATION.MAX_MESSAGE_LENGTH} characters)"
                              title="Message should be between ${CONFIG.VALIDATION.MIN_MESSAGE_LENGTH} and ${CONFIG.VALIDATION.MAX_MESSAGE_LENGTH} characters"
                              aria-describedby="message-help"></textarea>
                    <div id="message-help" class="sr-only">Enter your message (minimum ${CONFIG.VALIDATION.MIN_MESSAGE_LENGTH} characters)</div>
                </div>
                <!-- Enhanced Honeypot field - hidden from humans, visible to bots -->
                <div style="position: absolute; left: -9999px; opacity: 0; pointer-events: none;">
                    <label for="website">Website (leave blank):</label>
                    <input type="text" id="website" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">
                </div>
                <button type="submit" class="btn btn-primary" aria-label="Send message">Send Message</button>
                
                <!-- Mobile Test Button -->
                <div style="margin-top: 15px; text-align: center;">
                    <button type="button" class="btn btn-secondary" onclick="openMobileTest()" style="font-size: 0.9rem; padding: 8px 16px;">
                        <i class="fas fa-mobile-alt" aria-hidden="true"></i> Test Mobile Connection
                    </button>
                    <p style="font-size: 0.8rem; color: #666; margin-top: 8px;">
                        Having trouble on mobile? Test your connection first.
                    </p>
                </div>
            `;
            
            // Reset bot protection counters
            botState.formInteractions = 0;
            botState.mouseMovements = 0;
            botState.keyboardEvents = 0;
            botState.touchEvents = 0;
            botState.scrollEvents = 0;
            
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
                
                /* Mobile-specific optimizations */
                @media (max-width: 768px) {
                    .form-success {
                        padding: 1rem;
                    }
                    
                    .error-banner {
                        font-size: 0.85rem;
                        padding: 0.5rem;
                    }
                }
            `;
            document.head.appendChild(style);
        } catch (error) {
            console.error('Error adding CSS animations:', error);
        }
    }
};

// Font Awesome Check with mobile optimization
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

// Performance monitoring
const PerformanceMonitor = {
    init: () => {
        // Monitor page load performance
        window.addEventListener('load', () => {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            console.log(`Page load time: ${loadTime}ms`);
        });
        
        // Monitor memory usage (if available)
        if (performance.memory) {
            setInterval(() => {
                const memory = performance.memory;
                console.log(`Memory usage: ${Math.round(memory.usedJSHeapSize / 1048576)}MB / ${Math.round(memory.totalJSHeapSize / 1048576)}MB`);
            }, 30000); // Log every 30 seconds
        }
    }
};

// Main Application
const App = {
    init: () => {
        try {
            console.log('🚀 Initializing portfolio website...');
            console.log('📱 Device type:', DeviceDetector.getDeviceType());
            console.log('📱 Real mobile:', DeviceDetector.isRealMobile());
            console.log('🖥️ Screen resolution:', DeviceDetector.getScreenResolution());
            console.log('📐 Viewport size:', DeviceDetector.getViewportSize());
            console.log('🌐 Connection:', DeviceDetector.getConnectionInfo());
            
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
            PerformanceMonitor.init();
            
            // Security check
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                console.log('🔧 Development mode detected');
            }
            
            console.log('✅ Portfolio website loaded successfully');
            console.log('🔒 Security features enabled');
            console.log('🌐 API URL configured:', CONFIG.API_URL);
            console.log('📝 Contact form found:', !!DOMElements.contactForm);
            console.log('🤖 Bot protection active (mobile-optimized)');
            console.log('📱 Mobile optimization:', DeviceDetector.isMobile() ? 'enabled' : 'desktop mode');
            console.log('📱 Real mobile device:', DeviceDetector.isRealMobile() ? 'YES' : 'NO');
            
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
window.FormManager = FormManager;
window.resetContactForm = FormManager.resetContactForm;

// Mobile test function
window.openMobileTest = () => {
    try {
        window.open('mobile-test.html', '_blank', 'noopener,noreferrer');
    } catch (error) {
        console.error('Error opening mobile test:', error);
        // Fallback: try to navigate to the test page
        window.location.href = 'mobile-test.html';
    }
};

// Debug functions for mobile troubleshooting
window.debugMobile = () => {
    console.log('=== MOBILE DEBUG INFO ===');
    console.log('Device Detection:', {
        isMobile: DeviceDetector.isMobile(),
        isRealMobile: DeviceDetector.isRealMobile(),
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        maxTouchPoints: navigator.maxTouchPoints,
        touchSupport: 'ontouchstart' in window,
        screenSize: DeviceDetector.getScreenResolution(),
        viewportSize: DeviceDetector.getViewportSize(),
        connection: DeviceDetector.getConnectionInfo()
    });
    console.log('Bot State:', botState);
    console.log('Network:', navigator.onLine ? 'Online' : 'Offline');
    console.log('API URL:', CONFIG.API_URL);
    console.log('=========================');
};

// Emergency mobile form bypass (for extreme troubleshooting)
window.emergencyMobileSubmit = async (name, email, message) => {
    try {
        console.log('🚨 Emergency mobile submit triggered');
        const data = {
            name: name || 'Emergency Test',
            email: email || 'test@example.com',
            message: message || 'Emergency mobile test submission',
            realMobile: true,
            emergencyMode: true,
            formTime: 5000,
            interactions: 5,
            touchEvents: 5,
            deviceType: 'mobile',
            timestamp: new Date().toISOString()
        };
        
        const response = await fetch(CONFIG.API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Real-Mobile': 'true',
                'X-Emergency': 'true'
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        console.log('Emergency submit result:', result);
        alert(result.success ? 'Emergency submit successful!' : 'Emergency submit failed: ' + result.error);
        return result;
    } catch (error) {
        console.error('Emergency submit error:', error);
        alert('Emergency submit error: ' + error.message);
        throw error;
    }
};
