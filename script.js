// Wait for the HTML DOM structure to load fully before running the script
document.addEventListener("DOMContentLoaded", () => {
  // 1. Find all carousel components on the web page
  const carousels = document.querySelectorAll(".carousel-container");

  // 2. Loop through each individual carousel to set up independent logic
  carousels.forEach((carousel) => {
    let currentSlide = 0;

    // Target elements STRICTLY inside this specific carousel container
    const slides = carousel.querySelectorAll(".slide");
    const nextBtn = carousel.querySelector(".nav-btn.next");
    const prevBtn = carousel.querySelector(".nav-btn.prev");

    // Safety check: Skip this carousel if buttons or slides are missing
    if (!slides.length || !nextBtn || !prevBtn) {
      console.warn(
        "Carousel setup failed: Missing slides or navigation buttons inside container.",
        carousel,
      );
      return;
    }

    // 3. Define the function to switch slides visually
    function showSlide(index) {
      slides.forEach((slide, i) => {
        if (i === index) {
          slide.classList.add("active"); // Displays the active slide
        } else {
          slide.classList.remove("active"); // Hides the inactive slides
        }
      });
    }

    // 4. Set up click event listener for the Next arrow
    nextBtn.addEventListener("click", (e) => {
      e.preventDefault(); // Prevents jumpy scrolling behaviors
      // Increments the index, loops back to 0 if it hits the end of the array
      currentSlide = (currentSlide + 1) % slides.length;
      showSlide(currentSlide);
    });

    // 5. Set up click event listener for the Previous arrow
    prevBtn.addEventListener("click", (e) => {
      e.preventDefault(); // Prevents jumpy scrolling behaviors
      // Decrements the index, loops back to the final slide if it drops below 0
      currentSlide = (currentSlide - 1 + slides.length) % slides.length;
      showSlide(currentSlide);
    });

    // 6. Initialize the first slide visibility for this carousel on page load
    showSlide(currentSlide);
  });
});
