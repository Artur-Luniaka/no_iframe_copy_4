// Contact page specific JavaScript
document.addEventListener("DOMContentLoaded", function () {
  // Add Google Maps iframe if not already added by JSON
  const mapContainer = document.querySelector(".contact-map");

  if (mapContainer && !mapContainer.querySelector("iframe")) {
    // Default map for Sydney, Australia
    mapContainer.innerHTML = `
            <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3523.123456789!2d152.9123456!3d-31.4301234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b9e123456789abc%3A0xabcdef1234567890!2s42%20Granite%20St%2C%20Port%20Macquarie%20NSW%202444%2C%20Australia!5e0!3m2!1sen!2sau!4v1716273158655!5m2!1sen!2sau" 
                allowfullscreen="" 
                loading="lazy" 
                referrerpolicy="no-referrer-when-downgrade">
            </iframe>
        `;
  }

  // Add input animations
  const formInputs = document.querySelectorAll(".form-input, .form-textarea");

  formInputs.forEach((input) => {
    // Add focus class on focus
    input.addEventListener("focus", function () {
      this.parentElement.classList.add("focused");
    });

    // Remove focus class on blur
    input.addEventListener("blur", function () {
      this.parentElement.classList.remove("focused");
    });
  });
});
