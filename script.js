/* ------------------------------ */
/* Navigation toggle (mobile)     */
/* ------------------------------ */
document.addEventListener("DOMContentLoaded", function () {
  const navToggle = document.querySelector(".nav-toggle");
  const mobileNav = document.querySelector(".mobile-nav");

  if (navToggle && mobileNav) {
    navToggle.addEventListener("click", () => {
      mobileNav.classList.toggle("open");
    });
  }
});

/* ------------------------------ */
/* Smooth scroll for anchor links */
/* ------------------------------ */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      e.preventDefault();
      window.scrollTo({
        top: target.offsetTop,
        behavior: "smooth",
      });
    }
  });
});

/* ------------------------------ */
/* Sticky CTA after scrolling     */
/* ------------------------------ */
window.addEventListener("scroll", () => {
  const stickyCTA = document.querySelector(".sticky-cta");
  if (!stickyCTA) return;
  if (window.scrollY > 600) {
    stickyCTA.classList.add("visible");
  } else {
    stickyCTA.classList.remove("visible");
  }
});

/* ------------------------------ */
/* Modal open/close logic         */
/* ------------------------------ */
const modal = document.getElementById("contactModal");
const modalOverlay = document.getElementById("modalOverlay");
const openModalBtns = document.querySelectorAll(".open-modal");
const closeModalBtn = document.getElementById("closeModal");

function openModal() {
  modal.classList.add("show");
  modalOverlay.classList.add("show");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modal.classList.remove("show");
  modalOverlay.classList.remove("show");
  document.body.style.overflow = "auto";
}

openModalBtns.forEach((btn) => {
  btn.addEventListener("click", openModal);
});
closeModalBtn.addEventListener("click", closeModal);
modalOverlay.addEventListener("click", closeModal);

/* ------------------------------ */
/* Inline Form Submit (REAL)      */
/* ------------------------------ */
const leadForm = document.getElementById("lead-form");
const leadSubmitButton = document.getElementById("lead-submit");

if (leadForm && leadSubmitButton) {
  leadForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const btn = leadSubmitButton;
    const original = btn.textContent;
    btn.disabled = true;
    btn.textContent = "Sending...";

    const payload = {
      team: document.getElementById("lf-team").value.trim(),
      email: document.getElementById("lf-email").value.trim(),
      message: document.getElementById("lf-message").value.trim(),
      source: "inline_form",
    };

    try {
      const res = await fetch("submit.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.status === "success") {
        btn.textContent = "Submitted";
        leadForm.reset();
      } else {
        btn.textContent = "Try Again";
      }
    } catch (err) {
      console.error(err);
      btn.textContent = "Try Again";
    }

    setTimeout(() => {
      btn.textContent = original;
      btn.disabled = false;
    }, 1500);
  });
}

/* ------------------------------ */
/* Modal Form Submit (REAL)       */
/* ------------------------------ */
const modalForm = document.getElementById("modal-form");

if (modalForm) {
  modalForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const submitBtn = modalForm.querySelector('button[type="submit"]');
    const original = submitBtn.textContent;

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    const payload = {
      team: modalForm.company.value.trim(),
      name: modalForm.name.value.trim(),
      email: modalForm.email.value.trim(),
      phone: modalForm.phone.value.trim(),
      product: modalForm.product.value,
      quantity: modalForm.quantity.value,
      samples: modalForm.samples.value,
      message: modalForm.message.value.trim(),
      source: "modal",
    };

    try {
      const res = await fetch("submit.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.status === "success") {
        alert("Thanks! Your Zootopia guide is on the way.");
        closeModal();
        modalForm.reset();
      } else {
        submitBtn.textContent = "Try Again";
      }
    } catch (err) {
      console.error(err);
      submitBtn.textContent = "Try Again";
    }

    setTimeout(() => {
      submitBtn.textContent = original;
      submitBtn.disabled = false;
    }, 1500);
  });
}

/* ------------------------------ */
/* Scroll-based reveal animation  */
/* ------------------------------ */
const reveals = document.querySelectorAll(".reveal");
const revealOnScroll = () => {
  const triggerBottom = window.innerHeight * 0.85;
  reveals.forEach((el) => {
    const boxTop = el.getBoundingClientRect().top;
    if (boxTop < triggerBottom) {
      el.classList.add("active");
    }
  });
};
window.addEventListener("scroll", revealOnScroll);
revealOnScroll();
