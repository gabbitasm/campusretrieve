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

  // Lost & Found report form: submits to the Campus Retrieve Apps Script Web App
  const REPORT_ENDPOINT =
    "https://script.google.com/a/macros/byui.edu/s/AKfycbx8eUnk2VHzGlxzQqAtPVr5OG1XQP8lWtyXwVDHMCTB0etWdzs7fJEfaMwI99ITvjDe/exec";

  const reportForm = document.getElementById("report-form");
  const confirmation = document.getElementById("report-confirmation");

  if (reportForm && confirmation) {
    reportForm.addEventListener("submit", (e) => {
      e.preventDefault();

      // 1. Require the essentials before anything gets sent
      const fullName = document.getElementById("full-name").value.trim();
      const contactEmail = document.getElementById("contact-email").value.trim();
      const itemDescription = document
        .getElementById("item-description")
        .value.trim();

      if (!fullName || !contactEmail || !itemDescription) {
        confirmation.textContent =
          "Please fill in your name, email, and item description before submitting.";
        confirmation.style.color = "#c0392b";
        confirmation.hidden = false;
        return;
      }

      // 2. Gather the rest of the fields by their existing IDs
      const reportType = reportForm.querySelector(
        'input[name="report-type"]:checked',
      )?.value;

      const payload = {
        reportType,
        fullName,
        contactEmail,
        itemDescription,
        itemDate: document.getElementById("item-date").value,
        itemLocation: document.getElementById("item-location").value,
        itemWorth: document.getElementById("item-worth").value,
        rewardOffered: document.getElementById("reward-offered").value,
        bloodType: document.getElementById("blood-type").value,
        conspiracyTheory: document.getElementById("conspiracy-theory").value,
        funFact: document.getElementById("fun-fact").value,
        iqLevel: document.getElementById("iq-level").value,
        gamingHours: document.getElementById("gaming-hours").value,
        relationshipStatus: document.getElementById("relationship-status")
          .value,
      };

      // 3. Apps Script doesn't send CORS headers, so the response is opaque
      // under no-cors and can't be read — text/plain avoids a preflight
      // that Apps Script would fail anyway, while doPost() still JSON.parses
      // the raw body on the other end. Assume success if fetch doesn't throw.
      fetch(REPORT_ENDPOINT, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
      })
        .then(() => {
          confirmation.textContent =
            "Report logged. A Josh will be with you shortly.";
          confirmation.style.color = "";
          confirmation.hidden = false;
          reportForm.reset();
        })
        .catch((err) => {
          console.warn("Report submission failed:", err);
          confirmation.textContent =
            "Something went wrong sending your report. Please try again.";
          confirmation.style.color = "#c0392b";
          confirmation.hidden = false;
        });
    });
  }
});
