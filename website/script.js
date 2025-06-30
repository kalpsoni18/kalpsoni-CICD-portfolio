/**
 * Portfolio Website JavaScript - Mobile-Optimized Version
 * Kalp Soni - Cloud & DevOps Engineer
 * 
 * Fixed mobile form submission issues with enhanced connectivity handling
 */

// Enhanced Configuration for Mobile
const CONFIG = {
    API_URL: 'https://r7kjg1upkg.execute-api.us-east-2.amazonaws.com/prod/contact',
    FALLBACK_API_URL: 'https://formspree.io/f/your_form_id', // Add fallback if needed
    THROTTLE_DELAYS: {
        MOUSE: 150,      // Increased for mobile
        KEYBOARD: 300,   // Increased for mobile
        SCROLL: 32,      // Increased for mobile
        HIGHLIGHT: 200   // Increased for mobile
    },
    BOT_DETECTION: {
        MIN_TIME: 2000,  // Reduced for mobile (users fill forms faster)
        MIN_MOUSE_MOVEMENTS: 2,  // Reduced for mobile
        MIN_TOUCH_EVENTS: 1,     // Mobile-specific
        MIN_SCROLL_EVENTS: 1,
        MIN_FORM_INTERACTIONS: 2, // Reduced for mobile
        MIN_KEYBOARD_EVENTS: 1
    },
    VALIDATION: {
        MAX_NAME_LENGTH: 100,
        MAX_EMAIL_LENGTH: 100,
        MAX_MESSAGE_LENGTH: 2000,
        MIN_MESSAGE_LENGTH: 10
    },
    REQUEST_TIMEOUT: 25000,  // Increased for mobile networks
    RETRY_ATTEMPTS: 3,       // Add retry logic
    RETRY_DELAY: 2000       // Delay between retries
};

// Enhanced Mobile Detection
const DeviceDetector = {
    isMobile: () => {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS|FxiOS/i;
        
        return mobileRegex.test(userAgent) || 
               window.innerWidth <= 768 || 
               ('ontouchstart' in window) ||
               (navigator.maxTouchPoints > 0);
    },
    
    getConnectionType: () => {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
        if (connection) {
            return {
                effectiveType: connection.effectiveType || 'unknown',
                downlink: connection.downlink || 'unknown',
                rtt: connection.rtt || 'unknown',
                saveData: connection.saveData || false
            };
        }
        return null;
    },
    
    isSlowConnection: () => {
        const connection = DeviceDetector.getConnectionType();
        if (connection) {
            return connection.effectiveType === 'slow-2g' || 
                   connection.effectiveType === '2g' ||
                   (connection.rtt && connection.rtt > 1000) ||
                   (connection.downlink && connection.downlink < 1);
        }
        return false;
    },
    
    getScreenResolution: () => `${screen.width}x${screen.height}`,
    getViewportSize: () => `${window.innerWidth}x${window.innerHeight}`,
    getDeviceType: () => DeviceDetector.isMobile() ? 'mobile' : 'desktop'
};

