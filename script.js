/* 
   Circle wheel menu
   Adapted from the CodeFronts "Full Circle Wheel" demo.
  */

// Rotates the wheel to the chosen stop and updates the center text and link
function initWheel() {
  const wheel = document.querySelector(".wheel");
  if (!wheel) return; // other pages don't have a wheel

  const list = wheel.querySelector(".wheel__list");
  const stops = Array.from(wheel.querySelectorAll(".wheel__stop"));
  const current = wheel.querySelector(".wheel__current");
  const openLink = wheel.querySelector(".wheel__open");
  const live = wheel.querySelector(".wheel__live");

  const total = stops.length;
  const step = 360 / total;
  let rotation = 0;
  let active = 0;

  function goTo(index) {
    // Wrap around so next/previous loop forever
    const target = ((index % total) + total) % total;

    // Take the shortest way around the circle
    let diff = target - active;
    if (diff > total / 2) diff -= total;
    if (diff < -total / 2) diff += total;

    rotation -= diff * step;
    list.style.setProperty("--rot", rotation + "deg");

    stops.forEach((stop, i) => {
      stop.classList.toggle("is-active", i === target);
      stop.setAttribute("aria-pressed", String(i === target));
    });

    active = target;
    current.textContent = stops[target].dataset.title;
    openLink.href = stops[target].dataset.href;
    live.textContent = stops[target].dataset.title + " selected";
  }

  stops.forEach((stop, i) => stop.addEventListener("click", () => goTo(i)));
  wheel
    .querySelector(".wheel__prev")
    .addEventListener("click", () => goTo(active - 1));
  wheel
    .querySelector(".wheel__next")
    .addEventListener("click", () => goTo(active + 1));
}

initWheel();

/* 
   Mobile navigation toggle (content pages)
   */

// Opens and closes the nav list on small screens
function initNavToggle() {
  const toggle = document.querySelector(".nav-toggle");
  const list = document.querySelector(".site-nav__list");
  if (!toggle || !list) return; // the home page has no toggle

  toggle.addEventListener("click", () => {
    const isOpen = list.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });
}

initNavToggle();

/* 
   Contact form validation (rebuilt from Module 6 in plain JS)
   */

// Shows or clears the error message under one field
function setFieldError(field, message) {
  const error = document.getElementById(field.id + "-error");
  error.textContent = message;
  if (message) {
    field.setAttribute("aria-invalid", "true");
  } else {
    field.removeAttribute("aria-invalid");
  }
}

// Returns an error message for one field, or "" when the field is fine
function getFieldMessage(field) {
  const value = field.value.trim();

  if (field.id === "your_name" && value === "") {
    return "Please enter your name.";
  }
  if (field.id === "your_email") {
    if (value === "") return "Please enter your email address.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return "Please enter a valid email address, like name@example.com.";
    }
  }
  if (field.id === "topic" && value === "") {
    return "Please choose a topic.";
  }
  if (field.id === "message" && value.length < 10) {
    return "Please write at least 10 characters.";
  }
  return "";
}

// Checks every field on submit and shows a thank-you message when all pass
function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return; // only the Experiences page has the form

  const fields = Array.from(form.querySelectorAll("input, select, textarea"));
  const status = document.getElementById("form-status");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    status.textContent = "";

    let firstBad = null;
    fields.forEach((field) => {
      const message = getFieldMessage(field);
      setFieldError(field, message);
      if (message && !firstBad) firstBad = field;
    });

    if (firstBad) {
      firstBad.focus();
      return;
    }

    status.textContent =
      "Thank you, " +
      form.elements.your_name.value.trim() +
      "! Your message was sent.";
    form.reset();
  });

  // Clear an error as soon as the visitor starts fixing the field
  fields.forEach((field) => {
    field.addEventListener("input", () => setFieldError(field, ""));
  });

  // Reset button also clears errors and the status line
  form.addEventListener("reset", () => {
    fields.forEach((field) => setFieldError(field, ""));
    status.textContent = "";
  });
}

initContactForm();
