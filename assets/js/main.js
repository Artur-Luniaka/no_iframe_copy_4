// Import page-specific JavaScript
import "./index.js";
import "./news.js";
import "./contact.js";
import "./disclaimer.js";

document.addEventListener("DOMContentLoaded", function () {
  const includes = document.querySelectorAll("[data-include]");

  includes.forEach(function (element) {
    const file = element.getAttribute("data-include");

    fetch(file)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Failed to load ${file}: ${response.status} ${response.statusText}`
          );
        }
        return response.text();
      })
      .then((html) => {
        element.innerHTML = html;

        // 👉 ВАЖНО: если это header — инициализируем меню
        if (file.includes("header.html")) {
          initMobileMenu();
        }
      })
      .catch((error) => {
        console.error(`Error loading ${file}:`, error);
      });
  });

  const currentYearElement = document.getElementById("currentYear");
  if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear();
  }
});

// Main JavaScript file
document.addEventListener("DOMContentLoaded", function () {
  // Initialize cookie bar
  initCookieBar();

  // Load JSON content
  loadPageContent();

  // Initialize mobile menu
  initMobileMenu();

  // Initialize form validation if on contact page
  if (document.getElementById("contactForm")) {
    initFormValidation();
  }

  // Handle Build Flow link click
  handleBuildFlowLink();
});

// Mobile Menu
function initMobileMenu() {
  const menuToggle = document.querySelector(".mobile-menu-toggle");
  const mobileMenu = document.querySelector(".mobile-menu");
  const closeButton = document.querySelector(".mobile-menu-close");
  const mobileLinks = document.querySelectorAll(".mobile-nav-link");

  if (menuToggle && mobileMenu) {
    // Toggle menu on hamburger click
    menuToggle.addEventListener("click", function () {
      mobileMenu.classList.add("active");
      document.body.style.overflow = "hidden"; // Prevent scrolling
    });

    // Close menu on close button click
    if (closeButton) {
      closeButton.addEventListener("click", function () {
        mobileMenu.classList.remove("active");
        document.body.style.overflow = ""; // Enable scrolling
      });
    }

    // Close menu on link click
    mobileLinks.forEach((link) => {
      link.addEventListener("click", function () {
        mobileMenu.classList.remove("active");
        document.body.style.overflow = ""; // Enable scrolling
      });
    });

    // Close menu on outside click
    mobileMenu.addEventListener("click", function (e) {
      if (e.target === mobileMenu) {
        mobileMenu.classList.remove("active");
        document.body.style.overflow = ""; // Enable scrolling
      }
    });
  }
}

// Cookie Bar
function initCookieBar() {
  const cookieBar = document.querySelector(".cookie-bar");
  const acceptButton = document.querySelector(".cookie-accept");
  const declineButton = document.querySelector(".cookie-decline");

  if (cookieBar) {
    // Check if user has already made a choice
    const cookieChoice = localStorage.getItem("cookieChoice");

    if (!cookieChoice) {
      // Show cookie bar after a short delay
      setTimeout(() => {
        cookieBar.classList.add("active");
      }, 1000);

      // Handle accept button
      if (acceptButton) {
        acceptButton.addEventListener("click", function () {
          localStorage.setItem("cookieChoice", "accepted");
          cookieBar.classList.remove("active");
        });
      }

      // Handle decline button
      if (declineButton) {
        declineButton.addEventListener("click", function () {
          localStorage.setItem("cookieChoice", "declined");
          cookieBar.classList.remove("active");
        });
      }
    }
  }
}

// Load JSON content
function loadPageContent() {
  // Determine current page
  const path = window.location.pathname;
  const page = path.split("/").pop().split(".")[0] || "index";

  // Skip loading for static pages
  if (page === "privacy" || page === "cookies") {
    return;
  }

  // Fetch JSON data
  fetch(`assets/json/${page}.json`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `Failed to load content: ${response.status} ${response.statusText}`
        );
      }
      return response.json();
    })
    .then((data) => {
      // Apply content based on page
      switch (page) {
        case "index":
          applyIndexContent(data);
          break;
        case "news":
          applyNewsContent(data);
          break;
        case "contact":
          applyContactContent(data);
          break;
        case "disclaimer":
          applyDisclaimerContent(data);
          break;
      }

      // Apply meta data if available
      if (data.meta) {
        applyMetaData(data.meta);
      }
    })
    .catch((error) => {
      console.error("Error loading content:", error);
    });
}

// Apply meta data
function applyMetaData(meta) {
  if (meta.title) {
    document.title = meta.title;
  }

  if (meta.description) {
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement("meta");
      metaDescription.setAttribute("name", "description");
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute("content", meta.description);
  }
}

// Apply content for index page
function applyIndexContent(data) {
  // Hero section
  if (data.hero) {
    const heroTitle = document.querySelector(".hero-title");
    const heroDescription = document.querySelector(".hero-description");

    if (heroTitle && data.hero.title) {
      heroTitle.textContent = data.hero.title;
    }

    if (heroDescription && data.hero.description) {
      heroDescription.textContent = data.hero.description;
    }
  }

  // Build Flow section
  if (data.buildFlow) {
    const buildFlowTitle = document.querySelector(
      ".build-flow-section .section-title"
    );
    const buildFlowContent = document.querySelector(".build-flow-content");

    if (buildFlowTitle && data.buildFlow.title) {
      buildFlowTitle.textContent = data.buildFlow.title;
    }

    if (buildFlowContent && data.buildFlow.items) {
      buildFlowContent.innerHTML = "";

      data.buildFlow.items.forEach((item) => {
        const itemElement = document.createElement("div");
        itemElement.className = "build-flow-item";

        itemElement.innerHTML = `
                  <div class="build-flow-icon">${item.icon || ""}</div>
                  <h3 class="build-flow-item-title">${item.title || ""}</h3>
                  <p class="build-flow-item-description">${
                    item.description || ""
                  }</p>
              `;

        buildFlowContent.appendChild(itemElement);
      });
    }
  }

  // Blockscape section
  if (data.blockscape) {
    const blockscapeTitle = document.querySelector(
      ".blockscape-section .section-title"
    );
    const blockscapeContent = document.querySelector(".blockscape-content");

    if (blockscapeTitle && data.blockscape.title) {
      blockscapeTitle.textContent = data.blockscape.title;
    }

    if (blockscapeContent && data.blockscape.content) {
      blockscapeContent.innerHTML = data.blockscape.content;
    }
  }

  // Crafting Grounds section
  if (data.craftingGrounds) {
    const craftingTitle = document.querySelector(
      ".crafting-grounds-section .section-title"
    );
    const craftingContent = document.querySelector(".crafting-grounds-content");

    if (craftingTitle && data.craftingGrounds.title) {
      craftingTitle.textContent = data.craftingGrounds.title;
    }

    if (craftingContent && data.craftingGrounds.content) {
      craftingContent.innerHTML = data.craftingGrounds.content;
    }
  }

  // Biome Explorer section
  if (data.biomeExplorer) {
    const biomeTitle = document.querySelector(
      ".biome-explorer-section .section-title"
    );
    const biomeContent = document.querySelector(".biome-explorer-content");

    if (biomeTitle && data.biomeExplorer.title) {
      biomeTitle.textContent = data.biomeExplorer.title;
    }

    if (biomeContent && data.biomeExplorer.content) {
      biomeContent.innerHTML = data.biomeExplorer.content;
    }
  }

  // Voices section
  if (data.voices) {
    const voicesTitle = document.querySelector(
      ".voices-section .section-title"
    );
    const voicesContainer = document.querySelector(".voices-container");

    if (voicesTitle && data.voices.title) {
      voicesTitle.textContent = data.voices.title;
    }

    if (voicesContainer && data.voices.items) {
      voicesContainer.innerHTML = "";

      data.voices.items.forEach((item) => {
        const gender = Math.random() > 0.5 ? "men" : "women";
        const index = Math.floor(Math.random() * 100); // от 0 до 99
        const avatarUrl = `https://randomuser.me/api/portraits/${gender}/${index}.jpg`;
        const voiceElement = document.createElement("div");
        voiceElement.className = "voice-item";

        voiceElement.innerHTML = `
                  <div>
                      <img class="voice-avatar" src="${avatarUrl}" alt="expierienced user" class="voice-avatar-img">
                  </div>
                  <div class="voice-content">
                      <p class="voice-text">${item.text || ""}</p>
                      <p class="voice-name">${item.name || ""}</p>
                      <p class="voice-location">${item.location || ""}</p>
                  </div>
              `;

        voicesContainer.appendChild(voiceElement);
      });
    }
  }
}

