// Mobile menu toggle
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', function() {
    navLinks.classList.toggle('active');
    this.querySelector('i').classList.toggle('fa-bars');
    this.querySelector('i').classList.toggle('fa-times');
});

// Close mobile menu when clicking outside
document.addEventListener('click', function(event) {
    if (!event.target.closest('.navbar')) {
        navLinks.classList.remove('active');
        menuToggle.querySelector('i').classList.remove('fa-times');
        menuToggle.querySelector('i').classList.add('fa-bars');
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if(targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if(targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            navLinks.classList.remove('active');
            menuToggle.querySelector('i').classList.remove('fa-times');
            menuToggle.querySelector('i').classList.add('fa-bars');
        }
    });
});

// Form submission with email integration
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value || 'Not provided',
        message: document.getElementById('message').value,
        timestamp: new Date().toISOString()
    };
    
    // Show loading state
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    // Here you would normally send the data to a server
    // For now, we'll simulate API call and send email using mailto
    setTimeout(() => {
        // Create mailto link
        const subject = `New Contact Message from ${formData.name}`;
        const body = `Name: ${formData.name}%0AEmail: ${formData.email}%0APhone: ${formData.phone}%0A%0AMessage:%0A${formData.message}`;
        
        // Open email client
        window.location.href = `mailto:abuuafham@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        
        // Show success message
        showNotification('Message prepared in email! Please send it from your email client.', 'success');
        
        // Reset form
        this.reset();
        
        // Restore button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 1500);
});

// Notification system
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 15px 20px;
            border-radius: var(--radius);
            display: flex;
            align-items: center;
            gap: 12px;
            box-shadow: var(--shadow-lg);
            z-index: 10000;
            animation: slideIn 0.3s ease;
            max-width: 400px;
        }
        
        .notification-success {
            background: linear-gradient(135deg, #10b981, #059669);
            color: white;
        }
        
        .notification-error {
            background: linear-gradient(135deg, #ef4444, #dc2626);
            color: white;
        }
        
        .notification-close {
            background: none;
            border: none;
            color: inherit;
            cursor: pointer;
            margin-left: auto;
            padding: 0;
            font-size: 1rem;
        }
        
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
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(notification);
    
    // Close button functionality
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Skill bars animation on scroll
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px 0px -50px 0px'
};

const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if(entry.isIntersecting) {
            const skillLevels = entry.target.querySelectorAll('.skill-level');
            skillLevels.forEach(level => {
                const width = level.style.width;
                level.style.width = '0';
                setTimeout(() => {
                    level.style.transition = 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
                    level.style.width = width;
                }, 300);
            });
            skillObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all skill categories
document.querySelectorAll('.skill-category').forEach(skill => {
    skillObserver.observe(skill);
});

// Add active class to nav links based on scroll position
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset + 100;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelector(`.nav-links a[href="#${sectionId}"]`)?.classList.add('active');
        } else {
            document.querySelector(`.nav-links a[href="#${sectionId}"]`)?.classList.remove('active');
        }
    });
});

// Add click-to-call functionality
document.querySelectorAll('[href^="tel:"]').forEach(link => {
    link.addEventListener('click', function(e) {
        if (window.innerWidth > 768) {
            e.preventDefault();
            const phoneNumber = this.getAttribute('href').replace('tel:', '');
            showNotification(`Calling ${phoneNumber}...`, 'success');
            // In a real implementation, you might want to use a proper call dialog
        }
    });
});

// Add copy email functionality
document.querySelectorAll('[href^="mailto:"]').forEach(link => {
    link.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        const email = this.getAttribute('href').replace('mailto:', '');
        navigator.clipboard.writeText(email).then(() => {
            showNotification('Email address copied to clipboard!', 'success');
        });
    });
});

// Initialize with email ready notification
window.addEventListener('load', () => {
    console.log('👋 Hello from Tajtech!');
    console.log('📧 Email: abuuafham@gmail.com');
    console.log('📱 Phone: +251 953 007845');
    console.log('🛍️ Shopify: xp1crk-nh.myshopify.com');
});
// Social media click tracking
document.querySelectorAll('.social-links a').forEach(link => {
    link.addEventListener('click', function(e) {
        const platform = this.getAttribute('title');
        console.log(`Opening ${platform} profile...`);
        
        // You can add analytics tracking here
        // Example: trackSocialClick(platform);
    });
});

// Console greeting with all social media
// Update console logs
window.addEventListener('load', () => {
    console.log('👋 Hello from taju-shekabdi-abdal!');
    console.log('🎓 Education: Jigjiga University');
    console.log('💻 GitHub: https://github.com/taju-shekabdi-abdal');
    console.log('📘 Facebook: https://web.facebook.com/tajushekabdi');
    console.log('🎮 Discord: https://discord.com/users/tajushekabdi');
    console.log('📸 Instagram: https://www.instagram.com/tajushekabdi/');
    console.log('👽 Reddit: https://www.reddit.com/user/DecisionWonderful791');
    console.log('📧 Email: abuuafham@gmail.com');
    console.log('📱 Phone: +251 953 007845');
    console.log('🛍️ Shopify: xp1crk-nh.myshopify.com');
    console.log('🌐 Website: https://taju-shekabdi-abdal.github.io');
});

