// Highlight active navbar link on scroll
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav ul li a');

    sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight / 2 && rect.bottom > window.innerHeight / 2) {
            navLinks.forEach(link => link.classList.remove('active'));
            navLinks[index].classList.add('active');
        }
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const heroSection = document.querySelector('.hero-section');
    const parallaxBackground = document.querySelector('.parallax-background');
    const parallaxElements = document.querySelectorAll('.parallax-element');

    // Hero section scroll effect
    window.addEventListener('scroll', () => {
        let scrollPosition = window.pageYOffset;

        // Parallax effect for background
        parallaxBackground.style.transform = `translateY(${scrollPosition * 0.3}px)`;  /* Adjust the speed (0.3) for desired effect */
        
        // Parallax effect for inner elements (e.g., scale, translate)
        parallaxElements.forEach(element => {
            element.style.transform = `translateY(${scrollPosition * 0.1}px)`;  /* Inner elements move at a slower speed */
        });
    });

    // Dark mode toggle functionality
    const toggle = document.getElementById("darkModeToggle");
    const body = document.body;

    // Load the mode from localStorage
    if (localStorage.getItem("mode") === "dark") {
        body.classList.add("dark-mode");
        body.classList.remove("light-mode");
    } else {
        body.classList.add("light-mode");
        body.classList.remove("dark-mode");
    }

    // Toggle dark mode on click
    toggle.addEventListener("click", () => {
        if (body.classList.contains("light-mode")) {
            body.classList.remove("light-mode");
            body.classList.add("dark-mode");
            localStorage.setItem("mode", "dark");
        } else {
            body.classList.remove("dark-mode");
            body.classList.add("light-mode");
            localStorage.setItem("mode", "light");
        }
    });
});

// JavaScript to handle scroll effect
document.addEventListener("scroll", function() {
    const navContainer = document.querySelector(".nav-container");
    const scrollY = window.scrollY;

    // Toggle the "scrolled" class when the page is scrolled 50px or more
    if (scrollY > 50) {
        navContainer.classList.add("scrolled");
    } else {
        navContainer.classList.remove("scrolled");
    }
});


// Hamburger menu toggle functionality
document.getElementById('hamburgerMenu').addEventListener('click', () => {
    const mobileNav = document.getElementById('mobileNav');
    const bars = document.querySelectorAll('.hamburger-menu .bar');

    // If navbar is already active, trigger closing animation
    if (mobileNav.classList.contains('active')) {
        mobileNav.classList.add('closing'); // Add the closing animation
        // Wait for the animation to finish before removing the active state
        setTimeout(() => {
            mobileNav.classList.remove('active', 'closing'); // Remove active and closing class
        }, 300); // 300ms is the duration of the slide-out animation
    } else {
        mobileNav.classList.add('active'); // Show navbar
        mobileNav.classList.remove('closing'); // Ensure no closing animation
    }

    // Toggle the hamburger button (change to "X" shape)
    bars.forEach(bar => bar.classList.toggle('active'));
});

// Close the mobile navbar when clicking on a nav link or anywhere inside the navbar
document.querySelectorAll('.mobile-nav ul li a').forEach(link => {
    link.addEventListener('click', function() {
        const mobileNav = document.getElementById('mobileNav');
        const bars = document.querySelectorAll('.hamburger-menu .bar');

        mobileNav.classList.add('closing'); // Trigger closing animation

        // Wait for the animation to finish before removing the active state
        setTimeout(() => {
            mobileNav.classList.remove('active', 'closing');
        }, 300); // Same duration as slide-out animation

        // Reset hamburger menu animation
        bars.forEach(bar => bar.classList.remove('active'));
    });
});

// Close the mobile navbar when clicking anywhere inside the navbar
document.querySelector('.mobile-nav').addEventListener('click', function(e) {
    if (e.target === this || e.target.tagName === 'A') {
        const mobileNav = this;
        const bars = document.querySelectorAll('.hamburger-menu .bar');
        
        mobileNav.classList.add('closing'); // Trigger closing animation

        setTimeout(() => {
            mobileNav.classList.remove('active', 'closing'); // Remove classes after animation
        }, 300); // Same duration as slide-out animation

        bars.forEach(bar => bar.classList.remove('active')); // Reset hamburger menu
    }
});

