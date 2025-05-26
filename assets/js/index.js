// Index page specific JavaScript
document.addEventListener("DOMContentLoaded", function () {
  // Add animations to sections when they come into view
  const sections = document.querySelectorAll("section");

  // Create an Intersection Observer
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animated");
          // Stop observing once animation is applied
          observer.unobserve(entry.target);
        }
      });
    },
    {
      root: null, // viewport
      threshold: 0.2, // 20% of the element must be visible
      rootMargin: "0px",
    }
  );

  // Observe each section
  sections.forEach((section) => {
    observer.observe(section);
  });
});
