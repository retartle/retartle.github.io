// Highlight active navbar link on scroll
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    // Adjust selector if mobile nav links are different
    const navLinks = document.querySelectorAll('.nav-container .nav-link, .mobile-nav .nav-link');
    let currentSectionId = null;
    const scrollY = window.scrollY; // Get scroll position

    sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        // Check if section is roughly in the middle of the viewport
        // Adjusted logic: Check if section top is above middle and bottom is below top
        if (rect.top <= window.innerHeight / 2 && rect.bottom >= 0) {
             // Prioritize section closest to the top of the viewport within the upper half
             if (currentSectionId === null || rect.top > document.getElementById(currentSectionId).getBoundingClientRect().top) {
                  if (rect.top <= 100) { // Give priority if close to top
                     currentSectionId = section.getAttribute('id');
                  } else if (currentSectionId === null) { // Otherwise, take the first one found in the upper half
                     currentSectionId = section.getAttribute('id');
                  }
             }
        }
    });

     // If no section is detected in the upper half (e.g., at the very top or bottom)
    if (currentSectionId === null) {
        if (scrollY < window.innerHeight / 3) { // If near the top
            currentSectionId = 'hero';
        } else {
             // Could add logic for bottom, but often footer isn't a nav target
        }
    }


    navLinks.forEach(link => {
        link.classList.remove('active');
        const linkHref = link.getAttribute('href');
        // Check if the link's href matches the current section ID
        if (linkHref === `#${currentSectionId}`) {
            link.classList.add('active');
        // Special case for the home link (#) when the hero section is active
        } else if (currentSectionId === 'hero' && linkHref === '#') {
             link.classList.add('active');
        }
    });
});