// Close the mobile navbar when clicking anywhere outside the navbar
document.addEventListener('click', function(e) {
    const mobileNav = document.getElementById('mobileNav');
    const navToggle = document.getElementById('hamburgerMenu'); // Ensure correct toggle ID

    // Close the navbar only if the click was outside the navbar or the toggle button
    if (!mobileNav.contains(e.target) && !navToggle.contains(e.target)) {
        mobileNav.classList.add('closing'); // Trigger closing animation

        setTimeout(() => {
            mobileNav.classList.remove('active', 'closing');
        }, 300); // Same duration as slide-out animation
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const elementsToAnimate = document.querySelectorAll('[data-animate]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target); // Stop observing once in view
            }
        });
    }, {
        threshold: 0.1, // Trigger when 10% of the element is visible
    });

    elementsToAnimate.forEach((el) => observer.observe(el));
});

document.addEventListener("DOMContentLoaded", () => {
    const dynamicWordElement = document.getElementById("dynamic-word");
    const words = ["dumb", "fun", "creative", "retarded"]; // Words to cycle through
    let currentWordIndex = 0;
    let isTyping = false; // To track if animation is already running

    const typeEffect = (word, callback) => {
        let charIndex = 0;
        const interval = setInterval(() => {
            dynamicWordElement.textContent = word.slice(0, charIndex + 1);
            charIndex++;
            if (charIndex === word.length) {
                clearInterval(interval);
                setTimeout(callback, 1000); // Pause before deleting
            }
        }, 100); // Typing speed
    };

    const deleteEffect = (callback) => {
        let word = dynamicWordElement.textContent;
        let charIndex = word.length;
        const interval = setInterval(() => {
            dynamicWordElement.textContent = word.slice(0, charIndex - 1);
            charIndex--;
            if (charIndex === 0) {
                clearInterval(interval);
                callback();
            }
        }, 50); // Deleting speed
    };

    const cycleWords = () => {
        if (!isTyping) {
            isTyping = true; // Prevent multiple cycles from starting
            typeEffect(words[currentWordIndex], () => {
                deleteEffect(() => {
                    currentWordIndex = (currentWordIndex + 1) % words.length; // Move to the next word
                    isTyping = false; // Allow new cycle when necessary
                    cycleWords(); // Continue cycling
                });
            });
        }
    };

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    if (!isTyping) {
                        cycleWords(); // Start animation when section enters viewport
                    }
                }
            });
        },
        { threshold: 0.5 } // Trigger when 50% of the section is visible
    );

    observer.observe(document.getElementById("about"));
});

// Get the modal, image, caption, and modal link
var modal = document.getElementById("myModal");
var modalImg = document.getElementById("img01");
var captionText = document.getElementById("caption");
var modalLink = document.getElementById("modalLink");

// Get all images with the 'gallery-img' class
var images = document.querySelectorAll(".gallery-img");

// Loop through each image and add the onclick event
images.forEach(function(image) {
  image.onclick = function() {
    modal.style.display = "block";
    modal.style.animation = "fadeIn 0.5s ease-out"; // Trigger fade-in animation
    modalImg.src = this.src;
    captionText.innerHTML = this.alt;
    // Set the modal link to the full-size image URL (you can replace 'this.src' with the full-size image URL if different)
    modalLink.href = this.src; 
  };
});

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

span.onclick = function() {
  // Apply fade-out animation before hiding modal
  modal.style.animation = "fadeOut 0.5s ease-out"; // Trigger fade-out animation

  // Set a timeout to hide the modal after the animation ends
  setTimeout(function() {
    modal.style.display = "none";
  }, 500); // Hide modal after 0.5 seconds (animation duration)
}

// Close modal when clicking anywhere on the modal (outside the image)
modal.onclick = function(event) {
  // Check if the click is outside the modal content
  if (event.target === modal) {
    // Apply fade-out animation before hiding modal
    modal.style.animation = "fadeOut 0.5s ease-out"; // Trigger fade-out animation
    setTimeout(function() {
      modal.style.display = "none";
    }, 500); // Hide modal after 0.5 seconds (animation duration)
  }
};