// Apply content for news page
function applyNewsContent(data) {
  // Hero section
  if (data.hero) {
    const newsTitle = document.querySelector(".news-title");
    const newsSubtitle = document.querySelector(".news-subtitle");

    if (newsTitle && data.hero.title) {
      newsTitle.textContent = data.hero.title;
    }

    if (newsSubtitle && data.hero.subtitle) {
      newsSubtitle.textContent = data.hero.subtitle;
    }
  }

  // News articles
  if (data.articles) {
    const articlesContainer = document.querySelector(".news-articles");

    if (articlesContainer) {
      articlesContainer.innerHTML = "";

      data.articles.forEach((article) => {
        const articleElement = document.createElement("div");
        articleElement.className = "news-article";

        articleElement.innerHTML = `
                  <div class="article-image-container">
                      <img src="${article.image || "/placeholder.svg"}" alt="${
          article.title || "News Article"
        }" class="article-image">
                  </div>
                  <div class="article-content">
                      <span class="article-date">${article.date || ""}</span>
                      <h3 class="article-title">${article.title || ""}</h3>
                      <p class="article-excerpt">${article.excerpt || ""}</p>
                  </div>
              `;

        articlesContainer.appendChild(articleElement);
      });
    }
  }
}

// Apply content for contact page
function applyContactContent(data) {
  // Hero section
  if (data.hero) {
    const contactTitle = document.querySelector(".contact-title");
    const contactSubtitle = document.querySelector(".contact-subtitle");

    if (contactTitle && data.hero.title) {
      contactTitle.textContent = data.hero.title;
    }

    if (contactSubtitle && data.hero.subtitle) {
      contactSubtitle.textContent = data.hero.subtitle;
    }
  }

  // Form section
  if (data.form) {
    const formTitle = document.querySelector(".form-title");

    if (formTitle && data.form.title) {
      formTitle.textContent = data.form.title;
    }
  }

  // Contact info
  if (data.info) {
    const infoTitle = document.querySelector(".info-title");
    const infoAddress = document.querySelector(".info-address");
    const infoPhone = document.querySelector(".info-phone");
    const infoEmail = document.querySelector(".info-email");
    const mapContainer = document.querySelector(".contact-map");

    if (infoTitle && data.info.title) {
      infoTitle.textContent = data.info.title;
    }

    if (infoAddress && data.info.address) {
      infoAddress.innerHTML = `
              <div class="info-icon">📍</div>
              <div class="info-text">${data.info.address}</div>
          `;
    }

    if (infoPhone && data.info.phone) {
      infoPhone.innerHTML = `
              <div class="info-icon">📞</div>
              <div class="info-text">${data.info.phone}</div>
          `;
    }

    if (infoEmail && data.info.email) {
      infoEmail.innerHTML = `
              <div class="info-icon">✉️</div>
              <div class="info-text">${data.info.email}</div>
          `;
    }

    // Add Google Maps iframe
    if (mapContainer && data.info.mapEmbed) {
      mapContainer.innerHTML = data.info.mapEmbed;
    }
  }
}

