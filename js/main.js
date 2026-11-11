/* ==========================================================================
   Bosman Smit Pretorius Inc — Main Script
   ========================================================================== */

/* --------------------------------------------------------------------------
   SITE CONFIG — edit these values in ONE place.
   WHATSAPP_NUMBER: international format, digits only, no "+" or spaces.
   e.g. 082 123 4567  →  "27821234567"
   -------------------------------------------------------------------------- */
const SITE_CONFIG = {
  WHATSAPP_NUMBER: "27000000000", // ← REPLACE with the firm's WhatsApp number
  WHATSAPP_MESSAGE: "Good day, I would like to enquire about legal assistance from Bosman Smit Pretorius Inc.",

  // Form integration (optional). Leave empty to use the built-in placeholder
  // behaviour. To go live, paste an endpoint from Formspree, Getform, Basin,
  // Netlify Forms, etc. e.g. "https://formspree.io/f/xxxxxxx"
  FORM_ENDPOINT: ""
};

(function () {
  "use strict";

  document.documentElement.classList.remove("no-js");

  /* ---------- WhatsApp links ---------- */
  const waHref = "https://wa.me/" + SITE_CONFIG.WHATSAPP_NUMBER +
    "?text=" + encodeURIComponent(SITE_CONFIG.WHATSAPP_MESSAGE);
  document.querySelectorAll("[data-whatsapp]").forEach((el) => { el.href = waHref; });

  /* ---------- Sticky header + back-to-top ---------- */
  const header = document.querySelector(".site-header");
  const toTop = document.querySelector(".to-top");
  const onScroll = () => {
    const y = window.scrollY;
    if (header) header.classList.toggle("is-scrolled", y > 30);
    if (toTop) toTop.classList.toggle("is-visible", y > 700);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  if (toTop) toTop.addEventListener("click", () => window.scrollTo({ top: 0 }));

  /* ---------- Mobile menu ---------- */
  const toggle = document.querySelector(".nav__toggle");
  const menu = document.getElementById("primary-menu");
  const setMenu = (open) => {
    if (!toggle || !menu) return;
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    menu.classList.toggle("is-open", open);
    document.body.classList.toggle("menu-open", open);
  };
  if (toggle && menu) {
    toggle.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
    menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && menu.classList.contains("is-open")) { setMenu(false); toggle.focus(); }
    });
    window.matchMedia("(min-width: 992px)").addEventListener("change", (e) => { if (e.matches) setMenu(false); });
  }

  /* ---------- Reveal on scroll ---------- */
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add("is-visible"); io.unobserve(entry.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------- Animated counters ---------- */
  const counters = document.querySelectorAll("[data-count]");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const runCounter = (el) => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || "";
    if (reduceMotion) { el.textContent = target.toLocaleString("en-ZA") + suffix; return; }
    const duration = 2000;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased).toLocaleString("en-ZA") + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if (counters.length && "IntersectionObserver" in window) {
    const co = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { runCounter(entry.target); co.unobserve(entry.target); }
      });
    }, { threshold: 0.5 });
    counters.forEach((el) => co.observe(el));
  } else {
    counters.forEach(runCounter);
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll(".faq__q").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".faq__item");
      const open = btn.getAttribute("aria-expanded") === "true";
      // Close others for a tidy single-open accordion
      document.querySelectorAll(".faq__item.is-open").forEach((other) => {
        if (other !== item) {
          other.classList.remove("is-open");
          other.querySelector(".faq__q").setAttribute("aria-expanded", "false");
        }
      });
      btn.setAttribute("aria-expanded", String(!open));
      item.classList.toggle("is-open", !open);
    });
  });

  /* ---------- Date input: no past dates ---------- */
  document.querySelectorAll('input[type="date"]').forEach((input) => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    input.min = d.toISOString().split("T")[0];
  });

  /* ---------- Forms: validation + placeholder submission ---------- */
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const phoneRe = /^[+()\d\s-]{9,}$/;

  const setError = (field, msg) => {
    const wrap = field.closest(".form-field");
    if (!wrap) return;
    const out = wrap.querySelector(".form-field__error");
    wrap.classList.toggle("has-error", !!msg);
    field.setAttribute("aria-invalid", msg ? "true" : "false");
    if (out) out.textContent = msg || "";
  };

  const validateField = (field) => {
    const v = field.value.trim();
    if (field.required && !v) return "This field is required.";
    if (v && field.type === "email" && !emailRe.test(v)) return "Please enter a valid email address.";
    if (v && field.type === "tel" && !phoneRe.test(v)) return "Please enter a valid phone number.";
    if (v && field.type === "date" && field.min && v < field.min) return "Please choose a future date.";
    return "";
  };

  document.querySelectorAll("form[data-form]").forEach((form) => {
    const status = form.querySelector(".form-status");
    const fields = Array.from(form.querySelectorAll("input:not([type=hidden]):not([type=checkbox]), textarea, select"))
      .filter((f) => !f.closest(".hp-field"));

    fields.forEach((f) => f.addEventListener("blur", () => setError(f, validateField(f))));

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      let firstInvalid = null;
      fields.forEach((f) => {
        const msg = validateField(f);
        setError(f, msg);
        if (msg && !firstInvalid) firstInvalid = f;
      });
      const consent = form.querySelector('input[name="consent"]');
      if (consent && !consent.checked) {
        showStatus(status, "Please confirm consent to be contacted (POPIA).", true);
        if (!firstInvalid) firstInvalid = consent;
      }
      if (firstInvalid) { firstInvalid.focus(); return; }

      // Honeypot spam trap
      const hp = form.querySelector('.hp-field input');
      if (hp && hp.value) return;

      const btn = form.querySelector('[type="submit"]');
      const label = btn.innerHTML;
      btn.disabled = true;
      btn.textContent = "Sending…";

      try {
        if (SITE_CONFIG.FORM_ENDPOINT) {
          const res = await fetch(SITE_CONFIG.FORM_ENDPOINT, {
            method: "POST",
            headers: { Accept: "application/json" },
            body: new FormData(form)
          });
          if (!res.ok) throw new Error("Request failed");
        } else {
          // PLACEHOLDER: simulates a successful submission until a real
          // booking/form service is connected via SITE_CONFIG.FORM_ENDPOINT.
          await new Promise((r) => setTimeout(r, 900));
        }
        form.reset();
        showStatus(status, form.dataset.success || "Thank you. Your message has been received and we will be in touch shortly.");
      } catch (err) {
        showStatus(status, "Sorry, something went wrong. Please call or WhatsApp us directly.", true);
      } finally {
        btn.disabled = false;
        btn.innerHTML = label;
      }
    });
  });

  function showStatus(el, msg, isError) {
    if (!el) return;
    el.textContent = msg;
    el.classList.toggle("is-error", !!isError);
    el.classList.add("is-visible");
  }

  /* ---------- Footer year ---------- */
  document.querySelectorAll("[data-year]").forEach((el) => { el.textContent = new Date().getFullYear(); });
})();
