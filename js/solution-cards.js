// Solution Cards Scroll Animation
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.solution-card');
    const solutionSection = document.querySelector('.our-solution');
    
    if (!cards.length || !solutionSection) return;

    function handleScroll() {
        const sectionTop = solutionSection.offsetTop;
        const sectionHeight = solutionSection.offsetHeight;
        const scrollPosition = window.scrollY;
        const windowHeight = window.innerHeight;

        // Calculate progress through the section (0 to 1)
        const scrollStart = sectionTop - windowHeight / 2;
        const scrollEnd = sectionTop + sectionHeight - windowHeight / 2;
        const totalScrollDistance = scrollEnd - scrollStart;
        const currentScroll = scrollPosition - scrollStart;
        const sectionProgress = Math.max(0, Math.min(1, currentScroll / totalScrollDistance));

        // Determine which card should be active based on scroll progress
        // Divide the section into equal parts for each card
        const totalCards = cards.length;
        const progressPerCard = 1 / totalCards;

        cards.forEach((card, index) => {
            // Calculate the range for this card
            const cardStartProgress = index * progressPerCard;
            const cardEndProgress = (index + 1) * progressPerCard;
            
            // Calculate how far we are within this card's range
            let cardProgress = 0;
            
            if (sectionProgress >= cardStartProgress && sectionProgress <= cardEndProgress) {
                // We're in this card's range
                cardProgress = (sectionProgress - cardStartProgress) / progressPerCard;
            } else if (sectionProgress > cardEndProgress) {
                // We've passed this card
                cardProgress = 1;
            }

            // Determine visibility
            let opacity, scale, blur, zIndex;
            
            if (sectionProgress >= cardStartProgress && sectionProgress < cardEndProgress) {
                // This is the active card
                const fadeInProgress = Math.min(1, cardProgress * 3); // Fade in quickly
                opacity = fadeInProgress;
                scale = 0.95 + (fadeInProgress * 0.05);
                blur = Math.max(0, 3 - (fadeInProgress * 3));
                zIndex = 10;
                card.classList.add('active');
            } else if (sectionProgress >= cardEndProgress) {
                // Card has been passed, fade it out
                const fadeOutStart = cardEndProgress;
                const fadeOutEnd = Math.min(cardEndProgress + 0.1, 1);
                const fadeOutProgress = (sectionProgress - fadeOutStart) / (fadeOutEnd - fadeOutStart);
                opacity = Math.max(0, 1 - fadeOutProgress);
                scale = 1;
                blur = 0;
                zIndex = 5;
                card.classList.remove('active');
            } else {
                // Card hasn't appeared yet
                opacity = 0;
                scale = 0.95;
                blur = 3;
                zIndex = 1;
                card.classList.remove('active');
            }
            
            // Apply transformations
            card.style.opacity = opacity;
            card.style.transform = `scale(${scale})`;
            card.style.filter = `blur(${blur}px)`;
            card.style.zIndex = zIndex;
        });
    }

    // Throttle scroll event for performance
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    });

    // Initial call
    handleScroll();
});
