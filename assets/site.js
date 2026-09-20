window.TYNWARE_SITE = {
  tinyRentalCheckoutUrl: "",
  tinyRentalDownloadUrl: "",
  offerDeskCheckoutUrl: "",
  offerDeskDownloadUrl: "",
  supportEmail: "support@tynware.com"
};

function wireLink(selector, url, fallbackLabel) {
  document.querySelectorAll(selector).forEach((el) => {
    if (url) {
      el.href = url;
      el.classList.remove("disabled");
      el.removeAttribute("aria-disabled");
    } else {
      el.href = "#";
      el.classList.add("disabled");
      el.setAttribute("aria-disabled", "true");
      if (fallbackLabel) el.textContent = fallbackLabel;
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  wireLink("[data-checkout]", window.TYNWARE_SITE.tinyRentalCheckoutUrl, "Checkout coming soon");
  wireLink("[data-download]", window.TYNWARE_SITE.tinyRentalDownloadUrl, "Download coming soon");
  wireLink("[data-offerdesk-checkout]", window.TYNWARE_SITE.offerDeskCheckoutUrl, "Checkout coming soon");
  wireLink("[data-offerdesk-download]", window.TYNWARE_SITE.offerDeskDownloadUrl, "Download coming soon");

  document.querySelectorAll("[data-support-email]").forEach((el) => {
    el.textContent = window.TYNWARE_SITE.supportEmail;
    el.href = `mailto:${window.TYNWARE_SITE.supportEmail}`;
  });
});