// Enhanced Network Utilities
const NetworkUtils = {
    isOnline: () => navigator.onLine,
    
    // Test actual connectivity (not just navigator.onLine)
    testConnectivity: async () => {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);
            
            const response = await fetch('https://httpbin.org/get', {
                method: 'GET',
                mode: 'cors',
                cache: 'no-cache',
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            return response.ok;
        } catch (error) {
            console.log('Connectivity test failed:', error.message);
            return false;
        }
    },
    
    // Test API endpoint specifically
    testApiConnectivity: async () => {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 8000);
            
            const response = await fetch(CONFIG.API_URL, {
                method: 'OPTIONS',
                mode: 'cors',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json',
                    'User-Agent': `Mobile-Portfolio/${DeviceDetector.getDeviceType()}`
                },
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            return response.ok || response.status === 204; // Some APIs return 204 for OPTIONS
        } catch (error) {
            console.log('API connectivity test failed:', error.message);
            return false;
        }
    },
    
    // Enhanced retry with exponential backoff
    retryRequest: async (requestFn, maxRetries = CONFIG.RETRY_ATTEMPTS) => {
        let lastError;
        
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                const result = await requestFn();
                return result;
            } catch (error) {
                lastError = error;
                console.log(`Request attempt ${attempt}/${maxRetries} failed:`, error.message);
                
                if (attempt < maxRetries) {
                    const delay = CONFIG.RETRY_DELAY * Math.pow(2, attempt - 1); // Exponential backoff
                    console.log(`Retrying in ${delay}ms...`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }
        }
        
        throw lastError;
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

// Enhanced Utility Functions
const Utils = {
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

    debounce: (func, delay) => {
        let timeoutId;
        return function (...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    },

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

// Enhanced Event Tracking for Mobile
const EventTracker = {
    init: () => {
        const isMobile = DeviceDetector.isMobile();
        
        if (!isMobile) {
            // Mouse tracking for desktop
            Utils.safeAddEventListener(document, 'mousemove', Utils.throttle(() => {
                botState.mouseMovements++;
            }, CONFIG.THROTTLE_DELAYS.MOUSE));
        }
        
        // Keyboard tracking
        Utils.safeAddEventListener(document, 'keyup', Utils.throttle(() => {
            botState.keyboardEvents++;
        }, CONFIG.THROTTLE_DELAYS.KEYBOARD));
        
        // Touch tracking (mobile-specific)
        if (isMobile) {
            Utils.safeAddEventListener(document, 'touchstart', () => {
                botState.touchEvents++;
            }, { passive: true });
            
            Utils.safeAddEventListener(document, 'touchend', () => {
                botState.touchEvents++;
            }, { passive: true });
            
            // Track touch gestures
            Utils.safeAddEventListener(document, 'touchmove', Utils.throttle(() => {
                botState.touchEvents++;
            }, 200), { passive: true });
        }
        
        // Scroll tracking
        Utils.safeAddEventListener(document, 'scroll', Utils.throttle(() => {
            botState.scrollEvents++;
        }, CONFIG.THROTTLE_DELAYS.SCROLL), { passive: true });
        
        // Network status tracking
        Utils.safeAddEventListener(window, 'online', () => {
            console.log('Network: Online');
            FormManager.showNetworkStatus(true);
        });
        
        Utils.safeAddEventListener(window, 'offline', () => {
            console.log('Network: Offline');
            FormManager.showNetworkStatus(false);
        });
        
        console.log('Event tracking initialized for:', isMobile ? 'mobile' : 'desktop');
    }
};

// Enhanced Bot Detection for Mobile
const BotDetection = {
    detect: () => {
        try {
            const timeSpent = Date.now() - botState.startTime;
            const isMobile = DeviceDetector.isMobile();
            
            const checks = {
                timeCheck: timeSpent >= CONFIG.BOT_DETECTION.MIN_TIME,
                mouseCheck: isMobile ? 
                    (botState.touchEvents >= CONFIG.BOT_DETECTION.MIN_TOUCH_EVENTS || 
                     botState.scrollEvents >= CONFIG.BOT_DETECTION.MIN_SCROLL_EVENTS || 
                     botState.formInteractions >= CONFIG.BOT_DETECTION.MIN_FORM_INTERACTIONS) :
                    (botState.mouseMovements >= CONFIG.BOT_DETECTION.MIN_MOUSE_MOVEMENTS || 
                     botState.scrollEvents >= CONFIG.BOT_DETECTION.MIN_SCROLL_EVENTS || 
                     botState.formInteractions >= CONFIG.BOT_DETECTION.MIN_FORM_INTERACTIONS),
                interactionCheck: botState.formInteractions >= CONFIG.BOT_DETECTION.MIN_FORM_INTERACTIONS,
                keyboardCheck: isMobile ? true : botState.keyboardEvents >= CONFIG.BOT_DETECTION.MIN_KEYBOARD_EVENTS
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
                isHuman: checks.timeCheck && checks.mouseCheck && checks.interactionCheck && checks.keyboardCheck && honeypotCheck,
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
                    isMobile,
                    connectionType: DeviceDetector.getConnectionType(),
                    isSlowConnection: DeviceDetector.isSlowConnection()
                }
            };
        } catch (error) {
            console.error('Error in bot detection:', error);
            return {
                isHuman: false,
                checks: {},
                metrics: { 
                    timeSpent: 0, 
                    mouseMovements: 0, 
                    formInteractions: 0, 
                    keyboardEvents: 0,
                    touchEvents: 0,
                    scrollEvents: 0,
                    deviceType: DeviceDetector.getDeviceType(),
                    screenResolution: DeviceDetector.getScreenResolution(),
                    viewportSize: DeviceDetector.getViewportSize(),
                    isMobile: DeviceDetector.isMobile(),
                    connectionType: DeviceDetector.getConnectionType(),
                    isSlowConnection: DeviceDetector.isSlowConnection()
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

// Enhanced Form Manager with Mobile Optimizations
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
                }, { passive: true });
            }
            
            console.log('Form tracking initialized');
        }
    },

    showNetworkStatus: (isOnline) => {
        const existingBanner = document.querySelector('.network-status-banner');
        if (existingBanner) {
            existingBanner.remove();
        }
        
        if (!isOnline) {
            const banner = document.createElement('div');
            banner.className = 'network-status-banner';
            banner.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                background-color: #e74c3c;
                color: white;
                padding: 10px;
                text-align: center;
                z-index: 9999;
                font-size: 14px;
            `;
            banner.innerHTML = '📵 No internet connection. Please check your network.';
            document.body.appendChild(banner);
        }
    },

    // Enhanced form submission with mobile optimization
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
                // Show loading immediately for mobile users
                if (submitButton) {
                    submitButton.textContent = 'Checking connection...';
                    submitButton.disabled = true;
                    submitButton.style.opacity = '0.7';
                }
                
                // Check network status first
                if (!NetworkUtils.isOnline()) {
                    throw new Error('No internet connection. Please check your network and try again.');
                }
                
                // Test actual connectivity (especially important for mobile)
                submitButton.textContent = 'Testing connection...';
                const hasConnectivity = await NetworkUtils.testConnectivity();
                if (!hasConnectivity) {
                    throw new Error('Poor internet connection. Please check your network and try again.');
                }
                
                // Test API connectivity specifically
                submitButton.textContent = 'Connecting to server...';
                const apiConnectivity = await NetworkUtils.testApiConnectivity();
                if (!apiConnectivity) {
                    console.warn('API connectivity test failed, proceeding anyway...');
                }
                
                // Bot Detection with mobile considerations
                submitButton.textContent = 'Validating...';
                const botDetection = BotDetection.detect();
                
                if (!botDetection.checks.timeCheck) {
                    throw new Error('Please take a moment to review your message before submitting.');
                }
                
                if (!botDetection.checks.mouseCheck) {
                    throw new Error('Please interact with the page normally before submitting.');
                }
                
                if (!botDetection.checks.interactionCheck) {
                    throw new Error('Please complete the form naturally.');
                }
                
                if (!botDetection.checks.honeypotCheck) {
                    console.log('Bot detected: honeypot field filled');
                    throw new Error('Form submission blocked.');
                }
                
                // Get and sanitize form data
                submitButton.textContent = 'Preparing data...';
                const formDataObj = new FormData(DOMElements.contactForm);
                const formData = {
                    name: Utils.sanitizeInput(formDataObj.get('name') || ''),
                    email: Utils.sanitizeInput(formDataObj.get('email') || '').toLowerCase(),
                    message: Utils.sanitizeInput(formDataObj.get('message') || ''),
                    // Enhanced bot detection metadata for mobile
                    formTime: botDetection.metrics.timeSpent,
                    interactions: botDetection.metrics.formInteractions,
                    mouseMovements: botDetection.metrics.mouseMovements,
                    keyboardEvents: botDetection.metrics.keyboardEvents,
                    touchEvents: botDetection.metrics.touchEvents,
                    scrollEvents: botDetection.metrics.scrollEvents,
                    deviceType: botDetection.metrics.deviceType,
                    screenResolution: botDetection.metrics.screenResolution,
                    viewportSize: botDetection.metrics.viewportSize,
                    connectionType: botDetection.metrics.connectionType,
                    isSlowConnection: botDetection.metrics.isSlowConnection,
                    timestamp: new Date().toISOString(),
                    userAgent: navigator.userAgent,
                    platform: navigator.platform,
                    language: navigator.language,
                    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
                };
                
                // Enhanced validation
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
                
                // Enhanced spam detection
                const spamWords = ['viagra', 'casino', 'lottery', 'winner', 'congratulations', 'click here', 'free money', 'make money fast'];
                const messageWords = formData.message.toLowerCase().split(/\s+/);
                const spamCount = spamWords.filter(spam => 
                    messageWords.some(word => word.includes(spam))
                ).length;
                
                if (spamCount >= 2) {
                    console.log('Potential spam detected');
                    throw new Error('Message content appears to be spam.');
                }
                
                // Submit with retry logic
                submitButton.textContent = 'Sending message...';
                console.log('Submitting to API:', CONFIG.API_URL);
                
                const submitRequest = async () => {
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), CONFIG.REQUEST_TIMEOUT);
                    
                    try {
                        const response = await fetch(CONFIG.API_URL, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Accept': 'application/json',
                                'User-Agent': `Portfolio-Contact-Form/4.0-Mobile`,
                                'X-Device-Type': DeviceDetector.getDeviceType(),
                                'X-Connection-Type': (DeviceDetector.getConnectionType()?.effectiveType || 'unknown'),
                                'Cache-Control': 'no-cache',
                                'Pragma': 'no-cache'
                            },
                            body: JSON.stringify(formData),
                            signal: controller.signal,
                            mode: 'cors',
                            credentials: 'omit'
                        });
                        
                        clearTimeout(timeoutId);
                        return response;
                    } catch (fetchError) {
                        clearTimeout(timeoutId);
                        throw fetchError;
                    }
                };
                
                let response;
                try {
                    response = await NetworkUtils.retryRequest(submitRequest);
                } catch (fetchError) {
                    if (fetchError.name === 'AbortError') {
                        throw new Error('Request timed out. This might be due to a slow connection. Please try again.');
                    } else if (fetchError.message.includes('Failed to fetch') || fetchError.message.includes('NetworkError')) {
                        throw new Error('Network error. Please check your internet connection and try again.');
                    } else if (fetchError.message.includes('CORS')) {
                        throw new Error('Connection blocked. Please try again or contact support.');
                    } else {
                        throw new Error(`Connection failed: ${fetchError.message}. Please try again.`);
                    }
                }
                
                console.log('API Response status:', response.status);
                console.log('API Response headers:', Object.fromEntries(response.headers.entries()));
                
                if (!response.ok) {
                    let errorText;
                    try {
                        errorText = await response.text();
                    } catch (e) {
                        errorText = 'Unknown error';
                    }
                    console.error('API Error Response:', errorText);
                    
                    if (response.status === 429) {
                        throw new Error('Too many requests. Please wait a moment and try again.');
                    } else if (response.status === 403) {
                        throw new Error('Request blocked by security settings. Please try again later.');
                    } else if (response.status === 400) {
                        throw new Error('Invalid form data. Please check your input and try again.');
                    } else if (response.status >= 500) {
                        throw new Error('Server error. Please try again in a few minutes.');
                    } else {
                        throw new Error(`Server responded with error ${response.status}. Please try again.`);
                    }
                }
                
                let result;
                try {
                    const responseText = await response.text();
                    console.log('Raw API Response:', responseText);
                    
                    if (responseText.trim() === '') {
                        // Empty response but status was OK
                        result = { success: true, message: 'Message sent successfully!' };
                    } else {
                        result = JSON.parse(responseText);
                    }
                } catch (jsonError) {
                    console.error('Error parsing response:', jsonError);
                    // If response was OK but JSON parsing failed, assume success
                    if (response.status >= 200 && response.status < 300) {
                        result = { success: true, message: 'Message sent successfully!' };
                    } else {
                        throw new Error('Invalid response from server.');
                    }
                }
                
                console.log('Parsed API Response:', result);
                
                if (result.success !== false) { // Allow undefined success field
                    // Show success message
                    FormManager.showSuccessMessage(result.message || 'Thank you! Your message has been sent successfully.');
                    
                    // Log successful submission
                    console.log('Form submitted successfully:', { 
                        name: formData.name, 
                        email: formData.email,
                        timestamp: formData.timestamp,
                        deviceType: botDetection.metrics.deviceType,
                        connectionType: botDetection.metrics.connectionType,
                        humanScore: botDetection.isHuman ? 'HUMAN' : 'SUSPICIOUS'
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
                
                let errorMessage = 'Failed to send message. Please try again.';
                
                if (error.message) {
                    errorMessage = error.message;
                }
                
                // Add mobile-specific troubleshooting
                if (DeviceDetector.isMobile()) {
                    if (error.message.includes('Network') || error.message.includes('connection')) {
                        errorMessage += ' Try switching between WiFi and mobile data, or use the mobile test page.';
                    }
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
            formElement.innerHTML = `
                <div class="form-success">
                    <div style="text-align: center; margin-bottom: 1rem;">
                        <span style="font-size: 3rem; color: #28a745;">✅</span>
                    </div>
                    <h3>Message Sent Successfully!</h3>
                    <p>${Utils.sanitizeInput(message) || "Thank you for your message! I'll get back to you as soon as possible."}</p>
                    <div style="font-size: 0.9rem; color: #6c757d; margin-top: 1rem;">
                        <p>✓ Message verified and delivered securely</p>
                        <p>✓ Device: ${DeviceDetector.getDeviceType()}</p>
                        <p>✓ Connection: ${DeviceDetector.getConnectionType()?.effectiveType || 'unknown'}</p>
                        ${DeviceDetector.isMobile() ? '<p>✓ Mobile optimization applied</p>' : ''}
                    </div>
                    <button class="btn btn-primary" onclick="FormManager.resetContactForm()" style="margin-top: 1rem;">Send Another Message</button>
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
            
            // Create enhanced error banner with troubleshooting
            const errorBanner = document.createElement('div');
            errorBanner.className = 'error-banner';
            errorBanner.style.cssText = `
                background-color: #f8d7da;
                color: #721c24;
                padding: 1rem;
                margin-bottom: 1rem;
                border: 1px solid #f5c6cb;
                border-radius: 4px;
                font-size: 0.9rem;
                animation: slideDown 0.3s ease-out;
            `;
            
            let troubleshootingTips = '';
            if (DeviceDetector.isMobile()) {
                troubleshootingTips = `
                    <div style="margin-top: 0.5rem; padding-top: 0.5rem; border-top: 1px solid #f5c6cb; font-size: 0.8rem;">
                        <strong>Mobile troubleshooting:</strong><br>
                        • Try switching between WiFi and mobile data<br>
                        • Clear your browser cache<br>
                        • Try the <a href="mobile-test.html" target="_blank" style="color: #721c24; text-decoration: underline;">mobile test page</a><br>
                        • Contact me directly at: <a href="mailto:kalp.soni@example.com" style="color: #721c24;">kalp.soni@example.com</a>
                    </div>
                `;
            }
            
            errorBanner.innerHTML = `
                <strong>❌ Error:</strong> ${Utils.sanitizeInput(errorMessage) || 'Failed to send message. Please try again.'}
                ${troubleshootingTips}
            `;
            
            formElement.insertBefore(errorBanner, formElement.firstChild);
            
            // Scroll to error for mobile users
            if (DeviceDetector.isMobile()) {
                errorBanner.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            
            // Remove error banner after 10 seconds
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
            }, 10000);
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
                           pattern="[A-Za-z\\s]{2,${CONFIG.VALIDATION.MAX_NAME_LENGTH}}" 
                           title="Name should contain only letters and spaces, 2-${CONFIG.VALIDATION.MAX_NAME_LENGTH} characters"
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
                
                <!-- Enhanced Mobile Test Button -->
                <div style="margin-top: 15px; text-align: center;">
                    <button type="button" class="btn btn-secondary" onclick="openMobileTest()" style="font-size: 0.9rem; padding: 8px 16px;">
                        <i class="fas fa-mobile-alt" aria-hidden="true"></i> Test Mobile Connection
                    </button>
                    <p style="font-size: 0.8rem; color: #666; margin-top: 8px;">
                        Having trouble? Test your connection or contact me directly.
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
            if (DOMElements.contactForm) {
                FormManager.initFormTracking();
                FormManager.initFormSubmission();
            }
            
        } catch (error) {
            console.error('Error resetting form:', error);
        }
    }
};

