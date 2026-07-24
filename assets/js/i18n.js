(function () {
  "use strict";

  const LANGS = [
    { code: "en", label: "English", native: "English", dir: "ltr" },
    { code: "ru", label: "Russian", native: "Русский", dir: "ltr" },
    { code: "es", label: "Spanish", native: "Español", dir: "ltr" },
    { code: "fr", label: "French", native: "Français", dir: "ltr" },
    { code: "de", label: "German", native: "Deutsch", dir: "ltr" },
    { code: "pt", label: "Portuguese", native: "Português", dir: "ltr" },
    { code: "zh", label: "Chinese", native: "中文", dir: "ltr" },
    { code: "ar", label: "Arabic", native: "العربية", dir: "rtl" },
  ];
  const STORAGE_KEY = "nilemnod-lang";
  const T = window.I18N || {};
  const meta = LANGS.reduce((m, l) => ((m[l.code] = l), m), {});

  // Cache original (English, in-markup) values so switching back is lossless.
  const cache = new WeakMap();

  function get(lang, key) {
    const dict = T[lang];
    if (!dict) return undefined;
    return key.split(".").reduce((o, k) => (o == null ? undefined : o[k]), dict);
  }

  function applyTo(scope) {
    const lang = document.documentElement.getAttribute("lang") || "en";
    const nodes = (scope || document).querySelectorAll("[data-i18n], [data-i18n-attr]");
    nodes.forEach((el) => {
      let store = cache.get(el);
      if (!store) {
        store = { text: el.innerHTML, attrs: {} };
        cache.set(el, store);
      }
      const key = el.getAttribute("data-i18n");
      if (key) {
        const val = lang === "en" ? undefined : get(lang, key);
        const useHtml = el.hasAttribute("data-i18n-html");
        if (val != null) {
          useHtml ? (el.innerHTML = val) : (el.textContent = val);
        } else {
          el.innerHTML = store.text;
        }
      }
      const attrSpec = el.getAttribute("data-i18n-attr");
      if (attrSpec) {
        attrSpec.split(",").forEach((pair) => {
          const [attr, k] = pair.split(":").map((s) => s.trim());
          if (!attr || !k) return;
          if (store.attrs[attr] == null) store.attrs[attr] = el.getAttribute(attr) || "";
          const val = lang === "en" ? undefined : get(lang, k);
          el.setAttribute(attr, val != null ? val : store.attrs[attr]);
        });
      }
    });
  }
  window.I18nApply = applyTo;

  function setLang(code, persist) {
    const info = meta[code] || meta.en;
    document.documentElement.setAttribute("lang", info.code);
    document.documentElement.setAttribute("dir", info.dir);
    applyTo(document);
    document.querySelectorAll(".lang-menu button").forEach((b) => {
      b.classList.toggle("active", b.getAttribute("data-lang") === info.code);
    });
    document.querySelectorAll(".lang-current").forEach((el) => {
      el.textContent = info.code.toUpperCase();
    });
    if (persist !== false) {
      try { localStorage.setItem(STORAGE_KEY, info.code); } catch (e) {}
    }
  }

  function detect() {
    let saved;
    try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) {}
    if (saved && meta[saved]) return saved;
    const nav = (navigator.language || "en").slice(0, 2).toLowerCase();
    return meta[nav] ? nav : "en";
  }

  function buildSwitcher() {
    document.querySelectorAll("[data-lang-switcher]").forEach((wrap) => {
      const menu = wrap.querySelector(".lang-menu");
      const toggle = wrap.querySelector(".lang-toggle");
      if (!menu || !toggle) return;
      menu.innerHTML = LANGS.map(
        (l) =>
          '<button type="button" data-lang="' + l.code + '"><span>' + l.label +
          '</span><span class="native">' + l.native + "</span></button>"
      ).join("");
      menu.querySelectorAll("button").forEach((b) => {
        b.addEventListener("click", () => {
          setLang(b.getAttribute("data-lang"));
          wrap.classList.remove("open");
        });
      });
      toggle.addEventListener("click", (e) => {
        e.stopPropagation();
        wrap.classList.toggle("open");
      });
    });
    document.addEventListener("click", () => {
      document.querySelectorAll("[data-lang-switcher].open").forEach((w) => w.classList.remove("open"));
    });
  }

  const init = () => {
    buildSwitcher();
    setLang(detect(), false);
  };
  document.readyState === "loading"
    ? document.addEventListener("DOMContentLoaded", init)
    : init();
})();
