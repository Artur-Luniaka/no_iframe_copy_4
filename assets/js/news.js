// News page specific JavaScript
document.addEventListener("DOMContentLoaded", function () {
  // Add animations to news articles when they come into view
  const articles = document.querySelectorAll(".news-article");

  // Create an Intersection Observer
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Add a delay based on the index for staggered animation
          setTimeout(() => {
            entry.target.classList.add("animated");
          }, index * 150);

          // Stop observing once animation is applied
          observer.unobserve(entry.target);
        }
      });
    },
    {
      root: null, // viewport
      threshold: 0.1, // 10% of the element must be visible
      rootMargin: "0px",
    }
  );

  // Observe each article
  articles.forEach((article) => {
    observer.observe(article);
  });
});
