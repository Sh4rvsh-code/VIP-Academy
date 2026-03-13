document.addEventListener('DOMContentLoaded', () => {
    // 1. Sticky Navigation & Back to Top
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
            backToTop.classList.add('show');
        } else {
            navbar.classList.remove('scrolled');
            backToTop.classList.remove('show');
        }
    });

    // 2. Intersection Observer for Scroll Animations
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Find all children with animation classes
                const animateElements = entry.target.querySelectorAll('.fade-in, .slide-up, .zoom-in');
                animateElements.forEach((el, index) => {
                    setTimeout(() => {
                        el.classList.add('animate');
                    }, index * 150); // Staggered animation effect
                });

                // Ensure the container itself gets the animate class
                entry.target.classList.add('animate');

                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(section => {
        observer.observe(section);
    });

    // 3. Enquiry Modal Logic (guarded for missing trigger button)
    const modal = document.getElementById('enquiry-modal');
    const openModalBtn = document.getElementById('open-modal-btn');
    const closeModalBtn = document.querySelector('.close-modal');

    if (modal && closeModalBtn) {
        const openModal = () => {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        };

        const closeModal = () => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        };

        if (openModalBtn) {
            openModalBtn.addEventListener('click', openModal);
        }

        closeModalBtn.addEventListener('click', closeModal);

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });

        // 4. Form Validation & Submission
        const enquiryForm = document.getElementById('enquiry-form');
        if (enquiryForm) {
            enquiryForm.addEventListener('submit', (e) => {
                e.preventDefault();

                const formData = new FormData(enquiryForm);
                const name = formData.get('name');
                const phone = formData.get('phone');

                if (name.length < 3) {
                    alert('Please enter a valid name.');
                    return;
                }

                if (!/^\d{10}$/.test(phone)) {
                    alert('Please enter a valid 10-digit phone number.');
                    return;
                }

                alert(`Thank you, ${name}! Your enquiry has been submitted. Our team will contact you shortly.`);
                enquiryForm.reset();
                closeModal();
            });
        }
    }

    // 5. Testimonial Carousel (Simple Logic, guarded for missing DOM)
    const testimonials = [
        {
            text: "The one-on-one attention helped me improve my score from 60 to 95 in just 4 months! The mentor is amazing.",
            author: "Rahul Sharma",
            achievement: "NEET 2024 Scorer (AIR 234)",
            photo: "assets/student_placeholder.webp"
        },
        {
            text: "I was struggling with mechanics, but the way concepts are simplified here is mind-blowing. Truly professional coaching.",
            author: "Sneha Kapur",
            achievement: "JEE Main 99.5 Percentile",
            photo: "assets/student_placeholder_2.webp"
        },
        {
            text: "Small batch size makes a huge difference. I never felt hesitant to ask my doubts. Best results guaranteed!",
            author: "Manish Iyer",
            achievement: "AIIMS Aspirant",
            photo: "assets/student_placeholder.webp"
        }
    ];

    let currentSlide = 0;
    const sliderContainer = document.getElementById('testimonial-slider');
    const dots = document.querySelectorAll('.dot');

    if (sliderContainer && dots.length) {
        const updateTestimonial = (index) => {
            const t = testimonials[index];
            sliderContainer.innerHTML = `
                <div class="testimonial-card slide-up animate">
                    <div class="stars">
                        <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>
                    </div>
                    <p class="testimonial-text">"${t.text}"</p>
                    <div class="testimonial-author">
                        <div class="author-photo"><img src="${t.photo}" alt="${t.author}"></div>
                        <div class="author-info">
                            <strong>${t.author}</strong>
                            <span>${t.achievement}</span>
                        </div>
                    </div>
                </div>
            `;

            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
        };

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentSlide = index;
                updateTestimonial(currentSlide);
            });
        });

        // Auto-advance carousel
        setInterval(() => {
            currentSlide = (currentSlide + 1) % testimonials.length;
            updateTestimonial(currentSlide);
        }, 5000);
    }

    // 6. About Us image slider (two-photo fade)
    const aboutSlides = document.querySelectorAll('.about-photo-slide');
    const aboutPrev = document.getElementById('about-photo-prev');
    const aboutNext = document.getElementById('about-photo-next');
    if (aboutSlides.length && aboutPrev && aboutNext) {
        let aboutIndex = 0;

        const showAboutSlide = (index) => {
            aboutSlides.forEach((slide, i) => {
                slide.classList.toggle('about-photo-active', i === index);
            });
        };

        aboutPrev.addEventListener('click', () => {
            aboutIndex = (aboutIndex - 1 + aboutSlides.length) % aboutSlides.length;
            showAboutSlide(aboutIndex);
        });

        aboutNext.addEventListener('click', () => {
            aboutIndex = (aboutIndex + 1) % aboutSlides.length;
            showAboutSlide(aboutIndex);
        });
    }

    // 7. Mobile Menu (clean, CSS-driven)
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');

    if (mobileMenuBtn && navbar) {
        const icon = mobileMenuBtn.querySelector('i');

        const closeMenu = () => {
            navbar.classList.remove('nav-open');
            if (icon) {
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-times');
            }
        };

        const toggleMenu = () => {
            if (window.innerWidth > 768) return;
            const willOpen = !navbar.classList.contains('nav-open');
            navbar.classList.toggle('nav-open', willOpen);
            if (icon) {
                icon.classList.toggle('fa-bars', !willOpen);
                icon.classList.toggle('fa-times', willOpen);
            }
        };

        mobileMenuBtn.addEventListener('click', toggleMenu);

        // Close menu when resizing to desktop
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && navbar.classList.contains('nav-open')) {
                closeMenu();
            }
        });

        // Close menu after tapping a nav link on mobile
        navbar.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768 && navbar.classList.contains('nav-open')) {
                    closeMenu();
                }
            });
        });
    }

    // 8. NEET Success carousel – prev/next buttons (no auto-loop)
    const neetViewport = document.getElementById('neet-carousel-viewport');
    const neetTrack = document.getElementById('neet-carousel-track');
    const neetPrev = document.getElementById('neet-carousel-prev');
    const neetNext = document.getElementById('neet-carousel-next');
    if (neetViewport && neetTrack && neetPrev && neetNext) {
        const cards = neetTrack.querySelectorAll('.neet-carousel-card');
        const gap = 24;

        function getCardWidth() {
            const first = cards[0];
            return first ? first.offsetWidth + gap : 344;
        }

        function updateNeetButtons() {
            const maxScroll = neetTrack.scrollWidth - neetViewport.clientWidth;
            neetPrev.disabled = neetViewport.scrollLeft <= 2;
            neetNext.disabled = maxScroll <= 0 || neetViewport.scrollLeft >= maxScroll - 2;
        }

        neetPrev.addEventListener('click', () => {
            const cardWidth = getCardWidth();
            const next = Math.max(0, neetViewport.scrollLeft - cardWidth);
            neetViewport.scrollTo({ left: next, behavior: 'smooth' });
        });
        neetNext.addEventListener('click', () => {
            const cardWidth = getCardWidth();
            const maxScroll = neetTrack.scrollWidth - neetViewport.clientWidth;
            const next = Math.min(maxScroll, neetViewport.scrollLeft + cardWidth);
            neetViewport.scrollTo({ left: next, behavior: 'smooth' });
        });

        neetViewport.addEventListener('scroll', updateNeetButtons);
        window.addEventListener('resize', updateNeetButtons);
        updateNeetButtons();
    }

    // 9. Results Section Tabs
    window.showTab = (tabId) => {
        // Toggle Buttons
        const buttons = document.querySelectorAll('.tab-btn');
        buttons.forEach(btn => {
            if (btn.innerText.toLowerCase().includes(tabId)) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Toggle Content
        const contents = document.querySelectorAll('.tab-content');
        contents.forEach(content => {
            if (content.id === `${tabId}-tab`) {
                content.classList.add('active');
            } else {
                content.classList.remove('active');
            }
        });
    };

    // 10. Stats Counter Animation
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumbers = entry.target.querySelectorAll('.stat-number');
                statNumbers.forEach(num => {
                    const target = parseInt(num.getAttribute('data-target'));
                    let current = 0;
                    const increment = target / 100;
                    const updateCount = () => {
                        if (current < target) {
                            current += increment;
                            if (target === 95) {
                                num.innerText = Math.ceil(current) + '%';
                            } else {
                                num.innerText = Math.ceil(current) + '+';
                            }
                            setTimeout(updateCount, 20);
                        } else {
                            if (target === 95) {
                                num.innerText = target + '%';
                            } else {
                                num.innerText = target + '+';
                            }
                        }
                    };
                    updateCount();
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.stats-counter');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    // Footer: update map when franchise location is hovered or clicked
    const footerMapIframe = document.getElementById('footer-map-iframe');
    const franchiseLinks = document.querySelectorAll('.franchise-loc[data-map-src]');
    if (footerMapIframe && franchiseLinks.length) {
        franchiseLinks.forEach(link => {
            const mapSrc = link.getAttribute('data-map-src');
            if (!mapSrc) return;
            link.addEventListener('mouseenter', () => {
                footerMapIframe.src = mapSrc;
            });
            link.addEventListener('click', (e) => {
                e.preventDefault();
                footerMapIframe.src = mapSrc;
            });
        });
    }
});
