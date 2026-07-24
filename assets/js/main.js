(function () {
  "use strict";

  const onReady = (fn) =>
    document.readyState === "loading"
      ? document.addEventListener("DOMContentLoaded", fn)
      : fn();

  onReady(function () {
    /* ---- Theme ---- */
    const root = document.documentElement;
    const THEME_KEY = "nilemnod-theme";
    const applyTheme = (t) => {
      root.setAttribute("data-theme", t);
      try { localStorage.setItem(THEME_KEY, t); } catch (e) {}
      document.querySelectorAll("[data-theme-toggle]").forEach((b) => {
        b.setAttribute("aria-label", t === "dark" ? "Switch to light theme" : "Switch to dark theme");
      });
    };
    let savedTheme;
    try { savedTheme = localStorage.getItem(THEME_KEY); } catch (e) {}
    applyTheme(savedTheme || "dark");
    document.querySelectorAll("[data-theme-toggle]").forEach((btn) => {
      btn.addEventListener("click", () =>
        applyTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark")
      );
    });

    /* ---- Navbar scroll ---- */
    const nav = document.querySelector(".nav");
    const onScroll = () => nav && nav.classList.toggle("scrolled", window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    /* ---- Mobile menu ---- */
    const navToggle = document.querySelector(".nav-toggle");
    const navLinks = document.querySelector(".nav-links");
    if (navToggle && navLinks) {
      navToggle.addEventListener("click", () => navLinks.classList.toggle("open"));
      navLinks.querySelectorAll("a").forEach((a) =>
        a.addEventListener("click", () => navLinks.classList.remove("open"))
      );
    }

    /* ---- Reveal on scroll ---- */
    const reveals = document.querySelectorAll("[data-reveal]");
    if ("IntersectionObserver" in window && reveals.length) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("in");
              io.unobserve(e.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
      );
      reveals.forEach((el) => io.observe(el));
    } else {
      reveals.forEach((el) => el.classList.add("in"));
    }

    /* ---- FAQ accordion ---- */
    document.querySelectorAll(".faq-item").forEach((item) => {
      const q = item.querySelector(".faq-q");
      const a = item.querySelector(".faq-a");
      if (!q || !a) return;
      q.addEventListener("click", () => {
        const open = item.classList.toggle("open");
        q.setAttribute("aria-expanded", open ? "true" : "false");
        a.style.maxHeight = open ? a.scrollHeight + "px" : "0";
      });
    });
    window.addEventListener("resize", () => {
      document.querySelectorAll(".faq-item.open .faq-a").forEach((a) => {
        a.style.maxHeight = a.scrollHeight + "px";
      });
    });

    /* ---- TOC active state ---- */
    const tocLinks = document.querySelectorAll(".toc a");
    if (tocLinks.length && "IntersectionObserver" in window) {
      const map = {};
      tocLinks.forEach((l) => (map[l.getAttribute("href").slice(1)] = l));
      const spy = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              tocLinks.forEach((l) => l.classList.remove("active"));
              const active = map[e.target.id];
              if (active) active.classList.add("active");
            }
          });
        },
        { rootMargin: "-20% 0px -70% 0px" }
      );
      document.querySelectorAll(".prose section[id]").forEach((s) => spy.observe(s));
    }

    /* ---- Contact form ---- */
    const form = document.querySelector("#contact-form");
    if (form) {
      const status = form.querySelector(".form-status");
      const endpoint = form.getAttribute("data-endpoint") || "";
      const isConfigured = endpoint && endpoint.indexOf("YOUR_FORM_ID") === -1;
      const STATUS_TEXT = {
        "contact.status.ok": "Thanks! Your message has been sent. We'll reply shortly.",
        "contact.status.err": "Couldn't send. Please try again or email hello@nilemnod.com.",
        "contact.status.mailto": "Opening your email app…",
      };
      const showStatus = (type, key) => {
        if (!status) return;
        status.className = "form-status show " + type;
        let text = STATUS_TEXT[key] || "";
        const lang = document.documentElement.getAttribute("lang") || "en";
        if (lang !== "en" && window.I18N && window.I18N[lang]) {
          const v = key.split(".").reduce((o, k) => (o == null ? undefined : o[k]), window.I18N[lang]);
          if (v) text = v;
        }
        status.textContent = text;
      };
      form.addEventListener("submit", async (ev) => {
        ev.preventDefault();
        const data = new FormData(form);
        if (!isConfigured) {
          const email = form.getAttribute("data-mailto") || "support@nilemnod.com";
          const subject = encodeURIComponent("[Nilemnod] " + (data.get("subject") || "Message"));
          const body = encodeURIComponent(
            "Name: " + (data.get("name") || "") +
            "\nEmail: " + (data.get("email") || "") +
            "\n\n" + (data.get("message") || "")
          );
          window.location.href = "mailto:" + email + "?subject=" + subject + "&body=" + body;
          showStatus("ok", "contact.status.mailto");
          return;
        }
        const btn = form.querySelector('button[type="submit"]');
        if (btn) btn.disabled = true;
        try {
          const res = await fetch(endpoint, {
            method: "POST",
            body: data,
            headers: { Accept: "application/json" },
          });
          if (res.ok) {
            form.reset();
            showStatus("ok", "contact.status.ok");
          } else {
            showStatus("err", "contact.status.err");
          }
        } catch (e) {
          showStatus("err", "contact.status.err");
        } finally {
          if (btn) btn.disabled = false;
        }
      });
    }

    /* ---- Footer year ---- */
    document.querySelectorAll("[data-year]").forEach((el) => {
      el.textContent = new Date().getFullYear();
    });
  });
})();
