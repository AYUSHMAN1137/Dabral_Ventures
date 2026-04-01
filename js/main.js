/* ========================================
   DABRAL VENTURES - MAIN JAVASCRIPT
   Premium Interactive Features
   ======================================== */

// Scroll position restoration (handled in HTML head)
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // ========== CUSTOM CURSOR ==========
    const cursorDot = document.getElementById('cursor-dot');
    
    // Check if not touch device
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    
    if (!isTouchDevice && cursorDot) {
        // Hide default cursor
        document.body.style.cursor = 'none';
        document.body.classList.add('cursor-active');
        
        // All interactive elements
        const interactiveElements = 'a, button, input, textarea, select, [role="button"], .nav-link, .nav-cta, .portfolio-link, .testimonial-card, .filter-btn';
        
        // Instant cursor movement
        document.addEventListener('mousemove', (e) => {
            cursorDot.style.left = e.clientX + 'px';
            cursorDot.style.top = e.clientY + 'px';
        });
        
        // Hover effect on interactive elements
        document.querySelectorAll(interactiveElements).forEach(el => {
            el.style.cursor = 'none';
            
            el.addEventListener('mouseenter', () => {
                cursorDot.classList.add('cursor-hover');
            });
            
            el.addEventListener('mouseleave', () => {
                cursorDot.classList.remove('cursor-hover');
            });
        });
        
        // Click effect
        document.addEventListener('mousedown', () => {
            cursorDot.classList.add('cursor-click');
        });
        
        document.addEventListener('mouseup', () => {
            cursorDot.classList.remove('cursor-click');
        });
        
        // Hide cursor when leaving window
        document.addEventListener('mouseleave', () => {
            cursorDot.style.opacity = '0';
        });
        
        document.addEventListener('mouseenter', () => {
            cursorDot.style.opacity = '1';
        });
    }

    // ========== TYPEWRITER EFFECT ==========
    const typewriterElement = document.getElementById('typewriter');
    const words = ['design-forward', 'innovative', 'scalable', 'modern', 'premium'];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingSpeed = 80;
    const deletingSpeed = 40;
    const pauseBeforeDelete = 1800;

    function typeWriter() {
        if (!typewriterElement) return;
        
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            // Deleting characters
            typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            
            if (charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                // Instant start - no pause before typing
                typeWriter();
            } else {
                setTimeout(typeWriter, deletingSpeed);
            }
        } else {
            // Typing characters
            typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            
            if (charIndex === currentWord.length) {
                isDeleting = true;
                setTimeout(typeWriter, pauseBeforeDelete);
            } else {
                setTimeout(typeWriter, typingSpeed);
            }
        }
    }

    // Start typewriter after a small delay
    setTimeout(typeWriter, 1000);

    // ========== PRELOADER ==========
    const preloader = document.getElementById('preloader');
    
    const hidePreloader = () => {
        if (preloader) {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
                document.body.style.overflow = '';
            }, 500);
        }
    };

    window.addEventListener('load', () => {
        setTimeout(hidePreloader, 1500);
    });

    // Fallback if load takes too long
    setTimeout(hidePreloader, 5000);

    // ========== NAVBAR SCROLL BEHAVIOR ==========
    const navbar = document.getElementById('navbar');
    const siteHeader = document.querySelector('.site-header');
    const scrollProgress = document.getElementById('scroll-progress');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let lastScroll = 0;
    let ticking = false;

    const updateNavbar = () => {
        const scrollY = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        
        // Add scrolled class for both old and new navbar
        if (navbar) {
            navbar.classList.toggle('scrolled', scrollY > 50);
        }
        
        // For new site-header
        if (siteHeader) {
            siteHeader.classList.toggle('scrolled', scrollY > 30);
        }

        // Update scroll progress
        if (scrollProgress) {
            const progress = (scrollY / docHeight) * 100;
            scrollProgress.style.width = `${progress}%`;
        }

        // Update active nav link based on scroll position
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                currentSection = sectionId;
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${currentSection}`) {
                link.classList.add('active');
            }
        });

        lastScroll = scrollY;
        ticking = false;
    };

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    });
    
    // Initialize navbar state
    updateNavbar();

    // ========== MOBILE MENU ==========
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');

    const closeMenu = () => {
        if (!menuToggle || !navMenu) return;
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('menu-open');
    };

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            const isOpen = menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active', isOpen);
            menuToggle.setAttribute('aria-expanded', String(isOpen));
            document.body.classList.toggle('menu-open', isOpen);
        });

        // Close menu on link click
        navLinks.forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        // Close menu on outside click
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
                closeMenu();
            }
        });
        
        // Close menu on resize to desktop
        window.addEventListener('resize', () => {
            if (window.innerWidth > 820) {
                closeMenu();
            }
        });
    }

    // ========== SMOOTH SCROLL ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (!href || href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                // Account for fixed navbar height + some padding
                const navbarHeight = 100;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (menuToggle && navMenu) {
                    closeMenu();
                }
            }
        });
    });

    // ========== THEME TOGGLE ==========
    const themeToggle = document.getElementById('theme-toggle');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    
    const setTheme = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        // Update toggle icon
        if (themeToggle) {
            const icon = themeToggle.querySelector('svg');
            if (icon) {
                icon.innerHTML = theme === 'light' 
                    ? '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>'
                    : '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';
            }
        }
    };

    // Check for saved theme or system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        setTheme(savedTheme);
    } else if (prefersDark.matches) {
        setTheme('dark');
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            setTheme(currentTheme === 'light' ? 'dark' : 'light');
        });
    }

    // ========== SCROLL REVEAL ANIMATIONS ==========
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale, .stagger-children');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ========== PORTFOLIO FILTER & SLIDER ==========
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioSlider = document.getElementById('portfolio-slider');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    // Clone items for seamless loop based on filter
    const setupSlider = (filter) => {
        if (!portfolioSlider) return;
        
        // Show/hide items based on filter
        portfolioItems.forEach(item => {
            const category = item.getAttribute('data-category');
            if (filter === 'all' || category === filter || category === 'cta') {
                item.classList.remove('hidden');
            } else {
                item.classList.add('hidden');
            }
        });
        
        // Trigger custom event to reinitialize slider
        window.dispatchEvent(new CustomEvent('portfolioFilterChanged'));
    };

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');
            setupSlider(filter);
        });
    });

    // ========== PORTFOLIO ITEM HOVER ==========
    const portfolioSliderWrapper = document.querySelector('.portfolio-slider-wrapper');
    portfolioItems.forEach(item => {
        const image = item.querySelector('.portfolio-image img');

        item.addEventListener('mouseenter', () => {
            if (portfolioSliderWrapper && portfolioSliderWrapper.classList.contains('is-slider-pointer-down')) {
                return;
            }
            if (image) {
                image.style.transform = 'scale(1.1)';
            }
        });

        item.addEventListener('mouseleave', () => {
            if (image) {
                image.style.transform = 'scale(1)';
            }
        });
    });

    // ========== PORTFOLIO PREVIEW IMAGE LOADER ==========
    // Supports jpg, jpeg, png formats
    // Preview image loading handled inline above

    // Load all preview images - use the exact src specified in HTML
    document.querySelectorAll('.portfolio-preview, .portfolio-preview-popup img').forEach(img => {
        const src = img.getAttribute('src');
        if (src) {
            // Just verify the image loads, no format guessing needed
            const testImg = new Image();
            testImg.onload = () => {
                img.src = src;
                img.style.display = '';
            };
            testImg.onerror = () => {
                img.style.display = 'none';
            };
            testImg.src = src;
        }
    });

    // ========== TILT EFFECT ON CARDS ==========
    const tiltCards = document.querySelectorAll('[data-tilt]');
    
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const tiltX = (y - centerY) / 20;
            const tiltY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-8px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });

    // ========== MAGNETIC BUTTONS ==========
    const magneticBtns = document.querySelectorAll('.magnetic');
    
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0, 0)';
        });
    });

    // ========== NUMBER COUNTER ANIMATION ==========
    const animateCounter = (element) => {
        const target = parseInt(element.getAttribute('data-target')) || 0;
        const duration = 2000;
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                element.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        };

        // Start when element is visible
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counterObserver.observe(element);
    };

    // Initialize counters
    document.querySelectorAll('[data-count]').forEach(counter => {
        animateCounter(counter);
    });

    // ========== PORTFOLIO SLIDER WITH AUTO-SCROLL & DRAG ==========
    const initPortfolioSlider = () => {
        const slider = document.querySelector('.portfolio-slider');
        const wrapper = document.querySelector('.portfolio-slider-wrapper');
        if (!slider || !wrapper) return;
        
        // Stop CSS animation - we'll control it with JS
        slider.style.animation = 'none';
        
        // State variables
        let currentX = 0;
        let direction = -1; // -1 = right to left, 1 = left to right
        let baseSpeed = 1; // pixels per frame
        let currentSpeed = baseSpeed;
        let targetSpeed = baseSpeed;
        let isDragging = false;
        let startX = 0;
        let startCurrentX = 0;
        let lastMouseX = 0;
        let lastTime = Date.now();
        let velocity = 0;
        let momentumVelocity = 0;
        const velocityHistory = [];
        const maxVelocitySamples = 6;
        const momentumFriction = 0.935;
        const minMomentum = 0.12;
        let capturedPointerId = null;
        let dragCommitted = false;
        let suppressNextClick = false;
        let pendingLink = null;
        const dragThresholdPx = 8;
        let animationId = null;
        let sliderWidth = 0;
        let contentWidth = 0;
        
        // Clone items for seamless loop
        const setupClones = () => {
            // Remove existing clones
            const clones = slider.querySelectorAll('.portfolio-item.clone');
            clones.forEach(c => c.remove());
            
            // Get original visible items (not hidden by filter)
            const items = slider.querySelectorAll('.portfolio-item:not(.clone):not(.hidden)');
            contentWidth = 0;
            items.forEach(item => {
                contentWidth += item.offsetWidth + 24; // 24 = gap
            });
            
            // Clone visible items
            items.forEach(item => {
                const clone = item.cloneNode(true);
                clone.classList.add('clone');
                slider.appendChild(clone);
            });
            
            sliderWidth = contentWidth;

            slider.querySelectorAll('img').forEach((img) => {
                img.setAttribute('draggable', 'false');
            });
            slider.querySelectorAll('a').forEach((a) => {
                a.setAttribute('draggable', 'false');
            });
        };
        
        setupClones();
        
        // Handle resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                setupClones();
            }, 200);
        });
        
        // Animation loop
        const animate = () => {
            if (!isDragging) {
                currentSpeed += (targetSpeed - currentSpeed) * 0.02;
                currentX += direction * currentSpeed;

                if (Math.abs(momentumVelocity) > minMomentum) {
                    currentX += momentumVelocity;
                    momentumVelocity *= momentumFriction;
                    if (Math.abs(momentumVelocity) < minMomentum) {
                        momentumVelocity = 0;
                    }
                }

                if (direction === -1 && currentX <= -sliderWidth) {
                    currentX += sliderWidth;
                } else if (direction === 1 && currentX >= 0) {
                    currentX -= sliderWidth;
                }

                slider.style.transform = `translateX(${currentX}px)`;
            }

            animationId = requestAnimationFrame(animate);
        };
        
        animate();
        
        const getPointerX = (e) => e.clientX;

        const onDragStart = (e) => {
            if (e.pointerType === 'mouse' && e.button !== 0) return;

            e.preventDefault();

            pendingLink = e.target.closest && e.target.closest('a[href]');

            isDragging = true;
            dragCommitted = false;
            suppressNextClick = false;
            capturedPointerId = e.pointerId;
            try {
                wrapper.setPointerCapture(e.pointerId);
            } catch (err) { /* ignore */ }

            wrapper.classList.add('is-slider-pointer-down');

            startX = getPointerX(e);
            startCurrentX = currentX;
            lastMouseX = startX;
            lastTime = performance.now();
            velocity = 0;
            velocityHistory.length = 0;
            momentumVelocity = 0;

            slider.style.cursor = 'grabbing';
            wrapper.style.cursor = 'grabbing';
        };

        const onDragMove = (e) => {
            if (!isDragging || e.pointerId !== capturedPointerId) return;

            const currentPointerX = getPointerX(e);
            const totalDelta = Math.abs(currentPointerX - startX);
            if (totalDelta > dragThresholdPx) {
                if (!dragCommitted) {
                    dragCommitted = true;
                }
                e.preventDefault();
            }
            const currentTime = performance.now();
            const timeDelta = Math.max(currentTime - lastTime, 1);
            const mouseDelta = currentPointerX - lastMouseX;
            const sample = mouseDelta / timeDelta;

            velocityHistory.push(sample);
            if (velocityHistory.length > maxVelocitySamples) {
                velocityHistory.shift();
            }
            velocity = sample;

            lastMouseX = currentPointerX;
            lastTime = currentTime;

            const diff = currentPointerX - startX;
            currentX = startCurrentX + diff;

            if (currentX <= -sliderWidth) {
                currentX += sliderWidth;
                startCurrentX += sliderWidth;
            } else if (currentX >= 0) {
                currentX -= sliderWidth;
                startCurrentX -= sliderWidth;
            }

            slider.style.transform = `translateX(${currentX}px)`;
        };

        const onDragEnd = (e) => {
            if (!isDragging) return;
            if (e.pointerId !== capturedPointerId) return;

            const didDrag = dragCommitted;

            isDragging = false;
            wrapper.classList.remove('is-slider-pointer-down');
            if (didDrag) {
                suppressNextClick = true;
            }
            dragCommitted = false;

            const linkToActivate = !didDrag ? pendingLink : null;
            pendingLink = null;

            if (capturedPointerId != null) {
                try {
                    wrapper.releasePointerCapture(capturedPointerId);
                } catch (err) { /* ignore */ }
                capturedPointerId = null;
            }

            slider.style.cursor = 'grab';
            wrapper.style.cursor = 'grab';

            const avgVel =
                velocityHistory.length > 0
                    ? velocityHistory.reduce((a, b) => a + b, 0) / velocityHistory.length
                    : velocity;
            const absVel = Math.abs(avgVel);

            if (absVel > 0.08) {
                const frameScale = 16.67;
                momentumVelocity = avgVel * frameScale;
                const maxMomentum = 48;
                momentumVelocity = Math.max(-maxMomentum, Math.min(maxMomentum, momentumVelocity));
                if (absVel > 0.35) {
                    direction = avgVel > 0 ? 1 : -1;
                }
            } else {
                momentumVelocity = 0;
            }

            velocityHistory.length = 0;
            targetSpeed = baseSpeed;

            if (linkToActivate) {
                linkToActivate.click();
            }
        };

        wrapper.addEventListener('dragstart', (ev) => {
            ev.preventDefault();
        }, true);
        
        wrapper.addEventListener(
            'click',
            (e) => {
                if (!suppressNextClick) return;
                suppressNextClick = false;
                e.preventDefault();
                e.stopPropagation();
            },
            true
        );

        wrapper.addEventListener('pointerdown', onDragStart, { passive: false });
        wrapper.addEventListener('pointermove', onDragMove, { passive: false });
        wrapper.addEventListener('pointerup', onDragEnd);
        wrapper.addEventListener('pointercancel', onDragEnd);
        wrapper.addEventListener('lostpointercapture', (e) => {
            if (isDragging && e.pointerId === capturedPointerId) {
                onDragEnd(e);
            }
        });
        
        // Set initial cursor
        wrapper.style.cursor = 'grab';
        
        // Slow down on hover
        wrapper.addEventListener('mouseenter', () => {
            if (!isDragging) {
                targetSpeed = 0.3;
            }
        });
        
        wrapper.addEventListener('mouseleave', () => {
            if (!isDragging) {
                targetSpeed = baseSpeed;
            }
        });
        
        // Handle filter change event
        window.addEventListener('portfolioFilterChanged', () => {
            setTimeout(() => {
                setupClones();
                currentX = 0;
                slider.style.transform = `translateX(${currentX}px)`;
            }, 100);
        });
    };
    
    initPortfolioSlider();

    // ========== CONTACT FORM HANDLING ==========
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;
            
            // Show loading state
            submitBtn.innerHTML = `
                <span>Sending...</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="spin">
                    <circle cx="12" cy="12" r="10" stroke-dasharray="60" stroke-dashoffset="20"/>
                </svg>
            `;
            submitBtn.disabled = true;
            
            // Simulate form submission (replace with actual API call)
            setTimeout(() => {
                submitBtn.innerHTML = `
                    <span>Message Sent!</span>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20 6L9 17l-5-5"/>
                    </svg>
                `;
                submitBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
                
                // Reset form
                contactForm.reset();
                
                // Reset button after 3 seconds
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                }, 3000);
            }, 1500);
        });
    }

    // ========== PARTICLES SYSTEM ==========
    const createParticles = () => {
        const particlesContainer = document.getElementById('particles');
        if (!particlesContainer) return;

        const particleCount = 35;
        // Light theme friendly colors for particles
        const colors = ['#00d4ff', '#0ea5e9', '#3b82f6', '#1e293b', '#94a3b8'];

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            const size = Math.random() * 5 + 2;
            const color = colors[Math.floor(Math.random() * colors.length)];

            particle.style.cssText = `
                width: ${size}px;
                height: ${size}px;
                background: ${color};
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                opacity: ${Math.random() * 0.4 + 0.1};
                animation: particleFloat ${Math.random() * 20 + 15}s linear infinite;
                animation-delay: -${Math.random() * 20}s;
                box-shadow: 0 0 ${size * 2}px ${color}40;
            `;
            particlesContainer.appendChild(particle);
        }
    };
    createParticles();

    // ========== SOCIAL FAB (Floating Action Button) ==========
    const socialFab = document.getElementById('socialFab');
    const fabMain = document.getElementById('fabMain');
    
    if (socialFab && fabMain) {
        // Toggle FAB on click (for mobile)
        fabMain.addEventListener('click', (e) => {
            socialFab.classList.toggle('active');
        });
        
        // Close FAB when clicking outside
        document.addEventListener('click', (e) => {
            if (!socialFab.contains(e.target) && socialFab.classList.contains('active')) {
                socialFab.classList.remove('active');
            }
        });
        
        // Close FAB on scroll
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (socialFab.classList.contains('active')) {
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    socialFab.classList.remove('active');
                }, 100);
            }
        }, { passive: true });
    }

    // ========== ABOUT SECTION IMAGE CAROUSEL ==========
    const aboutCarousel = document.querySelector('.about-carousel');
    if (aboutCarousel) {
        const slides = aboutCarousel.querySelectorAll('.carousel-slide');
        const dots = document.querySelectorAll('.carousel-dots .dot-accent');
        let currentSlide = 0;
        let carouselInterval;

        const showSlide = (index) => {
            slides.forEach((slide, i) => {
                slide.classList.remove('active');
                if (dots[i]) dots[i].classList.remove('active');
            });
            slides[index].classList.add('active');
            if (dots[index]) dots[index].classList.add('active');
            currentSlide = index;
        };

        const nextSlide = () => {
            const next = (currentSlide + 1) % slides.length;
            showSlide(next);
        };

        const startCarousel = () => {
            carouselInterval = setInterval(nextSlide, 4000);
        };

        const stopCarousel = () => {
            clearInterval(carouselInterval);
        };

        // Click on dots to navigate
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                stopCarousel();
                showSlide(index);
                startCarousel();
            });
        });

        // Start auto-play
        startCarousel();

        // Pause on hover
        aboutCarousel.addEventListener('mouseenter', stopCarousel);
        aboutCarousel.addEventListener('mouseleave', startCarousel);
    }

    console.log('Dabral Ventures - Landing Page Loaded Successfully');
});
