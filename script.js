// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {

    // Mobile navigation toggle functionality
    const navToggle = document.querySelector('.nav-toggle');
    const navList = document.querySelector('.nav-list');
    
    if (navToggle && navList) {
        navToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            navList.classList.toggle('show');
            
            // Change icon based on menu state
            const icon = this.querySelector('i');
            if (navList.classList.contains('show')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
                document.body.style.overflow = 'hidden'; // Prevent background scroll
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                document.body.style.overflow = 'auto';
            }
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (navList && navToggle && navList.classList.contains('show') && 
            !navList.contains(e.target) && 
            !navToggle.contains(e.target)) {
            navList.classList.remove('show');
            const icon = navToggle.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
            document.body.style.overflow = 'auto';
        }
    });
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            // Close mobile menu when a link is clicked
            if (window.innerWidth <= 768 && navList && navList.classList.contains('show')) {
                navList.classList.remove('show');
                const icon = navToggle ? navToggle.querySelector('i') : null;
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
                document.body.style.overflow = 'auto';
            }
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update active navigation link
                updateActiveNavLink(targetId);
            }
        });
    });
    
    // Update active navigation link based on scroll position
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section[id]');
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100; // Account for fixed nav
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });
        
        if (current) {
            updateActiveNavLink('#' + current);
        }
    });
    
    // Set initial active state
    updateActiveNavLink('#home');
    
    // Form submission handling with animation
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form elements
            const submitBtn = this.querySelector('button[type="submit"]');
            const btnText = submitBtn.querySelector('.btn-text');
            const btnLoading = submitBtn.querySelector('.btn-loading');
            
            // Show loading state
            btnText.style.display = 'none';
            btnLoading.style.display = 'inline-block';
            submitBtn.disabled = true;
            
            // Get form data
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const subject = formData.get('subject');
            const message = formData.get('message');
            
            // Basic validation
            if (!name || !email || !subject || !message) {
                showNotification('Please fill in all fields.', 'error');
                btnText.style.display = 'inline-block';
                btnLoading.style.display = 'none';
                submitBtn.disabled = false;
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address.', 'error');
                btnText.style.display = 'inline-block';
                btnLoading.style.display = 'none';
                submitBtn.disabled = false;
                return;
            }
            
            // Simulate form submission (replace with actual AJAX call in production)
            setTimeout(() => {
                // Hide loading state
                btnText.style.display = 'inline-block';
                btnLoading.style.display = 'none';
                submitBtn.disabled = false;
                
                // Show success message
                const formGroups = contactForm.querySelectorAll('.form-group');
                formGroups.forEach(group => {
                    group.style.opacity = '0.5';
                    group.style.transform = 'scale(0.95)';
                });
                
                // Create success message
                const successMessage = document.createElement('div');
                successMessage.className = 'form-success-message';
                successMessage.innerHTML = `
                    <div class="success-animation">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <h3>Thank You!</h3>
                    <p>Your message has been sent successfully! I will get back to you soon.</p>
                    <button class="hero-btn secondary" id="resetFormBtn">Send Another Message</button>
                `;
                
                // The success message styles are now handled by CSS classes
                
                // Add success message with animation
                contactForm.appendChild(successMessage);
                setTimeout(() => {
                    successMessage.style.opacity = '1';
                    successMessage.style.transform = 'translateY(0)';
                }, 10);
                
                // Reset form button
                const resetBtn = document.getElementById('resetFormBtn');
                if (resetBtn) {
                    resetBtn.addEventListener('click', function() {
                        // Remove success message
                        successMessage.style.opacity = '0';
                        successMessage.style.transform = 'translateY(20px)';
                        
                        setTimeout(() => {
                            successMessage.remove();
                            
                            // Reset form
                            contactForm.reset();
                            
                            // Restore form groups
                            formGroups.forEach(group => {
                                group.style.opacity = '1';
                                group.style.transform = 'scale(1)';
                            });
                        }, 300);
                    });
                }
            }, 2000); // Simulate 2 second delay for form submission
        });
    }
    
    // Blog filtering and search functionality
const filterButtons = document.querySelectorAll('.filter-btn');
const blogCards = document.querySelectorAll('.blog-card');
const searchInput = document.getElementById('blog-search-input');
const searchButton = document.getElementById('blog-search-btn');

// Function to filter blog cards
function filterBlogCards(filterValue, searchTerm = '') {
    blogCards.forEach(card => {
        // First hide all cards to reset
        card.classList.add('hidden');
        
        // Get card content for search
        const cardTitle = card.querySelector('.blog-title').textContent.toLowerCase();
        const cardExcerpt = card.querySelector('.blog-excerpt').textContent.toLowerCase();
        const cardCategory = card.getAttribute('data-category').toLowerCase();
        const cardContent = cardTitle + ' ' + cardExcerpt + ' ' + cardCategory;
        
        // Check if card matches both filter and search criteria
        const matchesFilter = filterValue === 'all' || card.getAttribute('data-category') === filterValue;
        const matchesSearch = searchTerm === '' || cardContent.includes(searchTerm.toLowerCase());
        
        // Show cards based on filter and search
        setTimeout(() => {
            if (matchesFilter && matchesSearch) {
                card.classList.remove('hidden');
                // Add animation
                card.style.animation = 'fadeIn 0.5s forwards';
            } else {
                card.style.animation = '';
            }
        }, 300);
    });
}

