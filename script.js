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
        smoothTouch: true, // Enabled for buttery smooth ScrollTriggers on mobile
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

    // ===== SECTION 6: Site Survey — Scroll-scrubbed Entrance (both mobile + desktop) =====
    const section6 = document.getElementById('section6-survey');

    if (section6) {
        const isDesktop = window.innerWidth > 768;

        if (isDesktop) {
            // ── DESKTOP: 3D AR/VR entrance — scrubbed bidirectionally ──

            // Text side: slides from left with depth (rewinds on scroll up)
            gsap.fromTo('.s6-text-side',
                { x: -80, opacity: 0, rotateY: -10, transformPerspective: 1200 },
                {
                    x: 0, opacity: 1, rotateY: 0, ease: 'none',
                    scrollTrigger: {
                        trigger: section6,
                        start: 'top 85%',
                        end: 'top 30%',
                        scrub: true
                    }
                }
            );

            // Form card: 3D panel rotates in (rewinds on scroll up)
            gsap.fromTo('.s6-form-card',
                { opacity: 0, rotateY: 18, x: 60, y: 40, scale: 0.9, transformPerspective: 1000 },
                {
                    opacity: 1, rotateY: 0, x: 0, y: 0, scale: 1, ease: 'none',
                    scrollTrigger: {
                        trigger: section6,
                        start: 'top 80%',
                        end: 'top 20%',
                        scrub: true
                    }
                }
            );

            // Text stagger timeline — scrubbed (rewinds on scroll up)
            const s6TlD = gsap.timeline({
                scrollTrigger: { trigger: section6, start: 'top 85%', end: 'top 25%', scrub: true }
            });
            s6TlD
                .to('.s6-eyebrow', { opacity: 1, y: 0 }, 0)
                .to('.s6-title-word', { opacity: 1, y: 0, stagger: 0.1 }, 0.1)
                .to('.s6-divider', { width: '100%' }, 0.45)
                .to('.s6-quote', { opacity: 1, y: 0 }, 0.65)
                .to('.s6-sub', { opacity: 1, y: 0 }, 0.8);

            // Form fields stagger in — scrubbed
            const inputsD = document.querySelectorAll('#section6-survey .s6-input-anim');
            if (inputsD.length > 0) {
                gsap.fromTo(inputsD,
                    { opacity: 0, y: 24 },
                    {
                        opacity: 1, y: 0, ease: 'none',
                        stagger: { each: 0.08, ease: 'none' },
                        scrollTrigger: {
                            trigger: '.s6-form-card',
                            start: 'top 85%',
                            end: 'top 20%',
                            scrub: true
                        }
                    }
                );
            }

        } else {
            // ── MOBILE: Clean scrub — NO 3D rotations (fixes the tilt) ──
            // Force clear any lingering CSS transforms first
            gsap.set('.s6-form-card', { clearProps: 'transform,opacity' });
            gsap.set('.s6-text-side', { clearProps: 'transform,opacity' });
            gsap.set('.s6-eyebrow,.s6-title-word,.s6-sub,.s6-divider', { clearProps: 'all' });

            // 1. Text side: slides up from below as you scroll in, slides back down on scroll up
            gsap.fromTo('.s6-text-side',
                { y: 50, opacity: 0 },
                {
                    y: 0, opacity: 1, ease: 'none',
                    scrollTrigger: {
                        trigger: section6,
                        start: 'top 95%',
                        end: 'top 40%',
                        scrub: true
                    }
                }
            );

            // 2. Title + eyebrow + sub text stagger in — scrubbed
            const s6TlM = gsap.timeline({
                scrollTrigger: {
                    trigger: section6,
                    start: 'top 90%',
                    end: 'top 25%',
                    scrub: true
                }
            });
            s6TlM
                .to('.s6-eyebrow', { opacity: 1, y: 0 }, 0)
                .to('.s6-title-word', { opacity: 1, y: 0, stagger: 0.08 }, 0.1)
                .to('.s6-divider', { width: '100%' }, 0.45)
                .to('.s6-sub', { opacity: 1, y: 0 }, 0.65);

            // 3. Form card slides up cleanly — NO rotation, fully straight
            gsap.fromTo('.s6-form-card',
                { y: 80, opacity: 0, scale: 0.95 },
                {
                    y: 0, opacity: 1, scale: 1, ease: 'none',
                    scrollTrigger: {
                        trigger: '.s6-form-side',
                        start: 'top 95%',
                        end: 'top 20%',
                        scrub: true
                    }
                }
            );

            // 4. Form fields slide up one by one — scrubbed
            const inputsM = document.querySelectorAll('#section6-survey .s6-input-anim');
            if (inputsM.length > 0) {
                gsap.fromTo(inputsM,
                    { opacity: 0, y: 28 },
                    {
                        opacity: 1, y: 0, ease: 'none',
                        stagger: { each: 0.07, ease: 'none' },
                        scrollTrigger: {
                            trigger: '.s6-form-card',
                            start: 'top 90%',
                            end: 'center 35%',
                            scrub: true
                        }
                    }
                );
            }
        }
    }


    // ===== SECTION 7: Moving Stability Forward — Word Scale + Image Reveal =====
    const section7 = document.getElementById('section7-mobility');

    if (section7) {

        const s7ImageWrap = section7.querySelector('.s7-image-wrap');
        const s7Lines = section7.querySelectorAll('.s7-line');
        const s7Taglines = section7.querySelector('.s7-taglines');
        const s7ScrollIndicator = section7.querySelector('.s7-scroll-indicator');

        const isMobile = window.innerWidth <= 768;

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

        // ── PHASE 0: Fade out scroll indicator on mobile (0.0 → 0.2) ──
        if (s7ScrollIndicator) {
            s7Tl.to(s7ScrollIndicator, {
                opacity: 0,
                autoAlpha: 0,
                ease: 'power2.out',
                duration: 0.2
            }, 0.0);
        }

        // ── PHASE 1: Words scale up + fade in (0.0 → 1.0) ──
        s7Lines.forEach(function (line, i) {
            s7Tl.to(line, {
                fontSize: 'clamp(5rem, 9vw, 11rem)',
                opacity: 1,
                ease: 'power2.out',
                duration: 1.0
            }, i * 0.1);
        });

        // ── PHASE 2: Image starts reveal + expands (0.0 → 1.0) ──
        // This starts EXACTLY at the same time as words scaling
        s7Tl.to(s7ImageWrap, {
            width: isMobile ? '85%' : '60%',
            height: isMobile ? '40vh' : '65vh',
            opacity: 1,
            borderRadius: '2rem',
            ease: 'power2.inOut',
            duration: 1.0
        }, 0.0);

        // ── PHASE 3: Words fade out VERY early on (0.2 → 0.6) ──
        s7Tl.to(s7Lines, {
            opacity: 0,
            autoAlpha: 0, // ensure they hide completely
            ease: 'power4.out',
            duration: 0.4,
            stagger: 0
        }, 0.2);

        // ── PHASE 4: Image continues to final size (1.0 → 2.5) ──
        s7Tl.to(s7ImageWrap, {
            width: isMobile ? '92%' : '80%',
            height: isMobile ? '55vh' : '82vh',
            borderRadius: isMobile ? '2.8rem' : '2.4rem',
            ease: 'power2.out',
            duration: 1.5
        }, 1.0);
    }

    // ===== SECTION 7 NEW: 3D Card Image Scroll Animation =====
    const section7New = document.getElementById('section7-mobility-new');
    if (section7New) {
        const s7Cols = section7New.querySelectorAll('.s7-col');

        s7Cols.forEach((col, index) => {
            const img = col.querySelector('.s7-col-image img');
            const content = col.querySelector('.s7-col-content');
            if (!img) return;

            // Left col tilts from left (-30deg), right col tilts from right (+30deg)
            const fromRotateY = index === 0 ? -30 : 30;

            // 3D image reveal — scrubbed from initial tilt to flat
            gsap.fromTo(img,
                {
                    rotateY: fromRotateY,
                    rotateX: 8,
                    scale: 0.88,
                    opacity: 0,
                    transformPerspective: 900
                },
                {
                    rotateY: 0,
                    rotateX: 0,
                    scale: 1,
                    opacity: 1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: col,
                        start: 'top 85%',
                        end: 'top 30%',
                        scrub: 1.2
                    }
                }
            );

            // Content text slides up simultaneously
            if (content) {
                gsap.fromTo(content,
                    { y: 40, opacity: 0 },
                    {
                        y: 0,
                        opacity: 1,
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: col,
                            start: 'top 80%',
                            end: 'top 40%',
                            scrub: 1
                        }
                    }
                );
            }
        });

        // Hero heading fade in from below — play once, stay visible
        gsap.set('#section7-mobility-new .s7-hero-heading', { opacity: 0, y: 50 });
        gsap.to('#section7-mobility-new .s7-hero-heading',
            {
                y: 0,
                opacity: 1,
                duration: 1.2,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: '#section7-mobility-new .s7-hero-wrap',
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            }
        );
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
        // Animate the title with 3D effect
        gsap.fromTo('.s8-title',
            {
                y: 80,
                opacity: 0,
                rotationX: -25,
                transformPerspective: 1000
            },
            {
                y: 0,
                opacity: 1,
                rotationX: 0,
                scrollTrigger: {
                    trigger: section8,
                    start: 'top 85%',
                    end: 'top 30%',
                    scrub: true
                }
            }
        );

        if (window.innerWidth > 768) {
            // Desktop: Cards slide up with 3D rotation, scrubbed on scroll
            gsap.fromTo('.s8-card',
                {
                    y: 150,
                    opacity: 0,
                    rotationX: -20,
                    transformPerspective: 1000
                },
                {
                    y: 0,
                    opacity: 1,
                    rotationX: 0,
                    stagger: { each: 0.1, ease: 'none' },
                    scrollTrigger: {
                        trigger: section8,
                        start: 'top 85%',
                        end: 'center 45%',
                        scrub: true
                    }
                }
            );
        } else {
            // Mobile: 3D slide from left, triggered on scroll
            gsap.fromTo('.s8-card',
                {
                    x: -100,
                    y: 40,
                    opacity: 0,
                    rotationX: -15,
                    transformPerspective: 1000
                },
                {
                    x: 0,
                    y: 0,
                    opacity: 1,
                    rotationX: 0,
                    duration: 0.8,
                    stagger: 0.15,
                    scrollTrigger: {
                        trigger: section8,
                        start: 'top 85%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        }
    }

    // ===== MOBILE FEATURED IN (Press Section) =====
    const pressSection = document.querySelector('.press-section');
    if (pressSection && window.innerWidth <= 768) {
        gsap.fromTo('.press-heading',
            {
                y: 60,
                opacity: 0,
                rotationX: -25,
                transformPerspective: 1000
            },
            {
                y: 0,
                opacity: 1,
                rotationX: 0,
                scrollTrigger: {
                    trigger: pressSection,
                    start: 'top 90%',
                    end: 'top 30%',
                    scrub: true
                }
            }
        );

        gsap.fromTo('.press-item',
            {
                x: -100,
                y: 40,
                opacity: 0,
                rotationX: -15,
                transformPerspective: 1000
            },
            {
                x: 0,
                y: 0,
                opacity: 1,
                rotationX: 0,
                duration: 0.8,
                stagger: 0.15,
                scrollTrigger: {
                    trigger: pressSection,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                }
            }
        );
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


document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger);

    // ===== SECTION 7 NEW: Two Column Layout animations =====
    const section7new2 = document.getElementById('section7-mobility-new');
    if (section7new2) {
        // Heading & eyebrow — play once, stay visible (do NOT reverse)
        gsap.from('.s7-hero-heading, .s7-eyebrow', {
            scrollTrigger: {
                trigger: '#section7-mobility-new',
                start: 'top 80%',
                toggleActions: 'play none none none'   // ← never reverses
            },
            y: 40,
            opacity: 0,
            duration: 1.0,
            stagger: 0.15,
            ease: 'power3.out'
        });

        // Columns — also play once, stay visible
        gsap.from('.s7-col', {
            scrollTrigger: {
                trigger: '.s7-two-col',
                start: 'top 80%',
                toggleActions: 'play none none none'   // ← never reverses
            },
            y: 60,
            opacity: 0,
            duration: 1.0,
            stagger: 0.2,
            ease: 'power3.out'
        });
    }
});

// ===== SECTION 9: 3D Parallax Layers — Smooth Lerp Edition =====
(function () {
    var cards = [
        document.querySelector('#s9card1'),
        document.querySelector('#s9card2'),
        document.querySelector('#s9card3'),
        document.querySelector('#s9card4'),
        document.querySelector('#s9card5')
    ];

    if (!cards[0]) return;

    // ── Layer config: depth offset & translation multiplier ──
    var layerCfg = [
        { txBase: 0, tyBase: 0, txMult: 1, tyMult: 1 },
        { txBase: -2, tyBase: -0.5, txMult: 8, tyMult: 8 },
        { txBase: -4, tyBase: -1, txMult: 16, tyMult: 16 },
        { txBase: -6, tyBase: -1.5, txMult: 24, tyMult: 24 },
        { txBase: -8, tyBase: -2, txMult: 32, tyMult: 32 }
    ];

    var halfW = window.innerWidth / 2;
    var halfH = window.innerHeight / 2;

    // Target values (set by input events)
    var targetRX = 0.14;
    var targetRY = -0.03;

    // Current interpolated values (updated each rAF tick)
    var currentRX = 0.14;
    var currentRY = -0.03;

    // Lerp speed: 0.06 = very smooth/laggy, 0.12 = responsive but still smooth
    var LERP = 0.08;

    function lerp(a, b, t) { return a + (b - a) * t; }

    function setLayers(rx, ry) {
        // Limit extent on mobile to prevent cards from sliding up into text
        var isMobile = window.innerWidth <= 768;
        var finalRX = isMobile ? rx * 0.4 : rx;
        var finalRY = isMobile ? Math.max(-0.15, ry * 0.4) : ry;

        var tiltBase = 'rotateY(' + (finalRX * 6) + 'deg) rotateX(' + (finalRY * 4) + 'deg)';
        for (var i = 0; i < cards.length; i++) {
            if (!cards[i]) continue;
            var cfg = layerCfg[i];
            var tx = -(finalRX * cfg.txMult) + cfg.txBase;
            var ty = (finalRY * cfg.tyMult) + cfg.tyBase;
            cards[i].style.transform = tiltBase + ' translate(' + tx + '%,' + ty + '%)';
        }
    }

    // ── rAF loop: smoothly lerp current → target each frame ──
    function tick() {
        currentRX = lerp(currentRX, targetRX, LERP);
        currentRY = lerp(currentRY, targetRY, LERP);
        setLayers(currentRX, currentRY);
        requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);

    // ── Desktop: mouse move ──
    document.addEventListener('mousemove', function (e) {
        targetRX = e.clientX < halfW ? -(1 - (e.clientX / halfW)) : (1 - (halfW / e.clientX)) * 2;
        targetRY = e.clientY < halfH ? (1 - (e.clientY / halfH)) : -(1 - (halfH / e.clientY)) * 2;
    });

    // Reset gently on mouse leave
    document.addEventListener('mouseleave', function () {
        targetRX = 0.14;
        targetRY = -0.03;
    });

    // ── Mobile: touch move ──
    document.addEventListener('touchmove', function (e) {
        var touch = e.touches[0];
        targetRX = touch.clientX < halfW ? -(1 - (touch.clientX / halfW)) : (1 - (halfW / touch.clientX)) * 2;
        targetRY = touch.clientY < halfH ? (1 - (touch.clientY / halfH)) : -(1 - (halfH / touch.clientY)) * 2;
    }, { passive: true });

    document.addEventListener('touchend', function () {
        targetRX = 0.14;
        targetRY = -0.03;
    });

    // ── Mobile: gyroscope (with iOS 13+ permission support) ──
    function handleOrientation(e) {
        if (e.gamma !== null) targetRX = Math.max(-1, Math.min(1, e.gamma / 25));
        if (e.beta !== null) targetRY = Math.max(-1, Math.min(1, (e.beta - 45) / 25));
    }

    if (window.DeviceOrientationEvent) {
        // iOS 13+ requires explicit permission triggered by a user action (click/touchstart)
        if (typeof DeviceOrientationEvent.requestPermission === 'function') {
            var permissionGranted = false;

            // We listen for the first touch on the document to request permission silently
            var requestGyro = function () {
                if (permissionGranted) return;
                DeviceOrientationEvent.requestPermission()
                    .then(permissionState => {
                        if (permissionState === 'granted') {
                            permissionGranted = true;
                            window.addEventListener('deviceorientation', handleOrientation, { passive: true });
                        }
                    })
                    .catch(console.error); // Ignore errors (e.g. not called from user gesture)

                // Remove listener once we've tried
                document.removeEventListener('touchstart', requestGyro);
                document.removeEventListener('click', requestGyro);
            };

            document.addEventListener('touchstart', requestGyro, { once: true });
            document.addEventListener('click', requestGyro, { once: true });
        } else {
            // Non-iOS 13+ devices (Android, older iOS) don't need permission
            window.addEventListener('deviceorientation', handleOrientation, { passive: true });
        }
    }

    window.addEventListener('resize', function () {
        halfW = window.innerWidth / 2;
        halfH = window.innerHeight / 2;
    });
})();
