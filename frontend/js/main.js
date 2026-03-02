// ===================================
// MOBILE NAVIGATION
// ===================================

const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// ===================================
// SCROLL ANIMATIONS
// ===================================

// Navbar glass intensity on scroll
window.addEventListener('scroll', () => {
    const navInner = document.querySelector('.nav-inner');
    if (!navInner) return;
    if (window.scrollY > 50) {
        navInner.style.background = 'rgba(20, 20, 30, 0.78)';
        navInner.style.boxShadow = '0 8px 40px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.08)';
    } else {
        navInner.style.background = 'rgba(26, 26, 36, 0.55)';
        navInner.style.boxShadow = '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)';
    }
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards and sections
document.querySelectorAll('.service-card, .project-card, .about-card, .feature-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// ===================================
// CONTACT FORM HANDLING
// ===================================

const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get form data
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value
    };

    // Simulate form submission (replace with actual backend call)
    console.log('Form submitted:', formData);

    // Show success message
    alert("Thank you for your message! We'll get back to you soon.");

    // Reset form
    contactForm.reset();

    // In production, replace the above with:
    // fetch('/api/contact', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(formData)
    // })
    // .then(response => response.json())
    // .then(data => {
    //     alert('Message sent successfully!');
    //     contactForm.reset();
    // })
    // .catch(error => {
    //     alert('Error sending message. Please try again.');
    // });
});

// ===================================
// SMOOTH SCROLL ENHANCEMENT
// ===================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ===================================
// CURSOR GLOW EFFECT (Optional Enhancement)
// ===================================

const createCursorGlow = () => {
    const cursor = document.createElement('div');
    cursor.className = 'cursor-glow';
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });
};

// Uncomment to enable cursor glow:
// createCursorGlow();

// Add this CSS if you enable cursor glow:
/*
.cursor-glow {
    position: fixed;
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%);
    pointer-events: none;
    transform: translate(-50%, -50%);
    z-index: 9999;
    transition: transform 0.2s ease;
}
*/

// ===================================
// CARD SWAP INITIALIZATION
// ===================================

// Card swap removed from Our Solution section
/*
if (typeof CardSwap !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('Initializing CardSwap...');
        new CardSwap('card-swap-container', {
            width: 480,
            height: 360,
            cardDistance: 0,
            verticalDistance: 60,
            delay: 3000,
            pauseOnHover: false,
            skewAmount: 0,
            easing: 'power2'
        });
    });
}
*/

// ===================================
// PROJECT SLIDER
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Project Slider: Initializing...');
    
    const slides = document.querySelectorAll('.project-card-featured');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dots = document.querySelectorAll('.dot');
    
    console.log('📊 Found elements:', { 
        slides: slides.length, 
        prevBtn: !!prevBtn, 
        nextBtn: !!nextBtn, 
        dots: dots.length 
    });
    
    // Only run if slider exists
    if (!slides.length || !prevBtn || !nextBtn) {
        console.error('❌ Project Slider: Missing required elements');
        return;
    }
    
    let currentSlide = 0;
    
    function showSlide(index) {
        console.log(`🔄 Switching to slide ${index} (from ${currentSlide})`);
        
        // Handle wrapping around
        let newIndex = index;
        if (index >= slides.length) newIndex = 0;
        if (index < 0) newIndex = slides.length - 1;
        
        currentSlide = newIndex;
        
        // Remove active class from all
        slides.forEach((slide, i) => {
            slide.style.opacity = '0';
            slide.style.transform = 'translateX(100px) scale(0.95)';
            slide.style.pointerEvents = 'none';
            slide.style.zIndex = '1';
            slide.classList.remove('active');
            console.log(`  Hide slide ${i}`);
        });
        
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Show current slide
        const activeSlide = slides[currentSlide];
        
        // Force reflow to ensure transition works
        void activeSlide.offsetWidth; 
        
        activeSlide.style.opacity = '1';
        activeSlide.style.transform = 'translateX(0) scale(1)';
        activeSlide.style.pointerEvents = 'auto';
        activeSlide.style.zIndex = '10';
        activeSlide.classList.add('active');
        
        console.log(`  ✅ Show slide ${currentSlide}`);
        
        if (dots[currentSlide]) dots[currentSlide].classList.add('active');
    }
    
    // Event Listeners
    nextBtn.addEventListener('click', () => {
        console.log('👉 Next button clicked');
        showSlide(currentSlide + 1);
    });
    
    prevBtn.addEventListener('click', () => {
        console.log('👈 Prev button clicked');
        showSlide(currentSlide - 1);
    });
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            console.log(`🔘 Dot ${index} clicked`);
            showSlide(index);
        });
    });
    
    // Initialize first slide state explicitly
    console.log('🎬 Initializing first slide...');
    showSlide(0);
    
    console.log('✅ Project Slider: Initialization complete!');
});

// ===================================
// PIXEL SNOW FOR CONTACT SECTION
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('pixel-snow-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    const particles = [];
    const particleCount = 80;
    
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 2;
            this.speedY = Math.random() * 1 + 0.5;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.opacity = Math.random() * 0.5 + 0.3;
        }
        
        update() {
            this.y += this.speedY;
            this.x += this.speedX;
            
            if (this.y > canvas.height) {
                this.y = -10;
                this.x = Math.random() * canvas.width;
            }
            
            if (this.x > canvas.width) {
                this.x = 0;
            } else if (this.x < 0) {
                this.x = canvas.width;
            }
        }
        
        draw() {
            ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
            ctx.fillRect(this.x, this.y, this.size, this.size);
        }
    }
    
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
});
// ===================================
// CONTACT TABS SWITCHING
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    if (!tabButtons.length || !tabContents.length) return;
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Show corresponding tab content
            const targetContent = document.getElementById(`${targetTab}-tab`);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
});