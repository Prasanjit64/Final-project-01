/* =========================================================
   Prasanjit Ghosh — Portfolio Script
   Beginner-friendly, commented, organized by feature.
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

  /* ---------------------------------------------------------
     1. Mobile navigation menu
     --------------------------------------------------------- */
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", function () {
      const isOpen = navMenu.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    });

    // Close the mobile menu whenever a nav link is clicked
    navMenu.querySelectorAll(".nav-link").forEach(function (link) {
      link.addEventListener("click", function () {
        navMenu.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.setAttribute("aria-label", "Open menu");
      });
    });
  }

  /* ---------------------------------------------------------
     2. Smooth scrolling for in-page links
     (CSS `scroll-behavior: smooth` already handles most of this;
     this JS fallback also accounts for the fixed header height.)
     --------------------------------------------------------- */
  const header = document.getElementById("site-header");
  const headerHeight = header ? header.offsetHeight : 0;

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId.length <= 1) return; // ignore bare "#"
      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight + 1;
      window.scrollTo({ top: targetPosition, behavior: "smooth" });
    });
  });

  /* ---------------------------------------------------------
     3. Header background state on scroll
     --------------------------------------------------------- */
  function updateHeaderState() {
    if (window.scrollY > 12) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }
  updateHeaderState();
  window.addEventListener("scroll", updateHeaderState);

  /* ---------------------------------------------------------
     4. Active navigation link based on scroll position
     --------------------------------------------------------- */
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  function updateActiveLink() {
    let currentSectionId = "";
    const scrollPos = window.scrollY + headerHeight + 40;

    sections.forEach(function (section) {
      if (scrollPos >= section.offsetTop) {
        currentSectionId = section.id;
      }
    });

    navLinks.forEach(function (link) {
      link.classList.toggle("active-link", link.getAttribute("href") === "#" + currentSectionId);
    });
  }
  updateActiveLink();
  window.addEventListener("scroll", updateActiveLink);

  /* ---------------------------------------------------------
     5. Scroll reveal animations (IntersectionObserver)
     --------------------------------------------------------- */
  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    revealElements.forEach(function (el) { revealObserver.observe(el); });
  } else {
    // Fallback: if IntersectionObserver isn't supported, just show everything
    revealElements.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------------------------------------------------------
     6. Animate skill bars once they scroll into view
     --------------------------------------------------------- */
  const skillCards = document.querySelectorAll(".skill-card");

  if ("IntersectionObserver" in window) {
    const skillObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const card = entry.target;
            const level = card.getAttribute("data-level") || "0";
            const fill = card.querySelector(".skill-bar-fill");
            if (fill) fill.style.width = level + "%";
            observer.unobserve(card);
          }
        });
      },
      { threshold: 0.4 }
    );

    skillCards.forEach(function (card) { skillObserver.observe(card); });
  } else {
    skillCards.forEach(function (card) {
      const level = card.getAttribute("data-level") || "0";
      const fill = card.querySelector(".skill-bar-fill");
      if (fill) fill.style.width = level + "%";
    });
  }

  /* ---------------------------------------------------------
     7. Project filtering
     --------------------------------------------------------- */
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  filterButtons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      const filter = btn.getAttribute("data-filter");

      // Update active button state
      filterButtons.forEach(function (b) {
        b.classList.remove("is-active");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("is-active");
      btn.setAttribute("aria-selected", "true");

      // Show/hide project cards based on their data-tech attribute
      projectCards.forEach(function (card) {
        const techList = (card.getAttribute("data-tech") || "").split(" ");
        const shouldShow = filter === "all" || techList.includes(filter);
        card.classList.toggle("is-hidden", !shouldShow);
      });
    });
  });

  /* ---------------------------------------------------------
     8. Contact form validation
     --------------------------------------------------------- */
  const contactForm = document.getElementById("contactForm");

  if (contactForm) {
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const messageInput = document.getElementById("message");
    const formNote = document.getElementById("formNote");

    function setError(input, errorEl, message) {
      input.closest(".form-row").classList.add("has-error");
      errorEl.textContent = message;
    }

    function clearError(input, errorEl) {
      input.closest(".form-row").classList.remove("has-error");
      errorEl.textContent = "";
    }

    function isValidEmail(value) {
      // Simple, readable email pattern — good enough for client-side checks
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    const submitBtn = contactForm.querySelector('button[type="submit"]');

    contactForm.addEventListener("submit", function (e) {
      e.preventDefault(); // always intercept first: we validate before sending anywhere
      let isFormValid = true;

      const nameError = document.getElementById("nameError");
      const emailError = document.getElementById("emailError");
      const messageError = document.getElementById("messageError");

      // Required: name
      if (nameInput.value.trim() === "") {
        setError(nameInput, nameError, "Please enter your name.");
        isFormValid = false;
      } else {
        clearError(nameInput, nameError);
      }

      // Required + valid format: email
      if (emailInput.value.trim() === "") {
        setError(emailInput, emailError, "Please enter your email.");
        isFormValid = false;
      } else if (!isValidEmail(emailInput.value.trim())) {
        setError(emailInput, emailError, "Please enter a valid email address.");
        isFormValid = false;
      } else {
        clearError(emailInput, emailError);
      }

      // Required, non-empty: message
      if (messageInput.value.trim() === "") {
        setError(messageInput, messageError, "Please write a message before sending.");
        isFormValid = false;
      } else {
        clearError(messageInput, messageError);
      }

      if (!isFormValid) {
        formNote.textContent = "Please fix the highlighted fields above.";
        formNote.style.color = "var(--danger)";
        return;
      }

      // Send the validated message to FormSubmit, which forwards it to
      // abhayghosh750@gmail.com — no custom backend server required.
      formNote.textContent = "Sending your message...";
      formNote.style.color = "var(--text-muted)";
      if (submitBtn) submitBtn.disabled = true;

      fetch(contactForm.action, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(contactForm),
      })
        .then(function (response) {
          if (!response.ok) throw new Error("Request failed");
          formNote.textContent = "Thanks! Your message has been sent — I'll get back to you soon.";
          formNote.style.color = "var(--success)";
          contactForm.reset();
        })
        .catch(function () {
          formNote.textContent =
            "Something went wrong sending your message. Please try again, or email me directly at abhayghosh750@gmail.com.";
          formNote.style.color = "var(--danger)";
        })
        .finally(function () {
          if (submitBtn) submitBtn.disabled = false;
        });
    });

    // Clear individual field errors as the user corrects them
    [
      [nameInput, "nameError"],
      [emailInput, "emailError"],
      [messageInput, "messageError"],
    ].forEach(function (pair) {
      const input = pair[0];
      const errorEl = document.getElementById(pair[1]);
      input.addEventListener("input", function () {
        if (input.value.trim() !== "") {
          clearError(input, errorEl);
        }
      });
    });
  }

  /* ---------------------------------------------------------
     9. Scroll-to-top button
     --------------------------------------------------------- */
  const scrollTopBtn = document.getElementById("scrollTopBtn");

  if (scrollTopBtn) {
    window.addEventListener("scroll", function () {
      scrollTopBtn.classList.toggle("is-visible", window.scrollY > 500);
    });

    scrollTopBtn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------------------------------------------------------
     10. Footer year
     --------------------------------------------------------- */
  const yearSpan = document.getElementById("year");
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  /* ---------------------------------------------------------
     11. Resume buttons (View + Download) — friendly notice if
     resume.pdf hasn't been added to the project yet
     --------------------------------------------------------- */
  const resumeButtons = [
    document.getElementById("resumeBtnHero"),
    document.getElementById("resumeViewBtnHero"),
    document.getElementById("resumeBtnMain"),
    document.getElementById("resumeViewBtnMain"),
  ];

  resumeButtons.forEach(function (btn) {
    if (!btn) return;
    btn.addEventListener("click", function (e) {
      fetch(btn.getAttribute("href"), { method: "HEAD" })
        .then(function (res) {
          if (!res.ok) throw new Error("Not found");
        })
        .catch(function () {
          e.preventDefault();
          alert("Resume is coming soon! Add your resume.pdf file to the project root to enable this button.");
        });
    });
  });

});
