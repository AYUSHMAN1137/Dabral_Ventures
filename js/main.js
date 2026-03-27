/* ========================================
   DABRAL VENTURES - MAIN JAVASCRIPT
   Premium Interactive Features
   ======================================== */

// Disable scroll restoration on mobile (before DOM loads)
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

// Reset scroll position on mobile
if (window.innerWidth <= 768) {
    window.scrollTo(0, 0);
}

document.addEventListener('DOMContentLoaded', () => {
    'use strict';
    
    // Force scroll to top on mobile
    if (window.innerWidth <= 768) {
        window.scrollTo(0, 0);
    }

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
    const scrollProgress = document.getElementById('scroll-progress');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let lastScroll = 0;
    let ticking = false;

    const updateNavbar = () => {
        const scrollY = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        
        // Add scrolled class
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Update scroll progress
        if (scrollProgress) {
            const progress = (scrollY / docHeight) * 100;
            scrollProgress.style.width = `${progress}%`;
        }

        // Update active nav link
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
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

    // ========== MOBILE MENU ==========
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });

        // Close menu on link click
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });

        // Close menu on outside click
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    }

    // ========== SMOOTH SCROLL ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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
    portfolioItems.forEach(item => {
        const image = item.querySelector('.portfolio-image img');
        
        item.addEventListener('mouseenter', () => {
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
    const loadPreviewImage = (imgElement, basePath) => {
        const formats = ['jpg', 'jpeg', 'png', 'webp'];
        let currentIndex = 0;
        
        const tryNextFormat = () => {
            if (currentIndex >= formats.length) {
                // All formats failed, keep placeholder
                imgElement.style.display = 'none';
                return;
            }
            
            const testImg = new Image();
            const src = `${basePath}.${formats[currentIndex]}`;
            
            testImg.onload = () => {
                imgElement.src = src;
                imgElement.style.display = '';
            };
            
            testImg.onerror = () => {
                currentIndex++;
                tryNextFormat();
            };
            
            testImg.src = src;
        };
        
        tryNextFormat();
    };

    // Load all preview images with format detection
    document.querySelectorAll('.portfolio-preview, .portfolio-preview-popup img').forEach(img => {
        const src = img.getAttribute('src');
        if (src) {
            // Extract base path without extension
            const basePath = src.replace(/\.(jpg|jpeg|png|webp)$/i, '');
            loadPreviewImage(img, basePath);
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
        let velocity = 0;
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
                // Ease current speed towards target speed
                currentSpeed += (targetSpeed - currentSpeed) * 0.02;
                
                // Move slider
                currentX += direction * currentSpeed;
                
                // Loop seamlessly
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
        
        // Get pointer position (works for both mouse and touch)
        const getPointerX = (e) => {
            return e.touches ? e.touches[0].clientX : e.clientX;
        };
        
        // Drag start
        const onDragStart = (e) => {
            isDragging = true;
            startX = getPointerX(e);
            startCurrentX = currentX;
            lastMouseX = startX;
            velocity = 0;
            
            slider.style.cursor = 'grabbing';
            wrapper.style.cursor = 'grabbing';
        };
        
        // Drag move
        const onDragMove = (e) => {
            if (!isDragging) return;
            
            const currentPointerX = getPointerX(e);
            const diff = currentPointerX - startX;
            const mouseDelta = currentPointerX - lastMouseX;
            
            // Calculate velocity for momentum
            velocity = mouseDelta;
            lastMouseX = currentPointerX;
            
            // Update position
            currentX = startCurrentX + diff;
            
            // Keep within bounds with loop
            if (currentX <= -sliderWidth) {
                currentX += sliderWidth;
                startCurrentX += sliderWidth;
            } else if (currentX >= 0) {
                currentX -= sliderWidth;
                startCurrentX -= sliderWidth;
            }
            
            slider.style.transform = `translateX(${currentX}px)`;
        };
        
        // Drag end
        const onDragEnd = (e) => {
            if (!isDragging) return;
            isDragging = false;
            
            slider.style.cursor = 'grab';
            wrapper.style.cursor = 'grab';
            
            // Calculate swipe speed and direction based on velocity
            const absVelocity = Math.abs(velocity);
            
            if (absVelocity > 5) {
                // Fast swipe detected - change direction based on swipe
                if (velocity > 0) {
                    direction = 1;
                } else {
                    direction = -1;
                }
                
                const boostSpeed = Math.min(absVelocity * 0.5, 15);
                currentSpeed = boostSpeed;
                targetSpeed = baseSpeed;
            }
        };
        
        // Mouse events
        wrapper.addEventListener('mousedown', onDragStart);
        document.addEventListener('mousemove', onDragMove);
        document.addEventListener('mouseup', onDragEnd);
        
        // Touch events
        wrapper.addEventListener('touchstart', onDragStart, { passive: true });
        document.addEventListener('touchmove', onDragMove, { passive: true });
        document.addEventListener('touchend', onDragEnd);
        
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

    console.log('Dabral Ventures - Landing Page Loaded Successfully');
});
