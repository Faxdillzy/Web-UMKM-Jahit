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

            // Gallery Zoom Modal Functionality
document.addEventListener('DOMContentLoaded', function() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const galleryModal = document.createElement('div');
    const modalContent = document.createElement('div');
    const modalImg = document.createElement('img');
    const modalClose = document.createElement('div');
    const modalPrev = document.createElement('div');
    const modalNext = document.createElement('div');
    const modalCaption = document.createElement('div');
    const modalCounter = document.createElement('div');
    const modalLoading = document.createElement('div');
    
    let currentImageIndex = 0;
    const galleryImages = [];
    
    // Setup modal structure
    galleryModal.className = 'gallery-modal';
    modalContent.className = 'gallery-modal-content';
    modalImg.className = 'gallery-modal-img';
    modalClose.className = 'gallery-modal-close';
    modalClose.innerHTML = '×';
    modalPrev.className = 'gallery-modal-prev';
    modalPrev.innerHTML = '❮';
    modalNext.className = 'gallery-modal-next';
    modalNext.innerHTML = '❯';
    modalCaption.className = 'gallery-modal-caption';
    modalCounter.className = 'gallery-modal-counter';
    modalLoading.className = 'gallery-modal-loading';
    
    // Build modal navigation
    const modalNav = document.createElement('div');
    modalNav.className = 'gallery-modal-nav';
    modalNav.appendChild(modalPrev);
    modalNav.appendChild(modalNext);
    
    // Assemble modal
    modalContent.appendChild(modalImg);
    modalContent.appendChild(modalCaption);
    modalContent.appendChild(modalCounter);
    modalContent.appendChild(modalClose);
    modalContent.appendChild(modalNav);
    modalContent.appendChild(modalLoading);
    galleryModal.appendChild(modalContent);
    document.body.appendChild(galleryModal);
    
    // Collect gallery images
    galleryItems.forEach((item, index) => {
        const img = item.querySelector('img');
        const alt = img.getAttribute('alt') || `Gambar ${index + 1}`;
        
        galleryImages.push({
            src: img.src,
            alt: alt
        });
        
        // Add click event to each gallery item
        item.addEventListener('click', () => {
            currentImageIndex = index;
            openModal();
        });
    });
    
    // Function to open modal
    function openModal() {
        const currentImage = galleryImages[currentImageIndex];
        
        // Show loading
        modalLoading.style.display = 'block';
        modalImg.style.opacity = '0';
        
        // Load image
        modalImg.src = currentImage.src;
        modalImg.alt = currentImage.alt;
        modalCaption.textContent = currentImage.alt;
        modalCounter.textContent = `${currentImageIndex + 1} / ${galleryImages.length}`;
        
        // When image is loaded
        modalImg.onload = function() {
            modalLoading.style.display = 'none';
            modalImg.style.opacity = '1';
            galleryModal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        };
        
        // Handle image load error
        modalImg.onerror = function() {
            modalLoading.style.display = 'none';
            modalImg.alt = 'Gagal memuat gambar';
            modalCaption.textContent = 'Gagal memuat gambar';
        };
    }
    
    // Function to close modal
    function closeModal() {
        galleryModal.classList.remove('active');
        setTimeout(() => {
            document.body.style.overflow = 'auto'; // Re-enable scrolling
        }, 300);
    }
    
    // Navigate to previous image
    function prevImage() {
        currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
        openModal();
    }
    
    // Navigate to next image
    function nextImage() {
        currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
        openModal();
    }
    
    // Event listeners for modal controls
    modalClose.addEventListener('click', closeModal);
    modalPrev.addEventListener('click', (e) => {
        e.stopPropagation();
        prevImage();
    });
    modalNext.addEventListener('click', (e) => {
        e.stopPropagation();
        nextImage();
    });
    
    // Close modal when clicking outside the image
    galleryModal.addEventListener('click', (e) => {
        if (e.target === galleryModal) {
            closeModal();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!galleryModal.classList.contains('active')) return;
        
        switch(e.key) {
            case 'Escape':
                closeModal();
                break;
            case 'ArrowLeft':
                prevImage();
                break;
            case 'ArrowRight':
                nextImage();
                break;
        }
    });
    
    // Touch swipe for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    modalContent.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    modalContent.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - next image
                nextImage();
            } else {
                // Swipe right - previous image
                prevImage();
            }
        }
    }
});

        })();