// Initialize filter buttons
if (filterButtons.length > 0 && blogCards.length > 0) {
    // Get current active filter
    let currentFilter = document.querySelector('.filter-btn.active')?.getAttribute('data-filter') || 'all';
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Update current filter
            currentFilter = this.getAttribute('data-filter');
            
            // Apply filtering with current search term
            filterBlogCards(currentFilter, searchInput.value);
        });
    });
    
    // Initialize search functionality
    if (searchInput && searchButton) {
        // Search on button click
        searchButton.addEventListener('click', function() {
            filterBlogCards(currentFilter, searchInput.value);
        });
        
        // Search on enter key
        searchInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                filterBlogCards(currentFilter, this.value);
            }
        });
        
        // Live search (optional, can be resource-intensive)
        searchInput.addEventListener('input', function() {
            // Debounce to avoid too many updates
            clearTimeout(this.debounceTimer);
            this.debounceTimer = setTimeout(() => {
                filterBlogCards(currentFilter, this.value);
            }, 300);
        });
    }
}
    
    // Add scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.about-card, .skills-update-message, .projects-update-message');
    animateElements.forEach(el => observer.observe(el));
    
    // Add typing effect to hero description
    const heroDescription = document.querySelector('.hero-description');
    if (heroDescription) {
        typeWriter(heroDescription, heroDescription.textContent, 50);
    }

    // Typing animation for hero section
    const heroText = "A passionate developer crafting modern web experiences. I love to interact and meet with new people. Please go through my blog and contact me for any help or collaborations.";
    const heroTarget = document.getElementById("typed-desc");

    function typeWriter(text, target, speed = 35) {
        if (!target) return;
        target.textContent = "";
        let i = 0;
        function typing() {
            if (i < text.length) {
                target.textContent += text[i];
                i++;
                setTimeout(typing, speed);
            }
        }
        typing();
    }

    typeWriter(heroText, heroTarget);

    // Additional navigation setup (avoiding duplicate)
    // This is handled above in the main navigation section
});

// Update active navigation link
function updateActiveNavLink(targetId) {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === targetId) {
            link.classList.add('active');
        }
    });
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        max-width: 400px;
        animation: slideIn 0.3s ease-out;
    `;
    
    // Add close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.remove();
    });
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
    
    // Add to page
    document.body.appendChild(notification);
}

// Typewriter effect
function typeWriter(element, text, speed) {
    element.textContent = '';
    let i = 0;
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .animate-in {
        animation: fadeInUp 0.6s ease-out forwards;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        line-height: 1;
    }
    
    .notification-close:hover {
        opacity: 0.8;
    }
`;

document.head.appendChild(style);

// Add scroll-to-top functionality
const scrollToTopBtn = document.createElement('button');
scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
scrollToTopBtn.className = 'scroll-to-top';
scrollToTopBtn.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    background: var(--primary-color);
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    display: none;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    z-index: 1000;
`;

document.body.appendChild(scrollToTopBtn);

// Show/hide scroll-to-top button
window.addEventListener('scroll', function() {
    if (window.pageYOffset > 300) {
        scrollToTopBtn.style.display = 'flex';
    } else {
        scrollToTopBtn.style.display = 'none';
    }
});

// Scroll to top functionality
scrollToTopBtn.addEventListener('click', function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Enhanced hover effects and animations
document.addEventListener('DOMContentLoaded', function() {
    const updateMessages = document.querySelectorAll('.skills-update-message, .projects-update-message');
    
    updateMessages.forEach(message => {
        message.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.03)';
            this.style.boxShadow = 'var(--shadow-2xl), var(--shadow-glow)';
        });
        
        message.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = 'var(--shadow-medium)';
        });
    });

    // Add floating animation to profile placeholder
    const profilePlaceholder = document.querySelector('.profile-placeholder');
    if (profilePlaceholder) {
        profilePlaceholder.style.animation = 'float 6s ease-in-out infinite';
    }

    // Add pulse animation to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.animation = 'pulse 0.6s ease-in-out';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.animation = 'none';
        });
    });

    // Add ripple effect to form inputs
    const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.style.transform = 'scale(1.02)';
            this.style.boxShadow = 'var(--shadow-medium), var(--shadow-accent)';
        });
        
        input.addEventListener('blur', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = 'var(--shadow-light)';
        });
    });

    // Add staggered animation to about cards
    const aboutCards = document.querySelectorAll('.about-card');
    aboutCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.2}s`;
        card.classList.add('slide-in-up');
    });

    // Add typing effect with enhanced styling
    const heroDescription = document.querySelector('.hero-description');
    if (heroDescription) {
        heroDescription.style.opacity = '0';
        heroDescription.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            typeWriter(heroDescription, heroDescription.textContent, 50);
        }, 1000);
    }

    // Add particle effects to header
    createParticles();
    
    // Add scroll-triggered animations
    addScrollAnimations();
});

// Create optimized floating particles in header
function createParticles() {
    const header = document.querySelector('.header');
    // Create optimized floating particles in header
    for (let i = 0; i < 6; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: 3px;
            height: 3px;
            background: rgba(255, 255, 255, 0.4);
            border-radius: 50%;
            pointer-events: none;
            animation: float-particle ${5 + Math.random() * 3}s ease-in-out infinite;
            animation-delay: ${Math.random() * 2}s;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            will-change: transform;
        `;
        header.appendChild(particle);
    }
}

// Optimized scroll-triggered animations
function addScrollAnimations() {
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -30px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, observerOptions);
    
    const animateElements = document.querySelectorAll('.about-card, .skills-update-message, .projects-update-message');
    animateElements.forEach(el => observer.observe(el));
}
