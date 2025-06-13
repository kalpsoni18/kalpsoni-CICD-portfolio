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

// Form submission handler
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        // Here you would typically send this data to a backend
        // For now, we'll just log it and show a success message
        console.log('Form submitted:', { name, email, message });
        
        // Display success message
        const formElement = document.querySelector('.contact-form');
        formElement.innerHTML = `
            <div class="form-success">
                <h3>Thank you for your message!</h3>
                <p>I'll get back to you as soon as possible.</p>
                <button class="btn btn-primary" onclick="resetContactForm()">Send Another Message</button>
            </div>
        `;
    });
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
    
    // Re-attach the event listener
    document.getElementById('contactForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        console.log('Form submitted:', { name, email, message });
        
        const formElement = document.querySelector('.contact-form');
        formElement.innerHTML = `
            <div class="form-success">
                <h3>Thank you for your message!</h3>
                <p>I'll get back to you as soon as possible.</p>
                <button class="btn btn-primary" onclick="resetContactForm()">Send Another Message</button>
            </div>
        `;
    });
}

// Typing animation for the hero section (optional)
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
});