// Navigation System (simplified for mobile)
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
            
            // Enhanced touch support for mobile
            if (DeviceDetector.isMobile()) {
                Utils.safeAddEventListener(DOMElements.hamburger, 'touchstart', () => {
                    try {
                        DOMElements.navLinks.classList.toggle('active');
                        DOMElements.hamburger.classList.toggle('active');
                    } catch (error) {
                        console.error('Error toggling navbar:', error);
                    }
                }, { passive: true });
            }
        }

        // Close navbar when clicking on nav items
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
        }, 16), { passive: true });
    },

    initSmoothScrolling: () => {
        try {
            Utils.getElements('a[href^="#"]').forEach(anchor => {
                Utils.safeAddEventListener(anchor, 'click', function(e) {
                    e.preventDefault();
                    
                    const targetId = this.getAttribute('href');
                    if (targetId === '#') return;
                    
                    const targetElement = document.querySelector(targetId);
                    
                    if (targetElement) {
                        const offset = DeviceDetector.isMobile() ? 80 : 70;
                        window.scrollTo({
                            top: targetElement.offsetTop - offset,
                            behavior: 'smooth'
                        });
                    }
                });
            });
        } catch (error) {
            console.error('Error initializing smooth scrolling:', error);
        }
    }
};

// Enhanced CSS Animations
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
                
                .network-status-banner {
                    animation: slideDown 0.3s ease-out;
                }
                
                /* Enhanced mobile optimizations */
                @media (max-width: 768px) {
                    .form-success {
                        padding: 1rem;
                        font-size: 0.9rem;
                    }
                    
                    .error-banner {
                        font-size: 0.85rem;
                        padding: 0.75rem;
                    }
                    
                    /* Improve touch targets */
                    button, .btn {
                        min-height: 44px;
                        min-width: 44px;
                    }
                    
                    input, textarea {
                        font-size: 16px; /* Prevent zoom on iOS */
                    }
                }
            `;
            document.head.appendChild(style);
        } catch (error) {
            console.error('Error adding CSS animations:', error);
        }
    }
};

// Performance Monitor for Mobile
const PerformanceMonitor = {
    init: () => {
        // Monitor page load performance
        Utils.safeAddEventListener(window, 'load', () => {
            if (performance.timing) {
                const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
                console.log(`Page load time: ${loadTime}ms`);
                
                // Log mobile-specific metrics
                if (DeviceDetector.isMobile()) {
                    const connectionType = DeviceDetector.getConnectionType();
                    console.log('Mobile metrics:', {
                        loadTime: `${loadTime}ms`,
                        connectionType: connectionType?.effectiveType || 'unknown',
                        isSlowConnection: DeviceDetector.isSlowConnection(),
                        screenSize: DeviceDetector.getScreenResolution(),
                        viewportSize: DeviceDetector.getViewportSize()
                    });
                }
            }
        });
    }
};

// Main Application
const App = {
    init: () => {
        try {
            console.log('🚀 Initializing mobile-optimized portfolio website...');
            console.log('📱 Device type:', DeviceDetector.getDeviceType());
            console.log('🖥️ Screen resolution:', DeviceDetector.getScreenResolution());
            console.log('📐 Viewport size:', DeviceDetector.getViewportSize());
            console.log('🌐 Connection type:', DeviceDetector.getConnectionType()?.effectiveType || 'unknown');
            console.log('🐌 Slow connection:', DeviceDetector.isSlowConnection());
            
            // Initialize all systems
            EventTracker.init();
            DOMElements.init();
            Navigation.init();
            Navigation.initScrollEffects();
            Navigation.initSmoothScrolling();
            FormManager.initFormTracking();
            FormManager.initFormSubmission();
            CSSAnimations.add();
            PerformanceMonitor.init();
            
            // Mobile-specific initialization
            if (DeviceDetector.isMobile()) {
                console.log('📱 Mobile optimizations enabled');
                
                // Add mobile-specific meta tags if missing
                if (!document.querySelector('meta[name="format-detection"]')) {
                    const meta = document.createElement('meta');
                    meta.name = 'format-detection';
                    meta.content = 'telephone=no';
                    document.head.appendChild(meta);
                }
                
                // Prevent zoom on form inputs
                const inputs = document.querySelectorAll('input, textarea');
                inputs.forEach(input => {
                    if (input.style.fontSize === '' || parseFloat(input.style.fontSize) < 16) {
                        input.style.fontSize = '16px';
                    }
                });
            }
            
            console.log('✅ Portfolio website loaded successfully');
            console.log('🔒 Security features enabled');
            console.log('🌐 API URL configured:', CONFIG.API_URL);
            console.log('📝 Contact form found:', !!DOMElements.contactForm);
            console.log('🤖 Bot protection active (mobile-optimized)');
            console.log('📱 Mobile optimization:', DeviceDetector.isMobile() ? 'enabled' : 'desktop mode');
            
        } catch (error) {
            console.error('❌ Error during initialization:', error);
            // Enhanced fallback initialization
            try {
                DOMElements.init();
                if (DOMElements.contactForm) {
                    FormManager.initFormSubmission();
                }
                console.log('✅ Fallback initialization completed');
            } catch (fallbackError) {
                console.error('❌ Fallback initialization failed:', fallbackError);
            }
        }
    }
};

// Enhanced Global Error Handlers
window.addEventListener('error', (event) => {
    console.error('Global error caught:', event.error);
    
    // Show user-friendly error message for critical failures
    if (event.error && event.error.message && event.error.message.includes('fetch')) {
        FormManager.showNetworkStatus(false);
    }
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    
    // Handle network-related promise rejections
    if (event.reason && typeof event.reason === 'object' && 
        (event.reason.message?.includes('fetch') || event.reason.message?.includes('network'))) {
        FormManager.showNetworkStatus(false);
    }
});

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', App.init);

// Make functions available globally
window.FormManager = FormManager;
window.resetContactForm = FormManager.resetContactForm;

// Enhanced mobile test function
window.openMobileTest = () => {
    try {
        const testUrl = window.location.origin + '/mobile-test.html';
        const newWindow = window.open(testUrl, '_blank', 'noopener,noreferrer');
        
        if (!newWindow) {
            // Popup blocked, try direct navigation
            window.location.href = testUrl;
        }
    } catch (error) {
        console.error('Error opening mobile test:', error);
        // Final fallback
        try {
            window.location.href = 'mobile-test.html';
        } catch (e) {
            alert('Please navigate to the mobile test page manually: /mobile-test.html');
        }
    }
};

// Export for debugging
if (typeof window !== 'undefined') {
    window.PortfolioDebug = {
        CONFIG,
        DeviceDetector,
        NetworkUtils,
        BotDetection,
        FormManager,
        botState
    };
}
