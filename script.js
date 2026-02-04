(function() {
            'use strict';
            
            // Mobile Menu Toggle
            const menuToggle = document.getElementById('menuToggle');
            const navLinks = document.getElementById('navLinks');
            
            if (menuToggle) {
                menuToggle.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    navLinks.classList.toggle('active');
                    const icon = menuToggle.querySelector('i');
                    icon.classList.toggle('fa-bars');
                    icon.classList.toggle('fa-times');
                });
            }

            // Close mobile menu when clicking a link
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.addEventListener('click', () => {
                    navLinks.classList.remove('active');
                    menuToggle.querySelector('i').classList.add('fa-bars');
                    menuToggle.querySelector('i').classList.remove('fa-times');
                });
            });

            // Close menu when clicking outside
            document.addEventListener('click', function(e) {
                if (navLinks.classList.contains('active') && 
                    !navLinks.contains(e.target) && 
                    !menuToggle.contains(e.target)) {
                    navLinks.classList.remove('active');
                    menuToggle.querySelector('i').classList.add('fa-bars');
                    menuToggle.querySelector('i').classList.remove('fa-times');
                }
            });

            // Header scroll effect - DIPERBAIKI: Debounce untuk performa
            let scrollTimeout;
            window.addEventListener('scroll', () => {
                const header = document.getElementById('header');
                
                // Clear the timeout
                if (scrollTimeout) {
                    window.cancelAnimationFrame(scrollTimeout);
                }
                
                // Debounce scroll event
                scrollTimeout = window.requestAnimationFrame(() => {
                    if (window.scrollY > 100) {
                        header.classList.add('scrolled');
                    } else {
                        header.classList.remove('scrolled');
                    }
                });
            });

            // Active nav link on scroll - DIPERBAIKI: Optimasi
            const sections = document.querySelectorAll('section');
            const navItems = document.querySelectorAll('.nav-links a');
            let activeSectionTimeout;

            function updateActiveNav() {
                let current = '';
                const scrollPosition = window.scrollY + 100;
                
                sections.forEach(section => {
                    const sectionTop = section.offsetTop;
                    const sectionHeight = section.clientHeight;
                    
                    if (scrollPosition >= sectionTop && 
                        scrollPosition < sectionTop + sectionHeight) {
                        current = section.getAttribute('id');
                    }
                });

                navItems.forEach(item => {
                    item.classList.remove('active');
                    if (item.getAttribute('href').substring(1) === current) {
                        item.classList.add('active');
                    }
                });
            }

            // Debounce scroll untuk update active nav
            window.addEventListener('scroll', () => {
                if (activeSectionTimeout) {
                    window.cancelAnimationFrame(activeSectionTimeout);
                }
                activeSectionTimeout = window.requestAnimationFrame(updateActiveNav);
            });

            // Portfolio item animation on scroll - DIPERBAIKI: Optimasi
            const portfolioItems = document.querySelectorAll('.portfolio-item');
            let animationTimeout;

            function checkPortfolioItems() {
                portfolioItems.forEach(item => {
                    const itemPosition = item.getBoundingClientRect().top;
                    const screenPosition = window.innerHeight / 1.2;
                    
                    if (itemPosition < screenPosition) {
                        item.classList.add('visible');
                    }
                });
            }

            window.addEventListener('scroll', () => {
                if (animationTimeout) {
                    window.cancelAnimationFrame(animationTimeout);
                }
                animationTimeout = window.requestAnimationFrame(checkPortfolioItems);
            });

            // Initial check
            checkPortfolioItems();

            // Smooth scroll yang lebih sederhana untuk mobile
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function(e) {
                    const href = this.getAttribute('href');
                    
                    // Hanya untuk anchor links internal
                    if (href.startsWith('#') && href !== '#') {
                        e.preventDefault();
                        
                        const targetElement = document.querySelector(href);
                        if (targetElement) {
                            // Tutup mobile menu jika terbuka
                            if (navLinks.classList.contains('active')) {
                                navLinks.classList.remove('active');
                                menuToggle.querySelector('i').classList.add('fa-bars');
                                menuToggle.querySelector('i').classList.remove('fa-times');
                            }
                            
                            const headerHeight = document.querySelector('header').offsetHeight;
                            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                            
                            // Scroll yang lebih sederhana untuk mobile
                            // Gunakan native smooth scroll jika didukung
                            if ('scrollBehavior' in document.documentElement.style) {
                                window.scrollTo({
                                    top: targetPosition,
                                    behavior: 'smooth'
                                });
                            } else {
                                // Fallback untuk browser lama
                                window.scrollTo(0, targetPosition);
                            }
                        }
                    }
                });
            });

            // Optimasi untuk touch devices
            let touchStartY = 0;
            let touchEndY = 0;
            
            document.addEventListener('touchstart', function(e) {
                touchStartY = e.changedTouches[0].screenY;
            }, { passive: true });
            
            document.addEventListener('touchend', function(e) {
                touchEndY = e.changedTouches[0].screenY;
                // Handle swipe untuk performa
            }, { passive: true });

            // Disable beberapa event listeners di mobile untuk performa
            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
            
            if (isMobile) {
                // Nonaktifkan hover effects dengan JavaScript
                document.querySelectorAll('.portfolio-item, .gallery-item, .contact-item').forEach(item => {
                    item.style.transition = 'none';
                });
                
                // Optimasi gambar loading
                document.querySelectorAll('img').forEach(img => {
                    img.loading = 'lazy';
                });
            }

            // Prevent default untuk touch events tertentu
            document.addEventListener('touchmove', function(e) {
                // Biarkan default behavior untuk scroll
            }, { passive: true });

        })();