// Apply content for disclaimer page
function applyDisclaimerContent(data) {
  // Hero section
  if (data.hero) {
    const disclaimerTitle = document.querySelector(".disclaimer-title");
    const disclaimerSubtitle = document.querySelector(".disclaimer-subtitle");

    if (disclaimerTitle && data.hero.title) {
      disclaimerTitle.textContent = data.hero.title;
    }

    if (disclaimerSubtitle && data.hero.subtitle) {
      disclaimerSubtitle.textContent = data.hero.subtitle;
    }
  }

  // Disclaimer content
  if (data.content) {
    const disclaimerContent = document.querySelector(".disclaimer-content");

    if (disclaimerContent) {
      disclaimerContent.innerHTML = "";

      data.content.forEach((section) => {
        const sectionElement = document.createElement("div");
        sectionElement.className = "disclaimer-section";

        let sectionHTML = `<h2 class="disclaimer-section-title">${
          section.title || ""
        }</h2>`;

        if (section.paragraphs) {
          section.paragraphs.forEach((paragraph) => {
            sectionHTML += `<p class="disclaimer-text">${paragraph}</p>`;
          });
        }

        if (section.list) {
          sectionHTML += '<ul class="disclaimer-list">';
          section.list.forEach((item) => {
            sectionHTML += `<li class="disclaimer-list-item">${item}</li>`;
          });
          sectionHTML += "</ul>";
        }

        sectionElement.innerHTML = sectionHTML;
        disclaimerContent.appendChild(sectionElement);
      });
    }
  }
}

