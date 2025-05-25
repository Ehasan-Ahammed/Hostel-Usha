document.addEventListener('DOMContentLoaded', function () {
    // Mobile Navigation
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Gallery Carousel
    class GalleryCarousel {
        constructor() {
            this.container = document.querySelector('.carousel-container');
            this.indicators = document.querySelector('.carousel-indicators');
            this.images = [
                'assets/gallery/d1.jpg',
                'assets/gallery/d2.jpg',
                'assets/gallery/d3.jpg',
                'assets/gallery/d4.jpg',
                'assets/gallery/d5.jpg',
                'assets/gallery/d6.jpg'
            ];
            this.currentIndex = 0;
            this.interval = null;
            if (this.container) this.init();
        }
        init() {
            this.container.innerHTML = '';
            this.images.forEach((src, index) => {
                const img = document.createElement('img');
                img.src = src;
                img.alt = `Hostel Image ${index + 1}`;
                if (index === 0) img.classList.add('active');
                this.container.appendChild(img);
            });
            this.createIndicators();
            const prevBtn = document.querySelector('.carousel-btn.prev');
            const nextBtn = document.querySelector('.carousel-btn.next');
            if (prevBtn && nextBtn) {
                prevBtn.addEventListener('click', () => this.slide('prev'));
                nextBtn.addEventListener('click', () => this.slide('next'));
            }
            if (this.interval) clearInterval(this.interval);
            this.interval = setInterval(() => this.slide('next'), 5000);
        }
        slide(direction) {
            const images = this.container.querySelectorAll('img');
            const currentImage = images[this.currentIndex];
            currentImage.classList.remove('active');

            this.currentIndex = direction === 'next'
                ? (this.currentIndex + 1) % images.length
                : (this.currentIndex - 1 + images.length) % images.length;

            const nextImage = images[this.currentIndex];
            nextImage.classList.add('active');

            // Update indicators
            if (this.indicators) {
                Array.from(this.indicators.children).forEach((btn, idx) => {
                    btn.classList.toggle('active', idx === this.currentIndex);
                });
            }
        }
        createIndicators() {
            if (!this.indicators) return;
            this.indicators.innerHTML = '';
            this.images.forEach((_, idx) => {
                const btn = document.createElement('button');
                btn.setAttribute('aria-label', `Go to slide ${idx + 1}`);
                if (idx === 0) btn.classList.add('active');
                btn.addEventListener('click', () => {
                    const images = this.container.querySelectorAll('img');
                    images[this.currentIndex].classList.remove('active');
                    this.currentIndex = idx;
                    images[this.currentIndex].classList.add('active');
                    Array.from(this.indicators.children).forEach((indicator, index) => {
                        indicator.classList.toggle('active', index === this.currentIndex);
                    });
                });
                this.indicators.appendChild(btn);
            });
        }
    }
    if (document.querySelector('.carousel-container')) {
        new GalleryCarousel();
    }

    // Form Validation
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();
            let isValid = true;
            let errorMessage = '';
            if (name.length < 2) {
                isValid = false;
                errorMessage += 'Name must be at least 2 characters long.\n';
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                isValid = false;
                errorMessage += 'Please enter a valid email address.\n';
            }
            if (message.length < 10) {
                isValid = false;
                errorMessage += 'Message must be at least 10 characters long.\n';
            }
            if (isValid) {
                alert('Thank you for your message! We will get back to you soon.');
                contactForm.reset();
            } else {
                alert(errorMessage);
            }
        });
    }

    // Fade-in Animation (optional, robust)
    const fadeElements = document.querySelectorAll('.fade-in');
    if (fadeElements.length > 0 && 'IntersectionObserver' in window) {
        const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        fadeElements.forEach(element => {
            observer.observe(element);
        });
    } else {
        // If no IntersectionObserver, show all
        fadeElements.forEach(element => {
            element.classList.add('visible');
        });
    }

    // Navbar scroll effect
    let lastScroll = 0;
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            if (currentScroll <= 0) {
                navbar.classList.remove('scroll-up');
                return;
            }
            if (currentScroll > lastScroll && !navbar.classList.contains('scroll-down')) {
                navbar.classList.remove('scroll-up');
                navbar.classList.add('scroll-down');
            } else if (currentScroll < lastScroll && navbar.classList.contains('scroll-down')) {
                navbar.classList.remove('scroll-down');
                navbar.classList.add('scroll-up');
            }
            lastScroll = currentScroll;
        });
    }

    // Theme Toggle
    const themeToggle = document.querySelector('.theme-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    const currentTheme = localStorage.getItem('theme') || (prefersDarkScheme.matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', currentTheme);
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const newTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }
    prefersDarkScheme.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            const newTheme = e.matches ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
        }
    });

    // Disable right-click
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
    });

    // Disable some inspect shortcuts
    document.addEventListener('keydown', function(e) {
        // F12
        if (e.key === 'F12') {
            e.preventDefault();
        }
        // Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U, Ctrl+S
        if ((e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) ||
            (e.ctrlKey && (e.key === 'U' || e.key === 'S'))) {
            e.preventDefault();
        }
    });
}); 