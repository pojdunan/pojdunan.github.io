document.addEventListener('DOMContentLoaded', function() {
    // Update copyright year
    document.getElementById('year').textContent = new Date().getFullYear();

    // Mobile menu toggle with enhanced functionality
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');
    const body = document.body;

    mobileMenuBtn.addEventListener('click', function() {
        const isOpen = nav.classList.toggle('active');
        this.querySelector('i').classList.toggle('fa-times');
        this.querySelector('i').classList.toggle('fa-bars');
        
        // Toggle body scroll when menu is open
        body.style.overflow = isOpen ? 'hidden' : '';
        
        // Add backdrop when menu is open on mobile
        if (isOpen && window.innerWidth <= 768) {
            addMenuBackdrop();
        } else {
            removeMenuBackdrop();
        }
    });

    // Create and manage menu backdrop for mobile
    function addMenuBackdrop() {
        const backdrop = document.createElement('div');
        backdrop.className = 'mobile-menu-backdrop';
        backdrop.addEventListener('click', function() {
            nav.classList.remove('active');
            mobileMenuBtn.querySelector('i').classList.remove('fa-times');
            mobileMenuBtn.querySelector('i').classList.add('fa-bars');
            body.style.overflow = '';
            removeMenuBackdrop();
        });
        document.body.appendChild(backdrop);
    }

    function removeMenuBackdrop() {
        const backdrop = document.querySelector('.mobile-menu-backdrop');
        if (backdrop) {
            backdrop.remove();
        }
    }

    // Close mobile menu when clicking a link (enhanced)
    const navLinks = document.querySelectorAll('.nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (nav.classList.contains('active')) {
                nav.classList.remove('active');
                mobileMenuBtn.querySelector('i').classList.remove('fa-times');
                mobileMenuBtn.querySelector('i').classList.add('fa-bars');
                body.style.overflow = '';
                removeMenuBackdrop();
                
                // For smooth scrolling to sections
                const targetId = this.getAttribute('href');
                if (targetId.startsWith('#')) {
                    e.preventDefault();
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        window.scrollTo({
                            top: targetElement.offsetTop - 80,
                            behavior: 'smooth'
                        });
                    }
                }
            }
        });
    });

    // Enhanced smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Calculate scroll position considering mobile header height
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL without page jump
                if (history.pushState) {
                    history.pushState(null, null, targetId);
                } else {
                    window.location.hash = targetId;
                }
            }
        });
    });

    // Active link highlighting with intersection observer (more efficient)
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav a');
    
    // Create intersection observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.3
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('href') === `#${id}` || 
                        (id === undefined && item.getAttribute('href') === 'index.html')) {
                        item.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);
    
    // Observe all sections
    sections.forEach(section => {
        observer.observe(section);
    });

    // Animation on scroll with throttling for performance
    let lastScrollPosition = 0;
    let ticking = false;
    
    function animateElements() {
        const elements = document.querySelectorAll('.skill-card, .project-card, .project-item, .cert-item, .hero-content, .hero-image, .timeline-item');
        const windowHeight = window.innerHeight;
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementPosition < windowHeight - elementVisible) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }
    
    // Set initial state for animation
    document.querySelectorAll('.skill-card, .project-card, .project-item, .cert-item').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });

    document.querySelector('.hero-content')?.style.opacity = '0';
    document.querySelector('.hero-content')?.style.transform = 'translateX(-20px)';
    document.querySelector('.hero-content')?.style.transition = 'opacity 0.5s ease 0.2s, transform 0.5s ease 0.2s';

    document.querySelector('.hero-image')?.style.opacity = '0';
    document.querySelector('.hero-image')?.style.transform = 'translateX(20px)';
    document.querySelector('.hero-image')?.style.transition = 'opacity 0.5s ease 0.4s, transform 0.5s ease 0.4s';

    document.querySelectorAll('.timeline-item')?.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-20px)';
        item.style.transition = `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`;
    });

    // Throttled scroll event for animations
    window.addEventListener('scroll', function() {
        lastScrollPosition = window.scrollY;
        
        if (!ticking) {
            window.requestAnimationFrame(function() {
                animateElements();
                ticking = false;
            });
            ticking = true;
        }
    });

    // Initial animation trigger
    animateElements();

    // Responsive adjustments for technology logos
    function adjustTechLogos() {
        const techLogos = document.querySelectorAll('.tech-logos img');
        if (window.innerWidth <= 768) {
            techLogos.forEach(logo => {
                logo.style.height = '30px';
            });
        } else {
            techLogos.forEach(logo => {
                logo.style.height = '';
            });
        }
    }

    // Run on load and resize
    window.addEventListener('load', adjustTechLogos);
    window.addEventListener('resize', adjustTechLogos);

    // Lazy loading for images
    if ('loading' in HTMLImageElement.prototype) {
        // Native lazy loading is supported
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
        });
    } else {
        // Fallback for browsers without native lazy loading
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        
        const lazyLoad = function() {
            lazyImages.forEach(img => {
                if (img.getBoundingClientRect().top < window.innerHeight + 100) {
                    img.src = img.dataset.src;
                    img.removeAttribute('loading');
                }
            });
        };
        
        lazyLoad();
        window.addEventListener('scroll', lazyLoad);
        window.addEventListener('resize', lazyLoad);
    }

    // Touch device detection for hover effects
    function isTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints;
    }

    if (isTouchDevice()) {
        document.body.classList.add('touch-device');
    } else {
        document.body.classList.add('no-touch-device');
    }

    // Responsive table of contents for certifications (if needed)
    const certCategories = document.querySelectorAll('.cert-category');
    if (certCategories.length > 0 && window.innerWidth <= 768) {
        const toc = document.createElement('div');
        toc.className = 'cert-toc';
        toc.innerHTML = '<h3>Jump to:</h3><ul></ul>';
        
        certCategories.forEach(category => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.textContent = category.textContent;
            a.href = `#${category.textContent.toLowerCase().replace(/\s+/g, '-')}`;
            li.appendChild(a);
            toc.querySelector('ul').appendChild(li);
        });
        
        document.querySelector('.certifications-page .container').prepend(toc);
    }
});