// Form validation
function initFormValidation() {
  const form = document.getElementById("contactForm");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      let isValid = true;

      // Validate name
      const nameInput = document.getElementById("name");
      const nameError = nameInput.nextElementSibling;
      const nameGroup = nameInput.parentElement;

      if (!nameInput.value.trim()) {
        isValid = false;
        nameGroup.classList.add("error");
        nameError.textContent = "Please enter your name";
      } else {
        nameGroup.classList.remove("error");
        nameError.textContent = "";
      }

      // Validate email
      const emailInput = document.getElementById("email");
      const emailError = emailInput.nextElementSibling;
      const emailGroup = emailInput.parentElement;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailInput.value.trim()) {
        isValid = false;
        emailGroup.classList.add("error");
        emailError.textContent = "Please enter your email";
      } else if (!emailRegex.test(emailInput.value.trim())) {
        isValid = false;
        emailGroup.classList.add("error");
        emailError.textContent = "Please enter a valid email";
      } else {
        emailGroup.classList.remove("error");
        emailError.textContent = "";
      }

      // Validate subject
      const subjectInput = document.getElementById("subject");
      const subjectError = subjectInput.nextElementSibling;
      const subjectGroup = subjectInput.parentElement;

      if (!subjectInput.value.trim()) {
        isValid = false;
        subjectGroup.classList.add("error");
        subjectError.textContent = "Please enter a subject";
      } else {
        subjectGroup.classList.remove("error");
        subjectError.textContent = "";
      }

      // Validate message
      const messageInput = document.getElementById("message");
      const messageError = messageInput.nextElementSibling;
      const messageGroup = messageInput.parentElement;

      if (!messageInput.value.trim()) {
        isValid = false;
        messageGroup.classList.add("error");
        messageError.textContent = "Please enter your message";
      } else if (messageInput.value.trim().length < 10) {
        isValid = false;
        messageGroup.classList.add("error");
        messageError.textContent = "Message must be at least 10 characters";
      } else {
        messageGroup.classList.remove("error");
        messageError.textContent = "";
      }

      // If form is valid, show success message
      if (isValid) {
        // In a real application, you would submit the form data to a server here
        alert("Message sent successfully!");
        form.reset();
      }
    });
  }
}

// Handle Build Flow link click
function handleBuildFlowLink() {
  const buildFlowLinks = document.querySelectorAll(
    ".build-flow-link, .mobile-build-flow-link"
  );

  buildFlowLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      // Only handle if we're on the index page
      if (
        window.location.pathname.endsWith("index.html") ||
        window.location.pathname === "/" ||
        window.location.pathname === ""
      ) {
        e.preventDefault();

        const targetSection = document.getElementById("build-flow");

        if (targetSection) {
          // Close mobile menu if open
          const mobileMenu = document.querySelector(".mobile-menu");
          if (mobileMenu && mobileMenu.classList.contains("active")) {
            mobileMenu.classList.remove("active");
            document.body.style.overflow = "";
          }

          // Scroll to section
          const headerHeight =
            document.querySelector(".site-header").offsetHeight;
          const targetPosition =
            targetSection.getBoundingClientRect().top +
            window.pageYOffset -
            headerHeight;

          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          });
        }
      }
    });
  });
}
