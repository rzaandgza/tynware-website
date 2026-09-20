document.addEventListener("DOMContentLoaded", () => {
  const config = window.TYNWARE_CONFIG || {};
  const legal = config.legal || {};
  const entityReady = Boolean(
    legal.entityName &&
    legal.registrationNumber &&
    legal.taxId &&
    legal.registeredOffice
  );

  document.querySelectorAll("[data-legal-entity]").forEach((el) => {
    el.textContent = entityReady ? legal.entityName : (config.brandName || "Tynware");
  });
  document.querySelectorAll("[data-legal-country]").forEach((el) => {
    el.textContent = legal.country || "Romania";
  });
  document.querySelectorAll("[data-legal-effective-date]").forEach((el) => {
    el.textContent = legal.effectiveDate || "";
  });
  document.querySelectorAll("[data-privacy-email]").forEach((el) => {
    const email = config.privacyEmail || config.supportEmail || "support@tynware.com";
    el.textContent = email;
    el.href = `mailto:${email}`;
  });

  document.querySelectorAll("[data-legal-details]").forEach((el) => {
    if (!entityReady) {
      el.hidden = true;
      return;
    }
    el.hidden = false;
    const fields = {
      entity: legal.entityName,
      registration: legal.registrationNumber,
      tax: legal.taxId,
      office: legal.registeredOffice,
      country: legal.country
    };
    Object.entries(fields).forEach(([key, value]) => {
      const target = el.querySelector(`[data-legal-${key}]`);
      if (target) target.textContent = value || "—";
    });
  });

  document.querySelectorAll("[data-legal-pending]").forEach((el) => {
    el.hidden = entityReady;
  });

  const products = Object.values(config.products || {});

  document.querySelectorAll("[data-product-privacy-grid]").forEach((el) => {
    el.innerHTML = products
      .filter((product) => product.privacySummary)
      .map((product) => `
        <article class="card">
          <h3>${product.name}</h3>
          <p>${product.privacySummary}</p>
        </article>`)
      .join("");
  });

  document.querySelectorAll("[data-product-terms-grid]").forEach((el) => {
    el.innerHTML = products
      .filter((product) => product.termsSummary)
      .map((product) => `
        <article class="card">
          <h3>${product.name}</h3>
          <p>${product.termsSummary}</p>
        </article>`)
      .join("");
  });
});
