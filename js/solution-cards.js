// ===================================
// SOLUTION SECTION — SCROLL-DRIVEN CARD SWAP
// ===================================
//
// Architecture:
//   .our-solution          — 300 vh tall, normal flow
//   .our-solution > .container — also 300 vh (gives sticky room)
//   .solution-content      — position:sticky; top:0; height:100vh
//                            stays glued to viewport during the scroll
//   .solution-cards-wrapper — position:relative; fixed height
//   .solution-card ×3      — position:absolute, all stacked, only one visible
//
// Scroll progress (0→1) maps:
//   0.00 – 0.34  → card 0 (Design)
//   0.34 – 0.67  → card 1 (Branding)
//   0.67 – 1.00  → card 2 (Development)

document.addEventListener('DOMContentLoaded', function () {
    const section = document.querySelector('.our-solution');
    const cards   = document.querySelectorAll('.solution-card');
    const steps   = document.querySelectorAll('.solution-step');

    if (!section || !cards.length) return;

    let currentIndex = -1;
    let exitTimer    = null;

    // ── Show the card at `newIndex`, animate out the previous one ──────────
    function activate(newIndex) {
        if (newIndex === currentIndex) return;

        const prev = currentIndex;
        currentIndex = newIndex;

        // Trigger exit on the old card
        if (prev >= 0) {
            clearTimeout(exitTimer);
            cards[prev].classList.remove('active');
            cards[prev].classList.add('exit');
            exitTimer = setTimeout(() => cards[prev].classList.remove('exit'), 600);
        }

        // Clean up any lingering states on all other cards
        cards.forEach((c, i) => {
            if (i !== prev) c.classList.remove('active', 'exit');
        });

        // Activate the new card
        cards[newIndex].classList.add('active');

        // Sync step indicators
        steps.forEach((s, i) => s.classList.toggle('active', i === newIndex));
    }

    // ── Calculate which card should be active based on scroll position ─────
    function onScroll() {
        const sectionTop = section.getBoundingClientRect().top + window.scrollY;
        const sectionH   = section.offsetHeight;
        const viewportH  = window.innerHeight;

        // How far the user has scrolled past the section's top edge
        const scrolled = window.scrollY - sectionTop;

        // The sticky element (100vh) is visible for (sectionH - viewportH) px of scroll
        const range = sectionH - viewportH;

        if (range <= 0) { activate(0); return; }

        const progress = Math.max(0, Math.min(1, scrolled / range));

        const idx = progress < 0.34 ? 0 : progress < 0.67 ? 1 : 2;
        activate(idx);
    }

    // ── Throttle via rAF for 60fps ─────────────────────────────────────────
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => { onScroll(); ticking = false; });
            ticking = true;
        }
    }, { passive: true });

    // ── Init ───────────────────────────────────────────────────────────────
    activate(0);   // make card 0 visible immediately
    onScroll();    // sync to current scroll position on load
});
