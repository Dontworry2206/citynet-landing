/**
 * CITYNET landing — rendering + interaction logic.
 * No build step: vanilla JS, content comes from window.CITYNET_CONTENT (content.js).
 *
 * Backend note: there is no lead-intake server configured yet. Set
 * window.CITYNET_LEAD_ENDPOINT to a real URL before launch — see submitLead().
 * Until then the form runs in DEMO mode: it validates and shows the success
 * state locally so the flow can be reviewed end to end, but nothing is sent
 * or stored anywhere, and no lead is created in any CRM.
 */
(function () {
  "use strict";

  var DATA = window.CITYNET_CONTENT;
  var STORAGE_LANG = "citynet_lang";
  var STORAGE_THEME = "citynet_theme";
  var LEAD_ENDPOINT = window.CITYNET_LEAD_ENDPOINT || null;

  var state = {
    lang: getStoredLang(),
    theme: getStoredTheme(),
    selectedTariff: ""
  };

  /* ---------------- storage helpers (fail silently in locked-down contexts) ---------------- */
  function safeGet(key) {
    try { return window.localStorage.getItem(key); } catch (e) { return null; }
  }
  function safeSet(key, value) {
    try { window.localStorage.setItem(key, value); } catch (e) { /* ignore */ }
  }

  function getStoredLang() {
    var stored = safeGet(STORAGE_LANG);
    if (stored && DATA.languages.indexOf(stored) !== -1) return stored;
    return DATA.defaultLanguage;
  }
  function getStoredTheme() {
    var stored = safeGet(STORAGE_THEME);
    if (stored === "light" || stored === "dark") return stored;
    return "light"; /* day = default per brief request */
  }

  /* ---------------- i18n ---------------- */
  function t(key) {
    var parts = key.split(".");
    var node = DATA.strings[state.lang];
    for (var i = 0; i < parts.length; i++) {
      if (node == null) return "";
      node = node[parts[i]];
    }
    return node == null ? "" : node;
  }

  function applyTranslations(root) {
    root.querySelectorAll("[data-i18n]").forEach(function (el) {
      var value = t(el.getAttribute("data-i18n"));
      if (typeof value === "string") el.textContent = value;
    });
    root.querySelectorAll("[data-i18n-placeholder]").forEach(function (el) {
      var value = t(el.getAttribute("data-i18n-placeholder"));
      if (typeof value === "string") el.setAttribute("placeholder", value);
    });
  }

  function localizedField(obj) {
    return obj[state.lang] || obj.ru;
  }

  /* ---------------- render: benefits ---------------- */
  function renderBenefits() {
    var list = document.getElementById("benefitsList");
    var items = t("benefits.items") || [];
    var icons = [
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 21s7-5.2 7-11.6A7 7 0 0 0 5 9.4C5 15.8 12 21 12 21Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><circle cx="12" cy="9.5" r="2.2" stroke="currentColor" stroke-width="1.6"/></svg>',
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="13" rx="2.5" stroke="currentColor" stroke-width="1.6"/><path d="M8 21h8M12 18v3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 3v4M12 17v4M4.9 12H3M21 12h-1.9M6 6l1.8 1.8M18 18l-1.8-1.8M18 6l-1.8 1.8M6 18l1.8-1.8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><circle cx="12" cy="12" r="3.5" stroke="currentColor" stroke-width="1.6"/></svg>',
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 12.5 9 17l11-11" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    ];
    list.innerHTML = items.map(function (item, i) {
      return '<li><span class="benefit-icon">' + (icons[i] || "") + '</span>' +
        '<div><h3>' + escapeHtml(item.title) + '</h3><p>' + escapeHtml(item.text) + '</p></div></li>';
    }).join("");
  }

  /* ---------------- render: tariffs ---------------- */
  function renderTariffs() {
    var grid = document.getElementById("tariffGrid");
    var tr = t("tariffs");
    grid.innerHTML = DATA.tariffs.map(function (tariff) {
      var desc = tr.descriptions[tariff.id] || "";
      return (
        '<div class="tariff-card' + (tariff.featured ? " tariff-card--featured" : "") + '" data-tariff="' + tariff.id + '">' +
          '<p class="tariff-card__name">' + tariff.name + '</p>' +
          '<p class="tariff-card__speed">' + tariff.speed + '<span>' + tr.speedUnit + '</span></p>' +
          '<p class="tariff-card__price">' + formatPrice(tariff.price) + ' <span>' + tr.perMonth + '</span></p>' +
          '<p class="tariff-card__desc">' + escapeHtml(desc) + '</p>' +
          '<button type="button" class="btn ' + (tariff.featured ? "btn--primary" : "btn--ghost") + ' btn--block js-select-tariff" data-tariff="' + tariff.id + '" data-analytics="select_tariff">' +
            tr.cta + ' ' + tariff.name +
          '</button>' +
        '</div>'
      );
    }).join("");

    var select = document.getElementById("f-tariff");
    var helpOption = select.querySelector('option[value=""]');
    select.innerHTML = "";
    select.appendChild(helpOption);
    helpOption.textContent = t("form.tariffHelp");
    DATA.tariffs.forEach(function (tariff) {
      var opt = document.createElement("option");
      opt.value = tariff.id;
      opt.textContent = tariff.name + " — " + tariff.speed + " " + tr.speedUnit + " / " + formatPrice(tariff.price) + " " + tr.perMonth;
      select.appendChild(opt);
    });
    select.value = state.selectedTariff;

    grid.querySelectorAll(".js-select-tariff").forEach(function (btn) {
      btn.addEventListener("click", function () {
        selectTariff(btn.getAttribute("data-tariff"));
      });
    });
  }

  function selectTariff(tariffId) {
    state.selectedTariff = tariffId;
    var select = document.getElementById("f-tariff");
    if (select) select.value = tariffId;
    track("select_tariff", { tariff_id: tariffId });
    document.getElementById("lead-form").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function formatPrice(sum) {
    return sum.toLocaleString("ru-RU").replace(/,/g, " ");
  }

  /* ---------------- render: coverage ---------------- */
  function renderCoverageFilters() {
    var select = document.getElementById("districtFilter");
    var current = select.value;
    var districts = uniqueDistricts();
    select.innerHTML = '<option value="">' + t("coverage.allDistricts") + '</option>' +
      districts.map(function (d) { return '<option value="' + escapeHtml(d) + '">' + escapeHtml(d) + '</option>'; }).join("");
    if (districts.indexOf(current) !== -1) select.value = current;
  }

  function uniqueDistricts() {
    var seen = {};
    var out = [];
    DATA.coverage.forEach(function (row) {
      var label = localizedField(row.district);
      if (!seen[label]) { seen[label] = true; out.push(label); }
    });
    return out;
  }

  function renderCoverageTable() {
    var tbody = document.getElementById("coverageBody");
    var filterValue = document.getElementById("districtFilter").value;
    var rows = DATA.coverage.filter(function (row) {
      return !filterValue || localizedField(row.district) === filterValue;
    });
    var noResults = document.getElementById("coverageNoResults");

    if (!rows.length) {
      tbody.innerHTML = "";
      noResults.hidden = false;
      return;
    }
    noResults.hidden = true;

    tbody.innerHTML = rows.map(function (row) {
      var objectLabel = localizedField(row.object);
      return (
        '<tr>' +
          '<td>' + escapeHtml(localizedField(row.district)) + '</td>' +
          '<td>' + escapeHtml(localizedField(row.street)) + '</td>' +
          '<td>' + escapeHtml(objectLabel) + '</td>' +
          '<td>' + escapeHtml(row.houses) + '</td>' +
          '<td><button type="button" class="row-cta js-coverage-connect" data-object="' + escapeHtml(objectLabel) + '" data-analytics="cta_click" data-cta-location="coverage_row">' + t("coverage.rowCta") + '</button></td>' +
        '</tr>'
      );
    }).join("");

    tbody.querySelectorAll(".js-coverage-connect").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var addressField = document.getElementById("f-address");
        addressField.value = btn.getAttribute("data-object");
        track("cta_click", { cta_location: "coverage_row" });
        document.getElementById("lead-form").scrollIntoView({ behavior: "smooth", block: "start" });
        addressField.focus({ preventScroll: true });
      });
    });

    var datalist = document.getElementById("coverageObjects");
    var seen = {};
    var options = [];
    DATA.coverage.forEach(function (row) {
      var label = localizedField(row.object);
      if (!seen[label]) { seen[label] = true; options.push(label); }
    });
    datalist.innerHTML = options.map(function (label) { return '<option value="' + escapeHtml(label) + '"></option>'; }).join("");
  }

  function renderTrustStats() {
    var wrap = document.getElementById("trustStats");
    wrap.innerHTML = DATA.trustStats.map(function (stat) {
      return '<div class="trust-stat"><p class="trust-stat__value">' + escapeHtml(stat.value) + '</p>' +
        '<p class="trust-stat__label">' + escapeHtml(localizedField(stat)) + '</p></div>';
    }).join("");
  }

  /* ---------------- render: steps ---------------- */
  function renderSteps() {
    var list = document.getElementById("stepsList");
    var items = t("steps.items") || [];
    list.innerHTML = items.map(function (item) {
      return '<li><h3>' + escapeHtml(item.title) + '</h3><p>' + escapeHtml(item.text) + '</p></li>';
    }).join("");
  }

  /* ---------------- render: faq ---------------- */
  function renderFaq() {
    var list = document.getElementById("faqList");
    var items = t("faq.items") || [];
    var openIndex = list.dataset.openIndex ? Number(list.dataset.openIndex) : null;
    list.innerHTML = items.map(function (item, i) {
      return (
        '<details class="faq__item"' + (openIndex === i ? " open" : "") + ' data-index="' + i + '">' +
          '<summary class="faq__question">' + escapeHtml(item.q) + '<span class="plus" aria-hidden="true"></span></summary>' +
          '<p class="faq__answer">' + escapeHtml(item.a) + '</p>' +
        '</details>'
      );
    }).join("");
    list.querySelectorAll(".faq__item").forEach(function (el) {
      el.addEventListener("toggle", function () {
        list.dataset.openIndex = el.open ? el.getAttribute("data-index") : "";
      });
    });
  }

  /* ---------------- footer / misc ---------------- */
  function renderFooterAddress() {
    document.getElementById("footerAddress").textContent = localizedField(DATA.contacts.address);
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* ---------------- full re-render on language change ---------------- */
  function renderAll() {
    document.documentElement.lang = state.lang;
    document.title = t("meta.title");
    var metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", t("meta.description"));

    applyTranslations(document);
    renderBenefits();
    renderTariffs();
    renderCoverageFilters();
    renderCoverageTable();
    renderTrustStats();
    renderSteps();
    renderFaq();
    renderFooterAddress();

    document.querySelectorAll(".lang-btn").forEach(function (btn) {
      btn.classList.toggle("is-active", btn.getAttribute("data-lang") === state.lang);
      btn.setAttribute("aria-pressed", btn.getAttribute("data-lang") === state.lang ? "true" : "false");
    });
  }

  /* ---------------- theme ---------------- */
  function applyTheme() {
    document.documentElement.setAttribute("data-theme", state.theme);
    document.querySelectorAll(".js-theme-toggle").forEach(function (toggle) {
      toggle.setAttribute("aria-pressed", state.theme === "dark" ? "true" : "false");
      toggle.setAttribute("aria-label", state.theme === "dark" ? t("header.themeToLight") : t("header.themeToDark"));
    });
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", state.theme === "dark" ? "#0F1236" : "#161A46");
  }

  /* ---------------- analytics (GTM/GA4 placeholders) ---------------- */
  function track(eventName, params) {
    var payload = Object.assign({ event: eventName, language: state.lang }, params || {});
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(payload);
    if (window.location.search.indexOf("debug=1") !== -1) {
      // eslint-disable-next-line no-console
      console.debug("[citynet:event]", payload);
    }
  }

  /* ---------------- phone normalization ---------------- */
  function normalizePhoneDigits(value) {
    return value.replace(/\D/g, "").slice(0, 9);
  }
  function formatPhoneDisplay(digits) {
    var parts = [digits.slice(0, 2), digits.slice(2, 5), digits.slice(5, 7), digits.slice(7, 9)];
    return parts.filter(Boolean).join(" ");
  }

  /* ---------------- form ---------------- */
  function setFieldError(fieldId, message) {
    var input = document.getElementById(fieldId);
    var error = document.getElementById("err-" + fieldId.replace("f-", ""));
    if (message) {
      input.classList.add("is-invalid");
      input.setAttribute("aria-invalid", "true");
      if (error) error.textContent = message;
    } else {
      input.classList.remove("is-invalid");
      input.removeAttribute("aria-invalid");
      if (error) error.textContent = "";
    }
  }

  function validateForm(form) {
    var errors = t("form.errors");
    var valid = true;
    var firstInvalid = null;

    var name = form.name.value.trim();
    if (name.length < 2 || name.length > 60) {
      setFieldError("f-name", errors.name); valid = false; firstInvalid = firstInvalid || "f-name";
    } else setFieldError("f-name", null);

    var phoneDigits = normalizePhoneDigits(form.phone.value);
    if (phoneDigits.length !== 9) {
      setFieldError("f-phone", errors.phone); valid = false; firstInvalid = firstInvalid || "f-phone";
    } else setFieldError("f-phone", null);

    var address = form.address.value.trim();
    if (address.length < 3) {
      setFieldError("f-address", errors.address); valid = false; firstInvalid = firstInvalid || "f-address";
    } else setFieldError("f-address", null);

    if (!form.consent.checked) {
      setFieldError("f-consent", errors.consent); valid = false; firstInvalid = firstInvalid || "f-consent";
    } else setFieldError("f-consent", null);

    if (firstInvalid) document.getElementById(firstInvalid).focus();
    return valid;
  }

  var hasStartedForm = false;
  var lastSubmitKey = null;

  function initForm() {
    var form = document.getElementById("leadForm");
    var status = document.getElementById("formStatus");
    var submitBtn = document.getElementById("submitBtn");
    var phoneField = document.getElementById("f-phone");

    phoneField.addEventListener("input", function () {
      var digits = normalizePhoneDigits(phoneField.value);
      phoneField.value = formatPhoneDisplay(digits);
    });

    form.addEventListener("input", function () {
      if (!hasStartedForm) { hasStartedForm = true; track("form_start"); }
    }, { once: false });

    form.addEventListener("submit", function (evt) {
      evt.preventDefault();
      status.hidden = true;
      status.className = "form-status";

      if (form.company.value) return; // honeypot tripped — silently drop

      if (!validateForm(form)) {
        track("form_error", { reason: "validation" });
        return;
      }

      var idempotencyKey = lastSubmitKey || (window.crypto && window.crypto.randomUUID ? window.crypto.randomUUID() : String(Date.now()));
      lastSubmitKey = idempotencyKey;

      var lead = {
        lead_id: idempotencyKey,
        name: form.name.value.trim(),
        phone: "+998" + normalizePhoneDigits(form.phone.value),
        address: form.address.value.trim(),
        tariff: form.tariff.value || null,
        language: state.lang,
        page_variant: "default",
        consent_version: "v1",
        idempotency_key: idempotencyKey,
        created_at: new Date().toISOString()
      };

      submitBtn.disabled = true;
      submitBtn.querySelector("span").textContent = t("form.sending");

      submitLead(lead)
        .then(function () {
          status.hidden = false;
          status.className = "form-status form-status--success";
          status.textContent = t("form.successTitle") + ". " + t("form.successText");
          track("generate_lead", { tariff_id: lead.tariff, form_id: "lead-form" });
          form.reset();
          hasStartedForm = false;
        })
        .catch(function () {
          status.hidden = false;
          status.className = "form-status form-status--error";
          status.textContent = t("form.errorText");
          track("form_error", { reason: "submit_failed" });
        })
        .finally(function () {
          submitBtn.disabled = false;
          submitBtn.querySelector("span").textContent = t("form.submit");
        });
    });
  }

  /**
   * Sends the lead to a real backend if window.CITYNET_LEAD_ENDPOINT is set.
   * Otherwise runs in DEMO mode (see file header) so the flow is reviewable
   * before CRM/server access is wired up per ТЗ section 7.
   */
  function submitLead(lead) {
    if (!LEAD_ENDPOINT) {
      return new Promise(function (resolve) { setTimeout(resolve, 500); });
    }
    return fetch(LEAD_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lead)
    }).then(function (res) {
      if (!res.ok) throw new Error("lead submit failed: " + res.status);
      return res.json().catch(function () { return {}; });
    });
  }

  /* ---------------- header / nav interactions ---------------- */
  function initHeaderInteractions() {
    var burger = document.getElementById("burgerBtn");
    var menu = document.getElementById("mobileMenu");
    burger.addEventListener("click", function () {
      var isOpen = burger.getAttribute("aria-expanded") === "true";
      burger.setAttribute("aria-expanded", String(!isOpen));
      menu.hidden = isOpen;
    });
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        burger.setAttribute("aria-expanded", "false");
        menu.hidden = true;
      });
    });

    document.querySelectorAll(".js-theme-toggle").forEach(function (toggle) {
      toggle.addEventListener("click", function () {
        state.theme = state.theme === "dark" ? "light" : "dark";
        safeSet(STORAGE_THEME, state.theme);
        applyTheme();
      });
    });

    document.querySelectorAll(".lang-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var lang = btn.getAttribute("data-lang");
        if (lang === state.lang) return;
        state.lang = lang;
        safeSet(STORAGE_LANG, lang);
        var status = document.getElementById("formStatus");
        status.hidden = true;
        status.textContent = "";
        renderAll();
      });
    });

    document.querySelectorAll('[data-analytics="cta_click"]').forEach(function (el) {
      el.addEventListener("click", function () {
        track("cta_click", { cta_location: el.getAttribute("data-cta-location") || "unknown" });
      });
    });
    document.querySelectorAll('[data-analytics="click_phone"]').forEach(function (el) {
      el.addEventListener("click", function () { track("click_phone"); });
    });
    document.querySelectorAll('[data-analytics="click_telegram"]').forEach(function (el) {
      el.addEventListener("click", function () { track("click_telegram"); });
    });
  }

  function initDistrictFilter() {
    document.getElementById("districtFilter").addEventListener("change", renderCoverageTable);
  }

  /* ---------------- boot ---------------- */
  document.addEventListener("DOMContentLoaded", function () {
    applyTheme();
    renderAll();
    initForm();
    initHeaderInteractions();
    initDistrictFilter();
    track("page_view", { page_variant: "default" });
  });
})();
