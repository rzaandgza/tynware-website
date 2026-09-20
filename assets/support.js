function supportEscape(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function supportCode(value) {
  return `<code>${supportEscape(value)}</code>`;
}

document.addEventListener("DOMContentLoaded", () => {
  const config = window.TYNWARE_CONFIG || {};
  const products = config.products || {};

  document.querySelectorAll("[data-support-hub]").forEach((hub) => {
    hub.innerHTML = Object.values(products)
      .map((product) => `
        <article class="card product-card">
          <div class="tag">${supportEscape(product.category || "Tynware software")}</div>
          <div>
            <h2>${supportEscape(product.name)}</h2>
            <p>${supportEscape(product.supportSummary || "Product-specific installation and troubleshooting guidance.")}</p>
          </div>
          <div class="actions">
            <a class="btn primary" href="${supportEscape(product.supportUrl)}">${supportEscape(product.name)} Support</a>
          </div>
        </article>`)
      .join("");
  });

  const root = document.querySelector("[data-product-support]");
  if (!root) return;

  const key = root.dataset.productSupport;
  const product = config.products?.[key];
  if (!product) {
    root.innerHTML = '<div class="notice">Support information is not configured for this product yet.</div>';
    return;
  }

  document.title = `${product.name} Support — Tynware`;

  const heading = document.querySelector("[data-support-heading]");
  if (heading) heading.textContent = `${product.name} support`;

  const lede = document.querySelector("[data-support-lede]");
  if (lede) {
    lede.textContent = `Installation, recovery and troubleshooting guidance for ${product.name} ${product.version}.`;
  }

  const renderList = (items) => (items || [])
    .map((item) => `<li>${supportEscape(item)}</li>`)
    .join("");

  const requirements = renderList(product.systemRequirements);
  const beforeTroubleshooting = renderList(product.beforeTroubleshooting);
  const safeRecovery = renderList(product.safeRecovery);
  const installItems = renderList(product.installation);

  const troubleshootItems = product.troubleshooting
    .map((item) => `
      <details>
        <summary>${supportEscape(item.title)}</summary>
        <p>${supportEscape(item.text)}</p>
      </details>`)
    .join("");

  const diagnostics = product.diagnostics
    .map((item) => `<li>${supportEscape(item)}</li>`)
    .join("");

  const logRow = product.logPath
    ? `<div><dt>Diagnostic log</dt><dd>${supportCode(product.logPath)}</dd></div>`
    : "";

  root.innerHTML = `
    <section class="support-quick-grid">
      <article class="card">
        <p class="kicker">Current release</p>
        <h2>${supportEscape(product.name)} ${supportEscape(product.version)}</h2>
        <p>${supportEscape(product.platform)}</p>
        <p>${supportEscape(product.installScope)}</p>
      </article>
      <article class="card">
        <p class="kicker">Need a person?</p>
        <h2>Email support</h2>
        <p><a href="mailto:${supportEscape(config.supportEmail || "support@tynware.com")}">${supportEscape(config.supportEmail || "support@tynware.com")}</a></p>
        <p>Never send a full license key, password, payment-card data or unredacted customer data by email.</p>
      </article>
    </section>

    <section class="support-section">
      <p class="kicker">System requirements</p>
      <h2>Supported environment.</h2>
      <ul class="compact-list">${requirements}</ul>
      <div class="notice">${supportEscape(product.compatibilityNote || "")}</div>
    </section>

    <section class="support-section">
      <p class="kicker">Installation</p>
      <h2>Install safely.</h2>
      <ol class="steps-list">${installItems}</ol>
    </section>

    <section class="support-section">
      <p class="kicker">Before troubleshooting</p>
      <h2>Protect the data first.</h2>
      <ul class="compact-list">${beforeTroubleshooting}</ul>
    </section>

    <section class="support-section">
      <p class="kicker">Local files</p>
      <h2>Know where the application and your data live.</h2>
      <dl class="path-list">
        <div><dt>Application</dt><dd>${supportCode(product.installPath)}</dd></div>
        <div><dt>Business data</dt><dd>${supportCode(product.dataPath)}</dd></div>
        ${logRow}
        <div><dt>Backup format</dt><dd>${supportEscape(product.backupLabel)}</dd></div>
      </dl>
      <div class="notice">Business data is separate from the installed program files. Do not manually edit or replace the live database unless Tynware support specifically instructs you to do so.</div>
    </section>

    <section class="support-section">
      <p class="kicker">Troubleshooting</p>
      <h2>Start with the safe checks.</h2>
      <div class="faq">${troubleshootItems}</div>
    </section>

    <section class="support-section">
      <p class="kicker">Safe recovery</p>
      <h2>Recover without creating a second problem.</h2>
      <ul class="compact-list">${safeRecovery}</ul>
    </section>

    <section class="support-section">
      <p class="kicker">When contacting support</p>
      <h2>Send enough context, not sensitive data.</h2>
      <ul class="compact-list">${diagnostics}</ul>
      <div class="actions">
        <a class="btn primary" href="mailto:${supportEscape(config.supportEmail || "support@tynware.com")}">Email Tynware support</a>
        <a class="btn" href="${supportEscape(product.productUrl)}">Back to ${supportEscape(product.name)}</a>
      </div>
    </section>
  `;
});
