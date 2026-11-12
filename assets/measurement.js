(() => {
  "use strict";
  const config = window.TYNWARE_MEASUREMENT || {};
  const id = config.measurementId || "";
  // Preview deployments and localhost never send events to the production property.
  if (!/^G-[A-Z0-9]+$/.test(id) || !(config.productionHosts || []).includes(location.hostname)) return;

  const consentKey = "tynware.analytics-consent.v1";
  const lifetime = 180 * 24 * 60 * 60 * 1000;
  const disabledKey = `ga-disable-${id}`;
  let started = false;
  let preference = readPreference();
  let panel;
  let settingsButton;

  function readPreference() {
    try {
      const saved = JSON.parse(localStorage.getItem(consentKey));
      if (["granted", "denied"].includes(saved?.choice) && saved.expires > Date.now() && saved.expires <= Date.now() + lifetime) return saved.choice;
    } catch { /* Storage can be unavailable; default to no collection. */ }
    return null;
  }

  function pageUrl() {
    // Exclude arbitrary query strings, fragments, license keys and checkout details.
    const canonical = document.querySelector('link[rel="canonical"]');
    return canonical?.href || `${location.origin}${location.pathname}`;
  }

  function referrerOrigin() {
    try { return new URL(document.referrer).origin + "/"; } catch { return ""; }
  }

  function productFor(path) {
    if (/^\/(?:resources\/)?tynrent(?:\/|$)/.test(path)) return "tynrent";
    if (/^\/(?:resources\/)?offerdesk(?:\/|$)/.test(path)) return "offerdesk";
    return "";
  }

  function emit(name, params) {
    // Never buffer interactions that happened before consent.
    if (!started || preference !== "granted" || window[disabledKey]) return;
    window.gtag("event", name, {send_to: id, ...params});
  }

  function start() {
    if (started || preference !== "granted") return;
    started = true;
    window[disabledKey] = false;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("consent", "default", {
      analytics_storage: "denied", ad_storage: "denied",
      ad_user_data: "denied", ad_personalization: "denied"
    });
    window.gtag("consent", "update", {analytics_storage: "granted"});
    window.gtag("js", new Date());
    const domains = (config.checkoutDomains || []).filter((host) => /^[a-z0-9-]+\.lemonsqueezy\.com$/.test(host));
    if (domains.length) window.gtag("set", "linker", {domains, accept_incoming: false});
    window.gtag("config", id, {
      send_page_view: false,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      cookie_expires: lifetime / 1000,
      cookie_update: false,
      cookie_flags: "SameSite=Lax;Secure",
      page_location: pageUrl(),
      page_referrer: referrerOrigin()
    });
    const tag = document.createElement("script");
    tag.async = true;
    tag.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
    document.head.append(tag);
    emit("page_view", {page_location: pageUrl(), page_referrer: referrerOrigin(), page_title: document.title});
    const product = productFor(location.pathname);
    if (product && ["/tynrent/", "/offerdesk/"].includes(location.pathname)) {
      emit("view_item", {items: [{item_id: product, item_name: product === "tynrent" ? "TynRent" : "Offer Desk"}]});
    }
  }

  function clearAnalyticsCookies() {
    const domains = ["", location.hostname, "." + location.hostname, ".tynware.com"];
    document.cookie.split(";").forEach((entry) => {
      const name = entry.split("=")[0].trim();
      if (!/^_ga(?:_|$)/.test(name)) return;
      domains.forEach((domain) => {
        document.cookie = `${name}=; Max-Age=0; path=/;${domain ? ` domain=${domain};` : ""} SameSite=Lax; Secure`;
      });
    });
  }

  function choose(choice) {
    preference = choice;
    try { localStorage.setItem(consentKey, JSON.stringify({choice, expires: Date.now() + lifetime})); } catch { /* Use in-memory preference for this page. */ }
    panel.hidden = true;
    settingsButton.focus({preventScroll: true});
    if (choice === "granted") start();
    else {
      window[disabledKey] = true;
      clearAnalyticsCookies();
      // Unload the library and its automatic session/engagement listeners on withdrawal.
      if (started) location.reload();
    }
  }

  function init() {
    panel = document.createElement("section");
    panel.className = "analytics-choice";
    panel.setAttribute("aria-labelledby", "analytics-choice-title");
    panel.hidden = Boolean(preference);
    panel.innerHTML = '<div class="analytics-choice-copy"><h2 id="analytics-choice-title">Your privacy choices</h2><p>With your permission, we use Google Analytics to understand visits, downloads and clicks toward checkout. Optional analytics stays off until you accept. You can change your choice at any time. <a href="/privacy#website-analytics">Privacy details</a></p></div><div class="analytics-choice-actions"><button type="button" class="btn" data-analytics-reject>Reject analytics</button><button type="button" class="btn" data-analytics-accept>Accept analytics</button><button type="button" class="analytics-choice-close" hidden>Keep current choice</button></div>';
    panel.querySelector("[data-analytics-reject]").addEventListener("click", () => choose("denied"));
    panel.querySelector("[data-analytics-accept]").addEventListener("click", () => choose("granted"));
    panel.querySelector(".analytics-choice-close").addEventListener("click", () => { panel.hidden = true; settingsButton.focus({preventScroll: true}); });
    document.body.append(panel);
    settingsButton = document.createElement("button");
    settingsButton.type = "button";
    settingsButton.className = "analytics-settings";
    settingsButton.textContent = "Privacy choices";
    settingsButton.addEventListener("click", () => {
      panel.hidden = false;
      panel.querySelector(".analytics-choice-close").hidden = !preference;
      panel.querySelector("[data-analytics-reject]").focus({preventScroll: true});
    });
    (document.querySelector(".footer-links") || document.querySelector("footer") || document.body).append(settingsButton);
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && preference && !panel.hidden) {
        panel.hidden = true;
        settingsButton.focus({preventScroll: true});
      }
    });
    document.addEventListener("click", (event) => {
      if (event.defaultPrevented || event.button !== 0) return;
      const link = event.target.closest?.("a[href]");
      if (!link || link.closest("[hidden]") || link.getAttribute("aria-disabled") === "true" || link.classList.contains("disabled")) return;
      const url = new URL(link.href, location.origin);
      if (!["https:", "http:"].includes(url.protocol) || link.getAttribute("href").startsWith("#")) return;
      const checkout = link.hasAttribute("data-checkout") || link.hasAttribute("data-offerdesk-checkout");
      const download = link.hasAttribute("data-download") || link.hasAttribute("data-offerdesk-download");
      const product = link.hasAttribute("data-offerdesk-checkout") || link.hasAttribute("data-offerdesk-download") ? "offerdesk" : "tynrent";
      // No full destination URLs: checkout URLs can contain customer or license data.
      if (checkout) emit("checkout_click", {product_id: product});
      else if (download) emit("download_click", {product_id: product});
      else if (url.origin === location.origin && /^(?:\/assets\/(?:examples|templates)\/|\/resources\/tynrent\/equipment-rental-spreadsheet-template\/)/.test(url.pathname) && /\.(pdf|csv|xlsx)$/.test(url.pathname)) {
        emit("resource_download", {product_id: productFor(location.pathname) || "general", resource_name: url.pathname.split("/").pop()});
      } else if (url.origin === location.origin && ["/tynrent/", "/offerdesk/"].includes(url.pathname)) {
        emit("product_click", {product_id: productFor(url.pathname)});
      }
      // Do not prevent navigation, rewrite commerce URLs or infer a purchase from a click.
    });
    start();
  }

  window.addEventListener("storage", (event) => {
    if (event.key !== consentKey && event.key !== null) return;
    preference = readPreference();
    if (preference !== "granted") {
      window[disabledKey] = true;
      clearAnalyticsCookies();
      if (started) location.reload();
    } else start();
    if (panel) panel.hidden = Boolean(preference);
  });
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
