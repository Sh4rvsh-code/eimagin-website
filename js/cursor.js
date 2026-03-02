document.addEventListener('DOMContentLoaded', () => {
    const cursorBubble = document.querySelector('.cursor-bubble');
    const projectLinks = document.querySelectorAll('.gallery-card-link');
    const projectCards = document.querySelectorAll('.gallery-card');

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    // Move cursor bubble
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Immediate update for better responsiveness, or use requestAnimationFrame for smoothness
        cursorBubble.style.left = `${mouseX}px`;
        cursorBubble.style.top = `${mouseY}px`;
    });

    // Show bubble on hover
    const handleMouseEnter = () => {
        cursorBubble.classList.add('active');
    };

    const handleMouseLeave = () => {
        cursorBubble.classList.remove('active');
    };

    [...projectLinks, ...projectCards].forEach(el => {
        el.addEventListener('mouseenter', handleMouseEnter);
        el.addEventListener('mouseleave', handleMouseLeave);
        // Also ensure cursor is hidden when leaving the element
    });

    // Ensure cursor is hidden initially or when leaving window
    document.addEventListener('mouseleave', () => {
        cursorBubble.classList.remove('active');
    });
});