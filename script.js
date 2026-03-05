document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger);

    // Initialize Lenis for buttery smooth virtual scrolling
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
    });

    // Tell GSAP ScrollTrigger to sync with Lenis' scroll position instead of native scroll
    lenis.on('scroll', ScrollTrigger.update);

    // Add Lenis's request animation frame to GSAP's ticker
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

    // Disable GSAP's native lag smoothing to prevent conflicts with Lenis
    gsap.ticker.lagSmoothing(0);

    // Navbar Scroll Background Effect
    const navMenu = document.querySelector('.Nav_mainNav__pyKU_');
    const navRoot = document.querySelector('nav.Nav');
    const mobilePillNav = document.getElementById('mobile-pill-nav');
    const mainHamburger = document.querySelector('.Hamburger_root__vVMOe');
    let lastScrollY = window.scrollY;

    if (navMenu) {
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            const isMobile = window.innerWidth <= 768;

            if (currentScrollY > 50) {
                navMenu.classList.add('scrolled');
                if (navRoot) navRoot.classList.add('scrolled');

                // Show pill only on mobile
                if (isMobile && mobilePillNav) {
                    mobilePillNav.classList.add('visible');
                }

                if (currentScrollY > lastScrollY) {
                    navMenu.classList.add('scrolled-down');
                } else {
                    navMenu.classList.remove('scrolled-down');
                }
            } else {
                navMenu.classList.remove('scrolled');
                navMenu.classList.remove('scrolled-down');
                if (navRoot) navRoot.classList.remove('scrolled');

                if (mobilePillNav) {
                    mobilePillNav.classList.remove('visible');
                }
            }

            lastScrollY = currentScrollY;
        });
    }

    // Video Controls
    const heroMuteButton = document.getElementById('heroMuteButton');
    const heroMuteIcon = document.getElementById('heroMuteIcon');
    const heroVideoEl = document.getElementById('heroVideoEl');

    if (heroVideoEl && heroMuteButton) {
        const muteSVG = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true" class="VideoButton_svg___hJhE" style="width: 1.2rem; height: 1.2rem;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" /></svg>`;
        const unmuteSVG = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true" class="VideoButton_svg___hJhE" style="width: 1.2rem; height: 1.2rem;"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>`;

        heroMuteButton.addEventListener('click', () => {
            if (heroVideoEl.muted) {
                heroVideoEl.muted = false;
                heroMuteIcon.innerHTML = unmuteSVG;
                heroMuteButton.setAttribute('aria-label', 'Mute');
            } else {
                heroVideoEl.muted = true;
                heroMuteIcon.innerHTML = muteSVG;
                heroMuteButton.setAttribute('aria-label', 'Unmute');
            }
        });
    }

    // Make sure the title container is visible, as it might have a default opacity of 0 in the CSS.
    gsap.set('.HomepageHeroBespoke_title__C_bJm', { opacity: 1 });

    // Set initial states for split words in case they are defined with opacity 1 by default
    gsap.set('.split-word', { opacity: 0, y: 40 });

    // Entrance animation for the split words
    gsap.to('.split-word', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.05,
        ease: 'power3.out',
        delay: 0.2
    });

    // Animate video zooming slightly similar to Zoox
    gsap.fromTo('.HomepageHeroBespoke_video__lYhfm',
        { scale: 1.0 },
        {
            scale: 1.05,
            scrollTrigger: {
                trigger: '.HomepageHeroBespoke',
                start: 'top top',
                end: 'bottom top',
                scrub: 1
            }
        }
    );



    // ===== Custom Full-Screen Menu Overlay =====
    const menuOverlay = document.getElementById('menuOverlay');
    const menuCloseBtn = document.getElementById('menuClose');

    function openMenu() {
        if (!menuOverlay) return;
        menuOverlay.classList.add('is-open');
        menuOverlay.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // prevent body scroll
    }

    function closeMenu() {
        if (!menuOverlay) return;
        menuOverlay.classList.remove('is-open');
        menuOverlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    // Wire *all* hamburger buttons (main nav + mobile pill) to open the overlay
    document.querySelectorAll(
        '.Hamburger_root__vVMOe, #pillHamburger, .pill-hamburger'
    ).forEach(btn => {
        btn.addEventListener('click', openMenu);
    });

    // Close on X button
    if (menuCloseBtn) menuCloseBtn.addEventListener('click', closeMenu);

    // Close on backdrop click (click outside the white panel)
    if (menuOverlay) {
        menuOverlay.addEventListener('click', (e) => {
            if (e.target === menuOverlay) closeMenu();
        });
    }

    // Close when a nav link is clicked
    if (menuOverlay) {
        menuOverlay.querySelectorAll('.menu-link, .menu-footer a').forEach(link => {
            link.addEventListener('click', closeMenu);
        });
    }

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMenu();
    });
    // ===== End Menu Overlay Logic =====

    // --- Section 2 Animations (.HomepageContentBespoke) ---

    // --- Section 2 Animations (.HomepageContentBespoke) ---

    gsap.set([
        '.HomepageContentBespoke_textContent__kspYU',
        '.HomepageContentBespoke_imageWrapper__R6zmp',
        '.TextContent_eyebrow__hvADT',
        '.split-line',
        '.HomepageContentBespoke_freedomEyebrow__nVT4E',
        '.HomepageContentBespoke_words__f48IG',
        '.HomepageContentBespoke_freedomsVideo__gP_HL'
    ], { opacity: 1, visibility: "visible" });

    // Reset properties
    gsap.set(".HomepageContentBespoke_textContainer__1TpyM", { clearProps: "all" });
    gsap.set(".HomepageContentBespoke_transformContainer__iPl8h", { clearProps: "all" });

    // Timeline 1: Entry Animation (Before Pinning, moving from bottom of screen to top)
    let animateInTl = gsap.timeline({
        scrollTrigger: {
            id: "Homepage-Content-Animate-In",
            trigger: ".HomepageContentBespoke_mainContainer__cuN8J",
            start: "top bottom",
            end: "top top",
            scrub: true
        }
    });

    animateInTl.addLabel("start", 0)
        .set(".HomepageContentBespoke_horizontalTextContainer__Jr0f0", { zIndex: 1 })
        .set(".HomepageContentBespoke_clipContainer__PaUmt", {
            "--clip-top": "2rem",
            "--clip-right": "75%",
            "--clip-bottom": "2rem",
            "--clip-left": "-25%",
            "--clip-border-radius": "3.6rem"
        })
        .set(".HomepageContentBespoke_transformContainer__iPl8h", { xPercent: -25 })
        .set(".HomepageContentBespoke_textContainer__1TpyM", { xPercent: -25, x: 40 })
        .to(".HomepageContentBespoke_clipContainer__PaUmt", {
            "--clip-top": "2rem",
            "--clip-right": "50%",
            "--clip-bottom": "2rem",
            "--clip-left": "2rem",
            "--clip-border-radius": "3.6rem",
            duration: 1,
            ease: "none"
        }, 0)
        .to(".HomepageContentBespoke_transformContainer__iPl8h", { xPercent: 0, duration: 1, ease: "none" }, 0)
        .to(".HomepageContentBespoke_horizontalTextContainer__Jr0f0", { xPercent: 25, x: 0, duration: 1, ease: "none" }, 0)
        .to(".HomepageContentBespoke_textContainer__1TpyM", { xPercent: 0, duration: 1, ease: "none" }, 0);

    // Timeline 2: Scroll Pinning & Expansion (While Pinned at the top of the screen)
    let scrollPinningTl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
            id: "Homepage-Content-Scroll-Pinning",
            trigger: ".HomepageContentBespoke_mainContainer__cuN8J",
            start: "top top",
            end: "+=250%",
            scrub: true,
            pin: true
        }
    });

    scrollPinningTl.addLabel("pinned-start", 0)
        .to(".HomepageContentBespoke_horizontalTextContainer__Jr0f0", { xPercent: 75, x: -40, duration: 2.5, ease: "power2.inOut" }, "pinned-start")
        .to(".HomepageContentBespoke_clipContainer__PaUmt", { "--clip-border-radius": "3.6rem", duration: 0.5 }, "pinned-start")
        .to(".HomepageContentBespoke_clipContainer__PaUmt", {
            "--clip-top": "2rem",
            "--clip-right": "2rem",
            "--clip-bottom": "2rem",
            "--clip-left": "2rem",
            duration: 2.5,
            ease: "power2.inOut"
        }, "pinned-start")
        .addLabel("end");




    // 2. Vertical Reel ("Workspace", "Chill Space"...) & Video Scrubbing
    let words = gsap.utils.toArray('.HomepageContentBespoke_heading__N1SMd');
    let sec2Video = document.querySelector('.HomepageContentBespoke_freedomsVideo__gP_HL video');

    // --- Section 4: Crossfade Animation ---
    const crossfadeText = document.querySelectorAll('#section4-crossfade .crossfade-text');
    const crossfadeImgs = document.querySelectorAll('#section4-crossfade .crossfade-img');
    const wordOverlay = document.querySelector('#section4-crossfade .s4-word-overlay');

    // --- Section 2 Mobile Image Scale Animation ---
    const section2MobileImage = document.querySelector('.section2-mobile-image img');
    if (section2MobileImage && window.innerWidth <= 768) {
        gsap.fromTo('.section2-mobile-image img',
            {
                scale: 0.85,
                opacity: 0.5
            },
            {
                scale: 1,
                opacity: 1,
                duration: 1,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: '.section2-mobile-image',
                    start: 'top 80%',
                    end: 'top 30%',
                    scrub: 1,
                    toggleActions: 'play none none reverse'
                }
            }
        );

        // Also animate the text elements
        gsap.fromTo('.section2-mobile-eyebrow',
            {
                y: 30,
                opacity: 0
            },
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: '.section2-mobile-eyebrow',
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                }
            }
        );

        gsap.fromTo('.section2-mobile-heading',
            {
                y: 30,
                opacity: 0
            },
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
                delay: 0.2,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: '.section2-mobile-heading',
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                }
            }
        );
    }

    if (crossfadeText.length > 0 && crossfadeImgs.length > 0) {
        let currentIndex = 0;

        // Cycle every 2 seconds
        setInterval(() => {
            // Remove active classes from old elements
            crossfadeText[currentIndex].classList.remove('active');
            crossfadeImgs[currentIndex].classList.remove('active');

            // Increment and wrap around index
            currentIndex = (currentIndex + 1) % crossfadeText.length;

            // Add active classes to new elements
            crossfadeText[currentIndex].classList.add('active');
            crossfadeImgs[currentIndex].classList.add('active');

            // Sync mobile word overlay
            if (wordOverlay) {
                wordOverlay.textContent = crossfadeText[currentIndex].textContent;
            }
        }, 2000); // 2000ms = 2 seconds
    }

    // --- Dynamic SVG Mask for Section 4 (Zoox exact pixel-cutout replication) ---
    function updateSection4Mask() {
        const card = document.querySelector('#section4-crossfade .Section3_mediaCard');
        const overlay = document.querySelector('#section4-crossfade .s4-word-overlay');
        const pathEl = document.querySelector('#section4-cutout path');

        if (!card || !overlay || !pathEl) return;

        const w = card.offsetWidth;
        const h = card.offsetHeight;
        if (w === 0 || h === 0) return;

        const cw = overlay.offsetWidth;
        const ch = overlay.offsetHeight;

        // Match the border-radius applied in CSS
        const rootFontSize = parseFloat(window.getComputedStyle(document.documentElement).fontSize) || 10;
        const r = 2.8 * rootFontSize; // 2.8rem

        // Safety check, avoid breaking if cutout is bigger than card
        if (cw > w || ch > h) return;

        // Bezier ratio for smooth circle approximation
        const k = r * 0.28;

        const d = `M0 ${r} ` +
            `C 0 ${k} ${k} 0 ${r} 0 ` +
            `L ${w - r} 0 ` +
            `C ${w - k} 0 ${w} ${k} ${w} ${r} ` +
            `L ${w} ${h - ch - r} ` +
            `C ${w} ${h - ch - k} ${w - k} ${h - ch} ${w - r} ${h - ch} ` +
            `L ${w - cw + r} ${h - ch} ` +
            `C ${w - cw + k} ${h - ch} ${w - cw} ${h - ch + k} ${w - cw} ${h - ch + r} ` +
            `L ${w - cw} ${h - r} ` +
            `C ${w - cw} ${h - k} ${w - cw - k} ${h} ${w - cw - r} ${h} ` +
            `L ${r} ${h} ` +
            `C ${k} ${h} 0 ${h - k} 0 ${h - r} Z`;

        pathEl.setAttribute('d', d);
    }

    // Run on load and whenever the card wrapper resizes
    const s4Observer = new ResizeObserver(updateSection4Mask);
    const cardWrap = document.querySelector('#section4-crossfade .s4-card-wrap');
    if (cardWrap) {
        s4Observer.observe(cardWrap);
        updateSection4Mask();
    }

    // --- Section 4 Scroll Animation (Desktop Only) ---
    if (window.innerWidth > 768) {
        const section4 = document.getElementById('section4-crossfade');
        const s4TextCard = document.querySelector('#section4-crossfade .Section3_textCard');
        const s4Images = document.querySelectorAll('#section4-crossfade .crossfade-img');

        if (section4 && s4TextCard) {
            // Give the glass panel a slick entrance from the left
            gsap.fromTo(s4TextCard,
                {
                    x: -200,
                    opacity: 0,
                    filter: 'blur(10px)'
                },
                {
                    x: 0,
                    opacity: 1,
                    filter: 'blur(0px)',
                    duration: 1.2,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: section4,
                        start: "top 70%", // Start early enough to be seen entering
                        end: "center center",
                        scrub: 1 // Link to scroll for that butter-smooth feeling
                    }
                }
            );

            // Subtle parallax zoom on the background images as you scroll through the section
            s4Images.forEach(img => {
                gsap.fromTo(img,
                    { scale: 1 },
                    {
                        scale: 1.1,
                        ease: "none",
                        scrollTrigger: {
                            trigger: section4,
                            start: "top bottom",
                            end: "bottom top",
                            scrub: true
                        }
                    }
                );
            });
        }
    }

    // --- Section 5: Feature Section Animations (Apple-style) ---
    const section5 = document.getElementById('section5-feature');
    if (section5) {
        // 1. Text entrance (Top Area)
        const topTextElements = section5.querySelectorAll('.s5-eyebrow, .s5-subpara');
        if (topTextElements.length > 0) {
            gsap.fromTo(topTextElements,
                { y: 60, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1.2,
                    stagger: 0.2,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: '.s5-text-top',
                        start: 'top 85%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        }

        // 2. Image scales from small to big on scroll (DESKTOP ONLY)
        if (window.innerWidth > 768) {
            // Give the wrapper hidden overflow if it doesn't have it, and scale the image smoothly
            gsap.set('.s5-image-wrapper', { overflow: 'hidden', borderRadius: '3.6rem', transform: 'translateZ(0)' });

            gsap.fromTo('.s5-image-wrapper',
                {
                    scale: 0.85,
                    opacity: 0.8
                },
                {
                    scale: 1,
                    opacity: 1,
                    borderRadius: '0rem', // Optional: go from rounded to square (skip if you want rounded to stay)
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: '.s5-image-wrapper',
                        start: 'top 90%',
                        end: 'center 50%',
                        scrub: 1 // Link animation directly to scroll position for that professional feel
                    }
                }
            );

            // Subtly scale the actual image inside the wrapper opposite to wrapper scale for parallax feel
            gsap.fromTo('.s5-image',
                { scale: 1.2 },
                {
                    scale: 1,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: '.s5-image-wrapper',
                        start: 'top 90%',
                        end: 'bottom top',
                        scrub: true
                    }
                }
            );
        }

        // 3. Bottom portal text entrance
        const bottomTextElements = section5.querySelectorAll('.s5-subheading, .s5-portal-cta');
        if (bottomTextElements.length > 0) {
            gsap.fromTo(bottomTextElements,
                { y: 40, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1.2,
                    stagger: 0.15,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: '.s5-portal-content',
                        start: 'top 90%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        }
    }

    // ===== SECTION 6: Site Survey — Premium Scroll Animations =====
    const section6 = document.getElementById('section6-survey');

    if (section6) {
        const s6Tl = gsap.timeline({
            scrollTrigger: {
                trigger: section6,
                start: 'top 75%',
                end: 'top 25%',
                toggleActions: 'play none none none'
            }
        });

        // 1. Eyebrow fades up
        s6Tl.to('.s6-eyebrow', {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out'
        }, 0);

        // 2. Title words stagger up (each word individually)
        s6Tl.to('.s6-title-word', {
            opacity: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.12,
            ease: 'power3.out'
        }, 0.15);

        // 3. Divider line draws from left to right
        s6Tl.to('.s6-divider', {
            width: '100%',
            duration: 1.1,
            ease: 'power2.inOut'
        }, 0.55);

        // 4. Orange quote fades up
        s6Tl.to('.s6-quote', {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out'
        }, 0.75);

        // 5. Sub text fades up
        s6Tl.to('.s6-sub', {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power3.out'
        }, 0.9);

        // 6. Form card scales in from slight reduction
        s6Tl.to('.s6-form-card', {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 1.0,
            ease: 'power3.out'
        }, 0.25);
    }

    // ===== SECTION 7: Moving Stability Forward — Word Scale + Image Reveal =====
    const section7 = document.getElementById('section7-mobility');

    if (section7 && window.innerWidth > 768) {

        const s7ImageWrap = section7.querySelector('.s7-image-wrap');
        const s7Lines = section7.querySelectorAll('.s7-line');
        const s7Taglines = section7.querySelector('.s7-taglines');

        // Scrubbed timeline — pin the sticky wrap, play + reverse with scroll
        const s7Tl = gsap.timeline({
            scrollTrigger: {
                trigger: section7,
                start: 'top top',
                end: '+=300%',
                scrub: 1,          // smooth scrub — reverses perfectly on scroll up
                pin: '.s7-sticky-wrap',
                pinSpacing: false,
                anticipatePin: 1
            }
        });

        // ── PHASE 1: Words scale up + fade in (0.0 → 1.5) ──
        s7Lines.forEach(function (line, i) {
            s7Tl.to(line, {
                fontSize: 'clamp(5rem, 9vw, 11rem)',
                opacity: 1,
                ease: 'power2.out',
                duration: 1.5
            }, i * 0.1);
        });

        // ── PHASE 2: Image starts reveal + expands to 60% (0.5 → 1.5) ──
        // This starts while words are still scaling
        s7Tl.to(s7ImageWrap, {
            width: '60%',
            height: '65vh',
            opacity: 1,
            borderRadius: '2rem',
            ease: 'power2.inOut',
            duration: 1.0
        }, 0.5);

        // ── PHASE 3: Words fade out decisively (1.5 → 2.2) ──
        // Start fading exactly as Phase 1 finishes
        s7Tl.to(s7Lines, {
            opacity: 0,
            ease: 'power2.in',
            duration: 0.7,
            stagger: 0
        }, 1.5);

        // ── PHASE 4: Image continues to final 80% size (1.5 → 3.0) ──
        s7Tl.to(s7ImageWrap, {
            width: '80%',
            height: '82vh',
            borderRadius: '2.4rem',
            ease: 'power2.out',
            duration: 1.5
        }, 1.5);
    }

    // ===== SECTION 9: Mission & Team Animations =====
    const section9 = document.getElementById('section9-mission');
    if (section9) {
        const s9Tl = gsap.timeline({
            scrollTrigger: {
                trigger: section9,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            }
        });

        s9Tl.fromTo('.s9-main-title',
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }
        )
            .fromTo('.s9-card',
                { y: 60, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: 'power3.out' },
                '-=0.6'
            );
    }

    // ===== SECTION 8: Get Up to Speed (Card Grid) =====
    const section8 = document.getElementById('section8-news');

    if (section8) {
        if (window.innerWidth > 768) {
            // Desktop: Cards slide in from the left with a slight rotation (Premium feel)
            gsap.fromTo('.s8-card',
                {
                    x: -100,
                    opacity: 0,
                    rotationY: -15, // Slight 3D rotation for a cool effect
                    transformPerspective: 1000
                },
                {
                    x: 0,
                    opacity: 1,
                    rotationY: 0,
                    duration: 1.2,
                    stagger: 0.15, // Each card follows the previous one
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: section8,
                        start: 'top 80%',
                        toggleActions: 'play none none reverse' // Animates back when scrolling up
                    }
                }
            );
        } else {
            // Mobile: Standard slide up from bottom to prevent horizontal scrolling issues
            gsap.fromTo('.s8-card',
                {
                    y: 60,
                    opacity: 0
                },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    stagger: 0.15,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: section8,
                        start: 'top 85%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        }
    }

    // ==== Footer Animations ====
    const footerTop = document.querySelector('.footer-top');
    if (footerTop) {
        gsap.to('.footer-column', {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.footer-section',
                start: 'top 85%',
                toggleActions: 'play none none reverse'
            }
        });

        gsap.to('.footer-links-left a', {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.footer-bottom-links',
                start: 'top 95%',
                toggleActions: 'play none none reverse'
            }
        });

        gsap.to('.footer-branding', {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.footer-image',
                start: 'top 75%',
                toggleActions: 'play none none reverse'
            }
        });

        // Footer Image Parallax
        const footerImageWrapper = document.querySelector('.footer-image-wrapper');
        if (footerImageWrapper) {
            gsap.to(footerImageWrapper, {
                yPercent: -20,
                ease: 'none',
                scrollTrigger: {
                    trigger: '.footer-image',
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true
                }
            });
        }
    }

});