document.addEventListener("DOMContentLoaded", () => {

    // --- REMOVED: Project Details Data ---

    const heroSection = document.querySelector('.hero-section');
    const parallaxBackground = document.querySelector('.parallax-background');
    const parallaxElements = document.querySelectorAll('.parallax-element');

    // Dark mode toggle functionality
    const toggle = document.getElementById("darkModeToggle");
    const body = document.body;

    // Function to apply mode
    const applyMode = (mode) => {
        if (mode === "dark") {
            body.classList.add("dark-mode");
            body.classList.remove("light-mode");
        } else {
            body.classList.add("light-mode");
            body.classList.remove("dark-mode");
        }
        // Re-layout Masonry grids after mode change (slight delay for transition)
        setTimeout(() => {
            document.querySelectorAll('.hobby-gallery-grid').forEach(grid => {
                const msnryInstance = Masonry.data(grid);
                if (msnryInstance) {
                    msnryInstance.layout();
                }
            });
        }, 400); // Adjust delay if needed
    };

    // Load the mode from localStorage
    const savedMode = localStorage.getItem("mode") || "light"; // Default to light mode
    applyMode(savedMode);


    // Toggle dark mode on click
    if (toggle) {
        toggle.addEventListener("click", () => {
            const newMode = body.classList.contains("light-mode") ? "dark" : "light";
            applyMode(newMode);
            localStorage.setItem("mode", newMode);
        });
    }

    // Navbar scroll effect
    const navContainer = document.querySelector(".nav-container");
    if (navContainer) {
        // Use requestAnimationFrame for smoother scroll animations
        let lastScrollY = window.scrollY;
        let ticking = false;

        function updateNavbarScroll() {
            const scrollY = window.scrollY;
            if (scrollY > 50) {
                navContainer.classList.add("scrolled");
            } else {
                navContainer.classList.remove("scrolled");
            }
            ticking = false;
        }

        window.addEventListener("scroll", function() {
             lastScrollY = window.scrollY;
             if (!ticking) {
                 window.requestAnimationFrame(updateNavbarScroll);
                 ticking = true;
             }
        });
    }


    // Hamburger menu toggle functionality
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const mobileNav = document.getElementById('mobileNav');
    const bars = document.querySelectorAll('.hamburger-menu .bar');

    if (hamburgerMenu && mobileNav && bars.length > 0) {
        hamburgerMenu.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMobileNav();
        });
        document.querySelectorAll('.mobile-nav ul li a').forEach(link => {
            link.addEventListener('click', () => {
                if (mobileNav.classList.contains('active')) {
                    closeMobileNavWithAnimation();
                }
            });
        });
        mobileNav.addEventListener('click', function(e) {
            if (e.target === this) {
                 closeMobileNavWithAnimation();
            }
        });
        document.addEventListener('click', function(e) {
            if (mobileNav.classList.contains('active') && !mobileNav.contains(e.target) && !hamburgerMenu.contains(e.target)) {
                closeMobileNavWithAnimation();
            }
        });
    }

    function toggleMobileNav() {
         if (mobileNav.classList.contains('active')) {
            closeMobileNavWithAnimation();
        } else {
            mobileNav.classList.add('active');
            mobileNav.classList.remove('closing');
            bars.forEach(bar => bar.classList.add('active'));
        }
    }

    function closeMobileNavWithAnimation() {
        mobileNav.classList.add('closing');
        bars.forEach(bar => bar.classList.remove('active'));
        setTimeout(() => {
            mobileNav.classList.remove('active', 'closing');
        }, 300);
    }


    // Intersection Observer for animations
    const elementsToAnimate = document.querySelectorAll('[data-animate]');
    if (elementsToAnimate.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    // If the intersecting element is a Masonry item, layout the grid
                    const grid = entry.target.closest('.hobby-gallery-grid');
                    if (grid) {
                        const msnryInstance = Masonry.data(grid);
                        if (msnryInstance) {
                            // Use a small delay to ensure the element is fully visible
                            setTimeout(() => msnryInstance.layout(), 50);
                        }
                    }
                    observer.unobserve(entry.target); // Unobserve after first animation
                }
            });
        }, { threshold: 0.1 }); // Trigger when 10% visible
        elementsToAnimate.forEach((el) => observer.observe(el));
    }


    // Dynamic word fade effect for Hero section
    const dynamicWordElementHero = document.getElementById("dynamic-word-hero");
    if (dynamicWordElementHero) {
        const wordsHero = ["AI", "Cybersecurity", "Pentesting", "Networking", "Digital Forensics", "Web Development"];
        let currentWordIndexHero = 0;
        dynamicWordElementHero.textContent = wordsHero[currentWordIndexHero];
        dynamicWordElementHero.style.opacity = 1;

        const typeEffectHero = (word, callback) => {
            dynamicWordElementHero.textContent = word;
            dynamicWordElementHero.style.transition = 'opacity 0.5s ease-in-out';
            dynamicWordElementHero.style.opacity = 1;
            setTimeout(callback, 2000);
        };
        const fadeOutEffectHero = (callback) => {
            dynamicWordElementHero.style.opacity = 0;
            setTimeout(callback, 500);
        };
        const cycleWordsHero = () => {
            fadeOutEffectHero(() => {
                currentWordIndexHero = (currentWordIndexHero + 1) % wordsHero.length;
                typeEffectHero(wordsHero[currentWordIndexHero], cycleWordsHero);
            });
        };
        setTimeout(cycleWordsHero, 1000);
    }


    // Hobby Gallery Modal and Carousel Functionality (Keep separate)
    var hobbyModal = document.getElementById("myModal"); // Use specific ID if needed
    var hobbyCaptionText = document.getElementById("caption");
    var hobbyImages = document.querySelectorAll(".gallery-img"); // Select hobby gallery images
    var hobbyModalCarousel = document.querySelector(".modal-carousel");
    var hobbyCloseBtn = document.querySelector("#myModal .close"); // Scope close button

    if (hobbyModal && hobbyCaptionText && hobbyImages.length > 0 && hobbyModalCarousel && hobbyCloseBtn) {
        const allHobbyGalleryImages = Array.from(hobbyImages).map(img => ({ src: img.src, alt: img.alt }));

        function initHobbyModalCarousel(initialIndex) {
             if ($(hobbyModalCarousel).hasClass('slick-initialized')) {
                 $(hobbyModalCarousel).slick('unslick');
             }
             hobbyModalCarousel.innerHTML = '';
             allHobbyGalleryImages.forEach(function(imageData) {
                const slide = document.createElement('div');
                const slideImg = document.createElement('img');
                slideImg.src = imageData.src;
                slideImg.alt = imageData.alt;
                slide.appendChild(slideImg);
                hobbyModalCarousel.appendChild(slide);
            });
            $(hobbyModalCarousel).slick({
                dots: true, infinite: true, speed: 300, slidesToShow: 1, adaptiveHeight: true,
                initialSlide: initialIndex,
                prevArrow: '<button type="button" class="slick-prev">Previous</button>',
                nextArrow: '<button type="button" class="slick-next">Next</button>'
            });
             if (allHobbyGalleryImages[initialIndex]) {
                 hobbyCaptionText.innerHTML = allHobbyGalleryImages[initialIndex].alt;
             }
        }

        document.querySelectorAll('#hobbies .card-effect').forEach(function(card) { // Target hobby cards
            card.onclick = function() {
                const clickedImg = card.querySelector('.gallery-img');
                if (!clickedImg) return;
                const clickedIndex = allHobbyGalleryImages.findIndex(imgData => imgData.src === clickedImg.src);
                hobbyModal.style.display = "block";
                hobbyModal.style.animation = "fadeIn 0.5s ease-out";
                initHobbyModalCarousel(clickedIndex >= 0 ? clickedIndex : 0);
            };
        });

        hobbyCloseBtn.onclick = function() { closeHobbyModal(); };
        hobbyModal.onclick = function(event) { if (event.target === hobbyModal) { closeHobbyModal(); } };

        function closeHobbyModal() {
            hobbyModal.style.animation = "fadeOut 0.5s ease-out";
            setTimeout(function() { hobbyModal.style.display = "none"; }, 450);
        }

        $(hobbyModalCarousel).on('afterChange', function(event, slick, currentSlide) {
             if (allHobbyGalleryImages[currentSlide]) {
                 hobbyCaptionText.innerHTML = allHobbyGalleryImages[currentSlide].alt;
             }
        });
    }


    // --- Bubble Background Effect ---
    class BubbleBackground {
        constructor(options = {}) {
            this.options = {
                containerId: 'bubble-container', minSize: 10, maxSize: 30,
                minDuration: 15, maxDuration: 30, bubbleCount: 20,
                spawnInterval: 3000, parallaxFactor: 0.2, ...options };
            this.container = document.getElementById(this.options.containerId);
            if (!this.container) { console.error(`Bubble container #${this.options.containerId} not found.`); return; }
            this.bubbles = new Set(); this.init(); this.initParallax();
        }
        createBubble() {
            const wrapper = document.createElement('div'); wrapper.className = 'bubble-wrapper';
            const bubble = document.createElement('div'); bubble.className = 'bubble';
            const size = Math.random() * (this.options.maxSize - this.options.minSize) + this.options.minSize;
            bubble.style.setProperty('--size', `${size}px`);
            const left = Math.random() * 100; bubble.style.setProperty('--left', `${left}%`);
            const duration = Math.random() * (this.options.maxDuration - this.options.minDuration) + this.options.minDuration;
            bubble.style.setProperty('--duration', `${duration}s`);
            wrapper.appendChild(bubble); this.container.appendChild(wrapper); this.bubbles.add(wrapper);
            bubble.addEventListener('animationend', () => {
                 if (wrapper.parentNode) { wrapper.remove(); this.bubbles.delete(wrapper); }
            }, { once: true });
        }
        init() {
            for (let i = 0; i < this.options.bubbleCount; i++) { setTimeout(() => { this.createBubble(); }, Math.random() * 5000); }
            this.spawnIntervalId = setInterval(() => { if (this.bubbles.size < this.options.bubbleCount * 1.5) { this.createBubble(); } }, this.options.spawnInterval);
        }
        initParallax() {
            this.scrollListener = () => { const scrollY = window.scrollY; this.bubbles.forEach(wrapper => { if (document.body.contains(wrapper)) { wrapper.style.transform = `translateY(${scrollY * this.options.parallaxFactor}px)`; } }); };
             window.addEventListener('scroll', this.scrollListener);
        }
        destroy() { clearInterval(this.spawnIntervalId); window.removeEventListener('scroll', this.scrollListener); this.bubbles.forEach(wrapper => wrapper.remove()); this.bubbles.clear(); }
    }
    new BubbleBackground({ bubbleCount: 25, spawnInterval: 2500 });
    // --- End Bubble Background Effect ---


    // Fetch GitHub Repo Update Dates
    async function fetchRepoUpdateDates() {
        const projectCards = document.querySelectorAll('.project-card[data-repo]');
        for (const card of projectCards) {
            const repoName = card.dataset.repo;
            const updateDateElement = card.querySelector('.update-date');
            if (!repoName || !updateDateElement) continue;
            const apiUrl = `https://api.github.com/repos/${repoName}/commits?per_page=1`;
            try {
                const response = await fetch(apiUrl);
                if (!response.ok) {
                    if (response.status === 404) { updateDateElement.textContent = 'Repo not found'; }
                    else if (response.status === 403) { updateDateElement.textContent = 'API limit hit'; }
                    else { updateDateElement.textContent = 'Error fetching'; }
                    console.warn(`Error fetching ${repoName}: ${response.status}`); continue;
                }
                const data = await response.json();
                if (data && data.length > 0 && data[0].commit && data[0].commit.committer) {
                    const lastCommitDate = new Date(data[0].commit.committer.date);
                    updateDateElement.textContent = lastCommitDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
                } else { updateDateElement.textContent = 'No commits'; }
            } catch (error) {
                updateDateElement.textContent = 'Network error';
                console.error(`Network error fetching ${repoName}:`, error);
            }
        }
    }
    fetchRepoUpdateDates();


    // Subtle Parallax Effect for Profile Picture
    const profilePicWrapper = document.querySelector('.profile-picture-wrapper');
    if (profilePicWrapper) {
        const initialTopOffset = profilePicWrapper.getBoundingClientRect().top + window.scrollY;
        let tickingParallax = false;
        function updateProfilePicParallax() {
             const scrollY = window.scrollY; const parallaxOffset = (scrollY - initialTopOffset) * 0.07;
             if (scrollY > initialTopOffset - window.innerHeight && scrollY < initialTopOffset + profilePicWrapper.offsetHeight) { profilePicWrapper.style.transform = `translateY(${parallaxOffset}px)`; }
             else { profilePicWrapper.style.transform = `translateY(0px)`; }
             tickingParallax = false;
        }
        window.addEventListener('scroll', () => { if (!tickingParallax) { window.requestAnimationFrame(updateProfilePicParallax); tickingParallax = true; } });
    }


     // General Parallax for Hero Section
     function handleHeroParallax() {
        let scrollPosition = window.pageYOffset;
        if (parallaxBackground) { parallaxBackground.style.transform = `translateY(${scrollPosition * 0.3}px)`; }
        parallaxElements.forEach(element => { element.style.transform = `translateY(${scrollPosition * 0.1}px)`; });
     }
     let heroTicking = false;
     function updateHeroParallax() { handleHeroParallax(); heroTicking = false; }
     if (heroSection || parallaxBackground || parallaxElements.length > 0) {
         window.addEventListener('scroll', () => { if (!heroTicking) { window.requestAnimationFrame(updateHeroParallax); heroTicking = true; } });
         handleHeroParallax();
     }

    // Masonry Initialization (Gutter set to 0)
    document.querySelectorAll('.hobby-gallery-grid').forEach(gridElement => {
        imagesLoaded(gridElement, function() {
            const msnry = new Masonry(gridElement, { itemSelector: '.gallery-item', columnWidth: '.gallery-item', percentPosition: true, gutter: 0 });
            gridElement.style.opacity = 1;
        });
    });


    // --- Timeline Scroll Animation (Smoothed with Lerp) ---
    const educationSection = document.getElementById('education');
    const timelineProgress = document.querySelector('.timeline-progress');
    const timelineIndicator = document.querySelector('.timeline-indicator');
    const timelineItems = document.querySelectorAll('#education .timeline-item');
    const timelineContainer = document.querySelector('#education .timeline');
    let timelineTicking = false;
    let targetProgress = 0; let currentProgressHeight = 0; let currentIndicatorTop = 0;
    const easingFactor = 0.1;
    let itemPositions = [];

    function calculateItemPositions() {
        itemPositions = []; if (!timelineContainer) return;
        const timelineRect = timelineContainer.getBoundingClientRect(); const timelineScrollY = window.scrollY + timelineRect.top;
        timelineItems.forEach(item => {
            const itemRect = item.getBoundingClientRect(); const itemTopAbsolute = window.scrollY + itemRect.top;
            const relativeTop = itemTopAbsolute - timelineScrollY; const relativeCenter = relativeTop + (item.offsetHeight / 2);
            const timelineHeight = timelineContainer.offsetHeight - parseInt(window.getComputedStyle(timelineContainer).paddingBottom);
            const centerPercent = timelineHeight > 0 ? (relativeCenter / timelineHeight) * 100 : 0;
            itemPositions.push({ element: item.querySelector('.timeline-content'), centerPercent: centerPercent });
        });
    }

    function animationLoop() {
        if (!timelineProgress || !timelineIndicator) return;
        const diffHeight = targetProgress - currentProgressHeight; const diffTop = targetProgress - currentIndicatorTop;
        if (Math.abs(diffHeight) < 0.1 && Math.abs(diffTop) < 0.1) {
            currentProgressHeight = targetProgress; currentIndicatorTop = targetProgress;
        } else {
            currentProgressHeight += diffHeight * easingFactor; currentIndicatorTop += diffTop * easingFactor;
            requestAnimationFrame(animationLoop);
        }
        timelineProgress.style.height = currentProgressHeight + '%'; timelineIndicator.style.top = currentIndicatorTop + '%';
        timelineIndicator.style.opacity = targetProgress > 1 && targetProgress < 99 ? '1' : '0';
        const activationThresholdPercent = 5;
        itemPositions.forEach(itemData => {
            if (Math.abs(itemData.centerPercent - currentIndicatorTop) < activationThresholdPercent) {
                if (itemData.element && !itemData.element.classList.contains('dot-active')) { itemData.element.classList.add('dot-active'); }
            } else {
                if (itemData.element && itemData.element.classList.contains('dot-active')) { itemData.element.classList.remove('dot-active'); }
            }
        });
        timelineTicking = false;
    }

    function handleScroll() {
        if (!educationSection || !timelineContainer) { timelineTicking = false; return; }
        const sectionRect = educationSection.getBoundingClientRect(); const sectionHeight = educationSection.offsetHeight; const viewportHeight = window.innerHeight;
        const totalScrollRange = sectionHeight + viewportHeight; const currentScroll = -sectionRect.top + viewportHeight;
        let progress = 0; if (totalScrollRange > 0) { progress = (currentScroll / totalScrollRange) * 100; }
        targetProgress = Math.max(0, Math.min(100, progress));
        if (!timelineTicking) { timelineTicking = true; requestAnimationFrame(animationLoop); }
    }
    window.addEventListener('scroll', handleScroll);
    calculateItemPositions(); handleScroll();
    // --- END Timeline Scroll Animation ---


    // --- REMOVED: Project Modal Population ---


}); // End DOMContentLoaded