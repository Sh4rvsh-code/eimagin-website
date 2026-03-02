# eimagin — Premium Web Development Studio

> A high-converting, dark-themed startup website showcasing web development services.  
> Built with pure HTML, CSS, and vanilla JavaScript — **zero dependencies, zero build step**.

---

## 🚀 Quick Start

```bash
# Option 1 — open directly in browser
open startup-website/index.html

# Option 2 — serve with VS Code Live Server
# Install the "Live Server" extension, right-click index.html → Open with Live Server

# Option 3 — serve with Python
cd startup-website
python3 -m http.server 3000
# Visit http://localhost:3000
```

---

## 📁 Project Structure

```
startup-website/
├── index.html            # Single-page application — all sections
├── css/
│   └── styles.css        # All styles (CSS variables, animations, responsive)
├── js/
│   └── main.js           # All interactivity (15 feature modules)
├── images/
│   ├── projects/         # Project screenshots (add your own)
│   └── icons/            # Custom SVG icons (add your own)
└── README.md             # This file
```

---

## 🎨 Design System

### Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--bg-primary` | `#0B0B0F` | Page background |
| `--bg-secondary` | `#111118` | Section backgrounds |
| `--bg-card` | `#16161f` | Card backgrounds |
| `--purple` | `#8B5CF6` | Primary accent |
| `--purple-deep` | `#7C3AED` | Buttons, gradients |
| `--purple-glow` | `rgba(139,92,246,0.35)` | Glow effects |
| `--text-primary` | `#E5E7EB` | Headings, body |
| `--text-secondary` | `#9CA3AF` | Subtext |
| `--text-muted` | `#6B7280` | Labels, captions |

### Typography

| Font | Usage |
|------|-------|
| **Inter** | Body copy, headings, UI |
| **JetBrains Mono** | Code blocks, badges, numbers |

### Spacing Scale

Using `clamp()` for fluid sizing and `section-pad` utility class (`padding: 100px 0`).

---

## 🧩 Page Sections

| Section | ID | Description |
|---------|----|-------------|
| Navigation | — | Sticky nav with glass blur on scroll |
| Hero | `#home` | Headline, code window, floating metric cards |
| Trusted By | — | Infinite logo marquee |
| Services | `#services` | 6-card grid with icon + tags |
| Stats Banner | — | Animated counter showcase |
| Portfolio | `#work` | Project cards with mockup previews |
| Process | `#process` | 4-step vertical timeline |
| Testimonials | `#about` | 3-column review grid |
| Tech Stack | — | Technology icon grid |
| Contact | `#contact` | Form with validation + toast notification |
| Footer | — | Brand, links, social icons |

---

## ⚙️ JavaScript Features (`js/main.js`)

| Module | Description |
|--------|-------------|
| **Cursor Glow** | Smooth radial gradient that follows the mouse |
| **Particle Canvas** | WebGL-free particle network with mouse repulsion |
| **Navbar Scroll** | Glassmorphism effect triggers after 50px scroll |
| **Mobile Menu** | Slide-in drawer with hamburger toggle |
| **Typing Effect** | Rotating text with typewriter animation |
| **Scroll Reveal** | IntersectionObserver fade-in with stagger delays |
| **Counter Animation** | Eased number count-up on scroll entry |
| **Smooth Scroll** | Native smooth scrolling for all anchor links |
| **Active Nav Link** | Highlights current section in navbar |
| **Form Validation** | Client-side validation with toast feedback |
| **Tilt Effect** | CSS perspective tilt on card hover |
| **Hero Parallax** | Subtle mouse-tracking parallax on hero visual |
| **Marquee Control** | Pause-on-hover for logo marquee |
| **Reduced Motion** | Respects `prefers-reduced-motion` media query |
| **Page Fade-In** | Smooth opacity transition on initial load |

---

## 🛠 Customisation Guide

### 1 — Update Brand

In `index.html`, search for `eimagin` and replace with your studio/company name.

```html
<!-- Navbar logo -->
<span class="logo-bracket">&lt;</span>eimagin<span class="logo-bracket">/&gt;</span>
```

### 2 — Change Colors

Edit the CSS variables in `css/styles.css`:

```css
:root {
  --purple:      #8B5CF6;   /* ← Change this to your brand color */
  --purple-deep: #7C3AED;
}
```

### 3 — Add Rotating Words

In `js/main.js`, update the `words` array in the typing effect module:

```js
const words = ['Convert.', 'Impress.', 'Perform.', 'Scale.', 'Stand Out.'];
```

### 4 — Connect the Contact Form

Replace the `setTimeout` mock in `main.js` with a real API call:

```js
// Example with Formspree
const res = await fetch('https://formspree.io/f/YOUR_ID', {
  method: 'POST',
  body: new FormData(form),
  headers: { 'Accept': 'application/json' },
});
if (res.ok) showToast("Message sent! 🚀");
```

### 5 — Add Real Project Images

Place screenshots in `images/projects/` and update the `project-img` divs:

```html
<div class="project-img">
  <img src="images/projects/novadash.webp" alt="NovaDash Analytics Platform" />
</div>
```

---

## 📱 Responsive Breakpoints

| Breakpoint | Layout changes |
|------------|---------------|
| `> 1024px` | Full desktop layout |
| `≤ 1024px` | Services 2-col, tech 4-col, stats 2×2 |
| `≤ 900px` | Hero stacks vertically, single-col testimonials |
| `≤ 768px` | Mobile nav drawer, all grids single-column |
| `≤ 480px` | Adjusted font sizes, hero stats vertical |

---

## ♿ Accessibility

- Semantic HTML5 landmarks (`nav`, `section`, `article`, `blockquote`, `footer`)
- `aria-label` on icon buttons
- `prefers-reduced-motion` support — disables animations for users who prefer it
- Keyboard-navigable navigation and form
- High contrast text ratios throughout

---

## 📦 Performance

- **Zero runtime dependencies** — no React, no jQuery, no bundler needed
- Fonts loaded via `font-display: swap` (Google Fonts)
- `IntersectionObserver` used for lazy animation triggers
- `requestAnimationFrame` for all canvas and cursor animations
- Images use `webp` format recommended for production

---

## 📄 License

MIT — free to use, modify, and distribute.

---

*Built with 💜 by eimagin*
